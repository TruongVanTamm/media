import React from 'react';
import store from '../store/store';

const Test = () => {
  const pathname = store.getState().pathname
  return <div>{pathname}</div>;
};

export default Test;
