import {
  USER_SETTING_UPDATE_MODE,
  USER_SETTING_UPDATE_SUCCESS
} from "../actions/actions";

const initialState = {
  mode: "light",
  layout: "standard",
  jsonTheme: "rjv",
  jsonEditTheme: "",
  contexts: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case USER_SETTING_UPDATE_MODE:
      return {
        ...state,
        mode: action.payload
      };
    case USER_SETTING_UPDATE_SUCCESS:
      if (action.payload) {
         console.log("update success, payload", action.payload);
        return {
          ...state,
          ...action.payload.userSettings
        };
      }
    default:
      return state;
  }
};
