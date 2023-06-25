package route

import (
	"lyric-collect/database"
	"lyric-collect/util"
	"net/http"
)

// 校验 Token
func CheckToken(w http.ResponseWriter, r *http.Request) {
	conn := database.GetConn()
	if result := util.CheckTokenFromRequest(conn, r); !result {
		res := util.MakeRes(http.StatusUnauthorized, http.StatusText(http.StatusUnauthorized), nil)
		w.Write([]byte(res))
		return
	}
	w.Write(util.MakeSuc("校验成功", nil))
}
