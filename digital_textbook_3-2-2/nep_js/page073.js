$(document).ready(function(){
    $("#p073_popupDiv_5").find(".correct").hide();
    $("#p073_popupDiv_5").find(".choose > li").click(function(){
        /*
        var bg_ = "#c3c3c3";
        console.log($(this).css("background-color"));
        ($(this).css("background-color") == bg_)? $(this).css("background-color","transparent") : $(this).css("background-color",bg_);
        */
        if ($(this).hasClass("wordSelected"))
        {
            $(this).removeClass("wordSelected");
        }
        else
        {
            $(this).addClass("wordSelected");
            checkSelectedBlock($(this).index());
        }
    });

    $("#p073_popupDiv_5").find(".choose").siblings(".answerBtn").click(function(){
        $(this).hide();
        $(this).siblings(".resetBtn").show();
        var wordFound = true;
        $(this).siblings(".rightAnswer").each(function(){
            if ($(this).is(":hidden")) wordFound = false;
        });
        (wordFound)? playSoundOX("O") : playSoundOX("X");
        $(this).siblings(".correct").show();
    });
    $("#p073_popupDiv_5").find(".choose").siblings(".resetBtn").click(function(){
        $(this).hide();
        $(this).siblings(".answerBtn").show();
        $(this).siblings(".correct").hide();
        $(this).siblings(".choose").find("li").removeClass("wordSelected");
    });
});

function checkSelectedBlock(index_) {
    var arr_ = [];
    $(".correct").each(function(){
        arr_ = $(this).attr("data-word-group").split(",");
        for(var i=0; i<arr_.length; i++)
        {
            if (arr_[i] == index_)
            {
                checkSelectedWords($(this));
            }
        }
    });
}

function checkSelectedWords(el_)
{
    console.log(el_.attr("data-word-group"));
    var wordFound = true;
    var arr_ = el_.attr("data-word-group").split(",");
    for(var i=0; i<arr_.length; i++)
    {
        if (!$("#p073_popupDiv_5").find(".choose > li").eq(arr_[i]).hasClass("wordSelected")) wordFound = false;
    }
    if (wordFound) el_.show();
}