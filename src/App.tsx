import React, {useEffect, useState} from 'react';
import {Button, ConfigProvider, Layout} from 'antd';
import {BulbFilled, BulbOutlined} from '@ant-design/icons';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {defaultTheme, getDarkTheme} from './theme';

// 直接导入首页组件
import {Header} from './components/Header';
import {Footer} from './components/Footer';
import Home from './pages/Home';

// 对登录注册组件进行懒加载
const Login = React.lazy(() => import('./components/Login'));
const Register = React.lazy(() => import('./components/Register'));

// 懒加载其他页面组件
const VirtualTour = React.lazy(() => import('./pages/VirtualTour'));
const ModelPreview = React.lazy(() => import('./pages/ModelPreview'));
const Destinations = React.lazy(() => import('./pages/Destinations'));
const HeritageDetail = React.lazy(() => import('./pages/HeritageDetail'));
const DebugPage = React.lazy(() => import('./pages/DebugPage'));

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
                            <Route path="/model-preview" element={<ModelPreview />} />
                            <Route path="/debug" element={<DebugPage />} />
                            <Route path="/destinations" element={<Destinations/>}/>
                            <Route path="/heritage/:id" element={<HeritageDetail/>}/>
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