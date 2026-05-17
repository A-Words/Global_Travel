# Traveler - 全球文化遗产旅游平台

Traveler - 全球文化遗产旅游平台的前端应用，提供文化遗产浏览、详情展示、VR 虚拟游览、登录注册、个人设置和 AI 行程规划等功能。

## 技术栈

- React 18 + TypeScript
- Vite
- React Router
- Ant Design
- Three.js / React Three Fiber / Babylon.js
- Axios
- CSS Modules / Tailwind CSS

## 主要功能

- 首页展示文化遗产旅行入口、特色内容和推荐目的地。
- 目的地列表和文化遗产详情页支持本地数据回退。
- VR 虚拟旅游支持长城、埃及金字塔、泰姬陵、圣家族大教堂等全景场景。
- 用户登录、注册、个人资料、头像和密码设置。
- 智能行程规划会调用后端接口，根据目的地、日期、人数和兴趣主题生成并保存行程。
- 我的行程页面展示当前用户已生成的旅行计划。
- 支持浅色/深色主题切换。

## 本地运行

```bash
npm install
npm run dev
```

默认开发服务由 Vite 启动。前端通过 `vite.config.ts` 将 `/api` 请求代理到 `http://localhost:3000`，因此本地联调时需要先启动后端服务。

## 构建和预览

```bash
npm run build
npm run preview
```

## 环境变量

可选配置：

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

未配置 `VITE_API_BASE_URL` 时，文化遗产数据会优先使用 `src/data/heritages.json` 作为本地回退数据。登录、注册、行程规划等用户相关功能仍需要后端接口。

## 目录结构

```text
src/
  components/     通用组件和首页、页头、页脚、VR 场景组件
  contexts/       登录状态、动画和页面过渡上下文
  data/           本地文化遗产数据
  pages/          首页、目的地、详情、VR、行程、设置等页面
  services/       认证和文化遗产数据服务
  stores/         文化遗产状态管理
  theme/          Ant Design 主题配置
  types/          业务类型定义
  utils/          Axios 实例和请求拦截器
public/
  assets/         图片和全景图资源
```

## 常用脚本

- `npm run dev`: 启动开发服务。
- `npm run build`: 执行 TypeScript 构建并打包生产资源。
- `npm run lint`: 运行 ESLint。
- `npm run preview`: 预览生产构建结果。
