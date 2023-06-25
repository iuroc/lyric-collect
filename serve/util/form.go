package util

import (
	"regexp"
)

// 校验邮箱
func CheckEmail(email string) bool {
	emailRegex := regexp.MustCompile(`^[^\s@]+@[^\s@]+\.[^\s@]+$`)
	return emailRegex.MatchString(email)
}

// 校验用户名，4-20 位数字、字母、下划线组成
func CheckUsername(username string) bool {
	usernameRegex := regexp.MustCompile(`^[a-zA-Z0-9_]{4,20}$`)
	return usernameRegex.MatchString(username)
}

// 校验密码，6-20 位数字、字母、下划线组合
func CheckPassword(password string) bool {
	passwordRegex := regexp.MustCompile(`^[a-zA-Z0-9_]{6,20}$`)
	return passwordRegex.MatchString(password)
}
