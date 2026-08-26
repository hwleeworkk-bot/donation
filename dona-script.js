const bottomSheet = {
  activeSheet: null,
  activeOverlay: null,
  lastActiveElement: null,
  duration: 300, // 애니메이션 시간 (ms)

  // 드래그 관련 상태
  isDragging: false,
  startY: 0,
  currentY: 0,
  dragDistance: 0,

  // 1. 공통 이벤트 초기화
  init: function() {
    // 배경(.modal-overlay) 클릭 시 닫기
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        this.close();
      }
    });

    // 키보드 이벤트 (Esc 키 닫기 & Tab 포커스 가두기)
    document.addEventListener('keydown', (e) => this._handleKeyDown(e));
  },

  // 2. 바텀시트 열기
  open: function(targetSheet, options = {}) {
    const sheet = typeof targetSheet === 'string' ? document.querySelector(targetSheet) : targetSheet;
    if (!sheet) {
      return;
    }

    this.lastActiveElement = document.activeElement;

    const overlay = sheet.closest('.modal-overlay');
    this.activeSheet = sheet;
    this.activeOverlay = overlay;

    document.body.style.overflow = 'hidden';

    if (overlay) overlay.classList.add('active');

    // 닫기 버튼 / 핸들 / 드래그 이벤트 바인딩
    this._bindCloseEvents(sheet);
    this._bindDragEvents(sheet);

    // 열기 트랜지션 완료 이벤트
    const onOpenTransitionEnd = (e) => {
      if (e.target !== sheet || e.propertyName !== 'transform') return;
      sheet.removeEventListener('transitionend', onOpenTransitionEnd);
      
    if (overlay) overlay.classList.add('scroll');
      if (typeof options.onOpen === 'function') options.onOpen();
    };

    sheet.addEventListener('transitionend', onOpenTransitionEnd);

    // 열림 슬라이드 업 실행
    sheet.style.transition = `transform ${this.duration}ms ease-out`;
    sheet.style.transform = 'translateY(100%)';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        sheet.style.transform = 'translateY(0)';
      });
    });

    setTimeout(() => {
      this._focusInsideSheet(sheet);
    }, 50);
  },

  // 3. 바텀시트 닫기 (클릭 닫기 & 드래그 닫기 공통 적용)
  close: function(options = {}) {
    if (!this.activeSheet) return;

    const sheet = this.activeSheet;
    const overlay = this.activeOverlay;
    let isCleanedUp = false;

    if (overlay) overlay.classList.remove('scroll');

    const cleanup = () => {
      if (isCleanedUp) return;
      isCleanedUp = true;

      sheet.removeEventListener('transitionend', onCloseTransitionEnd);

      // 시트가 다 내려간 직후 overlay.active 제거
      if (overlay) overlay.classList.remove('active');

      this._unbindDragEvents();

      this.activeSheet = null;
      this.activeOverlay = null;

      document.body.style.overflow = '';

      if (this.lastActiveElement && typeof this.lastActiveElement.focus === 'function') {
        this.lastActiveElement.focus();
      }

      if (typeof options.onClose === 'function') options.onClose();
    };

    // 트랜지션 끝 감지
    const onCloseTransitionEnd = (e) => {
      if (e.target !== sheet || e.propertyName !== 'transform') return;
      cleanup();
    };

    sheet.addEventListener('transitionend', onCloseTransitionEnd);

    // 클릭해서 닫을 때도 동일한 속도로 내려가도록 transition 재지정
    sheet.style.transition = `transform ${this.duration}ms ease-out`;
    void sheet.offsetWidth; // 강제 리플로우 (애니메이션이 시작되도록 유도)
    sheet.style.transform = 'translateY(100%)';

    // 안전장치 (transitionend 씹힘 방지용)
    setTimeout(cleanup, this.duration + 100);
  },

  // 닫기 버튼 및 핸들 클릭 이벤트 통합 바인딩
  _bindCloseEvents: function(sheet) {
    // 핸들 또는 X 닫기 버튼(.btn-close 등) 클릭 시 닫기
    const closeTargets = sheet.querySelectorAll('.modal-handle, .btn-close, [data-dismiss="modal"]');
    closeTargets.forEach(el => {
      el.onclick = (e) => {
        e.stopPropagation();
        this.close();
      };
    });
  },

  // 드래그/터치 이벤트 바인딩
  _bindDragEvents: function(sheet) {
    const handle = sheet.querySelector('.modal-handle') || sheet;

    this._onDragStart = this._onDragStart.bind(this);
    this._onDragMove = this._onDragMove.bind(this);
    this._onDragEnd = this._onDragEnd.bind(this);

    handle.addEventListener('touchstart', this._onDragStart, { passive: true });
    window.addEventListener('touchmove', this._onDragMove, { passive: false });
    window.addEventListener('touchend', this._onDragEnd);

    handle.addEventListener('mousedown', this._onDragStart);
    window.addEventListener('mousemove', this._onDragMove);
    window.addEventListener('mouseup', this._onDragEnd);
  },

  _unbindDragEvents: function() {
    window.removeEventListener('touchmove', this._onDragMove);
    window.removeEventListener('touchend', this._onDragEnd);
    window.removeEventListener('mousemove', this._onDragMove);
    window.removeEventListener('mouseup', this._onDragEnd);
  },

  _onDragStart: function(e) {
    if (!this.activeSheet) return;

    this.isDragging = true;
    this.startY = e.touches ? e.touches[0].clientY : e.clientY;
    this.currentY = this.startY;
    this.dragDistance = 0;

    // 드래그 손맛을 위해 실시간 이동 시에는 transition 일시 제거
    this.activeSheet.style.transition = 'none';
  },

  _onDragMove: function(e) {
    if (!this.isDragging || !this.activeSheet) return;

    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    this.dragDistance = clientY - this.startY;

    if (this.dragDistance > 0) {
      if (e.cancelable) e.preventDefault();
      this.activeSheet.style.transform = `translateY(${this.dragDistance}px)`;
    }
  },

  _onDragEnd: function() {
    if (!this.isDragging || !this.activeSheet) return;

    this.isDragging = false;
    const threshold = 50; // 100px 이상 내리면 닫기

    if (this.dragDistance > threshold) {
      // 드래그 손 뗐을 때 나머지 내려가는 거리를 부드럽게 넘겨주기
      this.close();
    } else {
      this.activeSheet.style.transition = `transform ${this.duration}ms ease-out`;
      this.activeSheet.style.transform = 'translateY(0)';
    }

    this.dragDistance = 0;
  },

  _handleKeyDown: function(e) {
    if (!this.activeSheet) return;

    if (e.key === 'Escape' || e.key === 'Esc') {
      e.preventDefault();
      this.close(); // ESC 키 클릭도 동일하게 close() 경유
      return;
    }

    if (e.key === 'Tab') {
      const focusables = this._getFocusableElements(this.activeSheet);
      if (focusables.length === 0) return;

      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          lastEl.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastEl) {
          firstEl.focus();
          e.preventDefault();
        }
      }
    }
  },

  _focusInsideSheet: function(sheet) {
    const focusables = this._getFocusableElements(sheet);
    if (focusables.length > 0) {
      focusables[0].focus();
    } else {
      sheet.setAttribute('tabindex', '-1');
      sheet.focus();
    }
  },

  _getFocusableElements: function(element) {
    const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    return Array.from(element.querySelectorAll(selector)).filter(el => !el.hasAttribute('disabled'));
  }
};

const AccordionUI = {
  accordionButtons: null,
  accordionHandlers: new Map(),

  init() {
    // HTML의 실제 버튼 클래스인 .accordion-toggle-btn 타겟팅
    this.accordionButtons = document.querySelectorAll(".accordion-toggle-btn");

    if (!this.accordionButtons.length) return;

    this.setupAccordions();
    this.setupAllToggleButton();
  },
  openItem(item) {
    const container = item.closest(".accordion");
    if (!container) return;

    const type = container.dataset.type || "multiOpen";

    // singleOpen 모드일 때 다른 항목들 닫기
    if (type === "singleOpen") {
      const items = container.querySelectorAll(".accordion-item");
      items.forEach((other) => {
        if (other !== item) this.setItemState(other, false);
      });
    }

    this.setItemState(item, true);
  },
  setupAllToggleButton() {
    const allToggleBtns = document.querySelectorAll("[data-accordion-alltoggle]");
    if (allToggleBtns.length === 0) return;

    allToggleBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetSelector = btn.dataset.target;
        if (!targetSelector) return;

        const combinedSelector = targetSelector
          .split(",")
          .map((s) => `${s.trim()} .accordion-item`)
          .join(",");

        const items = document.querySelectorAll(combinedSelector);
        if (items.length === 0) return;

        const isAnyClosed = Array.from(items).some((item) => !item.classList.contains("active"));

        items.forEach((item) => this.setItemState(item, isAnyClosed));

        btn.textContent = isAnyClosed ? "전체닫기" : "전체보기";
      });
    });
  },

  setItemState(item, forceState) {
    const button = item.querySelector(".accordion-toggle-btn");
    const content = item.querySelector(".accordion-content");
    const inner = item.querySelector(".accordion-inner.scrollable");

    if (button) {
      button.setAttribute("aria-expanded", forceState);
      button.classList.toggle("active", forceState);
      button.setAttribute("aria-label", forceState ? "내용 닫기" : "내용 열기");
    }

    if (inner) {
      if (forceState) {
        inner.setAttribute("tabindex", "0");
      } else {
        if (document.activeElement === inner || inner.contains(document.activeElement)) {
          if (button) {
            button.focus(); // 포커스를 토글 버튼으로 이동
          } else {
            document.activeElement.blur();
          }
        }
        inner.removeAttribute("tabindex");
      }
    }

    if (content) {
      content.setAttribute("aria-hidden", !forceState);

      // inert 속성을 지원하는 브라우저를 위해 같이 제어 (포커스 접근 차단)
      if (!forceState) {
        content.setAttribute("inert", "");
      } else {
        content.removeAttribute("inert");
      }
    }

    item.classList.toggle("active", forceState);
  },

  accordionToggle(button, accordionItems, accordionType, currentItem) {
    const isExpanded = button.getAttribute("aria-expanded") === "true";

    if (accordionType === "singleOpen" && !currentItem.classList.contains("active")) {
      accordionItems.forEach((otherItem) => {
        if (otherItem !== currentItem) {
          this.setItemState(otherItem, false);
        }
      });
    }

    // 현재 항목 토글
    this.setItemState(currentItem, !isExpanded);
  },

  setupAccordions() {
    this.accordionButtons.forEach((button, idx) => {
      const accordionContainer = button.closest(".accordion");
      if (!accordionContainer) return;

      const accordionItems = accordionContainer.querySelectorAll(".accordion-item");
      const currentItem = button.closest(".accordion-item");
      const accordionContent = currentItem.querySelector(".accordion-content");
      
      // 기본값(Default)을 multiOpen으로 설정
      const accordionType = accordionContainer.dataset.type || "multiOpen";
      const isOpen = accordionContainer.classList.contains("is-open");

      // 접근성 속성 초기값 설정
      if (accordionContent) {
        this.setupAriaAttributes(button, accordionContent, idx);
      }

      // 초기 오픈 상태 설정
      if (isOpen || currentItem.classList.contains("active")) {
        this.setItemState(currentItem, true);
      } else {
        this.setItemState(currentItem, false);
      }

      // 핸들러 고정 및 저장
      let toggleHandler = this.accordionHandlers.get(button);
      if (!toggleHandler) {
        toggleHandler = this.accordionToggle.bind(this, button, accordionItems, accordionType, currentItem);
        this.accordionHandlers.set(button, toggleHandler);
      }

      // 기존 이벤트 리스너 제거 및 새로 등록
      button.removeEventListener("click", toggleHandler);
      button.addEventListener("click", toggleHandler);
    });
  },

  setupAriaAttributes(button, accordionContent, idx) {
    const uniqueIdx = `${idx}_${Math.random().toString(36).substring(2, 7)}`;
    const headerId = `accordionHeader-${uniqueIdx}`;
    const contentId = `accordionContent-${uniqueIdx}`;

    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "내용 열기");
    button.setAttribute("id", headerId);
    button.setAttribute("aria-controls", contentId);

    accordionContent.setAttribute("role", "region");
    accordionContent.setAttribute("id", contentId);
    accordionContent.setAttribute("aria-labelledby", headerId);
    accordionContent.setAttribute("aria-hidden", "true");
  },
};