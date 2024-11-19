import React, {useState} from 'react';
import {Button, Card, Form, Input, message, Tabs} from 'antd';
import {LockOutlined, MailOutlined, UserOutlined} from '@ant-design/icons';
import {useAuth} from '../contexts/AuthContext';
import {useNavigate} from 'react-router-dom';
//import type { UploadChangeParam } from 'antd/es/upload';
//import type { RcFile, UploadFile } from 'antd/es/upload/interface';

interface UserSettings {
    username: string;
    email: string;
    //nickname?: string;
}

const Settings: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const {user} = useAuth();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const handleUpdateProfile = async (values: UserSettings) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('/api/user/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(values)
            });

            if (!response.ok) {
                throw new Error('更新设置失败');
            }

            message.success('设置更新成功');
        } catch (error) {
            message.error('更新设置失败');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (values: { oldPassword: string; newPassword: string }) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('/api/user/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(values)
            });

            if (!response.ok) {
                throw new Error('修改密码失败');
            }

            message.success('密码修改成功，请重新登录');
            navigate('/login');
        } catch (error) {
            message.error('修改密码失败');
        } finally {
            setLoading(false);
        }
    };

    {/*const beforeUpload = (file: RcFile) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('只能上传 JPG/PNG 格式的图片！');
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('图片大小不能超过 2MB！');
            return false;
        }
        return true;
    };

    const handleAvatarChange = async (info: UploadChangeParam<UploadFile>) => {
        if (info.file.status === 'done') {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('avatar', info.file.originFileObj as RcFile);

            try {
                const response = await fetch('/api/user/avatar', {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('上传头像失败');
                }

                message.success('头像更新成功');
            } catch (error) {
                message.error('上传头像失败');
            }
        }
    };*/
    }

    const items = [
        {
            key: '1',
            label: '基本信息',
            children: (
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleUpdateProfile}
                    initialValues={{
                        username: user?.username,
                        email: user?.email,
                        //nickname: user?.nickname
                    }}
                >
                    {/*<Form.Item label="头像">
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            beforeUpload={beforeUpload}
                            onChange={handleAvatarChange}
                        >
                            {user?.avatar ? (
                                <img src={user.avatar} alt="avatar" style={{ width: '100%' }} />
                            ) : (
                                <div>
                                    <UploadOutlined />
                                    <div style={{ marginTop: 8 }}>上传头像</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>*/}
                    <Form.Item
                        name="username"
                        label="用户名"
                        rules={[{required: true, message: '请输入用户名'}]}
                    >
                        <Input prefix={<UserOutlined/>} placeholder="用户名"/>
                    </Form.Item>
                    {/*<Form.Item
                        name="nickname"
                        label="昵称"
                        rules={[{ max: 50, message: '昵称最多50个字符' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="设置昵称（选填）" />
                    </Form.Item>*/}
                    <Form.Item
                        name="email"
                        label="邮箱"
                        rules={[
                            {required: true, message: '请输入邮箱'},
                            {type: 'email', message: '请输入有效的邮箱地址'}
                        ]}
                    >
                        <Input prefix={<MailOutlined/>} placeholder="邮箱"/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            保存修改
                        </Button>
                    </Form.Item>
                </Form>
            )
        },
        {
            key: '2',
            label: '修改密码',
            children: (
                <Form layout="vertical" onFinish={handleChangePassword}>
                    <Form.Item
                        name="oldPassword"
                        label="当前密码"
                        rules={[{required: true, message: '请输入当前密码'}]}
                    >
                        <Input.Password prefix={<LockOutlined/>} placeholder="当前密码"/>
                    </Form.Item>
                    <Form.Item
                        name="newPassword"
                        label="新密码"
                        rules={[
                            {required: true, message: '请输入新密码'},
                            {min: 6, message: '密码长度不能小于6位'}
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined/>} placeholder="新密码"/>
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        label="确认新密码"
                        dependencies={['newPassword']}
                        rules={[
                            {required: true, message: '请确认新密码'},
                            ({getFieldValue}) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('两次输入的密码不一致'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined/>} placeholder="确认新密码"/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            修改密码
                        </Button>
                    </Form.Item>
                </Form>
            )
        }
    ];

    return (
        <div style={{padding: '24px'}}>
            <Card title="个人设置">
                <Tabs items={items}/>
            </Card>
        </div>
    );
};

export default Settings; 