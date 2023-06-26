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
            /** 登录页表单元素 */
            loginForm: {
                /** 登录页用户名或邮箱 */
                username: subLogin.querySelector('.input-username'),
                /** 登录页密码 */
                password: subLogin.querySelector('.input-password'),
                /** 登录页验证码输入框 */
                verCode: subLogin.querySelector('.input-vercode'),
                /** 点击登录 */
                login: subLogin.querySelector('.click-login'),
                /** 登录页点击发送验证码 */
                getVerCode: subLogin.querySelector('.get-vercode')
            },
            /** 注册页表单元素 */
            registerForm: {
                /** 注册页用户名 */
                username: subRegister.querySelector('.input-username'),
                /** 注册页密码 */
                password: subRegister.querySelector('.input-password'),
                /** 注册页密码重复 */
                repeatPassword: subRegister.querySelector('.input-repeat-password'),
                /** 注册页邮箱 */
                email: subRegister.querySelector('.input-email'),
                /** 注册页验证码输入框 */
                verCode: subRegister.querySelector('.input-vercode'),
                /** 点击注册 */
                register: subRegister.querySelector('.click-register'),
                /** 注册页点击发送验证码 */
                getVerCode: subRegister.querySelector('.get-vercode')
            }
        };
        var eventGroup_1 = {
            /**
             * 发送验证码
             * @param toInput 发件人地址（用户名或邮箱）
             * @param button 点击发送验证码的按钮
             * @param login 是否处于登录页
             */
            getVerCode: function (to, button, login) {
                if (!login && !(0, util_1.checkEmail)(to))
                    return alert(config_1.errorMessage.email);
                if (login && !(0, util_1.checkUsernameOrEmail)(to))
                    return alert(config_1.errorMessage.usernameOrEmail);
                button.setAttribute('disabled', 'disabled');
                var timer;
                var changeStatus = function (second) {
                    if (second == 0)
                        return endStatus();
                    button.innerHTML = "".concat(second, " \u79D2");
                    timer = setTimeout(function () {
                        changeStatus(second - 1);
                    }, 1000);
                };
                var endStatus = function () {
                    button.innerHTML = '获取验证码';
                    button.removeAttribute('disabled');
                    clearTimeout(timer);
                };
                changeStatus(10);
                var xhr = new XMLHttpRequest();
                var params = new URLSearchParams();
                params.set('to', to);
                params.set('login', String(login));
                xhr.open('GET', config_1.apiConfig.getVerCode + '?' + params.toString());
                xhr.send();
                xhr.addEventListener('readystatechange', function () {
                    if (xhr.status == 200 && xhr.readyState == xhr.DONE) {
                        var res = JSON.parse(xhr.responseText);
                        if (res.code != 200) {
                            endStatus();
                            alert(res.msg);
                        }
                    }
                });
            },
            login: function () {
                var username = elementGroup_1.loginForm.username.value;
                var password = elementGroup_1.loginForm.password.value;
                var verCode = elementGroup_1.loginForm.verCode.value;
                if (!(0, util_1.checkUsernameOrEmail)(username))
                    return alert(config_1.errorMessage.usernameOrEmail);
                if (!(0, util_1.checkPassword)(password))
                    return alert(config_1.errorMessage.password);
                if (verCode.match(/^\s*$/))
                    return alert(config_1.errorMessage.verCode);
                var xhr = new XMLHttpRequest();
                var params = new URLSearchParams();
                params.set('username', username);
                params.set('password', password);
                params.set('verCode', verCode);
                xhr.open('GET', config_1.apiConfig.login + '?' + params.toString());
                xhr.send();
                xhr.addEventListener('readystatechange', function () {
                    if (xhr.status == 200 && xhr.readyState == xhr.DONE) {
                    }
                });
            },
            register: function () {
                var username = elementGroup_1.registerForm.username.value;
                var password = elementGroup_1.registerForm.password.value;
                var repeatPassword = elementGroup_1.registerForm.repeatPassword.value;
                var email = elementGroup_1.registerForm.email.value;
                var verCode = elementGroup_1.registerForm.verCode.value;
                if (!(0, util_1.checkUsername)(username))
                    return alert(config_1.errorMessage.username);
                if (password != repeatPassword)
                    return alert(config_1.errorMessage.repeatPassword);
                if (!(0, util_1.checkPassword)(password))
                    return alert(config_1.errorMessage.password);
                if (!(0, util_1.checkEmail)(email))
                    return alert(config_1.errorMessage.email);
                if (verCode.match(/^\s*$/))
                    return alert(config_1.errorMessage.verCode);
            }
        };
        elementGroup_1.loginForm.getVerCode.addEventListener('click', function () {
            return eventGroup_1.getVerCode(elementGroup_1.loginForm.username.value, elementGroup_1.loginForm.getVerCode, true);
        });
        elementGroup_1.loginForm.login.addEventListener('click', eventGroup_1.login);
        elementGroup_1.registerForm.getVerCode.addEventListener('click', function () {
            return eventGroup_1.getVerCode(elementGroup_1.registerForm.email.value, elementGroup_1.registerForm.getVerCode, false);
        });
        elementGroup_1.registerForm.register.addEventListener('click', eventGroup_1.register);
    }
};
exports.routeLogin = routeLogin;
