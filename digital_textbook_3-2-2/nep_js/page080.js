$(document).ready(function(){
    $(".common_playGif > audio").on("ended",function(){
        $("#p080_gifStatic_1").attr('src',"./nep_image/ready_.gif");
        $("#p080_gifAnimated_1").attr('src',"./nep_image/04_say_.gif");
    });
});