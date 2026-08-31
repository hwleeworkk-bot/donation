const bottomSheet = {
  activeSheet: null,
  activeOverlay: null,
  lastActiveElement: null,
  duration: 300,

  // 1. 공통 이벤트 초기화
  init: function() {
    // 배경(.modal-overlay) 클릭 시 닫기
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        this.close();
      }
    });

    // 키보드 이벤트
    document.addEventListener('keydown', (e) => {
      this._handleKeyDown(e);
    });
  },

  // 2. 바텀시트 열기
  open: function(targetSheet, options = {}) {
    const sheet = typeof targetSheet === 'string'
      ? document.querySelector(targetSheet)
      : targetSheet;

    if (!sheet) return;

    // 기존에 열려있는 바텀시트가 있으면 닫기
    if (this.activeSheet && this.activeSheet !== sheet) {
      this.close({
        restoreFocus: false
      });
    }

    this.lastActiveElement = document.activeElement;

    const overlay = sheet.closest('.modal-overlay');

    this.activeSheet = sheet;
    this.activeOverlay = overlay;

    // body 스크롤 막기
    document.body.style.overflow = 'hidden';

    // overlay 표시
    if (overlay) {
      overlay.classList.add('active');
    }

    // 닫기 버튼 이벤트
    this._bindCloseEvents(sheet);

    // 초기 위치
    sheet.style.transition = 'none';
    sheet.style.transform = 'translateY(100%)';

    // 브라우저가 초기 위치를 적용한 다음 열기
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {

        sheet.style.transition =
          `transform ${this.duration}ms ease-out`;

        sheet.style.transform = 'translateY(0)';
      });
    });

    // 열기 애니메이션 완료
    const onOpenTransitionEnd = (e) => {
      if (
        e.target !== sheet ||
        e.propertyName !== 'transform'
      ) {
        return;
      }

      sheet.removeEventListener(
        'transitionend',
        onOpenTransitionEnd
      );

      if (overlay) {
        overlay.classList.add('scroll');
      }

      this._focusInsideSheet(sheet);

      if (typeof options.onOpen === 'function') {
        options.onOpen();
      }
    };

    sheet.addEventListener(
      'transitionend',
      onOpenTransitionEnd
    );
  },

  // 3. 바텀시트 닫기
  close: function(options = {}) {
    const sheet = this.activeSheet;

    if (!sheet) return;

    const overlay = this.activeOverlay;

    const restoreFocus =
      options.restoreFocus !== undefined
        ? options.restoreFocus
        : true;

    const onClose = options.onClose;

    let cleaned = false;

    // 스크롤 클래스 제거
    if (overlay) {
      overlay.classList.remove('scroll');
    }

    // 닫기 완료 처리
    const cleanup = () => {
      if (cleaned) return;

      cleaned = true;

      sheet.removeEventListener(
        'transitionend',
        onTransitionEnd
      );

      if (overlay) {
        overlay.classList.remove('active');
      }

      this.activeSheet = null;
      this.activeOverlay = null;

      document.body.style.overflow = '';

      // 이전 포커스 복원
      if (
        restoreFocus &&
        this.lastActiveElement &&
        typeof this.lastActiveElement.focus === 'function'
      ) {
        this.lastActiveElement.focus();
      }

      this.lastActiveElement = null;

      if (typeof onClose === 'function') {
        onClose();
      }
    };

    // transition 완료
    const onTransitionEnd = (e) => {
      if (
        e.target !== sheet ||
        e.propertyName !== 'transform'
      ) {
        return;
      }

      cleanup();
    };

    sheet.addEventListener(
      'transitionend',
      onTransitionEnd
    );

    // 닫기 애니메이션
    sheet.style.transition =
      `transform ${this.duration}ms ease-out`;

    requestAnimationFrame(() => {
      sheet.style.transform = 'translateY(100%)';
    });

    // transitionend가 발생하지 않는 경우 대비
    setTimeout(() => {
      cleanup();
    }, this.duration + 100);
  },

  // 4. 닫기 버튼 이벤트
  _bindCloseEvents: function(sheet) {
    const closeTargets = sheet.querySelectorAll(
      '.modal-handle, .btn-close, [data-dismiss="modal"]'
    );

    closeTargets.forEach((el) => {

      // 기존 onclick 제거
      el.onclick = null;

      el.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        this.close();
      };
    });
  },

  // 5. 바텀시트 내부로 포커스
  _focusInsideSheet: function(sheet) {
    sheet.setAttribute('tabindex', '-1');

    // 모바일에서 focus로 인한 스크롤 방지
    try {
      sheet.focus({
        preventScroll: true
      });
    } catch (e) {
      sheet.focus();
    }
  },

  // 6. 키보드 이벤트
  _handleKeyDown: function(e) {
    if (!this.activeSheet) return;

    // ESC
    if (
      e.key === 'Escape' ||
      e.key === 'Esc'
    ) {
      e.preventDefault();

      this.close();

      return;
    }

    // TAB
    if (e.key !== 'Tab') return;

    const focusables =
      this._getFocusableElements(this.activeSheet);

    if (focusables.length === 0) return;

    const firstEl = focusables[0];
    const lastEl =
      focusables[focusables.length - 1];

    // Shift + Tab
    if (e.shiftKey) {

      if (document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      }

    // Tab
    } else {

      if (document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }
  },

  // 7. 포커스 가능한 요소 찾기
  _getFocusableElements: function(element) {
    const selector =
      'button, [href], input, select, textarea, ' +
      '[tabindex]:not([tabindex="-1"])';

    return Array.from(
      element.querySelectorAll(selector)
    ).filter((el) => {
      return (
        !el.hasAttribute('disabled') &&
        el.getAttribute('aria-hidden') !== 'true'
      );
    });
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