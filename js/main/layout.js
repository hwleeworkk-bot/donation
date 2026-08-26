$(document).ready(function () {
    gnb();
    fullMenu();
});
$(window).on("resize", function () {
    fullMenu();
});

function gnb() {
    var $gnb = $('.krds-main-menu .gnb-menu');
    var $dep1 = $gnb.find('> li');
    var $dep1_btn = $dep1.find('> .gnb-main-trigger');

    // 1차 메뉴에 마우스 올렸을 때
    $dep1_btn.on('mouseenter focusin', function () {
        var $this = $(this);
        var $currentWrap = $this.siblings('.gnb-toggle-wrap');

        // 전체 메뉴 열기
        $('.krds-main-menu').addClass('on');
        $('.gnb-toggle-wrap').removeClass('is-open');
        $currentWrap.addClass('is-open');

        // 현재 li에만 active
        $dep1_btn.removeClass('active');
        $this.addClass('active');
    });

    // 마우스가 메뉴 전체 영역을 벗어났을 때
    $gnb.on('mouseleave', function () {
        $('.krds-main-menu').removeClass('on');
        $('.gnb-toggle-wrap').removeClass('is-open');
        $dep1_btn.removeClass('active');
    });

    // 마지막 메뉴에서 focusout시 메뉴닫힘(웹접근성)
    $gnb.find('a').last().on('keydown', function (e) {
        if (!e.shiftKey && e.key == 'Tab') {
            $('.krds-main-menu').removeClass('on');
            $('.gnb-toggle-wrap').removeClass('is-open');
            $dep1_btn.removeClass('active');
        }
    });
}

// GNB 메뉴 열기/닫기
$(function () {
	function closeMenu() {
		$(".krds-main-menu").removeClass("on");
		$(".krds-main-menu .gnb-main-trigger").removeClass("active");
		$(".krds-main-menu .gnb-toggle-wrap").removeClass("is-open");
	}
	
	function gnb() {
		// 열기
		$(document).on("focus mouseover", ".gnb-menu > li", function () {
			closeMenu();
			$(this).find(".gnb-main-trigger").addClass("active");
			$(this).find(".gnb-toggle-wrap").addClass("is-open");
		});

		// 닫기
		$(document).on("mouseleave", ".gnb-menu > li", function () {
			closeMenu();
		});

		// 닫기
		$(document).on("click", ".gnb-toggle-wrap", function () {
			closeMenu();
		});
	}
	gnb();
});

// 전체메뉴
function fullMenu() {
    const winW = window.innerWidth || document.documentElement.clientWidth;

    // 모바일
    if (winW <= 1023) {
        $('#tab-0').addClass('active');
        $('#mGnb-anchor1').addClass('active');
        $(document).off('click.mobileNav');

        $(document).on('click.mobileNav', '#mobile-nav .sub-title a', function () {
            const $submenu = $(this).parent('h3').next();

            if ($submenu.is(':visible')) {
                $submenu.slideUp();
                $(this).removeClass('active');
            } else {
                $(this).closest('div').siblings().find('h3').next().slideUp();
                $(this).closest('div').siblings().find('a').removeClass('active');
                $submenu.slideDown();
                $(this).addClass('active');
            }
        });

        $(document).on('click.mobileNav', '#mobile-nav .menu-wrap a', function () {
            var contents = $(this.hash);
        
            $(this).addClass('active').attr('title', '선택됨');
            $(this).parent('li').siblings().find('a').removeClass('active').attr('title', '');
            $(contents).addClass('active').parent('li').siblings().find('.gnb-sub-list').removeClass('active');
        });

    } else {
        // PC
        $(document).off('click.mobileNav');
    }
}