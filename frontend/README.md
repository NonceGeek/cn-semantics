# 国际中文教育词汇义类资源检索平台 - Frontend

基于 React 和 Vite 构建的前端应用。

## 技术栈

- React 18
- Vite
- CSS3 (无框架依赖)

## 安装依赖

```bash
npm install
```

## 开发模式

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动。

## 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

## 预览生产构建

```bash
npm run preview
```

## 项目结构

```
frontend/
├── src/
│   ├── components/          # React 组件
│   │   ├── Header.jsx       # 头部导航
│   │   ├── SystemStatusAlert.jsx  # 系统状态提示
│   │   ├── SearchSection.jsx      # 搜索区域
│   │   ├── ResourceDownload.jsx   # 资源下载
│   │   └── Footer.jsx             # 页脚
│   ├── App.jsx              # 主应用组件
│   ├── main.jsx            # 入口文件
│   └── index.css           # 全局样式
├── index.html              # HTML 模板
├── package.json            # 项目配置
└── vite.config.js          # Vite 配置
```

## 功能特性

- ✅ 响应式设计，支持移动端和桌面端
- ✅ 现代化 UI 设计，符合设计规范
- ✅ 搜索功能（按词语/按义类）
- ✅ CSV 数据导入功能
- ✅ 资源下载功能
- ✅ 意见反馈区域

## 待实现功能

- [ ] 搜索功能后端集成
- [ ] CSV 文件解析和数据加载
- [ ] PDF 文件下载
- [ ] 搜索结果展示
- [ ] 数据可视化
