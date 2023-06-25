"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeLogin = exports.checkError = exports.checkSuccess = exports.checkToken = void 0;
var config_1 = require("../config");
var util_1 = require("../util");
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
    if (route.status == 0) {
        route.status = 1;
        var elementGroup_1 = {
            input: {
                username: route.dom.querySelector('.input-username'),
                password: route.dom.querySelector('.input-password'),
                verCode: route.dom.querySelector('.input-vercode'),
            },
            button: {
                login: route.dom.querySelector('.click-login'),
                getVerCode: route.dom.querySelector('.get-vercode')
            }
        };
        var eventGroup = {
            getVerCode: function () {
                var usernameOremail = elementGroup_1.input.username.value;
                if (!(0, util_1.checkUsername)(usernameOremail) && !(0, util_1.checkEmail)(usernameOremail))
                    return alert('请输入正确的用户名或邮箱');
            },
            login: function () {
            }
        };
        elementGroup_1.button.getVerCode.addEventListener('click', eventGroup.getVerCode);
        elementGroup_1.button.login.addEventListener('click', eventGroup.login);
    }
};
exports.routeLogin = routeLogin;
