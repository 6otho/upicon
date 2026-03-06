# 🌌 Cloudflare Serverless Icon & Image Hub
> 基于 Cloudflare 生态（Workers + R2 + KV）构建的零成本、高颜值、双端双角色云端图标库 / 图床系统，完美适配 Emby、Quantumult X、Surge 等软件的远程图标订阅规范。

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)
![Telegram](https://img.shields.io/badge/Telegram-Bot%20API-2CA5E0?logo=telegram&logoColor=white)

---

## ✨ 核心特性 / Features
- 🆓 **完全零成本**：依托 Cloudflare 免费额度，无需购买服务器。  
- 🎨 **高颜值 UI**：暗黑科幻风 + Emby 媒体库风格底纹，毛玻璃 Glassmorphism 质感。  
- 👥 **双身份隔离**：  
  - `游客 / 专用区`：独立上传密码，生成 `/guest.json` 专属订阅。  
  - `管理员区`：超级密码登入，生成 `/admin.json` 专属订阅。  
- 📊 **可视化管理面板**：管理员可直接在网页端预览、管理、彻底删除图标及缓存。  
- 🤖 **Telegram 深度联动**：  
  - 网页端游客上传 → 自动推送通知到 TG 管理群。  
  - TG 机器人直接发图 → 静默无感知上传至管理员库。  
- 🔗 **一键生成标准 JSON**：自动构建适用于代理软件和媒体服务器的标准数组格式 JSON。

---

## 🛠️ 部署准备 / Prerequisites
在开始部署前，请准备以下内容：

1. 一个 **Cloudflare 账号**  
2. 一个托管在 Cloudflare 上的 **域名**（用于绑定 R2 公开访问）  
3. 一个 **Telegram Bot Token** 与 **TG 群组 ID**

获取方式：
- 向 **@BotFather** 发送 `/newbot` 创建机器人获取 Token  
- 向 **@RawDataBot** 发送消息或拉入群组获取 Chat ID（通常以 `-` 或 `-100` 开头）

---

## 🚀 部署步骤 / Deployment Steps

### 1️⃣ 创建 R2 存储桶（用于存放图片）

1. 登录 Cloudflare 控制台 → **R2**
2. 点击 **Create bucket**
3. 填写名称（例如 `my-icons-bucket`）
4. 进入 Bucket → **Settings**
5. 找到 **Public access → Custom Domains**
6. 绑定一个 CF 域名（例如 `img.yourdomain.com`）

⚠️ 记住最终的公开地址，例如：

```
https://img.yourdomain.com
```

---

### 2️⃣ 创建 KV 命名空间（用于存储 JSON 数据）

进入：

```
Storage & Databases → KV
```

创建一个命名空间，例如：

```
ICON_DB
```

---

### 3️⃣ 部署 Worker

进入：

```
Workers & Pages → Create application → Create Worker
```

创建 Worker，例如：

```
icon-api
```

然后：

1. 点击 **Edit Code**
2. 用项目中的 `worker.js` **完全覆盖默认代码**
3. 点击 **Deploy**

---

### 4️⃣ 绑定资源与环境变量（核心配置）

进入 Worker：

```
Settings → Variables
```

#### KV 绑定

| 名称 | 资源 |
|---|---|
| `ICON_KV` | 第二步创建的 KV |

#### R2 绑定

| 名称 | 资源 |
|---|---|
| `ICON_R2` | 第一步创建的 Bucket |

#### 环境变量

| 变量 | 说明 | 示例 |
|---|---|---|
| `GUEST_PASSWORD` | 游客上传密码 | guest123 |
| `ADMIN_PASSWORD` | 管理员后台密码 | admin888 |
| `TG_BOT_TOKEN` | Telegram Bot Token | 123456:ABC |
| `ADMIN_CHAT_ID` | 接收通知的 TG ID | -100123456789 |
| `R2_PUBLIC_URL` | R2 自定义域名 | https://img.xxx.com |

⚠️ **注意：结尾不要带 `/`**

---

### 5️⃣ 激活 Telegram Webhook

浏览器访问：

```
https://api.telegram.org/bot<TG_BOT_TOKEN>/setWebhook?url=https://<Worker域名>/webhook/tg/<TG_BOT_TOKEN>
```

成功返回：

```
{"ok":true,"result":true}
```

---

# 🎮 使用方法

## 游客上传

访问：

```
https://你的Worker域名/
```

填写：

- 图标名称
- 游客密码
- 上传图片

上传成功后会生成：

- 图床直链
- `guest.json` 订阅地址

---

## 管理员后台

访问：

```
https://你的Worker域名/admin
```

输入 `ADMIN_PASSWORD` 登录。

功能：

- 管理员直传图标
- 可视化图标列表
- 彻底删除（同步清理 R2 + KV）

---

## Telegram 上传

1️⃣ 打开你的 TG 机器人  
2️⃣ 发送图片  
3️⃣ Caption 填写图标名称（例如 `netflix`）

上传成功后自动加入管理员库。

---

# 📄 JSON 接口格式

```json
{
  "name": "专用共享图标库",
  "description": "基于 Cloudflare Workers 自建的图标分发库",
  "icons": [
    {
      "name": "wechat",
      "url": "https://img.xxx.com/guest/wechat_17000000.png"
    },
    {
      "name": "alipay",
      "url": "https://img.xxx.com/admin/alipay_17000000.png"
    }
  ]
}
```

订阅地址：

```
游客订阅
https://你的Worker域名/guest.json
```

```
管理员订阅
https://你的Worker域名/admin.json
```

---

# ⚠️ 免责声明

本项目基于 Cloudflare 免费版构建，请遵守 Cloudflare 服务条款。

请勿泄露上传密码，以防止恶意消耗 R2 免费额度（每月约：

- 1000 万次读取
- 100 万次写入）

---

<p align="center">
Made with ❤️ by Cloudflare Workers
</p>
