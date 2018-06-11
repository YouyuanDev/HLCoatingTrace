var header, headerHeight = 0;
var serverIP = '192.168.0.12:8080';

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
function bindPush() {
    var push = api.require('push');
    push.bind({
        userName: api.deviceId,
        userId: api.deviceId
    }, function(ret, err) {
        //alert(JSON.stringify( ret));
        if (ret.status == true) {
            //alert(api.deviceId+"bind成功");
        } else {}
    });
}

//解除绑定Push推送
function unbindPush() {
    var push = api.require('push');
    push.unbind({
        userName: api.deviceId,
        userId: api.deviceId
    }, function(ret, err) {
        if (ret.status) {
            api.alert({
                msg: '解除绑定成功'
            });
        } else {
            api.alert({
                msg: err.msg
            });
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
    push.leaveAllGroup(function(ret, err) {
        if (ret) {
            var s = '退出所有组成功';
            api.alert({
                msg: s
            });
            //alert( JSON.stringify( ret) );
        } else {
            alert(JSON.stringify(err));
        }
    });
}

//设置推送回调函数
function setPushListener() {
    var push = api.require('push');
    push.setListener(function(ret, err) {
        if (ret) {
            alert("setPushListener回调函数");
            alert(JSON.stringify(ret));
        } else {
            alert(JSON.stringify(err));
        }
    });
}


//请求session中employeeno和millno参数
//每个调用这个函数的页面需要实现 Go方法 和 Reverse方法
function RequestMySesssion() {

    //注册接收requestMySesssion回调
    api.addEventListener({
        name: 'GetMySessionCallbackEvent'
    }, function(ret, err) {
        if (ret.value.success) {
            //得到了session中的employeeno与millno
            ////处理逻辑。。。
            Go(ret.value.employeeno, ret.value.millno);
            //alert(JSON.stringify(ret.value.millno));
        } else {
            //session中不存在millno
            //alert(JSON.stringify(ret.value.msg));
            //处理逻辑。。。
            Reverse(ret.value.msg);
        }
    });

    //发出请求
    var s = 'http://' + serverIP + '/Login/getMySession.action';
    api.ajax({
        url: s,
        method: 'post',
        timeout: 30,
        dataType: 'json',
        data: {}
    }, function(ret, err) {
        api.hideProgress();
        if (ret) {
            api.sendEvent({
                name: 'GetMySessionCallbackEvent',
                extra: {
                    success: ret.success,
                    employeeno: ret.employeeno,
                    millno: ret.millno,
                    msg: ret.msg
                }
            });
        } else {
            api.alert({
                msg: JSON.stringify(err)
            });
        }

    });
}
//得到所有钢管表面的缺陷种类 type有两种，第一种steel,第二种coating
function setAllDefectInfo(type) {
    var s;
    if (type == "steel") {
        s = 'http://' + serverIP + '/DefectOperation/getAllSteelDefectInfo.action';
    } else {
        s = 'http://' + serverIP + '/DefectOperation/getAllCoatingDefectInfo.action';
    }
    api.ajax({
        url: s,
        method: 'post',
        timeout: 30,
        dataType: 'json',
        data: {}
    }, function(ret, err) {
        var defectArr = ret;
        var itemsArr = [];
        if (defectArr != undefined) {
            for (var i = 0; i < defectArr.length; i++) {
                var temp = {
                    text: defectArr[i].defect_name,
                    status: 'normal'
                };
                itemsArr.push(temp);
            }
            //设置数据给属性
            var divValTag = '.form-' + type + '-condition';
            $(divValTag).attr("data-val", JSON.stringify(itemsArr));

        }
    });
    $('.form-condition').click(function() {
        var type = $(this).attr("data-type");
        var itemsArr = JSON.parse($(this).attr("data-val"));
        var title;
        if (type == "steel") {
            title = "外观缺陷"
        } else {
            title = "涂层缺陷";
        }
        //开始
        var UIMultiSelector = api.require('UIMultiSelector');
        UIMultiSelector.open({
            rect: {
                h: 244
            },
            text: {
                title: title,
                leftBtn: '',
                rightBtn: '完成'
            },
            max: 0,
            styles: {
                mask: 'rgba(0,0,0,0.3)',
                title: {
                    bg: 'rgb(245,245,245)',
                    color: 'rgb(0,0,0)',
                    size: 16,
                    h: 44
                },
                leftButton: {
                    bg: 'rgb(255,255,255)',
                    w: 0,
                    h: 0,
                    marginT: 5,
                    marginL: 8,
                    color: 'rgb(0,0,0)',
                    size: 14
                },
                rightButton: {
                    bg: 'rgb(245,245,245)',
                    w: 80,
                    h: 35,
                    marginT: 5,
                    marginR: 8,
                    color: 'rgb(0,0,0)',
                    size: 14
                },
                item: {
                    h: 35,
                    bg: 'rgb(255,255,255)',
                    bgActive: 'rgb(25,173,104)',
                    bgHighlight: 'rgb(25,173,104)',
                    color: 'rgb(0,0,0,0.8)',
                    active: 'rgb(255,255,255)',
                    highlight: 'rgb(255,255,255)',
                    size: 14,
                    lineColor: 'rgb(169,169,169)',
                    textAlign: 'center'
                }
            },
            animation: true,
            items: itemsArr
        }, function(ret, err) {
            if (ret) {
                if (ret.eventType == "clickRight" || ret.eventType == "clickMask") {
                    var divtag2 = '.form-' + type + '-select-val';
                    $(divtag2).empty();
                    for (var i = 0; ret.items != undefined && i < ret.items.length; i++) {
                        $(divtag2).append(ret.items[i].text + ",");
                    }
                    UIMultiSelector.close();
                }
            } else {
                alert(JSON.stringify(err));
            }
        });
    });
}

//设置选择图片事件
function setSelectPictures() {
    $('.form-pictures').click(function() {
        api.actionSheet({
            title: '上传图片',
            cancelTitle: '取消',
            buttons: ['拍照', '从手机相册选择']
        }, function(ret, err) {
            if (ret) {
                getPicture(ret.buttonIndex);
            }
        });
    });
}

function getPicture(sourceType) {
    if (sourceType == 1) { // 拍照
        api.getPicture({
            sourceType: 'camera',
            encodingType: 'jpg',
            mediaValue: 'pic',
            allowEdit: false,
            destinationType: 'base64',
            quality: 90,
            saveToPhotoAlbum: true
        }, function(ret, err) {
            if (ret) {
                alert("getPicture=" + ret.data);
                $('.imgBox').append(pictureTemplate(ret.data, ret.base64Data));
                //$('#imgUp').attr('src', ret.base64Data);
            } else {
                alert(JSON.stringify(err));
            }
        });

    } else if (sourceType == 2) { // 从相机中选择
        api.getPicture({
            sourceType: 'library',
            encodingType: 'jpg',
            mediaValue: 'pic',
            destinationType: 'base64',
            quality: 50,
            targetWidth: 750,
            targetHeight: 750
        }, function(ret, err) {
            if (ret) {
                //alert(ret.data);
                $('.imgBox').append(pictureTemplate(ret.data, ret.base64Data));
                alert("222" + ret.data);
                var s = 'http://' + serverIP + '/UploadFile/uploadPicture.action';
                api.ajax({
                    url: s,
                    method: 'post',
                    data: {
                        values: {
                            name: 'haha'
                        },
                        files: {
                            file: ret.data
                        }
                    }
                }, function(ret, err) {
                    if (ret) {
                        // api.alert({
                        //     msg: JSON.stringify(ret)
                        // });
                    } else {
                        api.alert({
                            msg: JSON.stringify(err)
                        });
                    }
                });
            } else {
                alert(JSON.stringify(err));
            }
        });
    }
}
//图片模板
function pictureTemplate(imgUrl, imgData) {
    var template = '<div class="temp-container">' +
        '<div onclick="delSelectPicture(this)" class="temp-del-icon">x</div>' +
        '<img id="imgUp" data-url="' + imgUrl + '" src="' + imgData + '"/>' +
        '</div>';
    return template;
}
//删除选择的照片
function delSelectPicture(obj) {
    var picUrl = $(obj).siblings('img').attr('data-url');
    $(obj).parent().remove();
}


//根据pipeno millno 获取 本次检验频次信息
function RequestInspectionFrequency(pipeno, millno) {

    //注册接收RequestInspectionFrequency回调
    api.addEventListener({
        name: 'RequestInspectionFrequencyCallbackEvent'
    }, function(ret, err) {
        if (ret.value.success) {
            //得到了检验频次信息
            ////处理逻辑。。。
            //alert(JSON.stringify(ret.value.data));
            //GetInspectFreqOK(ret.value.data);
            var data=ret.value.data;
            $.each(data, function(name, value) {
                var needInspectNow=value.needInspectNow;
                if(name!=undefined){
                  if(name.indexOf("od_")!=-1||name.indexOf("id_")!=-1||name.indexOf("_freq")!=-1){
                    name="."+name.replace("od_","").replace("id_","").replace("_freq","")+"_lbl";
                    //alert(name);
                    if(needInspectNow!=undefined&&needInspectNow){
                        if($(name).children('.freq-span').length<=0)
                          $(name).append('<span class="freq-span" style="color:red;padding-left:5px;">必填</span>');
                    }
                  }
                }
            });
        } else {
            //session中不存在millno
            //alert(JSON.stringify(ret.value.msg));
            //处理逻辑。。。
            GetInspectFreqFail();
        }
    });
    //发出请求
    var s = 'http://' + serverIP + '/InspectionFrequencyOperation/getAllInspectionTimeMapByPipeNoMillNo.action';
    api.ajax({
        url: s,
        method: 'post',
        timeout: 30,
        dataType: 'json',
        data: {
            values: {
                pipe_no: pipeno,
                mill_no: millno
            }

        }
    }, function(ret, err) {
        api.hideProgress();
        var success = false;
        if (ret) {
            success = true;
        } else {
            api.alert({
                msg: JSON.stringify(err)
            });
        }
        api.sendEvent({
            name: 'RequestInspectionFrequencyCallbackEvent',
            extra: {
                success: success,
                data: ret
            }
        });

    });
}



//根据pipeno  获取 外防接收标准
function RequestODAcceptCriteria(pipeno) {
     //alert(pipeno);
    // pipeno="1524540";
    //注册接收RequestODAcceptCriteria回调
    api.addEventListener({
        name: 'RequestODAcceptCriteriaCallbackEvent'
    }, function(ret, err) {
        if (ret.value.success) {
            //得到了外防接收标准
            //GetODAcceptCriteriaOK(ret.value.data);
            var data =ret.value.data[0];
            if(data!=undefined){
              $.each(data, function(name, value) {
                  if(name!=undefined){
                    if(name.indexOf("_min")!=-1){
                      name="."+name.replace("_min","");
                      if(value!=undefined)
                      $(name).attr('data-min',value);
                      name=name+"_lbl";
                      if($(name).children('.range-span').length<=0){
                          $(name).append('<span class="range-span">'+value+'~</span>');
                      }else{
                         var txt=$(name).children('.range-span').text();
                         $(name).children('.range-span').text(value+"~"+txt);
                      }
                    }else if(name.indexOf("_max")!=-1){
                      name="."+name.replace("_max","");
                      if(value!=undefined)
                      $(name).attr('data-max',value);
                      name=name+"_lbl";
                      if($(name).children('.range-span').length<=0){
                          $(name).append('<span class="range-span">~'+value+'</span>');
                      }else{
                         var txt=$(name).children('.range-span').text();
                         $(name).children('.range-span').text(txt+""+value);
                      }
                    }
                  }
              });
            }

        } else {
            //alert(JSON.stringify(ret.value.msg));
            //处理逻辑。。。
            GetODAcceptCriteriaFail();
        }
    });

    //发出请求
    var s = 'http://' + serverIP + '/AcceptanceCriteriaOperation/getODAcceptanceCriteriaByPipeNo.action';
    api.ajax({
        url: s,
        method: 'post',
        timeout: 30,
        dataType: 'json',
        data: {
            values: {
                pipe_no: pipeno
            }
        }
    }, function(ret, err) {
        api.hideProgress();
        var success = false;
        if (ret) {
            success = true;
        } else {
            api.alert({
                msg: JSON.stringify(err)
            });
        }
        api.sendEvent({
            name: 'RequestODAcceptCriteriaCallbackEvent',
            extra: {
                success: success,
                data: ret
            }
        });

    });
}


//根据pipeno  获取 内防接收标准
function RequestIDAcceptCriteria(pipeno) {

    //注册接收RequestIDAcceptCriteria回调
    api.addEventListener({
        name: 'RequestIDAcceptCriteriaCallbackEvent'
    }, function(ret, err) {
        if (ret.value.success) {
            //得到了内防接收标准
            ////处理逻辑。。。
            //GetIDAcceptCriteriaOK(ret.value.data);
            var data =ret.value.data[0];
            if(data!=undefined){
              $.each(data, function(name, value) {
                  //alert(name);
                  //alert(value);
                  alert(toString.call(name)+":"+name);
                  if(name!=undefined){
                    if(name.indexOf("_min")!=-1){
                      name="."+name.replace("_min","");
                      if(value!=undefined)
                      $(name).attr('data-min',value);
                    }else if(name.indexOf("_max")!=-1){
                      name="."+name.replace("_max","");
                      if(value!=undefined)
                      $(name).attr('data-max',value);
                    }
                  }
              });
            }

        } else {
            //alert(JSON.stringify(ret.value.msg));
            //处理逻辑。。。
            GetIDAcceptCriteriaFail();
        }
    });

    //发出请求
    var s = 'http://' + serverIP + '/AcceptanceCriteriaOperation/getIDAcceptanceCriteriaByPipeNo.action';
    api.ajax({
        url: s,
        method: 'post',
        timeout: 30,
        dataType: 'json',
        data: {
            values: {
                pipe_no: pipeno
            }
        }
    }, function(ret, err) {
        api.hideProgress();
        var success = false;
        if (ret) {
            success = true;
        } else {
            api.alert({
                msg: JSON.stringify(err)
            });
        }
        api.sendEvent({
            name: 'RequestIDAcceptCriteriaCallbackEvent',
            extra: {
                success: success,
                data: ret
            }
        });

    });
}
//设置控件
function setControls() {
    //设置温度相关的控件
    $(".mob-preheat-temperature").mobiscroll().temperature({
        theme: 'auto',
        lang: 'zh',
        display: 'center',
        min: 10,
        max: 100,
        defaultValue: 50,
        step:0.5,
        scale:1,
        units: ['c'],
        unitNames: {
            c: '°C'
        },
        onSet: function(event, inst) {
            var selectedVal = inst.getVal();
            $(this).val(selectedVal.replace('°C', ''));
            var minVal=$(this).attr('data-min');
            var maxVal=$(this).attr('data-max');
            alert(minVal+"~"+maxVal);
            var flag=true;
            if(selectedVal!=undefined){
              if(maxVal!=undefined){
                  if(parseFloat(maxVal)<parseFloat(selectedVal))
                    flag=false;
              }
              if(minVal!=undefined){
                 if(parseFloat(selectedVal)<parseFloat(minVal))
                    flag=false;
              }
              if(flag)
                $(this).css('background','#FFFFFF');
              else
                $(this).css('background','#F9A6A6');
            }
        }
    });
    //空气温度
    $(".mob-air-temperature").mobiscroll().temperature({
        theme: 'auto',
        lang: 'zh',
        display: 'center',
        min: -5,
        defaultValue: 30,
        max: 60,
        units: ['c'],
        unitNames: {
            c: '°C'
        },
        onSet: function(event, inst) {
            var selectedVal = inst.getVal();
            $(this).val(selectedVal.replace('°C', ''));
            var minVal=$(this).attr('data-min');
            var maxVal=$(this).attr('data-max');
            var flag=true;
            if(selectedVal!=undefined){
              if(maxVal!=undefined){
                  if(parseFloat(maxVal)<parseFloat(selectedVal))
                    flag=false;
              }
              if(minVal!=undefined){
                 if(parseFloat(selectedVal)<parseFloat(minVal))
                    flag=false;
              }
              if(flag)
                $(this).css('background','#FFFFFF');
              else
                $(this).css('background','#F9A6A6');
            }
        }
    });
    //钢管温度
    $(".mob-pipe-temperature").mobiscroll().temperature({
        theme: 'auto',
        lang: 'zh',
        display: 'center',
        min: 10,
        max: 100,
        defaultValue: 45,
        units: ['c'],
        unitNames: {
            c: '°C'
        },
        onSet: function(event, inst) {
            var selectedVal = inst.getVal();
            $(this).val(selectedVal.replace('°C', ''));
            var minVal=$(this).attr('data-min');
            var maxVal=$(this).attr('data-max');
            var flag=true;
            if(selectedVal!=undefined){
              if(maxVal!=undefined){
                  if(parseFloat(maxVal)<parseFloat(selectedVal))
                    flag=false;
              }
              if(minVal!=undefined){
                 if(parseFloat(selectedVal)<parseFloat(minVal))
                    flag=false;
              }
              if(flag)
                $(this).css('background','#FFFFFF');
              else
                $(this).css('background','#F9A6A6');
            }

        }
    });
    //打砂前后盐度
    $('.mob-salt-contamination').mobiscroll().number({
        theme: 'auto',
        lang: 'zh',
        display: 'center',
        min: 0,
        max: 50,
        defaultValue: 5,
        step: 0.1,
        scale:1,
        units: ['c'],
        unitNames: {
            c: 'mg/㎡'
        },
        onSet: function(event, inst) {
            var selectedVal = inst.getVal();
            $(this).val(selectedVal.replace('mg/㎡', ''));
            var minVal=$(this).attr('data-min');
            var maxVal=$(this).attr('data-max');
            alert(minVal+"~"+maxVal);
            var flag=true;
            if(selectedVal!=undefined){
              if(maxVal!=undefined){
                  if(parseFloat(maxVal)<parseFloat(selectedVal))
                    flag=false;
              }
              if(minVal!=undefined){
                 if(parseFloat(selectedVal)<parseFloat(minVal))
                    flag=false;
              }
              if(flag)
                $(this).css('background','#FFFFFF');
              else
                $(this).css('background','#F9A6A6');
            }
        }
    });
    //所用时间s
    $('.mob-second-time').mobiscroll().number({
        theme: 'auto',
        lang: 'zh',
        display: 'center',
        min: 0,
        max: 100,
        defaultValue: 28,
        step:1,
        scale:0,
        units: ['c'],
        unitNames: {
            c: 's'
        },
        onSet: function(event, inst) {
            var selectedVal = inst.getVal();
            $(this).val(selectedVal.replace('s', ''));
            var minVal=$(this).attr('data-min');
            var maxVal=$(this).attr('data-max');
            alert(minVal+"~"+maxVal);
            var flag=true;
            if(selectedVal!=undefined){
              if(maxVal!=undefined){
                  if(parseFloat(maxVal)<parseFloat(selectedVal))
                    flag=false;
              }
              if(minVal!=undefined){
                 if(parseFloat(selectedVal)<parseFloat(minVal))
                    flag=false;
              }
              if(flag)
                $(this).css('background','#FFFFFF');
              else
                $(this).css('background','#F9A6A6');
            }
        }
    });
    //浓度
    $('.mob-concentration').mobiscroll().number({
        theme: 'auto',
        lang: 'zh',
        display: 'center',
        min: 0,
        max: 100,
        defaultValue: 50,
        step: 0.1,
        scale:1,
        units: ['c'],
        unitNames: {
            c: '%'
        },
        onSet: function(event, inst) {
            var selectedVal = inst.getVal();
            $(this).val(selectedVal.replace('%', ''));
            var minVal=$(this).attr('data-min');
            var maxVal=$(this).attr('data-max');
            alert(minVal+"~"+maxVal);
            var flag=true;
            if(selectedVal!=undefined){
              if(maxVal!=undefined){
                  if(parseFloat(maxVal)<parseFloat(selectedVal))
                    flag=false;
              }
              if(minVal!=undefined){
                 if(parseFloat(selectedVal)<parseFloat(minVal))
                    flag=false;
              }
              if(flag)
                $(this).css('background','#FFFFFF');
              else
                $(this).css('background','#F9A6A6');
            }
        }
    });
    //冲洗电导率
    $('.mob-water-conductivity').mobiscroll().number({
        theme: 'auto',
        lang: 'zh',
        display: 'center',
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 10,
        units: ['c'],
        unitNames: {
            c: 'μS/cm'
        },
        onSet: function(event, inst) {
            var selectedVal = inst.getVal();
            $(this).val(selectedVal.replace('μS/cm', ''));
            var minVal=$(this).attr('data-min');
            var maxVal=$(this).attr('data-max');
            alert(minVal+"~"+maxVal);
            var flag=true;
            if(selectedVal!=undefined){
              if(maxVal!=undefined){
                  if(parseFloat(maxVal)<parseFloat(selectedVal))
                    flag=false;
              }
              if(minVal!=undefined){
                 if(parseFloat(selectedVal)<parseFloat(minVal))
                    flag=false;
              }
              if(flag)
                $(this).css('background','#FFFFFF');
              else
                $(this).css('background','#F9A6A6');
            }
        }
    });
    //磨料电导率
    $('.mob-abrasive-conductivity').mobiscroll().number({
        theme: 'auto',
        lang: 'zh',
        display: 'center',
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 20,
        units: ['c'],
        unitNames: {
            c: 'μS/cm'
        },
        onSet: function(event, inst) {
            var selectedVal = inst.getVal();
            $(this).val(selectedVal.replace('μS/cm', ''));
            var minVal=$(this).attr('data-min');
            var maxVal=$(this).attr('data-max');
            alert(minVal+"~"+maxVal);
            var flag=true;
            if(selectedVal!=undefined){
              if(maxVal!=undefined){
                  if(parseFloat(maxVal)<parseFloat(selectedVal))
                    flag=false;
              }
              if(minVal!=undefined){
                 if(parseFloat(selectedVal)<parseFloat(minVal))
                    flag=false;
              }
              if(flag)
                $(this).css('background','#FFFFFF');
              else
                $(this).css('background','#F9A6A6');
            }
        }
    });
    //速度
    $('.mob-line-speed').mobiscroll().number({
        theme: 'auto',
        lang: 'zh',
        display: 'center',
        min: 0,
        max: 20,
        defaultValue: 0.5,
        step: 0.1,
        scale:1,
        units: ['c'],
        unitNames: {
            c: 'm/s'
        },
        onSet: function(event, inst) {
            var selectedVal = inst.getVal();
            $(this).val(selectedVal.replace('m/s', ''));
            var minVal=$(this).attr('data-min');
            var maxVal=$(this).attr('data-max');
            alert(minVal+"~"+maxVal);
            var flag=true;
            if(selectedVal!=undefined){
              if(maxVal!=undefined){
                  if(parseFloat(maxVal)<parseFloat(selectedVal))
                    flag=false;
              }
              if(minVal!=undefined){
                 if(parseFloat(selectedVal)<parseFloat(minVal))
                    flag=false;
              }
              if(flag)
                $(this).css('background','#FFFFFF');
              else
                $(this).css('background','#F9A6A6');
            }
        }
    });
    var numList = "";
    var $nowObj;
    //数字集合
    $('.mob-number-thickness-list').mobiscroll().numpad({
        theme: 'auto',
        lang: 'zh',
        display: 'bottom',
        min: 0,
        max: 9999,
        scale: 0,
        fill: 'ltr',
        defaultValue: 0,
        decimalSeparator: '.',
        rtl: false,
        preset: 'decimal',
        buttons: [
            'set', {
                text: '删除',
                icon: '',
                handler: function(event, inst) {
                    var selectedVal = $nowObj.val();
                    selectedVal = selectedVal.substring(0, selectedVal.lastIndexOf(','));
                    selectedVal = selectedVal.substring(0, (selectedVal.lastIndexOf(',') + 1));
                    $nowObj.val(selectedVal);
                    numList = selectedVal;
                }
            },
            'cancel'
        ],
        onBeforeShow: function(event, inst) {
            $nowObj = $(this);
            numList = $(this).val();
            inst.setVal('0');
        },
        onSet: function(event, inst) {
            var selectedVal = inst.getVal();
            $(this).val(numList + "" + selectedVal + ',');
            var arr=selectedVal.split(',');
            var minVal=$(this).attr('data-min');
            var maxVal=$(this).attr('data-max');
            alert(minVal+"~"+maxVal);
            var flag=true;
            if(selectedVal!=undefined){
              for (var i = 0; i < arr.length; i++) {
                if(maxVal!=undefined){
                    if(parseFloat(maxVal)<parseFloat(selectedVal)){
                        flag=false;
                        break;
                    }
                }
                if(minVal!=undefined){
                   if(parseFloat(selectedVal)<parseFloat(minVal)){
                       flag=false;
                     break;
                   }
                }
              }
            }
            if(flag)
              $(this).css('background','#FFFFFF');
            else
              $(this).css('background','#F9A6A6');
        }
    });
}



//根据pipeno  获取 钢管本体接收标准
function RequestPipeBodyAcceptCriteria(pipeno) {

    //注册接收RequestPipeBodyAcceptCriteria回调
    api.addEventListener({
        name: 'RequestPipeBodyAcceptCriteriaCallbackEvent'
    }, function(ret, err) {
        if (ret.value.success) {
            //得到了钢管本体接收标准
            ////处理逻辑。。。
            GetPipeBodyAcceptCriteriaOK(ret.value.data);
        } else {
            //alert(JSON.stringify(ret.value.msg));
            //处理逻辑。。。
            GetPipeBodyAcceptCriteriaFail();
        }
    });

    //发出请求
    var s = 'http://' + serverIP + '/AcceptanceCriteriaOperation/getPipeBodyAcceptanceCriteriaByPipeNo.action';
    api.ajax({
        url: s,
        method: 'post',
        timeout: 30,
        dataType: 'json',
        data: {
            values: {
                pipe_no: pipeno
            }
        }
    }, function(ret, err) {
        api.hideProgress();
        var success = false;
        if (ret) {
            success = true;
        } else {
            api.alert({
                msg: JSON.stringify(err)
            });
        }
        api.sendEvent({
            name: 'RequestPipeBodyAcceptCriteriaCallbackEvent',
            extra: {
                success: success,
                data: ret
            }
        });

    });
}


//根据pipeno  获取 2FBE lab实验接收标准
function Request2FBELabAcceptCriteria(pipeno) {

    //注册接收Request2FBELabAcceptCriteria回调
    api.addEventListener({
        name: 'Request2FBELabAcceptCriteriaCallbackEvent'
    }, function(ret, err) {
        if (ret.value.success) {
            //得到了2FBE lab实验接收标准
            ////处理逻辑。。。
            Get2FBELabAcceptCriteriaOK(ret.value.data);
        } else {
            //alert(JSON.stringify(ret.value.msg));
            //处理逻辑。。。
            Get2FBELabAcceptCriteriaFail();
        }
    });

    //发出请求
    var s = 'http://' + serverIP + '/LabTestingAcceptanceCriteriaOperation/getAcceptanceCriteria2FbeByPipeNo.action';
    api.ajax({
        url: s,
        method: 'post',
        timeout: 30,
        dataType: 'json',
        data: {
            values: {
                pipe_no: pipeno
            }
        }
    }, function(ret, err) {
        api.hideProgress();
        var success = false;
        if (ret) {
            success = true;
        } else {
            api.alert({
                msg: JSON.stringify(err)
            });
        }
        api.sendEvent({
            name: 'Request2FBELabAcceptCriteriaCallbackEvent',
            extra: {
                success: success,
                data: ret
            }
        });

    });
}

//根据pipeno  获取 3LPE lab实验接收标准
function Request3LPELabAcceptCriteria(pipeno) {

    //注册接收Request3LPELabAcceptCriteria回调
    api.addEventListener({
        name: 'Request3LPELabAcceptCriteriaCallbackEvent'
    }, function(ret, err) {
        if (ret.value.success) {
            //得到了3LPE lab实验接收标准
            ////处理逻辑。。。
            Get3LPELabAcceptCriteriaOK(ret.value.data);
        } else {
            //alert(JSON.stringify(ret.value.msg));
            //处理逻辑。。。
            Get3LPELabAcceptCriteriaFail();
        }
    });

    //发出请求
    var s = 'http://' + serverIP + '/LabTestingAcceptanceCriteriaOperation/getAcceptanceCriteria3LpeByPipeNo.action';
    api.ajax({
        url: s,
        method: 'post',
        timeout: 30,
        dataType: 'json',
        data: {
            values: {
                pipe_no: pipeno
            }
        }
    }, function(ret, err) {
        api.hideProgress();
        var success = false;
        if (ret) {
            success = true;
        } else {
            api.alert({
                msg: JSON.stringify(err)
            });
        }
        api.sendEvent({
            name: 'Request3LPELabAcceptCriteriaCallbackEvent',
            extra: {
                success: success,
                data: ret
            }
        });

    });
}
//获取表单头部钢管信息
function getPipeBasicInfoHeader(pipeno){
  var s = 'http://' + serverIP + '/APPRequestTransfer/getCoatingInfoByPipeNo.action';
  api.ajax({
      url: s,
      method: 'post',
      timeout: 30,
      dataType: 'json',
      data: {
          values: {
              pipe_no: pipeno
          }
      }
  }, function(ret, err) { //alert(ret);
      if (ret) {
          if (ret.success == false) {
              api.alert({
                  msg: JSON.stringify(ret.message)
              });
          } else {
              pipeinfo = ret.pipeinfo;
              $('.pipeinfo-table .pipe_no').text(pipeinfo.pipe_no);
              $('.pipeinfo-table .status_name').text(pipeinfo.status_name);
              $('.pipeinfo-table .od').text(pipeinfo.od);
              $('.pipeinfo-table .wt').text(pipeinfo.wt);
              hlLanguage("../../i18n/");
          }
      } else {
          //alert("err");
          api.alert({
              msg: JSON.stringify(err)
          });
      }
  });
}
