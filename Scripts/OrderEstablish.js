var lastIndex = -1;
var skuCodeSource = new Array();
var skuInfoSource;
var ConPeoSource = new Array();
var pagetype = new Array();
var defaultUnit = 0;
var skuId = 0;
var skuWeight = 0;
var skuVolume = 0;
var calcRate = 0;
var skuCalcRate = 0;
var customerAftQuery;
var ConsigneeIDAftQuery;
var selectUnit = 0; var afterQuey = false;
var orderInfoQuery;
var OrderTypeAftQuery;
var editFlag = false;
var proceeStatus;
var query = false;
var areaCode;
var cus = "", coninee = "", conineepeople = "";

$(function () {
    var start=new Date();
    InitGrid();
    InitPage();
    InitButton();
    toolDisAble();
    InitOrderType();
    FormStatusChange("form0", true, false);
    //checkAuth_Container("toolbar");
    // $.ajax({
    //     type: 'POST',
    //     url: "/SkuInfo/GetAllSku",
    //     dataType: 'json',
    //     data: { term: '' },
    //     success: function (resultSku) {
    //         skuInfoSource = resultSku;
    //         skuCodeSource = [];
    //         for (var i in skuInfoSource) {
    //             skuCodeSource.push(skuInfoSource[i].Code);
    //         }
    //     },
    //     error: function (error) {
    //         ajaxLoadErrorHandler(error);
    //     }
    // });
var end=new Date();
console.log( end.getTime()-start.getTime());
});

//明细列表初始化
var InitGrid = function () {
    $("#divOrderDetail").datagrid({
        data: { "total": 0, "rows": [] },
        onLoadError: function (error) {
            ajaxLoadErrorHandler(error);
        },
        height: 200,
        rownumbers: true,
        columns: [[
            { field: "ID", hidden: true },
            { field: "PackageCode", hidden: true, editor: { type: 'text' } },
		    { field: "PackageID", hidden: true, editor: { type: 'text' } },
            { field: "DetailStatus", hidden: true },
            { field: "SkuCode", title: "物料编码", width: 100, align: "left", editor: { type: 'validatebox', options: { required: true } } },
            { field: "SkuID", hidden: true, editor: { type: 'text' } },
            { field: "SkuName", title: "物料名称", width: 160, align: "left", editor: { type: 'text' } },
            { field: "Standard", title: "规格", width: 160, align: "left", editor: { type: 'text' } },
            { field: "PackageName", title: "包装形式", width: 120, align: "left", editor: { type: 'text' } },
            { field: "UnitName", title: "单位", width: 100, align: "left", editor: { type: 'text' } },
            { field: "DetailStatusName", title: "订单行状态", width: 100, align: "left", editor: { type: 'text' } },
            { field: "OrderAmount", title: "订单数量", width: 120, align: "right", formatter: formatDecimal6, editor: { type: 'numberbox', options: { required: true, min: 0.000001, precision: 6 } } },
            { field: "Remark", title: "备注", width: 160, align: "left", editor: { type: 'text' } }
        ]],
        toolbar: [{
            id: 'gridBtnAdd',
            text: '添加',
            iconCls: 'icon-add',
            handler: function () {
                $("#divOrderDetail").css("margin-bottom", "120px");
                if (!validateSkuTable()) {
                    htmsg.show("存在未保存的行,不能添加下一行!");
                    return;
                }
                $('#divOrderDetail').datagrid('endEdit', lastIndex);
                $('#divOrderDetail').datagrid('appendRow', {
                    SkuCode: '', SkuName: '', UnitName: '', DetailStatus: '15001',
                    DetailStatusName: $("#lbStatus").val(), OrderNum: '', Remark: ''
                });
                lastIndex = $('#divOrderDetail').datagrid('getRows').length - 1;
                $('#divOrderDetail').datagrid('beginEdit', lastIndex);
                detailEditorEvent(lastIndex);
            }
        }, '-', {
            id: 'gridBtnEdit',
            text: '修改',
            iconCls: 'icon-edit',
            handler: function () {
                editFlag = true;
                var row = $("#divOrderDetail").datagrid('getSelected');
                if (!row) {
                    htmsg.show("请选中一行明细进行操作");
                    return;
                }
                var rowIndex = $("#divOrderDetail").datagrid('getRowIndex', row);
                if (lastIndex != rowIndex) {
                    if (!validateSkuTable()) {
                        htmsg.show("存在未保存的行,不能添加下一行!");
                        return;
                    }
                }
                $('#divOrderDetail').datagrid('endEdit', lastIndex);
                $('#divOrderDetail').datagrid('beginEdit', rowIndex);
                detailEditorEvent(rowIndex);
                lastIndex = rowIndex;
            }
        }, '-', {
            id: 'girdBtnDel',
            text: '删除',
            iconCls: 'icon-remove',
            handler: function () {
                var row = $('#divOrderDetail').datagrid('getSelected');
                if (row) {
                    var index = $('#divOrderDetail').datagrid('getRowIndex', row);
                    $('#divOrderDetail').datagrid('deleteRow', index);
                }
            }
        }, '-', {
            id: 'gridBtnSave',
            text: '保存行',
            iconCls: 'icon-save',
            handler: function () {
                if (!validateSkuInfo()) {
                    return;
                }
                $("#divOrderDetail").datagrid('acceptChanges');
            }
        }],
        singleSelect: true
    });
};
//订单明细编辑事件
var detailEditorEvent = function (index) {
    var SkuCode = $("#divOrderDetail").datagrid('getEditor', { index: index, field: 'SkuCode' });
    var SkuID = $("#divOrderDetail").datagrid('getEditor', { index: index, field: 'SkuID' });
    var SkuName = $("#divOrderDetail").datagrid('getEditor', { index: index, field: 'SkuName' });
    var Standard = $("#divOrderDetail").datagrid('getEditor', { index: index, field: 'Standard' });
    var UnitName = $("#divOrderDetail").datagrid('getEditor', { index: index, field: 'UnitName' });
    var DetailStatusName = $("#divOrderDetail").datagrid('getEditor', { index: index, field: 'DetailStatusName' });
    var PackageCode = $("#divOrderDetail").datagrid('getEditor', { index: index, field: 'PackageCode' });
    var PackageID = $("#divOrderDetail").datagrid('getEditor', { index: index, field: 'PackageID' });
    var PackageName = $("#divOrderDetail").datagrid('getEditor', { index: index, field: 'PackageName' });
    var Remark = $("#divOrderDetail").datagrid('getEditor', { index: index, field: 'Remark' });


    $(SkuCode.target).autocomplete({
        source: function (request, response) {
            // $.ajax({
            //     type: 'POST',
            //     url: "/SkuInfo/GetAllSku",
            //     dataType: 'json',
            //     data: { term: request.term },
            //     success: function (resultSku) {
            //         skuInfoSource = resultSku;
            //         skuCodeSource = [];
            //         for (var i in skuInfoSource) {
            //             skuCodeSource.push(skuInfoSource[i].Code);
            //         }
            //         response($.map(skuInfoSource, function (item) {
            //             return {
            //                 label: item.Code,
            //                 value: item.Code,
            //                 data: item
            //             }
            //         }));

            //     },
            //     error: function (error) {
            //         ajaxLoadErrorHandler(error);
            //     }
            // });

        },
        select: function (e, ui) {
            for (var i in skuInfoSource) {
                if (ui.item.value == skuInfoSource[i].Code) {
                    SkuName.target.val(skuInfoSource[i].Name);
                    SkuID.target.val(skuInfoSource[i].ID);
                    Standard.target.val(skuInfoSource[i].Standard);
                    UnitName.target.val(skuInfoSource[i].UnitName);
                    PackageCode.target.val("");
                    PackageName.target.val("");
                    Remark.target.val("");
                    $(PackageName.target).autocomplete({
                        source: function (request, response) {
                            // $.ajax({
                            //     type: 'POST',
                            //     url: "/PackType/GetPackTypeBySkuCode",
                            //     dataType: 'json',
                            //     data: { skuCode: ui.item.value, term: request.term },
                            //     success: function (data) {

                            //         response($.map(data, function (item) {
                            //             return {
                            //                 label: item.Code + "-" + item.Name,
                            //                 value: item.Name,
                            //                 data: item
                            //             }
                            //         }));
                            //     },
                            //     error: function (error) {
                            //         ajaxLoadErrorHandler(error);
                            //     }
                            // });

                        },
                        select: function (e, ui) {
                            PackageCode.target.val(ui.item.data.Code);
                            PackageID.target.val(ui.item.data.ID);
                        },
                        change: function (e, ui) {
                            if (ui.item == null) {
                                PackageCode.target.val("");
                                PackageID.target.val("");
                                PackageName.target.val("");
                            }
                        }
                    });
                }
            }

        }
    });

    $(PackageName.target).autocomplete({
        source: function (request, response) {
            // $.ajax({
            //     type: 'POST',
            //     url: "/PackType/GetPackTypeBySkuCode",
            //     dataType: 'json',
            //     data: { skuCode: SkuCode.target.val(), term: request.term },
            //     success: function (data) {
            //         response($.map(data, function (item) {
            //             return {
            //                 label: item.Code + "-" + item.Name,
            //                 value: item.Name,
            //                 data: item
            //             }
            //         }));
            //     },
            //     error: function (error) {
            //         ajaxLoadErrorHandler(error);
            //     }
            // });

        },
        select: function (e, ui) {
            PackageCode.target.val(ui.item.data.Code);
            PackageID.target.val(ui.item.data.ID);
        },
        change: function (e, ui) {
            if (ui.item == null) {
                PackageName.target.val("");
                PackageCode.target.val("");
                PackageID.target.val("");
            }
        }
    });

    $(SkuName.target).attr("disabled", "true");
    $(Standard.target).attr("disabled", "true");
    $(UnitName.target).attr("disabled", "true");
    $(DetailStatusName.target).attr("disabled", "true");
};
//页面初始化
var InitPage = function () {
    $("#OrderNo").searchbox({
        searcher: queryOrder
    });

    InitGrid();
    $("#OrderNo").searchbox("enable");

    $("#TransportType").combobox({
        valueField: 'ID',
        textField: 'Text',
        editable: false,
        panelHeight: 'auto'
    });

    $("#SettlementType")
        .combobox({
            valueField: 'ID',
            textField: 'Text',
            editable: false,
            panelHeight: 'auto',
            onSelect: function (row) {
                if (row.ID == 18001) {
                    $("#PayMoneyBack,#PayMoneyArrive,#PayMoneyNow").removeAttr("disabled");
                } else {
                    $("#ShouldPayFor,#PayMoneyBack,#PayMoneyArrive,#PayMoneyNow").numberbox("setValue", 0);
                    $("#PayMoneyBack,#PayMoneyArrive,#PayMoneyNow").attr("disabled", "disable");
                }
            }
        });

    $("#OrderType").combobox({
        valueField: 'ID',
        textField: 'OrderType',
        editable: false,
        panelHeight: 'auto',
        //url: "/OrderDeal/GetOrderTypeData"
    });

    $("#DeliveryMode").combobox({
        valueField: 'ID',
        textField: 'Text',
        editable: false,
        panelHeight: 'auto'
    });

    $("#OrderTime,#RequireArriveTime").datetimebox({
        showSeconds: true,
        editable: false
    });
    $("#ShouldPayFor").attr("readonly", true);
    $("#PayMoneyNow,#PayMoneyBack,#PayMoneyArrive,#ShouldPayFor").numberbox({
        min: 0,
        precision: 6
    });

    $("#PayMoneyNow,#PayMoneyBack,#PayMoneyArrive").bind("change", culCarr);

    $("#CustomerName").autocomplete({
        source: function (request, response) {

            // $.ajax({
            //     url: "/Customer/GetCustomerByUserIdAutoComplete",
            //     type: "POST",
            //     dataType: 'json',
            //     data: { term: request.term },
            //     success: function (data) {
            //         response($.map(data, function (item) {
            //             return {
            //                 label: item.Code + "-" + item.Name,
            //                 value: item.Name,
            //                 data: item
            //             }
            //         }));
            //     }
            // });
        },
        select: function (e, ui) {
            $("#CustomerCode").val(ui.item.data.Code);
            $("#CustomerID").val(ui.item.data.ID);
        },
        change: function (e, ui) {

            if (ui.item == null) {
                $("#CustomerCode").val("");
                $("#CustomerID").val("");
            }
            if (cus != $("#CustomerName").val() && cus != "") {
                clearconsinee();
            }
            cus = $("#CustomerName").val();
        }
    });

    $("#ConsigneeName").autocomplete({
        source: function (request, response) {
            if ($('#CustomerCode').val() != "") {
                // $.ajax({
                //     url: "/Consignee/GetConsigneeByCustomerCodeAutoComplete",
                //     type: "POST",
                //     dataType: 'json',
                //     data: { CustomerCode: $('#CustomerCode').val(), term: request.term },
                //     success: function (data) {
                //         response($.map(data, function (item) {
                //             return {
                //                 label: item.Code + "-" + item.Name,
                //                 value: item.Name,
                //                 data: item
                //             }
                //         }));
                //     }
                // });
            }

        },
        select: function (e, ui) {
            $("#ConsigneeCode").val(ui.item.data.Code);
            $("#ConsigneeID").val(ui.item.data.ID);
        },
        change: function (e, ui) {
            if (ui.item == null) {
                $("#ConsigneeCode").val("");
                $("#ConsigneeID").val("");
            }

            if (coninee != $("#ConsigneeName").val() && coninee != "") {
                clearconsineepeople();
            }
            coninee = $("#CustomerName").val();
        }
    });

    $("#ConsigneePeople").autocomplete({
        source: function (request, response) {
            if ($('#ConsigneeCode').val() != "") {
                // $.ajax({
                //     type: 'POST',
                //     url: "/Consignee/GetConsigneeAddressComboxAutoComplete",
                //     data: { ConsigneeCode: $("#ConsigneeCode").val(), term: request.term },
                //     dataType: 'json',
                //     success: function (data) {
                //         response($.map(data, function (item) {
                //             return {
                //                 label: item.AreaCode + "-" + item.ConsigneeName,
                //                 value: item.ConsigneeName,
                //                 data: item
                //             }
                //         }));

                //     },
                //     error: function (error) {
                //         ajaxLoadErrorHandler(error);
                //     }
                // });
            }
        },
        select: function (e, ui) {
            areaCode = ui.item.data.AreaCode;
            $("#selProvince").combobox("setValue", ui.item.data.Province);
            $("#selCity").combobox("setValue", ui.item.data.City);
            $("#selDistrict").combobox("setValue", ui.item.data.District);
            $("#selTown").combobox("setValue", ui.item.data.Town);
            //$("#AreaName").val(myjson.AreaName);
            var citytmp = $("#selCity").combobox("getText");
            var districttmp = $("#selDistrict").combobox("getText");
            // $.ajax({
            //     type: 'POST',
            //     url: "/Bas/Area/GetArea?type=GetCityByProvince",
            //     data: { para: $("#selProvince").combobox("getText") },
            //     dataType: 'json',
            //     success: function (result) {
            //         LoadEnd();
            //         $("#selCity").combobox("reset");
            //         $("#selCity").combobox("loadData", result);
            //         $("#selCity").combobox("setValue", citytmp);
            //     },
            //     error: function (error) {
            //         ajaxLoadErrorHandler(error);
            //     }
            // });
            // $.ajax({
            //     type: 'POST',
            //     url: "/Bas/Area/GetArea?type=GetDistrictByCity",
            //     data: { para: $("#selCity").combobox("getText") },
            //     dataType: 'json',
            //     success: function (result) {
            //         LoadEnd();
            //         $("#selDistrict").combobox("reset");
            //         $("#selDistrict").combobox("loadData", result);
            //         $("#selDistrict").combobox("setValue", districttmp);
            //     },
            //     error: function (error) {
            //         ajaxLoadErrorHandler(error);
            //     }
            // });
            // $.ajax({
            //     type: 'POST',
            //     url: "/Bas/Area/GetArea?type=GetTownByDistrict",
            //     data: { para: $("#selDistrict").combobox("getText") },
            //     dataType: 'json',
            //     success: function (result) {
            //         LoadEnd();
            //         $("#selTown").combobox("reset");
            //         $("#selTown").combobox("loadData", result);
            //         $("#selTown").combobox("setValue", areaCode);
            //     },
            //     error: function (error) {
            //         ajaxLoadErrorHandler(error);
            //     }
            // });

            $("#AreaCode").val(ui.item.data.AreaCode);
            $("#ConsigneePhone").val(ui.item.data.ContactPhone);
            $("#ConsigneeAddress").val(ui.item.data.Address);
            conineepeople = $("#ConsigneePeople").val();
        },
        change: function (e, ui) {
            if (ui.item == null) {
                $("#AreaCode").val("");
                $("#ConsigneePhone").val("");
                $("#ConsigneeAddress").val("");
            }

            if (conineepeople != $("#ConsigneePeople").val() && conineepeople != "") {
                clearaddress();
            }
            conineepeople = $("#ConsigneePeople").val();
        }
    });

    $("#selProvince").combobox({
        //url: "/Bas/Area/GetArea?type=GetAllProvince",
        valueField: 'Province',
        textField: 'Province',
        editable: false,
        value: '-请选择-',
        panelHeight: '200',
        onSelect: function (rec) {
            Loading();
            // $.ajax({
            //     type: 'POST',
            //     url: "/Bas/Area/GetArea?type=GetCityByProvince",
            //     data: { para: $("#selProvince").combobox("getText") },
            //     dataType: 'json',
            //     success: function (result) {
            //         LoadEnd();
            //         $("#selCity").combobox("reset");
            //         $("#selCity").combobox("loadData", result);
            //         $("#selDistrict").combobox("reset");
            //         $("#selDistrict").combobox("loadData", [{ AreaCode: "0", Province: "-请选择-" }]);
            //         $("#selTown").combobox("reset");
            //         $("#selTown").combobox("loadData", [{ AreaCode: "0", Town: "-请选择-" }]);
            //         $("#AreaName").val("");
            //     },
            //     error: function (error) {
            //         ajaxLoadErrorHandler(error);
            //     }
            // });
        }
    });

    $("#selCity").combobox({
        valueField: 'City',
        textField: 'City',
        editable: false,
        value: '-请选择-',
        panelHeight: '200',
        onSelect: function (rec) {
            Loading();
            // $.ajax({
            //     type: 'POST',
            //     url: "/Bas/Area/GetArea?type=GetDistrictByCity",
            //     data: { para: $("#selCity").combobox("getText") },
            //     dataType: 'json',
            //     success: function (result) {
            //         LoadEnd();
            //         $("#selDistrict").combobox("reset");
            //         $("#selDistrict").combobox("loadData", result);
            //         $("#selTown").combobox("reset");
            //         $("#selTown").combobox("loadData", [{ AreaCode: "0", Town: "-请选择-" }]);
            //         $("#AreaName").val("");
            //     },
            //     error: function (error) {
            //         ajaxLoadErrorHandler(error);
            //     }
            // });
        }
    });

    $("#selDistrict").combobox({
        valueField: 'District',
        textField: 'District',
        editable: false,
        value: '-请选择-',
        panelHeight: '200',
        onSelect: function (rec) {
            Loading();
            // $.ajax({
            //     type: 'POST',
            //     url: "/Bas/Area/GetArea?type=GetTownByDistrict",
            //     data: { para: $("#selDistrict").combobox("getText") },
            //     dataType: 'json',
            //     success: function (result) {
            //         LoadEnd();
            //         $("#selTown").combobox("reset");
            //         $("#selTown").combobox("loadData", result);
            //         $("#AreaName").val("");
            //     },
            //     error: function (error) {
            //         ajaxLoadErrorHandler(error);
            //     }
            // });
        }
    });
    $("#selTown").combobox({
        valueField: 'AreaCode',
        textField: 'Town',
        editable: false,
        value: '0',
        panelHeight: '200'
    });
};
//查询事件
var queryOrder = function () {
    var orderNo = $("#OrderNo").searchbox("getValue");
    $("#divOrderDetail").datagrid('loadData', { total: 0, rows: [] });
    if (orderNo == "") {
        htmsg.show("订单号不能为空"); return;
    }
    FormReset('#form0');
    Loading();
    // $.ajax({
    //     type: "POST",
    //     url: '/Order/OrderEstablish/GetOrderInfoByOrderNo',
    //     data: { orderNo: orderNo },
    //     dataType: 'json',
    //     success: function (result) {

    //         if (result.Description != '操作成功') {
    //             LoadEnd();
    //             htmsg.show(result.Description);
    //             return;
    //         }
    //         FormStatusChange("form0", true, true);
    //         var pdata = $.parseJSON(result.ResponseData);
    //         orderInfoQuery = pdata;
    //         query = true;
    //         $('#form0').form('load', pdata);
    //         $("#divOrderDetail").datagrid({ data: pdata.OrderDetails });
    //         customerAftQuery = pdata.CustomerID;
    //         ConsigneeIDAftQuery = pdata.ConsigneeID;
    //         $("#ID").val(pdata.ID);
    //         if (pdata.OrderStatus == 15001) {
    //             $("#btnOrderEdit,#btnOrderDelete,#btnOrderSave").linkbutton("enable");
    //         }
    //         $("#OrderType").combobox("setValue", pdata.OrderType);
    //         $("#TransportType").combobox("setValue", pdata.TransportTypeCode == null ? '-1' : pdata.TransportTypeCode);
    //         $("#SettlementType").combobox("setValue", pdata.SettlementType);
    //         $('#DeliveryMode').combobox("setValue", pdata.DeliveryMode);
    //         $("#CustomerCode").val(pdata.CustomerCode);
    //         $("#OrderTime").datetimebox('setValue', formatDateTime(pdata.OrderTime));
    //         $("#RequireArriveTime").datetimebox('setValue', formatDateTime(pdata.RequireArriveTime));
    //         $('#ConsigneeCode').val(pdata.ConsigneeCode);
    //         areaCode = pdata.AreaCode;
    //         $("#selProvince").combobox("setValue", pdata.Province);
    //         $("#selCity").combobox("setValue", pdata.City);
    //         $("#selDistrict").combobox("setValue", pdata.District);
    //         $("#selTown").combobox("setValue", pdata.Town);
    //         var citytmp = $("#selCity").combobox("getText");
    //         var districttmp = $("#selDistrict").combobox("getText");
    //         var price = 0;
    //         var a = parseFloat(pdata.PayMoneyNow);
    //         var b = parseFloat(pdata.PayMoneyBack);
    //         var c = parseFloat(pdata.PayMoneyArrive);
    //         price = a + b + c;
    //         $("#ShouldPayFor").numberbox('setValue', price.toFixed(6));
    //         $.ajax({
    //             type: 'POST',
    //             url: "/Bas/Area/GetArea?type=GetCityByProvince",
    //             data: { para: $("#selProvince").combobox("getText") },
    //             dataType: 'json',
    //             success: function (result1) {
    //                 LoadEnd();
    //                 $("#selCity").combobox("reset");
    //                 $("#selCity").combobox("loadData", result1);
    //                 $("#selCity").combobox("setValue", citytmp);
    //             },
    //             error: function (error) {
    //                 ajaxLoadErrorHandler(error);
    //             }
    //         });
    //         $.ajax({
    //             type: 'POST',
    //             url: "/Bas/Area/GetArea?type=GetDistrictByCity",
    //             data: { para: $("#selCity").combobox("getText") },
    //             dataType: 'json',
    //             success: function (result1) {
    //                 LoadEnd();
    //                 $("#selDistrict").combobox("reset");
    //                 $("#selDistrict").combobox("loadData", result1);
    //                 $("#selDistrict").combobox("setValue", districttmp);
    //             },
    //             error: function (error) {
    //                 ajaxLoadErrorHandler(error);
    //             }
    //         });
    //         $.ajax({
    //             type: 'POST',
    //             url: "/Bas/Area/GetArea?type=GetTownByDistrict",
    //             data: { para: $("#selDistrict").combobox("getText") },
    //             dataType: 'json',
    //             success: function (result1) {
    //                 LoadEnd();
    //                 $("#selTown").combobox("reset");
    //                 $("#selTown").combobox("loadData", result1);
    //                 $("#selTown").combobox("setValue", pdata.AreaCode);
    //             },
    //             error: function (error) {
    //                 ajaxLoadErrorHandler(error);
    //             }
    //         });
    //         $("#AreaCode").val(pdata.AreaCode);
    //         //查询后  保存不能使用
    //         $('#btnOrderSave').linkbutton("disable");
    //         $("#gridBtnAdd,#girdBtnDel,#gridBtnSave,#gridBtnEdit").linkbutton("disable");
    //         $('#btnClear').linkbutton("enable");
    //         LoadEnd();
    //     },
    //     error: function (error) {
    //         ajaxLoadErrorHandler(error);
    //     }
    // });
};

var validateSkuInfo = function () {
    var selections = $("#divOrderDetail").datagrid('getRows');
    for (var i in selections) {
        var index = $("#divOrderDetail").datagrid('getRowIndex', selections[i]);
        var validateRlt = $("#divOrderDetail").datagrid("validateRow", index);
        var SkuCode = $("#divOrderDetail").datagrid('getEditor', { index: index, field: 'SkuCode' });
        if (SkuCode != null) {
            if ($.inArray(SkuCode.target.val(), skuCodeSource) == -1) {
                htmsg.show("物料编码不存在,请重新输入!");
                return false;
            }
        }
        if (!validateRlt) {
            htmsg.show("订单明细当前行输入不通过或者未输入!");
            return false;
        }
    }
    $("#divOrderDetail").datagrid('acceptChanges');
    return true;
};
//验证产品明细输入
var validateSkuTable = function () {
    var selections = $("#divOrderDetail").datagrid('getRows');
    for (var i in selections) {
        var index = $("#divOrderDetail").datagrid('getRowIndex', selections[i]);
        var validateRlt = $("#divOrderDetail").datagrid("validateRow", index);
        if (!validateRlt) return false;
    }
    $("#divOrderDetail").datagrid('acceptChanges');
    return true;
};

//物料编辑事件
var SkuCodeEditorEvent = function (index) {
    var SkuCode = $("#divOrderDetail").datagrid('getEditor', { index: index, field: 'SkuCode' });
    var SkuName = $("#divOrderDetail").datagrid('getEditor', { index: index, field: 'SkuName' });
    var UnitName = $("#divOrderDetail").datagrid('getEditor', { index: index, field: 'UnitName' });
    if (!SkuCode) return;
    $(SkuCode.target).autocomplete({
        source: skuCodeSource,
        select: function (e, ui) {
            for (var i in skuInfoSource) {
                if (ui.item.value == skuInfoSource[i].Code) {

                    SkuName.target.val(skuInfoSource[i].Name);
                }
            }


        }
    });
};

//按钮初始化
var InitButton = function () {
    $("#btnOrderAdd,#btnOrderDelete,#btnOrderEdit,#btnOrderSave,#btnClear").linkbutton();
    $("#btnOrderSave").bind('click', function () {
        Save();
    });
    $("#btnOrderAdd").bind('click', function () {
        NewForm();
    });
    $("#btnOrderEdit").bind('click', function () {
        edit();
    });
    $("#btnOrderDelete").bind('click', function () {
        deleteOrder();
    });
    $("#btnOrderSave,#btnOrderEdit,#btnOrderDelete").linkbutton('disable');
    $("#btnClear").bind('click', function () {
        clearForm();
    });
};

var InitOrderType = function () {
    // $.ajax({
    //     type: 'POST',
    //     url: "/Const/GetDeliveryMode",
    //     dataType: 'json',
    //     success: function (result) {
    //         $("#DeliveryMode").combobox("reset");
    //         $("#DeliveryMode").combobox("loadData", result);
    //     },
    //     error: function (error) {
    //         ajaxLoadErrorHandler(error);
    //     }
    // });
};
//显示按钮
var toolEnable = function () {
    $("#gridBtnAdd,#girdBtnDel,#gridBtnSave,#gridBtnEdit").linkbutton("enable");
    $("#btnOrderSave,#btnOrderEdit,#btnOrderDelete").linkbutton('enable');
};
//隐藏按钮
var toolDisAble = function () {
    $("#gridBtnAdd,#girdBtnDel,#gridBtnSave,#gridBtnEdit").linkbutton("disable");
    $("#btnOrderSave,#btnOrderEdit,#btnOrderDelete,#btnClear").linkbutton('disable');
};

var NewForm = function () {
    FormReset("#form0");

    FormStatusChange("form0", false, true);
    clearld();
    //$("#OrderNo").searchbox("setValue", "XLX" + timeStamp2String(Date.parse(new Date())));
    $("#OrderNo").searchbox("setValue", "保存后显示单号");
    $("#OrderNo").searchbox("disable");
    $("#OrderType").combobox("setValue", 12);
    $("#SettlementType").combobox("setValue", "18001");
    $("#TransportType").combobox("setValue", "-1");
    $("#DeliveryMode").combobox("setValue", "23001");
    $("#lbStatus").val("订单建立");
    $("#divOrderDetail").datagrid('loadData', { total: 0, rows: [] });
    $("#btnOrderSave,#btnClear").linkbutton("enable");
    toolEnable();
    $("#ID").val("");
    $("#OrderTime").datetimebox('setValue', (new Date()).Format('yyyy-MM-dd hh:mm:ss'));
    $("#gridBtnAdd,#girdBtnDel,#gridBtnSave,#gridBtnEdit").linkbutton("enable");
    $("#btnOrderEdit,#btnOrderDelete").linkbutton("disable");
    $("#ShouldPayFor").attr("readonly", true);
};

var Save = function () {
    if ($("#lbStatus").val() != "订单建立") {
        htmsg.show("订单已处理，不能保存！");
        return;
    }
    if (!ValidateFrom('#form0')) return;
    //判断主档是否存在
    if ($("#CustomerCode").val() == "") {
        htmsg.show('客户主档信息不存在！');
        return;
    }
    //判断收货方
    if ($('#ConsigneeCode').val() == "") {
        htmsg.show('收货方不存在！');
        return;
    }
    //判断省市区是否选择
    if ($("#selTown").combobox("getValue") == "0") {
        htmsg.show('请选择收货地址！');
        return;
    }
    //判断订单类型
    if ($("#OrderType").combobox('getValue') == -1) {
        htmsg.show("请选择订单类型！");
        return;
    }
    if ($("#OrderType").combobox('getValue') == 12 && $("#TransportType").combobox('getValue') == -1) {
        htmsg.show("请选择运输方式！");
        return;
    }
    if ($('#SettlementType').combobox("getValue") == -1) {
        htmsg.show("请选择结算方式！");
        return;
    }
    if ($('#DeliveryMode').combobox("getValue") == -1) {
        htmsg.show("请选择配送模式！");
        return;
    }

    var param = {};
    if ($("#ID").val() == "" || $("#ID").val() == null) {
        param.ID = 0;
    } else {
        param.ID = $("#ID").val();
    }
    //订单信息
    param.OrderNo = $("#OrderNo").searchbox('getValue');
    param.OrderType = $("#OrderType").combobox('getValue');
    if ($("#TransportType").combobox('getText') != "-请选择-") {
        param.TransportTypeCode = $("#TransportType").combobox('getValue');
    } else {
        param.TransportTypeCode = "-1";
    }
    param.OrderStatus = 15001;
    //客户信息
    param.CustomerCode = $("#CustomerCode").val();
    param.CustomerID = $("#CustomerID").val();
    param.CusOrderNo = $("#CusOrderNo").val();
    //收货方
    param.ConsigneeCode = $("#ConsigneeCode").val();
    param.ConsigneeID = $("#ConsigneeID").val();
    param.ConsigneePeople = $("#ConsigneePeople").val();
    param.AreaCode = $("#selTown").combobox('getValue');
    param.ConsigneePhone = $("#ConsigneePhone").val();
    param.ConsigneeAddress = $("#ConsigneeAddress").val();
    //结算
    param.SettlementType = $("#SettlementType").combobox('getValue');
    param.DeliveryMode = $("#DeliveryMode").combobox('getValue');
    param.PayMoneyNow = $("#PayMoneyNow").numberbox("getValue");
    param.PayMoneyBack = $("#PayMoneyBack").numberbox("getValue");
    param.PayMoneyArrive = $("#PayMoneyArrive").numberbox("getValue");
    //运输线路
    param.OrderTime = $("#OrderTime").datetimebox('getValue');
    param.RequireArriveTime = $("#RequireArriveTime").datetimebox('getValue');
    param.Remark = $("#Remark").val();
    //订单明细
    param.OrderDetails = $("#divOrderDetail").datagrid("getRows");
    if (!param.OrderDetails || param.OrderDetails.length == 0) {
        htmsg.show("请至少录入一条物料明细!");
        return;
    }
    if (!validateSkuInfo()) return;
    htmsg.confim('确定保存该条记录?',
        function () {
            Loading();
            // $.ajax({
            //     type: "POST",
            //     url: '/Order/OrderEstablish/Save',
            //     data: JSON.stringify(param),
            //     contentType: "application/json;charset=utf-8",
            //     success: function (result) {
            //         LoadEnd();
            //         htmsg.show(result.Description);
            //         FormStatusChange("form0", true, false);
            //         //设置ID为1  标记是修改状态
            //         $('#ID').val('1');
            //         $("#OrderNo").searchbox("enable");
            //         if (result.ResponseData != null) {
            //             $("#OrderNo").searchbox("setValue", JSON.parse(result.ResponseData).OrderNo);
            //         }

            //         $("#btnOrderEdit,#btnOrderDelete,#btnOrderSave").linkbutton("enable");
            //         $('#btnOrderSave').linkbutton("disable");
            //         $("#gridBtnAdd,#girdBtnDel,#gridBtnSave,#gridBtnEdit").linkbutton("disable");
            //         $('#btnClear').linkbutton("enable");
            //     },
            //     error: function (error) {
            //         ajaxLoadErrorHandler(error);
            //     }
            // });
        });
};

var edit = function () {
    if ($("#lbStatus").val() != "订单建立") {
        htmsg.show("订单已处理，不能修改！");
        return;
    }
    FormStatusChange("form0", false, false);
    toolEnable();
    $("#ShouldPayFor").attr("readonly", true);
    $("#btnOrderSave").linkbutton("enable");
    $("#OrderNo").searchbox("disable");
    $("#gridBtnAdd,#girdBtnDel,#gridBtnSave,#gridBtnEdit").linkbutton("enable");
    $("#btnOrderEdit").linkbutton("disable");
};

var deleteOrder = function () {
    var orderId = $('#ID').val();
    var orderNo = $("#OrderNo").searchbox("getValue");
    if (orderId == null || orderId == "") {
        htmsg.show("订单为空");
        return;
    }

    htmsg.confim('确定要删除订单吗?', function () {
        Loading();
        // $.ajax({
        //     type: "POST",
        //     url: '/Order/OrderEstablish/DeleteOrderInfo',
        //     data: { orderNo: orderNo },
        //     dataType: 'json',
        //     success: function (result) {
        //         LoadEnd();
        //         htmsg.show(result.Description);
        //         FormReset('#form0');
        //         $("#ID").val("");
        //         $("#lbStatus").html("");
        //         $("#OrderNo").searchbox('setValue', "");
        //         FormStatusChange("form0", true, true);
        //         //重置datagrid
        //         $("#divOrderDetail").datagrid('loadData', { total: 0, rows: [] });
        //     },
        //     error: function (error) {
        //         LoadEnd();
        //         ajaxLoadErrorHandler(error);
        //     }
        // });
    }
    );
};

var clearForm = function () {
    $("#OrderNo").searchbox("enable");
    $("#OrderNo").searchbox("setValue", "");

    FormStatusChange("form0", true, true);
    FormReset("#form0");
    $("#SettlementType").combobox("setValue", "-1");
    $("#DeliveryMode").combobox("setValue", "-1");
    $("#TransportType").combobox("setValue", "-1");
    $("#OrderType").combobox("setValue", "-1");

    $("#ShouldPayFor").attr("readonly", true);
    $("#divOrderDetail").datagrid('loadData', { total: 0, rows: [] });
    toolDisAble();
    $("#gridBtnAdd,#girdBtnDel,#gridBtnSave,#gridBtnEdit").linkbutton("disable");
};

var culCarr = function () {
    //结算方费用
    var price = 0;
    var a = parseFloat($("#PayMoneyNow").val());
    var b = parseFloat($("#PayMoneyBack").val()); var c = parseFloat($("#PayMoneyArrive").val());
    price = a + b + c;
    $("#ShouldPayFor").numberbox('setValue', price.toFixed(6));
};

var clearconsinee = function () {
    clearconsineepeople();
    $('#ConsigneeName').val("");
    $('#ConsigneeCode').val("");
};

var clearconsineepeople = function () {
    $('#ConsigneePeople').val("");
    clearaddress();
};

var clearaddress = function () {
    $('#ConsigneeAddress').val("");
    $('#ConsigneePhone').val("");
    clearld();
};

var clearld = function () {
    $("#selProvince").combobox("reset");
    $("#selCity").combobox("reset");
    $("#selDistrict").combobox("reset");
    $("#selTown").combobox("reset");
    $("#selCity").combobox('loadData', [{ "ID": 0, "City": "-请选择-" }]);
    $("#selDistrict").combobox('loadData', [{ "AreaCode": 0, "District": "-请选择-" }]);
    $("#selTown").combobox('loadData', [{ "AreaCode": 0, "Town": "-请选择-" }]);
    $("#AreaName").val("");
};