define(function(require) {


    return function($) {

        $.extend($.fn.combobox.methods, {
            isValid: function(jq) {
                var currentText = jq.combo("textbox").val();
                var arrList = jq.combobox("getData");
                var textField = jq.combobox("options").textField;
                var retValid = true; // 返回结果，true不满足验证，false满足验证
                $.each(arrList, function(index, element) {
                    if (element[textField] == currentText) {
                        retValid = false;
                        return;
                    }
                });
                return retValid;
            },
            disable: function(jq) {
                jq.combo('disable');
                jq.combo('textbox').parent().css("border-color", "#CCCCCC");
                jq.combo('textbox').css("background-color", "#F0EFF0");
                jq.combo('textbox').parent().find(".combo-arrow:first").css("background-color", "#F0EFF0");
            },
            enable: function(jq) {
                jq.combo('enable');
                jq.combo('textbox').parent().css("border-color", "#95B8E7");
                jq.combo('textbox').css("background-color", "#FFFFFF");
                jq.combo('textbox').parent().find(".combo-arrow:first").css("background-color", "#E0ECFF");
            }
            //,
            //selectedIndex: function(jq, index) {
            //	if (!index) {
            //		index = 0;
            //	}
            //	$(jq).combobox({
            //		onLoadSuccess: function() {
            //			var opt = $(jq).combobox('options');
            //			var data = $(jq).combobox('getData');

            //			for (var i = 0; i < data.length; i++) {
            //				if (i == index) {
            //					$(jq).combobox('setValue', eval('data[index].' + opt.valueField));
            //					break;
            //				}
            //			}
            //		}
            //	});
            //}
        });
        $.extend($.fn.datetimebox.methods, {
            disable: function(jq) {
                jq.combo('disable');
                var tempValue = jq.datetimebox('getValue');
                jq.datetimebox({
                    disabled: true,
                    value: tempValue
                });
                jq.combo('textbox').parent().css("border-color", "#CCCCCC");
                jq.combo('textbox').css("background-color", "#F0EFF0");
                jq.combo('textbox').parent().find(".combo-arrow:first").css("background-color", "#F0EFF0");
            },
            enable: function(jq) {
                jq.combo('enable');
                var tempValue = jq.datetimebox('getValue');
                jq.datetimebox({
                    disabled: false,
                    value: tempValue
                });
                jq.combo('textbox').parent().css("border-color", "#95B8E7");
                jq.combo('textbox').css("background-color", "#FFFFFF");
                jq.combo('textbox').parent().find(".combo-arrow:first").css("background-color", "#E0ECFF");
            }
        });
        $.extend($.fn.datebox.methods, {
            disable: function(jq) {
                jq.combo('disable');
                var tempValue = jq.datebox('getValue');
                jq.datebox({
                    disabled: true,
                    value: tempValue
                });
                jq.combo('textbox').parent().css("border-color", "#CCCCCC");
                jq.combo('textbox').css("background-color", "#F0EFF0");
                jq.combo('textbox').parent().find(".combo-arrow:first").css("background-color", "#F0EFF0");
            },
            enable: function(jq) {
                jq.combo('enable');
                var tempValue = jq.datebox('getValue');
                jq.datebox({
                    disabled: false,
                    value: tempValue
                });
                jq.combo('textbox').parent().css("border-color", "#95B8E7");
                jq.combo('textbox').css("background-color", "#FFFFFF");
                jq.combo('textbox').parent().find(".combo-arrow:first").css("background-color", "#E0ECFF");
            }
        });
    }
})