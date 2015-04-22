///////////javascript-htmsg静态类//////////////////////////////
function htmsg() { }
htmsg.show = function (msg) {
    $.messager.show({
        title: '提示消息',
        msg: msg
    });
};
htmsg.alert = function (msg) {
    $.messager.alert('提示消息', msg);
};
htmsg.confim = function (msg, okfun, title, celfun) {
    if (!title) title = "确认";
    $.messager.confirm(title, msg,
         function (r) {
             LoadEnd();
             if (r) okfun();
             else if (celfun) celfun();
         });
};