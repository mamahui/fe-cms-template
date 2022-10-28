import {
  DatabaseOutlined,
  SolutionOutlined,
  AuditOutlined,
  TeamOutlined,
  SettingOutlined,
} from '@ant-design/icons';

import { Paths } from '@/constants';

const getTabMenus = (menus) =>
  menus.map(({ label, value }) => ({
    title: label,
    path: value,
    hide: true,
  }));

const MENUS = [
  {
    title: 'dashboard',
    icon: <DatabaseOutlined />,
    key: '/dashboard',
    path: Paths.DASHBOARD,
  },
  {
    title: '示例菜单',
    icon: <SolutionOutlined />,
    key: '/customer',
    children: [
      {
        title: '示例子菜单1',
        icon: <AuditOutlined />,
        path: Paths.CUSTOMER_TEST,
      },
      {
        title: '示例子菜单2',
        icon: <DatabaseOutlined />,
        path: Paths.CUSTOMER_LIST,
      },
    ],
  },
];

export default MENUS;
