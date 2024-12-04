/**
 * 登录组件
 * 
 * 功能：
 * 1. 支持账号密码登录
 * 2. 支持邮箱验证码登录
 * 3. 提供第三方登录入口
 * 4. 包含密码强度校验
 * 5. 支持切换到注册页面
 */

import './login.css';
import {LockOutlined, MailOutlined, UserOutlined,} from '@ant-design/icons';
import {LoginForm, ProConfigProvider, ProFormCaptcha, ProFormCheckbox, ProFormText,} from '@ant-design/pro-components';
import {Button, message, Tabs} from 'antd';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {useAuth} from '../contexts/AuthContext';

type LoginType = 'account' | 'mail';

interface LoginProps {
    onSwitchToRegister?: () => void;
    onClose?: () => void;
    redirectUrl?: string;
}

export default ({onSwitchToRegister, onClose, redirectUrl}: LoginProps) => {
    const [loginType, setLoginType] = useState<LoginType>('account');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {login} = useAuth();

    const handleSubmit = async (values: any) => {
        try {
            setLoading(true);
            let response;

            if (loginType === 'account') {
                response = await axios.post('/api/auth/login', {
                    username: values.username,
                    password: values.password
                });
            } else {
                response = await axios.post('/api/auth/login-email', {
                    email: values.mail,
                    captcha: values.captcha
                });
            }

            if (response.data.token) {
                await login(response.data.token);
                message.success('登录成功');
                onClose?.();
                navigate(redirectUrl || '/');
            }
        } catch (error: any) {
            message.error(error.response?.data?.message || '登录失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProConfigProvider hashed={false}>
            <div className="login-container">
                <LoginForm
                    //logo="https://github.githubassets.com/favicons/favicon.png"
                    title="Traveler"
                    subTitle="探索世界文化遗产的新方式"
                    onFinish={handleSubmit}
                    loading={loading}
                    //actions={
                    //<Space>
                    //其他登录方式
                    //<AlipayCircleOutlined className="third-party-icon" />
                    //<TaobaoCircleOutlined className="third-party-icon" />
                    //<WeiboCircleOutlined className="third-party-icon" />
                    //</Space>
                    //}
                >
                    <Tabs
                        centered
                        activeKey={loginType}
                        onChange={(activeKey) => setLoginType(activeKey as LoginType)}
                    >
                        <Tabs.TabPane key={'account'} tab={'账密登录'} />
                        <Tabs.TabPane key={'mail'} tab={'邮箱登录'} />
                    </Tabs>
                    {loginType === 'account' && (
                        <>
                            <ProFormText
                                name="username"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <UserOutlined className={'prefixIcon'} />,
                                }}
                                placeholder={'用户名'}
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入用户名!',
                                    },
                                ]}
                            />
                            <ProFormText.Password
                                name="password"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined className="prefixIcon" />,
                                    strengthText: '密码应包含数字、字母和特殊字符，至少8个字符。',
                                    statusRender: (value) => {
                                        const getStatus = () => {
                                            if (value && value.length > 12) return 'strong';
                                            if (value && value.length > 6) return 'medium';
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
                                placeholder={'密码'}
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入密码！',
                                    },
                                ]}
                            />
                        </>
                    )}
                    {loginType === 'mail' && (
                        <>
                            <ProFormText
                                fieldProps={{
                                    size: 'large',
                                    prefix: <MailOutlined className={'prefixIcon'} />,
                                }}
                                name="mail"
                                placeholder={'邮箱'}
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入邮箱！',
                                    },
                                    {
                                        pattern: /[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+/,
                                        message: '邮箱格式错误！',
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
                                placeholder={'请输入验证码'}
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
                        </>
                    )}
                    <div className="form-footer">
                        <ProFormCheckbox noStyle name="autoLogin">
                            自动登录
                        </ProFormCheckbox>
                        <a className="form-footer-right">
                            忘记密码
                        </a>
                    </div>
                    <div className="switch-form-container">
                        还没有账号？ 
                        <Button type="link" onClick={onSwitchToRegister}>
                            立即注册
                        </Button>
                    </div>
                </LoginForm>
            </div>
        </ProConfigProvider>
    );
};