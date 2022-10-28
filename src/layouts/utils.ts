import { pathToRegexp } from 'path-to-regexp';
import { IRoute } from 'umi';

export const findRoute = (path: string, routes: IRoute[] = []) => {
  let result;
  routes.forEach((route) => {
    if (route.exact) {
      if (route.path && pathToRegexp(route.path).exec(path)) {
        result = route;
        return;
      }
    }

    if (!result) {
      result = findRoute(path, route.routes);
    }
  });

  return result;
};

export const checkPage = (authority, path = window.location.pathname) => {
  const { routes } = authority;
  const route = findRoute(path, routes);
  // 暂时没有配置权限
  if (!route?.component.authConfig) {
    return true;
  }

  return authority.checkPage();
};
