// 工具模块
package util

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
)

// Ajax 配置选项
type AjaxOption struct {
	// 请求地址
	Url string
	// 请求方式
	Method string
	// 请求负载
	Body string
	// 请求标头
	Header map[string]string
	// 已经重试的次数
	hasRetry int
	// 最大允许重试的次数
	MaxRetry int
}

var client = http.Client{}

// 简便的 HTTP 客户端
func Ajax(option AjaxOption) (string, error) {
	initOption(&option)
	request, err := http.NewRequest(option.Method, option.Url, strings.NewReader(option.Body))
	if err != nil {
		return "", err
	}
	for key, value := range option.Header {
		request.Header.Set(key, value)
	}
	response, err := client.Do(request)
	if err != nil || response.StatusCode != 200 {
		return retry(Ajax, option, err)
	}
	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return "", err
	}
	return string(body), nil
}

// 重试
func retry(ajax func(AjaxOption) (string, error), option AjaxOption, err error) (string, error) {
	if option.hasRetry <= option.MaxRetry {
		option.hasRetry += 1
		log.Println(fmt.Sprintf("正在重试第%d次", option.hasRetry))
		return ajax(option)
	} else {
		return "", err
	}
}

// 初始化配置选项
func initOption(option *AjaxOption) {
	if option.Method == "" {
		option.Method = "GET"
	}
	if option.MaxRetry == 0 {
		option.MaxRetry = 5
	}
}
