/*
참고 : 
통합검색, 서브메뉴, 푸터-관련사이트바로가기, 화면크기 조정
*/

$(function(){
    popsearch(); // 통합검색
    snb(); // 서브메뉴
    footer(); // 관련사이트바로가기
})

// 헤더, 탑버튼 스크롤 이벤트
$(function () {
    let lScroll = 0;
    let vh50 = window.innerHeight * 0.5;
    let docH = $(document).height();
    let winH = window.innerHeight;

	$(window).on("resize", function(){
		vh50 = window.innerHeight * 0.5;
    	docH = $(document).height();
    	winH = window.innerHeight;
	});

    $(window).on("scroll", function () {
        const cScroll = $(this).scrollTop();

		// 헤더 스크롤 이벤트
        if (cScroll < vh50) {
            $("#header").addClass("scrDown");
        } 
        else if (cScroll < lScroll) {
            $("#header").removeClass("scrDown");
        } 
        else {
            $("#header").addClass("scrDown");
        }

		// 탑버튼 스크롤 이벤트
		if (cScroll < vh50) {
			$(".btn_top").removeClass("active end")
		} else if (cScroll > docH - winH * 1.5) {
			$(".btn_top").addClass("end");
		} else {
			$(".btn_top").addClass("active").removeClass("end");
		}

        lScroll = cScroll;
    }).trigger("scroll");

    $('.btn_top').on("click", function () {
        $('html, body').animate({ scrollTop: 0 }, 250);
        return false;
    });
});

// 검색, 전체메뉴
function popsearch() { 
    // 검색
    $('#searchOpen').on('click', function(e) {
        $('.box_search').show();
        $('#total_search').focus();
        e.preventDefault();
    });

    $('#btnSearchClose').on('click', function(e) {
        $('.box_search').hide();
        $('#searchOpen').focus();
        e.preventDefault();
    });

    // 마지막 메뉴에서 focusout시 메뉴닫힘(웹접근성)
    $(document).on('keydown', '.box_search', function (e) {
        if (e.key !== 'Tab') return;
    
        const $focusables = $(this).find('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])').filter(':visible');
        const first = $focusables.first()[0];
        const last  = $focusables.last()[0];
        const active = document.activeElement;
    
        // 마지막 요소에서 Tab
        if (!e.shiftKey && active === last) {
            e.preventDefault();
            first.focus();
        }
    
        // 첫 요소에서 Shift+Tab
        if (e.shiftKey && active === first) {
            e.preventDefault();
            last.focus();
        }
    });
}

// 서브메뉴
function snb(){
	var $snb = $('#snb');

    $snb.find('li').each(function() {
        if ($(this).find('ul').length > 0) {
            $(this).addClass('dep').find('> a').attr('title', '닫힘');
        }
    });

    $snb.find('.on:last').parents('li').addClass("on");

    $('#snb').find('li').each(function(){
        if($(this).hasClass('on') == true){
            var ul = $(this).parent();
            var active = $(this).clone();
            $(this).after(active).next().removeClass('on').find('ul').remove();

            var activeCut = $(this).detach();
            ul.prepend(activeCut);
        }
    });
	/*
    $snb.find('a').on('click', function(e) {
        var $snbul = $(this).parent().parent();
        if ($snbul.hasClass('open') == true) {
            $snbul.removeClass('open');
            $(this).attr('title', '열림');            
        }else{
            $('#snb').find('ul.open').removeClass('open');
            $snbul.addClass('open');
            $(this).attr('title', '닫힘');
        }
        e.preventDefault();
    });
    */
    $snb.find('a').on('click', function(e) {
	    if ($(this).parent('li').hasClass('on')) {
	        var $snbul = $(this).parent().parent();
	        if ($snbul.hasClass('open')) {
	            $snbul.removeClass('open');
	            $(this).attr('title', '닫힘');            
	        } else {
	            $('#snb').find('ul.open').removeClass('open');
	            $snbul.addClass('open');
	            $(this).attr('title', '열림');
	        }
	        e.preventDefault(); // 'on' 클래스가 있을때 링크 이동 막기
	    }
	});

    $('#snb [class*="depth"] li > a').keydown(function(e){
        if (e.keyCode == 9 && !e.shiftKey){
            if ($('[class*="depth"]').hasClass('open')) {
                if ($(this).parent('li').next('li').length) {
                    $(this).parent('li').next('li').children('a').focus();
                    e.preventDefault();
                }
            }else {
                if ($(this).parent('li').parent('ul').find('li.on').children('div').length) {
                    $(this).parent('li').parent('ul').find('> li.on > div > a').focus();
                }
            }
        }
    });

    // 메뉴 마지막 li focusout 시 포커스 제어
    $snb.find('ul > li:last-child > a').on('focusout', function () {
        const $ul = $(this).parents('ul').first();

        if ($ul.hasClass('depth03')) {
            $('#snb .depth03').removeClass('open');
            return;
        }

        else if ($ul.hasClass('depth02')) {
            $('#snb .depth02').removeClass('open');

            $('#snb .depth03').addClass('open');
            $('#snb .depth03 > li.on > a').focus();
            return;
        }

        else if ($ul.hasClass('depth01')) {
            $('#snb .depth01').removeClass('open');

            $('#snb .depth02').addClass('open');
            $('#snb .depth02 > li.on > a').focus();
            return;
        }
    });
}

//footer Box
function footer() {
    $(".footBtn button").attr("title", "상태 : 축소");
    $('.footBtn button').click(function() {
        $(this).attr("title", "상태 : 확장");
        $(this).parent().siblings('div').children('div').stop().slideUp(300);
        $(this).siblings("div").stop().slideToggle(300);

        if ($(this).parent('.footBtn').hasClass('on')) {
            $('.footBtn').removeClass('on');
            $(this).attr("title", "상태 : 축소");
        } else {
            $('.footBtn').removeClass('on');
            $(this).parent('.footBtn').addClass('on');
            $(this).attr("title", "상태 : 확장");
            $(this).parent('.footBtn').siblings('.footBtn').each(function() {
			    $(this).find('button').attr('title', '상태 : 축소');
			});
        }
        return false;
    });

    $(window).on('load', function() {
        $("#footer .footBtn ul li:last-of-type > a").focusout(function() {
            $('.footBtn button').attr("title", "상태 : 축소");
            $('.footBtn div').hide();
            $('.footBtn').removeClass('on');
        });
    });
}

// 화면크기 조정
$(document).on("click", ".item-link", function(){
    var zoomValues = {
        xsm: "0.9",
        md: "1.1",
        lg: "1.3",
        xlg: "1.5"
    };

    var zoom = zoomValues[$(this).attr("class").split(" ").find(function(className) {
        return zoomValues[className];
    })] || "1";

    $(".item-link").removeClass("active");
    $(this).addClass("active");
    $("body").css("zoom", zoom);
});