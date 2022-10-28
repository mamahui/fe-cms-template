import { Button, Result } from 'antd';
import {Paths} from '@/constants';

export default (props) => {
  const { history } = props;
  return (
    <Result
      status="404"
      title="404"
      subTitle="页面飞走啦~~"
      extra={<Button type="primary" onClick={() => history.push(Paths.DASHBOARD)}>回到首页</Button>}
    />
  )
};
