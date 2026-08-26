// 탭리스트
$(window).on( 'resize', function( ) {
	winW = $(window).outerWidth();
	setTimeout(function(){
		$('.tab_list ul').each(function(){
			if(winW <= 1024){
				$(this).removeAttr('style').parent('div').addClass('reactTab').removeClass('ov');
			}else{
				$(this).removeAttr('style').parent('div').removeClass('reactTab');
			};
		});

	},50);
}).resize();

$('.tab_list ul').each(function(){
	var $eleSelect = $(this).find('> a.select');
	if(typeof(eleSelect)!="undefined"){
		return;
	}
	
	var $link = $(this).find('> li.on > a');
	var $linkCopy = $link.addClass('select').clone();

	$link.attr('title','선택됨');
	$(this).before($linkCopy);
});

$(document).on('click', '.reactTab > a.select', function(e){		
	var $reactTab = $(this).parents('.reactTab').find('ul');
		$tabBox = $(this).parents('.reactTab');
		ulHeight = $reactTab.innerHeight();
		onHeight = $(this).parents('li').height();

	if($tabBox.hasClass('ov')){
		$tabBox.removeClass('ov');
		$reactTab.slideUp();
	}else{
		$tabBox.addClass('ov');
		$reactTab.slideDown();
	}
	e.preventDefault();
});

$(document).ready(function(){
	var swiper = new Swiper(".bbsG_swiper_thum .bbsG_swiper_wrap", {
		// loop: true,
		slidesPerView: 3,
		spaceBetween: 10,
		freeMode: true,
		watchSlidesProgress: true,
		breakpoints: {
			560: {
				slidesPerView: 4,
				spaceBetween: 20
			},
			1024: {
				slidesPerView: 5,
				spaceBetween: 40
			}
		}
	});
	var swiper2 = new Swiper(".bbsG_swiper_main", {
		// loop: true,
		spaceBetween: 10,
		navigation: {
			nextEl: ".bbsG_swiper_btn .swiper-button-next",
			prevEl: ".bbsG_swiper_btn .swiper-button-prev",
		},
		thumbs: {
			swiper: swiper,
		},
	});
})

// textarea 글자수체크
$(document).on("input", ".textarea-wrap textarea", function () {
    const textLength = $(this).val().length;
    $(this).closest(".form-group").find(".count-now").text(textLength);
});