/**
 * cookie操作
 */
var getCookie = function() {
      return $api.getStorage('userLanguage');
}
var i18nLanguage = "zh-CN";
var webLanguage = ['zh-CN','en'];
var execI18n = function(languagePath){
    //获取用户浏览器之前选择的语言类型
    if(getCookie()){
        i18nLanguage=getCookie();
    }else{
        //获取浏览器语言
        var navLanguage=$.i18n.browserLang();
        //判断是否支持语言数组
        if($.inArray(navLanguage,webLanguage)>-1){
            i18nLanguage=navLanguage;
            //缓存语言选择
            getCookie();
        }else{
            navLanguage='en';
        }
    }
    jQuery.i18n.properties({
        name : 'strings', //资源文件名称
        language:i18nLanguage,
        path :languagePath,
        mode : 'map', //用Map的方式使用资源文件中的值
        callback : function() {//加载成功后设置显示内容
            var insertEle = $(".i18n");
            insertEle.each(function() {
                $(this).attr("title",$.i18n.prop($(this).attr('name')));
            });
            var insertEle1 = $(".i18n1");
            insertEle1.each(function() {
                //alert($.i18n.prop($(this).attr('name')));
                //alert($(this).attr('name'));
                $(this).text($.i18n.prop($(this).attr('name')));
            });
            var insertEle2 = $(".i18n2");
            insertEle2.each(function() {
                $(this).children('.l-btn-left').children('.l-btn-text').text($.i18n.prop($(this).attr('name')));
            });
        }
    });

}
function getLanguage() {
    var language;
    if(getCookie()){
        language=getCookie();
    }else{
        //获取浏览器语言
        var navLanguage=$.i18n.browserLang();
        //判断是否支持语言数组
        if($.inArray(navLanguage,webLanguage)>-1){
            language=navLanguage;
            //缓存语言选择
            getCookie();
        }else{
            language='en';
        }
    }
    return language;
}
/*页面执行加载执行*/
function hlLanguage(languagePath) {
    execI18n(languagePath);
    /*将语言选择默认选中缓存中的值*/
    $("#language option[value="+i18nLanguage+"]").attr("selected",true);

    /* 选择语言 */
    $("#language").bind('change', function() {
        var language = $(this).children('option:selected').val();
        //重新设置cookie
        $api.setStorage('userLanguage',language);
        // getCookie("userLanguage",language,{
        //     expires: 30,
        //     path:'/'
        // });
        location.reload();
    });
}
