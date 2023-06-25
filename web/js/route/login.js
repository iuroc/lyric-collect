"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeLogin = exports.checkError = exports.checkSuccess = exports.checkToken = void 0;
var config_1 = require("../config");
/** 校验 Token */
function checkToken(event) {
    // 初始化页面
    if (typeof event == 'undefined') {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', config_1.apiConfig.checkToken, false);
        xhr.send();
        var res = JSON.parse(xhr.responseText);
        // 校验成功
        res.code == 200 ? checkSuccess() : checkError();
        // 后期页面切换
        window.addEventListener('hashchange', function () {
            if (localStorage.getItem('hasLogin') != 'true'
                && location.hash.split('/')[1] != 'login')
                location.hash = '#/login';
        });
    }
}
exports.checkToken = checkToken;
/** 校验成功事件 */
function checkSuccess() {
    localStorage.setItem('hasLogin', 'true');
    if (location.hash.split('/')[1] == 'login')
        location.hash = '';
}
exports.checkSuccess = checkSuccess;
/** 校验失败事件 */
function checkError() {
    location.hash = '#/login';
    localStorage.removeItem('hasLogin');
}
exports.checkError = checkError;
/** 登录路由 */
var routeLogin = function (route) {
    var subLogin = route.dom.querySelector('.sub-login');
    var subRegister = route.dom.querySelector('.sub-register');
    if (route.args[0] == 'register') {
        subLogin.style.display = 'none';
        subRegister.style.display = 'block';
    }
    else {
        subLogin.style.display = 'block';
        subRegister.style.display = 'none';
    }
};
exports.routeLogin = routeLogin;
