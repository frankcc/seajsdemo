//*****弹出打印窗口*********//
function openPrintWindow(url) {
    window.open(url, 'newwindow',
    ' width=' + (window.screen.availWidth - 10) + ',height=' + (window.screen.availHeight - 30) +
    ', top=0,left=0, toolbar=no, menubar=no, scrollbars=yes, resizable=yes,location=no, status=no');
}
//*****弹出打印层*********//
//url:打印模板加载地址
//div:层div id
function iframeload() {
    LoadEnd();
}
function openPrintDiv(sessionname, div) {
	$("#" + div).empty();
    Loading();
    var printUrl = '/Print/Index?sessionname=' + sessionname;
    var ahtml = "<iframe onload='iframeload()' id='printFrame' width=99% height=99% src=" + printUrl + "></iframe>";
    $("#" + div).html(ahtml);
    $("#" + div).dialog({
        title: '打印',
        width: 820,
        height: 500,
        minimizable: true,
        maximizable: true,
        maximized: true,
        modal: true
    });
}
//*****跳转到登录页面****//
function ajaxLoadErrorHandler(error) {
    LoadEnd();
    var jError = JSON.parse(error.responseText);
    if (!jError.IsError) return;
    if (jError.ResultCode == 3) {
        alert(jError.Description);
        top.window.location.href = "../Login/LoginIn";
    }
    else {
        $.messager.show({
            title: '提示消息',
            msg: jError.Description
        });
    }
}
//设置下拉框验证内容
function SetDataVal(jq) {
    jq.each(function () {
        $(this).attr("data-val", true);
        $(this).attr("data-val-required", "请至少选中一项");
    });
}
//清除输入内容、修改输入状态
function FormStatusChange(parentid, readonly, clear) {
 var _parentid = parentid.split(',');
 $.each(_parentid, function (index, element) {
     $("#" + _parentid[index]).attr("caninput", !readonly);
     $("#" + _parentid[index] + " .inputbox").each(function () {
         $(this).attr("readonly", readonly);
         if (clear) $(this).val("");
     });
     $("#" + _parentid[index] + " textarea").each(function () {
         $(this).attr("readonly", readonly);
         if (clear) $(this).val("");
     });
     $("#" + _parentid[index] + " input:checkbox").each(function () {
         $(this).attr("disabled", readonly);
         if (clear) $(this).attr("checked", false);
     });
     $("#" + _parentid[index] + " .easyui-combobox").each(function () {
         if (readonly) {
             $(this).combobox('disable');
         }
         else {
             $(this).combobox('enable');
         }
         if (clear) $(this).combobox('selectedIndex', 0);
     });
     $("#" + _parentid[index] + " .easyui-datetimebox").each(function () {
         if (readonly) {
             $(this).datetimebox('disable');
         }
         else {
             $(this).datetimebox('enable');
         }
         if (clear) $(this).datetimebox('setValue', '');
     });
     $("#" + _parentid[index] + " .easyui-datebox").each(function () {
         if (readonly) {
             $(this).datebox('disable');
         }
         else {
             $(this).datebox('enable');
         }
         if (clear) $(this).datebox('setValue', '');
     });
     $("#" + _parentid[index] + " .easyui-numberbox").each(function () {
         if (readonly) { $(this).numberbox('disable'); }
         else { $(this).numberbox('enable'); }
         if (clear) {
             $(this).numberbox('clear');
             $(this).numberbox('setValue', $(this).numberbox('options').min);
         }
     });
 });
}
//判断数组是否存在值
function inArray(array, value) {
    for (var i in array) {
        if (value == array[i])
            return true;
    }
    return false;
}
//从combobox中返回data
function GetData(id) {
    var arr = new Array();
    try {
        var Data = $("#" + id).combobox('getData');
        if (!Data) return;
        for (var i in Data) {
            arr.push({ text: Data[i].text, value: Data[i].value });
        }
        return arr;
    }
    catch (err) {
        return arr;
    }
}
//*******获取下拉列表框指定value,text属性*******//
//cmdId:下拉列表框ID
//value:下拉列表框值value
//text:下拉列表框显示文字
function GetComboData(cmdId, value, text) {
    var arr = new Array();
    try {
        var Data = $("#" + cmdId).combobox('getData');
        if (!Data) return;
        for (var i in Data) {
            var item = new Object();
            var _value = "";
            var _text = "";
            //遍历对象属性
            for (var propety in Data[i]) {
                if (propety == value) {
                    _value = Data[i][propety];
                }
                if (propety == text) {
                    _text = Data[i][propety];
                }
            }
            item[value] = _value;
            item[text] = _text;
            arr.push(item);
        }
        return arr;
    } catch (err) {
        return arr;
    }
}

function GetComboDataByDom(dom) {
    var arr = new Array();
    try {
        var Data = $(dom).combobox('getData');
        if (!Data) return;
        for (var i in Data) {
            var item = new Object();
            //遍历对象属性
            for (var propety in Data[i]) {
                if (propety != "domId") {
                    item[propety] = Data[i][propety];
                }
            }
            arr.push(item);
        }
        return arr;
    } catch (err) {
        return arr;
    }
}
//判断传入的值是否存在于数组某属性中并返回索引
//arr 复杂对象数组
//key 要验证的属性
//value 要验证的值
//return 索引 -1为不存在
var CheckInArrayIndex = function (arr, key, value) {
    var index = -1;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i][key] == value) {
            index = i;
        }
    }
    return index;
};

//获取当前编辑行
function getEditField(gridid, field) {
    var rows = $("#" + gridid).datagrid('getRows');
    for (var i in rows) {
        var index = $("#" + gridid).datagrid('getRowIndex', rows[i]);
        var obj = $("#" + gridid).datagrid('getEditor', { index: index, field: field });
        if (obj != null)
            return $(obj.target);
    }
    return null;
}
//初始化表格数据并且出现横向滚动条
function initGridStyle(gridid) {
    $("#" + gridid).datagrid('loadData', { "total": 0, "rows": [{}] });
    $("#" + gridid).parent().find(".datagrid-view2").find(".datagrid-body table").css("visibility", "hidden");
    $("#" + gridid).parent().find(".datagrid-view1").find(".datagrid-body table").css("visibility", "hidden");
}