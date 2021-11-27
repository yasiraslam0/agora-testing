"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultState = exports.reducer = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var readDefaultState = function readDefaultState() {
  try {
    return JSON.parse(window.sessionStorage.getItem('custom_storage'));
  } catch (err) {
    return {};
  }
};

var defaultState = {
  // loading effect
  loading: false,
  // media devices
  streams: [],
  localStream: null,
  currentStream: null,
  otherStreams: [],
  devicesList: [],
  // web sdk params
  config: _objectSpread({
    uid: 0,
    host: true,
    channelName: '',
    token: process.env.REACT_APP_AGORA_APP_TOKEN,
    resolution: '480p'
  }, readDefaultState(), {
    microphoneId: '',
    cameraId: ''
  }),
  agoraClient: null,
  mode: 'live',
  codec: 'vp8',
  muteVideo: true,
  muteAudio: true,
  screen: false,
  profile: false // beauty: false

};
exports.defaultState = defaultState;

var reducer = function reducer(state, action) {
  switch (action.type) {
    case 'config':
      {
        return _objectSpread({}, state, {
          config: action.payload
        });
      }

    case 'client':
      {
        return _objectSpread({}, state, {
          client: action.payload
        });
      }

    case 'loading':
      {
        return _objectSpread({}, state, {
          loading: action.payload
        });
      }

    case 'codec':
      {
        return _objectSpread({}, state, {
          codec: action.payload
        });
      }

    case 'video':
      {
        return _objectSpread({}, state, {
          muteVideo: action.payload
        });
      }

    case 'audio':
      {
        return _objectSpread({}, state, {
          muteAudio: action.payload
        });
      }

    case 'screen':
      {
        return _objectSpread({}, state, {
          screen: action.payload
        });
      }

    case 'devicesList':
      {
        return _objectSpread({}, state, {
          devicesList: action.payload
        });
      }

    case 'localStream':
      {
        return _objectSpread({}, state, {
          localStream: action.payload
        });
      }

    case 'profile':
      {
        return _objectSpread({}, state, {
          profile: action.payload
        });
      }

    case 'currentStream':
      {
        var streams = state.streams;
        var newCurrentStream = action.payload;
        var otherStreams = streams.filter(function (it) {
          return it.getId() !== newCurrentStream.getId();
        });
        return _objectSpread({}, state, {
          currentStream: newCurrentStream,
          otherStreams: otherStreams
        });
      }

    case 'addStream':
      {
        var _streams = state.streams,
            currentStream = state.currentStream;
        var newStream = action.payload;
        var _newCurrentStream = currentStream;

        if (!_newCurrentStream) {
          _newCurrentStream = newStream;
        }

        if (_streams.length === 4) return _objectSpread({}, state);
        var newStreams = [].concat(_toConsumableArray(_streams), [newStream]);

        var _otherStreams = newStreams.filter(function (it) {
          return it.getId() !== _newCurrentStream.getId();
        });

        return _objectSpread({}, state, {
          streams: newStreams,
          currentStream: _newCurrentStream,
          otherStreams: _otherStreams
        });
      }

    case 'removeStream':
      {
        var _streams2 = state.streams,
            _currentStream = state.currentStream;
        var stream = action.stream,
            uid = action.uid;
        var targetId = stream ? stream.getId() : uid;
        var _newCurrentStream2 = _currentStream;

        var _newStreams = _streams2.filter(function (stream) {
          return stream.getId() !== targetId;
        });

        if (_currentStream && targetId === _currentStream.getId()) {
          if (_newStreams.length === 0) {
            _newCurrentStream2 = null;
          } else {
            _newCurrentStream2 = _newStreams[0];
          }
        }

        var _otherStreams2 = _newCurrentStream2 ? _newStreams.filter(function (it) {
          return it.getId() !== _newCurrentStream2.getId();
        }) : [];

        return _objectSpread({}, state, {
          streams: _newStreams,
          currentStream: _newCurrentStream2,
          otherStreams: _otherStreams2
        });
      }

    case 'clearAllStream':
      {
        // const {streams, localStream, currentStream, beauty} = state;
        var _streams3 = state.streams,
            localStream = state.localStream,
            _currentStream2 = state.currentStream;

        _streams3.forEach(function (stream) {
          if (stream.isPlaying()) {
            stream.stop();
          } // stream.close();

        });

        if (localStream) {
          localStream.isPlaying() && localStream.stop();
          localStream.close();
        }

        if (_currentStream2) {
          _currentStream2.isPlaying() && _currentStream2.stop();

          _currentStream2.close();
        }

        return _objectSpread({}, state, {
          currentStream: null,
          localStream: null,
          streams: []
        });
      }
    // case 'enableBeauty': {
    //   return {
    //     ...state,
    //     beauty: action.enable
    //   }
    // }

    default:
      throw new Error('mutation type not defined');
  }
};

exports.reducer = reducer;