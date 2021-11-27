"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _styles = require("@material-ui/core/styles");

var _default = (0, _styles.createMuiTheme)({
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, \\"Segoe UI\\", \\"Roboto\\", \\"Oxygen\\", \\"Ubuntu\\", \\"Cantarell\\", \\"Fira Sans\\", \\"Droid Sans\\", \\"Helvetica Neue\\", sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    color: '#333'
  },
  overrides: {
    // MuiSnackbar: {
    //   root: {
    //     top: '100px',
    //     position: 'absolute'
    //   }
    // },
    MuiFormControl: {
      root: {
        margin: '0.3rem 0'
      }
    },
    // MuiInputLabel: {
    //   root: {
    //     "&$focused": {
    //       color: "#44a2fc"
    //     }
    //   },
    // },
    MuiInput: {
      // root: {
      //   '&$focused': {
      //     color: "#44a2fc"
      //   }
      // },
      underline: {
        '&:before': {
          borderBottom: '1px solid #EAEAEA'
        },
        '&:hover:not($disabled):not($focused):not($error):before': {
          borderBottom: '2px solid #EAEAEA'
        },
        '&$focused': {
          '&:after': {
            borderBottom: '2px solid #44a2fc'
          }
        } // root: {
        // backgroundColor: '#44a2fc',
        // borderBottom: '1px solid red'
        // }

      }
    }
  }
});

exports["default"] = _default;