$(document).ready(function(){
    $("#p086_audio_2").on("playing",function(){
        $("#p086_gifStatic_1").attr('src',"./nep_image/07_say_.gif");
    });
    $("#p086_audio_2").on("ended",function(){
        $("#p086_gifStatic_1").attr('src',"./nep_image/3-1_86p_5.png");
    });
});