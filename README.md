# 🌌 Cloudflare Serverless Icon & Image Hub

基于 **Cloudflare 生态（Workers + R2 + KV）** 构建的零成本、高颜值、双端双角色云端图标库 / 图床系统。  
完美适配 **Emby、Quantumult X、Surge** 等软件的远程图标订阅规范。

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)
![Telegram](https://img.shields.io/badge/Telegram-Bot%20API-2CA5E0?logo=telegram&logoColor=white)

---

# ✨ 核心特性 / Features

🆓 **完全零成本**  
依托 Cloudflare 免费额度，无需购买服务器。

🎨 **高颜值 UI**  
暗黑科幻风 + Emby 媒体库风格底纹，毛玻璃 Glassmorphism 设计。  
全新支持 **🌞 / 🌙 亮暗模式无缝切换**。

👥 **双身份角色隔离**

- **游客 / 专用区**
  - 独立上传密码
  - 仅支持单图上传
  - 自动生成 `/guest.json` 订阅

- **管理员区**
  - 超级密码登录
  - 支持批量上传
  - 支持自定义合集分类
  - 自动生成 `/admin.json` 订阅

📊 **可视化管理面板**

- 在线预览图标
- 管理图标
- 一键彻底删除缓存

🤖 **Telegram 双机器人深度联动**

🛡️ **管理员 Bot**

- 支持批量传图
- 发送 `/分类名` 自动创建并切换合集目录

🌍 **游客 Bot**

- 纯净版单图上传
- 完全隔离管理权限

🔔 **智能预警推送**

- 网页端上传
- 游客 Bot 上传

都会自动推送通知到管理员 TG 群，并附带 **一键彻底删除按钮**。

（管理员 Bot 上传默认静默入库，避免消息轰炸）

🔗 **自动配置**

内建 `/api/init` 路由，一键自动绑定 Telegram Webhook。

---

# 🛠️ 部署准备 / Prerequisites

在部署之前，请准备：

1️⃣ 一个 **Cloudflare 账号**

2️⃣ 一个托管在 Cloudflare 上的 **域名**

> ⚠️ Telegram 官方屏蔽 `*.workers.dev` 域名  
> 使用机器人 **必须绑定自定义域名**

3️⃣ **两个 Telegram Bot Token + 一个 TG 群组 ID**

获取方式：

### 创建机器人

向 **@BotFather** 发送：

```
/newbot
```

创建 **两个机器人**

- 管理员机器人
- 游客机器人

### 获取 Chat ID

将 **管理员机器人** 拉入你的管理群。

然后向 **@RawDataBot** 发送消息获取 Chat ID。

通常格式：

```
-123456789
```

或

```
-100123456789
```

---

# 🚀 部署步骤 / Deployment Steps

## 第一步：创建 R2 存储桶

进入 Cloudflare 控制台：

```
R2 → Create bucket
```

创建一个存储桶，例如：

```
my-icons-bucket
```

⚠️ 最新版本代码 **已内置 Worker 回源代理**

**无需为 R2 单独绑定域名**

---

## 第二步：创建 KV 数据库

进入：

```
Storage & Databases → KV
```

创建命名空间，例如：

```
ICON_DB
```

---

## 第三步：部署 Worker

进入：

```
Workers & Pages → Create Application → Create Worker
```

创建 Worker，例如：

```
icon-api
```

部署完成后点击：

```
Edit Code
```

将项目中的 **worker.js 完整覆盖默认代码**

然后点击：

```
Deploy
```

---

# 第四步：绑定资源与变量

进入：

```
Worker → Settings → Bindings
```

---

## 1️⃣ KV 绑定

| 变量名称 | KV 命名空间 |
|---|---|
| ICON_KV | ICON_DB |

---

## 2️⃣ R2 绑定

| 变量名称 | R2 存储桶 |
|---|---|
| ICON_R2 | my-icons-bucket |

---

## 3️⃣ 环境变量

| 变量名称 | 说明 | 示例 |
|---|---|---|
| GUEST_PASSWORD | 游客上传密码 | guest123 |
| ADMIN_PASSWORD | 管理员后台密码 | admin888 |
| TG_BOT_TOKEN | 管理员 Bot Token | 123456:ABC |
| GUEST_TG_BOT_TOKEN | 游客 Bot Token | 654321:XYZ |
| ADMIN_CHAT_ID | TG 群组 ID | -100123456789 |
| CUSTOM_DOMAIN | Worker 自定义域名（不带 https） | icon.yourdomain.com |

---

## 4️⃣ 绑定触发器域名

进入：

```
Settings → Triggers
```

添加自定义域名，例如：

```
icon.yourdomain.com
```

---

# 🎉 一键激活 Telegram Webhook

部署完成后直接访问：

```
https://你的域名/api/init
```

例如：

```
https://icon.yourdomain.com/api/init
```

如果返回：

```
🤖 Telegram Webhook 激活结果

🛡️ 管理员机器人
状态: Webhook was set

🌍 游客机器人
状态: Webhook was set
```

说明部署成功。

---

# 🎮 使用方法

## 🌍 游客上传

访问：

```
https://你的域名/
```

功能：

- 输入游客密码
- 单图极速上传
- 自动生成直链
- 自动通知 TG 群

---

## 🛡️ 管理员后台

访问：

```
https://你的域名/admin
```

功能：

- 批量上传
- 自定义合集
- 在线浏览图标
- 一键删除图标

---

# 🤖 Telegram 机器人使用

发送：

```
/start
```

查看菜单。

---

## 🛡️ 管理员机器人

### 上传图片

直接发送图片即可自动入库。

如果需要 **保留原文件名批量上传**

请选择：

```
作为文件 (Document)
```

发送。

### 切换合集

发送：

```
/合集名
```

例如：

```
/emby
```

自动创建并切换目录。

发送：

```
/admin
```

返回默认目录。

---

## 🌍 游客机器人

用户 **直接发送图片**：

- 自动生成随机名称
- 存入 guest 图标库
- 自动通知管理员群

---

# 📄 JSON 接口格式

生成的 JSON 示例：

```json
{
  "name": "我的专属图标库 (Admin)",
  "description": "基于 Cloudflare Workers 自建的图标分类分发库",
  "icons":[
    {
      "name": "wechat",
      "url": "https://icon.yourdomain.com/guest/wechat_17000000.png"
    },
    {
      "name": "alipay",
      "url": "https://icon.yourdomain.com/admin/emby/alipay_17000000.png"
    }
  ]
}
```

---

# 🔗 订阅地址

游客订阅：

```
https://你的域名/guest.json
```

管理员订阅：

```
https://你的域名/admin.json
```

分类订阅：

```
https://你的域名/admin/分类名.json
```

---

# ⚠️ 免责声明

本项目基于 **Cloudflare 免费额度**运行。

请勿泄露上传密码，以免被恶意消耗资源。

### Cloudflare 免费额度（参考）

R2 存储：

- 每月约 **1000 万次读取**
- 每月约 **100 万次写入**

KV 数据库：

- 每月约 **10 万次写入**
- 读取基本无限

Workers：

- **每日 10 万次请求**

对于 **个人 / 小规模共享使用完全足够**。

---

<p align="center">
Made with ❤️ by Cloudflare Workers
</p>
