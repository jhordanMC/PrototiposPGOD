// ==================== VARIABLES GLOBALES ====================
const ray = document.querySelector('.ray');
const blackhole = document.querySelector('.blackhole');
const tiendaBox = document.querySelector('.tienda-box');
const btnIniciar = document.querySelector('.btn-iniciar');

// Menú Radial
const radialTrigger = document.getElementById('radialTrigger');
const radialMenu = document.getElementById('radialMenu');
const radialMenuContainer = document.getElementById('radialMenuContainer');
const radialItems = document.querySelectorAll('.radial-item');

// Botones inferiores
const bottomButtons = document.getElementById('bottomButtons');
const bottomBtnItems = document.querySelectorAll('.bottom-btn[data-section]');
const logoutBtn = document.getElementById('logoutBtn');

let angulo = 0;
const velocidad = 3;
let animando = true;

// ==================== BOTONES INFERIORES ====================
if (bottomBtnItems) {
  bottomBtnItems.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const section = btn.dataset.section;
      
      // Cambiar título
      updateTitle(section);
      
      // Ocultar todas las secciones
      document.querySelectorAll('.content-section, .news-section').forEach(s => {
        s.classList.remove('active');
      });
      
      // Mostrar sección
      const sectionElement = document.getElementById(`section-${section}`);
      if (sectionElement) sectionElement.classList.add('active');
    });
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      // Aquí iría la lógica de logout con el backend
      alert('Sesión cerrada');
      // window.location.href = '/login';
    }
  });
}

// ==================== MENÚ RADIAL ====================
if (radialTrigger && radialMenu) {
  radialTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    radialTrigger.classList.toggle('active');
    radialMenu.classList.toggle('active');
  });
  
  // Cerrar menú al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.radial-menu-container')) {
      radialTrigger.classList.remove('active');
      radialMenu.classList.remove('active');
    }
  });
  
  // Navegación desde menú radial
  radialItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const section = this.dataset.section;
      const clickedItem = this;
      
      // Animación de entrar al portal
      clickedItem.classList.add('entering-portal');
      
      // Esperar animación antes de cambiar sección
      setTimeout(() => {
        // Cerrar menú radial
        radialTrigger.classList.remove('active');
        radialMenu.classList.remove('active');
        
        // Quitar clase de animación
        clickedItem.classList.remove('entering-portal');
        
        // Cambiar título
        updateTitle(section);
        
        // Ocultar todas las secciones
        document.querySelectorAll('.content-section, .news-section').forEach(s => {
          s.classList.remove('active');
        });
        
        // Mostrar sección y cargar datos
        if (section === 'actualizaciones') {
          document.getElementById('section-actualizaciones').classList.add('active');
          loadNews();
        } else if (section === 'market') {
          document.getElementById('section-market').classList.add('active');
          loadRewards();
        } else if (section === 'ranking') {
          document.getElementById('section-ranking').classList.add('active');
          loadRanking();
        } else if (section === 'gambling') {
          document.getElementById('section-gambling').classList.add('active');
          actualizarBalance();
        } else if (section === 'soporte') {
          document.getElementById('section-soporte').classList.add('active');
          loadTicketsFromStorage();
        } else {
          const sectionElement = document.getElementById(`section-${section}`);
          if (sectionElement) sectionElement.classList.add('active');
        }
      }, 300);
    });
  });
}

// ==================== ANIMACIÓN DEL AGUJERO NEGRO ====================
function animar() {
  if (!animando) return;
  
  angulo += velocidad;
  
  if (angulo >= 360) {
    angulo = 360;
    ray.style.transform = `translate(-50%, -50%) rotate(${angulo}deg)`;
    animando = false;
    
    setTimeout(() => { ray.classList.add('oculto'); }, 50);
    setTimeout(() => { blackhole.classList.add('pequeno'); }, 100);
    setTimeout(() => { blackhole.classList.add('oculto'); }, 400);
    setTimeout(() => {
      tiendaBox.classList.add('visible');
      if (radialMenuContainer) radialMenuContainer.classList.add('visible');
      if (bottomButtons) bottomButtons.classList.add('visible');
      btnIniciar.classList.add('visible');
    }, 800);
    
    return;
  }
  
  ray.style.transform = `translate(-50%, -50%) rotate(${angulo}deg)`;
  requestAnimationFrame(animar);
}

animar();

// ==================== MENÚ LATERAL ====================
sidebarItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    sidebarItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    
    const section = item.dataset.section;
    updateTitle(section);
    
    document.querySelectorAll('.content-section, .news-section').forEach(s => {
      s.classList.remove('active');
    });
    
    if (section === 'actualizaciones') {
      document.getElementById('section-actualizaciones').classList.add('active');
      loadNews();
    } else {
      const sectionElement = document.getElementById(`section-${section}`);
      if (sectionElement) sectionElement.classList.add('active');
    }
  });
});

function updateTitle(section) {
  const titleText = document.querySelector('.titulo-arqueado text textPath');
  const titles = {
    'inicio': 'PGOD PUNTOS',
    'actualizaciones': 'ACTUALIZACIONES',
    'ranking': 'RANKING',
    'market': 'MARKET',
    'gambling': 'GAMBLING',
    'soporte': 'SOPORTE',
    'privacidad': 'PRIVACIDAD',
    'terminos': 'TÉRMINOS Y CONDICIONES'
  };
  
  if (titleText && titles[section]) {
    titleText.textContent = titles[section];
  }
}

// ==================== YOUTUBE VIDEO ====================
const MANUAL_VIDEO_ID = '';

async function loadLatestVideo() {
  const iframe = document.getElementById('latestVideoFrame');
  const channelId = 'UCj0Hm0C8Oun4-D3QRmpp7Bw';
  
  if (MANUAL_VIDEO_ID && MANUAL_VIDEO_ID.length > 5) {
    iframe.src = `https://www.youtube.com/embed/${MANUAL_VIDEO_ID}?rel=0`;
    return;
  }
  
  const invidiousInstances = [
    'https://inv.nadeko.net',
    'https://invidious.privacyredirect.com',
    'https://invidious.nerdvpn.de'
  ];
  
  for (const instance of invidiousInstances) {
    try {
      const response = await fetch(`${instance}/api/v1/channels/${channelId}/latest`);
      if (!response.ok) continue;
      const data = await response.json();
      if (data && data.videoId) {
        iframe.src = `https://www.youtube.com/embed/${data.videoId}?rel=0`;
        return;
      }
    } catch (error) {
      continue;
    }
  }
  
  try {
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
    const data = await response.json();
    if (data.status === 'ok' && data.items && data.items.length > 0) {
      const videoId = data.items[0].link.split('v=')[1].split('&')[0];
      iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0`;
      return;
    }
  } catch (error) {
    console.error('RSS2JSON falló:', error);
  }
  
  showManualInstructions(iframe);
}

function showManualInstructions(iframe) {
  iframe.parentElement.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background: linear-gradient(135deg, rgba(20, 20, 20, 0.95), rgba(40, 20, 40, 0.95)); border-radius: 15px; padding: 40px; text-align: center;">
      <div style="font-size: 60px; margin-bottom: 20px;">🎬</div>
      <h3 style="color: #ffffff; font-size: 22px; margin-bottom: 15px;">Configura tu video</h3>
      <p style="color: #cccccc; font-size: 14px; line-height: 1.8; max-width: 450px;">
        Edita <strong style="color: #9146FF;">script.js</strong> y agrega el ID de tu video en:<br>
        <code style="color: #9146FF;">const MANUAL_VIDEO_ID = 'TU_ID';</code>
      </p>
    </div>
  `;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadLatestVideo);
} else {
  loadLatestVideo();
}

// ==================== SISTEMA DE NOTICIAS ====================
const newsData = [
  { id: 1, category: 'actualizaciones', title: 'UPDATE', subtitle: 'Spreen Points Update: Julio - Agosto', description: 'Seguimos mejorando Spreen Store para que la experiencia sea más completa.', author: 'joaquitopa', date: '31/8/2025', views: 3 },
  { id: 2, category: 'actualizaciones', title: 'UPDATE', subtitle: 'Spreen Points Update: Mayo - Junio', description: 'Incorporamos nuevas opciones de canje y mejoras en la plataforma.', author: 'joaquitopa', date: '30/6/2025', views: 11 },
  { id: 3, category: 'actualizaciones', title: 'UPDATE', subtitle: 'Spreen Points Update: Marzo - Abril', description: 'Nueva actualización con mejoras en el sistema de puntos y nuevas recompensas.', author: 'joaquitopa', date: '30/4/2025', views: 8 },
  { id: 4, category: 'discusion', title: 'DISCUSIÓN', subtitle: '¿Qué les gustaría ver en la próxima actualización?', description: 'Queremos escuchar sus opiniones sobre las próximas funcionalidades.', author: 'admin_pgod', date: '15/8/2025', views: 24 },
  { id: 5, category: 'soporte', title: 'SOPORTE', subtitle: 'Problemas con el canje de puntos', description: 'Guía de solución de problemas comunes al canjear puntos.', author: 'soporte_pgod', date: '20/7/2025', views: 15 },
  { id: 6, category: 'comunidad', title: 'COMUNIDAD', subtitle: 'Presentación de nuevos moderadores', description: 'Bienvenida a nuestros nuevos moderadores de la comunidad.', author: 'admin_pgod', date: '10/8/2025', views: 32 },
  { id: 7, category: 'otros', title: 'ANUNCIO', subtitle: 'Mantenimiento programado del servidor', description: 'Mantenimiento programado el próximo sábado.', author: 'tech_pgod', date: '5/8/2025', views: 18 },
  { id: 8, category: 'bugs', title: 'BUG REPORTADO', subtitle: 'Error al cargar imágenes en perfil', description: 'Bug identificado en algunos navegadores. Trabajando en solución.', author: 'dev_pgod', date: '25/7/2025', views: 9 },
  { id: 9, category: 'comunidad', title: 'EVENTO', subtitle: 'Torneo de la comunidad - Inscripciones abiertas', description: '¡Inscríbete en nuestro próximo torneo comunitario!', author: 'eventos_pgod', date: '12/8/2025', views: 45 }
];

let currentPage = 1;
let currentFilter = 'all';
const itemsPerPage = 3;

function filterNews(category) {
  return category === 'all' ? newsData : newsData.filter(news => news.category === category);
}

function getTotalPages() {
  return Math.ceil(filterNews(currentFilter).length / itemsPerPage);
}

function loadNews() {
  const newsContainer = document.getElementById('newsContainer');
  const filteredNews = filterNews(currentFilter);
  const totalPages = getTotalPages();
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNews = filteredNews.slice(startIndex, startIndex + itemsPerPage);
  
  newsContainer.innerHTML = '';
  
  paginatedNews.forEach(news => {
    const newsCard = document.createElement('div');
    newsCard.className = 'news-card';
    newsCard.innerHTML = `
      <div class="news-header">
        <div class="news-title-section">
          <div class="news-title">${news.title}</div>
          <div class="news-category">${news.category}</div>
        </div>
      </div>
      <div class="news-subtitle">${news.subtitle}</div>
      <div class="news-description">${news.description}</div>
      <div class="news-footer">
        <div class="news-views"><span>👁</span><span>${news.views}</span></div>
        <div>Creado por <span class="news-author">${news.author}</span></div>
        <div class="news-date">${news.date}</div>
      </div>
    `;
    newsContainer.appendChild(newsCard);
  });
  
  document.getElementById('pageInfo').textContent = `Página ${currentPage} de ${totalPages}`;
  document.getElementById('prevPage').disabled = currentPage === 1;
  document.getElementById('nextPage').disabled = currentPage === totalPages;
}

const categoryFilter = document.getElementById('categoryFilter');
if (categoryFilter) {
  categoryFilter.addEventListener('change', (e) => {
    currentFilter = e.target.value;
    currentPage = 1;
    loadNews();
    
    const titleText = document.querySelector('.titulo-arqueado text textPath');
    const filterTitles = {
      'all': 'ACTUALIZACIONES', 'actualizaciones': 'ACTUALIZACIONES', 'discusion': 'DISCUSION',
      'soporte': 'SOPORTE', 'comunidad': 'COMUNIDAD', 'otros': 'OTROS', 'bugs': 'BUGS'
    };
    if (titleText && filterTitles[currentFilter]) titleText.textContent = filterTitles[currentFilter];
  });
}

document.getElementById('prevPage')?.addEventListener('click', () => {
  if (currentPage > 1) { currentPage--; loadNews(); }
});

document.getElementById('nextPage')?.addEventListener('click', () => {
  if (currentPage < getTotalPages()) { currentPage++; loadNews(); }
});

// ==================== RANKING ====================
const rankingData = [
  { username: 'SpreenDMC', points: 125450, level: 95 },
  { username: 'ElMariana', points: 118230, level: 92 },
  { username: 'Rubius', points: 112890, level: 90 },
  { username: 'AuronPlay', points: 105670, level: 87 },
  { username: 'Juansguarnizo', points: 98450, level: 85 },
  { username: 'Ibai', points: 94320, level: 83 },
  { username: 'Shadoune666', points: 87650, level: 80 },
  { username: 'ElRichMC', points: 82340, level: 78 },
  { username: 'Vegetta777', points: 78900, level: 76 },
  { username: 'WillyrexYT', points: 74560, level: 74 },
  { username: 'Alexby11', points: 69780, level: 72 },
  { username: 'Farfadox', points: 65420, level: 70 },
  { username: 'Carrera', points: 61230, level: 68 },
  { username: 'Folagor03', points: 57890, level: 66 },
  { username: 'MissaSinfonia', points: 54560, level: 64 }
];

function loadRanking() {
  const tableBody = document.getElementById('rankingTableBody');
  if (!tableBody) return;
  
  tableBody.innerHTML = '';
  
  rankingData.forEach((user, index) => {
    const rank = index + 1;
    let rankClass = '', rankDisplay = rank;
    if (rank === 1) { rankClass = 'rank-1'; rankDisplay = '🥇'; }
    else if (rank === 2) { rankClass = 'rank-2'; rankDisplay = '🥈'; }
    else if (rank === 3) { rankClass = 'rank-3'; rankDisplay = '🥉'; }
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="rank-cell ${rankClass}">${rankDisplay}</td>
      <td><div class="user-cell"><div class="user-avatar">${user.username.substring(0, 2).toUpperCase()}</div><span class="user-name">${user.username}</span></div></td>
      <td><span class="level-badge">Nivel ${user.level}</span></td>
      <td class="points-cell"><img src="./iconoPuntos.png" alt="Pavos" class="pavos-icon-tiny"> ${user.points.toLocaleString()}</td>
    `;
    tableBody.appendChild(row);
  });
}

const rankingSection = document.getElementById('section-ranking');
if (rankingSection) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.target.classList.contains('active')) loadRanking();
    });
  });
  observer.observe(rankingSection, { attributes: true, attributeFilter: ['class'] });
}

// ==================== GAMBLING - SLOT MACHINE HORIZONTAL ====================
var gamblingBalance = 12000;
var isSpinning = false;
var spinHistory = [];
var dailySpinsLeft = 2;

function actualizarBalance() {
  var el = document.getElementById('gamblingBalance');
  if (el) {
    if (isNaN(gamblingBalance)) {
      gamblingBalance = 12000;
    }
    el.innerHTML = gamblingBalance.toLocaleString();
  }
}

function setBetAmount(amount) {
  var el = document.getElementById('betAmount');
  if (el) el.value = amount;
}

function setBetAll() {
  var el = document.getElementById('betAmount');
  if (el) el.value = gamblingBalance;
}

function spinSlotMachine() {
  console.log('=== SPIN INICIADO ===');
  
  if (isSpinning) {
    return;
  }
  
  if (dailySpinsLeft <= 0) {
    alert('Ya usaste tus 2 intentos de hoy');
    return;
  }
  
  var betInput = document.getElementById('betAmount');
  var betAmount = parseInt(betInput.value);
  
  console.log('Apuesta:', betAmount, 'Balance:', gamblingBalance);
  
  if (isNaN(betAmount) || betAmount < 10) {
    alert('Apuesta mínima: 10 pavos');
    return;
  }
  
  if (betAmount > gamblingBalance) {
    alert('No tienes suficientes pavos');
    return;
  }
  
  isSpinning = true;
  dailySpinsLeft = dailySpinsLeft - 1;
  
  var btn = document.getElementById('spinButton');
  var resultado = document.getElementById('slotResult');
  var track = document.getElementById('slotTrack');
  
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '🎲 GIRANDO...';
  }
  
  if (resultado) {
    resultado.innerHTML = '🎲 Girando...';
  }
  
  gamblingBalance = gamblingBalance - betAmount;
  actualizarBalance();
  
  // Elegir resultado aleatorio
  var rand = Math.random() * 100;
  var multiplierValue, multiplierLabel, multiplierClass, multiplierColor;
  
  if (rand < 35) {
    multiplierValue = 0.2; multiplierLabel = 'x0.2'; multiplierClass = 'mult-020'; multiplierColor = '#ff4444';
  } else if (rand < 60) {
    multiplierValue = 0.7; multiplierLabel = 'x0.7'; multiplierClass = 'mult-070'; multiplierColor = '#ff8800';
  } else if (rand < 80) {
    multiplierValue = 1.1; multiplierLabel = 'x1.1'; multiplierClass = 'mult-110'; multiplierColor = '#ffcc00';
  } else if (rand < 92) {
    multiplierValue = 1.5; multiplierLabel = 'x1.5'; multiplierClass = 'mult-150'; multiplierColor = '#44ff44';
  } else if (rand < 98) {
    multiplierValue = 2.0; multiplierLabel = 'x2.0'; multiplierClass = 'mult-200'; multiplierColor = '#4444ff';
  } else {
    multiplierValue = 5.0; multiplierLabel = 'x5.0'; multiplierClass = 'mult-500'; multiplierColor = '#ff44ff';
  }
  
  console.log('Resultado:', multiplierLabel);
  
  // Arrays de slots
  var allClasses = ['mult-020', 'mult-070', 'mult-110', 'mult-150', 'mult-200', 'mult-500'];
  var allLabels = ['x0.2', 'x0.7', 'x1.1', 'x1.5', 'x2.0', 'x5.0'];
  var html = '';
  var winnerPosition = 45;
  
  for (var i = 0; i < 60; i++) {
    var cls, lbl;
    if (i === winnerPosition) {
      cls = multiplierClass;
      lbl = multiplierLabel;
    } else {
      var r = Math.floor(Math.random() * 6);
      cls = allClasses[r];
      lbl = allLabels[r];
    }
    html = html + '<div class="slot-item ' + cls + '">' + lbl + '</div>';
  }
  
  track.innerHTML = html;
  
  // Calcular distancia
  var distancia = (winnerPosition * 95) - 250;
  
  // Resetear y animar
  track.style.transition = 'none';
  track.style.transform = 'translateX(0px)';
  track.getBoundingClientRect();
  
  setTimeout(function() {
    track.style.transition = 'transform 4s ease-out';
    track.style.transform = 'translateX(-' + distancia + 'px)';
  }, 100);
  
  // Guardar valores para el callback
  var apuestaFinal = betAmount;
  var multiplicadorFinal = multiplierValue;
  var labelFinal = multiplierLabel;
  var colorFinal = multiplierColor;
  
  // Resultado
  setTimeout(function() {
    var ganancia = Math.floor(apuestaFinal * multiplicadorFinal);
    gamblingBalance = gamblingBalance + ganancia;
    actualizarBalance();
    
    var profit = ganancia - apuestaFinal;
    
    console.log('Apuesta:', apuestaFinal, 'Multiplicador:', multiplicadorFinal, 'Ganancia:', ganancia, 'Profit:', profit, 'Balance:', gamblingBalance);
    
    if (resultado) {
      if (profit >= 0) {
        resultado.innerHTML = '🎉 Ganaste ' + profit + ' pavos! ' + labelFinal;
        resultado.className = 'slot-result win';
      } else {
        resultado.innerHTML = '😢 Perdiste ' + Math.abs(profit) + ' pavos';
        resultado.className = 'slot-result lose';
      }
    }
    
    // Historial
    spinHistory.unshift({ bet: apuestaFinal, multiplier: labelFinal, profit: profit, color: colorFinal });
    if (spinHistory.length > 10) spinHistory.pop();
    renderSpinHistory();
    
    isSpinning = false;
    if (btn) {
      if (dailySpinsLeft > 0) {
        btn.disabled = false;
        btn.innerHTML = '🎰 GIRAR (' + dailySpinsLeft + '/2)';
      } else {
        btn.innerHTML = '❌ SIN INTENTOS';
        btn.disabled = true;
      }
    }
  }, 4500);
}

function renderSpinHistory() {
  var container = document.getElementById('spinHistory');
  if (!container) return;
  
  if (spinHistory.length === 0) {
    container.innerHTML = '<p style="color:#666;text-align:center;">No hay giros</p>';
    return;
  }
  
  var html = '';
  for (var i = 0; i < spinHistory.length; i++) {
    var item = spinHistory[i];
    var profitText = item.profit >= 0 ? '+' + item.profit : item.profit;
    var profitClass = item.profit >= 0 ? 'win' : 'lose';
    html = html + '<div class="history-item-new">';
    html = html + '<div class="history-bet">Apuesta: ' + item.bet + '</div>';
    html = html + '<div class="history-mult" style="color:' + item.color + '">' + item.multiplier + '</div>';
    html = html + '<div class="history-profit ' + profitClass + '">' + profitText + '</div>';
    html = html + '</div>';
  }
  container.innerHTML = html;
}

// ==================== MARKET ====================
const rewardsData = [
  { id: 1, name: 'Suscripción Twitch 1 Mes', points: 5000, stock: 15, image: 'https://cdn-icons-png.flaticon.com/512/5968/5968819.png' },
  { id: 2, name: 'Custom Emote', points: 8000, stock: 8, image: 'https://cdn-icons-png.flaticon.com/512/742/742751.png' },
  { id: 3, name: 'Shoutout en Stream', points: 2500, stock: 25, image: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png' },
  { id: 4, name: 'Rol VIP Discord', points: 10000, stock: 5, image: 'https://cdn-icons-png.flaticon.com/512/5968/5968756.png' },
  { id: 5, name: 'Partida Privada con PGOD', points: 15000, stock: 3, image: 'https://cdn-icons-png.flaticon.com/512/3612/3612569.png' },
  { id: 6, name: 'Gift Card $10', points: 12000, stock: 10, image: 'https://cdn-icons-png.flaticon.com/512/9305/9305666.png' },
  { id: 7, name: 'Avatar Personalizado', points: 6000, stock: 12, image: 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png' },
  { id: 8, name: 'Mensaje Destacado', points: 3000, stock: 50, image: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png' },
  { id: 9, name: 'Merchandise PGOD', points: 20000, stock: 2, image: 'https://cdn-icons-png.flaticon.com/512/892/892458.png' },
  { id: 10, name: 'Sesión de Coaching', points: 18000, stock: 4, image: 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png' },
  { id: 11, name: 'Color de Nombre Custom', points: 4000, stock: 20, image: 'https://cdn-icons-png.flaticon.com/512/2436/2436636.png' },
  { id: 12, name: 'Elección de Juego', points: 7500, stock: 6, image: 'https://cdn-icons-png.flaticon.com/512/686/686589.png' }
];

let currentUserPoints = 12450;
let carouselPosition = 0;
const cardsPerView = 4;

function loadRewards() {
  const rewardsTrack = document.getElementById('rewardsTrack');
  if (!rewardsTrack) return;
  
  rewardsTrack.innerHTML = '';
  
  rewardsData.forEach(reward => {
    const canRedeem = currentUserPoints >= reward.points && reward.stock > 0;
    const stockClass = reward.stock === 0 ? 'out' : reward.stock <= 5 ? 'low' : '';
    
    const rewardCard = document.createElement('div');
    rewardCard.className = 'reward-card';
    rewardCard.innerHTML = `
      <div class="reward-image">
        <img src="${reward.image}" alt="${reward.name}">
      </div>
      <div class="reward-info">
        <div class="reward-name">${reward.name}</div>
        <div class="reward-stock">
          <span>📦 Disponibles:</span>
          <span class="reward-stock-value ${stockClass}">${reward.stock > 0 ? reward.stock : 'Agotado'}</span>
        </div>
        <div class="reward-points">
          <img src="./iconoPuntos.png" alt="Pavos" class="pavos-icon-tiny">
          <span>${reward.points.toLocaleString()}</span>
        </div>
      </div>
      <button class="reward-button ${canRedeem ? '' : 'insufficient'}" onclick="redeemReward(${reward.id}, ${reward.points})" ${!canRedeem ? 'disabled' : ''}>
        ${reward.stock === 0 ? 'Agotado' : canRedeem ? 'Canjear' : 'Pavos Insuficientes'}
      </button>
    `;
    rewardsTrack.appendChild(rewardCard);
  });
  
  // Inicializar carrusel
  carouselPosition = 0;
  updateCarousel();
  createCarouselIndicators();
}

function updateCarousel() {
  const track = document.getElementById('rewardsTrack');
  if (!track) return;
  
  const cardWidth = 300; // 280px + 20px gap
  const maxPosition = Math.max(0, rewardsData.length - cardsPerView);
  
  carouselPosition = Math.max(0, Math.min(carouselPosition, maxPosition));
  
  track.style.transform = `translateX(-${carouselPosition * cardWidth}px)`;
  
  // Actualizar estado de botones
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  
  if (prevBtn) prevBtn.disabled = carouselPosition === 0;
  if (nextBtn) nextBtn.disabled = carouselPosition >= maxPosition;
  
  // Actualizar indicadores
  updateCarouselIndicators();
}

function createCarouselIndicators() {
  const container = document.getElementById('carouselIndicators');
  if (!container) return;
  
  const totalPages = Math.ceil(rewardsData.length / cardsPerView);
  container.innerHTML = '';
  
  for (let i = 0; i < totalPages; i++) {
    const indicator = document.createElement('div');
    indicator.className = 'carousel-indicator' + (i === 0 ? ' active' : '');
    indicator.addEventListener('click', () => {
      carouselPosition = i * cardsPerView;
      updateCarousel();
    });
    container.appendChild(indicator);
  }
}

function updateCarouselIndicators() {
  const indicators = document.querySelectorAll('.carousel-indicator');
  const currentPage = Math.floor(carouselPosition / cardsPerView);
  
  indicators.forEach((indicator, index) => {
    indicator.classList.toggle('active', index === currentPage);
  });
}

// Event listeners para el carrusel
document.getElementById('carouselPrev')?.addEventListener('click', () => {
  carouselPosition -= cardsPerView;
  updateCarousel();
});

document.getElementById('carouselNext')?.addEventListener('click', () => {
  carouselPosition += cardsPerView;
  updateCarousel();
});

function redeemReward(rewardId, pointsCost) {
  const reward = rewardsData.find(r => r.id === rewardId);
  if (!reward || reward.stock <= 0) return;
  
  if (currentUserPoints >= pointsCost) {
    if (confirm(`¿Confirmas el canje de "${reward.name}" por ${pointsCost.toLocaleString()} pavos?`)) {
      currentUserPoints -= pointsCost;
      reward.stock -= 1;
      document.getElementById('userPoints').textContent = currentUserPoints.toLocaleString();
      gamblingBalance = currentUserPoints;
      alert(`¡Felicidades! Has canjeado: ${reward.name}`);
      loadRewards();
    }
  }
}

const marketSection = document.getElementById('section-market');
if (marketSection) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.target.classList.contains('active')) loadRewards();
    });
  });
  observer.observe(marketSection, { attributes: true, attributeFilter: ['class'] });
}

// ==================== GALAXIA WEBGL ====================
const canvas = document.getElementById('galaxyCanvas');
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

if (gl) {
  function resizeGalaxyCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resizeGalaxyCanvas();
  window.addEventListener('resize', resizeGalaxyCanvas);
  
  const vertexShaderSource = `
    attribute vec2 position;
    varying vec2 vUv;
    void main() {
      vUv = position * 0.5 + 0.5;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;
  
  const fragmentShaderSource = `
    precision highp float;
    uniform float uTime;
    uniform vec2 uResolution;
    varying vec2 vUv;
    
    float hash21(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }
    
    float starPoint(vec2 uv, float size) {
      float d = length(uv);
      return smoothstep(size, size * 0.1, d);
    }
    
    vec3 starLayer(vec2 uv) {
      vec3 col = vec3(0.0);
      vec2 gv = fract(uv) - 0.5;
      vec2 id = floor(uv);
      float seed = hash21(id);
      
      if (seed > 0.92) {
        float size = 0.005 + seed * 0.005;
        float twinkle = sin(uTime * 1.5 + seed * 6.28) * 0.15 + 0.85;
        float brightness = 0.3 + seed * 0.4;
        float s = starPoint(gv, size);
        col += s * vec3(1.0) * brightness * twinkle;
      }
      return col;
    }
    
    void main() {
      vec2 uv = (vUv * uResolution - 0.5 * uResolution) / uResolution.y;
      vec3 col = vec3(0.0);
      col += starLayer(uv * 8.0);
      col += starLayer(uv * 12.0 + 234.56) * 0.7;
      col += starLayer(uv * 16.0 + 789.12) * 0.5;
      gl_FragColor = vec4(col, 1.0);
    }
  `;
  
  function compileShader(source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Error compilando shader:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }
  
  const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
  const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
  
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.useProgram(program);
  
  const vertices = new Float32Array([-1, -1, 3, -1, -1, 3]);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  
  const positionLocation = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  
  const uTimeLocation = gl.getUniformLocation(program, 'uTime');
  const uResolutionLocation = gl.getUniformLocation(program, 'uResolution');
  
  let startTime = Date.now();
  function render() {
    const currentTime = (Date.now() - startTime) * 0.001;
    gl.uniform1f(uTimeLocation, currentTime);
    gl.uniform2f(uResolutionLocation, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    requestAnimationFrame(render);
  }
  render();
}

// ==================== SISTEMA DE SOPORTE / TICKETS ====================
const MAX_TICKETS_PER_DAY = 2;
let userTickets = [];
let ticketsToday = 0;
let currentTicketId = null;

// Cargar tickets del localStorage
function loadTicketsFromStorage() {
  const stored = localStorage.getItem('pgod_tickets');
  const storedDate = localStorage.getItem('pgod_tickets_date');
  const today = new Date().toDateString();
  
  if (stored) {
    userTickets = JSON.parse(stored);
  }
  
  if (storedDate !== today) {
    ticketsToday = 0;
    localStorage.setItem('pgod_tickets_date', today);
    localStorage.setItem('pgod_tickets_today', '0');
  } else {
    ticketsToday = parseInt(localStorage.getItem('pgod_tickets_today') || '0');
  }
  
  updateTicketsUI();
}

function saveTicketsToStorage() {
  localStorage.setItem('pgod_tickets', JSON.stringify(userTickets));
  localStorage.setItem('pgod_tickets_today', ticketsToday.toString());
  localStorage.setItem('pgod_tickets_date', new Date().toDateString());
}

function updateTicketsUI() {
  const remaining = MAX_TICKETS_PER_DAY - ticketsToday;
  const ticketsRemainingEl = document.getElementById('ticketsRemaining');
  if (ticketsRemainingEl) {
    ticketsRemainingEl.textContent = `${remaining}/${MAX_TICKETS_PER_DAY}`;
  }
  
  const submitBtn = document.getElementById('submitTicketBtn');
  if (submitBtn) {
    if (remaining <= 0) {
      submitBtn.disabled = true;
      submitBtn.textContent = '⛔ Límite diario alcanzado';
    } else {
      submitBtn.disabled = false;
      submitBtn.textContent = '📤 Enviar Ticket';
    }
  }
  
  renderTicketsList();
}

function renderTicketsList() {
  const ticketsList = document.getElementById('ticketsList');
  if (!ticketsList) return;
  
  if (userTickets.length === 0) {
    ticketsList.innerHTML = `
      <div class="no-tickets">
        <span>📭</span>
        <p>No tienes tickets enviados</p>
      </div>
    `;
    return;
  }
  
  const sortedTickets = [...userTickets].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  ticketsList.innerHTML = sortedTickets.map(ticket => `
    <div class="ticket-card" onclick="openTicketModal('${ticket.id}')">
      <div class="ticket-card-header">
        <span class="ticket-id">#${ticket.id}</span>
        <span class="ticket-status status-${ticket.status}">${getStatusText(ticket.status)}</span>
      </div>
      <div class="ticket-subject">${escapeHtml(ticket.subject)}</div>
      <div class="ticket-preview">${escapeHtml(ticket.message.substring(0, 80))}${ticket.message.length > 80 ? '...' : ''}</div>
      <div class="ticket-date">📅 ${formatTicketDate(ticket.date)}</div>
    </div>
  `).join('');
}

function getStatusText(status) {
  const statusMap = { 'pendiente': 'Pendiente', 'revision': 'En Revisión', 'resuelto': 'Resuelto' };
  return statusMap[status] || status;
}

function formatTicketDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function generateTicketId() {
  return (userTickets.length + 1).toString().padStart(4, '0');
}

function getCategoryName(value) {
  const categories = {
    'problema-tecnico': '🔧 Problema Técnico', 'puntos': '💎 Puntos / Recompensas',
    'cuenta': '👤 Mi Cuenta', 'sugerencia': '💡 Sugerencia',
    'reporte': '🚨 Reportar Usuario', 'otro': '📋 Otro'
  };
  return categories[value] || value;
}

function submitTicket(e) {
  e.preventDefault();
  
  if (ticketsToday >= MAX_TICKETS_PER_DAY) {
    alert('⛔ Has alcanzado el límite de tickets por hoy. Intenta mañana.');
    return;
  }
  
  const category = document.getElementById('ticketCategory').value;
  const subject = document.getElementById('ticketSubject').value.trim();
  const message = document.getElementById('ticketMessage').value.trim();
  
  if (!category || !subject || !message) {
    alert('⚠️ Por favor completa todos los campos.');
    return;
  }
  
  const newTicket = {
    id: generateTicketId(),
    category: category,
    categoryName: getCategoryName(category),
    subject: subject,
    message: message,
    status: 'pendiente',
    date: new Date().toISOString(),
    response: null
  };
  
  userTickets.push(newTicket);
  ticketsToday++;
  
  saveTicketsToStorage();
  updateTicketsUI();
  
  document.getElementById('ticketForm').reset();
  document.getElementById('charCount').textContent = '0';
  
  alert('✅ ¡Ticket enviado correctamente! Te responderemos pronto.');
}

function openTicketModal(ticketId) {
  const ticket = userTickets.find(t => t.id === ticketId);
  if (!ticket) return;
  
  currentTicketId = ticketId;
  
  document.getElementById('modalTicketId').textContent = `#${ticket.id}`;
  document.getElementById('modalTicketSubject').textContent = ticket.subject;
  document.getElementById('modalTicketCategory').textContent = ticket.categoryName;
  document.getElementById('modalTicketMessage').textContent = ticket.message;
  document.getElementById('modalTicketDate').textContent = `Enviado: ${formatTicketDate(ticket.date)}`;
  
  const statusEl = document.getElementById('modalTicketStatus');
  statusEl.textContent = getStatusText(ticket.status);
  statusEl.className = `modal-ticket-status status-${ticket.status}`;
  
  const responseSection = document.getElementById('modalResponseSection');
  if (ticket.response) {
    responseSection.style.display = 'block';
    document.getElementById('modalTicketResponse').textContent = ticket.response;
  } else {
    responseSection.style.display = 'none';
  }
  
  document.getElementById('ticketModal').classList.add('active');
}

function closeTicketModal() {
  document.getElementById('ticketModal').classList.remove('active');
  currentTicketId = null;
}

function deleteTicket() {
  if (!currentTicketId) return;
  
  if (confirm('¿Estás seguro de que quieres eliminar este ticket?')) {
    userTickets = userTickets.filter(t => t.id !== currentTicketId);
    saveTicketsToStorage();
    updateTicketsUI();
    closeTicketModal();
    alert('🗑️ Ticket eliminado correctamente.');
  }
}

// Event listeners para soporte
document.addEventListener('DOMContentLoaded', () => {
  loadTicketsFromStorage();
  
  const ticketForm = document.getElementById('ticketForm');
  if (ticketForm) ticketForm.addEventListener('submit', submitTicket);
  
  const ticketMessage = document.getElementById('ticketMessage');
  if (ticketMessage) {
    ticketMessage.addEventListener('input', () => {
      document.getElementById('charCount').textContent = ticketMessage.value.length;
    });
  }
  
  const closeModalBtn = document.getElementById('closeModal');
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeTicketModal);
  
  const deleteBtn = document.getElementById('deleteTicketBtn');
  if (deleteBtn) deleteBtn.addEventListener('click', deleteTicket);
  
  const ticketModal = document.getElementById('ticketModal');
  if (ticketModal) {
    ticketModal.addEventListener('click', (e) => {
      if (e.target === ticketModal) closeTicketModal();
    });
  }
});

const soporteSection = document.getElementById('section-soporte');
if (soporteSection) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.target.classList.contains('active')) loadTicketsFromStorage();
    });
  });
  observer.observe(soporteSection, { attributes: true, attributeFilter: ['class'] });
}