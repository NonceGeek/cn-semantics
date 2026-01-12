# 尹毓恪 - 致粉丝的信

> 一个精致的法国新浪潮风格信件网页项目

## 📦 项目说明

这是一个为歌手「尹毓恪」设计的信件展示网页，呈现了一封「给粉丝的信」。网页采用法国新浪潮电影般的文艺少年感，结合韦斯·安德森式复古配色，强调对称和精致的构图。

### ✨ 核心特性

- **拆封交互**：初始状态显示未拆封信封，用户点击后触发拆封动画
- **复古质感**：精心制作的手账风格，含纸张纹理、邮票、邮戳等细节
- **对称构图**：左右对称的视觉设计，中心聚焦
- **诗意插图**：手绘风格的春天与海啸 SVG 插图元素
- **打开统计**：统计信件被打开的次数（纯前端实现，使用 localStorage）
- **响应式设计**：完美支持移动端和桌面端

### 🎨 视觉特点

- **配色方案**：柔和的蓝灰冷调（#d5e5ea, #9fb4c7, #7a94a8, #4a6b7c）
- **字体风格**：打字机风格标题 + 书法风格正文
- **装饰元素**：
  - 旧邮票纹理（锯齿边缘）
  - 邮戳效果
  - 角落装饰框
  - 春天意象插图（花朵、嫩芽、燕子）
  - 海啸意象插图（波浪、浪尖、泡沫）

## 📁 项目结构

```
letter_for_fans/
├── index.html          # 主文件（包含 HTML + CSS + JavaScript）
├── index_0.html        # 原始版本（保留）
├── prompt_0.md         # 原始需求文档（保留）
├── README.md           # 本文档
└── LICENSE             # 许可证
```

## ⚙️ 内容配置

在 `index.html` 中找到 `LETTER_CONFIG` 对象（约第 489 行），可以自定义以下内容：

```javascript
const LETTER_CONFIG = {
    artistName: '尹毓恪',           // 歌手署名
    title: '致粉丝的信',             // 信标题
    subtitle: 'A Letter For You',   // 副标题
    paragraphs: [ /* ... */ ],      // 正文段落数组
    signaturePrefix: '永远爱你的',   // 落款前缀
    signatureDate: '2025.12.30',    // 落款日期
    footerEasterEgg: '愿所有美好...' // 页脚彩蛋
};
```

### 段落格式

```javascript
paragraphs: [
    // 普通段落（字符串）
    '这是一段普通的文字内容...',
    
    // 引用/诗句（对象）
    {
        type: 'quote',
        content: '这是一段引用文字<br>可以换行'
    }
]
```

## 🚀 部署指南

### 方案一：Vercel（推荐）⭐

**适合人群**：零基础用户，最简单快速

1. 注册 [Vercel 账号](https://vercel.com)（可用 GitHub 登录）
2. 安装 Vercel CLI（可选）：
   ```bash
   npm install -g vercel
   ```
3. 在项目目录运行：
   ```bash
   vercel
   ```
4. 按照提示完成部署，会得到一个 `.vercel.app` 域名
5. 绑定自定义域名 `letter.yinyuke.com`：
   - 在 Vercel 项目设置中添加域名
   - 到域名 DNS 管理处添加 CNAME 记录：
     ```
     类型: CNAME
     主机记录: letter
     记录值: cname.vercel-dns.com
     ```

**或使用 Vercel Web 界面部署**：
1. 访问 [vercel.com](https://vercel.com)
2. 点击「New Project」
3. 导入 GitHub 仓库或直接拖拽文件夹
4. 部署完成后绑定自定义域名

---

### 方案二：Cloudflare Pages

**适合人群**：需要 CDN 加速和 DNS 管理

1. 注册 [Cloudflare 账号](https://dash.cloudflare.com)
2. 进入「Pages」→「Create a project」
3. 连接 GitHub 仓库或直接上传文件
4. 构建设置：
   - Framework preset: None
   - Build command: (留空)
   - Build output directory: `/`
5. 部署完成后，在「Custom domains」中添加 `letter.yinyuke.com`
6. 按照提示配置 DNS（如果域名在 Cloudflare 管理）

---

### 方案三：GitHub Pages

**适合人群**：已有 GitHub 仓库

1. 将项目推送到 GitHub 仓库
2. 进入仓库设置 → Pages
3. 选择分支和根目录
4. 保存后会得到 `username.github.io/repo-name` 地址
5. 自定义域名：
   - 在 Pages 设置中输入 `letter.yinyuke.com`
   - 在域名 DNS 添加 CNAME 记录指向 `username.github.io`

---

### 方案四：传统服务器/VPS（Nginx）

**适合人群**：已有服务器和域名

1. 通过 SSH 连接到服务器
2. 将 `index.html` 上传到服务器：
   ```bash
   scp index.html user@your-server.com:/var/www/letter/
   ```
3. 配置 Nginx：
   ```nginx
   server {
       listen 80;
       server_name letter.yinyuke.com;
       root /var/www/letter;
       index index.html;
       
       location / {
           try_files $uri $uri/ =404;
       }
   }
   ```
4. 重启 Nginx：
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```
5. 配置 SSL（推荐使用 Let's Encrypt）：
   ```bash
   sudo certbot --nginx -d letter.yinyuke.com
   ```

---

### 方案五：其他静态托管服务

- **Netlify**: 类似 Vercel，拖拽部署
- **阿里云 OSS / 腾讯云 COS**: 开启静态网站托管
- **七牛云**: 支持静态网站

## 🔧 技术细节

- **纯静态**：无需服务器端运行环境
- **无外部依赖**：所有资源内置，无需 CDN
- **原生技术栈**：HTML + CSS + JavaScript（无框架）
- **数据持久化**：使用 `localStorage` 存储打开次数
- **浏览器兼容**：支持现代浏览器（Chrome, Firefox, Safari, Edge）

## 📊 打开次数统计说明

**工作原理**：
- 使用浏览器的 `localStorage` 存储计数
- 仅在用户**点击信封拆封**时计数 +1
- 数据存储在用户本地浏览器中
- 同一浏览器多次访问会累计计数
- 清除浏览器数据会重置计数

**局限性**：
- 纯前端实现，无法统计全局真实打开次数
- 不同浏览器/设备的计数独立
- 无痕模式不会保存计数

**如需真实全局统计**，可以考虑：
- 接入 Google Analytics 事件追踪
- 使用 [Umami](https://umami.is/) 等隐私友好的分析工具
- 后端 API + 数据库存储

## 🎯 使用场景

- 艺人官网的特别页面
- 专辑发布的宣传页
- 演唱会预告信息展示
- 粉丝互动的创意形式
- 个人品牌形象展示

## 📝 自定义建议

### 更换配色方案

在 CSS 中全局替换以下颜色变量：

```css
/* 主色调 */
#4a6b7c  →  你的主色
#7a94a8  →  你的次要色
#9fb4c7  →  你的强调色
#d5e5ea  →  你的背景色
```

### 替换插图内容

在 `<svg class="illustration-spring">` 和 `<svg class="illustration-wave">` 中修改 SVG 路径，创建自己的图案。

### 添加背景音乐

在 `<body>` 标签底部添加：

```html
<audio id="bgMusic" loop>
    <source src="your-music.mp3" type="audio/mpeg">
</audio>
<script>
    // 拆封时播放音乐
    document.getElementById('envelopeContainer').addEventListener('click', function() {
        document.getElementById('bgMusic').play();
    });
</script>
```

## 🐛 常见问题

**Q: 打开次数为什么每次刷新都会增加？**  
A: 确认你使用的是新版 `index.html`，计数应该只在**点击信封**时增加，而非页面加载时。

**Q: 移动端显示不正常？**  
A: 检查是否添加了 viewport meta 标签，已在 `<head>` 中包含。

**Q: 如何重置打开次数？**  
A: 在浏览器控制台执行：
```javascript
localStorage.removeItem('letter_open_count');
```

**Q: 能否添加分享功能？**  
A: 可以，在信纸底部添加分享按钮，使用 Web Share API 或社交媒体分享链接。

## 📄 许可证

本项目使用 MIT 许可证，详见 [LICENSE](LICENSE) 文件。

---

## 🎨 设计理念

这个项目的视觉风格受到以下艺术作品的启发：

- **电影**：《四百击》《精疲力尽》（法国新浪潮）
- **导演**：韦斯·安德森（对称构图、复古配色）
- **美学**：复古手账、旧信纸、邮票收藏
- **情感**：青春、诗意、怀旧、温柔

希望这封数字信件能成为连接艺人与听众的一座诗意桥梁。

---

**技术支持**: 如有问题，可查看代码注释或提交 Issue  
**最后更新**: 2025.12.30

