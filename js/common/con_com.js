
/*
참고 : con_com.js
스타일 가이드에서 활용되는 스크립트 모음(예: FAQ, 이미지 확대보기 등), 파일업로드
*/

$(function(){
	bbs_Faq_C();
	
	$(window).on( 'resize', function( ) {
		winW = $(window).width();
		setTimeout(function(){	
			$('ul[class^="tab_st"]').each(function(){
				if($(this).find('li').length > 2){	
					if(winW < 1184){
						$(this).parent('div').addClass('reactTab').removeClass('ov').css('height','0px');	
					}else{
						$(this).parent('div').removeClass('reactTab').css('height','auto');	
					};
				}
			});		
			
		},50);
	}).resize();

});

var check = false;

$(window).resize(function() {
	this.resizeTO = setTimeout(function() {
		$(this).trigger('resizeEnd');
	}, 150 );
}).resize();

$(window).on('resizeEnd', function() {
	$w_w = $(window).innerWidth();
	resetImgZoom();
});

/** 이미지 확대보기 **/
function resetImgZoom(){
	var win_w = $(window).innerWidth();
	var zwObj =  $('.rsp_img');
	
	if(win_w<=768){
		zwObj.each(function(){
			var this_s = $(this);
			var zwObjImg = this_s.children("img");
			var zwObjUrl = zwObjImg.attr("src");

			if(check == false){
				this_s.append("<a href='" + zwObjUrl + "' class='btn-zoom' target='_blank' title='새창열림'><span class='blind'>이미지 확대보기</span></a>");
				zwObjImg.addClass("zoom");
			}
		});
		check = true;
	} else {
		zwObj.each(function(){
			var this_s = $(this);
			var zwObjImg = this_s.children("img");
			if(check == true){
				$(".btn-zoom, .btn-down", $(this).parent()).remove();
				zwObjImg.removeClass("zoom");
			}
		});
		check = false;
	}
}
// FAQ : 컨텐츠용
function bbs_Faq_C() {
	$(document).on("click", ".bbs_FaqA.contents > li > a", function(e) {
		e.preventDefault();

		const $li = $(this).parent('li');
		const $cnt = $li.find('> .cnt');
		const isOpen = $li.hasClass('on');

		if (isOpen){
			$li.removeClass("on");
			$cnt.hide();
			$(this).attr('title','열기');
		} else {
			$li.addClass("on");
			$cnt.show();
			$(this).attr('title','닫기');
		}
	})
	$('.bbs_FaqA.contents li > a').attr('title',"열기");
}

// FAQ : A타입
// function bbs_Faq(){
// 	$('.bbs_FaqA > li > a').off('click');
// 	$('.bbs_FaqA > li > a').on('click' , function(){
// 		var title = $(this).parent('li');
// 		if (title.hasClass('on')){
// 			title.removeClass("on").find('> .cnt').hide();
// 		} else {
// 			$(".bbs_FaqA > li").not(title).removeClass("on");
// 			$(".bbs_FaqA > li > .cnt").hide();
// 			title.addClass("on").find('> .cnt').show();
// 		}
// 		return false;
// 	});
// }

// setTimeout(function(){
// 	$('.bbs_FaqA li > a').attr('title',"열기");
// 	$('.bbs_FaqA li > a').on('click' , function(e){
// 		let title = $(this).attr('title');		
// 		$(this).parent('li').siblings().find('> a').attr('title','열기');
// 		$(this).attr('title',title == '열기'?'닫기':'열기');
// 		e.preventDefault();
// 	});
// }, 500);

// 파일업로드
function fileUploadName(){

	$(document).on('change', ".form-file input[type=file]", function () {
        var fileValue = $(this).val().split("\\");
        var fileName = fileValue[fileValue.length - 1];

        var $formFile = $(this).closest(".form-file");
        $formFile.find(".krds-input").val(fileName);

        $formFile.addClass("on");
        $formFile.find(".btn-delete-input").show();
    });

    // 삭제 버튼 클릭 시 초기화
    $(document).on('click', ".form-file .btn-delete-input", function () {
		const file = $(this).data('file');
		const $self = $(this);
		if(file){
			if(!confirm('삭제하시겠습니까?')) return;
			$.ajax({
				type : "post",
				dataType : "json",
				data : {fileId:file},
				url : "/common/fileDeleteAll.do",
				success : function(result) {
					if (result.resultAt == 'Y') {
						alert('완료했습니다.');
						var $formFile = $self.closest(".form-file");
				        $formFile.find("input[type=text]").val("");
				        $formFile.find("input[type=file]").val("");
				        $self.hide();
				        $formFile.removeClass("on");
					} else if (result.resultAt == 'A') {
						alert("권한이 없습니다.");
					} else if (result.resultAt == 'N') {
						alert("유효하지 않은 요청입니다.");
					} else {
						alert("오류가 발생하였습니다.\n관리자에게 문의하세요.");
					}
				},
				error : function(data) {
					alert("오류가 발생하였습니다.\n관리자에게 문의하세요.");
				}
			});
		}
		else{
			var $formFile = $(this).closest(".form-file");
	        $formFile.find("input[type=text]").val("");
	        $formFile.find("input[type=file]").val("");
	        $(this).hide();
	        $formFile.removeClass("on");
		}
    });
}

$(document).ready(function () {
	fileUploadName();
});

// 패스워드 보기, 숨기기
$(document).on("click",".form-btn-password",function (){
	
    var $button = $(this);
    var $wrap = $button.closest('.btn-ico-wrap');
    var $input = $wrap.find('input');
    var $icon = $button.find('i');
    var $label = $button.find('span');

    var isPassword = $input.attr('type') === 'password';

    $input.attr('type', isPassword ? 'text' : 'password');
    $label.text(isPassword ? '입력한 비밀번호 가리기' : '입력한 비밀번호 보기');

    $icon.toggleClass('ico-pw-visible', !isPassword)
        .toggleClass('ico-pw-visible-on', isPassword);
}) 

// datepicker
let focusClass = '';
$(document).on(
	'focus',
	'#ui-datepicker-div select, #ui-datepicker-div a, #ui-datepicker-div button',
	function () {
		focusClass = this.className.split(' ')[0];
	}
);

$(document).ready(function(){
	//1) 공통 옵션을 한 번만 정의해서 datepicker 기본값으로 설정
	var selOpts = {
		yearRange: "c-100:c+10",
		dateFormat: "yy/mm/dd",
		closeText: "닫기",
		prevText: "이전 달",
		nextText: "다음 달",
		currentText: "오늘",
		monthNames: ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],
		monthNamesShort: ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],
		dayNames: ["일","월","화","수","목","금","토"],
		dayNamesShort: ["일","월","화","수","목","금","토"],
		dayNamesMin: ["일","월","화","수","목","금","토"],
		weekHeader: "Wk",
		firstDay: 0,
		isRTL: false,
		showMonthAfterYear: true,
		showButtonPanel: true,
		changeMonth: true,
		changeYear: true
	};

	// datepicker 전역 기본값 설정
	$.datepicker.setDefaults(selOpts);

	// datepicker 초기화
	$(".selDt").not(".birthDt").datepicker();
	$(".birthDt").datepicker($.extend({}, selOpts, {
			yearRange: "c-100:c",
			maxDate: new Date()
	}));

	// datepicker 열기
	$(".calendar-input > .krds-input + button").on("click", function () {
		var $input = $(this).siblings("input");

		$input.datepicker("show");
		setTimeout(function () {
			$('#ui-datepicker-div')
				.find('a.ui-state-active, a.ui-state-highlight')
				.first()
				.focus();
		}, 0);
	});

	// datepicker : 웹접근성
	$.datepicker.setDefaults($.extend({}, selOpts, {

		beforeShow: function (year, month, inst) {
			setTimeout(function () {
				var $dp = $('#ui-datepicker-div');

				// 캡션
				var selectYear = $dp.find('select.ui-datepicker-year option:selected').text();
				var selectMonth = $dp.find('select.ui-datepicker-month option:selected').text();
				$dp.find('table.ui-datepicker-calendar').prepend(`<caption>${selectYear}년 ${selectMonth} 달력</caption>`);
	
				$dp.attr({
					'role': 'dialog',
					'aria-modal': 'true',
					'aria-label': '날짜 선택 달력'
				});

				// 년 선택
				$dp.find('select.ui-datepicker-year').attr({
					'title': '년 선택',
					'aria-label': '년 선택'
				});

				// 월 선택
				$dp.find('select.ui-datepicker-month').attr({
					'title': '월 선택',
					'aria-label': '월 선택'
				});

				// 이전 달
				$dp.find('.ui-datepicker-prev').attr({
					'title': '이전 달',
					'aria-label': '이전 달',
					'tabindex': '0'
				});
	
				// 다음 달
				$dp.find('.ui-datepicker-next').attr({
					'title': '다음 달',
					'aria-label': '다음 달',
					'tabindex': '0'
				});
	
				// 오늘
				$dp.find('.ui-datepicker-current').attr({
					'title': '오늘 날짜로 이동',
					'aria-label': '오늘 날짜로 이동'
				});
	
				// 닫기
				$dp.find('.ui-datepicker-close').attr({
					'title': '달력 닫기',
					'aria-label': '달력 닫기'
				});
	
				// 선택된 날짜
				$dp.find('.ui-state-active').attr({
					'title': '선택됨',
					'aria-label': '선택됨'
				});
	
				// 오늘 날짜
				$dp.find('.ui-state-highlight').attr({
					'title': '오늘',
					'aria-label': '오늘'
				});
	
				$dp.find('a:not(.ui-state-disabled)').attr('tabindex', '0');
	
				var $active = $dp.find('a.ui-state-active');
				var $today = $dp.find('a.ui-state-highlight');
				var $first = $dp.find('td:not(.ui-datepicker-unselectable) a').first();
	
				if ($active.length) {
					$active.focus();
				} else if ($today.length) {
					$today.focus();
				} else if ($first.length) {
					$first.focus();
				}
			}, 0);
			dateKeyboard();
		},

		onChangeMonthYear: function (year, month, inst) {
			setTimeout(function () {
				var $dp = $('#ui-datepicker-div');

				// 캡션
				var selectYear = $dp.find('select.ui-datepicker-year option:selected').text();
				var selectMonth = $dp.find('select.ui-datepicker-month option:selected').text();
				$dp.find('table.ui-datepicker-calendar').prepend(`<caption>${selectYear}년 ${selectMonth} 달력</caption>`);

				// 이전 달
				$dp.find('.ui-datepicker-prev').attr({
					'title': '이전 달',
					'aria-label': '이전 달',
					'tabindex': '0'
				});
	
				// 다음 달
				$dp.find('.ui-datepicker-next').attr({
					'title': '다음 달',
					'aria-label': '다음 달',
					'tabindex': '0'
				});

				if (focusClass) {
					$('.' + focusClass).focus();
				}
				console.log(focusClass);
				dateKeyboard();
			}, 0);
		},

		onClose: function () {
			$(this).focus();
		}
	}));	
	
	// 달력 내부 키보드 제어
	function dateKeyboard() {
		$(document).on('keydown', '#ui-datepicker-div button, #ui-datepicker-div a', function (e) {
			if (e.key === 'Enter') {
				e.preventDefault();
				this.click();
			}
		});
		$(document).on('keydown', '.datepicker, .hasDatepicker', function (e) {
			if (e.key === 'ArrowDown' || e.key === 'Enter') {
				$(this).datepicker("show");
				setTimeout(function () {
					$('#ui-datepicker-div')
						.find('a.ui-state-active, a.ui-state-highlight')
						.first()
						.focus();
				}, 0);
			}
		});
		$(document).on('keydown', '#ui-datepicker-div', function (e) {
		
			var focusables = $('#ui-datepicker-div')
			.find('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])')
			.filter(':visible');
		
			if (!focusables.length) return;
		
			var first = focusables.first()[0];
			var last  = focusables.last()[0];
		
			// 닫기
			if (e.key === 'Escape') {
				e.preventDefault();
				$.datepicker._hideDatepicker();
				return;
			}
		
			// Tab 이동 제어
			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault();
				last.focus();
			}
			else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault();
				first.focus();
			}
		});
	}
});

$(document).ready(function() {
	// 팝업
	function openPopup() {
		var target = $(this).data('target');
		$('#' + target).fadeIn(300);
	}
	function closePopup() {
		var target = $(this).data('target');
		$('#' + target).fadeOut(300);
	}
	$(document).on('click', '#openPopup', function(e){
		openPopup.call(this);
	});
	$(document).on('click', '.closePopup', function(e){
		closePopup.call(this);
	});
	
	// 드래그
	jQuery('.popupDrag').draggable();
})

// 퀵메뉴
$(function () {
	const quickAside = $('.quickAside');
	const quickArea = quickAside.find('.quickAside_wrap');
	const focusable = quickArea.find('.quickMenu a');
	const quickOpenBtn = quickAside.find('.open_btn');

	// 초기 상태
	if (!quickAside.hasClass('aside-open')) {
		focusable.attr('tabindex', '-1');
		quickArea.attr('aria-hidden', 'true');
		quickOpenBtn.attr('aria-expanded', 'false');
	} else {
		focusable.attr('tabindex', '0');
		quickArea.attr('aria-hidden', 'false');
		quickOpenBtn.attr('aria-expanded', 'true');
	}

	// 닫기
	$(document).on('click', '.quickAside .close_btn', function (e) {
		e.preventDefault();

		quickAside.removeClass('aside-open');
		quickArea.attr('aria-hidden', 'true');
		focusable.attr('tabindex', '-1');

		quickOpenBtn.attr('aria-expanded', 'false').focus();
	});

	// 열기
	$(document).on('click', '.quickAside .open_btn', function (e) {
		e.preventDefault();

		quickAside.addClass('aside-open');
		quickArea.attr('aria-hidden', 'false');
		focusable.attr('tabindex', '0');

		quickOpenBtn.attr('aria-expanded', 'true');

		setTimeout(function () {
			focusable.first().focus();
		}, 0);
	});
});

// 공통 탭
$(document).on("click", "[class*=tab_st] li a", function(){
    const $tabBox = $(this).closest('[class*=tab_st]');
    const listText = $(this)[0].innerText;
	const isTab3 = $tabBox.hasClass('tab_st3');

	if(!isTab3){
    	$tabBox.find('a.select').remove();
    	$tabBox.prepend(`<a href="#" title="선택된 페이지" class="select on">${listText}</a>`);
	}
    $(this).toggleClass("on");

    $tabBox.find("li").removeClass("on");
    $tabBox.find("a").removeAttr("title");

    $(this).parent().addClass("on");
    $(this).attr("title", "선택된 페이지");

	if (!isTab3 && winW <= 768) {
		$(this).closest('[class*=tab_st]').find('a.select').next('ul').slideUp(200);
		$(this).closest('[class*=tab_st]').find('a.select').toggleClass("on");
	}
});
$(document).on("click", "[class*=tab_st]:not(.tab_st3) a.select", function(e) {
    e.preventDefault();
    const $ul = $(this).next("ul");
    
    $ul.stop(true, true).slideToggle(200);
    $(this).toggleClass("on");
});
$(window).on("load", function() {
    $("[class*=tab_st]:not(.tab_st3)").each(function() {
        const $onTab = $(this).find("li.on a");
        if ($onTab.length) {
            const listText = $onTab[0].innerText;
            $onTab.attr("title", "선택된 페이지");
            $(this).find('a.select').remove();
            $(this).prepend(`<a href="#" title="선택된 페이지" class="select">${listText}</a>`);
        }
    });
    updateTab();
});
$(window).on("resize", function () {
    updateTab();
});
function updateTab() {
    const winW = window.innerWidth || document.documentElement.clientWidth;

    $("[class*=tab_st]:not(.tab_st3)").each(function () {
        const $tabBox = $(this);
        const $select = $tabBox.find("a.select");
        const $ul = $tabBox.find("ul");

        if (winW <= 768) {
            $select.css("display","flex");
            if (!$select.hasClass("on")) {
                $ul.hide();
            }
        } else {
            $select.hide();
            $ul.show();
        }
    });
}