var curQuizSlide = 1;
var maxQuizSlide = 3;
$(document).ready(function(){

    //$(".quiz_slide").hide();
    $(".quiz_slide").eq(0).show();

    $(".btnPrevQuizSlide").click(function(){
        if (curQuizSlide > 1)
        {
            $(".quiz_slide[data-quiz-slide='"+curQuizSlide+"']").hide();
            curQuizSlide--;
            $(".quiz_slide[data-quiz-slide='"+curQuizSlide+"']").show();
        }
    });

    $(".btnNextQuizSlide").click(function(){
        if (curQuizSlide < maxQuizSlide)
        {
            $(".quiz_slide[data-quiz-slide='"+curQuizSlide+"']").hide();
            curQuizSlide++;
            $(".quiz_slide[data-quiz-slide='"+curQuizSlide+"']").show();
        }
    });

    $(".btnAnswerReset").click(function(){
        if ($(this).hasClass("btnAnswerCurScreen"))
        {
            $(this).parent().find("assessmentItem").each(function(){
                $(this).find(".answerBtn").click();
            });
            $(this).removeClass("btnAnswerCurScreen").addClass("btnResetCurScreen");
        }
        else if ($(this).hasClass("btnResetCurScreen"))
        {
            $(this).parent().find("assessmentItem").each(function(){
                $(this).find(".resetBtn").click();
            });
            $(this).removeClass("btnResetCurScreen").addClass("btnAnswerCurScreen");
            $(this).parent().find(".answer_img").find("img").hide();
        }
    });
});
