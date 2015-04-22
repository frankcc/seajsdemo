//****easyui-datagrid-clientpager***//
define(function(require) {
    return function($) {

        function pagerFilter(data) {
            if (typeof data.length == 'number' && typeof data.splice == 'function') { // is array
                data = {
                    total: data.length,
                    rows: data
                }
            }
            var dg = $(this);
            var opts = dg.datagrid('options');
            var pager = dg.datagrid('getPager');
            pager.pagination({
                onSelectPage: function(pageNum, pageSize) {
                    opts.pageNumber = pageNum;
                    opts.pageSize = pageSize;
                    pager.pagination('refresh', {
                        pageNumber: pageNum,
                        pageSize: pageSize
                    });
                    dg.datagrid('loadData', data);
                }
            });
            if (!data.originalRows) {
                data.originalRows = (data.rows);
            }
            if (data.originalRows != null && data.originalRows != undefined)
                data.total = data.originalRows.length;
            if (!opts.remoteSort && opts.sortName) {
                var _575 = opts.sortName.split(",");
                var _576 = opts.sortOrder.split(",");
                data.originalRows.sort(createComparisonFunction(_575, _576));
            }
            var start = (opts.pageNumber - 1) * parseInt(opts.pageSize);
            var end = start + parseInt(opts.pageSize);
            data.rows = (data.originalRows.slice(start, end));
            return data;
        }

        function createComparisonFunction(propertyName, order) {
            return function(object1, object2) {
                var value1 = object1[propertyName];
                var value2 = object2[propertyName];
                if (order == "asc") {
                    if (value1 < value2) {
                        return -1;
                    } else if (value1 > value2) {
                        return 1;
                    } else {
                        return 0;
                    }
                } else {
                    if (value1 < value2) {
                        return 1;
                    } else if (value1 > value2) {
                        return -1;
                    } else {
                        return 0;
                    }
                }
            };
        }

        function convert(DataValue, DataType) {
            switch (DataType) {
                case "int":
                    return parseInt(DataValue);
                case "float":
                    return parseFloat(DataValue);
                case "date":
                    return new Date(Date.parse(DataValue));
                default:
                    return DataValue.toString();
            }
        }
    }
})