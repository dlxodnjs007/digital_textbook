$(document).ready(function(){
    $("#p090_popupOn_1").click(function(){
        $("#p090_popupDiv_1").show();
    });
    $("#p090_popupDiv_1").find(".btn_close").click(function(){
        $("#p090_popupDiv_1").hide();
    });
});