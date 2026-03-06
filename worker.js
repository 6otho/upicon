export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const hostUrl = url.origin;

    // ==========================================
    // 🎨 共享的前端 CSS 样式 (暗黑 Emby 媒体库风格)
    // ==========================================
    const sharedCSS = `
      <style>
        body, html { margin: 0; padding: 0; min-height: 100%; font-family: 'Segoe UI', Roboto, sans-serif; background-color: #050608; background-image: radial-gradient(circle at 15% 20%, rgba(82, 181, 75, 0.12) 0%, transparent 50%), radial-gradient(circle at 85% 80%, rgba(0, 242, 254, 0.12) 0%, transparent 50%), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cg stroke='rgba(255,255,255,0.035)' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'%3E%3C!-- Play --%3E%3Ccircle cx='30' cy='30' r='12'/%3E%3Cpolygon points='28,25 28,35 36,30'/%3E%3C!-- Film --%3E%3Crect x='80' y='20' width='18' height='24' rx='2'/%3E%3Cpath d='M80 26h18M80 32h18M80 38h18M84 20v24M94 20v24'/%3E%3C!-- TV --%3E%3Crect x='25' y='80' width='22' height='16' rx='2'/%3E%3Cpath d='M31 80l5-5l5 5'/%3E%3Cpath d='M31 96h10'/%3E%3C!-- Disc --%3E%3Ccircle cx='88' cy='88' r='12'/%3E%3Ccircle cx='88' cy='88' r='4'/%3E%3C/g%3E%3C/svg%3E"); background-attachment: fixed; color: #e0e6ed; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .glass-panel { background: rgba(15, 18, 25, 0.65); backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px); border: 1px solid rgba(0, 242, 254, 0.15); border-radius: 24px; padding: 40px 30px; width: 85%; max-width: 400px; box-shadow: 0 25px 50px rgba(0,0,0,0.5), 0 0 40px rgba(0,242,254,0.05); text-align: center; position: relative; }
        .admin-panel { max-width: 900px; padding: 30px; margin: 40px 0; }
        h1 { margin: 0 0 20px 0; font-size: 28px; font-weight: 700; letter-spacing: 2px; background: linear-gradient(135deg, #fff, #00f2fe); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; margin-bottom: 20px; border: 1px solid; }
        .badge.guest { border-color: rgba(255,255,255,0.3); color: #aaa; background: rgba(255,255,255,0.05); }
        .badge.admin { border-color: rgba(0,242,254,0.5); color: #00f2fe; background: rgba(0,242,254,0.05); }
        .input-group { position: relative; margin-bottom: 20px; }
        .input-group input { width: 100%; padding: 15px 45px 15px 20px; background: rgba(255,255,255,0.03); border: 1.5px solid rgba(255,255,255,0.15); border-radius: 30px; color: white; font-size: 15px; box-sizing: border-box; outline: none; transition: all 0.3s; }
        .input-group input:focus { border-color: #00f2fe; background: rgba(0,242,254,0.05); box-shadow: 0 0 15px rgba(0,242,254,0.2); }
        .input-group input::placeholder { color: rgba(255,255,255,0.4); }
        .file-upload-label { display: block; width: 100%; padding: 15px 45px 15px 20px; background: rgba(255,255,255,0.03); border: 1.5px dashed rgba(255,255,255,0.2); border-radius: 30px; color: rgba(255,255,255,0.5); font-size: 15px; box-sizing: border-box; cursor: pointer; text-align: left; transition: all 0.3s; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 20px;}
        .file-upload-label:hover { background: rgba(0,242,254,0.05); border-color: #00f2fe; color: white; }
        .submit-btn { width: 100%; padding: 15px; background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%); color: #050608; border: none; border-radius: 30px; font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.3s; }
        .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,242,254,0.4); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .submit-btn.danger { background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%); box-shadow: none; padding: 8px 15px; font-size: 13px; color: white; border-radius: 20px;}
        .submit-btn.danger:hover { box-shadow: 0 5px 15px rgba(255,65,108,0.4); }
        .submit-btn.outline { background: transparent; border: 1px solid #ff416c; color: #ff416c; padding: 6px 15px; border-radius: 20px; font-size: 13px; font-weight: normal;}
        .submit-btn.outline:hover { background: rgba(255,65,108,0.1); box-shadow: 0 0 10px rgba(255,65,108,0.3); }
        .nav-links { margin-top: 20px; font-size: 13px; }
        .nav-links a { color: #00f2fe; text-decoration: none; margin: 0 10px; transition: 0.3s; }
        .nav-links a:hover { text-shadow: 0 0 10px rgba(0,242,254,0.8); }
        
        .modal { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); z-index: 100; align-items: center; justify-content: center; }
        .modal-content { background: #12151e; border: 1px solid #00f2fe; border-radius: 20px; padding: 30px; width: 90%; max-width: 450px; text-align: left; }
        .modal-content h3 { margin-top: 0; color: #00f2fe; }
        .copy-box { background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); padding: 12px; border-radius: 10px; margin-bottom: 15px; display: flex; align-items: center; justify-content: space-between; }
        .copy-box input { background: transparent; border: none; color: #fff; width: 100%; outline: none; font-family: monospace; }
        .copy-btn { background: rgba(0,242,254,0.2); color: #00f2fe; border: 1px solid #00f2fe; padding: 5px 10px; border-radius: 6px; cursor: pointer; font-size: 12px; transition: 0.2s;}
        .copy-btn:hover { background: #00f2fe; color: #000; }
        .table-container { width: 100%; overflow-x: auto; margin-top: 20px; text-align: left; }
        table { width: 100%; border-collapse: collapse; font-size: 14px; }
        th, td { padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); transition: all 0.3s ease; }
        th { color: #00f2fe; font-weight: normal; }
        .icon-preview { width: 30px; height: 30px; border-radius: 8px; object-fit: cover; vertical-align: middle; margin-right: 10px; background: rgba(255,255,255,0.05); }
      </style>
    `;

    // ==========================================
    // 🌐 路由 1：游客首页 (游客上传界面)
    // ==========================================
    if (request.method === 'GET' && path === '/') {
      const html = `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>专用图标上传</title>${sharedCSS}</head><body>
          <div class="glass-panel">
              <h1>Icon Upload</h1>
              <div class="badge guest">专用图标</div>
              <form id="uploadForm">
                  <div class="input-group">
                      <input type="text" name="icon_name" required placeholder="图标名称 (如 wechat)" autocomplete="off">
                  </div>
                  <div class="input-group">
                      <input type="password" name="password" required placeholder="游客访问密码">
                  </div>
                  <label for="file-upload" class="file-upload-label" id="file-name-display">选择图片 (PNG/JPG)</label>
                  <input id="file-upload" type="file" name="file" accept="image/*" required style="display:none;">
                  <button type="submit" class="submit-btn" id="submitBtn">上传至游客区</button>
              </form>
              <div class="nav-links">
                  <a href="${hostUrl}/guest.json" target="_blank">📄 查看游客 JSON</a>
                  <a href="/admin">⚙️ 管理员入口</a>
              </div>
          </div>

          <div class="modal" id="successModal">
              <div class="modal-content">
                  <h3>✅ 上传成功！</h3>
                  <p style="font-size:13px;color:#aaa;">你可以直接复制下方的链接配置到软件中。</p>
                  
                  <label style="font-size:12px;color:#00f2fe;">🔗 你的游客 JSON 订阅地址 (支持 Emby 等规范):</label>
                  <div class="copy-box">
                      <input type="text" id="jsonLink" readonly>
                      <button class="copy-btn" onclick="copyText('jsonLink')">复制</button>
                  </div>

                  <label style="font-size:12px;color:#00f2fe;">🖼️ 当前图片直链 (填入单图场景):</label>
                  <div class="copy-box">
                      <input type="text" id="imgLink" readonly>
                      <button class="copy-btn" onclick="copyText('imgLink')">复制</button>
                  </div>
                  
                  <button class="submit-btn" style="margin-top:10px;background:rgba(255,255,255,0.1);color:white;" onclick="document.getElementById('successModal').style.display='none'">关闭</button>
              </div>
          </div>

          <script>
              const fileInput = document.getElementById('file-upload');
              const display = document.getElementById('file-name-display');
              fileInput.addEventListener('change', e => {
                  display.textContent = e.target.files.length > 0 ? e.target.files[0].name : '选择图片 (PNG/JPG)';
                  display.style.borderColor = e.target.files.length > 0 ? '#00f2fe' : 'rgba(255,255,255,0.2)';
              });

              document.getElementById('uploadForm').addEventListener('submit', async e => {
                  e.preventDefault();
                  const btn = document.getElementById('submitBtn');
                  btn.textContent = '上传中...'; btn.disabled = true;
                  try {
                      const res = await fetch('/api/upload?role=guest', { method: 'POST', body: new FormData(e.target) });
                      const data = await res.json();
                      if(res.ok) {
                          document.getElementById('jsonLink').value = data.jsonUrl;
                          document.getElementById('imgLink').value = data.imgUrl;
                          document.getElementById('successModal').style.display = 'flex';
                          e.target.reset(); display.textContent = '选择图片 (PNG/JPG)';
                      } else { alert('❌ ' + data.error); }
                  } catch(err) { alert('❌ 网络错误'); } finally { btn.textContent = '上传至游客区'; btn.disabled = false; }
              });

              function copyText(id) {
                  const input = document.getElementById(id);
                  input.select(); document.execCommand('copy');
                  alert('复制成功！');
              }
          </script>
      </body></html>`;
      return new Response(html, { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
    }

    // ==========================================
    // 🛡️ 路由 2：管理员面板 (查看与编辑)
    // ==========================================
    if (request.method === 'GET' && path === '/admin') {
      const html = `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><title>管理员控制台</title>${sharedCSS}</head><body>
          
          <div class="glass-panel admin-panel" id="loginBox">
              <h1>Admin Login</h1>
              <div class="input-group">
                  <input type="password" id="adminPwd" placeholder="请输入管理员密码" onkeydown="if(event.key==='Enter') login()">
              </div>
              <button class="submit-btn" onclick="login()">登入控制台</button>
              <div class="nav-links"><a href="/">返回游客上传</a></div>
          </div>

          <div class="glass-panel admin-panel" id="dashboard" style="display:none; width: 95%;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px;">
                  <div style="text-align: left;">
                      <h1 style="margin: 0; font-size: 24px;">Admin Dashboard</h1>
                      <div class="badge admin" style="margin: 5px 0 0 0;">超级权限已验证</div>
                  </div>
                  <button class="submit-btn outline" style="width: auto; margin: 0;" onclick="logout()">退出登入</button>
              </div>
              
              <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap: 30px;">
                  
                  <div style="flex:1; min-width: 260px; background: rgba(0,0,0,0.3); padding: 25px; border-radius: 16px;">
                      <h3 style="margin-top:0; color:#00f2fe; font-size:16px; text-align:left;">⚡ 管理员直传</h3>
                      <form id="adminUploadForm">
                          <div class="input-group">
                              <input type="text" name="icon_name" required placeholder="图标名称 (如 emby)" autocomplete="off">
                          </div>
                          <label for="admin-file-upload" class="file-upload-label" id="admin-file-name-display">选择图片 (PNG/JPG)</label>
                          <input id="admin-file-upload" type="file" name="file" accept="image/*" required style="display:none;">
                          <button type="submit" class="submit-btn" id="adminSubmitBtn">上传至管理区</button>
                      </form>
                      <div class="nav-links" style="text-align:center; margin-top:20px;">
                          <a href="${hostUrl}/admin.json" target="_blank">📄 你的专属 Admin JSON</a>
                      </div>
                  </div>
                  
                  <div style="flex:2; min-width: 320px; text-align:left;">
                      <h3 style="margin-top:0; color:#00f2fe; font-size:16px;">
                          🗂️ 图标数据库管理 
                          <button onclick="loadList()" style="float:right; background:transparent; border:1px solid #00f2fe; color:#00f2fe; border-radius:6px; cursor:pointer; padding: 3px 10px;">刷新</button>
                      </h3>
                      <div class="table-container">
                          <table>
                              <thead><tr><th>预览</th><th>名称</th><th>所属分区</th><th>操作</th></tr></thead>
                              <tbody id="iconListBody"><tr><td colspan="4" style="text-align:center;">加载中...</td></tr></tbody>
                          </table>
                      </div>
                  </div>
              </div>
          </div>

          <script>
              let pwd = sessionStorage.getItem('adminPwd') || '';
              if(pwd) { login(pwd); }

              async function login(savedPwd) {
                  const inputPwd = savedPwd || document.getElementById('adminPwd').value;
                  if(!inputPwd) return;
                  const res = await fetch('/api/admin/list', { headers: { 'Authorization': inputPwd } });
                  if(res.ok) {
                      sessionStorage.setItem('adminPwd', inputPwd);
                      pwd = inputPwd;
                      document.getElementById('loginBox').style.display = 'none';
                      document.getElementById('dashboard').style.display = 'block';
                      renderList(await res.json());
                  } else {
                      if(!savedPwd) alert('密码错误');
                      sessionStorage.removeItem('adminPwd');
                  }
              }

              function logout() {
                  sessionStorage.removeItem('adminPwd');
                  pwd = '';
                  document.getElementById('dashboard').style.display = 'none';
                  document.getElementById('loginBox').style.display = 'block';
                  document.getElementById('adminPwd').value = '';
              }

              async function loadList() {
                  const res = await fetch('/api/admin/list', { headers: { 'Authorization': pwd } });
                  if(res.ok) renderList(await res.json());
              }

              function renderList(data) {
                  const tbody = document.getElementById('iconListBody');
                  tbody.innerHTML = '';
                  if(data.length === 0) return tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#888;">数据库空空如也</td></tr>';
                  
                  data.forEach(item => {
                      const tr = document.createElement('tr');
                      const roleTag = item.role === 'admin' ? '<span style="color:#00f2fe;font-weight:bold;">Admin</span>' : '<span style="color:#aaa">Guest</span>';
                      
                      tr.innerHTML = \`
                          <td><img src="\${item.url}" class="icon-preview" loading="lazy"></td>
                          <td><code>\${item.name}</code></td>
                          <td>\${roleTag}</td>
                          <td><button class="submit-btn danger" onclick="deleteIcon('\${item.key}', this)">删除</button></td>
                      \`;
                      tbody.appendChild(tr);
                  });
              }

              async function deleteIcon(key, btnElement) {
                  if(!confirm('确定要彻底删除该图标吗？\\n(如果关联了TG群通知，也会同步撤回该消息)')) return;
                  
                  btnElement.disabled = true;
                  btnElement.innerText = '删除中...';

                  const res = await fetch('/api/admin/delete', {
                      method: 'POST',
                      headers: { 'Authorization': pwd, 'Content-Type': 'application/json' },
                      body: JSON.stringify({ key })
                  });
                  
                  if(res.ok) { 
                      const row = btnElement.closest('tr');
                      row.style.opacity = '0';
                      setTimeout(() => {
                          row.remove();
                          if(document.getElementById('iconListBody').children.length === 0) {
                              document.getElementById('iconListBody').innerHTML = '<tr><td colspan="4" style="text-align:center; color:#888;">数据库空空如也</td></tr>';
                          }
                      }, 300);
                  } else { 
                      alert('❌ 删除失败'); 
                      btnElement.disabled = false;
                      btnElement.innerText = '删除';
                  }
              }

              const adminFileInput = document.getElementById('admin-file-upload');
              const adminDisplay = document.getElementById('admin-file-name-display');
              adminFileInput.addEventListener('change', e => {
                  adminDisplay.textContent = e.target.files.length > 0 ? e.target.files[0].name : '选择图片 (PNG/JPG)';
                  adminDisplay.style.borderColor = e.target.files.length > 0 ? '#00f2fe' : 'rgba(255,255,255,0.2)';
              });

              document.getElementById('adminUploadForm').addEventListener('submit', async e => {
                  e.preventDefault();
                  const btn = document.getElementById('adminSubmitBtn');
                  btn.textContent = '上传中...'; btn.disabled = true;
                  try {
                      const formData = new FormData(e.target);
                      formData.append('password', pwd); 
                      const res = await fetch('/api/upload?role=admin', { method: 'POST', body: formData });
                      if(res.ok) {
                          const data = await res.json();
                          alert('✅ 上传成功！\\n图片直链: ' + data.imgUrl);
                          e.target.reset(); adminDisplay.textContent = '选择图片 (PNG/JPG)';
                          loadList(); 
                      } else { alert('❌ 上传失败'); }
                  } catch(err) { alert('❌ 网络错误'); } finally { btn.textContent = '上传至管理区'; btn.disabled = false; }
              });
          </script>
      </body></html>`;
      return new Response(html, { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
    }

    // ==========================================
    // ⚙️ 辅助函数：解析 KV 里的值 (兼容旧版只有字符串的情况)
    // ==========================================
    function parseKvValue(rawValue) {
        if (!rawValue) return { url: null, msgId: null, chatId: null };
        try {
            // 尝试以 JSON 格式解析新数据
            const parsed = JSON.parse(rawValue);
            return { url: parsed.url, msgId: parsed.msgId, chatId: parsed.chatId };
        } catch (e) {
            // 如果报错，说明是旧版的数据（只有 http 链接字符串）
            return { url: rawValue, msgId: null, chatId: null };
        }
    }

    // ==========================================
    // 📡 接口 1：生成 JSON 订阅 
    // ==========================================
    if (request.method === 'GET' && (path === '/guest.json' || path === '/admin.json')) {
      const isGuest = path === '/guest.json';
      const prefix = isGuest ? 'guest:' : 'admin:';
      const libName = isGuest ? '专用共享图标库' : '我的专属图标库 (Admin)';
      
      try {
        const list = await env.ICON_KV.list({ prefix: prefix });
        let iconArray = [];
        
        for (const keyObj of list.keys) {
          const rawValue = await env.ICON_KV.get(keyObj.name);
          const { url } = parseKvValue(rawValue);
          
          if (url) {
              const cleanName = keyObj.name.replace(prefix, '');
              iconArray.push({ "name": cleanName, "url": url });
          }
        }
        
        const finalJson = { "name": libName, "description": "基于 Cloudflare Workers 自建的图标分发库", "icons": iconArray };
        return new Response(JSON.stringify(finalJson, null, 2), {
          headers: { 'Content-Type': 'application/json;charset=UTF-8', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-cache' }
        });
      } catch (e) {
        return new Response('{"error":"读取数据失败"}', { status: 500, headers: {'Content-Type': 'application/json;charset=UTF-8'} });
      }
    }

    // ==========================================
    // 📤 接口 2：处理上传 (记录 TG 的 Message ID)
    // ==========================================
    if (request.method === 'POST' && path === '/api/upload') {
      const role = url.searchParams.get('role') || 'guest';
      const formData = await request.formData();
      const password = formData.get('password');
      const iconName = formData.get('icon_name');
      const file = formData.get('file');

      if (role === 'guest' && password !== env.GUEST_PASSWORD) return Response.json({ error: '游客密码错误' }, { status: 403 });
      if (role === 'admin' && password !== env.ADMIN_PASSWORD) return Response.json({ error: '管理员密码错误' }, { status: 403 });
      if (!file || !iconName) return Response.json({ error: '缺少文件或名称' }, { status: 400 });

      const fileExt = file.name.split('.').pop() || 'png';
      const dir = role === 'guest' ? 'guest' : 'admin';
      const r2Path = `${dir}/${iconName}_${Date.now()}.${fileExt}`;
      await env.ICON_R2.put(r2Path, file);

      const publicUrl = `${env.R2_PUBLIC_URL}/${r2Path}`;
      const kvKey = `${role}:${iconName}`;

      // 发送通知，并获取返回的 message_id
      let tgMsgId = null;
      let tgChatId = null;
      const roleName = role === 'admin' ? '管理员后台' : '专用图标区';
      const msg = `🔔 <b>来自[${roleName}]的图标上传</b>\n名称: <code>${iconName}</code>\n链接: ${publicUrl}`;
      
      try {
        const tgRes = await fetch(`https://api.telegram.org/bot${env.TG_BOT_TOKEN}/sendMessage`, {
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: env.ADMIN_CHAT_ID, text: msg, parse_mode: 'HTML' })
        });
        if (tgRes.ok) {
            const tgData = await tgRes.json();
            tgMsgId = tgData.result.message_id;
            tgChatId = tgData.result.chat.id;
        }
      } catch (e) { console.log("TG通知发送失败", e); }

      // 【重点变更】：将 URL 和 TG消息ID 封装成 JSON 存入 KV
      const kvValueObj = { url: publicUrl, msgId: tgMsgId, chatId: tgChatId };
      await env.ICON_KV.put(kvKey, JSON.stringify(kvValueObj));

      return Response.json({ success: true, iconName: iconName, imgUrl: publicUrl, jsonUrl: `${hostUrl}/${role}.json` });
    }

    // ==========================================
    // 🛠️ 接口 3：管理员 API (获取列表 & 撤回消息功能)
    // ==========================================
    if (request.method === 'GET' && path === '/api/admin/list') {
      if (request.headers.get('Authorization') !== env.ADMIN_PASSWORD) return new Response('Unauthorized', { status: 401 });
      
      const list = await env.ICON_KV.list();
      let result = [];
      for (const keyObj of list.keys) {
        const rawValue = await env.ICON_KV.get(keyObj.name);
        const { url } = parseKvValue(rawValue);
        
        const role = keyObj.name.startsWith('admin:') ? 'admin' : 'guest';
        const cleanName = keyObj.name.replace(`${role}:`, '');
        if(url) result.push({ key: keyObj.name, name: cleanName, role: role, url: url });
      }
      result.sort((a, b) => a.role.localeCompare(b.role));
      
      return new Response(JSON.stringify(result), { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }});
    }

    if (request.method === 'POST' && path === '/api/admin/delete') {
      if (request.headers.get('Authorization') !== env.ADMIN_PASSWORD) return new Response('Unauthorized', { status: 401 });
      
      const body = await request.json();
      const key = body.key; 
      const rawValue = await env.ICON_KV.get(key);
      
      if (rawValue) {
        const { url, msgId, chatId } = parseKvValue(rawValue);
        
        if (url) {
            const r2Path = url.replace(`${env.R2_PUBLIC_URL}/`, '');
            await env.ICON_R2.delete(r2Path);
        }
        await env.ICON_KV.delete(key);

        // 【自动撤回机制】：如果存有消息 ID，就调用 Telegram API 撤回群通知！
        if (msgId && chatId) {
            await fetch(`https://api.telegram.org/bot${env.TG_BOT_TOKEN}/deleteMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, message_id: msgId })
            }).catch(() => {}); // 撤回失败(比如超过48小时)也不抛出错误
        }
      }
      return new Response('Deleted', { status: 200 });
    }

    // ==========================================
    // 🤖 接口 4：TG Bot Webhook 上传
    // ==========================================
    if (request.method === 'POST' && path === `/webhook/tg/${env.TG_BOT_TOKEN}`) {
      const update = await request.json();
      if (update.message && update.message.photo) {
        const chatId = update.message.chat.id;
        const photo = update.message.photo.pop(); 
        const fileId = photo.file_id;
        const iconName = update.message.caption || `tg_icon_${Date.now()}`;

        try {
          const fileInfoRes = await fetch(`https://api.telegram.org/bot${env.TG_BOT_TOKEN}/getFile?file_id=${fileId}`);
          const fileInfo = await fileInfoRes.json();
          
          const imageRes = await fetch(`https://api.telegram.org/file/bot${env.TG_BOT_TOKEN}/${fileInfo.result.file_path}`);
          const imageBuffer = await imageRes.arrayBuffer();

          const r2Path = `tg/${iconName}.png`;
          await env.ICON_R2.put(r2Path, imageBuffer);
          const publicUrl = `${env.R2_PUBLIC_URL}/${r2Path}`;

          // 发送入库回复通知，并获取 reply_msg_id
          let replyMsgId = null;
          const tgRes = await fetch(`https://api.telegram.org/bot${env.TG_BOT_TOKEN}/sendMessage`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: `✅ 图标 [${iconName}] 已入库并更新至 Admin JSON！` })
          });
          if (tgRes.ok) {
              const tgData = await tgRes.json();
              replyMsgId = tgData.result.message_id;
          }

          // 将数据和回执ID存入 KV
          const kvValueObj = { url: publicUrl, msgId: replyMsgId, chatId: chatId };
          await env.ICON_KV.put(`admin:${iconName}`, JSON.stringify(kvValueObj));

        } catch (err) {
          await fetch(`https://api.telegram.org/bot${env.TG_BOT_TOKEN}/sendMessage`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: `❌ 上传失败` })
          });
        }
      }
      return new Response('OK');
    }

    return new Response('Not Found', { status: 404 });
  }
};
