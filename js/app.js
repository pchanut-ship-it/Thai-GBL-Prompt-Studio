// js/app.js - Main Application Logic for Thai GBL Prompt Studio

document.addEventListener("DOMContentLoaded", () => {
  // Application State
  const state = {
    selectedCategory: "all",
    searchQuery: "",
    soundEnabled: true,
    activeModalGame: null,
    audioCtx: null
  };

  // DOM Elements
  const gameGrid = document.getElementById("gameGrid");
  const categoryFilters = document.getElementById("categoryFilters");
  const searchInput = document.getElementById("searchInput");
  const searchCountBadge = document.getElementById("searchCountBadge");
  const quickStartBanner = document.getElementById("quickStartBanner");
  const toastContainer = document.getElementById("toastContainer");
  const soundToggleBtn = document.getElementById("soundToggleBtn");
  
  // Modal Elements
  const detailModal = document.getElementById("detailModal");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const modalContent = document.getElementById("modalContent");
  const imageModal = document.getElementById("imageModal");
  const imageModalCloseBtn = document.getElementById("imageModalCloseBtn");
  const enlargedImage = document.getElementById("enlargedImage");
  const imageModalCaption = document.getElementById("imageModalCaption");

  // Generator Elements
  const generatorBaseGame = document.getElementById("generatorBaseGame");
  const generatorTitle = document.getElementById("generatorTitle");
  const generatorGrade = document.getElementById("generatorGrade");
  const generatorUnit = document.getElementById("generatorUnit");
  const generatorTech = document.getElementById("generatorTech");
  const generatorDifficulty = document.getElementById("generatorDifficulty");
  const generatorQuestions = document.getElementById("generatorQuestions");
  const generateBtn = document.getElementById("generateBtn");
  const generatedPromptArea = document.getElementById("generatedPromptArea");
  const copyGeneratedBtn = document.getElementById("copyGeneratedBtn");
  const downloadPromptBtn = document.getElementById("downloadPromptBtn");
  const exportAllBtn = document.getElementById("exportAllBtn");

  // Initialize Web Audio API for feedback sound
  function playSound(type = "success") {
    if (!state.soundEnabled) return;
    try {
      if (!state.audioCtx) {
        state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (state.audioCtx.state === "suspended") {
        state.audioCtx.resume();
      }
      const osc = state.audioCtx.createOscillator();
      const gain = state.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(state.audioCtx.destination);

      const now = state.audioCtx.currentTime;
      if (type === "copy") {
        // High crisp double chime
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === "click") {
        // Subtle soft blip
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(520, now + 0.05);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      }
    } catch (e) {
      // Audio not supported or blocked, ignore gracefully
    }
  }

  // Toast Notification
  function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border backdrop-blur-md transform transition-all duration-300 translate-y-3 opacity-0 text-sm font-medium z-50 ${
      type === "success" 
        ? "bg-slate-900/90 text-white border-emerald-500/40 shadow-emerald-500/10" 
        : "bg-slate-900/90 text-white border-amber-500/40 shadow-amber-500/10"
    }`;
    toast.innerHTML = `
      <div class="w-7 h-7 rounded-full ${type === "success" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"} flex items-center justify-center shrink-0">
        <i data-lucide="${type === "success" ? "check" : "info"}" class="w-4 h-4"></i>
      </div>
      <div class="pr-2">${message}</div>
    `;

    toastContainer.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    // Animate in
    setTimeout(() => {
      toast.classList.remove("translate-y-3", "opacity-0");
      toast.classList.add("translate-y-0", "opacity-100");
    }, 10);

    // Auto remove after 2.8s
    setTimeout(() => {
      toast.classList.remove("translate-y-0", "opacity-100");
      toast.classList.add("-translate-y-2", "opacity-0");
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  // Clipboard Copy Helper
  window.copyTextToClipboard = async function(text, sourceBtn = null) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      playSound("copy");
      showToast("✨ คัดลอก Prompt ลงคลิปบอร์ดแล้ว! พร้อมนำไปวางใน AI ได้ทันที", "success");

      if (sourceBtn) {
        const originalHtml = sourceBtn.innerHTML;
        sourceBtn.innerHTML = `
          <i data-lucide="check" class="w-4 h-4 text-emerald-400"></i>
          <span class="text-emerald-400 font-bold">คัดลอกสำเร็จ!</span>
        `;
        sourceBtn.classList.add("bg-emerald-600/30", "border-emerald-500");
        if (window.lucide) lucide.createIcons();

        setTimeout(() => {
          sourceBtn.innerHTML = originalHtml;
          sourceBtn.classList.remove("bg-emerald-600/30", "border-emerald-500");
          if (window.lucide) lucide.createIcons();
        }, 2000);
      }
    } catch (err) {
      console.error("Copy failed:", err);
      showToast("ไม่สามารถคัดลอกได้โดยอัตโนมัติ กรุณาลองเลือกข้อความและกด Ctrl+C", "error");
    }
  };

  // Render Category Filter Buttons
  function renderCategories() {
    categoryFilters.innerHTML = "";
    gameCategories.forEach(cat => {
      const btn = document.createElement("button");
      const isActive = state.selectedCategory === cat.id;
      btn.className = `category-tab px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 border ${
        isActive 
          ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/25 active-tab" 
          : "bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-slate-750 hover:text-white hover:border-slate-600"
      }`;
      btn.dataset.category = cat.id;
      btn.innerHTML = `
        <i data-lucide="${cat.icon}" class="w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-400'}"></i>
        <span>${cat.label}</span>
      `;
      btn.addEventListener("click", () => {
        playSound("click");
        state.selectedCategory = cat.id;
        renderCategories();
        filterAndRenderGames();
      });
      categoryFilters.appendChild(btn);
    });
    if (window.lucide) lucide.createIcons();
  }

  // Populate Generator Base Game Select Dropdown
  function populateGeneratorSelect() {
    generatorBaseGame.innerHTML = "";
    gamesData.forEach(game => {
      const opt = document.createElement("option");
      opt.value = game.id;
      opt.textContent = `${game.id}. ${game.title} (${game.categoryLabel})`;
      generatorBaseGame.appendChild(opt);
    });

    generatorBaseGame.addEventListener("change", (e) => {
      const g = gamesData.find(item => item.id === Number(e.target.value));
      if (g) {
        generatorTitle.placeholder = g.title;
        generatorTitle.value = g.title;
        generatorGrade.value = g.grade;
        generatorUnit.value = g.defaultUnit;
        updateGeneratedPrompt();
      }
    });
  }

  // Open Full Image Modal
  window.openImageZoom = function(imgSrc, title) {
    playSound("click");
    enlargedImage.src = imgSrc;
    imageModalCaption.textContent = title;
    imageModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  };

  // Close Image Modal
  function closeImageModal() {
    imageModal.classList.add("hidden");
    document.body.style.overflow = "";
  }
  imageModalCloseBtn.addEventListener("click", closeImageModal);
  imageModal.addEventListener("click", (e) => {
    if (e.target === imageModal) closeImageModal();
  });

  // Open Game Detail Modal
  window.openGameDetail = function(gameId) {
    playSound("click");
    const game = gamesData.find(g => g.id === Number(gameId));
    if (!game) return;

    state.activeModalGame = game;
    modalContent.innerHTML = `
      <div class="relative">
        <div class="relative h-64 md:h-80 w-full overflow-hidden rounded-2xl bg-slate-950 mb-6 border border-slate-700/50 group cursor-pointer" onclick="openImageZoom('${game.image}', '${game.title}')">
          <img src="${game.image}" alt="${game.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onerror="this.onerror=null; this.src='assets/images/hero_banner.jpg';">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
          <div class="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div>
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/80 text-white backdrop-blur-md mb-2">
                ${game.categoryLabel}
              </span>
              <h2 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight">${game.title}</h2>
              <p class="text-sm text-slate-300 font-medium">${game.englishTitle}</p>
            </div>
            <button class="px-3.5 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md text-xs font-medium text-slate-200 border border-slate-700 hover:text-white flex items-center gap-1.5">
              <i data-lucide="maximize-2" class="w-3.5 h-3.5"></i>
              ดูภาพขนาดใหญ่
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span class="text-xs font-medium text-slate-400 block mb-1">กลุ่มเป้าหมาย / ระดับชั้น</span>
            <span class="text-sm font-semibold text-amber-300 flex items-center gap-1.5">
              <i data-lucide="graduation-cap" class="w-4 h-4"></i>
              ${game.grade}
            </span>
          </div>
          <div class="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span class="text-xs font-medium text-slate-400 block mb-1">ทักษะภาษาไทยที่เน้น</span>
            <span class="text-sm font-semibold text-emerald-300 flex items-center gap-1.5">
              <i data-lucide="sparkles" class="w-4 h-4"></i>
              ${game.skills}
            </span>
          </div>
          <div class="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span class="text-xs font-medium text-slate-400 block mb-1">รูปแบบการเล่น (Play Style)</span>
            <span class="text-sm font-semibold text-sky-300 flex items-center gap-1.5">
              <i data-lucide="gamepad-2" class="w-4 h-4"></i>
              ${game.playStyle.split(",")[0]}
            </span>
          </div>
        </div>

        <div class="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 mb-6">
          <h4 class="text-sm font-bold text-indigo-300 uppercase tracking-wider mb-2 flex items-center gap-2">
            <i data-lucide="book-open" class="w-4 h-4 text-indigo-400"></i>
            บทสรุปรูปแบบเกมและการเรียนรู้ (Game Brief)
          </h4>
          <p class="text-slate-200 text-sm md:text-base leading-relaxed">${game.brief}</p>
          <div class="mt-3 pt-3 border-t border-indigo-500/20 text-xs text-indigo-200/80 flex items-center gap-2">
            <i data-lucide="cpu" class="w-3.5 h-3.5 text-indigo-400"></i>
            <span><strong>สิ่งที่ AI สร้างได้:</strong> ${game.aiDeliverables}</span>
          </div>
        </div>

        <!-- Prompt Section in Modal -->
        <div class="mb-4">
          <div class="flex items-center justify-between mb-2">
            <h4 class="text-sm font-bold text-slate-300 flex items-center gap-2">
              <i data-lucide="terminal" class="w-4 h-4 text-emerald-400"></i>
              คำสั่ง Prompt ฉบับสมบูรณ์พร้อมสั่ง AI (Master Prompt)
            </h4>
            <div class="flex gap-2">
              <button onclick="customizeThisGame(${game.id})" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors">
                <i data-lucide="sliders" class="w-3.5 h-3.5 text-indigo-400"></i>
                ปรับแต่งใน Generator
              </button>
              <button onclick="copyModalPrompt(this)" class="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition-colors">
                <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                Copy Prompt
              </button>
            </div>
          </div>
          <div class="relative rounded-2xl bg-slate-950 p-4 border border-slate-800 font-mono text-xs md:text-sm text-slate-300 max-h-72 overflow-y-auto leading-relaxed select-all">
            <pre class="whitespace-pre-wrap font-mono">${game.prompt}</pre>
          </div>
        </div>
      </div>
    `;

    detailModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    if (window.lucide) lucide.createIcons();
  };

  window.copyModalPrompt = function(btn) {
    if (state.activeModalGame) {
      copyTextToClipboard(state.activeModalGame.prompt, btn);
    }
  };

  window.customizeThisGame = function(gameId) {
    closeDetailModal();
    const game = gamesData.find(g => g.id === Number(gameId));
    if (!game) return;

    generatorBaseGame.value = game.id;
    generatorTitle.value = game.title;
    generatorGrade.value = game.grade;
    generatorUnit.value = game.defaultUnit;

    // Scroll smoothly to Generator section
    const genSection = document.getElementById("generatorSection");
    if (genSection) {
      genSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    updateGeneratedPrompt();
    showToast(`โหลดการตั้งค่า "${game.title}" เข้าสู่ตัวสร้าง Prompt แล้ว!`, "info");
  };

  function closeDetailModal() {
    detailModal.classList.add("hidden");
    document.body.style.overflow = "";
    state.activeModalGame = null;
  }
  modalCloseBtn.addEventListener("click", closeDetailModal);
  detailModal.addEventListener("click", (e) => {
    if (e.target === detailModal) closeDetailModal();
  });

  // Filter and Render Game Cards
  function filterAndRenderGames() {
    let filtered = gamesData;

    // Filter by Category Tab
    if (state.selectedCategory === "quickstart") {
      filtered = filtered.filter(g => g.isRecommendedQuickStart);
    } else if (state.selectedCategory !== "all") {
      filtered = filtered.filter(g => g.category === state.selectedCategory);
    }

    // Filter by Search Query
    if (state.searchQuery.trim()) {
      const q = state.searchQuery.trim().toLowerCase();
      filtered = filtered.filter(g => 
        g.title.toLowerCase().includes(q) ||
        g.englishTitle.toLowerCase().includes(q) ||
        g.skills.toLowerCase().includes(q) ||
        g.grade.toLowerCase().includes(q) ||
        g.brief.toLowerCase().includes(q) ||
        g.categoryLabel.toLowerCase().includes(q)
      );
    }

    // Update Counter
    searchCountBadge.textContent = `แสดง ${filtered.length} จาก 20 เกม`;

    if (filtered.length === 0) {
      gameGrid.innerHTML = `
        <div class="col-span-full py-16 text-center">
          <div class="w-16 h-16 rounded-3xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-4 border border-slate-700">
            <i data-lucide="search-x" class="w-8 h-8"></i>
          </div>
          <h3 class="text-xl font-bold text-slate-200 mb-2">ไม่พบเกมที่ตรงกับคำค้นหา</h3>
          <p class="text-slate-400 text-sm max-w-md mx-auto mb-6">ลองเปลี่ยนคำค้นหา เช่น "มาตราตัวสะกด", "ราชาศัพท์", "คำผิด", หรือคลิกเลือกหมวดหมู่อื่นด้านบน</p>
          <button onclick="resetSearch()" class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors">
            ล้างการค้นหา
          </button>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    gameGrid.innerHTML = "";
    filtered.forEach(game => {
      const card = document.createElement("div");
      card.className = "game-card group flex flex-col bg-slate-850/80 rounded-2xl border border-slate-750/70 overflow-hidden hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300";
      
      // Check if quick start
      const quickBadge = game.isRecommendedQuickStart 
        ? `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/90 text-slate-950 shadow-md">⭐ เริ่มต้นง่าย</span>`
        : "";

      card.innerHTML = `
        <!-- Image Preview Header -->
        <div class="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-950 cursor-pointer" onclick="openGameDetail(${game.id})">
          <img src="${game.image}" alt="${game.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" onerror="this.onerror=null; this.src='assets/images/hero_banner.jpg';">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30"></div>
          
          <div class="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-900/80 backdrop-blur-md text-indigo-300 border border-slate-700/60">
              #${game.id} ${game.categoryLabel}
            </span>
            ${quickBadge}
          </div>

          <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
            <span class="px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md border border-slate-700/50 flex items-center gap-1">
              <i data-lucide="graduation-cap" class="w-3 h-3 text-amber-400"></i>
              ${game.grade}
            </span>
            <button onclick="event.stopPropagation(); openImageZoom('${game.image}', '${game.title}')" class="p-1.5 rounded-lg bg-slate-900/80 text-slate-300 hover:text-white backdrop-blur-md border border-slate-700" title="ขยายรูป">
              <i data-lucide="zoom-in" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>

        <!-- Content Area -->
        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div class="mb-2">
              <h3 class="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors cursor-pointer" onclick="openGameDetail(${game.id})">
                ${game.title}
              </h3>
              <p class="text-xs text-slate-400 font-mono">${game.englishTitle}</p>
            </div>

            <!-- Thai Brief -->
            <div class="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 mb-3 text-xs text-slate-300 leading-relaxed line-clamp-3">
              ${game.brief}
            </div>

            <!-- Skills & Mechanics Tags -->
            <div class="space-y-1.5 mb-4 text-xs">
              <div class="flex items-start gap-1.5 text-slate-300">
                <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5"></i>
                <span><strong>ทักษะ:</strong> ${game.skills}</span>
              </div>
              <div class="flex items-start gap-1.5 text-slate-400">
                <i data-lucide="gamepad" class="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5"></i>
                <span class="line-clamp-1"><strong>รูปแบบ:</strong> ${game.playStyle}</span>
              </div>
            </div>
          </div>

          <!-- Actions & Copy Button -->
          <div class="pt-3 border-t border-slate-800 space-y-2">
            <!-- Main Copy Prompt Button (Crucial Requirement) -->
            <button 
              onclick="copyGamePrompt(${game.id}, this)"
              class="copy-prompt-btn w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all border border-indigo-400/30"
              title="คัดลอกคำสั่ง Prompt ไปใช้สั่ง AI พัฒนาเว็บเกมนี้"
            >
              <i data-lucide="copy" class="w-4 h-4"></i>
              <span>Copy Prompt</span>
            </button>

            <!-- Secondary Actions -->
            <div class="grid grid-cols-2 gap-2 text-xs">
              <button 
                onclick="openGameDetail(${game.id})"
                class="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 flex items-center justify-center gap-1.5 transition-colors font-medium"
              >
                <i data-lucide="eye" class="w-3.5 h-3.5 text-slate-400"></i>
                <span>ดูรายละเอียด</span>
              </button>
              <button 
                onclick="customizeThisGame(${game.id})"
                class="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 flex items-center justify-center gap-1.5 transition-colors font-medium"
              >
                <i data-lucide="sliders" class="w-3.5 h-3.5 text-indigo-400"></i>
                <span>ปรับแต่ง</span>
              </button>
            </div>
          </div>
        </div>
      `;
      gameGrid.appendChild(card);
    });

    if (window.lucide) lucide.createIcons();
  }

  window.copyGamePrompt = function(gameId, btn) {
    const game = gamesData.find(g => g.id === Number(gameId));
    if (game) {
      copyTextToClipboard(game.prompt, btn);
    }
  };

  window.resetSearch = function() {
    searchInput.value = "";
    state.searchQuery = "";
    state.selectedCategory = "all";
    renderCategories();
    filterAndRenderGames();
  };

  // Search Input Listener
  searchInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value;
    filterAndRenderGames();
  });

  // Sound Toggle Listener
  soundToggleBtn.addEventListener("click", () => {
    state.soundEnabled = !state.soundEnabled;
    soundToggleBtn.innerHTML = `
      <i data-lucide="${state.soundEnabled ? 'volume-2' : 'volume-x'}" class="w-4 h-4"></i>
      <span class="hidden sm:inline">${state.soundEnabled ? 'เสียง: เปิด' : 'เสียง: ปิด'}</span>
    `;
    soundToggleBtn.className = `px-3.5 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-2 transition-colors ${
      state.soundEnabled 
        ? "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-750" 
        : "bg-red-950/40 text-red-300 border-red-800/50 hover:bg-red-900/40"
    }`;
    if (window.lucide) lucide.createIcons();
    if (state.soundEnabled) playSound("click");
    showToast(state.soundEnabled ? "เปิดระบบเสียงเอฟเฟกต์แล้ว" : "ปิดเสียงเอฟเฟกต์แล้ว", "info");
  });

  // Generator Action: Update Prompt
  function updateGeneratedPrompt() {
    const selectedFeatures = Array.from(document.querySelectorAll("input[name='feature']:checked")).map(el => el.value);
    
    const promptText = PromptGenerator.generate({
      gameId: generatorBaseGame.value,
      customTitle: generatorTitle.value,
      gradeLevel: generatorGrade.value,
      learningUnit: generatorUnit.value,
      techStack: generatorTech.value,
      difficulty: generatorDifficulty.value,
      features: selectedFeatures,
      customQuestions: generatorQuestions.value
    });

    generatedPromptArea.value = promptText;
  }

  // Generate Button Click
  generateBtn.addEventListener("click", () => {
    playSound("click");
    updateGeneratedPrompt();
    showToast("✨ ประกอบ Prompt ใหม่เรียบร้อยแล้ว!", "success");
    // Pulse animation on prompt area
    generatedPromptArea.classList.add("ring-2", "ring-indigo-500");
    setTimeout(() => generatedPromptArea.classList.remove("ring-2", "ring-indigo-500"), 1000);
  });

  // Copy Generated Button Click
  copyGeneratedBtn.addEventListener("click", () => {
    copyTextToClipboard(generatedPromptArea.value, copyGeneratedBtn);
  });

  // Download Generated Prompt as .txt/.md
  downloadPromptBtn.addEventListener("click", () => {
    playSound("click");
    const content = generatedPromptArea.value;
    const title = generatorTitle.value.trim() || "game_prompt";
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Prompt_${title.replace(/\s+/g, "_")}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("ดาวน์โหลดไฟล์ Prompt สำเร็จ!", "success");
  });

  // Export All 20 Prompts as Markdown
  exportAllBtn.addEventListener("click", () => {
    playSound("click");
    let fullMarkdown = `# ชุด Prompt พัฒนา Web Application สำหรับ Game-Based Learning ภาษาไทย (20 เกม)\n`;
    fullMarkdown += `สร้างโดย Prompt Studio สำหรับคุณครูและนักพัฒนาเกมการศึกษา\nวันที่สร้าง: ${new Date().toLocaleDateString("th-TH")}\n\n---\n\n`;

    gamesData.forEach(game => {
      fullMarkdown += `## ${game.id}. ${game.title} (${game.englishTitle})\n\n`;
      fullMarkdown += `- **ระดับชั้น:** ${game.grade}\n`;
      fullMarkdown += `- **หมวดทักษะ:** ${game.categoryLabel}\n`;
      fullMarkdown += `- **ทักษะที่มุ่งเน้น:** ${game.skills}\n`;
      fullMarkdown += `- **รูปแบบการเล่น:** ${game.playStyle}\n`;
      fullMarkdown += `- **บทสรุปเกม:** ${game.brief}\n\n`;
      fullMarkdown += `### Master AI Prompt:\n\`\`\`markdown\n${game.prompt}\n\`\`\`\n\n---\n\n`;
    });

    const blob = new Blob([fullMarkdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Thai_GBL_20_Games_Master_Prompts.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("ส่งออกคลัง Prompt ทั้ง 20 เกมสำเร็จ!", "success");
  });

  // Checkbox listeners in generator to update dynamically
  document.querySelectorAll("input[name='feature']").forEach(chk => {
    chk.addEventListener("change", updateGeneratedPrompt);
  });

  // Quick Start Banner Button
  window.filterQuickStart = function() {
    state.selectedCategory = "quickstart";
    renderCategories();
    filterAndRenderGames();
    const grid = document.getElementById("gallerySection");
    if (grid) grid.scrollIntoView({ behavior: "smooth" });
  };

  // Keyboard shortcut: Escape to close modals
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDetailModal();
      closeImageModal();
    }
  });

  // Initial Run
  renderCategories();
  populateGeneratorSelect();
  filterAndRenderGames();
  updateGeneratedPrompt();
});
