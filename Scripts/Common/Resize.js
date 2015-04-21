$(document).ready(function () {
    $(window).resize(function () {
        $('#main-layout').layout('resize');
        $('.datagrid-view').each(function (item) {
            $("#" + $(this).find('> :eq(2)').attr('id')).datagrid('resize', {
                width: $(this).parent().parent().parent().width()
            });
        });
        $('.easyui-tabs').each(function (item) {
            $("#" + $(this).attr('id')).tabs('resize', {
                width: $(this).parent().width()
            });
        });
        $(".container-noborder:first").width($(document.body).outerWidth(true) - 4);
    });
    $(".container-noborder:first a").each(function () {
        var text = $.trim($(this).text());
        if (text == "新建" || text == "添加" || text == "新增" || text == "清除" || text == "导出" || text == "打印") {
            $(this).click(function () {
                $("html,body").animate({ scrollTop: 0 }, 500);
            });
        }
    });
    window.onscroll = function () {
        var top = document.documentElement.scrollTop || document.body.scrollTop;
        $(".container-noborder:first").addClass("container-fixed");
        $(".container-noborder:first").width($(document.body).outerWidth(true) - 4);
        if (top == 0) {
            $(".container-noborder:first").removeClass("container-fixed");
        }
    };
});

