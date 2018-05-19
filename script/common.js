var header, headerHeight = 0;

function fnReadyHeader() {
    header = $api.byId('header');
    if (header) {
        //$api.fixIos7Bar(header);
        headerHeight = $api.offset(header).h;
    }
};
function fnReadyFrame() {
    var frameName = api.frameName + '_frame';
    api.openFrame({
        name: frameName,
        url: '../html/' + frameName + '.html',
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
   var userInfo= api.getPrefs({
       sync: true,
       key: 'userInfo'
   });
   if(userInfo){

   }else{
       //如果没有登录进入登录页面
       api.openFrame({
           name: 'login',
           url: './html/login.html',
           bounces: false,
           rect: {
               x: 0,
               y: headerHeight,
               w: 'auto',
               h: api.winHeight - headerHeight
           },
           vScrollBarEnabled:false
       });
   }
}
