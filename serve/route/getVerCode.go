package route

import (
	"database/sql"
	"fmt"
	"lyric-collect/database"
	"lyric-collect/util"
	"math/rand"
	"net/http"
	"net/smtp"
	"os"
	"time"
)

func GetVerCode(w http.ResponseWriter, r *http.Request) {
	conn := database.GetConn()
	defer conn.Close()
	params := r.URL.Query()
	to := params.Get("to")
	login := params.Get("login")
	email := to
	if login == "true" {
		if !util.CheckEmail(to) && !util.CheckUsername(to) {
			w.Write(util.MakeErr("请输入正确的用户名或邮箱"))
			return
		}
		_, email := getUserInfo(conn, email)
		if email == "" {
			w.Write(util.MakeErr("当前用户没有注册"))
			return
		}
	} else {
		if !util.CheckEmail(to) {
			w.Write(util.MakeErr("请输入正确的邮箱"))
			return
		}
	}
	// 判断是否频繁发送
	if !checkSendAllow(conn, email) {
		w.Write(util.MakeErr("请勿频繁请求发送验证码"))
		return
	}
	// 生成验证码
	verCode := makeVerCode()
	// 发送验证码
	if err := sendVerCode(email, verCode); err != nil {
		w.Write(util.MakeErr("邮件发送失败：" + err.Error()))
		return
	}
	// 创建验证码数据库记录
	insertVerCode(conn, email, verCode)
	w.Write(util.MakeSuc("验证码已经成功发送到您的邮箱，请注意查收", nil))
}

// 校验邮件是否允许发送
func checkSendAllow(conn *sql.DB, email string) bool {
	var count int
	// 检查当前邮箱是否在一分钟内发送过验证码
	conn.QueryRow("SELECT COUNT(*) FROM "+os.Getenv("mysql_table_prefix")+"code WHERE email = ? AND create_time >= (CURRENT_TIMESTAMP - INTERVAL 1 MINUTE)", email).Scan(&count)
	return count == 0
}

// 通过【用户名或邮箱】获取【用户名和邮箱】
func getUserInfo(conn *sql.DB, usernameOrEmail string) (string, string) {
	var email string
	var username string
	err := conn.QueryRow("SELECT username, email FROM "+os.Getenv("mysql_table_prefix")+"user WHERE username = ? OR email = ?",
		usernameOrEmail, usernameOrEmail,
	).Scan(&username, &email)
	if err != nil {
		return "", ""
	}
	return username, email
}

// 发送验证码，并创建数据库记录
func sendVerCode(to string, verCode string) error {
	host := os.Getenv("smtp_host")
	port := os.Getenv("smtp_port")
	username := os.Getenv("smtp_username")
	password := os.Getenv("smtp_password")
	nick := os.Getenv("smtp_nick")
	auth := smtp.PlainAuth("", username, password, host)
	header := make(map[string]string)
	header["From"] = fmt.Sprintf("%s<%s>", nick, username)
	header["To"] = to
	header["Subject"] = fmt.Sprintf("来自 %s 的验证码", os.Getenv("app_name"))
	header["Content-Type"] = "text/html; charset=utf-8"
	body := `
	<div class="card" style="margin: 30px auto; max-width: 400px; border: 1px solid rgba(230, 230, 230); border-radius: 10px; padding: 10px; text-align: center;">
		<div class="title" style="padding: 20px 0; user-select: none; letter-spacing: 1px; font-size: 20px; font-weight: bold; border-bottom: 1px solid rgba(230, 230, 230);">` + os.Getenv("app_name") + ` 的验证码</div>
		<div class="body" style="padding: 20px 0; font-size: 60px; font-weight: bold; color: #6495ed; border-bottom: 1px solid rgba(230, 230, 230); letter-spacing: 3px;">` + verCode + `</div>
		<div class="footer" style="padding: 20px 0; user-select: none; letter-spacing: 1px;">验证码有效期 5 分钟</div>
	</div>`
	message := ""
	for key, value := range header {
		message += key + ": " + value + "\r\n"
	}
	message += "\r\n" + body
	err := smtp.SendMail(host+":"+port, auth, username, []string{to}, []byte(message))
	return err
}

// 生成验证码
func makeVerCode() string {
	rand.Seed(time.Now().UnixNano())
	return fmt.Sprint(rand.Intn(9000) + 1000)
}

// 插入验证码记录，并删除该邮箱之前的验证码，以及删除其他过期验证码
func insertVerCode(conn *sql.DB, email string, verCode string) {
	// 移除某条验证码记录，并移除过期验证码
	removeVerCode(conn, email)
	stmp, _ := conn.Prepare("INSERT INTO " + os.Getenv("mysql_table_prefix") + "code (email, code) VALUES (?, ?)")
	_, err := stmp.Exec(email, verCode)
	if err != nil {
		panic(err)
	}
}

// 移除某条验证码记录，并移除过期验证码
func removeVerCode(conn *sql.DB, email string) {
	_, err := conn.Exec("DELETE FROM "+os.Getenv("mysql_table_prefix")+"code WHERE email = ? OR create_time < (CURRENT_TIMESTAMP - INTERVAL 5 MINUTE)", email)
	if err != nil {
		panic(err)
	}
}
