package route

import (
	"encoding/json"
	"lyric-collect/util"
	"net/http"
)

// 获取歌词
func GetLyric(w http.ResponseWriter, r *http.Request) {
	params := r.URL.Query()
	id := params.Get("id")
	if id == "" {
		w.Write(util.MakeErr("请输入歌曲 id"))
		return
	}
	url := "https://m.kuwo.cn/newh5/singles/songinfoandlrc?musicId=" + id
	body, err := util.Ajax(util.AjaxOption{
		Url:      url,
		MaxRetry: 3,
	})
	if err != nil {
		w.Write(util.MakeErr(err.Error()))
		return
	}

	var jsonData jsonType
	json.Unmarshal([]byte(body), &jsonData)

	lyricList := []lyricItem{}
	for _, item := range jsonData.Data.LyricList {
		lyricList = append(lyricList, lyricItem{
			Text: item.Text,
			Time: item.Time,
		})
	}
	newResponse := newResponse{
		LyricList: lyricList,
		MusicInfo: songInfo{
			Name:   jsonData.Data.SongInfo.Name,
			Id:     jsonData.Data.SongInfo.Id,
			Artist: jsonData.Data.SongInfo.Artist,
			Cover:  jsonData.Data.SongInfo.Pic,
			Album:  jsonData.Data.SongInfo.Album,
		},
	}
	w.Write(util.MakeSuc("获取成功", newResponse))
}

type jsonType struct {
	Data struct {
		LyricList []struct {
			Text string `json:"lineLyric"`
			Time string `json:"time"`
		} `json:"lrclist"`
		SongInfo struct {
			Name   string `json:"songName"`
			Id     string `json:"id"`
			Artist string `json:"artist"`
			Pic    string `json:"pic"`
			Album  string `json:"album"`
		} `json:"songinfo"`
	} `json:"data"`
}

type newResponse struct {
	LyricList []lyricItem `json:"lyricList"`
	MusicInfo songInfo    `json:"musicInfo"`
}

type lyricItem struct {
	Text string `json:"text"`
	Time string `json:"time"`
}

type songInfo struct {
	Name   string `json:"name"`
	Id     string `json:"id"`
	Artist string `json:"artist"`
	Cover  string `json:"cover"`
	Album  string `json:"album"`
}
