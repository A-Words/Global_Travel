import React, { useState } from 'react';
import bcrypt from 'bcryptjs';
import './LoginRegister.css';

const LoginRegister: React.FC = () => {
    const [loginUsername, setLoginUsername] = useState<string>('');
    const [loginPassword, setLoginPassword] = useState<string>('');
    const [registerUsername, setRegisterUsername] = useState<string>('');
    const [registerPassword, setRegisterPassword] = useState<string>('');
    const [loginMessage, setLoginMessage] = useState<string>('');
    const [registerMessage, setRegisterMessage] = useState<string>('');
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    const handleLogin = async (event: React.FormEvent): Promise<void> => {
        event.preventDefault();
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: loginUsername, password: loginPassword }),
        });
        const result = await response.text();
        if (response.ok) {
            setLoginMessage('登录成功');
            setIsLoggedIn(true);
        } else {
            setLoginMessage(`登录失败: ${result}`);
        }
    };

    const handleRegister = async (event: React.FormEvent): Promise<void> => {
        event.preventDefault();
        const hashedPassword = await bcrypt.hash(registerPassword, 10);
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: registerUsername, password: hashedPassword }),
        });
        const result = await response.text();
        if (response.ok) {
            setRegisterMessage('注册成功');
        } else {
            setRegisterMessage(`注册失败: ${result}`);
        }
    };

    const handleLogout = (): void => {
        setIsLoggedIn(false);
        setLoginMessage('');
        setRegisterMessage('');
    };

    return (
        <div className="container">
            {isLoggedIn ? (
                <div>
                    <h2>欢迎, {loginUsername}</h2>
                    <button onClick={handleLogout} className="button">退出登录</button>
                </div>
            ) : (
                <div>
                    <h2>登录</h2>
                    <form onSubmit={handleLogin}>
                        <input
                            type="text"
                            value={loginUsername}
                            onChange={(e) => setLoginUsername(e.target.value)}
                            placeholder="用户名"
                            required
                            className="input"
                        />
                        <input
                            type="password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="密码"
                            required
                            className="input"
                        />
                        <button type="submit" className="button">登录</button>
                    </form>
                    {loginMessage && <p>{loginMessage}</p>}
                    <h2>注册</h2>
                    <form onSubmit={handleRegister}>
                        <input
                            type="text"
                            value={registerUsername}
                            onChange={(e) => setRegisterUsername(e.target.value)}
                            placeholder="用户名"
                            required
                            className="input"
                        />
                        <input
                            type="password"
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)}
                            placeholder="密码"
                            required
                            className="input"
                        />
                        <button type="submit" className="button">注册</button>
                    </form>
                    {registerMessage && <p>{registerMessage}</p>}
                </div>
            )}
        </div>
    );
};

export default LoginRegister;