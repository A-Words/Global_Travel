import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd'
import { defaultTheme } from './theme'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ConfigProvider theme={{ ...defaultTheme, cssVar: true }}>
            <App />
        </ConfigProvider>
    </StrictMode>,
)
