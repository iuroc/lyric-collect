/** API 配置 */
export const apiConfig = {
    /** 搜索歌曲 */
    searchMusic: '/api/searchMusic',
    /** 获取歌词 */
    getLyric: '/api/getLyric',
    /** 校验登录 */
    checkToken: '/api/checkToken',
    /** 获取验证码 */
    getVerCode: '/api/getVerCode',
    /** 登录接口 */
    login: '/api/login',
    /** 注册接口 */
    register: '/api/register'
}

/** 错误提示 */
export const errorMessage = {
    /** 用户名或邮箱格式错误 */
    usernameOrEmail: '用户名或邮箱格式错误',
    /** 用户名格式错误 */
    username: '用户名格式为 4-20 位数字、字母和下划线组合',
    /** 密码格式错误 */
    password: '密码格式为 6-20 为数字、字母和下划线组合',
    /** 邮箱格式错误 */
    email: '邮箱格式错误',
    /** 验证码不能为空 */
    verCode: '验证码不能为空',
    /** 两次输入的密码不一致 */
    repeatPassword: '两次输入的密码不一致'
}

export default {
    apiConfig, errorMessage
}