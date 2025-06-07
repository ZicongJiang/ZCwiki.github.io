// 左侧目录及对应文件配置
const menu = {
    "基础数学知识": {
      "线性代数": { type: "markdown", path: "content/math/linear_algebra.md" },
      "概率论":   { type: "markdown", path: "content/基础数学知识/概率论.md" }
    },
    "数字通信": {
      "均衡器":   { type: "markdown", path: "content/数字通信/均衡器.md" },
      "ISI定义":  { type: "markdown", path: "content/数字通信/ISI定义.md" }
    },
    "人工智能算法": {
      "神经网络": { type: "markdown", path: "content/人工智能算法/神经网络.md" }
    },
    "光通信": {
      "光纤":     { type: "pdf",      path: "content/optical_fiber_channel" }
    }
  };
  
  // 构建侧边栏
  function buildSidebar() {
    const sb = document.getElementById('sidebar');
    Object.entries(menu).forEach(([cat, subs]) => {
      const h = document.createElement('div');
      h.className = 'category';
      h.textContent = cat;
      sb.appendChild(h);
  
      Object.entries(subs).forEach(([name, item]) => {
        const d = document.createElement('div');
        d.className = 'subcategory';
        d.textContent = name;
        d.addEventListener('click', () => loadContent(item));
        sb.appendChild(d);
      });
    });
  }
  
  // 加载内容
  function loadContent(item) {
    const ct = document.getElementById('content');
    ct.innerHTML = '';  // 清空
    if (item.type === 'markdown') {
      const mdPath = encodeURI(item.path);
      fetch(mdPath)
        .then(res => res.ok ? res.text() : Promise.reject(res.statusText))
        .then(md => {
          const wrap = document.createElement('div');
          wrap.className = 'markdown-body';
          wrap.innerHTML = marked.parse(md);
          ct.appendChild(wrap);
        })
        .catch(err => {
          ct.innerHTML = `<div id="placeholder">加载失败：${err}</div>`;
        });
    }
    else if (item.type === 'pdf') {
      const pdfPath = encodeURI(item.path);
      const iframe = document.createElement('iframe');
      iframe.src = pdfPath;
      ct.appendChild(iframe);
    }
  }
  
  // 初始化
  buildSidebar();
  