// pages/home/detail.js
const App = getApp();
let that;
const Require = require('../../utils/Require');
const Auth = require('../../utils/Auth');
let MusicCtr = require('../../utils/musicControll');
let Util = require("../../utils/util");

Page({

    data: {
        musicData: {}, //播放条数据
        bookList: {},
        playAblumn: [],
        playing: false,
        playIndex: 0,
        curPlay: {}, //当前播放
        songState: {},
        bookCat: {}, //书类
        isCurPlay: false, //判断是否是当前播放的专辑
    },
    getList(options = {}) {
        let params = Object.assign({}, options, {
            id: that.data.id,
        })
        let accessToken = Auth.token() ? "?access_token=" + Auth.token() : "";
        Require.call({
            api: 'api/mag.book.get.json' + accessToken,
            data: params
        }).then(res => {
            wx.setNavigationBarTitle({ title: res.page_title })
            let result = res.book;
            that.setData({
                resultData: res,
                bookList: result,
                playAblumn: result.audio,
                is_faved: result.is_faved,
                share_title: res.share_title
            })
        })
    },
    //收藏& 取消收藏
    bindColToggle() {
        let postApi = that.data.is_faved ? 'unfavTopic' : 'favTopic';
        Require[postApi](that.data.id).then(res => {
            that.setData({ is_faved: !that.data.is_faved })
        })
    },
    //播放
    playAudio(e) {
        let index = e.currentTarget.dataset.index;
        let lists = e.currentTarget.dataset.type ? that.data.bookList : wx.getStorageSync("playList")

        MusicCtr.playMusic({ lists: lists, index: index })
        that.setData({
                playing: true,
                curPlay: that.data.playAblumn[index],
                playIndex: index,
            })
            // that.songPlay();
        that.setMusicData();
    },
    //暂停
    stopAudio() {
        MusicCtr.stopMusic();
        that.setData({ playing: false, "musicData.playing": false })
        wx.setStorageSync("playing", false)
            // that.setMusicData();

    },
    //下一首
    playPre() {
        MusicCtr.playPrevious();
        // that.setData({ playIndex: wx.getStorageSync("playIndex") });
        that.setMusicData()
    },
    //上一首
    playNext() {
        MusicCtr.playNext();
        // that.setData({ playIndex: wx.getStorageSync("playIndex") })
        that.setMusicData()
    },
    //设置播放条数据
    setMusicData() {
        let musicData = MusicCtr.getMusicData();
        that.songPlay();
        //判断播放的是否为当前专辑
        let isCurPlay = musicData.playList.id == that.data.id ? true : false;
        //多个页面数据
        that.setData({
            musicData: musicData,
            playIndex: wx.getStorageSync("playIndex"),
            playing: wx.getStorageSync("playing"),
            isCurPlay: isCurPlay,
        })

        console.log("musicData::", that.data.musicData);
    },
    /* 播放进度状态控制 */
    songPlay() {
        clearInterval(timer);
        let timer = setInterval(function() {
            wx.getBackgroundAudioPlayerState({ // 调用小程序播放控制api
                success(res) {
                    let status = res.status;
                    if (status === 0) { clearInterval(timer); }
                    that.setData({
                        "musicData.songState": {
                            progress: res.currentPosition / res.duration * 100,
                            currentPosition: Util.timeToString(res.currentPosition), // 调用转换时间格式
                            duration: Util.timeToString(res.duration) // 调用转换时间格式 
                        }
                    });
                }
            })
        }, 1000);
        //监听音乐停止,自动下一曲
        wx.onBackgroundAudioStop(() => {
            console.info("停止")
            that.playNext();
        })

    },
    navigatorToDetail(e) {
        if (e.currentTarget.id == that.data.id) return;
        wx.navigateTo({ url: '/pages/home/detail?id=' + e.currentTarget.id })
    },
    onLoad: function(options) {
        that = this;
        that.setData({ id: options.id })
        that.getList();

        // MusicCtr = new MusicCtr()
    },

    onReady: function() {

    },

    onShow: function() {
        that.setMusicData();
    },

    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
        that.getList();
    },


    onReachBottom: function() {

    },

    onShareAppMessage: function() {
        return {
            title: that.data.share_title,
            path: "/pages/home/detail?id=" + that.data.id
        }
    }
})