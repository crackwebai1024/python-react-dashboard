export function MainReducer(state: any, action: any) {
  switch (action.type) {
    case "USER_LOGGED_IN": {
      return {
        ...state,
        accessToken: action.payload.accessToken
      };
    }
    case "USER_LOGGED_OUT": {
      return {
        ...state,
        accessToken: null
      };
    }
    default: {
      return state;
    }
  }
}
