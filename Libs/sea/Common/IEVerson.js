function IsIE7() {
    var userAgent = window.navigator.userAgent.toLowerCase();
    $.browser.msie10 = $.browser.msie && /msie 10\.0/i.test(userAgent);
    $.browser.msie9 = $.browser.msie && /msie 9\.0/i.test(userAgent);
    $.browser.msie8 = $.browser.msie && /msie 8\.0/i.test(userAgent);
    $.browser.msie7 = $.browser.msie && /msie 7\.0/i.test(userAgent);
    $.browser.msie6 = !$.browser.msie8 && !$.browser.msie7 && $.browser.msie && /msie 6\.0/i.test(userAgent);
    if ($.browser.msie7 == true)
        return true;
    else
        return false;
}