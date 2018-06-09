var header, headerHeight = 0;
var serverIP = '192.168.3.14:8080';

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
        var itemsArr =JSON.parse($(this).attr("data-val"));
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
                    for (var i = 0; i < ret.items.length; i++) {
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
                alert(ret.data);
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
                alert(ret.data);
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
                        api.alert({
                            msg: JSON.stringify(ret)
                        });
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
