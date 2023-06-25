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
        if (res.code == 200) {
            localStorage.setItem('hasLogin', 'true')
            if (location.hash.split('/')[1] == 'login')
                location.hash = ''
        }
        // 校验失败
        else {
            location.hash = '#/login'
            localStorage.removeItem('hasLogin')
        }
        // 后期页面切换
        window.addEventListener('hashchange', () => {
            if (
                localStorage.getItem('hasLogin') != 'true'
                && location.hash.split('/')[1] != 'login'
            ) location.hash = '#/login'
        })
    }
}