export const initialValue = { number: 'one' };

export const sideReducer = (state, action) => {
  switch (action.type) {
    case "a":
      return {
        ...state,
        number: 'one'
      };
      break;
    case "b":
      return {
        ...state,
        number: 'two'
      };
      break;
    case "c":
      return {
        ...state,
        number: 'three'
      }
    default:
      return state;
  }
};