package util

import (
	"database/sql"
	"net/http"
	"os"
)

// 校验 Token
func CheckToken(conn *sql.DB, token string) bool {
	prefix := os.Getenv("mysql_table_prefix")
	var count int
	err := conn.QueryRow("SELECT COUNT(*) FROM "+prefix+"token WHERE token = ?", token).Scan(&count)
	if err != nil {
		panic(err)
	}
	if count == 0 {
		return false
	}
	return true
}

// 校验来自请求的 Token，自动返回错误响应
func CheckTokenFromRequest(conn *sql.DB, w http.ResponseWriter, r *http.Request) bool {
	token := GetCookieValue(r.Cookies(), "token")
	if !CheckToken(conn, token) {
		res := MakeRes(
			http.StatusUnauthorized,
			http.StatusText(http.StatusUnauthorized),
			nil,
		)
		w.Write([]byte(res))
		return false
	}
	return true
}
