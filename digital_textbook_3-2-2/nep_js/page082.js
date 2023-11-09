$(document).ready(function(){
    $(".common_playGif > audio").on("playing",function(){
        $(this).parent().siblings("img").eq(0).attr("src","./nep_image/05_say_.gif");
    });
    $(".common_playGif > audio").on("ended",function(){
        $(this).parent().siblings("img").eq(0).attr("src","./nep_image/05_ready_.gif");
    });
});