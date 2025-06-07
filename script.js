// 加载 menu.json，动态生成导航
async function buildMenu() {
  const res = await fetch('menu.json');
  const menu = await res.json();
  const container = document.getElementById('menu');

  const ulRoot = document.createElement('ul');
  for (const [category, items] of Object.entries(menu)) {
    const liCat = document.createElement('li');
    const catTitle = document.createElement('strong');
    catTitle.textContent = category;
    liCat.appendChild(catTitle);

    const ulSub = document.createElement('ul');
    for (const [label, path] of Object.entries(items)) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#';
      a.textContent = label;
      a.addEventListener('click', e => {
        e.preventDefault();
        loadContent(path);
      });
      li.appendChild(a);
      ulSub.appendChild(li);
    }
    liCat.appendChild(ulSub);
    ulRoot.appendChild(liCat);
  }
  container.appendChild(ulRoot);
}

// 根据文件后缀，选择渲染方式
async function loadContent(path) {
  const contentEl = document.getElementById('content');
  // PDF 或 HTML
  if (/.pdf$/i.test(path) || /.html?$/i.test(path)) {
    contentEl.innerHTML = `<iframe src="${path}"></iframe>`;
    return;
  }
  // Markdown
  const res = await fetch(path);
  if (!res.ok) {
    contentEl.innerHTML = `<p style="color:red">加载失败：${path}</p>`;
    return;
  }
  const md = await res.text();
  contentEl.innerHTML = marked.parse(md);
}

document.addEventListener('DOMContentLoaded', () => {
  buildMenu();
});
