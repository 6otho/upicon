export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // ==========================================
    // 🌐 智能域名识别机制
    // ==========================================
    let hostUrl = url.origin;
    if (env.CUSTOM_DOMAIN) {
      hostUrl = env.CUSTOM_DOMAIN.trim().replace(/\/$/, '');
      if (!hostUrl.startsWith('http')) hostUrl = 'https://' + hostUrl;
    }

    // ==========================================
    // 🎨 共享的前端 CSS 样式
    // ==========================================
    const sharedCSS = `
      <style>
        * { box-sizing: border-box; }
        body, html { margin: 0; padding: 0; min-height: 100%; font-family: 'Segoe UI', Roboto, sans-serif; background-color: #050608; background-image: radial-gradient(circle at 15% 20%, rgba(82, 181, 75, 0.12) 0%, transparent 50%), radial-gradient(circle at 85% 80%, rgba(0, 242, 254, 0.12) 0%, transparent 50%), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cg stroke='rgba(255,255,255,0.035)' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'%3E%3C!-- Play --%3E%3Ccircle cx='30' cy='30' r='12'/%3E%3Cpolygon points='28,25 28,35 36,30'/%3E%3C!-- Film --%3E%3Crect x='80' y='20' width='18' height='24' rx='2'/%3E%3Cpath d='M80 26h18M80 32h18M80 38h18M84 20v24M94 20v24'/%3E%3C!-- TV --%3E%3Crect x='25' y='80' width='22' height='16' rx='2'/%3E%3Cpath d='M31 80l5-5l5 5'/%3E%3Cpath d='M31 96h10'/%3E%3C!-- Disc --%3E%3Ccircle cx='88' cy='88' r='12'/%3E%3Ccircle cx='88' cy='88' r='4'/%3E%3C/g%3E%3C/svg%3E"); background-attachment: fixed; color: #e0e6ed; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow-x: hidden;}
        
        .glass-panel { background: rgba(15, 18, 25, 0.65); backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px); border: 1px solid rgba(0, 242, 254, 0.15); border-radius: 24px; padding: 40px 30px; width: 90%; max-width: 380px; box-shadow: 0 25px 50px rgba(0,0,0,0.5), 0 0 40px rgba(0,242,254,0.05); text-align: center; margin: 30px auto; }
        .wide-panel { max-width: 900px; padding: 30px; margin: 30px auto; width: 95%; }
        
        h1 { margin: 0 0 20px 0; font-size: 28px; font-weight: 700; letter-spacing: 2px; background: linear-gradient(135deg, #fff, #00f2fe); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; margin-bottom: 20px; border: 1px solid; }
        .badge.guest { border-color: rgba(255,255,255,0.3); color: #aaa; background: rgba(255,255,255,0.05); }
        .badge.admin { border-color: rgba(0,242,254,0.5); color: #00f2fe; background: rgba(0,242,254,0.05); }
        
        .input-group { position: relative; margin-bottom: 15px; width: 100%; }
        .input-group input { width: 100%; padding: 15px 20px; background: rgba(255,255,255,0.03); border: 1.5px solid rgba(255,255,255,0.15); border-radius: 30px; color: white; font-size: 15px; outline: none; transition: all 0.3s; }
        .input-group input:focus { border-color: #00f2fe; background: rgba(0,242,254,0.05); box-shadow: 0 0 15px rgba(0,242,254,0.2); }
        .input-group input::placeholder { color: rgba(255,255,255,0.4); }
        
        .file-upload-label { display: block; width: 100%; padding: 15px 20px; background: rgba(255,255,255,0.03); border: 1.5px dashed rgba(255,255,255,0.2); border-radius: 30px; color: rgba(255,255,255,0.5); font-size: 15px; cursor: pointer; text-align: left; transition: all 0.3s; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 20px;}
        .file-upload-label:hover { background: rgba(0,242,254,0.05); border-color: #00f2fe; color: white; }
        
        .submit-btn { width: 100%; padding: 15px; background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%); color: #050608; border: none; border-radius: 30px; font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.3s; }
        .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,242,254,0.4); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; box-shadow: none; }
        
        .submit-btn.gallery-btn { background: linear-gradient(135deg, #0052d4 0%, #4364f7 100%); box-shadow: 0 5px 15px rgba(67, 100, 247, 0.3); color: #fff;}
        .submit-btn.gallery-btn:hover { background: linear-gradient(135deg, #4364f7 0%, #6fb1fc 100%); box-shadow: 0 8px 25px rgba(67, 100, 247, 0.6); }
        
        .submit-btn.danger { background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%); box-shadow: none; padding: 6px 12px; font-size: 12px; color: white; border-radius: 20px; width: auto; display: inline-block;}
        .submit-btn.danger:hover { box-shadow: 0 5px 15px rgba(255,65,108,0.4); }
        .submit-btn.outline { background: transparent; border: 1px solid #00f2fe; color: #00f2fe; padding: 6px 15px; border-radius: 20px; font-size: 13px; font-weight: normal; width: auto; margin: 0;}
        .submit-btn.outline:hover { background: rgba(0,242,254,0.1); box-shadow: 0 0 10px rgba(0,242,254,0.3); }
        
        .nav-links { margin-top: 20px; font-size: 13px; text-align: center; }
        .nav-links a { color: #00f2fe; text-decoration: none; margin: 0 10px; transition: 0.3s; }
        .nav-links a:hover { text-shadow: 0 0 10px rgba(0,242,254,0.8); }
        
        .dashboard-layout { display: flex; justify-content: space-between; align-items: flex-start; gap: 30px; width: 100%; }
        .dashboard-layout > div { min-width: 0; overflow: hidden; }
        
        .category-tabs { display: flex; gap: 10px; overflow-x: auto; margin-bottom: 15px; padding-bottom: 5px; scrollbar-width: none; }
        .category-tabs::-webkit-scrollbar { display: none; }
        .tab-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #aaa; padding: 6px 16px; border-radius: 20px; cursor: pointer; white-space: nowrap; font-size: 13px; transition: 0.3s; }
        .tab-btn:hover { background: rgba(255,255,255,0.1); }
        .tab-btn.active { background: rgba(0,242,254,0.1); border-color: #00f2fe; color: #00f2fe; font-weight: bold; }
        .cat-tag { background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 6px; font-size: 11px; color: #00f2fe; }

        .table-container { width: 100%; overflow-x: auto; text-align: left; background: rgba(0,0,0,0.2); border-radius: 12px; padding: 10px; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; min-width: 350px; }
        th, td { padding: 12px 10px; border-bottom: 1px solid rgba(255,255,255,0.05); transition: all 0.3s ease; }
        th { color: #00f2fe; font-weight: normal; white-space: nowrap; }
        td { word-break: break-all; }
        
        .icon-preview { width: 35px; height: 35px; border-radius: 8px; object-fit: cover; vertical-align: middle; margin-right: 10px; background: rgba(255,255,255,0.05); cursor: zoom-in; border: 1px solid rgba(255,255,255,0.1); transition: transform 0.2s; }
        .icon-preview:hover { transform: scale(1.1); border-color: #00f2fe; }

        .modal { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); z-index: 100; align-items: center; justify-content: center; }
        .modal-content { background: #12151e; border: 1px solid #00f2fe; border-radius: 20px; padding: 25px; width: 90%; max-width: 420px; text-align: left; }
        .copy-box { background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); padding: 10px; border-radius: 10px; margin-bottom: 15px; display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .copy-box input { background: transparent; border: none; color: #fff; flex: 1; min-width: 0; outline: none; font-family: monospace; font-size: 12px;}
        .copy-btn { background: rgba(0,242,254,0.2); color: #00f2fe; border: 1px solid #00f2fe; padding: 5px 10px; border-radius: 6px; cursor: pointer; font-size: 12px; transition: 0.2s; white-space: nowrap;}
        
        .image-viewer { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(15px); z-index: 999; align-items: center; justify-content: center; cursor: zoom-out; }
        .image-viewer img { max-width: 90vw; max-height: 80vh; object-fit: contain; border-radius: 12px; box-shadow: 0 0 30px rgba(0, 242, 254, 0.3); border: 2px solid rgba(255,255,255,0.1); animation: zoomIn 0.3s ease; }
        @keyframes zoomIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }

        @media (max-width: 768px) {
            .dashboard-layout { flex-direction: column; gap: 20px; }
            .dashboard-layout > div { width: 100%; } 
            .glass-panel { width: 95%; padding: 25px 15px; margin: 15px auto; }
            .wide-panel { padding: 20px 10px; }
            h1 { font-size: 24px; }
            th, td { padding: 10px 5px; font-size: 12px; } 
        }
      </style>
    `;

    // ==========================================
    // 🌐 路由 1：游客上传页
    // ==========================================
    if (request.method === 'GET' && path === '/') {
      const html = `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>专用图标上传</title>${sharedCSS}</head><body>
          <div class="glass-panel">
              <h1>Icon Upload</h1>
              <div class="badge guest">专用图标节点</div>
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
              
              <button class="submit-btn gallery-btn" style="margin-top:20px; opacity:0.9;" onclick="location.href='/gallery'">游客图库 (上传后可查看)</button>
              
              <div class="nav-links"><a href="/admin">⚙️ 管理员入口</a></div>
          </div>

          <div class="modal" id="successModal">
              <div class="modal-content">
                  <h3 style="margin-top:0; color:#00f2fe; font-size:18px;">✅ 上传成功！</h3>
                  <label style="font-size:12px;color:#00f2fe;display:block;margin-bottom:5px;">🔗 游客 JSON 订阅地址:</label>
                  <div class="copy-box">
                      <input type="text" id="jsonLink" readonly>
                      <button class="copy-btn" onclick="copyText('jsonLink')">复制</button>
                  </div>
                  <label style="font-size:12px;color:#00f2fe;display:block;margin-bottom:5px;">🖼️ 图片直链:</label>
                  <div class="copy-box">
                      <input type="text" id="imgLink" readonly>
                      <button class="copy-btn" onclick="copyText('imgLink')">复制</button>
                  </div>
                  <button class="submit-btn" style="margin-top:5px;background:rgba(255,255,255,0.1);color:white;padding:10px;" onclick="document.getElementById('successModal').style.display='none'">关闭</button>
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

              function copyText(id) { document.getElementById(id).select(); document.execCommand('copy'); alert('复制成功！'); }
          </script>
      </body></html>`;
      return new Response(html, { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
    }

    // ==========================================
    // 🖼️ 路由：游客图库
    // ==========================================
    if (request.method === 'GET' && path === '/gallery') {
      const html = `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>游客图库</title>${sharedCSS}</head><body>
          <div class="glass-panel" id="loginBox">
              <h1>Guest Gallery</h1>
              <div class="input-group"><input type="password" id="guestPwd" placeholder="请输入游客访问密码" onkeydown="if(event.key==='Enter') login()"></div>
              <button class="submit-btn gallery-btn" onclick="login()">进入图库</button>
              <div class="nav-links"><a href="/">返回首页</a></div>
          </div>

          <div class="glass-panel wide-panel" id="galleryBox" style="display:none;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px;">
                  <h1 style="margin: 0; font-size: 22px;">游客专属图库</h1>
                  
                  <div style="display:flex; gap:10px;">
                      <a href="${hostUrl}/guest.json" target="_blank" class="submit-btn outline" style="text-decoration:none; border-color:#4a90e2; color:#4a90e2; line-height:16px;">📄 查看游客 JSON</a>
                      <button class="submit-btn outline" style="width: auto; margin: 0; border-color: rgba(255,255,255,0.3); color: white;" onclick="logout()">退出图库</button>
                  </div>
              </div>
              
              <div class="table-container">
                  <table>
                      <thead><tr><th>预览</th><th>图标名称</th><th>操作</th></tr></thead>
                      <tbody id="galleryListBody"><tr><td colspan="3" style="text-align:center;">加载中...</td></tr></tbody>
                  </table>
              </div>
          </div>

          <div class="image-viewer" id="imageViewer" onclick="closeImageViewer()"><img id="viewerImage" src="" alt="大图预览"></div>

          <script>
              let pwd = sessionStorage.getItem('guestPwd') || '';
              if(pwd) login(pwd);

              async function login(savedPwd) {
                  const inputPwd = savedPwd || document.getElementById('guestPwd').value;
                  if(!inputPwd) return;
                  const res = await fetch('/api/guest/list', { headers: { 'Authorization': inputPwd } });
                  if(res.ok) {
                      sessionStorage.setItem('guestPwd', inputPwd);
                      pwd = inputPwd;
                      document.getElementById('loginBox').style.display = 'none';
                      document.getElementById('galleryBox').style.display = 'block';
                      renderList(await res.json());
                  } else {
                      if(!savedPwd) alert('访问密码错误');
                      sessionStorage.removeItem('guestPwd');
                  }
              }

              function logout() {
                  sessionStorage.removeItem('guestPwd'); pwd = '';
                  document.getElementById('galleryBox').style.display = 'none';
                  document.getElementById('loginBox').style.display = 'block';
                  document.getElementById('guestPwd').value = '';
              }

              function renderList(data) {
                  const tbody = document.getElementById('galleryListBody');
                  tbody.innerHTML = '';
                  if(data.length === 0) return tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; color:#888;">图库空空如也，快去上传吧！</td></tr>';
                  
                  data.forEach(item => {
                      const tr = document.createElement('tr');
                      tr.innerHTML = \`
                          <td><img src="\${item.url}" class="icon-preview" onclick="viewImage('\${item.url}')" title="点击查看大图" loading="lazy"></td>
                          <td><code>\${item.name}</code></td>
                          <td>
                              <button class="submit-btn outline" style="padding: 6px 15px; margin: 0; white-space: nowrap;" onclick="copyLink('\${item.url}')">复制直链</button>
                          </td>
                      \`;
                      tbody.appendChild(tr);
                  });
              }

              function viewImage(url) { document.getElementById('viewerImage').src = url; document.getElementById('imageViewer').style.display = 'flex'; }
              function closeImageViewer() { document.getElementById('imageViewer').style.display = 'none'; document.getElementById('viewerImage').src = ''; }
              
              function copyLink(text) {
                  if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(() => alert('已复制直链！')).catch(() => fallbackCopy(text));
                  else fallbackCopy(text);
              }
              function fallbackCopy(text) {
                  const input = document.createElement('input'); input.value = text; document.body.appendChild(input);
                  input.select(); try{ document.execCommand('copy'); alert('已复制直链！'); }catch(e){} document.body.removeChild(input);
              }
          </script>
      </body></html>`;
      return new Response(html, { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
    }

    // ==========================================
    // 🛡️ 路由 3：管理员面板
    // ==========================================
    if (request.method === 'GET' && path === '/admin') {
      const html = `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>管理员控制台</title>${sharedCSS}</head><body>
          
          <div class="glass-panel" id="loginBox">
              <h1>Admin Login</h1>
              <div class="input-group"><input type="password" id="adminPwd" placeholder="请输入超级密码" onkeydown="if(event.key==='Enter') login()"></div>
              <button class="submit-btn" onclick="login()">登入控制台</button>
              <div class="nav-links"><a href="/">返回游客首页</a></div>
          </div>

          <div class="glass-panel wide-panel" id="dashboard" style="display:none;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px; flex-wrap: wrap; gap: 10px;">
                  <div style="text-align: left;">
                      <h1 style="margin: 0;">Admin Panel</h1>
                      <div class="badge admin" style="margin: 5px 0 0 0;">超级权限已验证</div>
                  </div>
                  <button class="submit-btn outline" style="border-color: rgba(255,255,255,0.3); color: white;" onclick="logout()">退出登入</button>
              </div>
              
              <div class="dashboard-layout">
                  <div style="flex:1; background: rgba(0,0,0,0.3); padding: 25px; border-radius: 16px;">
                      <h3 style="margin-top:0; margin-bottom:15px; color:#00f2fe; font-size:16px; text-align:left;">⚡ 管理员直传</h3>
                      <form id="adminUploadForm">
                          <div class="input-group">
                              <input type="text" name="icon_name" required placeholder="图标名称 (如 emby)" autocomplete="off">
                          </div>
                          <div class="input-group">
                              <input type="text" name="category" placeholder="分类合集 (选填，如: 影音)" autocomplete="off">
                          </div>
                          <label for="admin-file-upload" class="file-upload-label" id="admin-file-name-display">选择图片 (PNG/JPG)</label>
                          <input id="admin-file-upload" type="file" name="file" accept="image/*" required style="display:none;">
                          <button type="submit" class="submit-btn" id="adminSubmitBtn">上传至管理区</button>
                      </form>
                  </div>
                  
                  <div style="flex:2; text-align:left;">
                      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:10px;">
                          <h3 style="margin:0; color:#00f2fe; font-size:16px;">🗂️ 图标数据库管理</h3>
                          <button onclick="loadList()" style="background:transparent; border:1px solid #00f2fe; color:#00f2fe; border-radius:6px; cursor:pointer; padding: 4px 15px; font-size: 13px; transition:0.3s;">刷新列表</button>
                      </div>

                      <div class="copy-box" style="margin-bottom: 10px;">
                          <input type="text" id="adminJsonLink" readonly value="${hostUrl}/admin.json">
                          <button class="copy-btn" onclick="copyText('adminJsonLink')">复制合集订阅</button>
                      </div>

                      <div class="category-tabs" id="adminCategoryTabs" style="display:none;"></div>

                      <div class="table-container">
                          <table>
                              <thead><tr><th>预览</th><th>合集</th><th>名称</th><th>归属</th><th>操作</th></tr></thead>
                              <tbody id="iconListBody"><tr><td colspan="5" style="text-align:center;">加载中...</td></tr></tbody>
                          </table>
                      </div>
                  </div>
              </div>
          </div>

          <div class="image-viewer" id="imageViewer" onclick="closeImageViewer()"><img id="viewerImage" src="" alt="大图预览"></div>

          <script>
              let pwd = sessionStorage.getItem('adminPwd') || '';
              let allAdminData =[];
              let currentCat = '全部';

              if(pwd) login(pwd);

              async function login(savedPwd) {
                  const inputPwd = savedPwd || document.getElementById('adminPwd').value;
                  if(!inputPwd) return;
                  const res = await fetch('/api/admin/list', { headers: { 'Authorization': inputPwd } });
                  if(res.ok) {
                      sessionStorage.setItem('adminPwd', inputPwd);
                      pwd = inputPwd;
                      document.getElementById('loginBox').style.display = 'none';
                      document.getElementById('dashboard').style.display = 'block';
                      allAdminData = await res.json();
                      renderTabs();
                      renderTable();
                  } else {
                      if(!savedPwd) alert('密码错误');
                      sessionStorage.removeItem('adminPwd');
                  }
              }

              function logout() {
                  sessionStorage.removeItem('adminPwd'); pwd = '';
                  document.getElementById('dashboard').style.display = 'none';
                  document.getElementById('loginBox').style.display = 'block';
                  document.getElementById('adminPwd').value = '';
              }

              async function loadList() {
                  const res = await fetch('/api/admin/list', { headers: { 'Authorization': pwd } });
                  if(res.ok) {
                      allAdminData = await res.json();
                      renderTabs();
                      renderTable();
                  } else if(res.status === 401) { alert('认证失效'); logout(); }
              }

              function renderTabs() {
                  const tabsDiv = document.getElementById('adminCategoryTabs');
                  // 获取所有独特的分类，并主动过滤掉“默认”这个词
                  let rawCategories =[...new Set(allAdminData.map(item => item.category))];
                  let filteredCategories = rawCategories.filter(c => c !== '默认');
                  
                  const categories = ['全部', ...filteredCategories];
                  
                  // 如果除了“全部”没有别的分类了，直接隐藏整个 Tab 栏，保持极其清爽
                  if (categories.length <= 1) {
                      tabsDiv.style.display = 'none';
                      tabsDiv.innerHTML = '';
                  } else {
                      tabsDiv.style.display = 'flex';
                      tabsDiv.innerHTML = categories.map(c => 
                          \`<button class="tab-btn \${currentCat === c ? 'active' : ''}" onclick="switchCat('\${c}')">\${c}</button>\`
                      ).join('');
                  }
              }

              function switchCat(cat) {
                  currentCat = cat;
                  renderTabs();
                  renderTable();
                  
                  const linkInput = document.getElementById('adminJsonLink');
                  if(cat === '全部') {
                      linkInput.value = '${hostUrl}/admin.json';
                  } else {
                      linkInput.value = '${hostUrl}/admin/' + encodeURIComponent(cat) + '.json';
                  }
              }

              function renderTable() {
                  const tbody = document.getElementById('iconListBody');
                  const filtered = currentCat === '全部' ? allAdminData : allAdminData.filter(i => i.category === currentCat);
                  
                  if(filtered.length === 0) return tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:#888;">数据库空空如也</td></tr>';
                  
                  tbody.innerHTML = filtered.map(item => {
                      const roleTag = item.role === 'admin' ? '<span style="color:#00f2fe;font-weight:bold;">Admin</span>' : '<span style="color:#aaa">Guest</span>';
                      // 如果是“默认”合集，表格里只显示低调的横线，不再喧宾夺主
                      const catDisplay = item.category === '默认' ? '<span style="color:#555;">-</span>' : \`<span class="cat-tag">\${item.category}</span>\`;
                      
                      return \`
                          <tr>
                              <td><img src="\${item.url}" class="icon-preview" loading="lazy" onclick="viewImage('\${item.url}')"></td>
                              <td>\${catDisplay}</td>
                              <td><code>\${item.name}</code></td>
                              <td>\${roleTag}</td>
                              <td>
                                  <div style="display:flex; gap:6px; flex-wrap:nowrap;">
                                      <button class="submit-btn outline" style="padding: 5px 8px; margin: 0; min-width: 44px;" onclick="copyLink('\${item.url}')">复制</button>
                                      <button class="submit-btn danger" style="padding: 5px 8px; margin: 0; min-width: 44px;" onclick="deleteIcon('\${item.key}', this)">删除</button>
                                  </div>
                              </td>
                          </tr>
                      \`;
                  }).join('');
              }

              function viewImage(url) { document.getElementById('viewerImage').src = url; document.getElementById('imageViewer').style.display = 'flex'; }
              function closeImageViewer() { document.getElementById('imageViewer').style.display = 'none'; document.getElementById('viewerImage').src = ''; }
              
              function copyText(id) { document.getElementById(id).select(); document.execCommand('copy'); alert('专属合集订阅复制成功！'); }
              function copyLink(text) {
                  if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(() => alert('已复制直链！')).catch(() => fallbackCopy(text));
                  else fallbackCopy(text);
              }
              function fallbackCopy(text) {
                  const input = document.createElement('input'); input.value = text; document.body.appendChild(input);
                  input.select(); try{ document.execCommand('copy'); alert('已复制直链！'); }catch(e){} document.body.removeChild(input);
              }

              async function deleteIcon(key, btnElement) {
                  if(!confirm('确定要彻底删除该图标吗？')) return;
                  btnElement.disabled = true; btnElement.innerText = '中...';

                  const res = await fetch('/api/admin/delete', {
                      method: 'POST', headers: { 'Authorization': pwd, 'Content-Type': 'application/json' },
                      body: JSON.stringify({ key })
                  });
                  if(res.ok) { loadList(); } 
                  else { alert('❌ 删除失败'); btnElement.disabled = false; btnElement.innerText = '删除'; }
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
                          alert('✅ 上传成功！');
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
    // ⚙️ 辅助函数：解析 KV 里的值
    // ==========================================
    function parseKvValue(rawValue) {
        if (!rawValue) return { url: null, msgId: null, chatId: null };
        try { const parsed = JSON.parse(rawValue); return { url: parsed.url, msgId: parsed.msgId, chatId: parsed.chatId }; } 
        catch (e) { return { url: rawValue, msgId: null, chatId: null }; }
    }

    // ==========================================
    // 📡 接口 1：生成 JSON 订阅
    // ==========================================
    if (request.method === 'GET') {
      let isGuest = false;
      let isAdmin = false;
      let reqCategory = null;

      if (path === '/guest.json') {
          isGuest = true;
      } 
      else if (path === '/admin.json') {
          isAdmin = true;
      } 
      else if (path.startsWith('/admin/') && path.endsWith('.json')) {
          isAdmin = true;
          reqCategory = decodeURIComponent(path.slice(7, -5)); 
      }

      if (isGuest || isAdmin) {
          const prefix = isGuest ? 'guest:' : 'admin:';
          let libName = isGuest ? '专用共享图标库' : '我的专属图标库 (Admin)';
          if (reqCategory && !isGuest) libName += ` - ${reqCategory}合集`;
          
          try {
            let iconArray =[];
            let listComplete = false;
            let cursor = undefined;
            
            while (!listComplete) {
                const list = await env.ICON_KV.list({ prefix: prefix, cursor: cursor });
                for (const keyObj of list.keys) {
                  const parts = keyObj.name.split(':');
                  const itemCategory = parts.length >= 3 ? parts[1] : '默认';
                  const cleanName = parts.length >= 3 ? parts.slice(2).join(':') : parts[1];

                  if (!isGuest && reqCategory && itemCategory !== reqCategory) continue;

                  const rawValue = await env.ICON_KV.get(keyObj.name);
                  const { url } = parseKvValue(rawValue);
                  if (url) iconArray.push({ "name": cleanName, "url": url });
                }
                listComplete = list.list_complete;
                cursor = list.cursor;
            }
            
            const finalJson = { "name": libName, "description": "基于 Cloudflare Workers 自建的图标分类分发库", "icons": iconArray };
            return new Response(JSON.stringify(finalJson, null, 2), {
              headers: { 'Content-Type': 'application/json;charset=UTF-8', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-cache' }
            });
          } catch (e) {
            return new Response('{"error":"读取数据失败"}', { status: 500, headers: {'Content-Type': 'application/json;charset=UTF-8'} });
          }
      }
    }

    // ==========================================
    // 🖼️ 接口 2：获取游客图库数据
    // ==========================================
    if (request.method === 'GET' && path === '/api/guest/list') {
      if (request.headers.get('Authorization') !== env.GUEST_PASSWORD) return new Response('Unauthorized', { status: 401 });
      
      let result =[];
      let listComplete = false;
      let cursor = undefined;
      while (!listComplete) {
          const list = await env.ICON_KV.list({ prefix: 'guest:', cursor: cursor });
          for (const keyObj of list.keys) {
            const rawValue = await env.ICON_KV.get(keyObj.name);
            const { url } = parseKvValue(rawValue);
            if(url) {
                const parts = keyObj.name.split(':');
                const cleanName = parts[parts.length - 1];
                result.push({ key: keyObj.name, name: cleanName, url: url });
            }
          }
          listComplete = list.list_complete;
          cursor = list.cursor;
      }
      return new Response(JSON.stringify(result), { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }});
    }

    // ==========================================
    // 🛠️ 接口 4：网页管理员 API 
    // ==========================================
    if (request.method === 'GET' && path === '/api/admin/list') {
      if (request.headers.get('Authorization') !== env.ADMIN_PASSWORD) return new Response('Unauthorized', { status: 401 });
      
      let result =[];
      let listComplete = false;
      let cursor = undefined;
      while (!listComplete) {
          const list = await env.ICON_KV.list({ cursor: cursor });
          for (const keyObj of list.keys) {
            const rawValue = await env.ICON_KV.get(keyObj.name);
            const { url } = parseKvValue(rawValue);
            if(url) {
                const parts = keyObj.name.split(':');
                const role = parts[0];
                const category = parts.length >= 3 ? parts[1] : '默认';
                const cleanName = parts.length >= 3 ? parts.slice(2).join(':') : parts[1];
                result.push({ key: keyObj.name, name: cleanName, category: category, role: role, url: url });
            }
          }
          listComplete = list.list_complete;
          cursor = list.cursor;
      }
      result.sort((a, b) => a.role.localeCompare(b.role));
      return new Response(JSON.stringify(result), { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }});
    }

    // ==========================================
    // 📤 接口 3：处理网页端上传
    // ==========================================
    if (request.method === 'POST' && path === '/api/upload') {
      const role = url.searchParams.get('role') || 'guest';
      const formData = await request.formData();
      const password = formData.get('password');
      const iconName = formData.get('icon_name');
      let category = formData.get('category') || '';
      const file = formData.get('file');

      if (role === 'guest') category = '';

      if (role === 'guest' && password !== env.GUEST_PASSWORD) return Response.json({ error: '游客密码错误' }, { status: 403 });
      if (role === 'admin' && password !== env.ADMIN_PASSWORD) return Response.json({ error: '管理员密码错误' }, { status: 403 });
      if (!file || !iconName) return Response.json({ error: '缺少文件或名称' }, { status: 400 });

      category = category.trim().replace(/[:/]/g, ''); 
      const kvKey = category ? `${role}:${category}:${iconName}` : `${role}:${iconName}`;
      
      const fileExt = file.name.split('.').pop() || 'png';
      const r2Path = `${role}/${iconName}_${Date.now()}.${fileExt}`;
      await env.ICON_R2.put(r2Path, file);

      const publicUrl = `${hostUrl}/${r2Path}`;
      let tgMsgId = null; let tgChatId = null;
      
      const primaryTargetId = env.ADMIN_CHAT_ID ? String(env.ADMIN_CHAT_ID).split(',')[0].trim() : null;
      try {
        if (primaryTargetId) {
            const roleName = role === 'admin' ? '管理后台' : '游客区';
            const catText = role === 'admin' && category ? `\n合集: <code>${category}</code>` : '';
            
            const tgRes = await fetch(`https://api.telegram.org/bot${env.TG_BOT_TOKEN}/sendMessage`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                  chat_id: primaryTargetId, 
                  text: `🔔 <b>网页端上传[${roleName}]</b>\n名称: <code>${iconName}</code>${catText}\n链接: ${publicUrl}`, 
                  parse_mode: 'HTML',
                  reply_markup: { inline_keyboard: [[{ text: "🗑️ 从数据库中彻底删除", callback_data: `del_kv:${kvKey}` }]] }
              })
            });
            if (tgRes.ok) {
                const tgData = await tgRes.json();
                tgMsgId = tgData.result.message_id; tgChatId = tgData.result.chat.id;
            }
        }
      } catch (e) {}

      await env.ICON_KV.put(kvKey, JSON.stringify({ url: publicUrl, msgId: tgMsgId, chatId: tgChatId }));
      
      const finalJsonUrl = (role === 'admin' && category) 
          ? `${hostUrl}/admin/${encodeURIComponent(category)}.json` 
          : `${hostUrl}/${role}.json`;
          
      return Response.json({ success: true, iconName: iconName, imgUrl: publicUrl, jsonUrl: finalJsonUrl });
    }

    if (request.method === 'POST' && path === '/api/admin/delete') {
      if (request.headers.get('Authorization') !== env.ADMIN_PASSWORD) return new Response('Unauthorized', { status: 401 });
      const body = await request.json();
      const key = body.key; 
      const rawValue = await env.ICON_KV.get(key);
      if (rawValue) {
        const { url, msgId, chatId } = parseKvValue(rawValue);
        if (url) {
            const urlObj = new URL(url);
            const r2Path = urlObj.pathname.substring(1);
            await env.ICON_R2.delete(r2Path);
        }
        await env.ICON_KV.delete(key);
        if (msgId && chatId) {
            await fetch(`https://api.telegram.org/bot${env.TG_BOT_TOKEN}/deleteMessage`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, message_id: msgId })
            }).catch(() => {});
        }
      }
      return new Response('Deleted', { status: 200 });
    }

    // ==========================================
    // 🤖 接口 5：TG Bot 交互引擎
    // ==========================================
    if (request.method === 'POST' && path === `/webhook/tg/${env.TG_BOT_TOKEN}`) {
      const update = await request.json();
      const allowedAdminIds = env.ADMIN_CHAT_ID ? String(env.ADMIN_CHAT_ID).split(',').map(s => s.trim()) :[];

      const menuText = `👋 <b>欢迎使用专属图标管理机器人</b>

🖼️ <b>如何指定合集上传？</b>
直接发送图片给我，在<b>“文字说明(Caption)”</b>处填写：
<code>合集名称：图标名称</code>
*(例如：<code>影音：emby</code>，不加冒号则默认不分类)*

🌐 <b>网页管理控制台：</b>
${hostUrl}/admin

🔗 <b>总库订阅链接：</b>
• <b>游客订阅：</b> ${hostUrl}/guest.json
• <b>管理订阅：</b> ${hostUrl}/admin.json`;

      const menuMarkup = {
          inline_keyboard: [[{ text: "📊 查看后台数据", callback_data: "stats" }, { text: "🗑️ 快捷删除指令", callback_data: "help_del" }]
          ]
      };

      if (update.callback_query) {
        const cb = update.callback_query;
        const data = cb.data;
        const chatRoomId = String(cb.message.chat.id);
        const userId = String(cb.from.id);

        if (allowedAdminIds.length > 0 && !allowedAdminIds.includes(chatRoomId) && !allowedAdminIds.includes(userId)) return new Response('OK');

        if (data === 'stats') {
            let adminCount = 0, guestCount = 0;
            let catCounts = {};
            
            let listComplete = false;
            let cursor = undefined;
            while (!listComplete) {
                const list = await env.ICON_KV.list({ cursor: cursor });
                for (const keyObj of list.keys) {
                    const parts = keyObj.name.split(':');
                    const role = parts[0];
                    if (role === 'admin') {
                        adminCount++;
                        // 如果有专属合集，才纳入分类统计，不统计“默认”
                        if (parts.length >= 3) {
                            const cat = parts[1];
                            catCounts[cat] = (catCounts[cat] || 0) + 1;
                        }
                    } else if (role === 'guest') {
                        guestCount++;
                    }
                }
                listComplete = list.list_complete;
                cursor = list.cursor;
            }

            let catText = "";
            const sortedCats = Object.keys(catCounts).sort();
            for (const cat of sortedCats) {
                catText += `├ <code>${cat}</code> : ${catCounts[cat]} 个\n`;
            }

            const statsText = `📊 <b>后台数据库实时统计</b>\n\n🛡️ <b>Admin 核心图标库</b> (共 <code>${adminCount}</code> 个)\n${catText}\n🌍 <b>Guest 游客上传库</b> (共 <code>${guestCount}</code> 个)\n\n📦 <b>全库总计收录：</b> <code>${adminCount + guestCount}</code> 个\n\n<i>数据已同步至最新。</i>`;
            
            await fetch(`https://api.telegram.org/bot${env.TG_BOT_TOKEN}/editMessageText`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ chat_id: chatRoomId, message_id: cb.message.message_id, text: statsText, parse_mode: 'HTML', reply_markup: { inline_keyboard: [[{ text: "🔙 返回主菜单", callback_data: "menu" }]] }})
            });
            await fetch(`https://api.telegram.org/bot${env.TG_BOT_TOKEN}/answerCallbackQuery`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ callback_query_id: cb.id }) });
            return new Response('OK');
        }

        if (data === 'menu') {
            await fetch(`https://api.telegram.org/bot${env.TG_BOT_TOKEN}/editMessageText`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ chat_id: chatRoomId, message_id: cb.message.message_id, text: menuText, parse_mode: 'HTML', disable_web_page_preview: true, reply_markup: menuMarkup })
            });
            await fetch(`https://api.telegram.org/bot${env.TG_BOT_TOKEN}/answerCallbackQuery`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ callback_query_id: cb.id }) });
            return new Response('OK');
        }

        if (data === 'help_del') {
            await fetch(`https://api.telegram.org/bot${env.TG_BOT_TOKEN}/answerCallbackQuery`, {
             method: 'POST', headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ callback_query_id: cb.id, text: "💡 彻底删除指令：\n\n请发送：/del 图标名称\n\n系统会自动在全库(无视合集)检索该名称并删除它！", show_alert: true })
            });
            return new Response('OK');
        }

        if (data.startsWith('del_kv:')) {
          const kvKey = data.replace('del_kv:', '');
          const rawValue = await env.ICON_KV.get(kvKey);
          
          if (rawValue) {
            const { url } = parseKvValue(rawValue);
            if (url) {
              const urlObj = new URL(url);
              const r2Path = urlObj.pathname.substring(1);
              await env.ICON_R2.delete(r2Path);
            }
            await env.ICON_KV.delete(kvKey);
            await fetch(`https://api.telegram.org/bot${env.TG_BOT_TOKEN}/editMessageText`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ chat_id: cb.message.chat.id, message_id: cb.message.message_id, text: `🗑️ 图标[${kvKey}] 已撤回并彻底删除。` })
            });
          } else {
             await fetch(`https://api.telegram.org/bot${env.TG_BOT_TOKEN}/editMessageText`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ chat_id: cb.message.chat.id, message_id: cb.message.message_id, text: `⚠️ 数据库中找不到此图标。` })
            });
          }
          await fetch(`https://api.telegram.org/bot${env.TG_BOT_TOKEN}/answerCallbackQuery`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ callback_query_id: cb.id, text: "清理完成！" }) });
        }
        return new Response('OK');
      }

      if (update.message) {
        const chatRoomId = String(update.message.chat.id);
        const userId = String(update.message.from.id);
        
        if (allowedAdminIds.length > 0 && !allowedAdminIds.includes(chatRoomId) && !allowedAdminIds.includes(userId)) return new Response('OK');

        const msgText = update.message.text || '';

        if (msgText === '/start' || msgText === '/help') {
           await fetch(`https://api.telegram.org/bot${env.TG_BOT_TOKEN}/sendMessage`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ chat_id: chatRoomId, text: menuText, parse_mode: 'HTML', disable_web_page_preview: true, reply_markup: menuMarkup })
           });
           return new Response('OK');
        }

        if (msgText.startsWith('/del ')) {
            const targetName = msgText.replace('/del ', '').trim();
            if (!targetName) return new Response('OK');

            let foundKey = null;
            let rawValue = null;

            let listComplete = false;
            let cursor = undefined;
            while (!listComplete && !foundKey) {
                const list = await env.ICON_KV.list({ cursor: cursor });
                for (const keyObj of list.keys) {
                    if (keyObj.name === targetName) { foundKey = keyObj.name; break; }
                    const parts = keyObj.name.split(':');
                    const cleanName = parts.length >= 3 ? parts.slice(2).join(':') : parts[1];
                    if (cleanName === targetName) { foundKey = keyObj.name; break; }
                }
                listComplete = list.list_complete;
                cursor = list.cursor;
            }

            if (foundKey) {
                rawValue = await env.ICON_KV.get(foundKey);
                const { url } = parseKvValue(rawValue);
                if (url) {
                  const urlObj = new URL(url);
                  const r2Path = urlObj.pathname.substring(1);
                  await env.ICON_R2.delete(r2Path);
                }
                await env.ICON_KV.delete(foundKey);
                await fetch(`https://api.telegram.org/bot${env.TG_BOT_TOKEN}/sendMessage`, {
                  method: 'POST', headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ chat_id: chatRoomId, text: `✅ 成功从数据库删除: [${foundKey}]！` })
                });
            } else {
                await fetch(`https://api.telegram.org/bot${env.TG_BOT_TOKEN}/sendMessage`, {
                  method: 'POST', headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ chat_id: chatRoomId, text: `⚠️ 找不到名称包含 [${targetName}] 的图标。` })
                });
            }
            return new Response('OK');
        }

        if (update.message.photo) {
          const photo = update.message.photo.pop(); 
          const fileId = photo.file_id;
          let caption = update.message.caption || `tg_icon_${Date.now()}`;
          
          let tgCategory = '';
          let tgIconName = caption;
          if (caption.includes(':') || caption.includes('：')) {
              const parts = caption.split(/[:：]/);
              tgCategory = parts[0].trim().replace(/[:/]/g, '');
              tgIconName = parts.slice(1).join(':').trim();
          }

          const role = 'admin'; 
          const kvKey = tgCategory ? `${role}:${tgCategory}:${tgIconName}` : `${role}:${tgIconName}`;

          try {
            const fileInfoRes = await fetch(`https://api.telegram.org/bot${env.TG_BOT_TOKEN}/getFile?file_id=${fileId}`);
            const fileInfo = await fileInfoRes.json();
            const imageRes = await fetch(`https://api.telegram.org/file/bot${env.TG_BOT_TOKEN}/${fileInfo.result.file_path}`);
            const imageBuffer = await imageRes.arrayBuffer();

            const r2Path = `tg/${tgIconName}_${Date.now()}.png`;
            await env.ICON_R2.put(r2Path, imageBuffer);
            const publicUrl = `${hostUrl}/${r2Path}`;

            let replyMsgId = null;
            const catText = tgCategory ? `\n合集: <code>${tgCategory}</code>` : '';
            
            const tgRes = await fetch(`https://api.telegram.org/bot${env.TG_BOT_TOKEN}/sendMessage`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                chat_id: chatRoomId, 
                text: `✅ <b>上传成功</b>${catText}\n名称: <code>${tgIconName}</code>\n直链: ${publicUrl}\n\n<i>(已归类至 Admin 库)</i>`, 
                parse_mode: 'HTML',
                reply_markup: { inline_keyboard: [[{ text: "🗑️ 撤回并删除", callback_data: `del_kv:${kvKey}` }]] }
              })
            });
            
            if (tgRes.ok) {
                const tgData = await tgRes.json();
                replyMsgId = tgData.result.message_id;
            }

            await env.ICON_KV.put(kvKey, JSON.stringify({ url: publicUrl, msgId: replyMsgId, chatId: chatRoomId }));

          } catch (err) {
            await fetch(`https://api.telegram.org/bot${env.TG_BOT_TOKEN}/sendMessage`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ chat_id: chatRoomId, text: `❌ 上传失败` })
            });
          }
        }
      }
      return new Response('OK');
    }

    // ==========================================
    // 🟢 R2 图片静态回源代理 
    // ==========================================
    if (request.method === 'GET' && !path.startsWith('/api') && path !== '/' && path !== '/gallery' && path !== '/admin' && !path.endsWith('.json')) {
        const r2Path = path.substring(1); 
        const object = await env.ICON_R2.get(r2Path);
        if (object) {
            const headers = new Headers();
            object.writeHttpMetadata(headers);
            headers.set('etag', object.httpEtag);
            headers.set('Cache-Control', 'public, max-age=31536000');
            return new Response(object.body, { headers });
        }
    }

    return new Response('Not Found', { status: 404 });
  }
};
