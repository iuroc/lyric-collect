package database

import (
	"database/sql"
	"os"

	"github.com/joho/godotenv"
)

// 初始化数据表
func InitTable(conn *sql.DB) {
	godotenv.Load(".env")
	// 数据库表前缀
	prefix := os.Getenv("mysql_table_prefix")
	// 创建收藏表 _collect
	if _, err := conn.Exec(`CREATE TABLE IF NOT EXISTS ` + prefix + `collect (
		id INT(11) PRIMARY KEY COMMENT '收藏记录 ID',
		music_name VARCHAR(255) COMMENT '歌曲名称',
		lyric TEXT COMMENT '歌词内容',
		update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
	)`); err != nil {
		panic(err)
	}

	// 创建用户表 _user
	if _, err := conn.Exec(`CREATE TABLE IF NOT EXISTS ` + prefix + `user (
		username VARCHAR(255) COMMENT '用户名',
		password_md5 VARCHAR(255) COMMENT '密码 MD5',
		email VARCHAR(255) COMMENT '邮箱地址',
		create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间'
	)`); err != nil {
		panic(err)
	}

	// 创建验证码表 _code
	if _, err := conn.Exec(`CREATE TABLE IF NOT EXISTS ` + prefix + `code (
		email VARCHAR(255) COMMENT '邮箱地址',
		code VARCHAR(255) COMMENT '验证码',
		create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
	)`); err != nil {
		panic(err)
	}

	// 创建令牌表 _token
	if _, err := conn.Exec(`CREATE TABLE IF NOT EXISTS ` + prefix + `token (
		username VARCHAR(255) COMMENT '用户名',
		token VARCHAR(255) COMMENT '令牌',
		create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
	)`); err != nil {
		panic(err)
	}

	// 创建评论表 _comment
	if _, err := conn.Exec(`CREATE TABLE IF NOT EXISTS ` + prefix + `comment (
		collect_id INT(11) COMMENT '收藏记录 ID',
		comment VARCHAR(255) COMMENT '评论内容',
		username VARCHAR(255) COMMENT '评论者用户名',
		create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
	)`); err != nil {
		panic(err)
	}
}
