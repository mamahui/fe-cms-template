import { message } from 'antd';
import React, { useState } from 'react';

const DefaultMsg = { failMsg: '操作失败', successMsg: '操作成功' };

type MsgType = boolean | typeof DefaultMsg;

type ServiceOptions<T = any> = Partial<{
  showMsg: MsgType;
  onSuccess: (data: T, ...args) => void;
  initialState: T;
  options: Record<string, any>;
  params: any;
  autoRun: boolean;
}>;

function resolveMsg(showMsg: MsgType): typeof DefaultMsg | undefined {
  if (typeof showMsg === 'object') {
    return { ...DefaultMsg, ...showMsg };
  }

  return showMsg ? DefaultMsg : undefined;
}

const DefaultOpt: ServiceOptions = {
  showMsg: false,
  initialState: {},
  options: {},
  autoRun: false,
};

type Api<T = any> = (...args) => T | Promise<T>;
export function useService<T>(api: (...args) => T | Promise<T>, opt: ServiceOptions<T> = {}) {
  const mergedOpt = { ...DefaultOpt, ...opt };
  const { autoRun, params, showMsg, initialState, onSuccess, options = {} } = mergedOpt;
  const [state, setData] = useState<T>(initialState || ({} as T));
  const [loading, setLoading] = useState<boolean>(false);
  const resolvedMsg = showMsg && resolveMsg(showMsg);
  const run = async (runParams, option?) => {
    const defaultOptions = {
      loading : true,
    }
    const finalOptions = {
      ...defaultOptions,
      ...option,
    }
    let data: T;
    try {
      setLoading(true);
      data = await api(runParams, finalOptions);
      setData(data);
      setLoading(false);
      onSuccess && onSuccess(data, ...runParams);
      resolvedMsg && message.success(resolvedMsg.successMsg);
      return data;
    } catch (e) {
      data = state;
      resolvedMsg && message.success(resolvedMsg.failMsg);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (autoRun) {
      run(params, options);
    }
  }, []);

  return {
    run,
    loading,
    data: state,
  };
}

type ApiArr = [Api, ServiceOptions];
type Apis = Array<Api | ApiArr>;

export function useServiceList(apis: Apis, opt: ServiceOptions) {
  const serviceMap = apis.map((curApi) => {
    if (Array.isArray(curApi)) {
      const [api, curServiceOpt] = (curApi as unknown) as ApiArr;
      return useService(api, {
        ...opt,
        ...curServiceOpt,
      });
    }
    return useService(curApi as Api, {
      ...opt,
    });
  });

  return serviceMap;
}
