# 🌌 Cloudflare Serverless Icon & Image Hub
> 基于 Cloudflare 生态（Workers + R2 + KV）构建的零成本、高颜值、双端双角色云端图标库 / 图床系统，完美适配 Emby、Quantumult X、Surge 等软件的远程图标订阅规范。

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)
![Telegram](https://img.shields.io/badge/Telegram-Bot%20API-2CA5E0?logo=telegram&logoColor=white)

---

# ✨ 核心特性 / Features

- 🆓 **完全零成本**：依托 Cloudflare 免费额度，无需购买服务器。
- 🎨 **高颜值 UI**：暗黑科幻风 + Emby 媒体库风格底纹，毛玻璃 Glassmorphism 质感。
- 👥 **双身份隔离**：
  - `游客 / 专用区`：独立上传密码，生成 `/guest.json` 专属订阅。
  - `管理员区`：超级密码登入，生成 `/admin.json` 专属订阅。
- 📊 **可视化管理面板**：管理员可直接在网页端预览、管理、彻底删除图标及缓存。
- 🤖 **Telegram 深度联动**：
  - 网页端游客上传 → 自动推送通知到 TG 管理群
  - TG 机器人直接发图 → 静默无感知上传至管理员库
- 🔗 **自动生成 JSON**：构建适用于代理软件及媒体服务器的标准 JSON 图标订阅文件。

---

# 🛠️ 部署准备 / Prerequisites

在部署之前，请准备以下内容：

1️⃣ 一个 **Cloudflare 账号**

2️⃣ 一个托管在 Cloudflare 上的 **域名**

3️⃣ 一个 **Telegram Bot Token** 与 **TG 群组 ID**

获取方式：

- 向 `@BotFather` 发送 `/newbot` 创建机器人获取 **Bot Token**
- 向 `@RawDataBot` 发送消息获取 **Chat ID**

通常 Chat ID 格式：

```
-123456789
或
-100123456789
```

---

# 🚀 部署步骤 / Deployment Steps

## 第一步：创建 R2 存储桶（用于存放图片）

登录 Cloudflare 控制台：

```
R2 → Create bucket
```

创建一个存储桶，例如：

```
my-icons-bucket
```

然后：

```
Settings → Public access → Custom Domains
```

绑定一个域名，例如：

```
img.yourdomain.com
```

最终你的 R2 访问地址类似：

```
https://img.yourdomain.com
```

⚠️ 请记住这个地址，后面需要使用。

---

# 第二步：创建 KV 数据库（存储 JSON）

进入：

```
Storage & Databases → KV
```

创建命名空间，例如：

```
ICON_DB
```

---

# 第三步：部署 Worker

进入：

```
Workers & Pages → Create Application → Create Worker
```

创建 Worker，例如：

```
icon-api
```

部署完成后：

```
Edit Code
```

将项目中的 `worker.js` **完整覆盖默认代码**，然后点击：

```
Deploy
```

---

# 第四步：绑定资源与变量（核心配置）

进入：

```
Worker → Settings → Variables
```

## 1️⃣ KV 绑定

| 变量名 | 绑定资源 |
|---|---|
| `ICON_KV` | 第二步创建的 KV |

---

## 2️⃣ R2 绑定

| 变量名 | 绑定资源 |
|---|---|
| `ICON_R2` | 第一步创建的 Bucket |

---

## 3️⃣ 环境变量

添加以下变量：

| 变量名称 | 说明 | 示例 |
|---|---|---|
| `GUEST_PASSWORD` | 游客上传密码 | guest123 |
| `ADMIN_PASSWORD` | 管理员后台密码 | admin888 |
| `TG_BOT_TOKEN` | Telegram Bot Token | 123456:ABC |
| `ADMIN_CHAT_ID` | 接收上传通知的 TG ID | -100123456789 |
| `R2_PUBLIC_URL` | R2 自定义域名 | https://img.xxx.com |
| `CUSTOM_DOMAIN` | Worker 自定义访问域名（生成订阅链接） | https://icon.xxx.com |

⚠️ 注意：

- `R2_PUBLIC_URL` **不要以 `/` 结尾**
- `CUSTOM_DOMAIN` **必须带 https**
- 如果没有自定义域名，可以填写默认 Worker 地址：

```
https://icon-api.xxx.workers.dev
```

---

# 第五步：激活 Telegram Webhook

浏览器访问以下地址：

```
https://api.telegram.org/bot<TG_BOT_TOKEN>/setWebhook?url=https://<Worker域名>/webhook/tg/<TG_BOT_TOKEN>
```

示例：

```
https://api.telegram.org/bot123456:ABC/setWebhook?url=https://icon.xxx.com/webhook/tg/123456:ABC
```

成功返回：

```
{"ok":true,"result":true}
```

说明 Webhook 已成功设置。

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
- 游客 JSON 订阅地址

---

# 管理员后台

访问：

```
https://你的Worker域名/admin
```

输入：

```
ADMIN_PASSWORD
```

即可进入后台。

后台功能：

- 管理员直传图标
- 查看所有图标
- 删除图标（同步删除 R2 + KV）

---

# Telegram 上传

打开你的 **Telegram Bot**

发送图片，并在 Caption 填写名称，例如：

```
netflix
```

机器人返回：

```
上传成功
```

该图标会自动加入 **管理员 JSON**

---

# 📄 JSON 接口格式

生成的 JSON 结构如下：

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

游客订阅：

```
https://你的Worker域名/guest.json
```

管理员订阅：

```
https://你的Worker域名/admin.json
```

---

# ⚠️ 免责声明

本项目基于 Cloudflare 免费额度运行，请遵守 Cloudflare 服务条款。

请勿泄露上传密码，否则可能导致 R2 免费额度被恶意消耗。

Cloudflare 免费额度（参考）：

- 每月约 **1000 万次读取**
- 每月约 **100 万次写入**

---

<p align="center">
Made with ❤️ by Cloudflare Workers
</p>
