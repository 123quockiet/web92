/**
 * script.js – Lớp 9/2 Tribute Website
 * Các tính năng:
 *  1. Particle system (hạt bụi sáng)
 *  2. Navbar scroll effect
 *  3. Custom cursor
 *  4. Render members grid
 *  5. Modal lời chúc ngẫu nhiên
 *  6. Scroll reveal (Intersection Observer)
 *  7. Counter animation (hero stats)
 *  8. Music toggle
 *  9. Sổ lưu bút (localStorage)
 * 10. Hamburger menu mobile
 */

/* ============================================================
   1. DỮ LIỆU
   ============================================================ */

/** Danh sách thành viên lớp 9/2 */
const MEMBERS = [
  "Minh Thư",    "Lan Phương",  "Bích Nhi",    "Quốc Kiệt",
  "Bảo Thy",     "Hồng Thấm",   "Duy Khang",   "Hồng Yên",
  "Huyền Trân",  "Khánh Ngọc",  "Khánh Đăng",  "Anh Kiệt",
  "Kim Ngân",    "Khôi Nguyên", "Gia Bảo",     "Mẫn Mẫn",
  "Minh Khôi",   "Ngọc Châm",   "Ngọc Trâm",   "Quế Anh",
  "Quốc Bảo",    "Thành Đạt",   "Cẩm Vy",      "Lam Trường",
  "Hải Nguyên",  "Nhân Nghĩa",  "Huỳnh Anh",   "Tấn Phụng",
  "Phương Lam",  "Phương Thảo", "Thị Tím",     "Thanh Trúc",
  "Trường Duy",  "Trường Khang","Minh Mẫn",    "Quốc Thái",
  "Thảo Nguyên", "Mỹ Xuyên",
];

/** Pool lời chúc chung */
const WISHES = [
  "Chúc bạn đỗ nguyện vọng 1 với số điểm thật cao!",
  "Chúc bạn luôn giữ vững đam mê và theo đuổi ước mơ đến cùng.",
  "Chúc bạn sức khoẻ dồi dào, học hành suôn sẻ và hạnh phúc mãi mãi.",
  "Dù xa hay gần, tình bạn 9/2 mãi khắc sâu trong tim mình. Chúc bạn thật nhiều may mắn!",
  "Chúc bạn tìm được con đường sáng nhất cho tương lai của mình.",
  "Hành trình THPT mới sắp bắt đầu – chúc bạn bứt phá và toả sáng!",
  "Chúc bạn luôn nở nụ cười tươi như ngày còn ngồi cùng nhau ở lớp 9/2.",
  "Mong bạn luôn dũng cảm đứng dậy sau mỗi vấp ngã. Chúc bạn thành công!",
  "Chúc bạn học giỏi, chơi vui, và luôn có những người bạn tốt bên cạnh.",
  "Ký ức lớp 9/2 sẽ mãi là kho báu quý giá nhất. Chúc bạn hạnh phúc!",
  "Chúc bạn đạt được tất cả những gì bạn đang nỗ lực hướng tới.",
  "Tương lai rực rỡ đang chờ bạn phía trước. Hãy cứ tiến bước nhé!",
  "Chúc bạn một mùa hè thật vui vẻ và một năm học mới thật thành công!",
  "Mình sẽ nhớ mãi những kỷ niệm bên bạn. Chúc bạn vạn sự như ý!",
  "Chúc bạn luôn là phiên bản tốt nhất của chính mình.",
  "Cho dù bạn chọn con đường nào, hãy đi hết mình. Cả lớp 9/2 luôn cổ vũ bạn!",
];

/** Số màu gradient avatar có sẵn trong CSS */
const AVATAR_COLOR_COUNT = 8;

/* ============================================================
   2. UTILITIES
   ============================================================ */

/**
 * Lấy 2 chữ cái viết tắt từ tên (lấy chữ đầu 2 từ cuối)
 * Ví dụ: "Minh Thư" → "MT", "Ngọc Trâm" → "NT"
 */
function getInitials(fullName) {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  const last   = parts[parts.length - 1];
  const second = parts[parts.length - 2];
  return (second[0] + last[0]).toUpperCase();
}

/**
 * Lấy một phần tử ngẫu nhiên từ mảng
 */
function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Lấy timestamp dạng giờ:phút ngày/tháng
 */
function nowLabel() {
  const d = new Date();
  return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')} – ${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
}

/** Hiện toast */
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

/* ============================================================
   3. PARTICLE SYSTEM
   ============================================================ */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');

  let W, H, particles = [];
  const COUNT = 90;   // Số hạt
  const SPEED = 0.35; // Tốc độ di chuyển

  /** Cấu trúc một hạt bụi */
  function createParticle() {
    return {
      x:     Math.random() * W,
      y:     Math.random() * H,
      r:     Math.random() * 1.8 + 0.4,          // bán kính
      vx:    (Math.random() - 0.5) * SPEED,
      vy:    -(Math.random() * SPEED + 0.1),       // bay nhẹ lên trên
      alpha: Math.random() * 0.6 + 0.1,
      // Màu sắc: gold, teal, purple, coral
      color: randomItem(['255,215,0', '67,230,181', '167,139,250', '255,107,107']),
    };
  }

  /** Khởi tạo canvas và hạt */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    particles = Array.from({ length: COUNT }, createParticle);
  }

  /** Vẽ mỗi frame */
  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      // Di chuyển
      p.x += p.vx;
      p.y += p.vy;

      // Nhấp nháy nhẹ
      p.alpha += (Math.random() - 0.5) * 0.02;
      p.alpha  = Math.max(0.05, Math.min(0.75, p.alpha));

      // Reset nếu ra khỏi màn hình
      if (p.y < -5)        { p.y = H + 5; p.x = Math.random() * W; }
      if (p.x < -5)        p.x = W + 5;
      if (p.x > W + 5)     p.x = -5;

      // Vẽ hình tròn mờ
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();

      // Vẽ ánh sáng (glow) bằng cách vẽ vòng lớn hơn và mờ hơn
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha * 0.15})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();

/* ============================================================
   4. CUSTOM CURSOR (desktop)
   ============================================================ */
document.addEventListener('mousemove', e => {
  document.documentElement.style.setProperty('--cx', e.clientX + 'px');
  document.documentElement.style.setProperty('--cy', e.clientY + 'px');
});

/* ============================================================
   5. NAVBAR SCROLL EFFECT
   ============================================================ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Thêm class scrolled khi cuộn xuống
    navbar.classList.toggle('scrolled', window.scrollY > 50);

    // Highlight active nav link theo section
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(lnk => {
      lnk.classList.toggle('active', lnk.getAttribute('href') === '#' + current);
    });
  }, { passive: true });
})();

/* ============================================================
   6. HAMBURGER MENU
   ============================================================ */
(function initHamburger() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
  });

  // Đóng khi nhấn link
  document.querySelectorAll('.mob-link').forEach(lnk => {
    lnk.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.classList.remove('open');
    });
  });
})();

/* ============================================================
   7. COUNTER ANIMATION (hero stats)
   ============================================================ */
function animateCounter(el, target, duration = 1600) {
  let start = null;
  const step = ts => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    // easeOutExpo
    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ============================================================
   8. SCROLL REVEAL (Intersection Observer)
   ============================================================ */
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        el.classList.add('visible');

        // Nếu là stat number, chạy counter
        if (el.classList.contains('hero-stats')) {
          el.querySelectorAll('.stat-num').forEach(num => {
            animateCounter(num, parseInt(num.dataset.target, 10));
          });
        }

        observer.unobserve(el);
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));
}

/* ============================================================
   9. MEMBERS GRID
   ============================================================ */
function renderMembers() {
  const grid = document.getElementById('membersGrid');
  if (!grid) return;

  // Observer riêng cho từng member card (stagger)
  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        // Delay nhỏ dần theo thứ tự để tạo hiệu ứng sóng
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, (entry.target.dataset.idx % 8) * 60);
        cardObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.1 }
  );

  MEMBERS.forEach((name, idx) => {
    const initials   = getInitials(name);
    const colorClass = `av-${idx % AVATAR_COLOR_COUNT}`;

    const card = document.createElement('div');
    card.className   = 'member-card';
    card.dataset.idx = idx;
    card.dataset.name = name;
    card.innerHTML = `
      <div class="member-avatar ${colorClass}">
        <span>${initials}</span>
      </div>
      <p class="member-name">${name}</p>
    `;

    // Mở modal khi click
    card.addEventListener('click', () => openModal(name, initials, colorClass));

    grid.appendChild(card);
    cardObserver.observe(card);
  });
}

/* ============================================================
   10. MODAL LỜI CHÚC
   ============================================================ */
let currentMember = null; // Lưu tên member đang xem để reroll

function openModal(name, initials, colorClass) {
  currentMember = { name, initials, colorClass };

  const overlay = document.getElementById('modalOverlay');
  const avatar  = document.getElementById('modalAvatar');
  const mName   = document.getElementById('modalName');
  const mWish   = document.getElementById('modalWish');
  const mSig    = document.getElementById('modalSig');

  // Set avatar
  avatar.className = `modal-avatar ${colorClass}`;
  avatar.textContent = initials;

  // Set tên
  mName.textContent = name;

  // Set lời chúc + chữ ký
  setRandomWish(name, mWish, mSig);

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

/** Chọn lời chúc ngẫu nhiên và gắn chữ ký */
function setRandomWish(name, wishEl, sigEl) {
  const wish   = randomItem(WISHES);
  wishEl.textContent = wish;
  sigEl.textContent  = `— Lớp 9/2 gửi đến ${name} ✨`;
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
  currentMember = null;
}

function initModal() {
  const overlay  = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('modalClose');
  const rerollBtn = document.getElementById('rerollBtn');

  // Đóng khi click overlay bên ngoài card
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });

  closeBtn.addEventListener('click', closeModal);

  // Đóng bằng phím Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  // Reroll lời chúc khác
  rerollBtn.addEventListener('click', () => {
    if (!currentMember) return;
    const wishEl = document.getElementById('modalWish');
    const sigEl  = document.getElementById('modalSig');

    // Hiệu ứng flash nhỏ
    wishEl.style.opacity = '0';
    setTimeout(() => {
      setRandomWish(currentMember.name, wishEl, sigEl);
      wishEl.style.transition = 'opacity 0.3s';
      wishEl.style.opacity    = '1';
    }, 200);
  });
}

/* ============================================================
   11. MUSIC TOGGLE
   ============================================================ */
function initMusic() {
  const btn   = document.getElementById('musicBtn');
  const icon  = document.getElementById('musicIcon');
  const audio = document.getElementById('bgMusic');
  let playing = false;

  btn.addEventListener('click', () => {
    if (playing) {
      audio.pause();
      icon.textContent = '🎵';
      icon.classList.remove('playing');
      playing = false;
    } else {
      audio.play().then(() => {
        icon.textContent = '🎶';
        icon.classList.add('playing');
        playing = true;
      }).catch(() => {
        showToast('⚠️ Không tìm thấy file nhạc. Thêm file music.mp3 vào thư mục!');
      });
    }
  });
}

/* ============================================================
   12. SỔ LƯU BÚT (LocalStorage)
   ============================================================ */
const STORAGE_KEY = 'lop92_guestbook';

function loadGuestbook() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveGuestbook(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function renderGuestbook() {
  const container = document.getElementById('gbEntries');
  const entries   = loadGuestbook();

  container.innerHTML = '';

  if (entries.length === 0) {
    container.innerHTML = `
      <p style="text-align:center;color:var(--text-muted);grid-column:1/-1;padding:2rem 0;">
        Chưa có lời nhắn nào. Hãy là người đầu tiên! ✨
      </p>`;
    return;
  }

  // Hiển thị từ mới nhất
  [...entries].reverse().forEach(entry => {
    const el = document.createElement('div');
    el.className = 'gb-entry reveal-up';
    el.innerHTML = `
      <p class="gb-entry-name">✏️ ${entry.name}</p>
      <p class="gb-entry-msg">${escapeHTML(entry.message)}</p>
      <p class="gb-entry-time">${entry.time}</p>
    `;
    container.appendChild(el);
  });

  // Reveal mới thêm
  initScrollReveal();
}

/** Chống XSS: encode HTML entities */
function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function initGuestbook() {
  const nameInput = document.getElementById('gbName');
  const msgInput  = document.getElementById('gbMessage');
  const submitBtn = document.getElementById('gbSubmit');
  const charCount = document.getElementById('charCount');

  // Đếm ký tự textarea
  msgInput.addEventListener('input', () => {
    charCount.textContent = msgInput.value.length;
  });

  submitBtn.addEventListener('click', () => {
    const name    = nameInput.value.trim();
    const message = msgInput.value.trim();

    if (!name) {
      showToast('⚠️ Vui lòng nhập tên của bạn!');
      nameInput.focus();
      return;
    }
    if (!message) {
      showToast('⚠️ Vui lòng nhập lời nhắn!');
      msgInput.focus();
      return;
    }

    const entries = loadGuestbook();
    entries.push({ name, message, time: nowLabel() });
    saveGuestbook(entries);

    // Reset form
    nameInput.value  = '';
    msgInput.value   = '';
    charCount.textContent = '0';

    renderGuestbook();
    showToast('💌 Lời nhắn của bạn đã được gửi!');

    // Cuộn xuống để xem lời nhắn mới
    document.getElementById('gbEntries').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Render lần đầu
  renderGuestbook();
}

/* ============================================================
   13. TEACHER SPOTLIGHT CLICK
   ============================================================ */
function initTeacher() {
  const ring = document.querySelector('.teacher-ring');
  if (!ring) return;
  ring.addEventListener('click', () => {
    openModal('Huỳnh Văn Đông', 'HVĐ', 'av-3');
    // Override lời chúc cho thầy
    setTimeout(() => {
      const wishEl = document.getElementById('modalWish');
      const sigEl  = document.getElementById('modalSig');
      wishEl.textContent = 'Kính chúc thầy Huỳnh Văn Đông luôn dồi dào sức khoẻ, hạnh phúc và tiếp tục truyền lửa đam mê cho bao thế hệ học sinh!';
      sigEl.textContent  = '— Lớp 9/2 kính gửi thầy chủ nhiệm ❤️';
    }, 50);
  });
}

/* ============================================================
   14. SMOOTH ACTIVE NAV ON CLICK
   ============================================================ */
function initNavClick() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ============================================================
   KHỞI TẠO TẤT CẢ KHI DOM SẴN SÀNG
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  renderMembers();      // Render grid thành viên
  initScrollReveal();   // Khởi động scroll reveal
  initModal();          // Modal lời chúc
  initMusic();          // Nút nhạc nền
  initGuestbook();      // Sổ lưu bút
  initTeacher();        // Click ảnh thầy
  initNavClick();       // Nav smooth scroll
});
