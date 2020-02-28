import {
  BACK_TO_DEFAULT_CONTEXT, SWITCH_TO_NEW_CONTEXT, 
  } from "../actions/actions";
  
  const initialState = null;
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case BACK_TO_DEFAULT_CONTEXT:
        return null;
      case SWITCH_TO_NEW_CONTEXT:
        return action.payload; 
          
      default:
        return state;
    }
  };
  