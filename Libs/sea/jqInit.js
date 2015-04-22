define('../Libs/sea/jqInit',function(require){
	var $ = require('./jq-sea');
 	require('./EasyUI/jquery.easyui.min')($);
 	//require('./EasyUI/easyloader')($);
 	require('./EasyUI/jquery.easyui.extend')($);
 	require('./EasyUI/locale/easyui-lang-zh_CN')($);
 	require('./EasyUI/datagrid-filter')($);
 	require('./EasyUI/datagrid-clientpage-filter')($);
 	require('./EasyUI/datagrid-detailview')($);
 	// require('./EasyUI/jquery.easyui.extend')($);


 	require('./Jquery/jquery.ui.core')($);
 	require('./Jquery/jquery.ui.widget')($);
 	require('./Jquery/jquery.ui.autocomplete')($);
 	require('./Jquery/jquery.ui.position')($);
 	require('./Jquery/jquery.ui.menu')($);
 	require('./Jquery/jquery.unobtrusive-ajax')($);
 	require('./Jquery/jquery.validate')($);
 	require('./Jquery/jquery.validate.unobtrusive')($);
 	require('./Jquery/jquery.metadata')($);
 	require('./Jquery/jquery.validate.messages_cn')($);
 	require('./Poshytip/jquery.poshytip.min')($);
 	return $
})