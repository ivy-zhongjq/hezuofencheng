// app.js — 抖店认款系统交互逻辑（v3 迭代：多页面切换 / 筛选 / 分页 / 导入流程）

// ===== 页面注册表 =====
const PAGE_META = {
  'renkuan-list': { label: '抖店认款订单', view: 'page-renkuan', render: renderRenkuanPage },
  'yirenkuan-mingxi': { label: '已认款明细', view: 'page-mingxi', render: renderMingxiPage },
  'xinlingshou-yirenkuan': { label: '新零售已认款订单', view: 'page-xinlingshou', render: renderXinlingshouPage }
};

let currentPage = 'renkuan-list';

// ===== 侧边栏菜单渲染 =====
function renderSidebar() {
  const menuEl = document.getElementById('sidebarMenu');
  let html = '';

  DB.sidebarMenus.forEach((group, gIdx) => {
    const isOpen = true; // 默认展开
    html += `
      <div class="menu-group ${isOpen ? 'open' : ''}" data-group="${gIdx}">
        <div class="menu-group-title" onclick="toggleMenuGroup(${gIdx})">
          <span class="menu-icon">${getMenuIcon(group.icon)}</span>
          <span>${group.label}</span>
          <span class="menu-arrow">
            <svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </span>
        </div>
        <div class="menu-group-children">
    `;

    group.children.forEach((item) => {
      html += `
          <div class="menu-item ${item.key === currentPage ? 'active' : ''}" data-key="${item.key}" onclick="switchPage('${item.key}')">
            <span class="menu-dot"></span>
            <span>${item.label}</span>
          </div>
      `;
    });

    html += `
        </div>
      </div>
    `;
  });

  menuEl.innerHTML = html;
}

function getMenuIcon(iconName) {
  const icons = {
    receipt: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1-2 1z"/>
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
      <path d="M12 17V7"/>
    </svg>`
  };
  return icons[iconName] || icons.receipt;
}

function toggleMenuGroup(idx) {
  const group = document.querySelector(`.menu-group[data-group="${idx}"]`);
  if (group) {
    group.classList.toggle('open');
  }
}

// ===== 页面切换 =====
function switchPage(key) {
  if (!PAGE_META[key]) return;
  currentPage = key;

  // 切换页面视图
  document.querySelectorAll('.page-view').forEach(el => el.classList.remove('active'));
  const view = document.getElementById(PAGE_META[key].view);
  if (view) view.classList.add('active');

  // 更新侧边栏选中态
  document.querySelectorAll('.menu-item').forEach(el => {
    el.classList.toggle('active', el.dataset.key === key);
  });

  // 同步顶部标签
  openTab(key);
  renderTopTabs();

  // 渲染该页面数据
  PAGE_META[key].render();
}

// ===== 顶部标签渲染 =====
function openTab(key) {
  const exists = DB.topTabs.find(t => t.key === key);
  if (exists) {
    DB.topTabs.forEach(t => t.active = (t.key === key));
  } else {
    DB.topTabs.forEach(t => t.active = false);
    DB.topTabs.push({ label: PAGE_META[key].label, key, active: true });
  }
}

function renderTopTabs() {
  const tabsEl = document.getElementById('topTabs');
  let html = '';

  DB.topTabs.forEach((tab) => {
    html += `
      <div class="topbar-tab ${tab.active ? 'active' : ''}" onclick="switchPage('${tab.key}')">
        <svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
        ${tab.label}
        <span class="tab-close" onclick="closeTab('${tab.key}', event)">
          <svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </span>
      </div>
    `;
  });

  tabsEl.innerHTML = html;
}

function closeTab(key, event) {
  event.stopPropagation();
  if (DB.topTabs.length <= 1) return; // 至少保留一个标签

  const idx = DB.topTabs.findIndex(t => t.key === key);
  if (idx === -1) return;
  const wasActive = DB.topTabs[idx].active;
  DB.topTabs.splice(idx, 1);

  if (wasActive) {
    const next = DB.topTabs[Math.min(idx, DB.topTabs.length - 1)];
    switchPage(next.key);
  } else {
    renderTopTabs();
  }
}

// ===== 通用分页渲染 =====
const PAGE_SIZE = 10;

function renderPagination(elId, total, page, onPageChange) {
  const el = document.getElementById(elId);
  if (!el) return;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  page = Math.min(page, totalPages);

  let btns = `<button class="page-btn" ${page <= 1 ? 'disabled' : ''} onclick="${onPageChange}(${page - 1})">
    <svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  </button>`;

  for (let i = 1; i <= totalPages; i++) {
    btns += `<button class="page-btn ${i === page ? 'active' : ''}" onclick="${onPageChange}(${i})">${i}</button>`;
  }

  btns += `<button class="page-btn" ${page >= totalPages ? 'disabled' : ''} onclick="${onPageChange}(${page + 1})">
    <svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  </button>`;

  el.innerHTML = btns;
}

// ===== 工具函数 =====
// 格式化订单号 - 每6个字符换行
function formatOrderNo(orderNo) {
  if (!orderNo) return '-';
  const parts = [];
  for (let i = 0; i < orderNo.length; i += 6) {
    parts.push(orderNo.slice(i, i + 6));
  }
  return parts.join('\n');
}

// 渲染开票状态
function renderInvoiceStatus(status) {
  if (status === '已开票') {
    return '<span class="status-tag success">已开票</span>';
  } else if (status === '部分开票') {
    return '<span class="status-tag warning">部分开票</span>';
  } else if (status === '未开票') {
    return '<span class="status-tag gray">未开票</span>';
  }
  return status || '-';
}

// 渲染结清状态
function renderSettleStatus(status) {
  if (status === '已结清') {
    return '<span class="status-tag success">已结清</span>';
  } else if (status === '未结清') {
    return '<span class="status-tag warning">未结清</span>';
  }
  return status || '-';
}

// 渲染认款状态
function renderRecognizeStatus(status) {
  if (status === '已认款') {
    return '<span class="status-tag success">已认款</span>';
  } else if (status === '未认款') {
    return '<span class="status-tag warning">未认款</span>';
  }
  return status || '-';
}

// 渲染详情页开票状态
function renderDetailInvoiceStatus(status) {
  if (status === '已开票') {
    return '<span class="status-tag success">已开票</span>';
  } else if (status === '抖店已开票') {
    return '<span class="status-tag info">抖店已开票</span>';
  } else if (status === '无需开票') {
    return '<span class="status-tag gray">无需开票</span>';
  } else if (status === '待开票') {
    return '<span class="status-tag warning">待开票</span>';
  } else if (status === '未开票') {
    return '<span class="status-tag warning">未开票</span>';
  }
  return status || '-';
}

// 填充下拉筛选项
function fillSelect(selectId, options) {
  const el = document.getElementById(selectId);
  if (!el) return;
  options.forEach(opt => {
    const o = document.createElement('option');
    o.value = opt;
    o.textContent = opt;
    el.appendChild(o);
  });
}

// 日期是否落在范围内（空值表示不限）
function inDateRange(dateStr, startId, endId) {
  if (!dateStr) return true;
  const s = document.getElementById(startId) ? document.getElementById(startId).value : '';
  const e = document.getElementById(endId) ? document.getElementById(endId).value : '';
  if (s && dateStr < s) return false;
  if (e && dateStr > e) return false;
  return true;
}

// ============================================================
// 页面一：抖店认款订单
// ============================================================
function renderRenkuanPage() {
  applyRenkuanFilters();
}

function applyRenkuanFilters() {
  const settled = document.getElementById('filterSettled').value;
  const recognized = document.getElementById('filterRecognized').value;
  const douyinInvoice = document.getElementById('filterDouyinInvoice').value;
  const ourInvoice = document.getElementById('filterOurInvoice').value;

  const list = DB.orders.filter(o => {
    if (settled && o.isSettled !== settled) return false;
    // 已认款口径：认款金额 > 0
    if (recognized === '已认款' && !(o.recognizedAmount > 0)) return false;
    if (recognized === '未认款' && o.recognizedAmount > 0) return false;
    if (douyinInvoice && o.douyinInvoice !== douyinInvoice) return false;
    if (ourInvoice && o.ourInvoice !== ourInvoice) return false;
    if (!inDateRange(o.recognizeTime, 'filterDateStart', 'filterDateEnd')) return false;
    return true;
  });

  renderOrderTable(list);
}

function resetRenkuanFilters() {
  ['filterSettled', 'filterRecognized', 'filterDouyinInvoice', 'filterOurInvoice', 'filterDateStart', 'filterDateEnd']
    .forEach(id => { document.getElementById(id).value = ''; });
  applyRenkuanFilters();
  showToast('筛选条件已重置', 'info');
}

// 订单表格渲染
function renderOrderTable(list) {
  const tbody = document.getElementById('orderTableBody');
  let html = '';

  list.forEach((order) => {
    html += `
      <tr>
        <td>
          <span class="order-link" onclick="openOrderDetail('${order.totalOrderNo}')">${formatOrderNo(order.totalOrderNo)}</span>
        </td>
        <td class="num-col">${order.orderAmount}</td>
        <td class="num-col">${order.userPaid}</td>
        <td class="num-col">${order.platformSubsidy}</td>
        <td class="num-col">${order.paymentDiscount}</td>
        <td class="num-col">${order.influencerCommission}</td>
        <td class="num-col">${order.influencerServiceFee}</td>
        <td class="num-col">${order.platformCommission}</td>
        <td class="num-col">${order.settlementAmount}</td>
        <td class="num-col">${order.recognizedAmount}</td>
        <td>${order.recognizeTime}</td>
        <td>${renderInvoiceStatus(order.ourInvoice)}</td>
        <td>${renderInvoiceStatus(order.douyinInvoice)}</td>
        <td>${renderSettleStatus(order.isSettled)}</td>
        <td><span class="remark-text">${order.remark || '-'}</span></td>
        <td>${order.recognizer || '-'}</td>
        <td class="action-col">
          <button class="btn btn-text" onclick="handleEdit('${order.totalOrderNo}')">编辑</button>
        </td>
      </tr>
    `;
  });

  if (!list.length) {
    html = `<tr><td colspan="17" style="text-align:center; padding:40px 0; color:var(--text-tertiary);">暂无符合条件的订单</td></tr>`;
  }

  tbody.innerHTML = html;
  document.getElementById('totalCount').textContent = list.length;
}

// ===== 订单详情弹窗 =====
function openOrderDetail(totalOrderNo) {
  const details = DB.orderDetails[totalOrderNo];
  if (!details) return;

  const order = DB.orders.find(o => o.totalOrderNo === totalOrderNo);

  // 设置弹窗标题
  document.getElementById('modalTitle').textContent = `订单详情 - ${totalOrderNo}`;

  // 渲染摘要信息
  const summaryEl = document.getElementById('modalSummary');
  if (order) {
    summaryEl.innerHTML = `
      <div class="summary-item">
        <span class="summary-label">订单总金额</span>
        <span class="summary-value">¥${order.orderAmount}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">用户实付</span>
        <span class="summary-value">¥${order.userPaid}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">结算金额</span>
        <span class="summary-value">¥${order.settlementAmount}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">达人佣金</span>
        <span class="summary-value">¥${order.influencerCommission}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">达人佣金服务费</span>
        <span class="summary-value">¥${order.influencerServiceFee}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">平台佣金</span>
        <span class="summary-value">¥${order.platformCommission}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">已认款</span>
        <span class="summary-value">¥${order.recognizedAmount}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">是否已结清</span>
        <span class="summary-value">${renderSettleStatus(order.isSettled)}</span>
      </div>
    `;
  }

  // 添加说明文字
  const noteHtml = `
    <div class="modal-note">
      <span class="note-icon">
        <svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
      </span>
      <span>注：达人佣金和平台佣金先从原订单金额扣除；达人佣金服务费为达人佣金的10%</span>
    </div>
  `;
  summaryEl.innerHTML += noteHtml;

  // 渲染关联订单表格
  const detailTbody = document.getElementById('detailTableBody');
  let html = '';

  details.forEach((item) => {
    html += `
      <tr>
        <td>${formatOrderNo(item.relatedOrderNo)}</td>
        <td class="num-col">${item.orderAmount}</td>
        <td>${renderRecognizeStatus(item.recognizeStatus)}</td>
        <td class="num-col">${item.recognizedAmount}</td>
        <td><span class="category-text">${item.fundCategory}</span></td>
        <td>${item.fundMonth}</td>
        <td>${item.customerName}</td>
        <td>${renderDetailInvoiceStatus(item.invoiceStatus)}</td>
        <td class="num-col">${item.invoiceAmount}</td>
        <td>${item.remark || '-'}</td>
        <td>${item.recognizeTime}</td>
        <td>${item.recognizer}</td>
      </tr>
    `;
  });

  detailTbody.innerHTML = html;

  // 显示弹窗
  const modal = document.getElementById('orderDetailModal');
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('orderDetailModal');
  modal.classList.remove('show');
  document.body.style.overflow = '';
}

// ===== 备注编辑 =====
function handleEdit(orderNo) {
  const order = DB.orders.find(o => o.totalOrderNo === orderNo);
  if (!order) return;

  document.getElementById('remarkOrderNo').textContent = orderNo;
  document.getElementById('remarkInput').value = order.remark || '';

  const modal = document.getElementById('remarkModal');
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeRemarkModal() {
  const modal = document.getElementById('remarkModal');
  modal.classList.remove('show');
  document.body.style.overflow = '';
}

function saveRemark() {
  const orderNo = document.getElementById('remarkOrderNo').textContent;
  const remarkValue = document.getElementById('remarkInput').value.trim();

  const order = DB.orders.find(o => o.totalOrderNo === orderNo);
  if (order) {
    order.remark = remarkValue;
  }

  closeRemarkModal();
  applyRenkuanFilters();
  showToast('备注已保存', 'success');
}

// ============================================================
// 页面二：已认款明细
// ============================================================
// 由 orderDetails 派生：所有「已认款」的关联订单认款记录
function getRecognizedDetails() {
  const rows = [];
  Object.entries(DB.orderDetails).forEach(([totalNo, details]) => {
    details.forEach(d => {
      if (d.recognizeStatus === '已认款') {
        rows.push({ totalOrderNo: totalNo, ...d });
      }
    });
  });
  return rows;
}

let mingxiPage = 1;

function renderMingxiPage() {
  applyMingxiFilters();
}

function applyMingxiFilters() {
  const category = document.getElementById('mingxiFilterCategory').value;
  const month = document.getElementById('mingxiFilterMonth').value;
  const customer = document.getElementById('mingxiFilterCustomer').value;
  const recognizer = document.getElementById('mingxiFilterRecognizer').value;

  const all = getRecognizedDetails();
  const list = all.filter(d => {
    if (category && d.fundCategory !== category) return false;
    if (month && d.fundMonth !== month) return false;
    if (customer && d.customerName !== customer) return false;
    if (recognizer && d.recognizer !== recognizer) return false;
    if (!inDateRange(d.recognizeTime, 'mingxiFilterDateStart', 'mingxiFilterDateEnd')) return false;
    return true;
  });

  renderMingxiStats(all, list);
  renderMingxiTable(list);
}

function renderMingxiStats(all, list) {
  const sum = arr => arr.reduce((acc, d) => acc + (parseFloat(d.recognizedAmount) || 0), 0);
  const chips = [
    { label: '认款总金额', value: `¥${sum(list).toFixed(2)}`, cls: 'primary' },
    { label: '明细条数', value: `${list.length} 条`, cls: '' },
    { label: '涉及总订单', value: `${new Set(list.map(d => d.totalOrderNo)).size} 个`, cls: '' },
    { label: '涉及客户', value: `${new Set(list.map(d => d.customerName)).size} 家`, cls: '' }
  ];

  document.getElementById('mingxiStats').innerHTML = chips.map(c =>
    `<div class="stat-chip ${c.cls}"><span class="stat-label">${c.label}</span><span class="stat-value">${c.value}</span></div>`
  ).join('');
}

function renderMingxiTable(list) {
  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  if (mingxiPage > totalPages) mingxiPage = totalPages;
  const rows = list.slice((mingxiPage - 1) * PAGE_SIZE, mingxiPage * PAGE_SIZE);

  const tbody = document.getElementById('mingxiTableBody');
  let html = '';
  rows.forEach(d => {
    html += `
      <tr>
        <td><span class="order-link" onclick="openOrderDetail('${d.totalOrderNo}')">${formatOrderNo(d.totalOrderNo)}</span></td>
        <td>${formatOrderNo(d.relatedOrderNo)}</td>
        <td class="num-col">${d.orderAmount}</td>
        <td>${renderRecognizeStatus(d.recognizeStatus)}</td>
        <td class="num-col">${d.recognizedAmount}</td>
        <td><span class="category-text">${d.fundCategory}</span></td>
        <td>${d.fundMonth}</td>
        <td>${d.customerName}</td>
        <td>${renderDetailInvoiceStatus(d.invoiceStatus)}</td>
        <td class="num-col">${d.invoiceAmount}</td>
        <td><span class="remark-text">${d.remark || '-'}</span></td>
        <td>${d.recognizeTime}</td>
        <td>${d.recognizer}</td>
      </tr>
    `;
  });
  if (!rows.length) {
    html = `<tr><td colspan="13" style="text-align:center; padding:40px 0; color:var(--text-tertiary);">暂无符合条件的认款明细</td></tr>`;
  }
  tbody.innerHTML = html;

  document.getElementById('mingxiTotalCount').textContent = list.length;
  renderPagination('mingxiPagination', list.length, mingxiPage, 'goMingxiPage');
}

function goMingxiPage(page) {
  mingxiPage = page;
  applyMingxiFilters();
}

function resetMingxiFilters() {
  ['mingxiFilterCategory', 'mingxiFilterMonth', 'mingxiFilterCustomer', 'mingxiFilterRecognizer', 'mingxiFilterDateStart', 'mingxiFilterDateEnd']
    .forEach(id => { document.getElementById(id).value = ''; });
  mingxiPage = 1;
  applyMingxiFilters();
  showToast('筛选条件已重置', 'info');
}

// ============================================================
// 页面三：新零售已认款订单
// ============================================================
let xinlingshouPage = 1;

function renderXinlingshouPage() {
  applyXinlingshouFilters();
}

function applyXinlingshouFilters() {
  const category = document.getElementById('xslFilterCategory').value;
  const month = document.getElementById('xslFilterMonth').value;
  const customer = document.getElementById('xslFilterCustomer').value;

  const list = DB.newRetailOrders.filter(o => {
    if (category && o.fundCategory !== category) return false;
    if (month && o.fundMonth !== month) return false;
    if (customer && o.customerName !== customer) return false;
    if (!inDateRange(o.recognizeTime, 'xslFilterDateStart', 'xslFilterDateEnd')) return false;
    return true;
  });

  // 汇总统计
  const sum = list.reduce((acc, o) => acc + (o.recognizedAmount || 0), 0);
  document.getElementById('xinlingshouStats').innerHTML = `
    <div class="stat-chip primary"><span class="stat-label">已认款总额</span><span class="stat-value">¥${sum.toFixed(2)}</span></div>
    <div class="stat-chip"><span class="stat-label">订单数</span><span class="stat-value">${list.length} 单</span></div>
  `;

  renderXinlingshouTable(list);
}

function renderXinlingshouTable(list) {
  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  if (xinlingshouPage > totalPages) xinlingshouPage = totalPages;
  const rows = list.slice((xinlingshouPage - 1) * PAGE_SIZE, xinlingshouPage * PAGE_SIZE);

  const tbody = document.getElementById('xinlingshouTableBody');
  let html = '';
  rows.forEach(o => {
    html += `
      <tr>
        <td><span class="order-link order-plain">${o.orderNo}</span></td>
        <td>${o.orderTime}</td>
        <td class="num-col">${o.orderAmount}</td>
        <td class="num-col">${o.userPaid}</td>
        <td class="num-col">${o.recognizedAmount}</td>
        <td><span class="category-text">${o.fundCategory}</span></td>
        <td>${o.fundMonth}</td>
        <td>${o.customerName}</td>
        <td>${o.recognizer}</td>
        <td>${o.recognizeTime}</td>
        <td><span class="remark-text">${o.remark || '-'}</span></td>
      </tr>
    `;
  });
  if (!rows.length) {
    html = `<tr><td colspan="11" style="text-align:center; padding:40px 0; color:var(--text-tertiary);">暂无符合条件的新零售订单</td></tr>`;
  }
  tbody.innerHTML = html;

  document.getElementById('xinlingshouTotalCount').textContent = list.length;
  renderPagination('xinlingshouPagination', list.length, xinlingshouPage, 'goXinlingshouPage');
}

function goXinlingshouPage(page) {
  xinlingshouPage = page;
  applyXinlingshouFilters();
}

function resetXinlingshouFilters() {
  ['xslFilterCategory', 'xslFilterMonth', 'xslFilterCustomer', 'xslFilterDateStart', 'xslFilterDateEnd']
    .forEach(id => { document.getElementById(id).value = ''; });
  xinlingshouPage = 1;
  applyXinlingshouFilters();
  showToast('筛选条件已重置', 'info');
}

// ============================================================
// 导入弹窗（导入认款 / 抖店开票导入 共用）
// ============================================================
let importCtx = { type: null, step: 1, fileName: '', rows: [], validCount: 0 };

const IMPORT_META = {
  renkuan: {
    title: '导入认款',
    desc: '导入认款记录，系统将按总订单号自动匹配订单',
    templateCols: ['总订单号', '订单金额', '用户实付', '款项类别', '款项月份', '客户名称']
  },
  kaipiao: {
    title: '导入抖店开票数据',
    desc: '导入抖店开票记录，系统将按总订单号自动更新开票状态',
    templateCols: ['总订单号', '开票类型', '开票金额', '开票日期', '发票号码']
  }
};

function openImportModal(type) {
  importCtx = { type, step: 1, fileName: '', rows: [], validCount: 0 };
  document.getElementById('importModalTitle').textContent = IMPORT_META[type].title;
  document.getElementById('importFileInput').value = '';
  document.getElementById('filePill').style.display = 'none';
  renderImportStep();

  const modal = document.getElementById('importModal');
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeImportModal() {
  const modal = document.getElementById('importModal');
  modal.classList.remove('show');
  document.body.style.overflow = '';
}

function renderImportStep() {
  const { step, type } = importCtx;
  const meta = IMPORT_META[type];

  // 步骤条
  const steps = ['上传文件', '数据预览', '导入完成'];
  document.getElementById('importSteps').innerHTML = steps.map((label, i) => {
    const idx = i + 1;
    let cls = '';
    if (idx < step) cls = 'done';
    else if (idx === step) cls = 'current';
    return `
      <div class="import-step ${cls}">
        <div class="step-circle">${idx < step ? '✓' : idx}</div>
        <span class="step-label">${label}</span>
      </div>
      ${idx < steps.length ? '<div class="step-line"></div>' : ''}
    `;
  }).join('');

  // 面板显隐
  document.getElementById('importStepUpload').style.display = step === 1 ? '' : 'none';
  document.getElementById('importStepPreview').style.display = step === 2 ? '' : 'none';
  document.getElementById('importStepResult').style.display = step === 3 ? '' : 'none';

  // 底部按钮
  const footer = document.getElementById('importModalFooter');
  if (step === 1) {
    footer.innerHTML = `
      <button class="btn btn-default" onclick="closeImportModal()">取消</button>
      <button class="btn btn-primary" ${importCtx.fileName ? '' : 'disabled'} onclick="goImportPreview()">开始解析</button>
    `;
  } else if (step === 2) {
    footer.innerHTML = `
      <button class="btn btn-default" onclick="backImportUpload()">上一步</button>
      <button class="btn btn-primary" ${importCtx.validCount ? '' : 'disabled'} onclick="confirmImport()">确认导入（${importCtx.validCount} 条）</button>
    `;
  } else {
    footer.innerHTML = `<button class="btn btn-primary" onclick="finishImport()">完成</button>`;
  }
}

function handleImportFile(input) {
  const file = input.files && input.files[0];
  if (!file) return;
  importCtx.fileName = file.name;

  const pill = document.getElementById('filePill');
  pill.innerHTML = `
    <svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
    <span>${file.name}</span>
    <span class="file-size">${(file.size / 1024).toFixed(1)} KB</span>
  `;
  pill.style.display = 'inline-flex';
  renderImportStep();
}

function goImportPreview() {
  // 模拟解析文件，生成预览行
  importCtx.rows = generateMockImportRows(importCtx.type);
  importCtx.validCount = importCtx.rows.filter(r => r.ok).length;
  renderImportPreview();
  importCtx.step = 2;
  renderImportStep();
}

function backImportUpload() {
  importCtx.step = 1;
  renderImportStep();
}

function generateMockImportRows(type) {
  if (type === 'renkuan') {
    return [
      { cells: ['6953240188226105233', '298', '298', '礼品', '2026-04', '抖音零售客户'], ok: true, msg: '' },
      { cells: ['6953240188226109999', '158', '158', '信息服务费', '2026-04', '北京有竹居网络技术有限公司'], ok: true, msg: '' },
      { cells: ['', '99', '99', '礼品', '2026-04', '抖音零售客户'], ok: false, msg: '总订单号为空' },
      { cells: ['6953240188226105566', 'abc', '198', '卡片', '2026-04', '抖音零售客户'], ok: false, msg: '订单金额格式错误' }
    ];
  }
  return [
    { cells: ['6925165121833041575', '平台佣金', '9.9', '2026-10-10', '2633200012345'], ok: true, msg: '' },
    { cells: ['6925180932148788326', '平台佣金', '9.9', '2026-10-10', '2633200012346'], ok: true, msg: '' },
    { cells: ['6951628017741076249', '达人佣金服务费', '0.99', '2026-10-10', '2633200012347'], ok: true, msg: '' },
    { cells: ['6951628017741076249', '平台佣金', '-1', '2026-10-10', '2633200012348'], ok: false, msg: '开票金额不能为负数' }
  ];
}

function renderImportPreview() {
  const { type, rows } = importCtx;
  const cols = IMPORT_META[type].templateCols;
  const invalid = rows.length - importCtx.validCount;

  const tip = document.getElementById('importPreviewTip');
  tip.className = 'import-tip' + (invalid ? ' has-error' : '');
  tip.innerHTML = invalid
    ? `共解析 <b>${rows.length}</b> 条数据，<span class="ok-text">${importCtx.validCount} 条校验通过</span>，<span class="err-text">${invalid} 条校验失败</span>（确认导入时将自动跳过失败数据）`
    : `共解析 <b>${rows.length}</b> 条数据，全部校验通过`;

  const table = document.getElementById('importPreviewTable');
  table.innerHTML = `
    <thead>
      <tr>
        <th style="width:36px;">#</th>
        ${cols.map(c => `<th>${c}</th>`).join('')}
        <th>校验结果</th>
      </tr>
    </thead>
    <tbody>
      ${rows.map((r, i) => `
        <tr class="${r.ok ? '' : 'row-error'}">
          <td>${i + 1}</td>
          ${r.cells.map(c => `<td>${c || '-'}</td>`).join('')}
          <td>${r.ok ? '<span class="status-tag success">通过</span>' : `<span class="status-tag danger-tag">${r.msg}</span>`}</td>
        </tr>
      `).join('')}
    </tbody>
  `;
}

function confirmImport() {
  const { type, validCount } = importCtx;

  if (type === 'renkuan' && validCount > 0) {
    // 模拟：导入的第一条有效数据写入订单表
    const first = importCtx.rows.find(r => r.ok);
    const [totalOrderNo, orderAmount, userPaid, fundCategory, fundMonth, customerName] = first.cells;
    if (totalOrderNo && !DB.orders.find(o => o.totalOrderNo === totalOrderNo)) {
      DB.orders.push({
        totalOrderNo,
        orderAmount: parseFloat(orderAmount) || 0,
        userPaid: parseFloat(userPaid) || 0,
        platformSubsidy: 0,
        paymentDiscount: 0,
        influencerCommission: 0,
        influencerServiceFee: 0,
        platformCommission: 0,
        settlementAmount: parseFloat(userPaid) || 0,
        recognizedAmount: parseFloat(userPaid) || 0,
        recognizeTime: '2026-10-11',
        ourInvoice: '未开票',
        douyinInvoice: '未开票',
        isSettled: '未结清',
        remark: `导入认款（${fundCategory}·${fundMonth}·${customerName}）`,
        recognizer: DB.currentUser.name
      });
    }
  }

  importCtx.step = 3;
  document.getElementById('importResultDesc').textContent =
    `成功导入 ${validCount} 条${importCtx.rows.length - validCount ? `，自动跳过 ${importCtx.rows.length - validCount} 条校验失败数据` : ''}`;
  renderImportStep();
}

function finishImport() {
  const { type } = importCtx;
  closeImportModal();
  if (type === 'renkuan') {
    applyRenkuanFilters();
  } else {
    applyRenkuanFilters();
  }
  showToast('导入完成', 'success');
}

function downloadImportTemplate() {
  const { type } = importCtx;
  showToast(`「${IMPORT_META[type].templateCols.join(' / ')}」模板已开始下载（演示）`, 'info');
}

// ===== 拖拽上传 =====
function initUploadDrag() {
  const area = document.getElementById('uploadArea');
  if (!area) return;
  ['dragenter', 'dragover'].forEach(ev => area.addEventListener(ev, e => {
    e.preventDefault();
    area.classList.add('dragover');
  }));
  ['dragleave', 'drop'].forEach(ev => area.addEventListener(ev, e => {
    e.preventDefault();
    area.classList.remove('dragover');
  }));
  area.addEventListener('drop', e => {
    const files = e.dataTransfer && e.dataTransfer.files;
    if (files && files.length) {
      const dt = new DataTransfer();
      dt.items.add(files[0]);
      document.getElementById('importFileInput').files = dt.files;
      handleImportFile(document.getElementById('importFileInput'));
    }
  });
}

// ===== Toast 提示 =====
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%) translateY(-20px);
    padding: 12px 24px;
    background: #fff;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    font-size: 14px;
    color: #111827;
    z-index: 2000;
    opacity: 0;
    transition: all 0.3s ease;
    border-left: 4px solid ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
  `;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(-20px)';
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 2000);
}

// ===== 点击遮罩关闭弹窗 =====
document.addEventListener('click', (e) => {
  if (e.target.id === 'orderDetailModal') {
    closeModal();
  }
  if (e.target.id === 'remarkModal') {
    closeRemarkModal();
  }
  if (e.target.id === 'importModal') {
    closeImportModal();
  }
});

// ===== ESC 键关闭弹窗 =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    closeRemarkModal();
    closeImportModal();
  }
});

// ===== 页面初始化 =====
document.addEventListener('DOMContentLoaded', () => {
  renderSidebar();
  renderTopTabs();

  // 填充筛选下拉
  fillSelect('mingxiFilterCategory', DB.fundCategories);
  fillSelect('mingxiFilterMonth', DB.fundMonths);
  fillSelect('mingxiFilterCustomer', DB.customers);
  fillSelect('mingxiFilterRecognizer', DB.recognizers);
  fillSelect('xslFilterCategory', DB.fundCategories);
  fillSelect('xslFilterMonth', DB.fundMonths);
  fillSelect('xslFilterCustomer', DB.customers);

  initUploadDrag();
  renderOrderTable(DB.orders);
});
