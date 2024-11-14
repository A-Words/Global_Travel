import React from 'react';
import {Spin} from 'antd';
import {LoadingOutlined} from '@ant-design/icons';
import styles from './Loading.module.css';

interface LoadingProps {
    tip?: string;
}

export const Loading: React.FC<LoadingProps> = ({tip = '加载中...'}) => (
    <div className={styles.container}>
        <Spin
            size="large"
            tip={tip}
            indicator={<LoadingOutlined style={{fontSize: 24}} spin/>}
        >
            <div className={styles.content}/>
        </Spin>
    </div>
); 