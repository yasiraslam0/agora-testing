"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _agoraRtcSdk = _interopRequireDefault(require("agora-rtc-sdk"));

var _events = _interopRequireDefault(require("events"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var appID = process.env.REACT_APP_AGORA_APP_ID;
console.log('agora sdk version: ' + _agoraRtcSdk["default"].VERSION + ' compatible: ' + _agoraRtcSdk["default"].checkSystemRequirements());

var RTCClient =
/*#__PURE__*/
function () {
  function RTCClient() {
    _classCallCheck(this, RTCClient);

    this._client = null;
    this._joined = false;
    this._localStream = null; // this._enableBeauty = false;

    this._params = {};
    this._uid = 0;
    this._eventBus = new _events["default"]();
    this._showProfile = false;
    this._subscribed = false;
    this._created = false;
  }

  _createClass(RTCClient, [{
    key: "createClient",
    value: function createClient(data) {
      this._client = _agoraRtcSdk["default"].createClient({
        mode: data.mode,
        codec: data.codec
      });
      return this._client;
    }
  }, {
    key: "closeStream",
    value: function closeStream() {
      if (this._localStream.isPlaying()) {
        this._localStream.stop();
      }

      this._localStream.close();
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this._created = false;
      this._client = null;
    }
  }, {
    key: "on",
    value: function on(evt, callback) {
      var customEvents = ['localStream-added', 'screenShare-canceled'];

      if (customEvents.indexOf(evt) !== -1) {
        this._eventBus.on(evt, callback);

        return;
      }

      this._client.on(evt, callback);
    }
  }, {
    key: "setClientRole",
    value: function setClientRole(role) {
      this._client.setClientRole(role);
    }
  }, {
    key: "createRTCStream",
    value: function createRTCStream(data) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this._uid = _this._localStream ? _this._localStream.getId() : data.uid;

        if (_this._localStream) {
          _this.unpublish();

          _this.closeStream();
        } // create rtc stream


        var rtcStream = _agoraRtcSdk["default"].createStream({
          streamID: _this._uid,
          audio: true,
          video: true,
          screen: false,
          microphoneId: data.microphoneId,
          cameraId: data.cameraId
        });

        if (data.resolution && data.resolution !== 'default') {
          rtcStream.setVideoProfile(data.resolution);
        } // init local stream


        rtcStream.init(function () {
          _this._localStream = rtcStream;

          _this._eventBus.emit('localStream-added', {
            stream: _this._localStream
          });

          if (data.muteVideo === false) {
            _this._localStream.muteVideo();
          }

          if (data.muteAudio === false) {
            _this._localStream.muteAudio();
          } // if (data.beauty === true) {
          //   this._localStream.setBeautyEffectOptions(true, {
          //     lighteningContrastLevel: 1,
          //     lighteningLevel: 0.7,
          //     smoothnessLevel: 0.5,
          //     rednessLevel: 0.1
          //   })
          //   this._enableBeauty = true;
          // }


          resolve();
        }, function (err) {
          reject(err); // Toast.error("stream init failed, please open console see more detail");

          console.error('init local stream failed ', err);
        });
      });
    }
  }, {
    key: "createScreenSharingStream",
    value: function createScreenSharingStream(data) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        // create screen sharing stream
        _this2._uid = _this2._localStream ? _this2._localStream.getId() : data.uid;

        if (_this2._localStream) {
          _this2._uid = _this2._localStream.getId();

          _this2.unpublish();
        }

        var screenSharingStream = _agoraRtcSdk["default"].createStream({
          streamID: _this2._uid,
          audio: true,
          video: false,
          screen: true,
          microphoneId: data.microphoneId,
          cameraId: data.cameraId
        });

        if (data.resolution && data.resolution !== 'default') {
          screenSharingStream.setScreenProfile("".concat(data.resolution, "_1"));
        }

        screenSharingStream.on('stopScreenSharing', function (evt) {
          _this2._eventBus.emit('stopScreenSharing', evt);

          _this2.closeStream();

          _this2.unpublish();
        }); // init local stream

        screenSharingStream.init(function () {
          _this2.closeStream();

          _this2._localStream = screenSharingStream; // run callback

          _this2._eventBus.emit('localStream-added', {
            stream: _this2._localStream
          });

          resolve();
        }, function (err) {
          _this2.publish();

          reject(err);
        });
      });
    }
  }, {
    key: "subscribe",
    value: function subscribe(stream, callback) {
      this._client.subscribe(stream, callback);
    }
  }, {
    key: "_createTmpStream",
    value: function _createTmpStream() {
      var _this3 = this;

      this._uid = 0;
      return new Promise(function (resolve, reject) {
        if (_this3._localStream) {
          _this3._localStream.close();
        } // create rtc stream


        var _tmpStream = _agoraRtcSdk["default"].createStream({
          streamID: _this3._uid,
          audio: true,
          video: true,
          screen: false
        }); // init local stream


        _tmpStream.init(function () {
          _this3._localStream = _tmpStream;
          resolve();
        }, function (err) {
          reject(err); // Toast.error("stream init failed, please open console see more detail");

          console.error('init local stream failed ', err);
        });
      });
    }
  }, {
    key: "getDevices",
    value: function getDevices() {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        if (!_this4._client) {
          _this4.createClient({
            codec: 'vp8',
            mode: 'live'
          });
        }

        _this4._createTmpStream().then(function () {
          _agoraRtcSdk["default"].getDevices(function (devices) {
            _this4._localStream.close();

            resolve(devices);
          });
        });
      });
    }
  }, {
    key: "setStreamFallbackOption",
    value: function setStreamFallbackOption(stream, type) {
      this._client.setStreamFallbackOption(stream, type);
    }
  }, {
    key: "enableDualStream",
    value: function enableDualStream() {
      var _this5 = this;

      return new Promise(function (resolve, reject) {
        _this5._client.enableDualStream(resolve, reject);
      });
    }
  }, {
    key: "setRemoteVideoStreamType",
    value: function setRemoteVideoStreamType(stream, streamType) {
      this._client.setRemoteVideoStreamType(stream, streamType);
    }
  }, {
    key: "join",
    value: function join(data) {
      var _this6 = this;

      this._joined = 'pending';
      return new Promise(function (resolve, reject) {
        /**
         * A class defining the properties of the config parameter in the createClient method.
         * Note:
         *    Ensure that you do not leave mode and codec as empty.
         *    Ensure that you set these properties before calling Client.join.
         *  You could find more detail here. https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.clientconfig.html
         **/
        _this6._params = data; // handle AgoraRTC client event
        // this.handleEvents();
        // init client

        _this6._client.init(appID, function () {
          /**
           * Joins an AgoraRTC Channel
           * This method joins an AgoraRTC channel.
           * Parameters
           * tokenOrKey: string | null
           *    Low security requirements: Pass null as the parameter value.
           *    High security requirements: Pass the string of the Token or Channel Key as the parameter value. See Use Security Keys for details.
           *  channel: string
           *    A string that provides a unique channel name for the Agora session. The length must be within 64 bytes. Supported character scopes:
           *    26 lowercase English letters a-z
           *    26 uppercase English letters A-Z
           *    10 numbers 0-9
           *    Space
           *    "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", "{", "}", "|", "~", ","
           *  uid: number | null
           *    The user ID, an integer. Ensure this ID is unique. If you set the uid to null, the server assigns one and returns it in the onSuccess callback.
           *   Note:
           *      All users in the same channel should have the same type (number) of uid.
           *      If you use a number as the user ID, it should be a 32-bit unsigned integer with a value ranging from 0 to (232-1).
           **/
          _this6._client.join(data.token ? data.token : null, data.channel, data.uid ? +data.uid : null, function (uid) {
            _this6._uid = uid; // Toast.notice("join channel: " + data.channel + " success, uid: " + uid);

            console.log('join channel: ' + data.channel + ' success, uid: ' + uid);
            _this6._joined = true;
            data.uid = uid;

            if (data.host) {
              _this6.createRTCStream(data).then(function () {
                _this6.enableDualStream().then(function () {
                  _this6.setRemoteVideoStreamType(_this6._localStream, 0);

                  resolve(data.uid);
                })["catch"](function (err) {
                  reject(err);
                });
              })["catch"](function (err) {
                reject(err);
              });
            } else {
              resolve();
            }
          }, function (err) {
            _this6._joined = false;
            reject(err);
            console.error('client join failed', err);
          });
        }, function (err) {
          _this6._joined = false;
          reject(err);
          console.error(err);
        });
      });
    }
  }, {
    key: "publish",
    value: function publish() {
      // publish localStream
      this._client.publish(this._localStream, function (err) {
        console.error(err);
      });
    }
  }, {
    key: "unpublish",
    value: function unpublish() {
      if (!this._client) {
        return;
      }

      this._client.unpublish(this._localStream, function (err) {
        console.error(err);
      });
    }
  }, {
    key: "leave",
    value: function leave() {
      var _this7 = this;

      return new Promise(function (resolve) {
        if (!_this7._client) return resolve(); // leave channel

        _this7._client.leave(function () {
          _this7._joined = false;

          _this7.destroy(); // if (this._localStream && this._enableBeauty) {
          //   this._localStream.setBeautyEffectOptions(false);
          // }


          resolve();
        }, function (err) {
          console.log('channel leave failed');
          console.error(err);
        });
      });
    }
  }]);

  return RTCClient;
}();

exports["default"] = RTCClient;