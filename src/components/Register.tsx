/**
 * 注册组件
 * 
 * 功能：
 * 1. 用户名注册
 * 2. 邮箱验证
 * 3. 密码强度校验
 * 4. 密码确认校验
 * 5. 验证码功能
 * 6. 支持切换到登录页面
 * 
 * 表单验证规则：
 * - 用户名：必填，至少3个字符
 * - 邮箱：必填，需要符合邮箱格式
 * - 密码：必填，至少6个字符，包含强度检测
 * - 确认密码：必填，必须与密码一致
 * - 验证码：必填
 */

import {
  LockOutlined,
  UserOutlined,
  MailOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProConfigProvider,
  ProFormText,
  ProFormCaptcha,
} from '@ant-design/pro-components';
import { message, Button } from 'antd';
import './login.css';

interface RegisterProps {
  onSwitchToLogin?: () => void;
}

const Register: React.FC<RegisterProps> = ({ onSwitchToLogin }) => {

  return (
    <ProConfigProvider hashed={false}>
      <div className="login-container">
        <LoginForm
          logo="https://github.githubassets.com/favicons/favicon.png"
          title="Github"
          subTitle="全球最大的代码托管平台"
          submitter={{
            searchConfig: {
              submitText: '注册',
            },
          }}
        >
          <ProFormText
            name="username"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined className={'prefixIcon'} />,
            }}
            placeholder="用户名"
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
              {
                min: 3,
                message: '用户名至少3个字符！',
              },
            ]}
          />
          <ProFormText
            name="email"
            fieldProps={{
              size: 'large',
              prefix: <MailOutlined className={'prefixIcon'} />,
            }}
            placeholder="邮箱"
            rules={[
              {
                required: true,
                message: '请输入邮箱！',
              },
              {
                type: 'email',
                message: '请输入有效的邮箱地址！',
              },
            ]}
          />
          <ProFormCaptcha
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={'prefixIcon'} />,
            }}
            captchaProps={{
              size: 'large',
            }}
            placeholder="请输入验证码"
            captchaTextRender={(timing, count) => {
              if (timing) {
                return `${count} ${'获取验证码'}`;
              }
              return '获取验证码';
            }}
            name="captcha"
            rules={[
              {
                required: true,
                message: '请输入验证码！',
              },
            ]}
            onGetCaptcha={async () => {
              message.success('获取验证码成功！验证码为：1234');
            }}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={'prefixIcon'} />,
              strengthText: '密码应包含数字、字母和特殊字符，至少8个字符。',
              statusRender: (value) => {
                const getStatus = () => {
                  if (value && value.length > 12) {
                    return 'strong';
                  }
                  if (value && value.length > 6) {
                    return 'medium';
                  }
                  return 'weak';
                };
                const status = getStatus();
                return (
                  <div className={`password-strength password-strength-${status}`}>
                    强度：{status === 'weak' ? '弱' : status === 'medium' ? '中' : '强'}
                  </div>
                );
              },
            }}
            placeholder="密码"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
              {
                min: 6,
                message: '密码至少6个字符！',
              },
            ]}
          />
          <ProFormText.Password
            name="confirmPassword"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={'prefixIcon'} />,
            }}
            placeholder="确认密码"
            rules={[
              {
                required: true,
                message: '请确认密码！',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致！'));
                },
              }),
            ]}
          />
          <div className="switch-form-container">
            已有账号？ 
            <Button type="link" onClick={onSwitchToLogin}>
              立即登录
            </Button>
          </div>
        </LoginForm>
      </div>
    </ProConfigProvider>
  );
};

export default Register;
