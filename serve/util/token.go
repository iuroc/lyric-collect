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

// 校验来自请求的 Token
func CheckTokenFromRequest(conn *sql.DB, r *http.Request) bool {
	token := GetCookieValue(r.Cookies(), "token")
	return CheckToken(conn, token)
}
