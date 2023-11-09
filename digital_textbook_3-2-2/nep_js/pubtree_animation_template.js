/*
*	Animation Call Function
*	exeEvent('fadeOut',$(this),1,'2'); //spped=1, loop=2
*/
function exeEvent(exe,here,speed,loop,status,direction,size) {

	if(!speed) speed=0;//1
	if(!loop) loop=1;
	if(!status) status='';
	if(!direction) direction='';
	if(!size) size='';

	$(here).css('animation-iteration-count','infinite');
	$(here).css('animation-duration',speed+'s');
	$(here).css('-webkit-animation-iteration-count','infinite');
	$(here).css('-webkit-animation-duration',speed+'s');

	if(exe=='show'){
		$(here).show();
		return false;
	}else if(exe=='hide'){
		$(here).hide();
		return false;
	}else if(exe=='flip'||exe=='bounce'||exe=='rotate'){
		exe=exe+status+direction;
	}else if(exe=='fade'){
		exe=exe+status+direction+size;
	}else if(exe=='light'){
		exe=exe+status;
	}
	$(here).addClass(exe);

	/* Animation Repection Cotrol  */
	if(loop!='infinite') {

		//'fadeOut'
		if (exe.indexOf('Out') != -1) {
			// fadeOut function
			var wait = window.setTimeout( function(){
					$(here).hide();
					$(here).css('-webkit-animation','none');
					$(here).css('-webkit-animation','');
					return;
				},
				1000*speed*loop
			);
		} else {
			// Default exe
			var wait = window.setTimeout( function(){
					$(here).removeClass(exe);
					$(here).css('-webkit-animation','none');
					$(here).css('-webkit-animation','');
				},
				1000*speed*loop
			);
		}

	}

}

function exeEvent2(name, node, duration, loop, delay) {
    $(node).css('animation-duration', duration + 's');
    $(node).css('animation-iteration-count', loop);
    if (delay)
        $(node).css('animation-delay', delay + 's');
    //$(node).css('animation-fill-mode', 'both');
    $(node).css('animation-direction', 'alternate');
    $(node).addClass(name);
}

function exeEvent3(name, node, duration, loop, delay) {
    $(node).css('animation-duration', duration + 's');
    $(node).css('animation-iteration-count', loop);
    if (delay)
        $(node).css('animation-delay', delay + 's');
    $(node).css('animation-fill-mode', 'both');
    $(node).css('animation-direction', 'alternate');
    $(node).addClass(name);

    /*$(node).on("animationend", function () {
        $(this).css('opacity', '1');
    });*/
}

function exeEvent4(name, node, duration, loop) {
    $(node).css('animation-duration', duration + 's');
    $(node).css('animation-iteration-count', loop);
    $(node).css('animation-fill-mode', 'both');
    $(node).css('animation-direction', 'alternate');
    $(node).addClass(name);
    var id = "phone";
    for (var i = 1 ; i < 9 ; i++)
    {
        id += i;
        var elem = document.getElementById(id);
        var jsName = "customSpread";
        jsName += i;
        exeEvent3(jsName, elem, 1, '1', i * 0.3);
        id = "phone";
    }
		$("#finger").css('display','none');
}
function exeTrans(here,speed,value,target) {
	if(!speed) speed=0;//1
	if(target=='width') $(here).width(value+'px');
	if(value) $(here).css(target,value);
	$(here).css('-webkit-transition',target+' '+speed+'s ease');

}
