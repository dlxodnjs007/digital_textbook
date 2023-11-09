$(document).ready(function(){
    $("#p048_popupOn_1").click(function(){
        $("#p048_popupDiv_1").show();
    });
    $("#p048_popupDiv_1").find(".btn_close").click(function(){
        $("#p048_popupDiv_1").hide();
    });
});