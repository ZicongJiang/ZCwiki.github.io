// 动态生成 Accordion 目录
async function buildMenu() {
  const res = await fetch('menu.json');
  if (!res.ok) {
    document.getElementById('menu').textContent = '目录加载失败';
    return;
  }
  const menu = await res.json();
  const container = document.getElementById('menu');

  for (const [category, items] of Object.entries(menu)) {
    // 创建 <details> 折叠面板
    const details = document.createElement('details');

    // 默认让第一个分类展开（可选）
    // if (Object.keys(menu)[0] === category) details.open = true;

    // 分类标题
    const summary = document.createElement('summary');
    summary.textContent = category;
    details.appendChild(summary);

    // 子菜单列表
    const ulSub = document.createElement('ul');
    for (const [label, path] of Object.entries(items)) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.textContent = label;
      a.addEventListener('click', e => {
        e.preventDefault();
        loadContent(path);
        // 点击后高亮当前项
        document.querySelectorAll('#menu a').forEach(x => x.classList.remove('active'));
        a.classList.add('active');
      });
      li.appendChild(a);
      ulSub.appendChild(li);
    }
    details.appendChild(ulSub);
    container.appendChild(details);
  }
}

// 加载对应内容：Markdown 渲染或 PDF/HTML 嵌入
async function loadContent(path) {
  const contentEl = document.getElementById('content');

  // 检测 PDF / HTML 文件
  if (/.pdf$/i.test(path) || /.html?$/i.test(path)) {
    contentEl.innerHTML = `<iframe src="${path}"></iframe>`;
    return;
  }

  // Markdown 渲染
  const res = await fetch(path);
  if (!res.ok) {
    contentEl.innerHTML = `<p style="color:red">加载失败：${path}</p>`;
    return;
  }
  const md = await res.text();
  contentEl.innerHTML = marked.parse(md);
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  buildMenu();
});
