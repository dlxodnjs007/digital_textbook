$(document).ready(function(){
    $(".common_playGif > audio").on("ended",function(){
        $("#p072_gifStatic_1").attr('src',"./nep_image/ready_.gif");
        $("#p072_gifAnimated_1").attr('src',"./nep_image/say01.gif");
    });
});