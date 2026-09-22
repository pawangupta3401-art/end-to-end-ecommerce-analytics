// =====================================================
//  OLIST ANALYTICS DASHBOARD — app.js
//  Data: Based on real Olist dataset metrics from
//  ecommerce_analytical_insights.md + marketing_analytical_insights.md
// =====================================================

'use strict';

// ---- CHART.JS GLOBAL DEFAULTS ----
Chart.defaults.color = '#8b909c';
Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.font.size = 12;

const PALETTE = {
  indigo:   '#6366f1',
  purple:   '#8b5cf6',
  cyan:     '#06b6d4',
  amber:    '#f59e0b',
  emerald:  '#10b981',
  rose:     '#f43f5e',
  violet:   '#a78bfa',
  sky:      '#38bdf8',
  orange:   '#f97316',
  teal:     '#14b8a6',
  pink:     '#ec4899',
  lime:     '#84cc16',
};

const SERIES_COLORS = Object.values(PALETTE);

function alpha(hex, a) {
  const r = parseInt(hex.slice(1,3),16),
        g = parseInt(hex.slice(3,5),16),
        b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${a})`;
}

// ---- NAVIGATION ----
const navItems = document.querySelectorAll('.nav-item');
const pages    = document.querySelectorAll('.page');

const pageMeta = {
  summary:   { title: 'Executive Summary',         subtitle: 'High-level KPIs across the Olist marketplace' },
  customers: { title: 'Customer Analytics',         subtitle: 'Geography, behavior & lifetime value' },
  orders:    { title: 'Orders & Logistics',         subtitle: 'Delivery performance & fulfillment metrics' },
  products:  { title: 'Product & Category Insights',subtitle: 'Revenue, units, price & freight analysis' },
  payments:  { title: 'Payment Analytics',          subtitle: 'Payment methods, installments & order value' },
  reviews:   { title: 'Reviews & Satisfaction',     subtitle: 'Customer ratings & delivery impact' },
  marketing: { title: 'Marketing Funnel',           subtitle: 'MQL → Closed deal conversion & seller quality' },
};

function navigateTo(page) {
  navItems.forEach(n => n.classList.toggle('active', n.dataset.page === page));
  pages.forEach(p   => p.classList.toggle('active', p.id === `page-${page}`));
  const meta = pageMeta[page];
  document.getElementById('pageTitle').textContent    = meta.title;
  document.getElementById('pageSubtitle').textContent = meta.subtitle;
}

navItems.forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    navigateTo(item.dataset.page);
  });
});

// ---- KPI COUNTER ANIMATION ----
function animateCount(el) {
  const target   = parseFloat(el.dataset.count);
  const prefix   = el.dataset.prefix  ?? '';
  const decimal  = el.dataset.decimal ?? '';
  const isFloat  = String(target).includes('.');
  const duration = 1400;
  const start    = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = target * eased;

    if (isFloat) {
      el.textContent = prefix + current.toFixed(2) + decimal;
    } else {
      el.textContent = prefix + Math.floor(current).toLocaleString() + decimal;
    }

    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = prefix + (isFloat ? target.toFixed(2) : target.toLocaleString()) + decimal;
  }
  requestAnimationFrame(step);
}

document.querySelectorAll('.kpi-value[data-count]').forEach(el => {
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { animateCount(el); obs.disconnect(); }
  });
  obs.observe(el);
});

// ---- CHART FACTORY HELPERS ----
function makeBarChart(id, labels, data, color, opts = {}) {
  const ctx = document.getElementById(id);
  if (!ctx) return;
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: opts.label ?? 'Value',
        data,
        backgroundColor: alpha(color, 0.75),
        borderColor: color,
        borderWidth: 1.5,
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
      scales: {
        x: { grid: { display: false }, ticks: { maxRotation: opts.rotate ?? 0 } },
        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { callback: opts.yFmt } }
      },
      animation: { duration: 900, easing: 'easeOutQuart' },
      ...opts.extra
    }
  });
}

function makeHBarChart(id, labels, data, colors, opts = {}) {
  const ctx = document.getElementById(id);
  if (!ctx) return;
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: opts.label ?? 'Value',
        data,
        backgroundColor: Array.isArray(colors) ? colors.map(c => alpha(c, 0.8)) : alpha(colors, 0.75),
        borderColor: Array.isArray(colors) ? colors : colors,
        borderWidth: 1.5,
        borderRadius: 5,
        borderSkipped: false,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { callback: opts.xFmt } },
        y: { grid: { display: false } }
      },
      animation: { duration: 900, easing: 'easeOutQuart' },
    }
  });
}

function makeDoughnut(id, labels, data, colors) {
  const ctx = document.getElementById(id);
  if (!ctx) return;
  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors.map(c => alpha(c, 0.85)),
        borderColor: colors,
        borderWidth: 2,
        hoverOffset: 6,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      cutout: '62%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { padding: 14, usePointStyle: true, pointStyleWidth: 8, font: { size: 11 } }
        },
        tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.formattedValue}%` } }
      },
      animation: { animateRotate: true, duration: 1000 }
    }
  });
}

function makeLine(id, labels, data, color) {
  const ctx = document.getElementById(id);
  if (!ctx) return;
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Revenue (R$)',
        data,
        borderColor: color,
        backgroundColor: alpha(color, 0.15),
        fill: true,
        tension: 0.45,
        pointRadius: 4,
        pointBackgroundColor: color,
        pointBorderColor: '#0a0b0f',
        pointBorderWidth: 2,
        pointHoverRadius: 7,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
      scales: {
        x: { grid: { display: false } },
        y: {
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { callback: v => `R$${(v/1000).toFixed(0)}k` }
        }
      },
      animation: { duration: 1200, easing: 'easeOutCubic' }
    }
  });
}

// =====================================================
// DATA (derived from Olist dataset analytics)
// =====================================================

// ---- SUMMARY ----
function initSummary() {
  // Revenue trend (monthly GMV)
  makeLine('revenueChart',
    ['Jan\'17','Mar\'17','May\'17','Jul\'17','Sep\'17','Nov\'17','Jan\'18','Mar\'18','May\'18','Jul\'18','Aug\'18'],
    [120000, 185000, 240000, 310000, 395000, 680000, 820000, 940000, 1100000, 1250000, 980000],
    PALETTE.indigo
  );

  // Order status donut
  makeDoughnut('orderStatusChart',
    ['Delivered', 'Shipped', 'Cancelled', 'Unavailable', 'Other'],
    [96.5, 1.1, 0.6, 0.4, 1.4],
    [PALETTE.emerald, PALETTE.cyan, PALETTE.rose, PALETTE.amber, PALETTE.purple]
  );

  // State revenue
  makeHBarChart('stateRevenueChart',
    ['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'DF', 'GO', 'ES'],
    [5942978, 2082022, 1921640, 877400, 853888, 627730, 482168, 410066, 361484, 309624],
    SERIES_COLORS,
    { xFmt: v => `R$${(v/1e6).toFixed(1)}M`, label: 'Revenue' }
  );

  // Payment type donut
  makeDoughnut('paymentChart',
    ['Credit Card', 'Boleto', 'Voucher', 'Debit Card'],
    [73.9, 19.0, 5.6, 1.5],
    [PALETTE.indigo, PALETTE.cyan, PALETTE.amber, PALETTE.emerald]
  );
}

// ---- CUSTOMERS ----
function initCustomers() {
  makeHBarChart('customerStateChart',
    ['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'DF', 'GO', 'ES'],
    [41746, 12852, 11635, 5466, 5045, 3637, 3380, 2140, 2020, 2033],
    SERIES_COLORS,
    { xFmt: v => v.toLocaleString(), label: 'Unique Customers' }
  );

  makeDoughnut('customerConcentrationChart',
    ['SP', 'RJ', 'MG', 'RS', 'PR', 'Others'],
    [43.4, 13.4, 12.1, 5.7, 5.2, 20.2],
    [PALETTE.indigo, PALETTE.purple, PALETTE.cyan, PALETTE.emerald, PALETTE.amber, PALETTE.rose]
  );
}

// ---- ORDERS & LOGISTICS ----
function initOrders() {
  makeHBarChart('deliveryStateChart',
    ['RR', 'AP', 'AM', 'PA', 'MA', 'PI', 'TO', 'AC', 'AL', 'SE', 'RN', 'CE', 'PB', 'BA', 'PE'],
    [28.5, 26.8, 25.4, 24.1, 22.6, 21.9, 20.3, 19.8, 18.4, 17.9, 17.2, 16.5, 16.1, 15.8, 15.3],
    SERIES_COLORS.map((_, i) => {
      const pct = i / 14;
      return pct < 0.4 ? PALETTE.rose : pct < 0.7 ? PALETTE.amber : PALETTE.emerald;
    }),
    { xFmt: v => `${v} days`, label: 'Avg Delivery Days' }
  );

  makeDoughnut('deliveryAccuracyChart',
    ['On-Time', 'Late'],
    [93.4, 6.6],
    [PALETTE.emerald, PALETTE.rose]
  );
}

// ---- PRODUCTS ----
function initProducts() {
  makeHBarChart('categoryRevenueChart',
    ['Health & Beauty', 'Watches & Gifts', 'Bed & Bath', 'Sports & Leisure', 'Computers & Accessories',
     'Furniture & Decor', 'Housewares', 'Auto', 'Garden Tools', 'Cool Stuff'],
    [1258681, 1207016, 1037530, 991895, 889826, 751873, 699424, 663012, 624892, 590456],
    SERIES_COLORS,
    { xFmt: v => `R$${(v/1000).toFixed(0)}k`, label: 'Revenue' }
  );

  makeDoughnut('categoryUnitsChart',
    ['Bed & Bath', 'Health & Beauty', 'Sports & Leisure', 'Furniture & Decor', 'Computers', 'Housewares', 'Auto', 'Toys'],
    [11115, 9670, 8641, 8334, 7827, 6964, 4964, 4118],
    SERIES_COLORS
  );

  makeBarChart('weightPriceChart',
    ['0–500g', '500–1000g', '1000–2000g', '2000–5000g', '5000g+'],
    [94.35, 109.48, 128.70, 162.30, 247.85],
    PALETTE.amber,
    { label: 'Avg Price (R$)', yFmt: v => `R$${v}` }
  );

  makeHBarChart('profitChart',
    ['Health & Beauty', 'Watches & Gifts', 'Bed & Bath', 'Sports & Leisure', 'Computers'],
    [1091024, 1041892, 900114, 852671, 762094],
    [PALETTE.emerald, PALETTE.cyan, PALETTE.indigo, PALETTE.purple, PALETTE.amber],
    { xFmt: v => `R$${(v/1000).toFixed(0)}k`, label: 'Profit' }
  );
}

// ---- PAYMENTS ----
function initPayments() {
  makeDoughnut('paymentDistChart',
    ['Credit Card', 'Boleto', 'Voucher', 'Debit Card'],
    [73.9, 19.0, 5.6, 1.5],
    [PALETTE.indigo, PALETTE.cyan, PALETTE.amber, PALETTE.emerald]
  );

  makeBarChart('installmentChart',
    ['1 installment', '2–3 install.', '4–6 install.', '7–12 install.', '13+'],
    [47600, 20340, 18820, 11560, 1124],
    PALETTE.purple,
    { label: 'Orders', yFmt: v => v.toLocaleString() }
  );

  makeBarChart('paymentRevenueChart',
    ['Credit Card', 'Boleto', 'Voucher', 'Debit Card'],
    [12586000, 2889000, 389200, 218100],
    PALETTE.indigo,
    { label: 'Revenue (R$)', yFmt: v => `R$${(v/1e6).toFixed(1)}M` }
  );

  makeBarChart('avgOrderValueChart',
    ['Credit Card', 'Voucher', 'Boleto', 'Debit Card'],
    [163.40, 142.20, 137.80, 126.60],
    PALETTE.cyan,
    { label: 'Avg Order (R$)', yFmt: v => `R$${v}` }
  );
}

// ---- REVIEWS ----
function initReviews() {
  makeBarChart('reviewDistChart',
    ['1 ⭐', '2 ⭐', '3 ⭐', '4 ⭐', '5 ⭐'],
    [11424, 3244, 8179, 19342, 57078],
    PALETTE.amber,
    { label: 'Reviews', yFmt: v => v.toLocaleString() }
  );

  makeBarChart('reviewDeliveryChart',
    ['On-Time Delivery', 'Late Delivery'],
    [4.22, 2.64],
    PALETTE.emerald,
    { label: 'Avg Review Score', yFmt: v => `${v} ⭐`, extra: { scales: { y: { min: 0, max: 5 } } } }
  );

  makeHBarChart('categoryRatingChart',
    ['Security & Services', 'Diapers & Hygiene', 'Fashion Children Clothes', 'PC Gamer', 'Home Comfort 2',
     'CDs & DVDs Music', 'Insurance & Services', 'Fashion Sports', 'Tablets & Printing', 'Furniture'],
    [2.50, 2.72, 3.10, 3.18, 3.25, 3.32, 3.40, 3.47, 3.54, 3.61],
    SERIES_COLORS.map((_, i) => i < 3 ? PALETTE.rose : i < 6 ? PALETTE.amber : PALETTE.emerald),
    { xFmt: v => `${v} ⭐`, label: 'Avg Rating' }
  );
}

// ---- MARKETING ----
function initMarketing() {
  makeHBarChart('leadOriginChart',
    ['Organic Search', 'Paid Search', 'Social', 'Email', 'Referral', 'Direct Traffic', 'Other Publicity', 'Unknown'],
    [16.8, 13.2, 12.4, 11.8, 10.6, 9.1, 8.2, 7.5],
    SERIES_COLORS,
    { xFmt: v => `${v}%`, label: 'Conversion Rate' }
  );

  makeBarChart('businessTypeChart',
    ['Technology', 'Reseller', 'Manufacturer', 'Others'],
    [38500, 28100, 21400, 14200],
    PALETTE.violet,
    { label: 'Avg Monthly Revenue (R$)', yFmt: v => `R$${(v/1000).toFixed(0)}k` }
  );
}

// ---- INIT ALL ----
initSummary();
initCustomers();
initOrders();
initProducts();
initPayments();
initReviews();
initMarketing();
