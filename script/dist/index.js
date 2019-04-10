'use strict';

var _recommendOnSelected = true,
    _newOnSelected = false;

var recommendBtn = document.querySelector('#recommend');
var newBtn = document.querySelector('#new');

var _loginPageOpenStatus = false;

var apiready = function apiready() {
    api.setStatusBarStyle({
        style: 'dark',
        color: 'rgba(255,255,255,0.00001)'
    });
    api.parseTapmode();
    funIniGroup();
    switchFunc();
    listenMasterStationSwiperEvent();
    initSearchFunc();
    listenLoginPageOpenStatus();
    navbarDoubleClick();
    bindPushService();
};

function initSearchFunc() {
    var searchBtns = document.querySelectorAll('.search');
    for (var i = 0; i < searchBtns.length; i++) {
        searchBtns[i].onclick = function () {
            api.openWin({
                name: 'search',
                url: './html/search/search.html',
                animation: {
                    type: 'movein',
                    subType: 'from_right',
                    duration: 300
                }
            });
        };
    }
}

function listenMasterStationSwiperEvent() {
    //左滑
    api.addEventListener({
        name: 'swipeToRecommend'
    }, function (ret, err) {
        recommendBtnOnSelected();
    });
    //右滑
    api.addEventListener({
        name: 'swipeToNew'
    }, function (ret, err) {
        newBtnOnSelected();
    });
}

function listenLoginPageOpenStatus() {
    api.addEventListener({
        name: 'loginPageOpenStatus'
    }, function (ret, err) {
        if (ret.value.key === 1) {
            _loginPageOpenStatus = true;
        }
    });
    api.addEventListener({
        name: 'keyback'
    }, function (ret, err) {
        if (_loginPageOpenStatus) {
            api.closeFrame({
                name: 'login'
            });
            _loginPageOpenStatus = false;
        } else {
            api.closeWidget({
                id: 'A6093043874032',
                retData: {
                    name: 'closeWidget'
                },
                animation: {
                    type: 'flip',
                    subType: 'from_bottom',
                    duration: 500
                }
            });
        }
    });
}

function switchFunc() {
    recommendBtn.onclick = function (e) {
        recommendBtnOnSelected();
        e.stopPropagation();
    };
    newBtn.onclick = function (e) {
        newBtnOnSelected();
        e.stopPropagation();
    };
}

//推荐 被选中
function recommendBtnOnSelected() {
    recommendBtn.className = "selected";
    newBtn.className = "";
    api.setFrameGroupIndex({
        name: 'group',
        index: 0,
        scroll: true
    });
    _recommendOnSelected = true;
    _newOnSelected = false;
}

//最新 被选中
function newBtnOnSelected() {
    newBtn.className = "selected";
    recommendBtn.className = "";
    api.setFrameGroupIndex({
        name: 'group',
        index: 1,
        scroll: true
    });
    _recommendOnSelected = false;
    _newOnSelected = true;
}

function funIniGroup() {
    var eHeaderLis = $api.domAll('header li');
    frames = [];
    var frame = ['frame0.html', 'frame1.html', 'frame2.html', 'frame3.html', 'frame4.html'];
    for (var i = 0; i < eHeaderLis.length + 1; i++) {
        frames.push({
            url: './html/' + frame[i],
            bgColor: '#FEFEFE',
            bounces: false,
            overScrollMode: 'always'
        });
    }
    api.openFrameGroup({
        name: 'group',
        scrollEnabled: false,
        rect: {
            x: 0,
            y: $api.dom('header').offsetHeight + 28,
            w: api.winWidth,
            h: $api.dom('#main').offsetHeight - 75
        },
        overScrollMode: 'always',
        index: 0,
        frames: frames,
        background: '#FEFEFE',
        preload: 0
    }, function (ret, err) {});
}

// 随意切换按钮
function randomSwitchBtn(tag) {
    if (tag == $api.dom('#footer li.active')) return;
    var eFootLis = $api.domAll('#footer li');
    var eHeaderLis = $api.domAll('header li');
    var index = 0;
    for (var i = 0, len = eFootLis.length; i < len; i++) {
        if (tag == eFootLis[i]) {
            index = i;
        } else {
            $api.removeCls(eFootLis[i], 'active');
            $api.removeCls(eHeaderLis[i], 'active');
        }
    }
    $api.addCls(eFootLis[index], 'active');
    $api.addCls(eHeaderLis[index], 'active');
    if (index == 0) {
        if (_recommendOnSelected) {
            api.setFrameGroupIndex({
                name: 'group',
                index: 0,
                scroll: true
            });
        } else {
            api.setFrameGroupIndex({
                name: 'group',
                index: 1,
                scroll: true
            });
        }
        return;
    } else {
        index++;
    }
    api.setFrameGroupIndex({
        name: 'group',
        index: index,
        scroll: true
    });
}

//监听导航栏双击事件
function navbarDoubleClick() {
    var touchtime = new Date().getTime();
    var navbars = document.querySelectorAll('.border-b');

    var _loop = function _loop(i) {
        navbars[i].onclick = function (e) {
            if (new Date().getTime() - touchtime < 500) {
                console.log("dbclick");
                api.sendEvent({
                    name: 'navbarDoubleClick',
                    extra: {
                        key: i,
                        isRecommend: _recommendOnSelected
                    }
                });
            } else {
                touchtime = new Date().getTime();
                console.log("click");
            }
        };
    };

    for (var i = 0; i < navbars.length; i++) {
        _loop(i);
    }
}

//绑定推送相关
function bindPushService() {
    var ajpush = api.require('ajpush');
    //初始化
    ajpush.init(function (ret) {
        if (ret && ret.status) {
            //success
        }
    });
    //监听推送信息
    ajpush.setListener(function (ret) {
        var id = ret.id;
        var title = ret.title;
        var content = ret.content;
        var extra = ret.extra;
        //根据 extra 进行跳转
        api.openWin({
            name: 'videoPlay',
            url: 'html/play/videoPlay.html',
            pageParam: {
                pid: extra.gv
            },
            animation: {
                type: 'movein'
            }
        });
    });
}