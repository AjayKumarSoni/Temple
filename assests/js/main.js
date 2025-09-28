'use strict';

// Inject shared layout (sidebar + header)
function renderLayout(active) {
  const sidebar = document.querySelector('#sidebar');
  const header = document.querySelector('#header');
  // Determine base path depending on whether we're in /pages/ or project root
  const inPages = /\/pages\//.test(location.pathname);
  const base = inPages ? '../' : '';
  if (sidebar) sidebar.innerHTML = `
    <div class="brand">
      <div class="logo"></div>
      <div class="title">CrowdSutra</div>
    </div>
    <div class="nav">
      <div class="section">Main</div>
      <a href="${base}index.html" class="${active==='dashboard'?'active':''}"><span>Dashboard</span></a>
      <div class="section">Operations</div>
      <a href="${base}pages/crowd.html" class="${active==='crowd'?'active':''}"><span>Crowd Monitoring</span></a>
      <a href="${base}pages/queue.html" class="${active==='queue'?'active':''}"><span>Queue Mgmt</span></a>
      <a href="${base}pages/safety.html" class="${active==='safety'?'active':''}"><span>Safety</span></a>
      <a href="${base}pages/staff.html" class="${active==='staff'?'active':''}"><span>Staff</span></a>
      <a href="${base}pages/finance.html" class="${active==='finance'?'active':''}"><span>Finance</span></a>
      <a href="${base}pages/visitors.html" class="${active==='visitors'?'active':''}"><span>Visitors</span></a>
      <a href="${base}pages/infrastructure.html" class="${active==='infrastructure'?'active':''}"><span>Infrastructure</span></a>
      <a href="${base}pages/communication.html" class="${active==='communication'?'active':''}"><span>Communication</span></a>
      <a href="${base}pages/bookings.html" class="${active==='bookings'?'active':''}"><span>Bookings</span></a>
      <div class="section">Analytics</div>
      <a href="${base}pages/reports.html" class="${active==='reports'?'active':''}"><span>Reports</span></a>
      <div class="section">System</div>
      <a href="${base}pages/settings.html" class="${active==='settings'?'active':''}"><span>Configuration</span></a>
      <a href="${base}pages/vendors.html" class="${active==='vendors'?'active':''}"><span>Vendors</span></a>
      <a href="${base}pages/mobile.html" class="${active==='mobile'?'active':''}"><span>Mobile App</span></a>
      <a href="${base}pages/emergency.html" class="${active==='emergency'?'active':''}"><span>Emergency</span></a>
    </div>
    <div class="footer">© ${new Date().getFullYear()} CrowdSutra</div>
  `;
  if (header) header.innerHTML = `
    <div class="search">
      <input placeholder="Search modules, bookings, incidents..." />
    </div>
    <div style="display:flex; gap:8px;">
      <button class="btn ghost" onclick="location.href='${base}index.html'" title="Home">
        <img src="${base}assets/icons/home.svg" alt="Home" width="16" height="16"/>
      </button>
      <button class="btn ghost" onclick="alert('Notifications coming soon')">Notifications</button>
      <button class="btn ghost" onclick="alert('Profile coming soon')">Profile</button>
    </div>
  `;
}

// Mock data utils
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function choice(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

// Page initializers
const Page = {
  dashboard() {
    // KPIs
    const crowd = document.querySelector('#kpi-crowd');
    const bookings = document.querySelector('#kpi-bookings');
    const alerts = document.querySelector('#kpi-alerts');
    const status = document.querySelector('#kpi-status');

    function tick() {
      if (crowd) crowd.textContent = rand(1200, 4500).toLocaleString();
      if (bookings) bookings.textContent = rand(300, 1500).toLocaleString();
      if (alerts) {
        const v = rand(0, 5);
        alerts.textContent = v;
        const b = document.querySelector('#badge-alerts');
        if (b){
          b.className = 'badge ' + (v===0?'success':v<3?'warn':'danger');
          b.textContent = v===0?'Normal':v<3?'Watch':'Critical';
        }
      }
      if (status) status.textContent = choice(['All systems normal','Minor delays in East Gate','Camera #12 offline','Maintenance mode in Zone B']);
    }
    tick();
    setInterval(tick, 30000);

    // Chart: revenue/visitors today
    if (window.Chart) {
      const ctx = document.getElementById('chart-today');
      if (ctx) new Chart(ctx, {
        type: 'line',
        data: {
          labels: Array.from({length: 12}, (_,i)=>`${8+i}:00`),
          datasets: [
            { label:'Visitors', data: Array.from({length:12},()=>rand(50,500)), borderColor:'#2563eb', backgroundColor:'rgba(37,99,235,0.1)', tension:.35, fill:true },
            { label:'Revenue', data: Array.from({length:12},()=>rand(1,50)), borderColor:'#22c55e', backgroundColor:'rgba(34,197,94,0.1)', tension:.35, yAxisID:'y1' }
          ]
        },
        options: { responsive:true, scales:{ y:{ beginAtZero:true }, y1:{ beginAtZero:true, position:'right' } } }
      });
    }

    // Heatmap placeholder with Leaflet circles
    if (window.L) {
      const map = L.map('map').setView([17.383, 78.486], 16);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
      const zones = [ [17.383,78.486], [17.384,78.485], [17.382,78.487], [17.3835,78.488] ];
      const circles = zones.map(([lat,lng])=> L.circle([lat,lng], { radius: 90, color: '#ef4444', weight:1, fillColor:'#ef4444', fillOpacity: 0.3 }).addTo(map));
      function recolor(){ circles.forEach(c=> c.setStyle({ color: ['#22c55e','#f59e0b','#ef4444'][rand(0,2)], fillColor: ['#22c55e','#f59e0b','#ef4444'][rand(0,2)] })); }
      recolor(); setInterval(recolor, 30000);
    }
  },
  crowd(){},
  queue(){},
  safety(){},
  staff(){},
  finance(){},
  visitors(){},
  infrastructure(){},
  communication(){},
  bookings(){},
  reports(){},
  settings(){},
  vendors(){},
  mobile(){},
  emergency(){}
};

// Boot per page
window.addEventListener('DOMContentLoaded', () => {
  const page = document.body.getAttribute('data-page') || 'dashboard';
  renderLayout(page);
  if (Page[page]) Page[page]();
});
