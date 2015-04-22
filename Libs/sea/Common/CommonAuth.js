//通用权限控制
//tabId:tab控件Id
//toolbar：tabs toolbar数组（包括名称，图标，操作方法）
function checkAuth(tabId, toolbar) {
    //权限控制URL
    var hturl = "../../Authority/GetAuth";
    var resultArr = new Array();
    $.ajax({
        type: "POST",
        async: false,
        url: hturl,
        data: { time: new Date() },
        dataType: 'json',
        error: function (error) {
            ajaxLoadErrorHandler(error);
        },
        success: function (result) {
            var arr = JSON.parse(result.ResponseData);
            for (var i = 0; i < toolbar.length; i++) {
                // 从toolbar中查询出返回结果包含的按钮，并传入到新的数组中
                for (var j = 0; j < arr.length; j++) {
                    if (arr[j] == toolbar[i].keyText) {
                        resultArr.push(toolbar[i]);
                    }
                }
            }
            //初始化tabs tools
            $("#" + tabId).tabs({
                tools: resultArr
            });
        }
    });
}
function checkAuth_Container(container) {
    //权限控制URL
    var hturl = "../../Authority/GetAuth";
    var resultArr = new Array();
    $.ajax({
        type: "POST",
        async: false,
        url: hturl,
        data: { time: new Date() },
        dataType: 'json',
        error: function (error) {
            ajaxLoadErrorHandler(error);
        },
        success: function (result) {
            var arr = JSON.parse(result.ResponseData);
            $("#" + container).find("a").each(function () {
                var flag = false;
                $(this).linkbutton();
                var opts = $(this).linkbutton('options');
                for (var j = 0; j < arr.length; j++) {
                    if (arr[j] == opts.keyText) {
                        flag = true;
                    }
                }
                if (!flag) $(this).css("display", "none");
            });
        }
    });
}
function checkAuth_Datagrid(gridid, toolbar) {
    //权限控制URL
    var hturl = "../../Authority/GetAuth";
    var resultArr = new Array();
    $.ajax({
        type: "POST",
        async: false,
        url: hturl,
        data: { time: new Date() },
        dataType: 'json',
        error: function (error) {
            ajaxLoadErrorHandler(error);
        },
        success: function (result) {
            var arr = JSON.parse(result.ResponseData);
            for (var i = 0; i < toolbar.length; i++) {
                $("#" + toolbar[i].id).hide();
                // 从toolbar中查询出返回结果包含的按钮，并传入到新的数组中
                for (var j = 0; j < arr.length; j++) {
                    if (arr[j] == toolbar[i].keyText) {
                        resultArr.push(toolbar[i]);
                    }
                }
            }
            //初始化datagrid tools
            for (var i in resultArr) {
                var item = resultArr[i];
                $("#" + item.id).show();
            }
            //$("#" + gridid).datagrid({ toolbar: resultArr });
        }
    });
}



