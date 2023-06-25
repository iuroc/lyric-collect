package util

import (
	"encoding/json"
)

type ResOption struct {
	Code int
	Msg  string
	Data interface{}
}

func MakeRes(code int, msg string, data interface{}) string {
	jsonBytes, _ := json.Marshal(struct {
		Code int         `json:"code"`
		Msg  string      `json:"msg"`
		Data interface{} `json:"data"`
	}{
		Code: code,
		Msg:  msg,
		Data: data,
	})
	jsonStr := string(jsonBytes)
	return jsonStr
}

// 生成成功响应
func MakeSuc(msg string, data interface{}) []byte {
	str := MakeRes(200, msg, data)
	return []byte(str)
}

// 生成异常响应，0 状态码
func MakeErr(msg string) []byte {
	return MakeErrAndCode(msg, 0)
}

// 生成异常响应，自定义状态码
func MakeErrAndCode(msg string, code int) []byte {
	str := MakeRes(code, msg, nil)
	return []byte(str)
}

