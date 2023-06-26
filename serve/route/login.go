package route

import (
	"database/sql"
	"encoding/base64"
	"lyric-collect/database"
	"lyric-collect/util"
	"math/rand"
	"net/http"
	"os"
	"time"
)

func Login(w http.ResponseWriter, r *http.Request) {
	conn := database.GetConn()
	defer conn.Close()
	params := r.URL.Query()
	usernameOrEmail := params.Get("username")
	username, email := getUserInfo(conn, usernameOrEmail)
	password := params.Get("password")
	verCode := params.Get("verCode")
	// 校验验证码
	if !checkVerCode(conn, email, verCode) {
		w.Write(util.MakeErr("验证码错误"))
		return
	}
	// 校验用户是否存在
	if email == "" {
		w.Write(util.MakeErr("用户不存在"))
		return
	}
	// 校验账号密码
	if !checkPassword(conn, email, password) {
		w.Write(util.MakeErr("密码错误"))
		return
	}
	// 销毁验证码，并移除过期验证码
	removeVerCode(conn, email)

	token := insertToken(conn, username)
	expires := time.Now().Add(30 * 24 * time.Hour)
	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    token,
		Path:     "/",
		Expires:  expires,
		HttpOnly: true,
	})
	w.Write(util.MakeSuc("登录成功", nil))
}

// 校验验证码
func checkVerCode(conn *sql.DB, email string, vercode string) bool {
	var count int
	prefix := os.Getenv("mysql_table_prefix")
	err := conn.QueryRow("SELECT COUNT(*) FROM "+prefix+"code WHERE email = ? AND code = ? AND create_time >= (CURRENT_TIMESTAMP - INTERVAL 5 MINUTE)", email, vercode).Scan(&count)
	if err != nil {
		panic(err)
	}
	return count > 0
}

// 校验密码
func checkPassword(conn *sql.DB, email string, password string) bool {
	var count int
	prefix := os.Getenv("mysql_table_prefix")
	err := conn.QueryRow("SELECT COUNT(*) FROM "+prefix+"user WHERE email = ? AND password_md5 = ?",
		email, password,
	).Scan(&count)
	if err != nil {
		panic(err)
	}
	return count > 0
}

// 插入 Token 记录
func insertToken(conn *sql.DB, username string) string {
	if err := removeExpiresToken(conn); err != nil {
		panic(err)
	}
	token := makeToken(128)
	prefix := os.Getenv("mysql_table_prefix")
	_, err := conn.Exec("INSERT INTO "+prefix+"token (username, token) VALUES (?, ?)", username, token)
	if err != nil {
		panic(err)
	}
	return token
}

// 移除过期 Token 记录
func removeExpiresToken(conn *sql.DB) error {
	prefix := os.Getenv("mysql_table_prefix")
	_, err := conn.Exec("DELETE FROM " + prefix + "token WHERE create_time < (CURRENT_TIMESTAMP - INTERVAL 1 MONTH)")
	return err
}

// 生成 Token 字符串
func makeToken(tokenLength int) string {
	randomBytes := make([]byte, tokenLength)
	rand.Read(randomBytes)
	token := base64.URLEncoding.EncodeToString(randomBytes)
	return token
}
