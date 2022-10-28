import { http } from '@/core';
import api from './api';

const gen = (params, opts = {}) => {
  let url = params;
  let method = 'POST';
  const paramsArray = params.split(' ');

  if (paramsArray.length === 2) {
    [method, url] = paramsArray;
  }

  return (data = {}, options) =>
    http({
      url,
      data,
      method,
      headers: {},
      ...opts,
      ...options,
    });
};

type APIS = {
  [key in keyof typeof api]: (
    params?: any,
    options?: any,
  ) => Promise<any>;
};
const APIFunction: APIS = {} as APIS;

Object.keys(api).forEach((key) => {
  APIFunction[key] = gen( api[key]);
});

export default APIFunction;
