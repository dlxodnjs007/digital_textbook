$(document).ready(function(){
    quizPage068Slide2();

    $(".common_circle").click(function(){
        $(".common_sound_x").eq(0)[0].pause();
        $(".common_sound_x").eq(0)[0].currentTime = 0;
        $(".p068_check_x").remove();
    });
});
//window.addEventListener("resize", quizPage068Slide2);
function quizPage068Slide2() {
    $("#p068_check_1, #p068_check_2").unbind("click").click(function(e){
        $(".common_sound_x").eq(0)[0].pause();
        $(".common_sound_x").eq(0)[0].currentTime = 0;
        $(".p068_check_x").remove();

        var zoom = 1/ZOOM.rate;
        //var zoom = ZOOM.rate;
        //var el = $("<div></div>").addClass("p068_check_x").text("X").css({position:"fixed",top:((e.pageY - 23)*zoom)+"px",left:((e.pageX - 11)*zoom)+"px","font-size":(40*zoom)+"px",color:"red","font-weight":"bold","z-index":8, cursor:"default"});
        var el = $("<div></div>").addClass("p068_check_x").text("×").css({position:"fixed",top:((e.pageY - 46)*zoom)+"px",left:((e.pageX - 22)*zoom)+"px","font-size":(80*zoom)+"px",color:"red","font-weight":"bold","z-index":8, cursor:"default"});
        el.appendTo($(this).parent());
        setTimeout(function(){el.remove();},1000);

        $(".common_sound_x").eq(0)[0].play();

        if ($(this).attr("id") == "p068_check_1") $(".common_circle").eq(0).css({opacity:0});
        else if ($(this).attr("id") == "p068_check_2") $(".common_circle").eq(1).css({opacity:0});
    });
}