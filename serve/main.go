package main

import (
	"fmt"
	"net/http"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.Write([]byte("Hello World"))
	})
	fmt.Println("http://127.0.0.1:8080")
	http.ListenAndServe(":8080", nil)
}
