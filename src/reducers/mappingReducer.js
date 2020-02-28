import {
    LOAD_ALL_MAPPINGS_SUCCESS, 
  } from "../actions/actions";
  
  const initialState = {
    data:{

    },
    
  };
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case LOAD_ALL_MAPPINGS_SUCCESS:
        return {
          ...state,
          data: action.payload,
        };
          
      default:
        return state;
    }
  };
  