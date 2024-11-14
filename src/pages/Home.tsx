import React from 'react';
import {Layout} from 'antd';
import Hero from '../components/Home/Hero';
import Features from '../components/Home/Features';
import Destinations from '../components/Home/Destinations';
import styles from './Home.module.css';

const { Content } = Layout;

const Home: React.FC = () => {
  return (
      <Content className={styles.homeContent}>
          <Hero/>
          <Features/>
          <Destinations/>
    </Content>
  );
};

export default Home;