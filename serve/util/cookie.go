package util

import (
	"net/http"
)

// 获取 Cookie 参数值
func GetCookieValue(cookies []*http.Cookie, key string) string {
	value := ""
	for _, cookie := range cookies {
		if cookie.Name == key {
			value = cookie.Value
		}
	}
	return value
}
