var gVar = {};
gVar.dragMultiLine = {};
gVar.dragParentX = gVar.dragParentY = 0;
gVar.dragAdjX = 6;
gVar.dragAdjY = 6;
gVar.quizCheckAnswer = gVar.quizSendAnswer = gVar.dragSingleChoice = true;
gVar.curQuizSlide = 1;
gVar.maxQuizSlide = 3;

$(window).load(function(){
  $("div[data-pubtree-popuplayer-type]").on("click", outOfPopupDivArea);
  $(document).on("click", outOfPopupDivArea);
  $(".common_popup").click(function(){
    event.stopPropagation();
    popupControl($(this));
  })
  $('.common_circle').click(function(){
    if($(this).css('opacity') == '0') $(this).animate({'opacity':1},200);
		else if ($(this).css('opacity') == '1') $(this).animate({'opacity':0},200)
  })
  $('.common_circleOne').click(function(){
    $(this).parent().find('.common_circleOne').each(function(){
      $(this).animate({'opacity':0},200);
    })
    $(this).animate({'opacity':1},200)
  })
  $('.common_toggle').click(function(){
    console.log("common_toggle");
		toggleControl($(this),'toggle')
  })
  //data-src-num 속성에 페이지_이미지번호 추가
  $('.common_chkOne').on('click',function(){
    chkOneControl($(this));
			});
    //data-src-num 속성에 페이지_이미지번호 추가
  $('.common_chk').on('click',function(){
        var pageNum = $(this).attr('data-src-num').split('_')[0];
				var nextSrc;
				var idx = $(this).attr('data-src-num').split('_')[1];

				if($(this).hasClass('checked')){
					nextSrc = $('#'+pageNum+'_chkSrcOff_'+idx).attr('src')
					$(this).removeClass('checked')
				}
				else{
					nextSrc = $('#'+pageNum+'_chkSrcOn_'+idx).attr('src');
					$(this).addClass('checked');
				}
				$(this).attr('src',nextSrc);

   });
   $('.common_playGif').click(function(){
				var pageNum = $(this).attr('data-play-gif').split('_')[0];
				var gifNum = $(this).attr('data-play-gif').split('_')[1];
				var playGif = $('#'+pageNum+'_gifStatic_'+gifNum);
				var nextGif = $('#'+pageNum+'_gifAnimated_'+gifNum)
				var currentSrc = playGif.attr('src');
				var nextSrc = nextGif.attr('src')

				if(playGif.attr('data-state') == 'static'){
					playGif.attr('data-state','animated')
				}
				else if (playGif.attr('data-state') == 'animated' ){
					playGif.attr('data-state','static')
				}
				playGif.attr('src',nextSrc);
				nextGif.attr('src',currentSrc);
			})
    $('.unit_aniBtn').click(function(){

     if($(this).hasClass('ani_on')){
       $('#unit_ani1-1').css('display','none');
       $('#unit_ani1-2').css('display','none');
       $('#unit_ani1-3').css('display','none');
       $('#unit_ani1-4').css('display','none');
       $(this).removeClass('ani_on');
     }
     else{
       $('#unit_ani1-1').css('display','block');
       $('#unit_ani1-2').css('display','block');
       $('#unit_ani1-3').css('display','block');
       $('#unit_ani1-4').css('display','block');

      exeEvent3('fadeInDown',$('#unit_ani1-1'),1,'1',0.04);
      exeEvent3('fadeInDown',$('#unit_ani1-2'),1,'1',0.12);
      exeEvent3('fadeInDown',$('#unit_ani1-3'),1,'1',0.20);
      exeEvent3('fadeInDown',$('#unit_ani1-4'),1,'1',0.28);

      // exeEvent3('fadeInDown',$('#unit_ani1-1'),3,'1',0.4);
      // exeEvent3('fadeInDown',$('#unit_ani1-2'),3,'1',1.2);
      // exeEvent3('fadeInDown',$('#unit_ani1-3'),3,'1',2.0);
      // exeEvent3('fadeInDown',$('#unit_ani1-4'),3,'1',2.8);
       $(this).addClass('ani_on');
     }
    })
})
var outOfPopupDivArea = function (e) {
    if(!$(e.target).parents().hasClass('div_focus_area')){
      $('.div_focus_area').each(function(){
        popupControl($(this).parent().find('.common_popup'))
      });
    }
}

function chkOneControl(chk){
  var set;
  var pageNum = chk.attr('data-src-num').split('_')[0];
  var idx = chk.attr('data-src-num').split('_')[1];
  var onSrc;
  var set = chk.parent().children('.common_chkOne');

  chkOneRestart(set);

  var onSrc = $('#'+pageNum+'_chkOneOn_'+idx).attr('src')
  chk.attr('src',onSrc);
}
function chkOneRestart(set){
		set.each(function(){
      var pageNum = $(this).attr('data-src-num').split('_')[0];
			var thisIndex = $(this).attr('data-src-num').split('_')[1];
			var offSrc = $('#'+pageNum+'_chkOneOff_'+thisIndex).attr('src');
			$(this).attr('src',offSrc);
		})
}

function popupControl(popup){
   var pageNum = popup.attr('id').split('_')[0]
   var popupBtn = popup.attr('id').split('_')[1]
   var popupNum = popup.attr('id').split('_')[2]

   if(popup.attr('data-popup-type') == "exclusive"){
      $('.common_popup').each(function(){
          if($(this).attr('id').split('_')[2] != popupNum && $(this).attr('data-popup-type') == "exclusive"){
            popupOff($(this),$(this).attr('id').split('_')[2],$(this).attr('id').split('_')[0]);
            if($(this).attr('data-popupbtn-action') == 'off'){
              $(this).attr('data-popupbtn-action','on');
             }
          }
      })
    }
       if(popupBtn == 'popupOn'){
         popupOn(popup,popupNum,pageNum);
       }
       else if(popupBtn == 'popupOff'){
         popupOff(popup,popupNum,pageNum);
       }
       else if(popupBtn == 'popupOneBtn'){
          if(popup.attr('data-popupbtn-action') == 'on'){
            popupOn(popup,popupNum,pageNum);
            popup.attr('data-popupbtn-action','off');
         }
          else if(popup.attr('data-popupbtn-action') == 'off'){
            popupOff(popup,popupNum,pageNum);
            popup.attr('data-popupbtn-action','on');
         }
       }

}
  function toggleControl(toggle, action){
     var state = toggle.attr('data-state');
     var curSrc = toggle.attr('src');
     var nextSrc = toggle.parent().find('.common_toggleRestart').eq(0).attr('src');

     switch(action){
       case 'open': if(state == 'checked') return;
       case 'close' : if(state == 'init') return;
       default:
         toggle.attr('src',nextSrc);
         toggle.parent().find('.common_toggleRestart').eq(0).attr('src',curSrc);
     }
     if(toggle.attr('data-toggle-action')=="eraseAll"){
       toggle.parent().find('.input_init, .textarea_init').each(function(){
         if($(this).is('[data-init]')){
           $(this).val($(this).attr('data-init'))
         }
         else $(this).val('');
       });
     }
     if(state == 'init'){
       toggle.parent().find('input, textarea').each(function(){
         if($(this).is('[data-answer]')){
           $(this).val($(this).attr('data-answer'))
         }
       });
       toggle.parent().find('.common_chkOne').each(function(){
         if($(this).is('[data-answer]')){
           chkOneControl($(this))
         }
       });
       toggle.parent().find('.common_circle').each(function(){
         if($(this).is('[data-answer]')){
           if($(this).css('opacity') == 0){
             $(this).animate({'opacity':1},200);
           }
         }
       });
       toggle.parent().find('.common_toggleDiv').fadeIn(200);
       toggle.attr('data-state','checked');
     }
     else if (state == 'checked'){
       toggle.parent().find('.input_init, .textarea_init').each(function(){
         if($(this).is('[data-init]')){
           $(this).val($(this).attr('data-init'))
         }
         else $(this).val('');
       });
       toggle.parent().find('.common_circle').each(function(){
         if($(this).is('[data-answer]')){
           if($(this).css('opacity') == 1){
             $(this).animate({'opacity':0},200);
           }
         }
       });

       chkOneRestart(toggle.parent().find('.common_chkOne'))
       toggle.parent().find('.common_toggleDiv').fadeOut(200);
       toggle.attr('data-state','init');
     }
  }
//           //1-3) 창이 켜집니다.
  function popupOn(popup, popupNum, pageNum){
    //재생될 오디오는 반드시 popup div 안에 있어야 합니다.
    var playAudio = $('#'+pageNum+'_popupDiv_'+popupNum).find('audio').eq(0)[0]
    if (playAudio != undefined){
      play_chk();
    	playAudio.play();
    }
    if(popup.attr('data-popup-type') == 'speechBubble') $('#'+pageNum+'_popupOn_'+popupNum).fadeOut(200);
   $('#'+pageNum+'_popupDiv_'+popupNum).fadeIn(200);
  }
  //1-4) 창이 꺼집니다.
  function popupOff(popup, popupNum, pageNum){
    //
    if(popup.find('audio').length == 0) play_chk();
    if(popup.attr('data-popup-type') == 'speechBubble') $('#'+pageNum+'_popupOn_'+popupNum).fadeIn(200);
   $('#'+pageNum+'_popupDiv_'+popupNum).fadeOut(200);
   if(popup.parent().find('.common_toggle').length > 0){
     $('.common_toggle').each(function(){
          toggleControl($(this),'close');
    })
    // if(popup.parent().find('.common_chkOne').length > 0){
    //   chkOneRestart(popup.parent().find('.common_chkOne'));
    // }
  }
  }
  //오디오 전체 정지합니다.
  function play_chk(){
   $('audio').each(function(){
     $(this)[0].pause();
     $(this)[0].currentTime = 0;
   })
  }



$(document).ready(function(){

  //$(".quiz_slide").hide();
  $(".quiz_slide").eq(0).show();
  $(".btnPrevQuizSlide").hide();

  $(".btnSelectQuizSlide").click(function()
  {
      if($(this).hasClass("_on")) return;

      var imgnum = $(this).attr("src").split("_");
      var remove = $(".btnSelectQuizSlide._on");
      remove.attr("src", "./nep_image/0-icon_"+ imgnum[2] +"_nb_" + remove.attr("data-val") + ".png");
      remove.removeClass("_on");

      // 0-icon_28_nb_1
      $(this).addClass("_on");
      $(this).attr("src", "./nep_image/0-icon_"+ imgnum[2] +"_nbc_" + $(this).attr("data-val") + ".png");

      $(".quiz_slide[data-quiz-slide]").hide();
      $(".quiz_slide[data-quiz-slide='"+$(this).attr("data-val")+"']").show();
  });

  $(".btnPrevQuizSlide").click(function(){
      if (gVar.curQuizSlide > 1)
      {
          $(".quiz_slide[data-quiz-slide='"+gVar.curQuizSlide+"']").hide();
          gVar.curQuizSlide--;
          $(".quiz_slide[data-quiz-slide='"+gVar.curQuizSlide+"']").show();
          $(".btnNextQuizSlide").show();
          if (gVar.curQuizSlide == 1) $(".btnPrevQuizSlide").hide();
      }
  });

  $(".btnNextQuizSlide").click(function(){
      if (gVar.curQuizSlide < gVar.maxQuizSlide)
      {
          $(".quiz_slide[data-quiz-slide='"+gVar.curQuizSlide+"']").hide();
          gVar.curQuizSlide++;
          $(".quiz_slide[data-quiz-slide='"+gVar.curQuizSlide+"']").show();
          $(".btnPrevQuizSlide").show();
          if (gVar.curQuizSlide == gVar.maxQuizSlide) $(".btnNextQuizSlide").hide();
      }
  });

  $(".btnAnswerReset").click(function(){
      if ($(this).hasClass("btnAnswerCurScreen"))
      {
          $(this).parent().find("assessmentItem").each(function(){
            $(this).find(".answerBtn").click();
            $(this).find(".hintBtn").click();
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
          $(this).parent().find("modalFeedback").hide();
      }
  });

  // $(".svgContainer").siblings(".answerBtn").click(function(){
  //   alert("svgContainer");
  //   $(this).hide();
  //   $(".svgContainer").siblings(".resetBtn").show();
  // });

  // $(".svgContainer").siblings(".resetBtn").click(function(){
  //     $(this).hide();
  //     $(".svgContainer").siblings(".answerBtn").show();
  // });

  $(".dragDrop").siblings(".answerBtn").click(function(){
      $(this).hide();
      $(".dragDrop").siblings(".resetBtn").show();
      showDropAnswer(true);
  });

  $(".dragDrop").siblings(".resetBtn").click(function(){
      $(this).hide();
      $(".dragDrop").siblings(".answerBtn").show();
      showDropDefault();
  });

  $(".quizSelectOneOption").click(function(){
      $(".quizSelectOneMark[data-quiz-select-group="+$(".quizSelectOneMark").eq($(this).attr("data-order")).attr("data-quiz-select-group")+"]").hide();
      $(".quizSelectOneMark").eq($(this).attr("data-order")).show();

  });

  $(".quizSelectOneMark").siblings(".answerBtn").click(function(){
      $(this).hide();
      $(".quizSelectOneMark").siblings(".resetBtn").show();
      showSelectOneAnswer();
  });

  $(".quizSelectOneMark").siblings(".resetBtn").click(function(){
      $(this).hide();
      $(".quizSelectOneMark").siblings(".answerBtn").show();
      showSelectOneDefault();
  });

  $(".quizSelectAllOption").click(function(){
    $(".quizSelectAllMark").eq($(this).attr("data-order")).show();
  });

  $(".quizSelectAllMark").click(function(){
    $(this).hide();
  });

  $(".quizSelectAllMark").siblings(".answerBtn").click(function(){
      $(this).hide();
      $(".quizSelectAllMark").siblings(".resetBtn").show();
      showSelectAllAnswer();
  });

  $(".quizSelectAllMark").siblings(".resetBtn").click(function(){
      $(this).hide();
      $(".quizSelectAllMark").siblings(".answerBtn").show();
      showSelectAllDefault();
  });

  $(".quizOX").click(function(){
      $(".quizOX[data-group='"+$(this).attr("data-group")+"']").each(function(){
        $(this).removeClass("quizOXSelected").attr("src","./nep_image/0-icon_"+$(this).attr("data-ox")+"2.png");
      });
      $(this).addClass("quizOXSelected").attr("src","./nep_image/0-icon_"+$(this).attr("data-ox")+"1.png");
  });

  $(".quizOX").siblings(".answerBtn").click(function(){
      $(this).hide();
      $(".quizOX").siblings(".resetBtn").show();
      showOXAnswer($(this));
  });

  $(".quizOX").siblings(".resetBtn").click(function(){
      $(this).hide();
      $(".quizOX").siblings(".answerBtn").show();
      showOXDefault($(this));
  });

  // $(".btnToggleSlideUpDown").click(function(){
  //   if ($(".slideUpDiv").css("top") == "0px")
  //   {
  //     $(".slideUpDiv").animate({"top":"120px"});
  //   }
  //   else
  //   {
  //     $(".slideUpDiv").animate({"top":"0px"});
  //   }
  // });

  $(".btnToggleSlideUpDown").click(function(){
    var h_value = $(this).attr("data-h-val");
    if(h_value == undefined || h_value == 0) h_value = 120;
    if ($(".slideUpDiv").css("top") == "0px")
    {
      $(".slideUpDiv").animate({"top": h_value + "px"},300);
      setTimeout(() => {
        $(".slideUpDiv").parent().css("visibility","hidden");  
      }, 350);
    }
    else
    {
      $(".slideUpDiv").parent().css("visibility","visible");  
      $(".slideUpDiv").animate({"top":"0px"},300);
    }
  });
});

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var el = $("#"+ev.target.id);
    if ((ev.target.id.indexOf("drop") < 0))
    {
        el = $("#"+ev.target.id).parent();
    }

    var data = ev.dataTransfer.getData("text");
    //el.appendChild(document.getElementById(data));

    var attr = el.attr('data-correct-only');
    if (typeof attr !== typeof undefined && attr !== false)
    {
      var arr = data.split("_");
      console.log(arr[2]+"/"+el.attr('data-answer'));
      if (arr[2] != el.attr('data-answer'))
      {
        playSoundOX("X");
        console.log("data-correct-only");
        return;
      }
    }

    if ((ev.target.id.indexOf("drop") < 0))
    {
        el = $("#"+ev.target.id).parent();
        if (!el.is(':empty'))
        {
            $("#"+el.find("div").attr("id").replace("drag","origin")).html(el.html());
            el.empty();
        }
    }
    el.append($("#"+data));
    playSoundDrop();
}

function showDropAnswer(sound)
{
    var userAnswer = "";
    var correctAnswer = "";
    $(".dragDrop").each(function(){
        userAnswer += (!$(this).is(':empty'))? $(this).find("div").attr("id").split("_")[2] : "X";
        correctAnswer += $(this).attr("data-answer");
    });
    $(".dragOrigin").each(function(){
        if ($(this).parent().parent().parent().attr("id").split("_")[2] == "scking")
        {
          $(".dragOrigin").each(function(){
            var arr_ = $(this).attr("id").split("_");
            $("#"+arr_[0]+"_drag_"+arr_[2]).appendTo($(this));
          });
          $(".dragDrop").each(function(){
            $("#"+$(this).attr("id").split("_")[0]+"_drag_"+$(this).attr("data-answer")).appendTo($(this));
          });
        }
        else
        {
          $(".dragDrop").each(function(){
            $("#"+$(this).attr("id").split("_")[0]+"_drag_"+$(this).attr("data-answer")).appendTo($(this));
          });
          $(this).empty();
        }
    });
    //console.log(userAnswer, correctAnswer);
    var isCorrect = (userAnswer == correctAnswer)? true : false;
    if (sound)
      (isCorrect)? playSoundOX("O") : playSoundOX("X");
    else
      return isCorrect;
}

function showDropDefault()
{
    $(".dragOrigin").each(function(){
        var arr_ = $(this).attr("id").split("_");
        $("#"+arr_[0]+"_drag_"+arr_[2]).appendTo($(this));
    });
    $(".dragDrop").each(function(){
        $(this).empty();
    });
}

function showSelectOneAnswer()
{
    var isCorrect = true;
    $(".quizSelectOneMark").each(function(){
        if (($(this).is(':hidden')) && ($(this).attr("data-answer") == "1")) isCorrect = false;
        ($(this).attr("data-answer") == "1")? $(this).show() : $(this).hide();
    });
    (isCorrect)? playSoundOX("O") : playSoundOX("X");
}

function showSelectOneDefault()
{
    $(".quizSelectOneMark").hide();
}

function showSelectAllAnswer()
{
    var isCorrect = true;
    $(".quizSelectAllMark").each(function(){
        if (($(this).is(':hidden')) && ($(this).attr("data-answer") == "1")) isCorrect = false;
        else if (($(this).is(':visible')) && ($(this).attr("data-answer") != "1")) isCorrect = false;
        ($(this).attr("data-answer") == "1")? $(this).show() : $(this).hide();
    });
    (isCorrect)? playSoundOX("O") : playSoundOX("X");
}

function showSelectAllDefault()
{
    $(".quizSelectAllMark").hide();
}


function showOXAnswer(el)
{
    var isCorrect = true;
    el.siblings(".quizOX").each(function(){
        if ($(this).attr("data-answer") == "1")
        {
          if (!$(this).hasClass('quizOXSelected')) isCorrect = false;
          $(this).attr("src","./nep_image/0-icon_"+$(this).attr("data-ox")+"1.png");
        }
        else
        {
          $(this).attr("src","./nep_image/0-icon_"+$(this).attr("data-ox")+"2.png");
        }
    });
    (isCorrect)? playSoundOX("O") : playSoundOX("X");
}

function showOXDefault(el)
{
  el.siblings(".quizOX").each(function(){
    $(this).removeClass("quizOXSelected").attr("src","./nep_image/0-icon_"+$(this).attr("data-ox")+"2.png");
  });
}

function playSoundOX(ox)
{
  switch (ox)
  {
    case "O" : $(".common_sound_o").eq(0)[0].play(); break;
    case "X" : $(".common_sound_x").eq(0)[0].play(); break;
  }
}

function playSoundDrop()
{
  $(".common_sound_action").eq(0)[0].play();
}