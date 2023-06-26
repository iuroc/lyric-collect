// 数据库模块
package database

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/go-sql-driver/mysql"
)

// 获取数据库连接
func GetConn() *sql.DB {
	host := os.Getenv("mysql_host")
	port := os.Getenv("mysql_port")
	username := os.Getenv("mysql_username")
	password := os.Getenv("mysql_password")
	database := os.Getenv("mysql_database")
	conn, err := sql.Open("mysql", fmt.Sprintf("%s:%s@tcp(%s:%s)/%s", username, password, host, port, database))
	if err != nil {
		panic(err)
	}
	if err := conn.Ping(); err != nil {
		panic(err)
	}
	return conn
}
