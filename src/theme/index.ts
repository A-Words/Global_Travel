import { ThemeConfig } from 'antd';
import { theme } from 'antd';

// 默认主题配置
export const defaultTheme: ThemeConfig = {
  token: {
    // 品牌色
    colorPrimary: '#1890ff',
    colorInfo: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    
    // 文本色
    colorText: 'rgba(0, 0, 0, 0.88)',
    colorTextSecondary: 'rgba(0, 0, 0, 0.65)',
    colorTextTertiary: 'rgba(0, 0, 0, 0.45)',
    colorTextQuaternary: 'rgba(0, 0, 0, 0.25)',
    
    // 背景色
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBgLayout: '#f5f5f5',
    colorBgSpotlight: '#ffffff',
    colorBgMask: 'rgba(0, 0, 0, 0.5)',
    
    // 边框色
    colorBorder: '#d9d9d9',
    colorBorderSecondary: '#f0f0f0',
    
    // 阴影
    boxShadow: 'rgba(0, 0, 0, 0.12)',
    
    // 字体
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 14,
    
    // 圆角
    borderRadius: 6,
    
    // 间距
    margin: 16,
    padding: 16,
    paddingLG: 24,
    paddingXS: 8,
    
    // 控件
    controlHeight: 32,
    controlHeightLG: 40,
    controlHeightSM: 24,
  },
  components: {
    Button: {
      borderRadius: 4,
      paddingInline: 16,
    },
    Input: {
      borderRadius: 4,
      paddingInline: 12,
    },
    Select: {
      borderRadius: 4,
    },
    Menu: {
      itemHeight: 40,
      itemMarginInline: 16,
    },
    Layout: {
      headerHeight: 64,
      headerPadding: '0 50px',
      headerColor: 'rgba(0, 0, 0, 0.88)',
      footerPadding: '24px 50px',
      bodyBg: '#f5f5f5',
    }
  }
};

// 完善暗黑主题配置
export const getDarkTheme = (): ThemeConfig => ({
  ...defaultTheme,
  algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
  token: {
    ...defaultTheme.token,
    // 暗色模式下的背景色
    colorBgContainer: '#141414',
    colorBgElevated: '#1f1f1f',
    colorBgLayout: '#000000',
    colorBgSpotlight: '#1f1f1f',
    colorBgMask: 'rgba(0, 0, 0, 0.75)',
    
    // 暗色模式下的文本色
    colorText: 'rgba(255, 255, 255, 0.85)',
    colorTextSecondary: 'rgba(255, 255, 255, 0.65)',
    colorTextTertiary: 'rgba(255, 255, 255, 0.45)',
    colorTextQuaternary: 'rgba(255, 255, 255, 0.25)',
    
    // 暗色模式下的边框色
    colorBorder: '#303030',
    colorBorderSecondary: '#1f1f1f',
    
    // 暗色模式下的阴影
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
  },
  components: {
    ...defaultTheme.components,
    Layout: {
      ...defaultTheme.components?.Layout,
      bodyBg: '#000000',
      headerBg: '#141414',
      siderBg: '#141414',
      footerBg: '#141414',
    }
  }
}); 