/** 校验邮箱 */
export function checkEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

/** 校验用户名，4-20 位数字、字母、下划线组成 */
export function checkUsername(username: string) {
    const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/
    return usernameRegex.test(username)
}

/** 校验密码，6-20 位数字、字母、下划线组合 */
export function checkPassword(password: string) {
    const passwordRegex = /^[a-zA-Z0-9_]{6,20}$/
    return passwordRegex.test(password)
}

/** 校验用户名或邮箱 */
export function checkUsernameOrEmail(usernameOrEmail: string) {
    return checkUsername(usernameOrEmail) || checkEmail(usernameOrEmail)
}
