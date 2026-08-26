// 필수입력오류체크
function cmnErrCertChk(reqForm, reqName, reqFoucs)
{
    if(reqForm.value == "")
    {
        alert(reqName +" 입력해주세요");
        reqForm.value = "";
        if(reqForm != null && reqFoucs != "N")
            reqForm.focus();
        return false;
    }
    return true;
}

// 숫자입력오류체크
function numErrChk(reqForm, reqMsg)
{
    if(isNaN(reqForm.value) || reqForm.value=="")
    {
        if(reqMsg == null ) reqMsg = "";
        alert(reqMsg+"숫자만 입력할수 있습니다");
        reqForm.value = "0";
        reqForm.focus();
        return false;
    }
    return true;
}

// 영문유효성체크
function engErrChk(reqForm, reqMsg)
{
    var eng_check = /^[a-zA-Z]+$/;

    if(!eng_check.test(reqForm.value) )
    {
        if(reqMsg == null ) reqMsg = "";
        alert(reqMsg+"영문만 입력할 수 있습니다.");
        
        return false;
    }
    return true;
}
    
function CheckEMail (emailStr) 
{  
    // 전자메일 패턴. 사용자이름@도메인 의 형식을 검사함  
    var emailPat=/^(.+)@(.+)$/;
    // 포함되지 말아야할 특수문자들 ( ) < > @ , ; : \ " . [ ]  
    var specialChars="\\(\\)<>@,;:\\\\\\\"\\.\\[\\]";  
    // 포함될 수 있는 특수문자들 (나머지)  
    var validChars="\[^\\s" + specialChars + "\]";  
    // 아래의 경우는 사용자 이름에 따옴표가 있는 경우. RFC표준사항임  
    var quotedUser="(\"[^\"]*\")"; 
    // 도메인 대신 IP를 사용할 수있음  
    // 예를 들어 laday@[210.120.253.10]은 올바른 메일 주소 "[", "]"이 반드시 필요 
    var ipDomainPat=/^\[(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\]$/;  
    // 기본적인 아토믹에 해당됨  
    var atom=validChars + '+';  
    // 사용자로 사용될 수 있는 문자를 나타냄  
    var word="(" + atom + "|" + quotedUser + ")";  
    // 사용자의 패턴을 나타냄. 위의 워드가 .단위로 여러개 올 수있음  
    var userPat=new RegExp("^" + word + "(\\." + word + ")*$");  
    // 아래의 것은 일반적인 도메인 패턴에 해당됨  
    var domainPat=new RegExp("^" + atom + "(\\." + atom +")*$");  
    // @을 기준으로 사용자와 도메인으로 나눔. 편의를 위함  
    var matchArray=emailStr.match(emailPat);  
    if (matchArray==null) 
    {    
    // 두개 이상 또는 @이 아예 없는 경우   
        alert("메일주소 형식이 잘못되어 있습니다 (공백 및 @과 .을 확인해 보세요)");    
        return false; 
    }  
    var user=matchArray[1];  
    var domain=matchArray[2];  
    // 사용자 부분이 제대로 되었는지 검사  
    if (user.match(userPat)==null) 
    {    
        alert("메일 아이디가 올바르지 않습니다");    
        return false;  
    } 
    // 도메인 부분이 IP로 되어 있는 경우 
    var IPArray=domain.match(ipDomainPat);  
    if (IPArray!=null) 
    {    
        for (var i=1;i<=4;i++) 
        {      
            if (IPArray[i]>255) 
            {        
                alert("IP 주소 형식이 올바르지 않습니다");        
                return false;      
            }    
        }    
        return true;  
    }  
    // 도메인 이름이 심볼릭 네임인 경우 올바르지 않음  
    var domainArray=domain.match(domainPat);  
    if (domainArray==null) 
    {    
        alert("도메인 형식이 올바르지 않습니다");   
        return false; 
    }  
    // 도메인 형식 검사에 통과했더라도, 마지막 세개 또는 두개의 문자(com, net, kr등등)  
    // 까지 올바른지 검사. 최상위 도메인은 반드시 세글자 아니면 두 글자임  
    var atomPat=new RegExp(atom,"g");  
    var domArr=domain.match(atomPat);  
    var len=domArr.length;  
    if (domArr[domArr.length-1].length<2 ||    domArr[domArr.length-1].length>3) 
    {    
        alert("도메인 주소의 마지막 필드는 반드시 세글자 도메인 또는 두글자 나라이어야 합니다.");    
        return false; 
    }  
    // 호스트이름이 있는지 검사  
    if (len<2) 
    {    
        alert("호스트 이름이 존재하지 않습니다. 호스트 이름은 반드시 2글자 이상이어야 합니다");    
        return false;  
    }  
    
    return true;
}

function checkTelno(name){
    const telRegx = /^(0\d{1,2})-?\d{3,4}-?\d{4}$/;
    const $telno = $('input[name='+name+']');
    
    if($telno.length > 1){
        const result = true;
        $telno.each((i,v)=>{
            if(!telRegx.test(v.value)){
                alert(v.title+'(을/를) 제대로 입력해 주세요.');
                $(v).focus();
                result = false;
                return false;
            }
        });
        
        return result;
    }
    else if($telno.length == 1){
        if(!telRegx.test($telno.val())){
            alert($telno.attr('title')+'(을/를) 제대로 입력해 주세요.');
            $telno.focus();
            return false;
        }
        
        return true;
    }
    return true;
}

function checkEmail(str){
    const regx = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    return regx.test(str);
}

// 2025.04.28 필수값 체크(공통)
function validation(){
    
    let tag = "";
    let type = "";
    let title = "";
    let isElement = ""; 
    let isValid = false;
    $(".validCheck:visible").each(function() {
        isValid = false;
        tag = $(this).prop("tagName").toLowerCase();
        title = $(this).prop("title");
        isElement = $(this);
        
        if(tag == "input"){    
            type = $(this).prop("type").toLowerCase();
            if (type == 'checkbox' || type == 'radio') {
                let isName = $(isElement).prop("name");
                if($('input[name='+isName+']:checked').length == 0){
                    isValid = true;
                    return false;
                }
                
            } else {
                if($(this).val().trim() == ""){
                    isValid = true;
                    return false;
                }
            }
        } else if (tag == 'select') {
            if($(this).val().trim() == "" || $(this).val() == null ){
                isValid = true;
                return false;
            }
        } else if(tag == 'textarea') {
            if($(this).val().trim() == "" || $(this).val() == null ){
                isValid = true;
                return false;
            }
        }
        
    })
    
    if(isValid){
        if(tag == "select" || (tag == "input" && type == "checkbox" || type == "radio")){
            alert(title+"을(를) 선택해주세요.");
        } else {
            alert(title+"을(를) 입력 해주세요.");
        }
        $(isElement).focus();
    }
    return isValid;
}

// 이름 마스킹 처리
function comMask(value, type) {
  if (!value) return '';
  
  // 이름
  if(type == "name"){
      const length = value.length;
      if (length === 2) {
        return value[0] + '*';
      } else if (length === 3) {
        return value[0] + '*' + value[2];
      } else if (length > 3) {
        return value[0] + '*'.repeat(length - 2) + value[length - 1];
      } else {
        return '*';
      }
  // 전화번호
  } else if(type == "tel"){
      // 숫자만 추출
      const cleaned = value.replace(/[^0-9]/g, '');
    
      if (cleaned.length === 11) {
        // 예: 01012345678 → 010-****-5678
        return cleaned.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-****-$3');
      } else if (cleaned.length === 10) {
        // 예: 0212345678 → 02-****-5678
        return cleaned.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, '$1-***-$3');
      } else {
        return value; // 형식이 이상할 경우 원본 그대로
      }
  }
}

// 휴대폰 번호 입력시
$(document).on("input", "input[name='redcrMbrTelno'], input[name='prntTelno'], input[name='htelno'], .telVld", function() {
    let num = $(this).val().replace(/[^0-9]/g, ''); // 숫자만 남기기

    if(num.length == 11 ) {
        // 휴대폰 번호 11자리
        num = num.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    }

    $(this).val(num);
});

// 전화번호 번호 입력시
$(document).on("input", "input[name='rprsTelno'], .homeTelVld", function() {
    let num = $(this).val().replace(/[^0-9]/g, ''); // 숫자만 남기기
    if(num.length == 9) {
        num = num.replace(/^(\d{2})(\d{3})(\d{4})$/, "$1-$2-$3");
    } else if(num.length == 10) {
        // 지역번호 등 10자리
        num = num.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, "$1-$2-$3");
    } else if(num.length == 11) {
        num = num.replace(/^(\d{3})(\d{4})(\d{4})$/, "$1-$2-$3");
    }

    $(this).val(num);
});

$(document).on("input", "input[name='mbrBrno']", function () {
  // 숫자만 남기기
  let value = $(this).val().replace(/[^0-9]/g, '');

  // 3-2-5 형식으로 자동 하이픈 추가
  if (value.length > 3 && value.length <= 5) {
    value = value.replace(/(\d{3})(\d+)/, "$1-$2");
  } else if (value.length > 5) {
    value = value.replace(/(\d{3})(\d{2})(\d+)/, "$1-$2-$3");
  }

  $(this).val(value);
});


function onNextFocus(nextID){
    if (event.keyCode == 13) {
        $("#"+nextID).focus(); 
    }
}

function onNextFunc(nextFunc){
    if (event.keyCode == 13) {
        eval(""+nextFunc);
    }
}

function fnCancel(){
    history.back(-2);
}

function fnUrlCancel(url){
    location.href = url;
}

function fnTextareaPrint(fnNttCn){
    fnNttCn = fnNttCn.split("\u0020").join("&nbsp;");
    fnNttCn = fnNttCn.split("\r\n").join("<br/>");
    fnNttCn = fnNttCn.split("\n").join("<br/>");
    return fnNttCn;
}

function fnReplaceAll(val,beforeVal,afterVal){
    fnNttCn = val.split(beforeVal).join(afterVal);
    return fnNttCn;
}

function fnSplit(val,splitVal){
    arrayVal = val.split(splitVal);
    return arrayVal;
}

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

function setCookie(cookieName, value, date){
    var cookieValue = escape(value) + ((date==null) ? "" : "; expires=" + date.toGMTString());
    document.cookie = cookieName + "=" + cookieValue;
}

// 아이핀 인증
function ipinCert(){

    // 화면의 중앙 위치 계산
    var popupWidth = 420; // 팝업 창 너비
    var popupHeight = 800; // 팝업 창 높이

    // 현재 브라우저 창의 위치와 크기 가져오기
    var browserLeft = window.screenX; // 브라우저 창의 왼쪽 좌표
    var browserTop = window.screenY; // 브라우저 창의 위쪽 좌표
    var browserWidth = window.outerWidth; // 브라우저 창의 너비
    var browserHeight = window.outerHeight; // 브라우저 창의 높이

    // 팝업 창 위치 계산 (브라우저 창 중앙)
    var left = browserLeft + (browserWidth - popupWidth) / 2;
    var top = browserTop + (browserHeight - popupHeight) / 2;

    // 팝업 옵션 설정
    var winopts = 'width='+popupWidth+',height='+popupHeight+',resizable=0,scrollbars=no,status=0,titlebar=0,toolbar=0,left='+left+',top='+top;
    
    $(".close-modal").click();
    
    window.open('', 'popupIPIN2', winopts );
    document.form_ipin.target = "popupIPIN2";
    document.form_ipin.action = "https://cert.vno.co.kr/ipin.cb";
    document.form_ipin.submit();
}

// 휴대폰 인증 (추가 입력값) 
function fnPopup(data){
    
    if (data!=null){
        $("#param1").val(data.param1);
        $("#param2").val(data.param2);
        $("#param3").val(data.param3);
    }

    $(".close-modal").click();

    document.form_chk.action = "https://nice.checkplus.co.kr/CheckPlusSafeModel/checkplus.cb";
    document.form_chk.target = "popupChk";
    document.form_chk.submit();
}

// 휴대폰 인증 (추가 입력값) 
function fnNiceId(data){
    var url = $("#niceIdUrl").val();
    if (data!=null){
        $("#param1").val(data.param1);
        $("#param2").val(data.param2);
        $("#param3").val(data.param3);
    } else {
        $("#param1").val("");
        $("#param2").val("");
        $("#param3").val("");        
    }

    $(".close-modal").click();

    document.form_chk.action = url;
    document.form_chk.target = "popupChk";
    document.form_chk.submit();
}

function certPopup(){
    // 화면의 중앙 위치 계산
    var popupWidth = 420; // 팝업 창 너비
    var popupHeight = 800; // 팝업 창 높이

    // 현재 브라우저 창의 위치와 크기 가져오기
    var browserLeft = window.screenX; // 브라우저 창의 왼쪽 좌표
    var browserTop = window.screenY; // 브라우저 창의 위쪽 좌표
    var browserWidth = window.outerWidth; // 브라우저 창의 너비
    var browserHeight = window.outerHeight; // 브라우저 창의 높이

    // 팝업 창 위치 계산 (브라우저 창 중앙)
    var left = browserLeft + (browserWidth - popupWidth) / 2;
    var top = browserTop + (browserHeight - popupHeight) / 2;

    // 팝업 옵션 설정
    var winopts = 'width='+popupWidth+',height='+popupHeight+',fullscreen=no, menubar=no, status=no,  titlebar=yes,location=no,toolbar=no,  scrollbar=no,left='+left+',top='+top;
    
    var myWindow = window.open('', 'popupChk', winopts);
    
    if (!myWindow) {
        alert("팝업이 차단되었습니다. 브라우저 설정에서 팝업을 허용해 주세요.");
        return;
    }

    return myWindow;
}

// rss
function rssFeed(meintext){
    if (window.clipboardData) {
        window.clipboardData.setData("Text", meintext);
        alert("아래주소가 클립보드에 복사되었습니다. Ctrl+V로 붙여넣기해서 사용하세요.\n" + meintext);
    }else {
        temp = prompt("Ctrl+C를 눌러 클립보드로 복사하세요", meintext );
    }
}

function checkDate(dateString) {
  // 정규식을 사용해 기본 형식(YYYY/MM/DD)이 맞는지 검사
  const regex = /^\d{4}\/\d{2}\/\d{2}$/;
  if (!regex.test(dateString)) {
    return false;
  }

  // 문자열을 연, 월, 일 숫자로 분리
  const parts = dateString.split('/');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  // Date 객체 생성 (월은 0부터 시작하므로 -1 처리)
  const date = new Date(year, month - 1, day);

  // 입력한 값과 실제 생성된 Date 객체의 값이 일치하는지 확인 (윤년 및 유효성 검증)
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

//사업자번호 검증
function check_BizRegNo(bizID){
    var checkID = new Array(1, 3, 7, 1, 3, 7, 1, 3, 5, 1);  //사업자번호 자리별 가중치
    var i, Sum=0, c2, remander;

    // 하이픈 제거
    bizID = bizID.replace(/-/gi,'');

    //앞 9자리 가중치 합산
    for (i=0; i<=7; i++){
        Sum += checkID[i] * bizID.charAt(i);
    }

    //검증번호 계산
    c2 = "0" + (checkID[8] * bizID.charAt(8));
    c2 = c2.substring(c2.length - 2, c2.length);
    Sum += Math.floor(c2.charAt(0)) + Math.floor(c2.charAt(1));
    remander = (10 - (Sum % 10)) % 10 ;
    
    //유효성 판별
    if(bizID.length != 10){
        return false;
    }else if (Math.floor(bizID.charAt(9)) != remander){
        return false;
    }else{
        return true;
    }
}
