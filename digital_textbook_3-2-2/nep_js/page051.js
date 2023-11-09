$(document).ready(function(){
    $(".common_playGif > audio").on("ended",function(){
        $("#p051_gifStatic_1").attr('src',"./nep_image/ready_.gif");
        $("#p051_gifAnimated_1").attr('src',"./nep_image/say03_.gif");
    });
});