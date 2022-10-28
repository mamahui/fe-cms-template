import * as React from 'react';
import api from '@/service';

interface Services {
  [serviceName: string]: any;
}

declare type ServiceName = keyof Services;

declare type Dispatch<T = any> = (
  serviceName: ServiceName,
  params?: any,
  options?: any,
) => Promise<T>;

declare type Loading = {
  [name in ServiceName]: boolean;
};

function useApi(services: Services = api): [Dispatch, Loading] {
  const [loading, setLoading] = React.useState({});

  const dispatch = async (
    serviceName: ServiceName,
    params?: any,
    options?: any,
  ) => {
    let fetchData;
    const dispatchAction = services[serviceName];
    try {
      setLoading({
        ...loading,
        [serviceName]: true,
      });
      fetchData = await dispatchAction(params, { ...options });
      return fetchData;
    } finally {
      setLoading({
        ...loading,
        [serviceName]: false,
      });
    }
  };

  return [dispatch, loading];
}

export default useApi;
