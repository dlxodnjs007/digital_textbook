gVar.quizSendAnswer = false;
gVar.dragMultiLine = {};
gVar.dragParentX = 98; //98
gVar.dragParentY = 334; //334

$(document).ready(function(){
    $("#p084_audio_2").on("playing",function(){
        $("#p084_gifStatic_1").attr('src',"./nep_image/07_say_.gif");
    });
    $("#p084_audio_2").on("ended",function(){
        $("#p084_gifStatic_1").attr('src',"./nep_image/3-1_84p_5.png");
    });
});