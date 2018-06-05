var header, headerHeight = 0;
var serverIP='192.168.0.12:8080';
function fnSettingHeader(){

  var sType=api.systemType;
  var header = $api.byId('header');
  if(sType=="ios"){
    $api.fixIos7Bar(header);
  }
  headerHeight = $api.offset(header).h;
}
// function fnReadyHeader() {
//     header = $api.byId('header');
//     if (header) {
//         $api.fixIos7Bar(header);
//         headerHeight = $api.offset(header).h;
//     }
// };
function fnReadyFrame() {
    var frameName = api.winName + '_frame';
    api.openFrame({
        name: frameName,
        url: '../html/'+ frameName + '.html',
        bounces: true,
        rect: {
            x: 0,
            y: headerHeight,
            w: 'auto',
            h: 'auto'
        },
        vScrollBarEnabled: false
    });
};
function JudgeLogin(){
   //$api.rmStorage('operatorno');
   var userInfo=$api.getStorage('operatorno');
   if(userInfo!=undefined){
     return true;
   }else{
      return false;
   }
}
function formatterdate(value,row,index){
    //alert(toString.call(value));
    if(value!=undefined&&value!=null)
        return getDateOnly(value);
    else
        return "";
}
function getDateOnly(str){
    var oDate = new Date(str);
    y=oDate.getFullYear();
    m = oDate.getMonth()+1;
    d = oDate.getDate();
    return  y+'-'+(m<10?('0'+m):m)+'-'+(d<10?('0'+d):d);
}
function getDate1(str){
    var oDate = new Date(str);
    y=oDate.getFullYear();
    m = oDate.getMonth()+1;
    d = oDate.getDate();
    h=oDate.getHours();
    mins=oDate.getMinutes();
    s=oDate.getSeconds();
    return  y+'-'+(m<10?('0'+m):m)+'-'+(d<10?('0'+d):d)+' '+(h<10?('0'+h):h)+':'+(mins<10?('0'+mins):mins)+':'+(s<10?('0'+s):s);
}
