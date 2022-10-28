import { Form, Input, Button, Tabs, message } from 'antd';
import { UserOutlined, LockOutlined, } from '@ant-design/icons';
import './index.less';
import { useApi } from '@/hooks'
import { saveUserInfo } from '@/utils'
import {Paths} from '@/constants';


export default function Login({ history }) {
  const [passwordForm] = Form.useForm();
  const [dispatch, loading] = useApi()

  const handleAPFinish = async (values) => {
    // 请求后台进行登录 serviceName 与 service中的key相对应
    const res = await dispatch('loginPassword', values)
    saveUserInfo(res);
    message.success('登录成功');
    history.push(Paths.DASHBOARD);
  };
  return (
    <div className="login-page-wrap">
      <div className="main">
        <h2>登录</h2>
        <Form onFinish={handleAPFinish} form={passwordForm}>
          <Form.Item
            name="account"
            validateTrigger="onChange"
            rules={[
              {
                required: true,
                message: '请输入账号',
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="账号"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="password"
            validateTrigger="onChange"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              className="login-btn"
              loading={loading.loginPassword}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
