
$(document).ready(function(){
    
    // 메뉴 타이틀 체크 ( 메뉴가 없는 경우 왼쪽 메뉴 갱신 )
//    if($("#sideContent h1").children().length == 0){
    if($("#sideContent h1").length == 0){
        $('#sideContent').append("<h1>"+$('#pageTitle').text()+"</h1>");
        $('#location').html("");
    }
    
    //csrfToken 세팅
    var tokenValue = $("meta[name='csrfToken']").attr("content");
    var paramName = $("meta[name='csrfParamNm']").attr("content");
    if (tokenValue && paramName) {
        //화면 내 전체 form에 토큰 세팅
        $("form").each(function() {
            if ($(this).find("input[name='" + paramName + "']").length > 0) {
                return;
            }
            
            var hiddenInputHtml = '<input type="hidden" name="' + paramName + '" value="' + tokenValue + '">';
            $(this).append(hiddenInputHtml);
        });
        
        //ajax에 토큰 헤더 세팅
        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                if (!this.crossDomain && tokenValue) { 
                    xhr.setRequestHeader("X-CSRF-TOKEN", tokenValue);
                }
            }
        });
    }
});

/* function valueEmpty */
jQuery.fn.valueEmpty = function() {
    if (jQuery.trim(jQuery(this).val()).length < 1 ) {
        return true;
    } else {
        return false;
    }
};

/* function number and comma */
function numComma(data){
    if (jQuery.trim(data).length > 3 ) {
        var returnValue = "";
        var commaValue = ""+data;
        for(idx=commaValue.length-1,chk=0;idx>=0;idx--,chk++){
            if(chk == 3){
                chk=0;
                returnValue = commaValue.substr(idx,1) + "," + returnValue;
            } else {
                returnValue = commaValue.substr(idx,1) + returnValue;
            }
        }
        return returnValue;
    } else {
        return data;
    }
}

$(function () {
    /* function onlyNumber */
    $(document).on('keyup', ".onylNum", function(){
        
        let value = $(this).val();
        const reg = /^[0-9]+$/;
        if(value !=""){
            if(!reg.test(value)){
            $(this).val(value.replace(/[^0-9]/g,""));
            alert("숫자만 입력해주시기 바랍니다.");
            return false;
        }
        //$(this).val($(this).val().replace(/[^0-9]/g,""));
        }
        
    });
    
    // 전화번호 포맷
    function formatTelno(el) {
        let num = $(el).val().replace(/[^0-9]/g, ""); // 숫자만 남김
        let result = "";
        
        if (num.length <= 4) {
            result = num;
        } else if (num.startsWith('02')) { // 서울(02) 번호 처리
            if (num.length < 6) { 
                result = num.replace(/(\d{2})(\d+)/, '$1-$2');
            } else if (num.length < 10) {
                result = num.replace(/(\d{2})(\d{3})(\d+)/, '$1-$2-$3');
            } else {
                result = num.substring(0, 10).replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
            }
        } else {
            // 그 외 번호 (휴대폰, 지역번호) 처리
            if (num.length < 7) {
                result = num.replace(/(\d{3})(\d+)/, '$1-$2');
            } else if (num.length < 11) { 
                result = num.replace(/(\d{3})(\d{3})(\d+)/, '$1-$2-$3');
            } else {
                result = num.substring(0, 11).replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
            }
        }

        $(el).val(result);
    }
    
    $(document).on('change focusout', '.telnoFormat', function(){
        formatTelno(this);
    });
    
    $(document).on('focus', '.telnoFormat', function(){
        $(this).val($(this).val().replaceAll('-', ''));
    });
    
    $('.telnoFormat').each(function(){
        formatTelno(this);
    });
    
    // 숫자 제한
    $(document).on('input', '.numBound', function(){
        const min = Number(this.min);
        const max = Number(this.max);
        const val = Number(this.value.replace(/[^0-9]/g, ''));
        var resultVal = 0;
        
        if(isNaN(val)){
            this.value = 0;
            return;
        }
        
        if(val < min){
            resultVal = min;
        }
        else if(val > max){
            resultVal = max;
        }
        else{
            resultVal = val;
        }
        
        if($(this).hasClass('numFormat')){
            // 값에 , 추가
            resultVal = (resultVal+'').replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
        }
        
        this.value = resultVal;
    });
    
    $('.numFormat').each((i, v)=>{
        var inputVal = $(v).val().replace(/[^0-9]/g, '');
        var fmInputVal = inputVal.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
        $(v).val(fmInputVal);
    });
    
    // 최대 길이 넘을경우 다음 input 값으로 포커스 이동
    $(document).on('input', ".inptNext", function(){
      let idx = $(".inptNext").index(this);
      const maxLength = $(this).prop('maxlength');
      const currentLength = $(this).val().length;
      if (currentLength >= maxLength) {
        const next = $(".inptNext").eq(idx+1);
        if (next.length) {
            next.val("");
              next.focus();
        }
      }
    });

})


//파일 다운로드
function mfn_fileDownload(fileKey){
    if(fileKey != "" || fileKey == null){
        location.href="/common/fileDownload.do?fileKey="+fileKey;    
    }
};

// 인쇄
$(function() {
    $(document).on("click", ".btnPrint", function(e){
        e.preventDefault();
        if ($(this).data('printing')) return;
        $(this).data('printing', true);
        window.print();
    });
    
    // 재인쇄
    $(window).on('afterprint', function () {
        setTimeout(function () {
            $('.btnPrint').removeData('printing');
        }, 0);
    });
})


// 메뉴 접근 권한 체크
function menuAccessCheck(mi, sysId){
    var url = "/" + sysId + "/mn/menu/menuAccess.do";

    console.log("menuAccessCheck start");
    console.log("url =", url);
    console.log("mi =", mi);
    console.log("sysId =", sysId);

    $.ajax({
        type : "post",
        url : url,
        data : {
            menuId : mi
        },
        dataType : "json",
        beforeSend : function(xhr, settings) {
            console.log("beforeSend");
            console.log("ajax url =", settings.url);
            console.log("ajax data =", settings.data);
        },
        success : function(data, textStatus, xhr) {
            console.log("success called");
            console.log("data =", data);
            console.log("textStatus =", textStatus);
            console.log("responseText =", xhr.responseText);

            var accessVal = JSON.parse(data.accessVal);
            var accessUrl = JSON.parse(data.menuUrl);
            var npagYn = JSON.parse(data.npagYn);

            console.log("accessVal =", accessVal);
            console.log("accessUrl =", accessUrl);
            console.log("npagYn =", npagYn);

            if (accessVal == "Y") {
                if (!accessUrl) {
                    alert("이동할 메뉴 주소가 없습니다.");
                    return false;
                }

                if (npagYn == "Y") {
                    window.open(accessUrl, "_blank");
                } else {
                    location.href = accessUrl;
                }
            } else if (accessVal == "U" || accessVal == "AU") {
                alert("로그인이 필요한 서비스입니다.\n로그인 후 이용해 주세요.");
                return false;
            } else {
                alert("접근 권한이 없습니다.");
                return false;
            }
        },
        error : function(xhr, status, error) {
            console.log("error called");
            console.log("status =", status);
            console.log("error =", error);
            console.log("responseText =", xhr.responseText);
            alert("오류가 발생하였습니다.\n관리자에게 문의하세요.");
        },
        complete : function(xhr, status) {
            console.log("complete called");
            console.log("complete status =", status);
            console.log("complete responseText =", xhr.responseText);
        }
    });
}

//팝업 쿠키 저장
function setCookie(cookieName, value){
    var exdays = 1;
    var exdate = new Date();
    var day = exdate.getDate() * 1;
    exdate.setDate(day + exdays);
//    var cookieValue = escape(value) + ((exdays==null) ? "" : "; expires=" + exdate.toGMTString());
    var cookieValue = escape(value) + ((exdays==null) ? "" : "; expires=" + exdate.toUTCString()); 
    document.cookie = cookieName + "=" + cookieValue;
}

// 쿠키조회
function getCookie(cookieName) {
    cookieName = cookieName + '=';
    var cookieData = document.cookie;
    var start = cookieData.indexOf(cookieName);
    var cookieValue = '';
    if(start != -1){
        start += cookieName.length;
        var end = cookieData.indexOf(';', start);
        if(end == -1)end = cookieData.length;
        cookieValue = cookieData.substring(start, end);
    }
    return unescape(cookieValue);
}

// 팝업 닫기(쿠키설정)
$(document).on('click', '.popupCookieSet', function() {
    var popValue = $(this).attr("data-seq");
    var cookieNM = "popCookie"+popValue;
    
//    setCookie(cookieNM, "hide", "1");
    setCookie(cookieNM, "hide");
    $("#popupNormal"+popValue).parent().remove();
});

// 작업 사유 팝업 : 작업 사유를 추하는 작업에 #histRsn 추가 필요
function histRsnPopupFormId(authYn, formId, callback){
    if(authYn == "Y") {
        var content = ""; 
        content +="<div class='bbs_WriteA'>"
        content +="<table class='detail_tb'>"
        content +="        <colgroup>"
        content +="            <col style='width: 30%'>"
        content +="            <col style='width: 70%'>"
        content +="        </colgroup>"
        content +="        <tbody>"
        content +="            <tr>"
        content +="                <th>작업 사유</th>"
        content +="                <td><textarea id='histRsnText' name='histRsnText' rows='3' cols='' class='InpSel_w100' maxlength='1000' ></textarea></td>"
        content +="            </tr>"
        content +="        </tbody>"
        content +="    </table>"
        content +="</div>";
        $.confirm({
            title : '<h3 class="tit1">작업 사유 입력<h3>',
            boxWidth : '50%',
            useBootstrap : false,
            content : content,
                buttons : {
                    formSubmit : {
                    text : '다운로드',
                    btnClass : 'btn-blue',
                    action : function () {
                        if ($("#histRsnText").valueEmpty()) {
                            alert("작업 사유를 입력해주세요.");
                            $("#histRsnText").focus();
                            return false;
                        }
                        $("#" + formId + " #histRsn").val($("#histRsnText").val());
                        if($("#" + formId + " #histRsn").length > 0){
                            createParamNm(formId);
                        }
                        callback();
                        removeParamNm();
                    }
                },
                close : {
                    text: '취소',
                    btnClass: 'btn-dark popClose'
                }
            },
        });
    } else {
        alert("개인정보 다운로드 권한이 없습니다.");
        return false;
    }
}

// 작업 사유 팝업 : 작업 사유를 추하는 작업에 #histRsn 추가 필요
function histRsnPopup(authYn, callback){
    if(authYn == "Y") {
        var content = ""; 
        content +="<div class='bbs_WriteA'>"
        content +="<table class='detail_tb'>"
        content +="        <colgroup>"
        content +="            <col style='width: 30%'>"
        content +="            <col style='width: 70%'>"
        content +="        </colgroup>"
        content +="        <tbody>"
        content +="            <tr>"
        content +="                <th>작업 사유</th>"
        content +="                <td><textarea id='histRsnText' name='histRsnText' rows='3' cols='' class='InpSel_w100' maxlength='1000' ></textarea></td>"
        content +="            </tr>"
        content +="        </tbody>"
        content +="    </table>"
        content +="</div>";
        $.confirm({
            title : '<h3 class="tit1">작업 사유 입력<h3>',
            boxWidth : '50%',
            useBootstrap : false,
            content : content,
                buttons : {
                    formSubmit : {
                    text : '다운로드',
                    btnClass : 'btn-blue',
                    action : function () {
                        if ($("#histRsnText").valueEmpty()) {
                            alert("작업 사유를 입력해주세요.");
                            $("#histRsnText").focus();
                            return false;
                        }
                        $("#histRsn").val($("#histRsnText").val());
                        if($("#histRsn").length > 0){
                            // select 파라미터명 자동 생성
                            var formId = $("#histRsn").closest('form').attr('id');
                            createParamNm(formId);
                        }
                        callback();
                        removeParamNm();
                    }
                },
                close : {
                    text: '취소',
                    btnClass: 'btn-dark popClose'
                }
            },
        });
    } else {
        alert("개인정보 다운로드 권한이 없습니다.");
        return false;
    }
}

// 작업 사유 팝업 : 작업 사유를 추하는 작업에 #histRsn 추가 필요
function histRsnPopup(authYn, callback, encalert){
    if(authYn == "Y") {
        var content = ""; 
        content +="<div class='bbs_WriteA'>"
        content +="<table class='detail_tb'>"
        content +="        <colgroup>"
        content +="            <col style='width: 30%'>"
        content +="            <col style='width: 70%'>"
        content +="        </colgroup>"
        content +="        <tbody>"
        content +="            <tr>"
        content +="                <th>작업 사유</th>"
        content +="                <td><textarea id='histRsnText' name='histRsnText' rows='3' cols='' class='InpSel_w100' maxlength='1000' ></textarea></td>"
        content +="            </tr>"
        content +="        </tbody>"
        content +="    </table>"
        content +="</div>";
        $.confirm({
            title : '<h3 class="tit1">작업 사유 입력<h3>',
            boxWidth : '50%',
            useBootstrap : false,
            content : content,
                buttons : {
                    formSubmit : {
                    text : '다운로드',
                    btnClass : 'btn-blue',
                    action : function () {
                        if ($("#histRsnText").valueEmpty()) {
                            alert("작업 사유를 입력해주세요.");
                            $("#histRsnText").focus();
                            return false;
                        }
                        
                        if(encalert == "Y"){
                            alert("엑셀파일의 암호는 사용자 직번입니다.");
                        }
                        
                        $("#histRsn").val($("#histRsnText").val());
                        if($("#histRsn").length > 0){
                            // select 파라미터명 자동 생성
                            var formId = $("#histRsn").closest('form').attr('id');
                            createParamNm(formId);
                        }
                        callback();
                        removeParamNm();
                    }
                },
                close : {
                    text: '취소',
                    btnClass: 'btn-dark popClose'
                }
            },
        });
    } else {
        alert("개인정보 다운로드 권한이 없습니다.");
        return false;
    }
}

// 검색 select 파라미터 텍스트 input 생성 (이력 추가 시 사용)
function createParamNm(formId){
    if(!formId) return;
    removeParamNm();
    $('#'+formId).append('<div class="hid" id="paramNmDiv">')
    $('#'+formId+' select').each((i, v)=>{
        var selected = $(v).find('option:selected');
        var txt = selected.text().trim();
        if(!selected.val()) txt = "";
        var nm = $(v).attr('name');
        $('#paramNmDiv').append('<input type="hidden" name="'+nm+'PNm" value="'+txt+'">');
    });
}
function removeParamNm(){
    $('#paramNmDiv').remove();
}


// 필수값 체크 함수
var validationExc = function(Ty){
    
    if(Ty.indexOf(",")){
        Ty = Ty.split(",");
    }
    
    var chk = true;
    $.each(Ty, function(index, val){
        var title = $(Ty[index]).attr("title");
        var type = $(Ty[index]).attr("type");
        if(type == "checkbox"){
        var name = $(Ty[index]).attr("name");
            if(!$('input:checkbox[name='+name+']').is(":checked")){
                alert(title+"을(를) 입력해주세요.");
                $(Ty[index]).focus();
                chk = false;
                return false;
            }
        }
        
        if(!$(Ty[index]).val())
        {
            alert(title+"을(를) 입력해주세요.");
            $(Ty[index]).focus();
            chk = false;
            return false;
        }
    });
    return chk;
}

// google
window.onload = function(){
    $('.goog-te-combo').attr("title","ì¸ì´ ì í"); 
}     

$(function(){
    $(document).ajaxSend(function(event, jqXHR, options) {
        // 1. 데이터가 문자열(Query String)인 경우 (예: "name= value &age= 20 ")
        if (typeof options.data === "string") {
            options.data = options.data.split('&').map(function(pair) {
                var parts = pair.split('=');
                if (parts.length === 2) {
                    // 값 부분의 공백을 제거하고 다시 조립
                    var val = parts[1].replace(/\+/g, ' ');
                    val = decodeURIComponent(val);
                    val = val.trim();
                    return parts[0] + '=' + encodeURIComponent(val);
                }
                return pair;
            }).join('&');
        } 
        
        // 2. 데이터가 객체(Object)인 경우
        else if (typeof options.data === "object" && !(options.data instanceof FormData)) {
            $.each(options.data, function(key, value) {
                if (typeof value === "string") {
                    options.data[key] = $.trim(value);
                }
            });
        }
    
        // 3. FormData인 경우 (파일 업로드 등이 포함된 ajaxSubmit 시 주로 발생)
        else if (options.data instanceof FormData) {
            var newData = new FormData();
            options.data.forEach(function(value, key) {
                if (typeof value === "string") {
                    newData.append(key, value.trim());
                } else {
                    newData.append(key, value);
                }
            });
            options.data = newData;
        }
    });
    
    // 텍스트를 trim처리
    $(document).on('submit', 'form', function(){
        $('input[type=text], input[type=search]').each((i, v)=>{
            $(v).val($(v).val().trim());
        });
    });
    $(document).on('focusout', 'input[type=text], input[type=search]', function(){
        $(this).val($(this).val().trim());
    });
    $(document).on('keydown', 'input[type=text], input[type=search]', function(e){
        if(e.keyCode == 13){
            $(this).val($(this).val().trim());
        }
    });
});

/* <![CDATA[ */
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('6 7(a,b){n{4(2.9){3 c=2.9("o");c.p(b,f,f);a.q(c)}g{3 c=2.r();a.s(\'t\'+b,c)}}u(e){}}6 h(a){4(a.8)a=a.8;4(a==\'\')v;3 b=a.w(\'|\')[1];3 c;3 d=2.x(\'y\');z(3 i=0;i<d.5;i++)4(d[i].A==\'B-C-D\')c=d[i];4(2.j(\'k\')==E||2.j(\'k\').l.5==0||c.5==0||c.l.5==0){F(6(){h(a)},G)}g{c.8=b;7(c,\'m\');7(c,\'m\')}}',43,43,'||document|var|if|length|function|GTranslateFireEvent|value|createEvent||||||true|else|doGTranslate||getElementById|google_translate_element2|innerHTML|change|try|HTMLEvents|initEvent|dispatchEvent|createEventObject|fireEvent|on|catch|return|split|getElementsByTagName|select|for|className|goog|te|combo|null|setTimeout|500'.split('|'),0,{}))
/* ]]> */