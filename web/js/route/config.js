"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiConfig = void 0;
/** API 配置 */
exports.apiConfig = {
    /** 搜索歌曲 */
    searchMusic: '/api/searchMusic',
    /** 获取歌词 */
    getLyric: '/api/getLyric',
    /** 校验登录 */
    checkToken: '/api/checkToken',
    /** 获取验证码 */
    getVerCode: '/api/getVerCode'
};
exports.default = {
    apiConfig: exports.apiConfig
};
