import { RouteEvent } from 'apee-router'
import { apiConfig } from '../config'
import { AjaxRes } from '../types'
import { Modal } from 'bootstrap'
/** 在线搜索歌词 */
export const routeGet: RouteEvent = (route) => {
    if (route.status == 0) {
        route.status = 1
        const keywordInput = route.dom.querySelector('.keyword') as HTMLInputElement
        const searchBtn = route.dom.querySelector('.search') as HTMLButtonElement
        const musicListEle = route.dom.querySelector('.music-list') as HTMLDivElement
        const loadMore = route.dom.querySelector('.load-more') as HTMLButtonElement
        /** 歌词查看模态框 DOM */
        const modelLyricViewEle = document.querySelector('.modal-lyric-view') as HTMLDivElement
        const musicNameEle = modelLyricViewEle.querySelector('.music-name') as HTMLDivElement
        const lyricEle = modelLyricViewEle.querySelector('.lyric') as HTMLDivElement
        const loading = modelLyricViewEle.querySelector('.loading') as HTMLDivElement
        /** 歌词查看模态框 */
        const modelLyricView = new Modal(modelLyricViewEle, {
            keyboard: false
        })
        /** 当前页的页码 */
        let nowPage: number
        /** 当前正在查看歌词的歌曲 ID */
        let nowMusicId: number
        /** 用于歌曲搜索 */
        const searchXhr = new XMLHttpRequest()
        /** 用于歌词获取 */
        const lyricViewXhr = new XMLHttpRequest()
        lyricViewXhr.timeout = 2000
        searchXhr.addEventListener('readystatechange', () => {
            if (searchXhr.status == 200 && searchXhr.readyState == searchXhr.DONE) {
                const res = JSON.parse(searchXhr.responseText) as AjaxRes
                if (res.code == 200) {
                    const musicList = res.data as MusicList
                    musicList.forEach(music => {
                        const col = document.createElement('div')
                        const card = document.createElement('div')
                        const img = document.createElement('img')
                        const right = document.createElement('div')
                        const name = document.createElement('div')
                        const artist = document.createElement('div')
                        const album = document.createElement('album')
                        right.append(name, artist, album)
                        card.append(img, right)
                        col.append(card)
                        musicListEle.append(col)
                        col.classList.add('col-md-6', 'col-xl-4', 'mb-4')
                        card.classList.add('card', 'card-body', 'flex-row', 'shadow-sm', 'cursor-pointer', 'h-100')
                        card.setAttribute('data-music-id', music.id.toString())
                        img.classList.add('rounded', 'me-3')
                        img.style.width = '120px'
                        img.style.height = '120px'
                        img.src = music.cover
                        name.classList.add('fs-5', 'fw-bold', 'mb-2', 'limit-2-line')
                        name.innerHTML = music.name
                        artist.classList.add('limit-2-line', 'mb-1', 'text-success')
                        artist.innerHTML = music.artist
                        album.innerHTML = music.album
                        card.addEventListener('click', () => cardClick(music))
                    })
                    loadMore.removeAttribute('disabled')
                    loadMore.innerHTML = '加载更多'
                    loadMore.style.display = 'inline-block'
                    return
                }
                alert(res.msg)
            }
        })
        const cardClick = (music?: MusicInfo) => {
            if (typeof music != 'undefined') nowMusicId = music.id
            modelLyricView.show()
            lyricEle.innerHTML = ''
            musicNameEle.innerHTML = ''
            loading.style.display = 'block'
            lyricViewXhr.abort()
            lyricViewXhr.open('GET', apiConfig.getLyric + '?id=' + nowMusicId)
            lyricViewXhr.send()
        }
        /** 歌词获取完成 */
        lyricViewXhr.addEventListener('readystatechange', () => {
            if (lyricViewXhr.status == 200 && lyricViewXhr.readyState == lyricViewXhr.DONE) {
                loading.style.display = 'none'
                const res = JSON.parse(lyricViewXhr.responseText) as AjaxRes
                if (res.code == 200) {
                    const musicInfo = res.data.musicInfo as MusicInfo
                    musicNameEle.innerHTML = musicInfo.name
                    const lyricList = res.data.lyricList as LyricItem[]
                    let lyricText = ''
                    lyricList.forEach(lyric => {
                        lyricText += lyric.text + '\n'
                    })
                    lyricEle.innerText = lyricText
                    return
                }
                alert(res.msg)
            }
        })
        lyricViewXhr.onerror = lyricViewXhr.ontimeout = () => cardClick()
        /**
         * 搜索歌曲
         * @param keyword 搜索关键词
         * @param page 页码
         * @param pageSize 每页加载数量
         */
        const searchMusic = (keyword: string, page: number = 0) => {
            nowPage = page
            if (page == 0) {
                musicListEle.innerHTML = ''
                loadMore.style.display = 'none'
            } else {
                loadMore.setAttribute('disabled', 'disabled')
                loadMore.innerHTML = '正在加载'
            }
            searchXhr.abort()
            const params = new URLSearchParams()
            params.set('keyword', keyword)
            params.set('page', page.toString())
            params.set('pageSize', '36')
            searchXhr.open('GET', `${apiConfig.searchMusic}?${params.toString()}`)
            searchXhr.send()
        }
        searchBtn.addEventListener('click', () => searchMusic(keywordInput.value))
        keywordInput.addEventListener('keyup', (event) => {
            if (event.key == 'Enter') searchMusic(keywordInput.value)
        })
        loadMore.addEventListener('click', () => {
            searchMusic(keywordInput.value, nowPage + 1)
        })
    }
}

/** 歌曲列表 */
type MusicList = MusicInfo[]

/** 歌曲信息 */
type MusicInfo = {
    /** 歌手名称 */
    artist: string
    /** 歌曲名称 */
    name: string
    /** 封面 URL */
    cover: string
    /** 歌曲 ID */
    id: number
    /** 专辑名称 */
    album: string
}

/** 歌词列表项 */
type LyricItem = {
    text: string
    time: string
}