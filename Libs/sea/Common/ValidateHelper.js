

function FormReset(from) {
    $(from).data("validator").resetForm();
    $(from)[0].reset();
}
//验证表单数据是否都通过
var data_validation = "unobtrusiveValidation";
function ValidateFrom(form) {
    var result = true;
    $.each(form.split(','), function (index, item) {
        var validationInfo = $(form.split(',')[index]).data(data_validation);
        var _result = !validationInfo || !validationInfo.validate || validationInfo.validate();
        result = result && _result;
    });
    if (!result) {
        htmsg.show("请确认所有必填项已经填写正确(多选项卡时请切换查看并确认)！");
        return false;
    }
    else return true;
}

$(function () {
    $.extend($.fn.validatebox.defaults.rules, {
        extValTel: {// 验证电话号码 
            validator: function (value) {
                return /^(\(\d{3,4}\)|\d{3,4}-)?\d{1,}$/i.test(value);
            },
            message: '正确格式为XXX-XXXXXXX、XXXX-XXXXXXX、XXXXXXXXXXX'
        },
        extIDCardNo: {
            validator: function (value) {
                return /(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$)/i.test(value);
            },
            message: '请输入正确的身份证号'
        },
        extNumMark: {
            validator: function (value) {
                return /^\d{1,}[0-9\-\/]+$/i.test(value);
            },
            message: '以数字开始，仅能输入数字、-、/'
        }
    });
});

