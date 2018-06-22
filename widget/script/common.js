var header, headerHeight = 0;
var serverIP = '192.168.0.12:8080';

function fnSettingHeader() {

    var sType = api.systemType;
    var header = $api.byId('header');
    if (sType == "ios") {
        $api.fixIos7Bar(header);

    } else if (sType == "android") {
        $api.fixStatusBar(header);
    }
}
// function fnReadyHeader() {
//     header = $api.byId('header');
//     if (header) {
//         $api.fixIos7Bar(header);
//         headerHeight = $api.offset(header).h;
//     }
// };
function fnReadyFrame() {
    var nav = $api.byId('header');
    var navHeight = $api.offset(nav).h;
    var frameName = api.winName + '_frame';
    api.openFrame({
        name: frameName,
        url: './' + frameName + '.html',
        bounces: true,
        rect: {
            x: 0,
            y: navHeight,
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


// function getDateMobi(str) {
//     var oDate = new Date(str);
//     y = oDate.getFullYear();
//     m = oDate.getMonth() + 1;
//     d = oDate.getDate();
//     h = oDate.getHours();
//     mins = oDate.getMinutes();
//     s = oDate.getSeconds();
//     return y + '/' + (m < 10 ? ('0' + m) : m) + '/' + (d < 10 ? ('0' + d) : d) + ' ' + (h < 10 ? ('0' + h) : h) + ':' + (mins < 10 ? ('0' + mins) : mins) + ':' + (s < 10 ? ('0' + s) : s);
// }

// //-转为/
// function formatterDateMobi(str) {
//     if (str != undefined)
//         return str.replace(/-/g, '/');
//     else
//         return ""
// }





//字符串转date
function parseMobiDate(str) {
    if (str != undefined)
        return new Date(Date.parse(str));
    else
        return new Date();

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

//loading动画效果
function DoLoadingPicture() {
    var UILoading = api.require('UILoading');
    UILoading.flower({
        center: {
            x: api.winWidth / 2.0,
            y: api.winHeight / 2.0
        },
        size: 30,
        mask: 'rgba(0,0,0,0.5)',
        fixed: true
    }, function(ret) {
        //alert(JSON.stringify(ret));
        g_loadingID = ret.id;
    });
}

function ClearLoadingPicture() {
    var uiloading = api.require('UILoading');
    uiloading.closeFlower({
        id: g_loadingID
    });
    g_loadingID = 0;
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
                var s = 'http://' + serverIP + '/UploadFile/uploadPicture.action';
                DoLoadingPicture();
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
                }, function(rets, errs) {
                    ClearLoadingPicture();
                    if (rets) {
                        $('.imgBox').append(pictureTemplate(rets.imgUrl, ret.base64Data));
                        alert("上传成功!");
                    } else {
                        api.alert({
                            msg: JSON.stringify(errs)
                        });
                    }


                });
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
                var s = 'http://' + serverIP + '/UploadFile/uploadPicture.action';
                DoLoadingPicture();
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
                }, function(rets, errs) {
                    ClearLoadingPicture();
                    if (rets) {
                        $('.imgBox').append(pictureTemplate(rets.imgUrl, ret.base64Data));
                        alert("上传成功!");
                    } else {
                        api.alert({
                            msg: JSON.stringify(errs)
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


//根据pipeno millno 获取 本次检验频次信息  已合并至OD ID 接收标准同时获取
// function RequestInspectionFrequency(pipeno, millno) {
//
//     //注册接收RequestInspectionFrequency回调
//     api.addEventListener({
//         name: 'RequestInspectionFrequencyCallbackEvent'
//     }, function(ret, err) {
//         if (ret.value.success) {
//             //得到了检验频次信息
//             var data = ret.value.data;
//             $.each(data, function(name, value) {
//                 var needInspectNow = value.needInspectNow;
//                 if (name != undefined) {
//                     if (name.indexOf("od_") != -1 || name.indexOf("id_") != -1 || name.indexOf("_freq") != -1) {
//                         name0 = "." + name.replace("od_", "").replace("id_", "").replace("_freq", "");
//                         name = "." + name.replace("od_", "").replace("id_", "").replace("_freq", "") + "_lbl";
//                         //alert(name);
//                         if (needInspectNow != undefined && needInspectNow) {
//                             $(name0).attr('data-required', true);
//                             if ($(name).children('.freq-span').length <= 0)
//                                 $(name).append('<span class="freq-span" style="color:red;padding-left:5px;">本次必填</span>');
//                         }
//                     }
//                 }
//             });
//         } else {
//             //session中不存在millno
//             //alert(JSON.stringify(ret.value.msg));
//             //处理逻辑。。。
//             GetInspectFreqFail();
//         }
//     });
//     //发出请求
//     var s = 'http://' + serverIP + '/InspectionFrequencyOperation/getAllInspectionTimeMapByPipeNoMillNo.action';
//     api.ajax({
//         url: s,
//         method: 'post',
//         timeout: 30,
//         dataType: 'json',
//         data: {
//             values: {
//                 pipe_no: pipeno,
//                 mill_no: millno
//             }
//
//         }
//     }, function(ret, err) {
//         api.hideProgress();
//         var success = false;
//         if (ret) {
//             success = true;
//         } else {
//             api.alert({
//                 msg: JSON.stringify(err)
//             });
//         }
//         api.sendEvent({
//             name: 'RequestInspectionFrequencyCallbackEvent',
//             extra: {
//                 success: success,
//                 data: ret
//             }
//         });
//
//     });
// }



//根据pipeno  内外防腐标准、检验频率、钢管信息、光管检验频率、pending数据  APP使用  stencil_content 做完动态替换
function RequestAllProcessInfoByPipeNo(pipeno) {
    //alert(pipeno);
    // pipeno="1524540";
    //注册接收RequestAllProcessInfoByPipeNo回调
    api.addEventListener({
        name: 'RequestAllProcessInfoByPipeNoCallbackEvent'
    }, function(ret, err) {
        if (ret.value.success) {
            //得到了外防接收标准  下一行代码不要注释！！
            var employeeno = ret.value.data.employeeno;
            var millno = ret.value.data.millno;
            var odcriteria = ret.value.data.odcriteria;
            var idcriteria = ret.value.data.idcriteria;
            var pbcriteria = ret.value.data.pbcriteria;
            var inspectfreq = ret.value.data.inspectfreq;
            var pipeinfo = ret.value.data.pipeinfo;



            GetAllProcessInfoByPipeNoOK(ret.value.data);
        } else {
            //alert(JSON.stringify(ret.value.msg));
            //处理逻辑。。。
            GetAllProcessInfoByPipeNoFail(ret.value.data.message);
        }
    });

    //发出请求
    var s = 'http://' + serverIP + '/APPRequestTransfer/getAllProcessInfoByPipeNo.action';
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
        if (ret) {

        } else {
            api.alert({
                msg: JSON.stringify(err)
            });
        }
        api.sendEvent({
            name: 'RequestAllProcessInfoByPipeNoCallbackEvent',
            extra: {
                success: ret.success,
                data: ret
            }
        });

    });
}

//关闭窗口并且更新piperoot页面
function closeWindow() {
    api.sendEvent({
        name: 'refreshPipeRoot',
        extra: {
            pipe_no: g_pipeno
        }
    });
    setTimeout(function() {
        api.closeWin();
    }, 100);
}

///初始化钢管信息header
function initPipeBasicHeader(pipeinfo, millno) {
    if (pipeinfo != undefined) {
        $('.pipeinfo-table .pipe_no').text(pipeinfo.pipe_no);
        $('.pipeinfo-table .status_name').text(pipeinfo.status_name);
        $('.pipeinfo-table .od').text(pipeinfo.od);
        $('.pipeinfo-table .wt').text(pipeinfo.wt);
        $('.pipeinfo-table .millno').text(millno);
    }
}

//初始化检测频率标签
function initInspectionFreq(freq) {

    if (freq != undefined) {
        $.each(freq, function(name, value) {
            var needInspectNow = value.needInspectNow;
            if (name != undefined) {
                if (name.indexOf("od_") != -1 || name.indexOf("id_") != -1 || name.indexOf("_freq") != -1) {
                    name0 = "." + name.replace("od_", "").replace("id_", "").replace("_freq", "");
                    name = "." + name.replace("od_", "").replace("id_", "").replace("_freq", "") + "_lbl";
                    //alert(name);
                    if (needInspectNow != undefined && needInspectNow) {
                        $(name0).attr('data-required', true);
                        if ($(name).children('.freq-span').length <= 0)
                            $(name).append('<span class="freq-span" style="color:red;padding-left:5px;">本次必填</span>');
                    }
                }
            }
        });
    }


}


//涂层、光管标准最大值最小值标签初始化
function initCriteria(criteria) {
    if (criteria != undefined) {
        $.each(criteria, function(name, value) {
            if (name != undefined) {
                if (name.indexOf("_min") != -1) {
                    name = "." + name.replace("_min", "");
                    if (value != undefined) {
                        $(name).each(function(){
                           $(this).attr('data-min', value);
                        });
                    }
                    name = name + "_lbl";
                    $(name).each(function(){
                      if ($(this).children('.range-span').length <= 0) {
                          $(this).append('<span class="range-span">' + value + '~</span>');
                      } else {
                          var txt = $(this).children('.range-span').text();
                          //判断是否已经设置了min 因为  存在检测项  od_xx_min  id_xx_min
                          $(this).children('.range-span').text(value + "~" + txt);
                      }
                    });
                } else if (name.indexOf("_max") != -1) {
                    name = "." + name.replace("_max", "");
                    if (value != undefined)
                    {
                      $(name).each(function(){
                        $(this).attr('data-max', value);
                      });
                    }
                    name = name + "_lbl";
                    $(name).each(function(){
                      if ($(this).children('.range-span').length <= 0) {
                          $(this).append('<span class="range-span">' + value + '</span>');
                      } else {
                          var txt = $(this).children('.range-span').text();
                          $(this).children('.range-span').text(txt + "" + value);
                      }
                    });
                }
            }
        });
    }
}


//根据pipeno  获取 内防接收标准
// function RequestIDAcceptCriteria(pipeno, millno) {
//
//     //注册接收RequestIDAcceptCriteria回调
//     api.addEventListener({
//         name: 'RequestIDAcceptCriteriaCallbackEvent'
//     }, function(ret, err) {
//         if (ret.value.success) {
//             //得到了内防接收标准
//             ////处理逻辑。。。
//             GetIDAcceptCriteriaOK(ret.value.data);
//             var data = ret.value.data.criteria;
//             var freq = ret.value.data.inspectfreq;
//             if (data != undefined) {
//                 $.each(data, function(name, value) {
//                     if (name != undefined) {
//                         if (name.indexOf("_min") != -1) {
//                             name = "." + name.replace("_min", "");
//                             if (value != undefined)
//                                 $(name).attr('data-min', value);
//                             name = name + "_lbl";
//                             if ($(name).children('.range-span').length <= 0) {
//                                 $(name).append('<span class="range-span">' + value + '~</span>');
//                             } else {
//                                 var txt = $(name).children('.range-span').text();
//                                 $(name).children('.range-span').text(value + "~" + txt);
//                             }
//                         } else if (name.indexOf("_max") != -1) {
//                             name = "." + name.replace("_max", "");
//                             if (value != undefined)
//                                 $(name).attr('data-max', value);
//                             name = name + "_lbl";
//                             if ($(name).children('.range-span').length <= 0) {
//                                 $(name).append('<span class="range-span">' + value + '</span>');
//                             } else {
//                                 var txt = $(name).children('.range-span').text();
//                                 $(name).children('.range-span').text(txt + "" + value);
//                             }
//                         }
//                     }
//                 });
//             }
//             $.each(freq, function(name, value) {
//                 var needInspectNow = value.needInspectNow;
//                 if (name != undefined) {
//                     if (name.indexOf("od_") != -1 || name.indexOf("id_") != -1 || name.indexOf("_freq") != -1) {
//                         name0 = "." + name.replace("od_", "").replace("id_", "").replace("_freq", "");
//                         name = "." + name.replace("od_", "").replace("id_", "").replace("_freq", "") + "_lbl";
//                         //alert(name);
//                         if (needInspectNow != undefined && needInspectNow) {
//                             $(name0).attr('data-required', true);
//                             if ($(name).children('.freq-span').length <= 0)
//                                 $(name).append('<span class="freq-span" style="color:red;padding-left:5px;">本次必填</span>');
//                         }
//                     }
//                 }
//             });
//
//         } else {
//             //alert(JSON.stringify(ret.value.msg));
//             //处理逻辑。。。
//             GetIDAcceptCriteriaFail();
//         }
//     });
//
//     //发出请求
//     var s = 'http://' + serverIP + '/AcceptanceCriteriaOperation/getIDAcceptanceCriteriaByPipeNo.action';
//     api.ajax({
//         url: s,
//         method: 'post',
//         timeout: 30,
//         dataType: 'json',
//         data: {
//             values: {
//                 pipe_no: pipeno,
//                 mill_no: millno
//             }
//         }
//     }, function(ret, err) {
//         api.hideProgress();
//         var success = false;
//         if (ret) {
//             success = true;
//         } else {
//             api.alert({
//                 msg: JSON.stringify(err)
//             });
//         }
//         api.sendEvent({
//             name: 'RequestIDAcceptCriteriaCallbackEvent',
//             extra: {
//                 success: success,
//                 data: ret
//             }
//         });
//
//     });
// }
//设置控件
function setControls() {


    $('.mob-datetime').mobiscroll().datetime({
        dateWheels: 'yymmdd',
        timeWheels: 'hhii',
        dateFormat: 'yy-mm-dd',
        timeFormat: 'hh:ii:ss',
        headerText: '日期格式 yyyy-mm-dd hh:mm',
        yearSuffix: '  -',
        monthSuffix: '  -',
        onShow: function(event, inst) {
            inst.setVal($(this).val());
        }
    });

    // $('#exp').mobiscroll().datetime();



    //湿度
    $(".mob-humidity").mobiscroll().temperature({
        theme: 'auto',
        lang: 'zh',
        display: 'center',
        min: 0,
        defaultValue: 50,
        max: 100,
        step: 0.1,
        scale: 1,
        units: ['c'],
        unitNames: {
            c: '%'
        },
        onSet: function(event, inst) {
            var selectedVal = inst.getVal();
            $(this).val(selectedVal.replace('%', ''));
            validateSingleValue($(this));
        }
    });

    $(".mob-strip-temperature").mobiscroll().temperature({
        theme: 'auto',
        lang: 'zh',
        display: 'center',
        min: 100,
        max: 400,
        defaultValue: 230,
        step: 1,
        scale: 0,
        units: ['c'],
        unitNames: {
            c: '°C'
        },
        onSet: function(event, inst) {
            var selectedVal = inst.getVal();
            $(this).val(selectedVal.replace('°C', ''));
            validateSingleValue($(this));
        }
    });
    //设置温度相关的控件
    //if($(".mob-preheat-temperature")!=undefined)
    $(".mob-preheat-temperature").mobiscroll().temperature({
        theme: 'auto',
        lang: 'zh',
        display: 'center',
        min: 10,
        max: 100,
        defaultValue: 50,
        step: 0.5,
        scale: 1,
        units: ['c'],
        unitNames: {
            c: '°C'
        },
        onSet: function(event, inst) {
            var selectedVal = inst.getVal();
            $(this).val(selectedVal.replace('°C', ''));
            validateSingleValue($(this));
        }
    });
    //空气温度
    //if($(".mob-air-temperature")!=undefined)
    $(".mob-air-temperature,.mob-curing-temp").mobiscroll().temperature({
        theme: 'auto',
        lang: 'zh',
        display: 'center',
        min: -5,
        defaultValue: 30,
        max: 80,
        step: 0.1,
        scale: 1,
        units: ['c'],
        unitNames: {
            c: '°C'
        },
        onSet: function(event, inst) {
            var selectedVal = inst.getVal();
            $(this).val(selectedVal.replace('°C', ''));
            validateSingleValue($(this));
        }
    });
    //钢管温度
    $(".mob-pipe-temperature").mobiscroll().temperature({
        theme: 'auto',
        lang: 'zh',
        display: 'center',
        min: 10,
        max: 100,
        step: 0.1,
        scale: 1,
        defaultValue: 45,
        units: ['c'],
        unitNames: {
            c: '°C'
        },
        onSet: function(event, inst) {
            var selectedVal = inst.getVal();
            $(this).val(selectedVal.replace('°C', ''));
            validateSingleValue($(this));

        }
    });
    //中频温度
    $(".mob-application-temp").mobiscroll().temperature({
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
            validateSingleValue($(this));

        }
    });
    //打砂前后盐度
    //if($(".mob-salt-contamination")!=undefined)
    $('.mob-salt-contamination').mobiscroll().number({
        theme: 'auto',
        lang: 'zh',
        display: 'center',
        min: 0,
        max: 50,
        defaultValue: 5,
        step: 0.1,
        scale: 1,
        units: ['c'],
        unitNames: {
            c: 'mg/㎡'
        },
        onSet: function(event, inst) {
            var selectedVal = inst.getVal();
            $(this).val(selectedVal.replace('mg/㎡', ''));
            validateSingleValue($(this));
        }
    });
    //所用时间s
    //if($(".mob-second-time")!=undefined)
    $('.mob-second-time').mobiscroll().number({
        theme: 'auto',
        lang: 'zh',
        display: 'center',
        min: 0,
        max: 100,
        defaultValue: 28,
        step: 1,
        scale: 0,
        units: ['c'],
        unitNames: {
            c: 's'
        },
        onSet: function(event, inst) {
            var selectedVal = inst.getVal();
            $(this).val(selectedVal.replace('s', ''));
            validateSingleValue($(this));
        }
    });
    //浓度
    //if($(".mob-concentration")!=undefined)
    $('.mob-concentration').mobiscroll().number({
        theme: 'auto',
        lang: 'zh',
        display: 'center',
        min: 0,
        max: 100,
        defaultValue: 50,
        step: 0.1,
        scale: 1,
        units: ['c'],
        unitNames: {
            c: '%'
        },
        onSet: function(event, inst) {
            var selectedVal = inst.getVal();
            $(this).val(selectedVal.replace('%', ''));
            validateSingleValue($(this));
        }
    });
    //冲洗电导率
    //if($('.mob-water-conductivity')!=undefined)
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
            validateSingleValue($(this));
        }
    });
    //磨料电导率
    //if($('.mob-abrasive-conductivity')!=undefined)
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
            validateSingleValue($(this));
        }
    });
    //速度
    //if($('.mob-line-speed')!=undefined)
    $('.mob-line-speed').mobiscroll().number({
        theme: 'auto',
        lang: 'zh',
        display: 'center',
        min: 0,
        max: 20,
        defaultValue: 0.5,
        step: 0.1,
        scale: 1,
        units: ['c'],
        unitNames: {
            c: 'm/s'
        },
        onSet: function(event, inst) {
            var selectedVal = inst.getVal();
            $(this).val(selectedVal.replace('m/s', ''));
            validateSingleValue($(this));
        }
    });
    var numList = "";
    var $nowObj;
    //设置整数数字集合
    $('.mob-number-list').mobiscroll().numpad({
        theme: 'auto',
        lang: 'zh',
        display: 'bottom',
        min: 0,
        max: 9999,
        scale: 0,
        fill: 'ltr',
        defaultValue: 0,
        preset: 'decimal',
        decimalSeparator: '',
        thousandsSeparator: '',
        rtl: false,
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
                    validateSingleValue($nowObj);
                    inst.setVal(0);
                }
            }, {
                text: '添加',
                icon: '',
                handler: function(event, inst) {
                    var selectedVal = inst.getVal(true);
                    if (selectedVal != undefined) {
                        selectedVal = ($nowObj.val() + selectedVal + ",");
                        $nowObj.val(selectedVal);
                        numList = selectedVal;
                        validateSingleValue($nowObj);
                        inst.setVal(0);
                    }
                }
            }
        ],
        onBeforeShow: function(event, inst) {
            $nowObj = $(this);
            inst.setVal(0);
            numList = $nowObj.val();
        },
        onSet: function(event, inst) {
            // var selectedVal =$nowObj.val();
            // alert(selectedVal);
            $nowObj.val(numList);
            // selectedVal = ($nowObj.val()+ selectedVal + ",");
            // $nowObj.val(selectedVal);
            // var selectedVal = inst.getVal(true);
            // if (selectedVal != undefined) {
            //     selectedVal = (numList + "" + selectedVal + ",");
            //     $(this).val(selectedVal);
            //     var arr = selectedVal.split(",");
            //     var minVal = $(this).attr('data-min');
            //     var maxVal = $(this).attr('data-max');
            //
            //     var flag = true;
            //     for (var i = 0; i < arr.length; i++) {
            //         if (maxVal != undefined) {
            //             if (parseFloat(maxVal) < parseFloat(arr[i])) {
            //                 flag = false;
            //                 break;
            //             }
            //         }
            //         if (minVal != undefined) {
            //             if (parseFloat(arr[i]) < parseFloat(minVal)) {
            //                 flag = false;
            //                 break;
            //             }
            //         }
            //     }
            //     if (flag)
            //         $(this).css('background', '#FFFFFF');
            //     else
            //         $(this).css('background', '#F9A6A6');
            //     numList = "";
            // }
        }
    });
    var numList1 = "";
    var $nowObj1;
    //设置浮点数数字集合
    $('.mob-number-float-list').mobiscroll().numpad({
        theme: 'auto',
        lang: 'zh',
        display: 'bottom',
        min: 0,
        max: 9999,
        scale: 2,
        fill: 'ltr',
        defaultValue: 0,
        preset: 'decimal',
        decimalSeparator: '',
        thousandsSeparator: '.',
        rtl: false,
        buttons: [
            'set', {
                text: '删除',
                icon: '',
                handler: function(event, inst) {
                    var selectedVal = $nowObj1.val();
                    selectedVal = selectedVal.substring(0, selectedVal.lastIndexOf(','));
                    selectedVal = selectedVal.substring(0, (selectedVal.lastIndexOf(',') + 1));
                    $nowObj1.val(selectedVal);
                    numList1 = selectedVal;
                    validateSingleValue($nowObj1);
                    inst.setVal(0);
                }
            }, {
                text: '添加',
                icon: '',
                handler: function(event, inst) {
                    var selectedVal = inst.getVal(true);
                    if (selectedVal != undefined) {
                        selectedVal = ($nowObj1.val() + selectedVal + ",");
                        $nowObj1.val(selectedVal);
                        numList1 = selectedVal;
                        validateSingleValue($nowObj1);
                        inst.setVal(0);
                    }
                }
            }
        ],
        onBeforeShow: function(event, inst) {
            $nowObj1 = $(this);
            inst.setVal(0);
            numList1 = $nowObj1.val();
        },
        onSet: function(event, inst) {
            $nowObj1.val(numList1);
        }
    });
    //检漏仪器电压
    $('.mob-holiday-tester-volts').mobiscroll().number({
        theme: 'auto',
        lang: 'zh',
        display: 'center',
        min: 0,
        max: 30,
        defaultValue: 16,
        step: 0.1,
        scale: 1,
        units: ['c'],
        unitNames: {
            c: 'kv'
        },
        onSet: function(event, inst) {
            var selectedVal = inst.getVal();
            $(this).val(selectedVal.replace('kv', ''));
            validateSingleValue($(this));
        }
    });


    //漏点数量
    $('.mob-holidays').mobiscroll().number({
        theme: 'auto',
        lang: 'zh',
        display: 'center',
        min: 0,
        max: 30,
        defaultValue: 0,
        step: 1,
        scale: 0,
        onSet: function(event, inst) {
            //var selectedVal = inst.getVal();
            validateSingleValue($(this));
        }
    });
    //修补数
    $('.mob-repair').mobiscroll().number({
        theme: 'auto',
        lang: 'zh',
        display: 'center',
        min: 0,
        max: 30,
        defaultValue: 0,
        step: 1,
        scale: 0,
        onSet: function(event, inst) {
            validateSingleValue($(this));
        }
    });

    //锚纹深度
    $('.mob-profile').mobiscroll().number({
        theme: 'auto',
        lang: 'zh',
        display: 'center',
        min: 0,
        max: 100,
        defaultValue: 50,
        step: 1,
        scale: 0,
        units: ['c'],
        unitNames: {
            c: 'μm'
        },
        onSet: function(event, inst) {
            var selectedVal = inst.getVal();
            $(this).val(selectedVal.replace('μm', ''));
            validateSingleValue($(this));
        }
    });
    //底层、面层粉末喷枪数(外涂2fbe)
    $('.mob-base-coat-gun-count,.mob-top-coat-gun-count').mobiscroll().number({
        theme: 'auto',
        lang: 'zh',
        display: 'center',
        min: 0,
        max: 100,
        defaultValue: 50,
        step: 1,
        scale: 0,
        onSet: function(event, inst) {
            var selectedVal = inst.getVal();
            $(this).val(selectedVal);
            validateSingleValue($(this));
        }
    });
    //整数numpad
    $('.mob-int-numpad').mobiscroll().numpad({
        theme: 'auto',
        lang: 'zh',
        display: 'bottom',
        preset: 'decimal',
        decimalSeparator: '',
        thousandsSeparator: '',
        min: -9999,
        max: 9999,
        scale: 0,
        fill: 'ltr',
        defaultValue: 0,
        rtl: false,
        onSet: function(event, inst) {
            var selectedVal = inst.getVal();
            $(this).val(selectedVal);
            validateSingleValue($(this));
        }
    });
    //小数numpad精确度1
    $('.mob-floatone-numpad').mobiscroll().numpad({
        theme: 'auto',
        lang: 'zh',
        display: 'bottom',
        preset: 'decimal',
        decimalSeparator: '.',
        min: -9999,
        max: 9999,
        scale: 1,
        fill: 'ltr',
        defaultValue: 0,
        rtl: false,
        onSet: function(event, inst) {
            var selectedVal = inst.getVal();
            $(this).val(selectedVal);
            validateSingleValue($(this));
        }
    });
    //小数numpad精确度2
    $('.mob-floattwo-numpad').mobiscroll().numpad({
        theme: 'auto',
        lang: 'zh',
        display: 'bottom',
        preset: 'decimal',
        decimalSeparator: '.',
        min: -9999,
        max: 9999,
        scale: 2,
        fill: 'ltr',
        defaultValue: 0,
        rtl: false,
        onSet: function(event, inst) {
            var selectedVal = inst.getVal();
            $(this).val(selectedVal);
            validateSingleValue($(this));
        }
    });
    //剩余壁厚记录控件
    $('.mob-thickness-list').mobiscroll().numpad({
        theme: 'auto',
        lang: 'zh',
        display: 'bottom',
        preset: 'decimal',
        decimalSeparator: '.',
        min: -9999,
        max: 9999,
        scale: 2,
        fill: 'ltr',
        defaultValue: 0,
        rtl: false,
        onSet: function(event, inst) {
            var selectedVal = inst.getVal();
            $(this).val(selectedVal);
            var minVal = $(this).attr('data-min');
            var maxVal = $(this).attr('data-max');
            var wt=$('#wt').val();
            if(wt!=undefined){
              var maximumwt=(maxVal+1)*wt;
              var minimumwt=(minVal+1)*wt;
              var thisVal=$(this).val();var flag = true;
              if (thisVal != undefined && thisVal != -99 && thisVal != "") {
                  var valuelist = thisVal.split(",");
                  for (var i = 0; i < valuelist.length; i++) {
                      if (maximumwt != undefined) {
                          if (parseFloat(maximumwt) < parseFloat(valuelist[i])) {
                              flag = false;
                              break;
                          }
                      }
                      if (minimumwt != undefined) {
                          if (parseFloat(valuelist[i]) < parseFloat(minimumwt)) {
                              flag = false;
                              break;
                          }
                      }
                  }
              }
              if (flag)
                  $(this).css('background', '#FFFFFF');
              else
                  $(this).css('background', '#F9A6A6');
            }
        }
    });
    //设置日期控件
    $('.mob-datetime-input').mobiscroll().datetime({
        theme: 'auto',
        lang: 'zh',
        display: 'bottom',
        dateFormat:'yyyy-mm-dd',
        timeFormat: 'HH:ii:ss'
    });
    //切斜
    $('.mob-squareness').mobiscroll().number({
        theme: 'auto',
        lang: 'zh',
        display: 'center',
        min: 0,
        max: 5,
        step:0.1,
        defaultValue:1,
        units: ['c'],
        unitNames: {
            c: 'mm'
        },
        onSet: function(event, inst) {
            var selectedVal = inst.getVal();
            $(this).val(selectedVal.replace('mm', ''));
            validateSingleValue($(this));
        }
    });
    //椭圆度
    $('.mob-ovality').mobiscroll().number({
        theme: 'auto',
        lang: 'zh',
        display: 'center',
        min: 0,
        max:0.1,
        step:0.001,
        defaultValue:0.01,
        onSet: function(event, inst) {
            validateSingleValue($(this));
        }
    });
    //坡口角度
    $('.mob-bevelangle').mobiscroll().number({
        theme: 'auto',
        lang: 'zh',
        display: 'center',
        min: 0,
        max:50,
        step:1,
        defaultValue:30,
        units: ['c'],
        unitNames: {
            c:'°'
        },
        onSet: function(event, inst) {
            var selectedVal = inst.getVal();
            $(this).val(selectedVal.replace('°', ''));
            validateSingleValue($(this));
        }
    });
    //钝边
    $('.mob-rootface').mobiscroll().number({
        theme: 'auto',
        lang: 'zh',
        display: 'center',
        min: 0,
        max: 3,
        step:0.1,
        defaultValue:1.6,
        units: ['c'],
        unitNames: {
            c: 'mm'
        },
        onSet: function(event, inst) {
            var selectedVal = inst.getVal();
            $(this).val(selectedVal.replace('mm', ''));
            validateSingleValue($(this));
        }
    });
    //设置底层、面层型号控件
    var s = 'http://' + serverIP + '/CoatingPowderOperation/getAllCoatingPowderInfo.action';
    api.ajax({
        url: s,
        method: 'post',
        timeout: 30,
        dataType: 'json',
        data: {}
    }, function(ret, err) {
        if (ret) {
            $.each(ret,function(k,v){
                 var name="."+k;
                 for (var i = 0; i < v.length; i++) {
                      $(name).append('<option value=' +v[i].text + '>' +v[i].text  + '</option>');
                 }
            })
        } else {
            api.alert({
                msg: JSON.stringify(err)
            });
        }
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
//获取表单头部钢管信息  不需要了，合并至OD接收标准
// function getPipeBasicInfoHeader(pipeno, millno) {
//     var s = 'http://' + serverIP + '/APPRequestTransfer/getCoatingInfoByPipeNo.action';
//     api.ajax({
//         url: s,
//         method: 'post',
//         timeout: 30,
//         dataType: 'json',
//         data: {
//             values: {
//                 pipe_no: pipeno
//             }
//         }
//     }, function(ret, err) { //alert(ret);
//         if (ret) {
//             if (ret.success == false) {
//                 api.alert({
//                     msg: JSON.stringify(ret.message)
//                 });
//             } else {
//                 pipeinfo = ret.pipeinfo;
//                 $('.pipeinfo-table .pipe_no').text(pipeinfo.pipe_no);
//                 $('.pipeinfo-table .status_name').text(pipeinfo.status_name);
//                 $('.pipeinfo-table .od').text(pipeinfo.od);
//                 $('.pipeinfo-table .wt').text(pipeinfo.wt);
//                 $('.pipeinfo-table .millno').text(millno);
//                 hlLanguage("../../i18n/");
//             }
//         } else {
//             //alert("err");
//             api.alert({
//                 msg: JSON.stringify(err)
//             });
//         }
//     });
// }
//初始化未填项目
function initFormNumber() {
    var result = true;
    //必填项目检验
    $("input[data-required=true]").each(function(a, b) {
        if ($(this).val().length <= 0) {
            var name = $(this).parent().siblings('.form-item-lbl').children('label').text().replace("本次必填", "");
            api.alert({
                msg: "请输入:" + name
            });
            result = false;
            return result;
        }
    });
    if (result) {
        $('select[data-required=true]').each(function(a, b) {
            var selectContent = $(this).find("option:selected").text();
            if (selectContent.indexOf("未测") >= 0 || selectContent.indexOf("未检测") >= 0) {
                var name = $(this).parent().siblings('.form-item-lbl').children('label').text().replace("本次必填", "");
                api.alert({
                    msg: "请输入:" + name
                });
                result = false;
                return result;
            }
        });
    }
    if (!result)
        return false;
    //设置默认值
    $("input[data-number=true]").each(function(a, b) {
        if ($(this).val().length <= 0) {
            $(this).val(-99);
        }
    });
    // $("input[data-number=false]").each(function(a, b) {
    //     if ($(this).val().length <= 0) {
    //         $(this).val('');
    //     }
    // });
    return true;
}

function getPendingRecordInfo(controller, pipe_no) {
    api.addEventListener({
        name: 'getPendingRecordCallBackEvent'
    }, function(ret, err) {
        $('.imgBox').empty();
        if (ret.value.success) {
            getPendingRecordInfoOK(ret.value.data);
        } else {
            getPendingRecordInfoFail();
        }
    });
    var s = 'http://' + serverIP + '/' + controller + '/getPendingRecordByPipeNo.action';
    api.ajax({
        url: s,
        method: 'post',
        timeout: 30,
        dataType: 'json',
        data: {
            values: {
                pipe_no: pipe_no
            }
        }
    }, function(ret, err) { //alert(ret);
        if (ret) {
            api.sendEvent({
                name: 'getPendingRecordCallBackEvent',
                extra: {
                    success: ret.success,
                    data: ret.record
                }
            });
        } else {
            //alert("err");
            api.alert({
                msg: JSON.stringify(err)
            });
        }

    });
}



//验证单个控件的数据是否合格,此方法使用单值和多值列表,下拉单选
function validateSingleValue(obj) {
    var minVal = obj.attr('data-min');
    var maxVal = obj.attr('data-max');
    var objvalue = obj.val();
    var flag = true;
    if (objvalue != undefined && objvalue != -99 && objvalue != "") {
        var valuelist = objvalue.split(",");
        for (var i = 0; i < valuelist.length; i++) {
            if (maxVal != undefined) {
                if (parseFloat(maxVal) < parseFloat(valuelist[i])) {
                    flag = false;
                    break;
                }
            }
            if (minVal != undefined) {
                if (parseFloat(valuelist[i]) < parseFloat(minVal)) {
                    flag = false;
                    break;
                }
            }
        }
    }
    if (flag)
        obj.css('background', '#FFFFFF');
    else
        obj.css('background', '#F9A6A6');
}

//判断是否合格
function validateAllValue() {
    //选择控件的onchange后需要判断
    $('.validate-select').on('change', function() {
        var max = $(this).attr('data-max');
        var min = $(this).attr('data-min');
        var thisVal = $(this).val();
        validateSingleValue($(this));
    });
    //验证所有input类型的数据范围
    $("input").each(function() {
        validateSingleValue($(this));
    });
    //验证所有select类型的数据范围
    $("select").each(function() {
        validateSingleValue($(this));
    });



}

//获取前一根合格管的涂层记录作为数据来源
function RequestLastAcceptedRecordBeforePipeNo(pipeno, operation) {
    //注册接收Request3LPELabAcceptCriteria回调
    api.addEventListener({
        name: 'RequestLastAcceptedRecordBeforePipeNoEvent'
    }, function(ret, err) {
        if (ret.value.success) {
            RequestLastAcceptedRecordBeforePipeNoOK(ret.value.data);
        } else {
            RequestLastAcceptedRecordBeforePipeNoFail();
        }
    });
    //发出请求
    var s = 'http://' + serverIP + '/' + operation + '/getLastAcceptedRecordBeforePipeNo.action';
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
        var success = false;
        if (ret) {
            success = true;
        } else {
            api.alert({
                msg: JSON.stringify(err)
            });
        }
        api.sendEvent({
            name: 'RequestLastAcceptedRecordBeforePipeNoEvent',
            extra: {
                success: success,
                data: ret.record
            }
        });

    });
}
//得到钢管后10根涂层记录管号，并且记录为待定状态 10
function RequestNextTenPipesBeforePipeNo(pipeno, operation) {
    //注册接收Request3LPELabAcceptCriteria回调
    api.addEventListener({
        name: 'RequestNextTenPipesBeforePipeNoEvent'
    }, function(ret, err) {
        if (ret.value.success) {
            RequestNextTenPipesBeforePipeNoEventOK(ret.value.data);
        } else {
            RequestNextTenPipesBeforePipeNoEventFail();
        }
    });
    //发出请求
    var s = 'http://' + serverIP + '/' + operation + '/getNextTenPipesBeforePipeNo.action';
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
        var success = false;
        if (ret) {
            success = true;
        } else {
            api.alert({
                msg: JSON.stringify(err)
            });
        }
        api.sendEvent({
            name: 'RequestNextTenPipesBeforePipeNoEvent',
            extra: {
                success: success,
                data: ret.data
            }
        });

    });
}
//清空表单label数据
function clearLabelData() {
    $('label').each(function() {
        $(this).find('span').remove();
    });
}
//获取当前时间
function getNowDate(){
  var d=new Date();
  var year=d.getFullYear();
  var month=(d.getMonth()+1)<10?"0"+(d.getMonth()+1):(d.getMonth()+1);
  var day=d.getDate()<10?"0"+d.getDate():d.getDate();
  var hours=d.getHours()<10?"0"+d.getHours():d.getHours();
  var minute=d.getMinutes()<10?"0"+d.getMinutes():d.getMinutes();
  var second=d.getSeconds()<10?"0"+d.getSeconds():d.getSeconds();
  return year+"-"+month+"-"+day+" "+hours+":"+minute+":"+second;
}
//获取实验管管号
function getSamplePipeNo(className,pipeno,coating_date,url,flag,testing_id){
    var s = 'http://' + serverIP + '/pipeinfo/'+url+'.action';
    api.ajax({
        url: s,
        method: 'post',
        timeout: 30,
        dataType: 'json',
        data: {
            values: {
                pipe_no: pipeno,
                coating_date:coating_date,
                testing_id:testing_id
            }
        }
    }, function(ret, err) {
        if (ret) {
             for (var i = 0; i < ret.length; i++) {
                if(flag==1)
                  $(className).append('<option value=' +ret[i].pipe_no + ' selected="selected">' +ret[i].pipe_no  + '</option>');
                else
                  $(className).append('<option value=' +ret[i].pipe_no + '>' +ret[i].pipe_no  + '</option>');
             }
        } else {
            api.alert({
                msg: JSON.stringify(err)
            });
        }
    });
}



//根据id获取原材料试验数据
function RequestRawMaterialTestingInfoById(id,url) {
    api.addEventListener({
        name: 'RequestRawMaterialTestingInfoByIdCallbackEvent'
    }, function(ret, err) {
        if (ret.value.success) {
            GetRawMaterialTestingInfoByIdOK(ret.value.data);
        } else {
            GetRawMaterialTestingInfoByIdFail();
        }
    });
    var s = 'http://' + serverIP +'/'+url;
    api.ajax({
        url: s,
        method: 'post',
        timeout: 30,
        dataType: 'json',
        data: {
            values: {
                id:id
            }
        }
    }, function(ret, err) {
        api.hideProgress();
        if (ret) {
        } else {
            api.alert({
                msg: JSON.stringify(err)
            });
        }
        api.sendEvent({
            name: 'RequestRawMaterialTestingInfoByIdCallbackEvent',
            extra: {
                success: ret.success,
                data: ret.record
            }
        });

    });
}
//获取项目编号和项目名集合
function RequireProjectNo() {
  api.addEventListener({
      name: 'RequireProjectNoCallbackEvent'
  }, function(ret, err) {
      if (ret.value.success) {
          RequireProjectNoOK(ret.value.data);
      } else {
          RequireProjectNoFail();
      }
  });
    var s = 'http://' + serverIP + '/ProjectOperation/getProjectInfoByNoOrName.action';
    api.ajax({
        url: s,
        method: 'post',
        timeout: 30,
        dataType: 'json',
        data: {
            values: {}
        }
    }, function(ret, err) {
        if (ret) {
            // for (var i = 0; i < ret.length; i++) {
            //     $('#project_no').append('<option value=' + ret[i].project_no + '>' + ret[i].project_name + '</option>');
            // }
        } else {
            api.alert({
                msg: JSON.stringify(err)
            });
        }
        api.sendEvent({
            name: 'RequireProjectNoCallbackEvent',
            extra: {
                success: ret.success,
                data: ret
            }
        });
        //开始根据id获取实验记录
        // if(g_id!=undefined){
        //   RequestRawMaterialTestingInfoById(g_id,"RawMaterialTesting2FbeOperation/getRawMaterialTesting2FbeById.action");
        // }
    });
}

//根据project_no获取实验标准
function RequestRawMaterialCriteriaByProjecteNo(project_no) {
    api.addEventListener({
        name: 'RequestRawMaterialCriteriaByProjecteNoCallbackEvent'
    }, function(ret, err) {
        if (ret.value.success) {
            GetRawMaterialCriteriaByProjectNoOK(ret.value.data);
        } else {
            GetRawMaterialCriteriaByProjectNoFail(ret.value.data.message);
        }
    });
    var s = 'http://' + serverIP + '/APPRequestTransfer/getRawMaterialCriteriaByProjecteNo.action';
    api.ajax({
        url: s,
        method: 'post',
        timeout: 30,
        dataType: 'json',
        data: {
            values: {
                project_no: project_no
            }
        }
    }, function(ret, err) {
        api.hideProgress();
        if (ret) {

        } else {
            api.alert({
                msg: JSON.stringify(err)
            });
        }
        api.sendEvent({
            name: 'RequestRawMaterialCriteriaByProjecteNoCallbackEvent',
            extra: {
                success: ret.success,
                data: ret
            }
        });

    });
}
