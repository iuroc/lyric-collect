"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkToken = void 0;
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
        if (res.code == 200) {
            localStorage.setItem('hasLogin', 'true');
            if (location.hash.split('/')[1] == 'login')
                location.hash = '';
        }
        // 校验失败
        else {
            location.hash = '#/login';
            localStorage.removeItem('hasLogin');
        }
        // 后期页面切换
        window.addEventListener('hashchange', function () {
            if (localStorage.getItem('hasLogin') != 'true'
                && location.hash.split('/')[1] != 'login')
                location.hash = '#/login';
        });
    }
}
exports.checkToken = checkToken;
