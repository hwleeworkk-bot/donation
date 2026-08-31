const bottomSheet = {
  activeSheet: null,
  activeOverlay: null,
  duration: 300,

  isDragging: false,
  startY: 0,
  currentY: 0,
  dragDistance: 0,

  init: function() {

    // dim 클릭
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        this.close();
      }
    });

    // 닫기 버튼 / 핸들
    document.addEventListener('click', (e) => {
      const closeBtn = e.target.closest(
        '.modal-handle, .btn-close, [data-dismiss="modal"]'
      );

      if (!closeBtn) return;

      const sheet = closeBtn.closest('.bottom-sheet');

      if (!sheet) return;

      this.close(sheet);
    });

    // ESC
    document.addEventListener('keydown', (e) => {
      if (!this.activeSheet) return;

      if (e.key === 'Escape' || e.key === 'Esc') {
        e.preventDefault();
        this.close();
      }
    });

    // 터치 시작
    document.addEventListener('touchstart', (e) => {
      const handle = e.target.closest('.modal-handle');

      if (!handle) return;

      const sheet = handle.closest('.bottom-sheet');

      if (!sheet || sheet !== this.activeSheet) return;

      this.isDragging = true;
      this.startY = e.touches[0].clientY;
      this.currentY = this.startY;
      this.dragDistance = 0;

      sheet.classList.add('is-dragging');
    }, {
      passive: true
    });

    // 터치 이동
    document.addEventListener('touchmove', (e) => {
      if (!this.isDragging || !this.activeSheet) return;

      const currentY = e.touches[0].clientY;

      this.currentY = currentY;
      this.dragDistance = currentY - this.startY;

      // 아래 방향으로만 처리
      if (this.dragDistance > 0) {

        if (e.cancelable) {
          e.preventDefault();
        }

        this.activeSheet.style.setProperty(
          '--drag-y',
          `${this.dragDistance}px`
        );
      }
    }, {
      passive: false
    });

    // 터치 종료
    document.addEventListener('touchend', () => {
      if (!this.isDragging || !this.activeSheet) return;

      const sheet = this.activeSheet;
      const distance = this.dragDistance;

      this.isDragging = false;
      this.dragDistance = 0;

      sheet.classList.remove('is-dragging');

      // 20px 이상 아래로 움직였으면 닫기
      if (distance > 20) {
        sheet.style.removeProperty('--drag-y');
        this.close(sheet);
        return;
      }

      // 20px 미만이면 원위치
      sheet.style.removeProperty('--drag-y');
    }, {
      passive: true
    });
  },

  // 열기
  open: function(targetSheet) {
    const sheet = typeof targetSheet === 'string'
      ? document.querySelector(targetSheet)
      : targetSheet;

    if (!sheet) return;

    const overlay = sheet.closest('.modal-overlay');

    if (!overlay) return;

    this.activeSheet = sheet;
    this.activeOverlay = overlay;

    this.isDragging = false;
    this.dragDistance = 0;

    sheet.style.removeProperty('--drag-y');

    // body 스크롤 잠금
    document.body.style.overflow = 'hidden';

    // overlay 표시
    overlay.classList.add('active');

    // sheet 열기
    requestAnimationFrame(() => {
      sheet.classList.add('is-open');
    });
  },

  // 닫기
  close: function(sheet) {
    sheet = sheet || this.activeSheet;

    if (!sheet) return;

    const overlay = sheet.closest('.modal-overlay');

    this.isDragging = false;
    this.dragDistance = 0;

    sheet.style.removeProperty('--drag-y');
    sheet.classList.remove('is-dragging');

    // CSS 애니메이션
    sheet.classList.remove('is-open');

    // 애니메이션 후 overlay 제거
    setTimeout(() => {

      if (overlay) {
        overlay.classList.remove('active');
      }

      document.body.style.overflow = '';

      if (sheet === this.activeSheet) {
        this.activeSheet = null;
        this.activeOverlay = null;
      }

    }, this.duration);
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

const errorFocus = {
  duration: 300,

  focus(target, duration = this.duration) {
    const input = typeof target === 'string'
      ? document.querySelector(target)
      : target;

    if (!input) return;

    let animTarget = input;

    // 먼저 실제 input에 포커스
    input.focus();

    // checkbox / radio인 경우 애니메이션 대상 변경
    if (input.matches('input[type="checkbox"], input[type="radio"]')) {
      const nextLabel = input.nextElementSibling;

      if (nextLabel && nextLabel.tagName.toLowerCase() === 'label') {
        animTarget = nextLabel;
      } else {
        const parentLabel = input.closest('label');

        if (parentLabel) {
          animTarget = parentLabel;
        }
      }
    }

    // 효과 적용
    animTarget.classList.add('shake-effect');

    // 효과 제거
    setTimeout(() => {
      animTarget.classList.remove('shake-effect');
    }, duration);
  }
};