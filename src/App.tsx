import React, {Suspense, useEffect, useState} from 'react';
import {Button, ConfigProvider, Layout} from 'antd';
import {BulbFilled, BulbOutlined} from '@ant-design/icons';
import {BrowserRouter as Router, Navigate, Route, Routes, useLocation} from 'react-router-dom';
import {defaultTheme, getDarkTheme} from './theme';
import {AuthProvider, useAuth} from './contexts/AuthContext';

// 直接导入首页组件
import {Header} from './components/Header';
import {Footer} from './components/Footer';
import Home from './pages/Home';
import {Loading} from './components/Loading';
import TripPlanner from './pages/TripPlanner';

// 对登录注册组件进行懒加载
const Login = React.lazy(() => import('./components/Login'));
const Register = React.lazy(() => import('./components/Register'));

// 懒加载其他页面组件
const VirtualTour = React.lazy(() => import('./pages/VirtualTour'));
const ModelPreview = React.lazy(() => import('./pages/ModelPreview'));
const Destinations = React.lazy(() => import('./pages/Destinations'));
const HeritageDetail = React.lazy(() => import('./pages/HeritageDetail'));
const DebugPage = React.lazy(() => import('./pages/DebugPage'));
const MyTrips = React.lazy(() => import('./pages/MyTrips'));
const Settings = React.lazy(() => import('./pages/Settings'));

const { Content } = Layout;

const LoadingComponent = () => <Loading tip="页面加载中..."/>;
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const {isAuthenticated} = useAuth();
    const location = useLocation();
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" state={{from: location}} replace/>;
};

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
        <AuthProvider>
            <ConfigProvider
                theme={{
                    ...defaultTheme,
                    ...(isDarkMode ? getDarkTheme() : {}),
                    cssVar: true,
                }}
            >
                <Router>
                    <Layout style={{minHeight: '100vh'}}>
                        <Header/>
                        <Content>
                            <Suspense fallback={<LoadingComponent/>}>
                                <Routes>
                                    <Route path="/" element={<Home/>}/>
                                    <Route path="/login" element={<Login/>}/>
                                    <Route path="/register" element={<Register/>}/>
                                    <Route path="/virtual-tour" element={<VirtualTour/>}/>
                                    <Route path="/model-preview" element={<ModelPreview/>}/>
                                    <Route path="/destinations" element={<Destinations/>}/>
                                    <Route path="/heritage/:id" element={<HeritageDetail/>}/>
                                    <Route path="/trip-planner" element={
                                        <PrivateRoute>
                                            <TripPlanner/>
                                        </PrivateRoute>
                                    }/>
                                    <Route path="/my-trips" element={
                                        <PrivateRoute>
                                            <Suspense fallback={<LoadingComponent/>}>
                                                <MyTrips/>
                                            </Suspense>
                                        </PrivateRoute>
                                    }/>
                                    <Route path="/settings" element={
                                        <PrivateRoute>
                                            <Suspense fallback={<LoadingComponent/>}>
                                                <Settings/>
                                            </Suspense>
                                        </PrivateRoute>
                                    }/>
                                    {process.env.NODE_ENV === 'development' && (
                                        <Route path="/debug" element={<DebugPage/>}/>
                                    )}
                                </Routes>
                            </Suspense>
                        </Content>
                        {/* 主题切换按钮 */}
                        <Button
                            type="text"
                            icon={isDarkMode ? <BulbOutlined/> : <BulbFilled/>}
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
                        <Footer/>
                    </Layout>
                </Router>
            </ConfigProvider>
        </AuthProvider>
    );
};

export default App;