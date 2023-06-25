import { RouteEvent } from 'apee-router'
import { apiConfig } from '../config'
import { AjaxRes } from '../types'

/** 校验 Token */
export function checkToken(event?: HashChangeEvent) {
    // 初始化页面
    if (typeof event == 'undefined') {
        const xhr = new XMLHttpRequest()
        xhr.open('GET', apiConfig.checkToken, false)
        xhr.send()
        const res = JSON.parse(xhr.responseText) as AjaxRes
        // 校验成功
        res.code == 200 ? checkSuccess() : checkError()
        // 后期页面切换
        window.addEventListener('hashchange', () => {
            if (
                localStorage.getItem('hasLogin') != 'true'
                && location.hash.split('/')[1] != 'login'
            ) location.hash = '#/login'
        })
    }
}

/** 校验成功事件 */
export function checkSuccess() {
    localStorage.setItem('hasLogin', 'true')
    if (location.hash.split('/')[1] == 'login')
        location.hash = ''
}

/** 校验失败事件 */
export function checkError() {
    location.hash = '#/login'
    localStorage.removeItem('hasLogin')
}

/** 登录路由 */
export const routeLogin: RouteEvent = (route) => {
    const subLogin = route.dom.querySelector('.sub-login') as HTMLDivElement
    const subRegister = route.dom.querySelector('.sub-register') as HTMLDivElement
    if (route.args[0] == 'register') {
        subLogin.style.display = 'none'
        subRegister.style.display = 'block'
    } else {
        subLogin.style.display = 'block'
        subRegister.style.display = 'none'
    }
}