# Lyric Collect

> 歌词收藏工具

## 命令说明

- 安装依赖：`npm install`
- 前端自动编译：`npm run dev`
- 打包运行：`npm run build`

## 项目信息

- 作者：鹏优创
- 创建日期：2023 年 6 月 20 日
- 公众号：代码十级

## 接口来源

> 本项目仅供学习交流使用，如无意侵犯了您的合法权益，请联系我们。

- 歌曲搜索：`http://www.kuwo.cn/api/www/search/searchMusicBykeyWord?key=黄昏&pn=2&rn=20`
- 歌词获取：`https://m.kuwo.cn/newh5/singles/songinfoandlrc?musicId=118987`

## 功能规划

- 添加、编辑收藏
- 歌词在线搜索
- 收藏列表和搜索
- 歌词评论

## 数据库设计

### 收藏表 `_collect`

| 字段名      | 类型         | 描述        |
| ----------- | ------------ | ----------- |
| id          | int(11)      | 收藏记录 ID |
| music_name  | varchar(255) | 歌曲名称    |
| lyric       | text         | 歌词内容    |
| update_time | timestamp    | 创建时间    |


### 用户表 `_user`

| 字段名       | 类型         | 描述     |
| ------------ | ------------ | -------- |
| username     | varchar(255) | 用户名   |
| password_md5 | varchar(255) | 密码 MD5 |
| email        | varchar(255) | 邮箱地址 |
| create_time  | timestamp    | 注册时间 |

### 验证码表 `_code`

| 字段名      | 类型         | 描述     |
| ----------- | ------------ | -------- |
| email       | varchar(255) | 邮箱地址 |
| code        | varchar(255) | 验证码   |
| create_time | timestamp    | 创建时间 |

### 令牌表 `_token`

| 字段名      | 类型         | 描述     |
| ----------- | ------------ | -------- |
| username    | varchar(255) | 用户名   |
| token       | varchar(255) | 令牌     |
| create_time | timestamp    | 创建时间 |

### 评论表 `_comment`

| 字段名      | 类型         | 描述         |
| ----------- | ------------ | ------------ |
| collect_id  | int(11)      | 收藏记录 ID  |
| comment     | varchar(255) | 评论内容     |
| username    | varchar(255) | 评论者用户名 |
| create_time | timestamp    | 创建时间     |

## 前端登录校验

- 设置 Cookie-Token
- 每次初始访问页面，调用 checkToken 接口
- 每个接口都校验 Token
- 只要发生 Token 校验失败，立即跳转到 login 页面