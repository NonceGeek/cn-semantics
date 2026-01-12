# 快速开始 ⚡

> 5 分钟内让你的信件网页上线

## 🎯 最快路径：Vercel 一键部署

### 步骤 1: 打开浏览器
访问 [vercel.com](https://vercel.com) 并注册（推荐 GitHub 登录）

### 步骤 2: 拖拽部署
1. 登录后点击「New Project」
2. 选择「Deploy」标签
3. 直接拖拽 `index.html` 文件到上传区域
4. 等待 30 秒，部署完成！

### 步骤 3: 绑定域名
1. 在项目设置中找到「Domains」
2. 输入 `letter.yinyuke.com`
3. 到域名管理处添加 CNAME 记录：
   ```
   类型: CNAME
   主机: letter
   记录值: cname.vercel-dns.com
   ```
4. 等待 5-30 分钟生效

### ✅ 完成！
访问 `https://letter.yinyuke.com` 查看效果

---

## 📱 本地预览

### 方法 1: 双击打开（最简单）
直接双击 `index.html` 文件，浏览器会自动打开

### 方法 2: 使用 Python（推荐）
```bash
# 在项目目录运行
cd /Users/liaohua/letter_for_fans

# Python 3
python3 -m http.server 8000

# 访问 http://localhost:8000
```

### 方法 3: 使用 Node.js
```bash
# 安装 http-server
npm install -g http-server

# 运行
http-server

# 访问 http://localhost:8080
```

---

## ⚙️ 自定义内容（3 分钟）

### 打开 index.html 文件
用任何文本编辑器打开（VS Code、Sublime、记事本等）

### 找到配置对象（约第 489 行）
```javascript
const LETTER_CONFIG = {
```

### 修改内容
```javascript
const LETTER_CONFIG = {
    // 修改歌手名字
    artistName: '你的名字',
    
    // 修改标题
    title: '给你的一封信',
    
    // 修改日期
    signatureDate: '2025.12.30',
    
    // 修改正文
    paragraphs: [
        '这是第一段内容...',
        '这是第二段内容...',
        {
            type: 'quote',
            content: '这是一句引用<br>可以换行'
        },
        '继续写更多段落...'
    ]
};
```

### 保存并刷新浏览器
按 `Ctrl+S`（Windows）或 `Cmd+S`（Mac）保存，刷新页面查看效果

---

## 🎨 修改配色（5 分钟）

### 找到 `<style>` 标签（约第 8 行）

### 全局替换颜色
使用编辑器的「查找替换」功能（`Ctrl+H` 或 `Cmd+H`）

**复古蓝灰色调**（当前配色）:
```
#4a6b7c  →  主色调（标题、边框）
#7a94a8  →  次要色（文字、装饰）
#9fb4c7  →  强调色（邮票、分隔线）
#d5e5ea  →  背景色
```

**替换为其他配色方案**:

**粉色少女风**:
```
#4a6b7c  →  #c97c9f
#7a94a8  →  #e8a5c4
#9fb4c7  →  #f4c4d8
#d5e5ea  →  #fceef5
```

**森林绿色**:
```
#4a6b7c  →  #4a7c5f
#7a94a8  →  #6fa888
#9fb4c7  →  #9fc7b4
#d5e5ea  →  #e5f2ea
```

**暖橙色调**:
```
#4a6b7c  →  #c97c4a
#7a94a8  →  #e8a576
#9fb4c7  →  #f4c49f
#d5e5ea  →  #fcf0e5
```

---

## 📊 查看打开次数

### 在浏览器控制台
1. 按 `F12` 打开开发者工具
2. 切换到「Console」标签
3. 输入以下命令：

**查看当前计数**:
```javascript
localStorage.getItem('letter_open_count')
```

**重置计数**:
```javascript
resetOpenCount()
```

**手动设置计数**:
```javascript
localStorage.setItem('letter_open_count', 1000)
location.reload()  // 刷新页面查看
```

---

## 🐛 常见问题快速解决

### 问题 1: 点击信封没反应
**解决**:
1. 检查浏览器控制台是否有错误（按 F12）
2. 确认 JavaScript 代码没有被修改
3. 尝试用无痕模式打开

### 问题 2: 移动端显示异常
**解决**:
1. 确认 `<meta name="viewport">` 标签存在
2. 清除浏览器缓存
3. 使用 Chrome 移动端模拟器测试

### 问题 3: 计数不增加
**解决**:
1. 检查浏览器是否启用了 localStorage
2. 无痕模式不会保存计数
3. 查看控制台是否有 JS 错误

### 问题 4: 字体不显示
**解决**:
1. 当前使用系统字体，无需外部加载
2. 如需特殊字体，需添加 `@font-face` 或 Google Fonts 链接

---

## 📂 文件选择指南

**我应该使用哪个文件？**

| 情况 | 使用文件 | 原因 |
|------|---------|------|
| 快速部署 | `index.html` | 单文件，最简单 |
| 需要频繁修改样式 | `index-modular.html` | CSS 独立，易修改 |
| 团队协作 | `index-modular.html` | 职责分离 |
| CDN 部署 | `index.html` | 一次请求，速度快 |

---

## 🚀 进阶功能

### 添加背景音乐
在 `<body>` 标签底部添加：
```html
<audio id="bgMusic" loop>
    <source src="your-music.mp3" type="audio/mpeg">
</audio>
<script>
    document.getElementById('envelopeContainer').addEventListener('click', function() {
        document.getElementById('bgMusic').play();
    }, { once: true });
</script>
```

### 添加分享按钮
在信纸底部添加：
```html
<button onclick="shareContent()">分享这封信</button>
<script>
function shareContent() {
    if (navigator.share) {
        navigator.share({
            title: '致粉丝的信',
            text: '来看看这封特别的信',
            url: window.location.href
        });
    } else {
        // 复制链接
        navigator.clipboard.writeText(window.location.href);
        alert('链接已复制！');
    }
}
</script>
```

### 接入 Google Analytics
在 `<head>` 标签内添加：
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
  
  // 追踪拆封事件
  document.getElementById('envelopeContainer').addEventListener('click', function() {
      gtag('event', 'open_letter', {
          'event_category': 'engagement',
          'event_label': 'envelope_opened'
      });
  }, { once: true });
</script>
```

---

## 📖 更多帮助

- **完整文档**: 阅读 `README.md`
- **部署详解**: 阅读 `DEPLOY.md`
- **文件说明**: 阅读 `FILES.md`
- **代码注释**: 查看 `index.html` 源码注释

---

## ✅ 部署检查清单

部署前确认：
- [ ] 已修改配置内容（名字、日期、文字等）
- [ ] 已在本地浏览器测试
- [ ] 移动端和桌面端都正常显示
- [ ] 点击信封能正常拆封
- [ ] 计数器正常工作

部署后确认：
- [ ] 域名能正常访问
- [ ] HTTPS 证书生效（显示锁图标）
- [ ] 所有功能正常
- [ ] 加载速度正常（3秒内）

---

## 🎉 成功案例

**典型配置时间**:
- 内容修改: 3 分钟
- 配色修改: 5 分钟
- Vercel 部署: 2 分钟
- DNS 生效: 10-30 分钟

**总计**: 约 20-40 分钟即可完成从修改到上线的全过程

---

**祝你顺利！有问题随时查看其他文档 📚**

