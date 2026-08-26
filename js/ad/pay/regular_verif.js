
// 카드번호 기본 검증(Luhn 알고리즘)
function luhnCheck(num) {
    let sum = 0;
    let isDouble = false;

    for (let i = num.length - 1; i >= 0; i--) {
        let n = parseInt(num.charAt(i), 10);
        if (isDouble) {
            n *= 2;
            if (n > 9) n -= 9;
        }
        sum += n;
        isDouble = !isDouble;
    }
    return sum % 10 === 0;
}

// 카드번호 인증
function cardNoVerif(){
	
	const cardNumChk = /^\d{1,4}$/;
	
    var cdno1            = $('#cdno1').val();
    var cdno2            = $('#cdno2').val();
    var cdno3            = $('#cdno3').val();
    var cdno4            = $('#cdno4').val();
    var creditcardNo     = ""+cdno1+cdno2+cdno3+cdno4;
    var identityNo       = $('#cardjumin1').val().replaceAll("-","");
    var validYear        = "20"+$('#cdy').val();
    var validMont        = $('#cdm').val();
    var cardHolderName   = $('#cardusername').val();
    var uuid             = $('#uuid').val();
    var verifbypass      = $('#verifbypass').val();

	//console.log(cdno1);
	//console.log(cdno2);
	//console.log(cdno3);
	//console.log(cdno4);
	//console.log(creditcardNo);
	//console.log(identityNo);
	//console.log(validYear);
	//console.log(validMont);
	//console.log(cardHolderName);
	if($("#verifFailYn").length > 0){
		$("#verifFailYn").val("Y");//정기후원 개인사업자는 2번 인증시 정합성체크 한번만 실행되게
	}
    if(!cardNumChk.test(cdno1)){
        alert("카드번호의 앞 번호를 입력해주시기 바랍니다.");
        $('#cdno1').val("");
        $('#cdno1').focus();
        return false;
    }
    if(!cardNumChk.test(cdno2)){
        alert("카드번호 두 번째 번호를 입력해주시기 바랍니다.");
        $('#cdno2').val("");
        $('#cdno2').focus();
        return false;
    }
    if(!cardNumChk.test(cdno3)){
        alert("카드번호 세 번째 번호를 입력해주시기 바랍니다.");
        $('#cdno3').val("");
        $('#cdno3').focus();
        return false;
    }
    if(!cardNumChk.test(cdno4)){
        alert("카드번호의 마지막 번호를 입력해주시기 바랍니다.");
        $('#cdno4').val("");
        $('#cdno4').focus();
        return false;
    }
	
	// 카드번호 길이 체크 (국제 표준)
	if (creditcardNo.length < 12 || creditcardNo.length > 19) {
	    alert("카드번호를 올바르게 입력해주시기 바랍니다.");
	    return false;
	}
	
	// 중간에 공백/붙여넣기 이슈 대비
	if (!/^\d+$/.test(creditcardNo)) {
	    alert("카드번호는 숫자만 입력 가능합니다.");
	    return false;
	}
	
	// 카드번호 기본 검증(Luhn 알고리즘)
	if (!luhnCheck(creditcardNo)) {
	    alert("유효하지 않은 카드번호입니다.");
	    return false;
	}
	
    if(validMont == "" || validMont.length<2){
        alert("카드 유효기간을 입력하세요.");
        $('#cdm').focus();
        return false;
    } else if(Number(validMont)<1 || Number(validMont)>12){
        alert("카드 유효기간을 바르게 입력하세요.");
        $('#cdm').focus();
        return false;
    }
    
    if(validYear == "20" || validYear.length<4){
        alert("카드 유효기간을 입력하세요.");
        $('#cdy').focus();
        return false;
    } else if(Number(validYear)< 2024){
        alert("카드 유효기간을 바르게 입력하세요.");
        $('#cdy').focus();
        return false;
    }

	var rsaPublicKeyModulus = document.getElementById("rsaPublicKeyModulus").value;
    var rsaPublicKeyExponent = document.getElementById("rsaPublicKeyExponent").value;

	var rsa = new RSAKey();
    rsa.setPublic(rsaPublicKeyModulus, rsaPublicKeyExponent);
    
    var allData = {
            "creditcardNo"    : rsa.encrypt(creditcardNo),
            "identityNo"      : rsa.encrypt(identityNo),
            "validYear"       : validYear,
            "validMont"       : validMont,
            "cardHolderName"  : encodeURIComponent(cardHolderName),
            "uuid"            : uuid
            };
    if($("#verifFailYn").length > 0){
		$("#verifFailYn").val("N");//정기후원 개인사업자는 2번 인증시 정합성체크 한번만 실행되게
	}
    if(verifbypass == "Y"){
        alert("이미 카드 정보가 인증되었습니다.");
        $('#payVerif').val("Y");
        
    } else {
        $.ajax({
            type      : 'POST'
            ,timeout  : 3000
            ,url      : '/main/ad/pay/redCrossPayRegularVerif.do?action=searchCreditCard'
            ,dataType : 'json'
            ,data     : allData
            ,async: false
            ,success  : function(data) {
                try {
                    if(data.rtflag == "Y"){
                        alert("카드 정보가 인증되었습니다.");
                        $('#cdno1').val();
                        $("#cardNumChk").val($('#cdno1').val() + $('#cdno2').val()+ $('#cdno3').val() + $('#cdno4').val());//이후 카드번호 변경체크
                        $('#payVerif').val(data.rtflag);
                    } else {
                        //alert(data.rtmsg);
                        if($("#memclscodeSel").length > 0 && $("#memclscodeSel").val() == "02" ){
                       	  if($("#cardjumin1").val().length > 8){
	                       	  alert("인증에 실패하였습니다. 입력하신 정보가 정확한지 다시 한 번 확인해주시기 바랍니다.");                       	  
                       	  }
                        }else{
						  alert("인증에 실패하였습니다. 입력하신 정보가 정확한지 다시 한 번 확인해주시기 바랍니다.");
                        }
                        $('#payVerif').val("N");
                    }
                } catch(e) {
                    alert("카드 정보 확인중 오류가 발생했습니다.1" + e);
                }
            }
            ,error    : function(xhr, status, err) {
                if (status === "timeout") {
                    alert("요청 시간이 초과되었습니다.");
                } else { 
                    alert("카드 정보 확인 수행 중 오류가 발생했습니다.2 " + err);
                }
            }
        });
    }
}

// 카드번호 인증
function cardNoVerifMemb02(){
	
	const cardNumChk = /^\d{1,4}$/;
	
    var cdno1            = $('#cdno1').val();
    var cdno2            = $('#cdno2').val();
    var cdno3            = $('#cdno3').val();
    var cdno4            = $('#cdno4').val();
    var creditcardNo     = ""+cdno1+cdno2+cdno3+cdno4;
    var identityNo       = $('#cardjumin1').val().replaceAll("-","");
    var validYear        = "20"+$('#cdy').val();
    var validMont        = $('#cdm').val();
    var cardHolderName   = $('#cardusername').val();
    var uuid             = $('#uuid').val();
    var verifbypass      = $('#verifbypass').val();

	var rsaPublicKeyModulus = document.getElementById("rsaPublicKeyModulus").value;
    var rsaPublicKeyExponent = document.getElementById("rsaPublicKeyExponent").value;

	var rsa = new RSAKey();
    rsa.setPublic(rsaPublicKeyModulus, rsaPublicKeyExponent);
    
    var allData = {
            "creditcardNo"    : rsa.encrypt(creditcardNo),
            "identityNo"      : rsa.encrypt(identityNo),
            "validYear"       : validYear,
            "validMont"       : validMont,
            "cardHolderName"  : encodeURIComponent(cardHolderName),
            "uuid"            : uuid
            };

    if(verifbypass == "Y"){
        alert("이미 카드 정보가 인증되었습니다.");
        $('#payVerif').val("Y");
        
    } else {
        $.ajax({
            type      : 'POST'
            ,timeout  : 3000
            ,url      : '/main/ad/pay/redCrossPayRegularVerif.do?action=searchCreditCard'
            ,dataType : 'json'
            ,data     : allData
            ,async: false
            ,success  : function(data) {
                try {
                    if(data.rtflag == "Y"){
                        alert("카드 정보가 인증되었습니다.");
                        $('#cdno1').val();
                        $("#cardNumChk").val($('#cdno1').val() + $('#cdno2').val()+ $('#cdno3').val() + $('#cdno4').val());//이후 카드번호 변경체크
                        $('#payVerif').val(data.rtflag);
                    } else {
                        //alert(data.rtmsg);
                        if($("#memclscodeSel").length > 0 && $("#memclscodeSel").val() == "02" ){
                       	  if($("#cardjumin1").val().length > 8){
	                       	  alert("인증에 실패하였습니다. 입력하신 정보가 정확한지 다시 한 번 확인해주시기 바랍니다.");                       	  
                       	  }
                        }else{
						  alert("인증에 실패하였습니다. 입력하신 정보가 정확한지 다시 한 번 확인해주시기 바랍니다.");
                        }
                        $('#payVerif').val("N");
                    }
                } catch(e) {
                    alert("카드 정보 확인중 오류가 발생했습니다.1" + e);
                }
            }
            ,error    : function(xhr, status, err) {
                if (status === "timeout") {
                    alert("요청 시간이 초과되었습니다.");
                } else { 
                    alert("카드 정보 확인 수행 중 오류가 발생했습니다.2 " + err);
                }
            }
        });
    }
}

// 계좌번호 인증
function bankNoVerif(){
	
	
	const bankNumChk = /^[0-9]+$/;

    var bankCd        = $('#ygficode option:selected').val();
    var accountNumber = $('#ygnum').val();
    var identityNo    = $('#ygjumin').val().replaceAll("-","");
    var accountName   = $('#ygname').val();
    var uuid          = $('#uuid').val();
    var verifbypass      = $('#verifbypass').val();


	//console.log(bankCd);
	//console.log(accountNumber);
	//console.log(identityNo);
	//console.log(accountName);
	//console.log(uuid);
	//console.log(verifbypass);
	if($("#verifFailYn").length > 0){
		$("#verifFailYn").val("Y");//정기후원 개인사업자는 2번 인증시 정합성체크 한번만 실행되게
	}
	
    if(bankCd == "" || bankCd.length<2){
        alert("은행명을 선택하세요.");
        $('#ygficode').focus();
        return false;
    }
    if(accountName == "" || accountName.length==0){
        alert("예금주 성명을 입력하세요.");
        $('#ygname').focus();
        return false;
    }
    if(!bankNumChk.test(identityNo) || identityNo.length<6){
        alert("생년월일을 입력하세요.");
        $('#ygjumin').focus();
        return false;
    }
    
    if(!bankNumChk.test(accountNumber) || accountNumber.length<5){
        alert("계좌번호를 입력하세요.");
        $('#ygnum').focus();
        return false;
    }
    
    if(bankCd == "090" && accountNumber.substring(0,4)=="7777"){ // 은행명-카카오뱅크 and 계좌번호-7777 로 시작할 경우
        alert("카카오미니 계좌는 자동이체 등록 불가합니다.");
        $('#ygnum').val("");
        $('#ygnum').focus();
        return false;
    }
    
    if(bankCd == "090" && accountNumber.substring(0,4)=="7979"){ // 은행명-카카오뱅크 and 계좌번호-7979 로 시작할 경우
        alert("카카오 모임계좌는 자동이체 등록 불가합니다.");
        $('#ygnum').val("");
        $('#ygnum').focus();
        return false;
    }
    
    if(bankCd == "092" && (accountNumber.substring(0,2)=="17" || accountNumber.substring(0,2)=="19")){ // 토스뱅크 and 계좌번호가 17 또는 19로 시작 이체 불가 가상계좌 
        alert("가상계좌는 사용 불가 합니다.");
        $('#ygnum').val("");
        $('#ygnum').focus();
        return false;
    }
    if(bankCd == "031" && accountNumber.substring(0,3)=="937"){ //  iM뱅크 and 계좌번호가 937로 시작 이체 불가 가상계좌 
        alert("가상계좌는 사용 불가 합니다.");
        $('#ygnum').val("");
        $('#ygnum').focus();
        return false;
    }
    if(bankCd == "045" && accountNumber.substring(0,3)=="037"){ // 새마을금고 and 계좌번호가 037로 시작 이체 불가 가상계좌 
        alert("가상계좌는 사용 불가 합니다.");
        $('#ygnum').val("");
        $('#ygnum').focus();
        return false;
    }
    
    if(checkMobileNo(accountNumber)){
        alert("휴대폰번호 형식의 평생 계좌는 사용할 수 없습니다.");
        $('#ygnum').val("");
        $('#ygnum').focus();
        return false;
    }
    
    if(!checkNongHyupCross(bankCd, accountNumber)){
        alert("농협은행-회원농협 구분을 확인하세요.");
        $('#ygnum').focus();
        return false;
    }

	var rsaPublicKeyModulus = document.getElementById("rsaPublicKeyModulus").value;
    var rsaPublicKeyExponent = document.getElementById("rsaPublicKeyExponent").value;

	var rsa = new RSAKey();
    rsa.setPublic(rsaPublicKeyModulus, rsaPublicKeyExponent);

    var allData = {
            "bankCd"        : bankCd,
            "accountNumber" : rsa.encrypt(accountNumber), //계좌번호
            "identityNo"    : rsa.encrypt(identityNo), //생년월일
            "accountName"   : encodeURIComponent(accountName),
            "uuid"          : uuid
            };
	if($("#verifFailYn").length > 0){
    	$("#verifFailYn").val("N");//정기후원 개인사업자는 2번 인증시 정합성체크 한번만 실행되게
    }
    if(verifbypass == "Y"){
        alert("계좌 정보가 인증되었습니다.");
        $('#payVerif').val("Y");
    } else {
        $.ajax({
            type      : 'POST'
            ,timeout  : 3000
            ,url      : '/main/ad/pay/redCrossPayRegularVerif.do?action=searchBankAccount'
            ,dataType : 'json'
            ,data     : allData
            ,async: false
            ,success  : function(data) {
                try {
                    if(data.rtflag == "Y"){
                        alert("계좌 정보가 인증되었습니다.");
                        $("#ygnumChk").val($("#ygnum").val());//이후 주민번호 변경체크
                        $('#payVerif').val(data.rtflag);
                    } else {
                       // alert(data.rtmsg);
                       // 정기후원시 개인사업자는 첫번째(생년월일) 인증실패시 두번째(사업자번호) 인증까지 한 후 에러메시지 표출
                       if($("#memclscodeSel").length > 0 && $("#memclscodeSel").val() == "02"){
	                       if($("#ygjumin").val().length > 8 ){
	                       	 alert("인증에 실패하였습니다. 입력하신 정보가 정확한지 다시 한 번 확인해주시기 바랍니다.");	                       
	                       }
                       }else{
						 alert("인증에 실패하였습니다. 입력하신 정보가 정확한지 다시 한 번 확인해주시기 바랍니다.");
                       }
                       $('#payVerif').val("N");
                    }
                } catch(e) {
                    alert("계좌 정보 확인중 오류가 발생했습니다.");
                }
            }
            ,error    : function(xhr, status, err) {
                if (status === "timeout") {
                    alert("요청 시간이 초과되었습니다.");
                } else { 
                    alert("계좌 정보 확인 수행 중 오류가 발생했습니다.");
                }
            }
        });
    }
}

// 계좌번호 재인증(개인사업자는 인증 실패시 한번더 인증)
function bankNoVerifMemb02(){
	
	
	const bankNumChk = /^[0-9]+$/;

    var bankCd        = $('#ygficode option:selected').val();
    var accountNumber = $('#ygnum').val();
    var identityNo    = $('#ygjumin').val().replaceAll("-","");
    var accountName   = $('#ygname').val();
    var uuid          = $('#uuid').val();
    var verifbypass      = $('#verifbypass').val();

	var rsaPublicKeyModulus = document.getElementById("rsaPublicKeyModulus").value;
    var rsaPublicKeyExponent = document.getElementById("rsaPublicKeyExponent").value;

	var rsa = new RSAKey();
    rsa.setPublic(rsaPublicKeyModulus, rsaPublicKeyExponent);

    var allData = {
            "bankCd"        : bankCd,
            "accountNumber" : rsa.encrypt(accountNumber), //계좌번호
            "identityNo"    : rsa.encrypt(identityNo), //생년월일
            "accountName"   : encodeURIComponent(accountName),
            "uuid"          : uuid
            };
    
    if(verifbypass == "Y"){
        alert("계좌 정보가 인증되었습니다.");
        $('#payVerif').val("Y");
    } else {
        $.ajax({
            type      : 'POST'
            ,timeout  : 3000
            ,url      : '/main/ad/pay/redCrossPayRegularVerif.do?action=searchBankAccount'
            ,dataType : 'json'
            ,data     : allData
            ,async: false
            ,success  : function(data) {
                try {
                    if(data.rtflag == "Y"){
                        alert("계좌 정보가 인증되었습니다.");
                        $("#ygnumChk").val($("#ygnum").val());//이후 주민번호 변경체크
                        $('#payVerif').val(data.rtflag);
                    } else {
                       // alert(data.rtmsg);
                       // 정기후원시 개인사업자는 첫번째(생년월일) 인증실패시 두번째(사업자번호) 인증까지 한 후 에러메시지 표출
                       if($("#memclscodeSel").length > 0 && $("#memclscodeSel").val() == "02"){
	                       if($("#ygjumin").val().length > 8 ){
	                       	 alert("인증에 실패하였습니다. 입력하신 정보가 정확한지 다시 한 번 확인해주시기 바랍니다.");	                       
	                       }
                       }else{
						 alert("인증에 실패하였습니다. 입력하신 정보가 정확한지 다시 한 번 확인해주시기 바랍니다.");
                       }
                       $('#payVerif').val("N");
                    }
                } catch(e) {
                    alert("계좌 정보 확인중 오류가 발생했습니다.");
                }
            }
            ,error    : function(xhr, status, err) {
                if (status === "timeout") {
                    alert("요청 시간이 초과되었습니다.");
                } else { 
                    alert("계좌 정보 확인 수행 중 오류가 발생했습니다.");
                }
            }
        });
    }
}


function checkMobileNo(p_no){
    var result = false;
    
    p_no = p_no.replaceAll("-","").trim();
    
    if(p_no != "" && p_no.length>3){
        var subNo = p_no.substring(0,3);
        
        if(subNo == "010" || subNo == "011" || subNo == "016" 
        || subNo == "017"|| subNo == "018" || subNo == "019"){
            result = true;
        }
    }
    
    return result;
}


function checkNongHyupCross(p_bankcd, p_accNo){
    var result = true;
    
    if(p_bankcd == "011"){ //농협은행(중앙농협)
        if(p_accNo.length == 13){
            var subNo = p_accNo.substring(0, 3);
            
            if(subNo != "301" && subNo != "302"  && subNo != "305" && subNo != "306" && subNo != "312"&& subNo != "317"){
                result = false;
            }
        }
    
        if(p_accNo.length == 14){
            var subNo = p_accNo.substring(6, 8);
            
            if(subNo == "51" || subNo == "52" || subNo == "55" || subNo == "56"){
                result = false;
            }
        }
    }
    
    if(p_bankcd == "012"){ //회원농협(지역농협)
        if(p_accNo.length == 11 || p_accNo.length == 12){
            result = false;
        }
        
        if(p_accNo.length == 13){
            var subNo = p_accNo.substring(0, 3);
            
            if(subNo != "351" && subNo != "352" && subNo != "355" && subNo != "356"){
                result = false;
            }
        }
    
        if(p_accNo.length == 14){
            var subNo = p_accNo.substring(6, 8);
            
            if(subNo != "51" && subNo != "52" && subNo != "55" && subNo != "56" ){
                result = false;
            }
        }
    }
    
    return result;
}