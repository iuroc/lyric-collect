package route

import (
	"lyric-collect/database"
	"lyric-collect/util"
	"net/http"
)

// 校验 Token
func CheckToken(w http.ResponseWriter, r *http.Request) {
	conn := database.GetConn()
	defer conn.Close()
	if !util.CheckTokenFromRequest(conn, w, r) {
		return
	}
	w.Write(util.MakeSuc("校验成功", nil))
}
