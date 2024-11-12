import React, { useState, useEffect } from 'react';
import { ConfigProvider, Button, Layout } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { defaultTheme, getDarkTheme } from './theme';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import Home from './pages/Home';
import Login from './components/Login';
import Register from './components/Register';
import VirtualTour from './pages/VirtualTour';

const { Content } = Layout;

const App: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme === 'dark';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            setIsDarkMode(e.matches);
            localStorage.setItem('theme', e.matches ? 'dark' : 'light');
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const toggleTheme = () => {
        setIsDarkMode(prev => {
            const newTheme = !prev;
            localStorage.setItem('theme', newTheme ? 'dark' : 'light');
            return newTheme;
        });
    };

    return (
        <ConfigProvider
            theme={{
                ...defaultTheme,
                ...(isDarkMode ? getDarkTheme() : {}),
                cssVar: true,
            }}
        >
            <Router>
                <Layout style={{ minHeight: '100vh' }}>
                    <Header />
                    <Content>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/virtual-tour" element={<VirtualTour />} />
                        </Routes>
                    </Content>
                    <Button
                        type="text"
                        icon={isDarkMode ? <BulbOutlined /> : <BulbFilled />}
                        onClick={toggleTheme}
                        style={{
                            position: 'fixed',
                            right: '20px',
                            bottom: '20px',
                            zIndex: 1000,
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    />
                    <Footer />
                </Layout>
            </Router>
        </ConfigProvider>
    );
};

export default App;