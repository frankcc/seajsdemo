var IsEnableFormatter = function (value, rec) {
    if (rec.IsEnable == false) {
        return '<span style="color:red">停用</span>';
    }
    return '启用';
}
var ArriveFormatter = function (value, rec) {
    if (rec.IsArrived == false) {
        return '<span style="color:red">未到达</span>';
    }
    return '已到达';
}
var formatTime = function (str) {
    if (str != null && str != "") {
        return ChangeDateFormat(str).Format("hh:mm:ss");
    }
}
var formatDate = function (str) {
    if (str != null && str != "") {
        return ChangeDateFormat(str).Format("yyyy-MM-dd");
    }
}
var formatDateTime = function (str) {
    if (str != null && str != "") {
        return ChangeDateFormat(str).Format("yyyy-MM-dd hh:mm:ss");
    }
}

var formatDecimal = function (str) {
    if (str != null && str != "") {
        if (parseFloat(str) == 0)
            return "0.00";
        return NumberFormat(str, 2);
    }
    else
        return "0.00";
}
var formatDecimal2 = function (str) {
    if (str != null && str != "") {
        if (parseFloat(str) == 0)
            return "0.00";
        return NumberFormat(parseFloat(str), 2);
    }
    else
        return "0.00";
};
var formatDecimal3 = function (str) {
    if (str != null && str != "") {
        if (parseFloat(str) == 0)
            return "0.000";
        return NumberFormat(parseFloat(str), 3);
    }
    else
        return "0.000";
};
var formatDecimal4 = function (str) {
    if (str != null && str != "") {
        if (parseFloat(str) == 0)
            return "0.0000";
        return NumberFormat(parseFloat(str), 4);
    }
    else
        return "0.0000";
   };
var formatDecimal6 = function (str) {
   	if (str != null && str != "") {
   		if (parseFloat(str) == 0)
   			return "0.000000";
   		return NumberFormat(parseFloat(str), 6);
   	}
   	else
   		return "0.000000";
   };
function round(num, dec) {
    var sNum = num + '';
    var idx = sNum.indexOf(".");
    if (idx < 0)
        return num;
    var n = sNum.length - idx - 1;
    if (dec < n) {
        var e = Math.pow(10, dec);
        return Math.round(num * e) / e;
    } else {
        return num;
    }
}
function NumberFormat(nData, decimalPlaces) {
    if (typeof nData != 'number') {
        nData *= 1;
    }
    var thousandsSeparator = ",";
    if (typeof nData == 'number') {
        var bNegative = (nData < 0);
        var sOutput = String(nData);
        var sDecimalSeparator = ".";
        var nDotIndex;
        if (typeof decimalPlaces == 'number') {
            // Round to the correct decimal place
            var nDecimalPlaces = decimalPlaces;
            var nDecimal = Math.pow(10, nDecimalPlaces);
            sOutput = String(Math.round(nData * nDecimal) / nDecimal);
            nDotIndex = sOutput.lastIndexOf(".");
            if (nDecimalPlaces > 0) {
                // Add the decimal separator
                if (nDotIndex < 0) {
                    sOutput += sDecimalSeparator;
                    nDotIndex = sOutput.length - 1;
                }
                // Replace the "."
                else if (sDecimalSeparator !== ".") {
                    sOutput = sOutput.replace(".", sDecimalSeparator);
                }
                // Add missing zeros
                while ((sOutput.length - 1 - nDotIndex) < nDecimalPlaces) {
                    sOutput += "0";
                }
            }
        }
        var sThousandsSeparator = ",";
        nDotIndex = sOutput.lastIndexOf(sDecimalSeparator);
        nDotIndex = (nDotIndex > -1) ? nDotIndex : sOutput.length;
        var sNewOutput = sOutput.substring(nDotIndex);
        var nCount = -1, i;
        for (i = nDotIndex; i > 0; i--) {
            nCount++;
            if ((nCount % 3 === 0) && (i !== nDotIndex) && (!bNegative || (i > 1))) {
                sNewOutput = sThousandsSeparator + sNewOutput;
            }
            sNewOutput = sOutput.charAt(i - 1) + sNewOutput;
        }
        sOutput = sNewOutput;
        return sOutput;
    }
    return nData;
}

var IsAllowOutFormatter = function (value, rec) {

    if (value == undefined)
        return '';

    if (rec.IsAllowOut == false) {
        return '<span style="color:red">' + value + '</span>';
    } else {
        return value;
    }

}

var IsCallFormatter= function(value) {
    if (value) {
        return '<span style="color:green">已叫号</span>';
    } else {
        return '<span style="color:red">未叫号</span>';
    }
}
var AptStatusFormatter = function (value) {
    if ('正在排队'==value) {
        return '<span>正在排队</span>';
    }
    else if ('正在装车' == value) {
        return '<span style="color:red">正在装车</span>';
    }
    else {
        return '<span style="color:green">完成装车</span>';
    }
}

var formatIsBlackListNameColor = function (str) {
    if (str == '是') {
        return '<span style="color:red">' + str + '</span>';
    } else if (str == '否') {
        return '<span>' + str + '</span>';
    }
}

var formatStatusNameColor = function (str) {
    if (str == '过期作废') {
        return '<span style="color:red">' + str + '</span>';
    } else {
        return '<span>' + str + '</span>';
    }
}
