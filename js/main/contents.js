$(document).ready(function () {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkDate1002 = new Date('2026-08-10');
    checkDate1002.setHours(0, 0, 0, 0);

    if (today < checkDate1002) {
        $("#1592_a_02").on('click', function(e){
            e.preventDefault();
            const cont = "2026년도 2차 희망 Replay 제주도 가족여행 지원사업은 \n2026. 11. 4.(수) ~ 11. 6.(금)의 일정으로 진행되며, \n2026년 8월 18일(화)부터 접수를 진행할 예정입니다. \n\n많은 관심 부탁드립니다."    ;
            alertModal.open("안내", cont, "1592_a_02");
        });
    } else {
        
    }
});