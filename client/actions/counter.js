export const setpath = (path) => {
  return {
    type: 'SET',
    payload: path,
  };
};
export const back = (path) => {
  return {
    type: 'BACK',
    payload: path,
  };
};
