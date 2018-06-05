var header, headerHeight = 0;
var serverIP='192.168.0.14:8080';
function fnReadyHeader() {
    header = $api.byId('header');
    if (header) {
        //$api.fixIos7Bar(header);
        headerHeight = $api.offset(header).h;
    }
};
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
