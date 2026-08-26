// scrollMagic
$(document).ready(function() {        
    $(window).resize(function(){
        let bodyWidth = $(window).innerWidth();
        (bodyWidth > 1240) ? $('#container').addClass('subWeb') : $('#container').removeClass('subWeb');
    }).resize();

    setTimeout(function() {
        var controller = new ScrollMagic.Controller();
        // new ScrollMagic.Scene({ triggerElement: ".page-title-wrap", triggerHook: 0.9}).setClassToggle(".page-title-wrap", "active").addTo(controller);
        new ScrollMagic.Scene({ triggerElement: "#contsWrapper:not(:has([class*=scrollMagic]))", triggerHook: 0.9}).setClassToggle("#contsWrapper:not(:has([class*=scrollMagic]))", "active").addTo(controller);
        new ScrollMagic.Scene({ triggerElement: "#contsView2:not(:has([class*=scrollMagic]))", triggerHook: 0.9}).setClassToggle("#contsView2:not(:has([class*=scrollMagic]))", "active").addTo(controller);
        new ScrollMagic.Scene({ triggerElement: ".scrollMagic1", triggerHook: 0.9}).setClassToggle(".scrollMagic1", "active").addTo(controller);
        new ScrollMagic.Scene({ triggerElement: ".scrollMagic2", triggerHook: 0.85}).setClassToggle(".scrollMagic2", "active").addTo(controller);
        new ScrollMagic.Scene({ triggerElement: ".scrollMagic3", triggerHook: 0.85}).setClassToggle(".scrollMagic3", "active").addTo(controller);
        new ScrollMagic.Scene({ triggerElement: ".scrollMagic4", triggerHook: 0.85}).setClassToggle(".scrollMagic4", "active").addTo(controller);
        new ScrollMagic.Scene({ triggerElement: ".scrollMagic5", triggerHook: 0.85}).setClassToggle(".scrollMagic5", "active").addTo(controller);
        new ScrollMagic.Scene({ triggerElement: ".scrollMagic6", triggerHook: 0.85}).setClassToggle(".scrollMagic6", "active").addTo(controller);
        new ScrollMagic.Scene({ triggerElement: ".scrollMagic7", triggerHook: 0.85}).setClassToggle(".scrollMagic7", "active").addTo(controller);
        new ScrollMagic.Scene({ triggerElement: ".scrollMagic8", triggerHook: 0.85}).setClassToggle(".scrollMagic8", "active").addTo(controller);
        new ScrollMagic.Scene({ triggerElement: ".scrollMagic9", triggerHook: 0.85}).setClassToggle(".scrollMagic9", "active").addTo(controller);
        new ScrollMagic.Scene({ triggerElement: ".scrollMagic10", triggerHook: 0.85}).setClassToggle(".scrollMagic10", "active").addTo(controller);
        new ScrollMagic.Scene({ triggerElement: ".scrollMagic11", triggerHook: 0.85}).setClassToggle(".scrollMagic11", "active").addTo(controller);
        new ScrollMagic.Scene({ triggerElement: ".scrollMagic12", triggerHook: 0.85}).setClassToggle(".scrollMagic12", "active").addTo(controller);
        new ScrollMagic.Scene({ triggerElement: ".scrollMagic13", triggerHook: 0.85}).setClassToggle(".scrollMagic13", "active").addTo(controller);
        new ScrollMagic.Scene({ triggerElement: ".scrollMagic-num1", triggerHook: 0.85}).setClassToggle(".scrollMagic-num1", "active").addTo(controller)
        .on("enter", numCountUp)
        .on("leave", numCountReset);
        new ScrollMagic.Scene({ triggerElement: ".scrollMagic-num2", triggerHook: 0.85}).setClassToggle(".scrollMagic-num2", "active").addTo(controller)
        .on("enter", numCountUp)
        .on("leave", numCountReset);
        new ScrollMagic.Scene({ triggerElement: ".scrollMagic-num3", triggerHook: 0.85}).setClassToggle(".scrollMagic-num3", "active").addTo(controller)
        .on("enter", numCountUp)
        .on("leave", numCountReset);
        new ScrollMagic.Scene({ triggerElement: ".scrollMagic-num4", triggerHook: 0.85}).setClassToggle(".scrollMagic-num4", "active").addTo(controller)
        .on("enter", numCountUp)
        .on("leave", numCountReset);

        //count
        function numCountUp(){
            $('.numCount').each(function () {
                const $this = $(this);
                const target = $this.data('target'); 
                const counter = new countUp.CountUp(this, target);

                if (!countUp.error) {
                    counter.start();
                } else {
                    console.error(countUp.error);
                }
            });
        }
        function numCountReset(){
            $('.numCount').each(function () {
                const counter = new countUp.CountUp(this);
                counter.reset();
            });
        }
    }, 50);
});

// 주요연혁 - 게이지바
$(window).on('load scroll resize', function () {
    var scrollTop = $(this).scrollTop() + 600;

    $(".timeline_cnt .list_box").filter(function () {
        return $(this).offset().top <= scrollTop;
    }).addClass('gauge').end().filter(function () {
        return $(this).offset().top > scrollTop;
    }).removeClass('gauge');
});

// 전체보기 탭
$(document).on("click", "[class*='moreBtn']", function() {
    const moreList = $(this).siblings(".more_cnt");
    const isOpen = moreList.hasClass("more_open");

    $("[class*='moreList'] > .more_cnt").removeClass("more_open");
    $("[class*='moreList'] [class*='moreBtn']").removeClass("open");
    $(this).removeClass("open");

    if (!isOpen) {
        moreList.addClass("more_open");
        $(this).addClass("open");
    }
});

// 탭리스트
$(function () {
    const firstTab = $('.tabs li:first-child a').attr("href");
    $(firstTab).addClass('on').show();

    $(document).on('click', '.tabs li > a', function (e) {
        var contents = $(this.hash);
    
        $(this).addClass('on').parent('li').siblings().find('a').removeClass('on');
        $(this).attr('title', '선택됨').parent('li').siblings().find('a').attr('title', '');
        $(contents).addClass('on').siblings().removeClass('on');
    
        e.preventDefault();
    });
});

$(function () {
    $("[class*='tabBtn']").each(function () {
        const tabOn = $(this).find("[data-tab].on").first();
        const tabOnData = tabOn.data("tab");

        $(this).find("[data-tab]").attr("title", "");
        tabOn.attr("title", "선택됨");

        $("[data-tablist]").hide();
        $(`[data-tablist='${tabOnData}']`).show();
    });

    $(document).on("click", "[class*='tabBtn'] [data-tab]", function (e) {
        e.preventDefault();

        const tabList = $(this).closest("[class*='tabBtn']");
        const tabName = $(this).data("tab");
        const $ul = $(this).closest("[class*='tabBtn']").find("ul");

        tabList.find("[data-tab]").removeClass("on").attr("title", "");
        tabList.find("li").removeClass("on");
        $(this).addClass("on").attr("title", "선택됨");
        $(this).closest("li").addClass("on");

        $("[data-tablist]").hide();
        $(`[data-tablist='${tabName}']`).show();
    });
});

// 라디오 탭
$(function () {
    $("[class*='tabRadio']").each(function () {
        const radioOn = $(this).find("input[type='radio']:checked").first();
        const radioOnData = radioOn.data("tab");

        $(this).find("input[type='radio']").prop("checked", false);
        radioOn.prop("checked", true);

        $("[data-radiolist]").hide();
        $(`[data-radiolist='${radioOnData}']`).show();
    });

    $(document).on("click", "[class*='tabRadio'] input[type='radio']", function () {
        const radioName = $(this).data("tab");

        $("[class*='tabRadio'] input[type='radio']").prop("checked", false);
        $(this).prop("checked", true);

        $("[data-radiolist]").hide();
        $(`[data-radiolist='${radioName}']`).show();
    });
});

// 썸네일 이미지
function changeThum(imgList) {
	if(!imgList || !imgList.length) return;
    let image = imgList.addClass('on').siblings().removeClass('on').end().find('img');
    $("[class*='thumimg'] img").attr({src: image.attr('src'), alt: image.attr('alt')});

    changeBtn();
    imgList.focus();
    imgList[0].scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'center'});
}
function changeBtn() {
    let images = $("[class*='imglist'] > li");
    let curImg = images.filter('.on');

    let isFirst = curImg.is(images.first());
    let isLast  = curImg.is(images.last());

    $('.swiper-button-prev.thum_btn').prop('disabled', isFirst).attr('aria-disabled', isFirst);
    $('.swiper-button-next.thum_btn').prop('disabled', isLast).attr('aria-disabled', isLast);
}
$(document).ready(function () {
    changeThum($("[class*='imglist'] li").first());
    if ($("[class*='imglist'] li").length < 6) {
        $('.thum_btn').hide();
    }

    $(document).on('click', "[class*='imglist'] > li", function () {
        changeThum($(this));
        changeBtn();
    });

    $(document).on('click', '.thum_btn', function () {
        if ($(this).prop('disabled')) return;
    
        const images = $("[class*='imglist'] li");
        const curImg = images.filter('.on');
    
        let imgTarget;
    
        if ($(this).hasClass('swiper-button-prev')) { imgTarget = curImg.prev('li'); }
        if ($(this).hasClass('swiper-button-next')) { imgTarget = curImg.next('li'); }
        if (imgTarget && imgTarget.length) { changeThum(imgTarget); }
    });
});

// 영상 썸네일
$(document).ready(function() {
    // 유투브
    $('.preview_box.type_youtube .fake_cover').on('click', function(e) {
        e.preventDefault();
        const container = $(this).closest('.preview_box');
        const iframe = container.find('.video_iframe');
        
        let src = iframe.attr('src');
        if (!src.includes('autoplay=1')) {
            const hasQuery = src.includes('?');
            src += hasQuery ? '&autoplay=1' : '?autoplay=1';
            iframe.attr('src', src);
        }

        $(this).remove();
        iframe.show();
    });
    
    // 비디오
    $('.preview_box.type_video .fake_cover').on('click', function (e) {
        e.preventDefault();

        const container = $(this).closest('.preview_box');
        const $video = container.find('.video_iframe');
        const video = $video.get(0);

        if (!video) return;

        $video.show();
        video.controls = true;
        video.load();
        video.play();

        $(this).remove();
    });

});

var timer = null;

// 이벤트 핸들러: 한 번 정의
function slideToggleHandler() {
    var target = $(this).data('target');

    if ($(this).hasClass('slideOpen')) {
        $(this).removeClass('slideOpen').attr('title', '닫힘');
    } else {
        $(this).addClass('slideOpen').attr('title', '열림');
    }

    $('.' + target).stop().slideToggle(300);
}

// 클릭 이벤트 등록 함수 (중복 방지)
function slideToggle_m() {
    $(document).off('click', '.slideToggleTab').on('click', '.slideToggleTab', slideToggleHandler);
}

function resizeDone() {
    const winW = window.innerWidth || document.documentElement.clientWidth;
    if (winW <= 1023) {
        // 모바일
        $('.organMap_wrap .slideToggleTab').removeClass('slideOpen').attr('title', '닫힘');
        slideToggle_m(); // 이벤트 등록
        // 모바일 : 조직도
        $('[class*=organTab]').hide();
    } else {
        // PC
        $(document).off('click', '.slideToggleTab');
        $('.slideToggleTab').addClass('slideOpen').attr('title', '열림');
        // 모바일 : 조직도
        $('[class*=organTab]').show();
        // 모바일 : 명예의전당
        $('[class*=hofTab]').show();
    }
}

// 리사이즈 이벤트 설정
$(window).on('resize', function () {
    clearTimeout(timer);
    timer = setTimeout(resizeDone, 100);
});

// 초기 실행
$(document).ready(function () {
    resizeDone();
});




// 메뉴 즐겨찾기
function goBkmk(sysId, menuId) {
   var menuUrlAddr = window.location.href;

   $.ajax({
      type: "post",
      url: "/" + sysId + "/bm/insertBkmkInfo.do",
      data: {
         menuUrlAddr: menuUrlAddr,
         sysId: sysId,
         menuId: menuId
      },
      dataType: "json",
      success: function(data) {
         if (data.resultAt === "Y") {
            alert("즐겨찾는 메뉴로 등록되었습니다.");

            const $btn = $("#bkmkBtn");
            $btn.find("i").attr("class", "xi-star");
            $btn.attr("title","등록됨");
            $btn.attr("onclick", "deleteBkmk('" + sysId + "', '" + menuId + "')");

         } else {
            alert("로그인 정보가 없습니다.\n로그인을 해주세요.");
            return false;
         }
      },
      error: function() {
         alert("오류가 발생했습니다.");
      }
   });
}

// 메뉴 즐겨찾기 삭제
function deleteBkmk(sysId, menuId) {
   $.ajax({
      type: "post",
      url: "/" + sysId + "/bm/deleteBkmk.do",
      data: {
         sysId: sysId,
         menuId: menuId
      },
      dataType: "json",
      success: function(data) {
         if (data.resultAt === "Y") {
            alert("즐겨찾는 메뉴에서 삭제되었습니다.");

            const $btn = $("#bkmkBtn");
            $btn.find("i").attr("class", "xi-star-o");
            $btn.attr("title","해제됨");
            $btn.attr("onclick", "goBkmk('" + sysId + "', '" + menuId + "')");

         } else {
            alert("오류가 발생하였습니다.\n관리자에게 문의하세요.");
         }
      },
      error: function() {
         alert("오류가 발생했습니다.");
      }
   });
}

var KakaoInitYN = 'N';
function goSns(shareTy){ 
	var htmlTitle = $("#snsHtmlTitle").val();
	var title = ''; // 메뉴타이틀의 경우 스크립트 추가되어 오류  ${naviMenuNm};
	var menuTitle = $("#snsMenuTitle").val();
	var mi = $("#snsCurrMenuId").val();
	
	var _br2 = encodeURIComponent('\n'); 
	var linkUrl = location.href;
	
	if(linkUrl.indexOf('?') > -1) {
		if(linkUrl.indexOf('mi=') < 0) {
			linkUrl = linkUrl + '&mi=' +mi;
		}
	} else {
		if(linkUrl.indexOf('mi=') < 0) {
			linkUrl = linkUrl + '?mi=' +mi;
		}
	}
	
	linkUrl = encodeURIComponent(linkUrl);
	
	if(menuTitle != '메뉴명없음') {
		title = htmlTitle + ' : ' + menuTitle;
	} else {
		title = htmlTitle;
	}
	
	title = encodeURIComponent(title);

	if(shareTy == "fbook") {
		window.open('https://www.facebook.com/sharer/sharer.php?u='+ linkUrl, 'facebook', 'width=626,height=436');
	} else if(shareTy == "twt") {
		window.open('https://twitter.com/intent/tweet?url='+ linkUrl + '&text=' + title, 'twitter', 'width=626,height=436');
	} else if(shareTy == "kkot") {
		
		if(KakaoInitYN == 'N'){
			/*kakao developer에 어플리케이션 등록 후 키 변경  필요*/
			Kakao.init('c359bbd39be9c8b2e80334a7afd5cd55');
			KakaoInitYN = 'Y';
		}
		
		var description = '#대한적십자사 #생명과 안전을 위해서라면 언제, 어디서나';
		//var description = '#'+$('.header h1 a').attr('title');
		var title = $("#snsMenuTitle").val();
		if(title == "") {
			title = document.title;
		}
		
		Kakao.Link.sendDefault({
			objectType: 'feed',
			content: {
				title: title, //제목
				description: description, // 로고 title 값(sysNM), 설명
				imageUrl: 'https://www.redcross.or.kr/design/images/thumbnail/basic_system/2.0/2.10.jpg', //이미지URL
				link: {
					mobileWebUrl: location.href, //공유할 URL
					webUrl: location.href //공유할 URL
				}
			},
			/* social: {
				likeCount: 286,
				commentCount: 45,
				sharedCount: 845
			}, */
			buttons: [
			  	{
			  		title: '자세히보기',
			  		link: {
			  			mobileWebUrl: location.href,
			  			webUrl: location.href
			  		}
			  	}
			  	/*, {
			  		title: '링크 보기',
			  		link: {
			  			mobileWebUrl: linkUrl,
			  			webUrl: linkUrl
			  		}
			  	} */
			 ]
	    });
			
	} else if(shareTy == "band") {
		//window.open('http://band.us/plugin/share?body='+ title + _br2 + linkUrl + '&route=' + linkUrl, 'band', 'width=410, height=540, resizable=no');
		var param = 'create/post?text=' + title + _br2 + linkUrl;
		var a_store = 'itms-apps://itunes.apple.com/app/id542613198?mt=8';
		var g_store = 'market://details?id=com.nhn.android.band';
		var a_proto = 'bandapp://';
		var g_proto = 'scheme=bandapp;package=com.nhn.android.band';
		
		if(navigator.userAgent.match(/android/i))
		{
			// Android
			setTimeout(function(){ location.href = 'intent://' + param + '#Intent;' + g_proto + ';end'}, 100);
		}
		else if(navigator.userAgent.match(/(iphone)|(ipod)|(ipad)/i))
		{
			// Apple
			setTimeout(function(){ location.href = a_store; }, 200);          
			setTimeout(function(){ location.href = "outlink:"+a_proto + param }, 100);
		}
		else
		{
			alert('이 기능은 모바일에서만 사용할 수 있습니다.');
		}
	} else if(shareTy == "blog") {
		window.open('https://share.naver.com/web/shareView.nhn?url='+ linkUrl + '&title='+title, 'blog', 'width=410, height=540, resizable=no');
	}
}

$(document).ready(function(){
    var swiper = new Swiper("[class*='swipercnt'] .swiper, .donationG_banner .swiper", {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 17,
        centeredSlides: false,
        touchRatio: 1,
        initialSlide: 0,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        pagination: {
            el: ".swiper-pagination",
        },
        a11y: {
            prevSlideMessage : '이전 슬라이드',
            nextSlideMessage : '다음 슬라이드',
            firstSlideMessage : '처음 슬라이드',
            lastSlideMessage : '마지막 슬라이드',
            paginationBulletMessage : '{{index}}번 슬라이드 입니다.',
        },
        on : {
            init : function() {
                updateTabIndex(this);
                if (this.slides.length === 1) {
                    this.autoplay.stop(); // 1개일 때 autoplay 멈춤
                    this.navigation.destroy(); // 네비게이션 제거
                    this.pagination.destroy(); // 페이징 제거
                }
            },
            slideChange : function() {
                updateTabIndex(this);
            }
        },
    });

    // 다중탭
    $(".swiperMulti").each(function () {
        const $this = $(this);
        const swiperName = $this.data("swiper");
        const swiperContainer = $this.find(".swiper")[0];
        const slideCount = $this.find(".swiper-slide").length;
    
        new Swiper(swiperContainer, {
            loop: slideCount > 1,
            slidesPerView: 1,
            spaceBetween: 17,
            centeredSlides: false,
            touchRatio: 1,
            initialSlide: 0,
            watchOverflow: true,
            navigation: {
                nextEl: `.swiper-button-next[data-swiperBtn='${swiperName}']`,
                prevEl: `.swiper-button-prev[data-swiperBtn='${swiperName}']`,
            },
            a11y: {
                prevSlideMessage : '이전 슬라이드',
                nextSlideMessage : '다음 슬라이드',
                firstSlideMessage : '처음 슬라이드',
                lastSlideMessage : '마지막 슬라이드',
                paginationBulletMessage : '{{index}}번 슬라이드 입니다.',
            },
            on : {
                init : function () {
                    updateTabIndex(this);
                },
                slideChange : function() {
                    updateTabIndex(this);
                }
            },
        });
    });
    
    var swiper2 = new Swiper(".timelineSwiper", {
        loop: true,
        pagination: {
            el: ".swiper-pagination",
            type: "fraction",
            renderFraction: function(currentClass, totalClass) {
                return `<span class="${currentClass}"></span> / <span class="${totalClass}"></span>`;
            },
            formatFractionCurrent: function(number) {
                return number < 10 ? '0' + number : number;
            },
            formatFractionTotal: function(number) {
                return number < 10 ? '0' + number : number;
            },
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        autoplay: {
            delay: 3500,
            disableOnInteraction: false,
        },
        a11y: {
            prevSlideMessage : '이전 슬라이드',
            nextSlideMessage : '다음 슬라이드',
            firstSlideMessage : '처음 슬라이드',
            lastSlideMessage : '마지막 슬라이드',
            paginationBulletMessage : '{{index}}번 슬라이드 입니다.',
        },
        on : {
            init : function() {
                updateTabIndex(this);
            },
            slideChange : function() {
                updateTabIndex(this);
            }
        },
    });

    // 봉사원 기본교육 신청방법 모달
    var swiper3 = new Swiper(".swiper_edu .swiper", {
        loop: false,
        slidesPerView: 1,
        spaceBetween: 17,
        centeredSlides: false,
        touchRatio: 1,
        initialSlide: 0,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        pagination: {
            el: ".swiper-pagination",
            clickable : true,
        },
        a11y: {
            prevSlideMessage : '이전 슬라이드',
            nextSlideMessage : '다음 슬라이드',
            firstSlideMessage : '처음 슬라이드',
            lastSlideMessage : '마지막 슬라이드',
            paginationBulletMessage : '{{index}}번 슬라이드 입니다.',
        },
        on : {
            init : function() {
                updateTabIndex(this);
            },
            slideChange : function() {
                updateTabIndex(this);
            }
        },
    });

    // 탭 접근 가능한 슬라이드 제한
    function updateTabIndex(swiper) {
        $(swiper.slides).find('a').attr('tabindex', -1);
        $(swiper.slides[swiper.activeIndex]).find('a').attr('tabindex', 0);
    }

	// ▶/⏸ 버튼 토글 로직
    var isPlaying = true;

    $('#naviBtn').on('click keydown', function (e) {
        if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
    
        if (isPlaying) {
            swiper2.autoplay.stop();
            $(this).removeClass('swiper-button-stop').addClass('swiper-button-play').attr('aria-label','재생');
        } else {
            swiper2.autoplay.start();
            $(this).removeClass('swiper-button-play').addClass('swiper-button-stop').attr('aria-label','정지');
        }
        isPlaying = !isPlaying;
    });
	
    $('.snsBox button.btnShare').click(function() {
        $(this).next().slideToggle(300);

        const $icon = $(this).find('i');
        const $span = $(this).find('span');
        if ($icon.hasClass('ri-share-line')) {
            $icon.removeClass('ri-share-line').addClass('ri-close-large-line');
            $span.text('sns영역 닫기');
        } else {
            $icon.removeClass('ri-close-large-line').addClass('ri-share-line');
            $span.text('공유');
        }
    });
});

// 레드크로스 기빙클럽
$(function() {
    const openTabbox = $('.tabbox_tab li.on > a').data('giving');
    $('.tablist_tab').hide();
    $(`.${openTabbox}`).show();

    const openListbox = $(`.${openTabbox} li.on > a`).data('giving');
    $('.giving_search_tbl .tbl_list1').hide();
    $(`.${openListbox}`).show();

    $('.tabbox_tab a').click(function (e) {
        e.preventDefault();
        const tabbox = $(this).data('giving');
        $('.tablist_tab').hide();
        $(`.${tabbox}`).show();

        const listbox = $(`.${tabbox} li.on > a`).data('giving');
        $('.giving_search_tbl .tbl_list1').hide();
        $(`.${listbox}`).show();
    });

    $('.tablist_tab a').click(function (e) {
        e.preventDefault();
        const listbox = $(this).data('giving');
        $('.giving_search_tbl .tbl_list1').hide();
        $(`.${listbox}`).show();
    });
});

// 맞춤지원 제주도 신청결과
$(document).on("click", "#viewFamilyResult", function() {
	if($(".familyResult").is(":visible")){
        $(".familyResult").hide();
    } else {
        $(".familyResult").show();
    }
});

// 혈액 문의
$(document).on("click", "#viewQna7", function() {
	alert("헌혈 관련 문의는 혈액관리본부 홈페이지에 남겨주시기 바랍니다.");
	window.open("https://www.bloodinfo.net/knrcbs/main.do","_blank");
});