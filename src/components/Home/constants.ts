import React from 'react';
import {CompassOutlined, GlobalOutlined, RocketOutlined} from '@ant-design/icons';
import type {Destination, Feature} from './types';
import styles from './Features/Features.module.css';

export const FEATURES: Feature[] = [
    {
        icon: React.createElement(GlobalOutlined, {className: styles.featureIcon}),
        title: 'VR虚拟游览',
        description: '通过VR技术，360°全景体验世界各地的文化遗产，仿佛身临其境。'
    },
    {
        icon: React.createElement(CompassOutlined, {className: styles.featureIcon}),
        title: 'AR实景导览',
        description: '增强现实技术为您提供丰富的文化解说，了解每一处遗迹背后的历史故事。'
    },
    {
        icon: React.createElement(RocketOutlined, {className: styles.featureIcon}),
        title: '智能行程规划',
        description: '基于AI算法，为您量身定制最优旅行路线，打造专属文化之旅。'
    }
];

export const DESTINATIONS: Destination[] = [
    {
        id: 'great-wall',
        name: '长城',
        imageUrl: '/assets/images/great-wall.jpg',
        description: '点击开启VR之旅',
        hasVR: true,
        hasAR: true
    },
    {
        id: 'pyramids',
        name: '埃及金字塔',
        imageUrl: '/assets/images/pyramids.jpg',
        description: '点击开启VR之旅',
        hasVR: true
    },
    {
        id: 'taj-mahal',
        name: '泰姬陵',
        imageUrl: '/assets/images/taj-mahal.jpg',
        description: '点击开启VR之旅',
        hasVR: true,
        hasAR: true
    },
    {
        id: 'sagrada-familia',
        name: '圣家族大教堂',
        imageUrl: '/assets/images/sagrada-familia.jpg',
        description: '点击开启VR之旅',
        hasVR: true
    }
]; 