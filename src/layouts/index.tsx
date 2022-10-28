import moment from 'moment';
import { useEffect, useMemo } from 'react';
import { Redirect } from 'umi'

import { Layout as HLayout, ConfigProvider } from '@suze/components';
import { SettingFilled } from '@ant-design/icons';

import zhCN from 'antd/es/locale-provider/zh_CN';

import { MENUS, suzeConfig } from '@/config';
import { LOGO_PATH, SITE_NAME, RESET_URL, DATE_FORMAT, Paths } from '@/constants';
import { KPrompt } from '@/components';
import { parseJson, logout } from '@/utils'

const alonePages = ['/login', '/403', '/404']
// 为menu添加唯一key，避免渲染引起key冲突
const addKeyToMenus = (menus) => {
  return menus.map((menu) => {
    return {
      ...menu,
      key: menu.key || menu.path,
      items: menu.children ? addKeyToMenus(menu.children) : [],
    };
  });
};

function Layout(props) {
  const { children, location, history } = props;
  const { pathname } = location;
  const { name, token } = parseJson(window.localStorage.getItem('userInfo'));
  const realMenus = useMemo(() => addKeyToMenus(MENUS), [MENUS]);

  useEffect(() => {
    if (pathname === Paths.Login) {
      if (token) {
        history.replace(Paths.DASHBOARD);
      }
    }
    const hasPaths = Object.keys(Paths).some((key) => Paths[key] === pathname);
    if (!token) {
      history.push('/login');
    } else if (pathname === '/') {
      history.replace(Paths.DASHBOARD);
    } else if (!hasPaths) {
      history.replace('/404');
    }
  }, [pathname]);

  const layoutProps = {
    pathname,
    history,
    user: { username:  name || '未知用户' },
    siteName: SITE_NAME,
    nav: { menus: realMenus },
    logoPath: `${process.env.PUBLIC_PATH}logo.png`,
    logout,
    header: {
      setUserOps: (item) =>
        [item].concat([
          {
            key: 'resetPassword',
            title: '重置密码',
            icon: <SettingFilled />,
            onClick: () => window.open(RESET_URL),
          },
          {
            key: 'appVersion',
            title: (
              <span style={{ fontSize: 12 }} title={moment(process.env.APP_VERSION).format(DATE_FORMAT)}>
                发布时间：{moment(process.env.APP_VERSION).format(DATE_FORMAT)}
              </span>
            ),
          },
        ]),
      onLogout: logout,
    },
    loading: {
      global: false,
    },
    ...props,
  };
  if (alonePages.includes(pathname)) {
    return <div>{children}</div>;
  }
  if (!token) return <Redirect to="/login" />
  return (
    <ConfigProvider locale={zhCN} {...suzeConfig}>
      <KPrompt location={location}>
        <HLayout {...layoutProps}>{children}</HLayout>
      </KPrompt>
    </ConfigProvider>
  );
}

export default Layout;
