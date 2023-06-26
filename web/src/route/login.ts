import { RouteEvent } from 'apee-router'
import { apiConfig, errorMessage } from '../config'
import { AjaxRes } from '../types'
import { checkEmail, checkPassword, checkUsername, checkUsernameOrEmail } from '../util'

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
    if (route.status == 0) {
        route.status = 1
        const elementGroup = {
            /** 登录页表单元素 */
            loginForm: {
                /** 登录页用户名或邮箱 */
                username: subLogin.querySelector('.input-username') as HTMLInputElement,
                /** 登录页密码 */
                password: subLogin.querySelector('.input-password') as HTMLInputElement,
                /** 登录页验证码输入框 */
                verCode: subLogin.querySelector('.input-vercode') as HTMLInputElement,
                /** 点击登录 */
                login: subLogin.querySelector('.click-login') as HTMLButtonElement,
                /** 登录页点击发送验证码 */
                getVerCode: subLogin.querySelector('.get-vercode') as HTMLButtonElement
            },
            /** 注册页表单元素 */
            registerForm: {
                /** 注册页用户名 */
                username: subRegister.querySelector('.input-username') as HTMLInputElement,
                /** 注册页密码 */
                password: subRegister.querySelector('.input-password') as HTMLInputElement,
                /** 注册页密码重复 */
                repeatPassword: subRegister.querySelector('.input-repeat-password') as HTMLInputElement,
                /** 注册页邮箱 */
                email: subRegister.querySelector('.input-email') as HTMLInputElement,
                /** 注册页验证码输入框 */
                verCode: subRegister.querySelector('.input-vercode') as HTMLInputElement,
                /** 点击注册 */
                register: subRegister.querySelector('.click-register') as HTMLButtonElement,
                /** 注册页点击发送验证码 */
                getVerCode: subRegister.querySelector('.get-vercode') as HTMLButtonElement
            }
        }
        const eventGroup = {
            /**
             * 发送验证码
             * @param toInput 发件人地址（用户名或邮箱）
             * @param button 点击发送验证码的按钮
             * @param login 是否处于登录页
             */
            getVerCode(to: string, button: HTMLButtonElement, login: boolean) {
                if (!login && !checkEmail(to))
                    return alert(errorMessage.email)
                if (login && !checkUsernameOrEmail(to))
                    return alert(errorMessage.usernameOrEmail)
                button.setAttribute('disabled', 'disabled')
                let timer: NodeJS.Timeout
                const changeStatus = (second: number) => {
                    if (second == 0) return endStatus()
                    button.innerHTML = `${second} 秒`
                    timer = setTimeout(() => {
                        changeStatus(second - 1)
                    }, 1000)
                }
                const endStatus = () => {
                    button.innerHTML = '获取验证码'
                    button.removeAttribute('disabled')
                    clearTimeout(timer)
                }
                changeStatus(10)
                const xhr = new XMLHttpRequest()
                const params = new URLSearchParams()
                params.set('to', to)
                params.set('login', String(login))
                xhr.open('GET', apiConfig.getVerCode + '?' + params.toString())
                xhr.send()
                xhr.addEventListener('readystatechange', () => {
                    if (xhr.status == 200 && xhr.readyState == xhr.DONE) {
                        const res = JSON.parse(xhr.responseText) as AjaxRes
                        if (res.code != 200) {
                            endStatus()
                            alert(res.msg)
                        }
                    }
                })
            },
            login() {
                let username = elementGroup.loginForm.username.value
                let password = elementGroup.loginForm.password.value
                let verCode = elementGroup.loginForm.verCode.value
                if (!checkUsernameOrEmail(username)) return alert(errorMessage.usernameOrEmail)
                if (!checkPassword(password)) return alert(errorMessage.password)
                if (verCode.match(/^\s*$/)) return alert(errorMessage.verCode)
                const xhr = new XMLHttpRequest()
                const params = new URLSearchParams()
                params.set('username', username)
                params.set('password', password)
                params.set('verCode', verCode)
                xhr.open('GET', apiConfig.login + '?' + params.toString())
                xhr.send()
                xhr.addEventListener('readystatechange', () => {
                    if (xhr.status == 200 && xhr.readyState == xhr.DONE) {
                        
                    }
                })
            },
            register() {
                let username = elementGroup.registerForm.username.value
                let password = elementGroup.registerForm.password.value
                let repeatPassword = elementGroup.registerForm.repeatPassword.value
                let email = elementGroup.registerForm.email.value
                let verCode = elementGroup.registerForm.verCode.value
                if (!checkUsername(username)) return alert(errorMessage.username)
                if (password != repeatPassword) return alert(errorMessage.repeatPassword)
                if (!checkPassword(password)) return alert(errorMessage.password)
                if (!checkEmail(email)) return alert(errorMessage.email)
                if (verCode.match(/^\s*$/)) return alert(errorMessage.verCode)
            }
        }
        elementGroup.loginForm.getVerCode.addEventListener('click', () =>
            eventGroup.getVerCode(
                elementGroup.loginForm.username.value,
                elementGroup.loginForm.getVerCode,
                true
            )
        )
        elementGroup.loginForm.login.addEventListener('click', eventGroup.login)
        elementGroup.registerForm.getVerCode.addEventListener('click', () =>
            eventGroup.getVerCode(
                elementGroup.registerForm.email.value,
                elementGroup.registerForm.getVerCode,
                false
            )
        )
        elementGroup.registerForm.register.addEventListener('click', eventGroup.register)
    }
}