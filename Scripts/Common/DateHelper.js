Date.prototype.Format = function (fmt) {
    var o =
     {
         "M+": this.getMonth() + 1, //月份 
         "d+": this.getDate(), //日 
         "h+": this.getHours(), //小时 
         "m+": this.getMinutes(), //分 
         "s+": this.getSeconds(), //秒 
         "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
         "S": this.getMilliseconds() //毫秒 
     };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
Date.prototype.addSeconds = function (d) {
    this.setSeconds(this.getSeconds() + d);
};
Date.prototype.addMinutes = function (d) {
    this.setMinutes(this.getMinutes() + d);
};
Date.prototype.addHours = function (d) {
    this.setHours(this.getHours() + d);
};
Date.prototype.addDays = function (d) {
    this.setDate(this.getDate() + d);
};
Date.prototype.addWeeks = function (w) {
    this.addDays(w * 7);
};
Date.prototype.addMonths = function (m) {
    var d = this.getDate();
    this.setMonth(this.getMonth() + m);
    if (this.getDate() < d)
        this.setDate(0);
};
Date.prototype.addYears = function (y) {
    var m = this.getMonth();
    this.setFullYear(this.getFullYear() + y);
    if (m < this.getMonth()) {
        this.setDate(0);
    }
};
Date.prototype.dateDiff = function (interval, objDate) {
    var dtEnd = new Date(objDate);
    if (isNaN(dtEnd)) return undefined;
    switch (interval) {
        case "fs": return parseInt((dtEnd - this));
        case "s": return parseInt((dtEnd - this) / 1000);
        case "n": return parseInt((dtEnd - this) / 60000);
        case "h": return parseInt((dtEnd - this) / 3600000);
        case "d": return parseInt((dtEnd - this) / 86400000);
        case "w": return parseInt((dtEnd - this) / (86400000 * 7));
        case "m": return (dtEnd.getMonth() + 1) + ((dtEnd.getFullYear() - this.getFullYear()) * 12) - (this.getMonth() + 1);
        case "y": return dtEnd.getFullYear() - this.getFullYear();
    }
}
Date.prototype.dateDiffToDate = function (endDate) {
    var dtEnd = new Date(endDate);
    if (isNaN(dtEnd)) return undefined;
    var seconds = this.dateDiff("s", endDate);
    var date = new Date(1970, 1, 1);
    date.addSeconds(seconds);
    return date;
}
//转化json数据的日期
function ChangeDateFormat(jsondate) {
    if (jsondate == null) return null;
    jsondate = jsondate.replace("/Date(", "").replace(")/", "");

    if (jsondate.indexOf("+") > 0) {
        jsondate = jsondate.substring(0, jsondate.indexOf("+"));
    } else if (jsondate.indexOf("-") > 0) {
        jsondate = jsondate.substring(0, jsondate.indexOf("-"));
    }
    //alert(jsondate);
    var date = new Date(parseInt(jsondate, 10));
    return date;
    //alert(date.getHours());
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    return date.getFullYear() + "-" + month + "-" + currentDate + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
}
function JsonDateToString(jsondate) {
    if (jsondate == null) return "";
    jsondate = jsondate.replace("/Date(", "").replace(")/", "");

    if (jsondate.indexOf("+") > 0) {
        jsondate = jsondate.substring(0, jsondate.indexOf("+"));
    } else if (jsondate.indexOf("-") > 0) {
        jsondate = jsondate.substring(0, jsondate.indexOf("-"));
    }
    //alert(jsondate);
    var date = new Date(parseInt(jsondate, 10));
    return date.Format("yyyy-MM-dd hh:mm:ss");
    //alert(date.getHours());
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var result = date.getFullYear() + "-" + month + "-" + currentDate + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    return result.Format("yyyy-MM-dd hh:mm:ss");
}
function formatterMethodTime(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    var hh = date.getHours();
    var mm = date.getMinutes();
    var ss = date.getSeconds();
    return y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d)
    + ' ' + (hh < 10 ? ('0' + hh) : hh) + ':' + (mm < 10 ? ('0' + mm) : mm) + ':' + (ss < 10 ? ('0' + ss) : ss);
}

function myparser(s) {
    if (!s) return new Date();
    var ss = (s.split('/'));
    var y = parseInt(ss[0], 10);
    var m = parseInt(ss[1], 10);
    var d = parseInt(ss[2], 10);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        return new Date(y, m - 1, d);
    } else {
        return new Date();
    }
}

function timeStamp2String(time) {
    var datetime = new Date();
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
    var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    var hour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
    var minute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
    var second = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
    var msecond = datetime.getMilliseconds();
    if (msecond < 10)
        msecond = "0" + msecond;
    if (msecond < 100)
        msecond = "0" + msecond;
    return (year + '').substring(2, 4) + '' + month + '' + date + '' + hour + '' + minute + '' + second + '' + msecond; // yyyyMMddHHmmss
}