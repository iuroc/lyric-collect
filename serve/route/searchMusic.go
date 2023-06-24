package route

import (
	"encoding/json"
	"fmt"
	"lyric-collect/util"
	"net/http"
	"net/url"
	"strconv"
)

// 搜索歌曲
func SearchMusic(w http.ResponseWriter, r *http.Request) {
	params := r.URL.Query()
	page, _ := strconv.Atoi(params.Get("page"))
	pageSize, err := strconv.Atoi(params.Get("pageSize"))
	if err != nil {
		pageSize = 36
	}
	keyword := url.QueryEscape(params.Get("keyword"))
	if keyword == "" {
		w.Write(util.MakeErr("请输入搜索关键词 keyword"))
		return
	}
	url := fmt.Sprintf(
		"http://www.kuwo.cn/api/www/search/searchMusicBykeyWord?key=%s&pn=%d&rn=%d",
		keyword,
		page+1,
		pageSize,
	)
	header := make(map[string]string)
	header["csrf"] = "github@oyps"
	header["Cookie"] = "kw_token=github@oyps"
	header["Referer"] = "http://www.kuwo.cn"
	header["User-Agent"] = "github@oyps"
	body, err := util.Ajax(util.AjaxOption{
		Url:      url,
		Header:   header,
		MaxRetry: 3,
	})
	if err != nil {
		w.Write(util.MakeErr(err.Error()))
		return
	}
	var response searchResponse
	json.Unmarshal([]byte(body), &response)
	musicList := []musicInfo{}
	for _, item := range response.Data.List {
		musicList = append(musicList, musicInfo{
			Name:   item.Name,
			Id:     item.Id,
			Artist: item.Artist,
			Cover:    item.Pic,
			Album:  item.Album,
		})
	}
	w.Write(util.MakeSuc("获取成功", musicList))
}

type searchResponse struct {
	Data struct {
		List []struct {
			Name   string `json:"name"`
			Id     int    `json:"rid"`
			Artist string `json:"artist"`
			Pic    string `json:"pic"`
			Album  string `json:"album"`
		} `json:"list"`
	} `json:"data"`
}

type musicInfo struct {
	Name   string `json:"name"`
	Id     int    `json:"id"`
	Artist string `json:"artist"`
	Cover    string `json:"cover"`
	Album  string `json:"album"`
}
