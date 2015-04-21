function PageLoading() {
    $("<div class=\"datagrid-mask2\"></div>").css({ display: "block", width: "100%", height: $(document).height() }).appendTo("body");
    $("<div class=\"datagrid-mask-msg2\"></div>").html("页面初始化,请稍候...").appendTo("body").css({ display: "block", left: ($(document.body).outerWidth(true) - 10) / 2, top: ($(window).height() + 23) / 2 });
}
function PageLoadEnd() {
    $(".datagrid-mask2").remove();
    $(".datagrid-mask-msg2").remove();
}
function Loading() {
    $(".datagrid-mask").remove();
    $(".datagrid-mask-msg").remove();
    $("<div class=\"datagrid-mask\"></div>").css({ display: "block", zIndex: 99999, width: "100%", height: $(document).height() }).appendTo("body");
    var mask_msg_top = ($(window).height() - 45) / 2;
    var scrollTop = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
    } else if (document.body) {
        scrollTop = document.body.scrollTop;
    }
    mask_msg_top = Number(mask_msg_top) + Number(scrollTop);
    $("<div class=\"datagrid-mask-msg\"></div>").html("正在处理,请稍候...").appendTo("body").css({ display: "block", zIndex: 99999, left: ($(document.body).outerWidth(true) - 190) / 2, top: mask_msg_top });
    $(".datagrid-mask-msg").css("left", ($(document.body).outerWidth(true) - $(".datagrid-mask-msg").outerWidth()) / 2);
}
function LoadEnd() {
    $(".datagrid-mask").remove();
    $(".datagrid-mask-msg").remove();
}