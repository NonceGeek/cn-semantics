# 快速部署指南

## 🚀 最快 5 分钟部署到 letter.yinyuke.com

### 准备工作
- ✅ 确保你拥有域名 `yinyuke.com` 的管理权限
- ✅ 准备好 `index.html` 文件

---

## 推荐方案：Vercel（最简单）

### 步骤 1：注册 Vercel
访问 [vercel.com](https://vercel.com/signup) 并注册（推荐使用 GitHub 登录）

### 步骤 2：部署项目

**方法 A - 使用 Web 界面（无需命令行）**：
1. 登录 Vercel 后，点击「Add New...」→「Project」
2. 选择「Import Git Repository」或「Deploy from template」
3. 如果没有 Git 仓库，选择「Browse」直接上传 `index.html`
4. 项目名称填写：`letter-yinyuke`
5. 点击「Deploy」，等待部署完成
6. 会获得一个临时域名，如：`letter-yinyuke.vercel.app`

**方法 B - 使用命令行**：
```bash
# 安装 Vercel CLI
npm install -g vercel

# 在项目目录运行
cd /Users/liaohua/letter_for_fans
vercel

# 按提示操作：
# ? Set up and deploy? [Y/n] → Y
# ? Which scope? → 选择你的账号
# ? Link to existing project? [y/N] → N
# ? What's your project's name? → letter-yinyuke
# ? In which directory is your code located? → ./
```

### 步骤 3：绑定自定义域名

1. 在 Vercel 项目页面，点击「Settings」→「Domains」
2. 输入 `letter.yinyuke.com`，点击「Add」
3. Vercel 会提示你配置 DNS 记录

### 步骤 4：配置 DNS

登录你的域名管理平台（如阿里云、腾讯云、Cloudflare 等），添加以下记录：

```
类型：CNAME
主机记录：letter
记录值：cname.vercel-dns.com
TTL：600（或默认）
```

**或使用 A 记录**（如果 CNAME 不可用）：
```
类型：A
主机记录：letter
记录值：76.76.21.21
TTL：600
```

### 步骤 5：等待生效

- DNS 生效时间：5 分钟 ~ 2 小时
- 访问 `https://letter.yinyuke.com` 查看效果
- Vercel 会自动配置 HTTPS 证书

---

## 备选方案：Cloudflare Pages

### 为什么选择 Cloudflare？
- 全球 CDN 加速，国内访问速度更快
- 免费 SSL 证书
- 无限带宽
- 如果域名已在 Cloudflare 托管，配置更简单

### 部署步骤

1. **登录 Cloudflare**  
   访问 [dash.cloudflare.com](https://dash.cloudflare.com)

2. **创建 Pages 项目**  
   - 左侧菜单选择「Workers & Pages」
   - 点击「Create application」→「Pages」→「Upload assets」
   - 项目名称：`letter-yinyuke`
   - 直接拖拽 `index.html` 文件上传
   - 点击「Deploy site」

3. **绑定自定义域名**  
   - 部署完成后，点击「Custom domains」
   - 点击「Set up a custom domain」
   - 输入 `letter.yinyuke.com`
   - 如果域名在 Cloudflare，会自动配置 DNS
   - 如果域名不在 Cloudflare，按提示添加 CNAME 记录

4. **访问网站**  
   等待几分钟后访问 `https://letter.yinyuke.com`

---

## 备选方案：GitHub Pages

### 适合场景
- 已有 GitHub 账号
- 希望代码开源或私有托管
- 免费且稳定

### 部署步骤

1. **创建 GitHub 仓库**
   ```bash
   # 在项目目录
   git init
   git add index.html README.md
   git commit -m "Initial commit: Letter for fans"
   
   # 在 GitHub 创建仓库后
   git remote add origin https://github.com/你的用户名/letter-for-fans.git
   git branch -M main
   git push -u origin main
   ```

2. **启用 GitHub Pages**
   - 进入仓库「Settings」→「Pages」
   - Source 选择：`main` 分支，`/ (root)` 目录
   - 点击「Save」
   - 会生成一个 `https://你的用户名.github.io/letter-for-fans` 地址

3. **配置自定义域名**
   - 在「Custom domain」输入 `letter.yinyuke.com`
   - 勾选「Enforce HTTPS」
   - 到域名 DNS 添加记录：
     ```
     类型：CNAME
     主机记录：letter
     记录值：你的用户名.github.io
     ```

4. **等待生效**
   大约 10-30 分钟后访问 `https://letter.yinyuke.com`

---

## 备选方案：传统服务器（适合有服务器的用户）

### 前置条件
- 已有云服务器（阿里云、腾讯云、AWS 等）
- 服务器已安装 Nginx 或 Apache
- 有 SSH 访问权限

### Nginx 部署步骤

1. **上传文件到服务器**
   ```bash
   # 使用 SCP 上传
   scp index.html root@你的服务器IP:/var/www/letter/
   
   # 或使用 SFTP 工具（如 FileZilla）上传
   ```

2. **配置 Nginx**
   ```bash
   # SSH 连接服务器
   ssh root@你的服务器IP
   
   # 创建网站目录
   mkdir -p /var/www/letter
   
   # 编辑 Nginx 配置
   nano /etc/nginx/sites-available/letter.yinyuke.com
   ```

3. **Nginx 配置文件内容**
   ```nginx
   server {
       listen 80;
       listen [::]:80;
       server_name letter.yinyuke.com;
       
       root /var/www/letter;
       index index.html;
       
       # 日志配置
       access_log /var/log/nginx/letter_access.log;
       error_log /var/log/nginx/letter_error.log;
       
       # 主配置
       location / {
           try_files $uri $uri/ =404;
       }
       
       # 缓存静态资源
       location ~* \.(html|css|js|jpg|jpeg|png|gif|ico|svg)$ {
           expires 7d;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

4. **启用站点并重启 Nginx**
   ```bash
   # 创建软链接
   ln -s /etc/nginx/sites-available/letter.yinyuke.com /etc/nginx/sites-enabled/
   
   # 测试配置
   nginx -t
   
   # 重启 Nginx
   systemctl reload nginx
   ```

5. **配置 SSL 证书（使用 Let's Encrypt）**
   ```bash
   # 安装 Certbot
   apt install certbot python3-certbot-nginx
   
   # 自动配置 SSL
   certbot --nginx -d letter.yinyuke.com
   
   # 按提示操作，Certbot 会自动：
   # - 获取 SSL 证书
   # - 修改 Nginx 配置
   # - 设置自动续期
   ```

6. **配置域名 DNS**
   ```
   类型：A
   主机记录：letter
   记录值：你的服务器IP地址
   TTL：600
   ```

7. **验证部署**
   ```bash
   # 检查服务状态
   systemctl status nginx
   
   # 测试访问
   curl -I https://letter.yinyuke.com
   ```

---

## DNS 配置详解

### 常见 DNS 服务商配置入口

| 服务商 | 配置入口 |
|--------|----------|
| 阿里云 | 控制台 → 域名 → 解析设置 |
| 腾讯云 | 控制台 → DNSPod → 我的域名 |
| Cloudflare | Dashboard → DNS → Records |
| 名品堂 | 管理中心 → 域名管理 → DNS 解析 |
| GoDaddy | My Products → Domains → DNS |

### CNAME vs A 记录

**CNAME（推荐）**：
- ✅ 自动跟随目标 IP 变化
- ✅ 适合 CDN 和云服务
- ❌ 不能用于根域名（如 `yinyuke.com`）

**A 记录**：
- ✅ 可用于根域名
- ✅ 解析速度略快
- ❌ IP 变化需手动更新

---

## 验证部署是否成功

### 1. DNS 生效检查
```bash
# 查询 DNS 记录
nslookup letter.yinyuke.com

# 或使用 dig
dig letter.yinyuke.com
```

### 2. HTTPS 证书检查
访问 `https://letter.yinyuke.com`，检查浏览器地址栏是否显示锁图标

### 3. 功能测试清单
- [ ] 页面正常加载，显示信封
- [ ] 点击信封后，出现拆封动画
- [ ] 信纸内容正确显示
- [ ] 打开次数计数器正常工作
- [ ] 移动端显示正常
- [ ] 桌面端视差效果正常

---

## 性能优化建议

### 1. 启用 Gzip 压缩（Nginx）
```nginx
gzip on;
gzip_types text/html text/css application/javascript;
gzip_min_length 1000;
```

### 2. 设置缓存策略
- HTML: 不缓存或短时间缓存（适合频繁更新）
- CSS/JS: 长时间缓存（适合静态资源）

### 3. 使用 CDN
- Vercel/Cloudflare Pages 自带全球 CDN
- 传统服务器可接入阿里云 CDN、腾讯云 CDN

---

## 常见问题排查

### 域名无法访问
1. 检查 DNS 是否生效（使用 `nslookup`）
2. 确认服务器防火墙开放 80/443 端口
3. 检查 Nginx/服务器是否正常运行

### HTTPS 证书错误
1. 确认 SSL 证书是否过期
2. Vercel/Cloudflare 自动配置，等待几分钟
3. Let's Encrypt 证书 90 天有效期，需设置自动续期

### 移动端显示异常
1. 检查 `<meta name="viewport">` 标签是否存在
2. 清除浏览器缓存
3. 使用 Chrome DevTools 的移动端模拟器测试

---

## 获取帮助

- 📧 检查项目 `README.md` 中的详细说明
- 💬 查看代码注释了解功能实现
- 🐛 遇到问题可在 GitHub 提交 Issue

---

**祝部署顺利！** 🎉

