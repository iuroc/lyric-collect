package main

import (
	"fmt"
	"github.com/joho/godotenv"
	"lyric-collect/database"
	"lyric-collect/route"
	"net/http"
)

func main() {
	godotenv.Load(".env")
	conn := database.GetConn()
	defer conn.Close()
	database.InitTable(conn)
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "../web/index.html")
	})
	http.Handle("/static/",
		http.StripPrefix("/static/",
			http.FileServer(http.Dir("../web")),
		),
	)
	http.HandleFunc("/api/searchMusic", route.SearchMusic)
	http.HandleFunc("/api/getLyric", route.GetLyric)
	http.HandleFunc("/api/addCollect", route.AddCollect)
	http.HandleFunc("/api/getList", route.GetList)
	http.HandleFunc("/api/checkToken", route.CheckToken)
	http.HandleFunc("/api/getVerCode", route.GetVerCode)
	fmt.Println("服务器已经启动 👉 http://127.0.0.1:8080")
	http.ListenAndServe(":8080", nil)
}
