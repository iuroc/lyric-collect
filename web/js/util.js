"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPassword = exports.checkUsername = exports.checkEmail = void 0;
/** 校验邮箱 */
function checkEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
exports.checkEmail = checkEmail;
/** 校验用户名，4-20 位数字、字母、下划线组成 */
function checkUsername(username) {
    var usernameRegex = /^[a-zA-Z0-9_]{4,20}$/;
    return usernameRegex.test(username);
}
exports.checkUsername = checkUsername;
/** 校验密码，6-20 位数字、字母、下划线组合 */
function checkPassword(password) {
    var passwordRegex = /^[a-zA-Z0-9_]{6,20}$/;
    return passwordRegex.test(password);
}
exports.checkPassword = checkPassword;
