import ReactDOM from 'react-dom';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { message as Message, Modal, Spin } from 'antd';
import qs from 'qs';
import axios from 'axios';
import { isBrowser } from 'umi';
import { parse, compile } from 'path-to-regexp';
import { cloneDeep, transform } from 'lodash';
import { logout, parseJson } from '@/utils';

declare global {
  interface Window {
    cancelRequest: any;
  }
}

let requestCount = 0;

// 显示loading
function showLoading() {
  if (requestCount === 0) {
    var dom = document.createElement('div');
    dom.setAttribute('id', 'loading');
    document.body.appendChild(dom);
    ReactDOM.render(<Spin tip="正在加载中，请稍后..." size="large" />, dom);
  }
  requestCount++;
}
function hideLoading() {
  requestCount--;
  if (requestCount === 0) {
    const dom = document.getElementById('loading');
    dom && document.body.removeChild(dom);
  }
}

const { CancelToken } = axios;
const CANCEL_REQUEST_MESSAGE = 'cancel request';
const ERROR_CODE = {
  '401': '认证失败，无法访问系统资源',
  '403': '当前操作没有权限',
  '404': '访问资源不存在',
  default: '系统未知错误,请反馈给管理员',
};
const config = {
  isSuccess: (data) => data?.code == 0,
  domain: process.env.API,
};
if (isBrowser()) {
  window.cancelRequest = new Map();
}

const ErrorModal = (title) => Message.error(title);

export const setConfig = (options) => Object.assign(config, options);
export const isSuccess = (data) => config.isSuccess(data);
const unAuthCodes = [401, 114, 110, 101];

export default function http(options) {
  const { data, method = 'get', ignoreErrorModal, loading } = options;
  let { url } = options;
  const params = data
    ? transform(
        data,
        (result, value, key) => {
          // 过滤为空的参数
          if (value !== undefined && value !== null) {
            result[key] = value;
          }
        },
        {},
      )
    : data;

  const cloneData = cloneDeep(data);

  try {
    let domain = options.domain || config.domain;
    const urlMatch = url.match(/[a-zA-z]+:\/\/[^/]*/);
    if (urlMatch) {
      [domain] = urlMatch;
      url = url.slice(domain.length);
    }

    const match = parse(url);
    url = compile(url)(data);

    for (const item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name];
      }
    }
    url = domain + url;
  } catch (e: any) {
    ErrorModal(e?.message ||'');
  }
  options.url =
    method.toLocaleLowerCase() === 'get'
      ? `${url}?${qs.stringify({
          ...cloneData,
          _: Date.now(),
        })}`
      : url;
  options.data = params;
  const userInfo = parseJson(localStorage.getItem('userInfo'));
  options.headers = {
    token: userInfo.token,
    ...options.headers,
  };
  options.cancelToken = new CancelToken((cancel) => {
    window.cancelRequest.set(Symbol(Date.now()), {
      pathname: window.location.pathname,
      cancel,
    });
  });

  loading && showLoading();

  return axios(options)
    .then((response) => {
      const { data = {} } = response;
      const { code = 0, msg } = data;
      const message = ERROR_CODE[String(code)] || msg || ERROR_CODE['default'];

      loading && hideLoading();

      if (data instanceof window.Blob) {
        return Promise.resolve(data);
      }
      if (unAuthCodes.includes(code)) {
        Modal.confirm({
          title: '系统提示',
          content: '登录已过期，请重新登录',
          icon: <ExclamationCircleOutlined />,
          okText: '重新登录',
          cancelText: '取消',
          onOk() {
            logout();
          },
        });
      }
      if (!config.isSuccess(data)) {
        !ignoreErrorModal && ErrorModal(message);
        return Promise.reject({
          success: false,
          message,
          ...data,
        });
      }
      return Promise.resolve(data.content);
    })
    .catch((error) => {
      loading && hideLoading();
      const { message, response } = error;
      const { code } = response?.data || {};
      if (unAuthCodes.includes(code)) {
        Modal.confirm({
          title: '系统提示',
          content: '登录已过期，请重新登录',
          icon: <ExclamationCircleOutlined />,
          okText: '重新登录',
          cancelText: '取消',
          onOk() {
            logout();
          },
        });
      }
      if (`${message}` === CANCEL_REQUEST_MESSAGE) {
        return {
          success: false,
        };
      }
      let msg;
      let statusCode;
      let data;
      if (response && response instanceof Object) {
        const { statusText } = response;
        data = response.data;
        statusCode = response.code;
        msg = data.msg || statusText;
      } else {
        data = { ...error, message: undefined, success: undefined };
        statusCode = 600;
        msg = error.msg || '服务器错误，请稍后重试';
      }

      !ignoreErrorModal && ErrorModal(msg);

      return Promise.reject({
        success: false,
        statusCode,
        message: msg,
        originData: data,
      });
    });
}
