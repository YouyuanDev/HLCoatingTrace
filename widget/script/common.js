var header, headerHeight = 0;
var serverIP = '192.168.0.14:8080';

function fnSettingHeader() {

    var sType = api.systemType;
    var header = $api.byId('header');
    if (sType == "ios") {
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
        url: './' + frameName + '.html',
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

function JudgeLogin() {
    //$api.rmStorage('operatorno');
    var userInfo = $api.getStorage('operatorno');
    if (userInfo != undefined) {
        return true;
    } else {
        return false;
    }

}

function formatterdate(value, row, index) {
    //alert(toString.call(value));
    if (value != undefined && value != null)
        return getDateOnly(value);
    else
        return "";
}

function getDateOnly(str) {
    var oDate = new Date(str);
    y = oDate.getFullYear();
    m = oDate.getMonth() + 1;
    d = oDate.getDate();
    return y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d);
}

function getDate1(str) {
    var oDate = new Date(str);
    y = oDate.getFullYear();
    m = oDate.getMonth() + 1;
    d = oDate.getDate();
    h = oDate.getHours();
    mins = oDate.getMinutes();
    s = oDate.getSeconds();
    return y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d) + ' ' + (h < 10 ? ('0' + h) : h) + ':' + (mins < 10 ? ('0' + mins) : mins) + ':' + (s < 10 ? ('0' + s) : s);
}



//绑定Push推送
function bindPush(){
  var push = api.require('push');
  push.bind({
      userName: api.deviceId,
      userId: api.deviceId
  }, function(ret, err) {
    //alert(JSON.stringify( ret));
    if(ret.status==true){
       //alert(api.deviceId+"bind成功");
    }else{
    }
  });
}

//解除绑定Push推送
function unbindPush(){
  var push = api.require('push');
  push.unbind({
    userName:api.deviceId,
    userId:api.deviceId
},function(ret,err){
    if(ret.status){
        api.alert({msg:'解除绑定成功'});
    }else{
        api.alert({msg:err.msg});
    }
});
}



// 加入推送群组
function joinPushGroup(groupName) {

    var push = api.require('push');
    //加入组
    push.joinGroup({
        groupName: groupName
    }, function(ret, err) {
        if (ret.status) {
           //var s='加入组'+groupName+'成功';
           //api.alert({msg:s});
        } else {
            // api.alert({
            //     msg: err.msg
            // });
            //return;
        }
    });
    push.setPreference({
        notify: true,
        updateCurrent: false
    });
}
// 退出推送群组
function leaveAllPushGroup() {
    var push = api.require('push');
    push.leaveAllGroup(function( ret, err ){
         if( ret ){
           var s='退出所有组成功';
            api.alert({msg:s});
            //alert( JSON.stringify( ret) );
         }else{
            alert( JSON.stringify( err) );
         }
    });
}

//设置推送回调函数
function setPushListener() {
var push = api.require('push');
push.setListener(function( ret, err ){
     if( ret ){
        alert("setPushListener回调函数");
        alert( JSON.stringify( ret) );
     }else{
        alert( JSON.stringify( err) );
     }
});
}
