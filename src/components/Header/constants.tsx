import { Link } from 'react-router-dom';
import type { MenuProps } from 'antd';

// 定义菜单项类型
type MenuItem = Required<MenuProps>['items'][number];

// 导航菜单配置
export const menuItems: MenuItem[] = [
    { 
        key: 'home', 
        label: <Link to="/">首页</Link>
    },
    { 
        key: 'destinations', 
        label: <Link to="/destinations">目的地</Link>
    },
    { 
        key: 'virtual-tour', 
        label: <Link to="/virtual-tour">VR体验</Link>
    },
    { 
        key: 'plan-trip', 
        label: <Link to="/plan-trip">规划行程</Link>
    },
]; 