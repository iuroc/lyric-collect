"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeGet = void 0;
var config_1 = require("../config");
var bootstrap_1 = require("bootstrap");
/** 在线搜索歌词 */
var routeGet = function (route) {
    if (route.status == 0) {
        route.status = 1;
        var keywordInput_1 = route.dom.querySelector('.keyword');
        var searchBtn = route.dom.querySelector('.search');
        var musicListEle_1 = route.dom.querySelector('.music-list');
        var loadMore_1 = route.dom.querySelector('.load-more');
        /** 歌词查看模态框 DOM */
        var modelLyricViewEle = document.querySelector('.modal-lyric-view');
        var musicNameEle_1 = modelLyricViewEle.querySelector('.music-name');
        var lyricEle_1 = modelLyricViewEle.querySelector('.lyric');
        var loading_1 = modelLyricViewEle.querySelector('.loading');
        /** 歌词查看模态框 */
        var modelLyricView_1 = new bootstrap_1.Modal(modelLyricViewEle, {
            keyboard: false
        });
        /** 当前页的页码 */
        var nowPage_1;
        /** 用于歌曲搜索 */
        var searchXhr_1 = new XMLHttpRequest();
        /** 用于歌词获取 */
        var lyricViewXhr_1 = new XMLHttpRequest();
        searchXhr_1.addEventListener('readystatechange', function () {
            if (searchXhr_1.status == 200 && searchXhr_1.readyState == searchXhr_1.DONE) {
                var res = JSON.parse(searchXhr_1.responseText);
                if (res.code == 200) {
                    var musicList = res.data;
                    musicList.forEach(function (music) {
                        var col = document.createElement('div');
                        var card = document.createElement('div');
                        var img = document.createElement('img');
                        var right = document.createElement('div');
                        var name = document.createElement('div');
                        var artist = document.createElement('div');
                        var album = document.createElement('album');
                        right.append(name, artist, album);
                        card.append(img, right);
                        col.append(card);
                        musicListEle_1.append(col);
                        col.classList.add('col-md-6', 'col-xl-4', 'mb-4');
                        card.classList.add('card', 'card-body', 'flex-row', 'shadow-sm', 'cursor-pointer', 'h-100');
                        card.setAttribute('data-music-id', music.id.toString());
                        img.classList.add('rounded', 'me-3');
                        img.style.width = '120px';
                        img.style.height = '120px';
                        img.src = music.cover;
                        name.classList.add('fs-5', 'fw-bold', 'mb-2', 'limit-2-line');
                        name.innerHTML = music.name;
                        artist.classList.add('limit-2-line', 'mb-1', 'text-success');
                        artist.innerHTML = music.artist;
                        album.innerHTML = music.album;
                        card.addEventListener('click', function () { return cardClick_1(music); });
                    });
                    loadMore_1.removeAttribute('disabled');
                    loadMore_1.innerHTML = '加载更多';
                    loadMore_1.style.display = 'inline-block';
                    return;
                }
                alert(res.msg);
            }
        });
        var cardClick_1 = function (music) {
            modelLyricView_1.show();
            lyricEle_1.innerHTML = '';
            musicNameEle_1.innerHTML = '';
            loading_1.style.display = 'block';
            lyricViewXhr_1.abort();
            lyricViewXhr_1.open('GET', config_1.apiConfig.getLyric + '?id=' + music.id);
            lyricViewXhr_1.send();
        };
        /** 歌词获取完成 */
        lyricViewXhr_1.addEventListener('readystatechange', function () {
            if (lyricViewXhr_1.status == 200 && lyricViewXhr_1.readyState == lyricViewXhr_1.DONE) {
                loading_1.style.display = 'none';
                var res = JSON.parse(lyricViewXhr_1.responseText);
                if (res.code == 200) {
                    var musicInfo = res.data.musicInfo;
                    musicNameEle_1.innerHTML = musicInfo.name;
                    var lyricList = res.data.lyricList;
                    var lyricText_1 = '';
                    lyricList.forEach(function (lyric) {
                        lyricText_1 += lyric.text + '\n';
                    });
                    lyricEle_1.innerText = lyricText_1;
                    return;
                }
                alert(res.msg);
            }
        });
        /**
         * 搜索歌曲
         * @param keyword 搜索关键词
         * @param page 页码
         * @param pageSize 每页加载数量
         */
        var searchMusic_1 = function (keyword, page) {
            if (page === void 0) { page = 0; }
            nowPage_1 = page;
            if (page == 0) {
                musicListEle_1.innerHTML = '';
                loadMore_1.style.display = 'none';
            }
            else {
                loadMore_1.setAttribute('disabled', 'disabled');
                loadMore_1.innerHTML = '正在加载';
            }
            searchXhr_1.abort();
            var params = new URLSearchParams();
            params.set('keyword', keyword);
            params.set('page', page.toString());
            params.set('pageSize', '36');
            searchXhr_1.open('GET', "".concat(config_1.apiConfig.searchMusic, "?").concat(params.toString()));
            searchXhr_1.send();
        };
        searchBtn.addEventListener('click', function () { return searchMusic_1(keywordInput_1.value); });
        keywordInput_1.addEventListener('keyup', function (event) {
            if (event.key == 'Enter')
                searchMusic_1(keywordInput_1.value);
        });
        loadMore_1.addEventListener('click', function () {
            searchMusic_1(keywordInput_1.value, nowPage_1 + 1);
        });
    }
};
exports.routeGet = routeGet;
