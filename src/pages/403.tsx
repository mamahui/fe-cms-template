import { Button, Result } from 'antd';
import {Paths} from '@/constants';

export default (props) => {
  const { history } = props;
  return (
    <Result
      status="403"
      title="403"
      subTitle="没有访问权限，请联系管理员"
      extra={<Button type="primary" onClick={() => history.push(Paths.DASHBOARD)}>回到首页</Button>}
    />
  )
};
