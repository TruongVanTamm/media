export const pathname = (state = ' ', action) => {
  switch (action.type) {
    case 'SET':
      return state.replaceAll('/media', '') +'/' + action.payload ;
    case 'BACK':
      return action.payload;
    default:
      return state;
  }
};

export default pathname;
