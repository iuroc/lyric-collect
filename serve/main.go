package main

import (
	"fmt"
	"lyric-collect/database"
	"lyric-collect/route"
	"net/http"
)

func main() {
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
	fmt.Println("服务器已经启动 👉 http://127.0.0.1:8080")
	http.ListenAndServe(":8080", nil)
}
