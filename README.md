# 🌌 Cloudflare Serverless Icon & Image Hub
> 基于 Cloudflare 生态 (Workers + R2 + KV) 构建的零成本、高颜值、双端双角色云端图标库/图床系统。
> 完美适配 Emby、Quantumult X、Surge 等软件的远程图标订阅规范。

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)
![Telegram](https://img.shields.io/badge/Telegram-Bot%20API-2CA5E0?logo=telegram&logoColor=white)

---

## ✨ 核心特性 / Features

- 🆓 **完全零成本**：依托 Cloudflare 免费额度，无需购买服务器。
- 🎨 **高颜值 UI**：暗黑科幻风 + Emby 媒体库风格底纹，毛玻璃 Glassmorphism 质感。
- 👥 **双身份隔离隔离**：
  - `游客/专用区`：独立上传密码，生成 `/guest.json` 专属订阅。
  - `管理员区`：超级密码登入，生成 `/admin.json` 专属订阅。
- 📊 **可视化管理面板**：管理员可直接在网页端预览、管理、彻底删除图标及缓存。
- 🤖 **Telegram 深度联动**：
  - 网页端游客上传 👉 自动推送通知到 TG 管理群。
  - TG 机器人直接发图 👉 静默无感知上传至管理员库。
- 🔗 **一键生成标准 JSON**：全自动构建适用于各种代理软件及媒体服务器标准数组格式的 JSON 文件。

---

## 🛠️ 部署准备工作 / Prerequisites

在开始之前，你需要准备好以下三样东西：
1. 一个 **Cloudflare 账号**。
2. 一个托管在 Cloudflare 上的**域名**（用于绑定 R2 存储桶公开访问）。
3. 一个 **Telegram Bot Token** 和你的 **TG 群组 ID**。
   > *向 `@BotFather` 发送 `/newbot` 申请机器人获取 Token。*
   > *向 `@RawDataBot` 发送消息或拉入群组，获取带有 `-` 或 `-100` 开头的 Chat ID。*

---

## 🚀 详细部署步骤 / Deployment Steps

### 第一步：创建 R2 对象存储桶 (存放图片)

1. 登录 Cloudflare 控制台，点击左侧菜单的 **`R2`**。
2. 点击右上角 **`创建存储桶 (Create bucket)`**，名称随意填写（例如：`my-icons-bucket`）。
3. 创建成功后，进入该存储桶，点击顶部导航栏的 **`设置 (Settings)`**。
4. 向下滚动找到 **`公开访问 (Public access)`** -> **`自定义域 (Custom Domains)`**。
5. 点击 **`连接域`**，输入你托管在 CF 上的一个二级域名（例如：`img.yourdomain.com`）。
6. **⚠️ 极其重要：** 等待域名生效后，请记住这个带有 `https://` 的完整域名，后面会用到。

### 第二步：创建 KV 命名空间 (存放 JSON 数据库)

1. 点击左侧菜单的 **`存储和数据库 (Storage & Databases)`** -> **`KV`**。
2. 点击 **`创建命名空间 (Create a namespace)`**。
3. 名称随意填写（例如：`ICON_DB`），点击添加。请记住这个名字。

### 第三步：部署 Worker 代码

1. 点击左侧菜单的 **`Workers & Pages`**。
2. 点击 **`创建应用程序 (Create application)`** -> **`创建 Worker (Create Worker)`**。
3. 给你的 Worker 起个名字（例如 `icon-api`），点击 **`部署 (Deploy)`**。
4. 部署完成后，点击 **`编辑代码 (Edit code)`**。
5. 将本项目中的 `worker.js` 代码 **全选复制并覆盖** 掉左侧代码框里的所有内容。
6. 点击右上角的 **`部署 (Deploy)`** 保存代码。

### 第四步：绑定环境变量与资源 (🌟 核心配置)

返回 Worker 的主界面，点击 **`设置 (Settings)`** -> **`变量和绑定 (Variables)`**，依次完成以下三个模块的配置：

#### 1. 绑定 KV 数据库
- 点击 **`添加绑定 (Add binding)`** -> 选择 **`KV 命名空间`**。
- **变量名称** 必须严格填写：`ICON_KV`
- **KV 命名空间** 选择你在第二步创建的 KV。

#### 2. 绑定 R2 存储桶
- 点击 **`添加绑定 (Add binding)`** -> 选择 **`R2 存储桶`**。
- **变量名称** 必须严格填写：`ICON_R2`
- **R2 存储桶** 选择你在第一步创建的 Bucket。

#### 3. 添加环境变量
在 **`环境变量 (Environment Variables)`** 区域，点击添加以下 5 个变量：

| 变量名称 (Variable Name) | 变量值 (Value) 说明 | 示例 |
| :--- | :--- | :--- |
| `GUEST_PASSWORD` | 游客在网页端上传需要的密码 | `guest123` |
| `ADMIN_PASSWORD` | 管理员登入后台的超级密码 | `admin888` |
| `TG_BOT_TOKEN` | Telegram 机器人的 Token | `123456:ABC-DEF...` |
| `ADMIN_CHAT_ID` | 接收游客上传通知的 TG 账号/群组 ID | `-100123456789` |
| `R2_PUBLIC_URL` | 第一步绑定的 R2 自定义域名 (必须带 https，**结尾不要斜杠**) | `https://img.xxx.com` |

配置完成后，点击 **`部署 (Deploy)`** 保存所有环境变量。

### 第五步：激活 Telegram Webhook

为了让 Telegram 收到图片后自动推送到你的 Worker，需要在浏览器中手动访问一次以下链接（请替换括号及里面的内容）：

```http
https://api.telegram.org/bot【替换你的TG_BOT_TOKEN】/setWebhook?url=https://【替换你的Worker访问域名】/webhook/tg/【替换你的TG_BOT_TOKEN】
成功标志： 浏览器返回 {"ok":true,"result":true,"description":"Webhook was set"}。
🎉 至此，全部部署工作完成！
🎮 使用说明 / How to Use
1. 游客上传 (专用图标区)
访问你的 Worker 主页（如 https://icon-api.xxx.workers.dev/）。
填写名称、游客密码并选择图片，点击上传。
成功后将自动弹出 独立图床直链 和 游客 JSON 订阅链接。
2. 管理员控制台
访问 你的Worker域名/admin。
输入 ADMIN_PASSWORD 登入。
左侧： 管理员专属直传通道。
右侧： 数据大屏，可预览所有图标、查看归属分区，并支持一键永久删除（同步清理 R2 与 JSON 缓存）。
3. Telegram 极速上传
直接打开你的 Telegram 机器人。
发送一张图片（发送时勾选“原图”或压缩图皆可）。
在 添加说明 (Caption) 处填写图标名称（例如：netflix）。
机器人回复“上传成功”后，该图标已自动归入你的管理员 JSON 中。
📄 JSON 接口规范说明
生成的 JSON 完美符合 Emby 插件及各大代理软件的规范，结构如下：
code
JSON
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
🔗 游客订阅地址：https://你的Worker域名/guest.json
🔗 管理员订阅地址：https://你的Worker域名/admin.json
⚠️ 免责声明 / Disclaimer
本项目基于 Cloudflare 免费版构建，请遵守 Cloudflare 服务条款。
不要将上传密码轻易泄露给不可信的第三方，以免 R2 存储桶免费额度（每月 1000 万次读取 / 100 万次写入）被恶意消耗。
<p align="center">Made with ❤️ by Cloudflare Workers</p>
```
