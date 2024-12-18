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

import {LockOutlined, MailOutlined, UserOutlined,} from '@ant-design/icons';
import {LoginForm, ProConfigProvider, ProFormCaptcha, ProFormText,} from '@ant-design/pro-components';
import {Button, message} from 'antd';
import {useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import axios from 'axios';
import './login.css';

interface LocationState {
    from?: {
        pathname: string;
    };
}

interface RegisterProps {
    onSwitchToLogin?: () => void;
    onClose?: () => void;
    redirectUrl?: string;
}

const Register: React.FC<RegisterProps> = ({onSwitchToLogin, onClose, redirectUrl}) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (values: any) => {
        try {
            setLoading(true);
            // 验证两次密码是否一致
            if (values.password !== values.confirmPassword) {
                message.error('两次输入的密码不一致！');
                return;
            }

            const response = await axios.post('/api/auth/register', {
                username: values.username,
                email: values.email,
                password: values.password,
                captcha: values.captcha
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                message.success('注册成功');
                onClose?.();

                // 获取重定向路径
                const state = location.state as LocationState;
                const from = state?.from?.pathname || redirectUrl || '/';
                navigate(from);
            }
        } catch (error: any) {
            message.error(error.response?.data?.message || '注册失败');
        } finally {
            setLoading(false);
        }
    };

    const handleGetCaptcha = async (email: string) => {
        try {
            await axios.post('/api/auth/send-captcha', {
                email
            });
            message.success('验证码已发送到您的邮箱');
        } catch (error: any) {
            message.error(error.response?.data?.message || '验证码发送失败');
        }
    };

  return (
    <ProConfigProvider hashed={false}>
      <div className="login-container">
        <LoginForm
            //logo="https://github.githubassets.com/favicons/favicon.png"
            title="Traveler"
          subTitle="探索世界文化遗产的新方式"
          submitter={{
            searchConfig: {
              submitText: '注册',
            },
          }}
          onFinish={handleSubmit}
          loading={loading}
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
            onGetCaptcha={handleGetCaptcha}
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
