// pages/home/detail.js
const App = getApp();
let that;
const Api = require('../../utils/Api');
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
        Api.call({
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
        Api[postApi](that.data.id).then(res => {
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
        that.songPlay();
        that.setMusicData();
    },
    //暂停
    stopAudio() {
        MusicCtr.stopMusic();
        that.setData({ playing: false })
        wx.setStorageSync("playing", false)
        that.setMusicData();

    },
    //下一首
    playPre() {
        MusicCtr.playPrevious();
        that.setData({ playIndex: wx.getStorageSync("playIndex") });
        that.setMusicData()
    },
    //上一首
    playNext() {
        MusicCtr.playNext();
        that.setData({ playIndex: wx.getStorageSync("playIndex") })
        that.setMusicData()
    },
    //设置播放条数据
    setMusicData() {
        let musicData = MusicCtr.getMusicData();

        //判断播放的是否为当前专辑
        let isCurPlay = musicData.playList.id == that.data.id ? true : false;
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
                    if (status === 1) { //正在播放才需要计算进度条
                        that.setData({
                            "musicData.songState": {
                                progress: res.currentPosition / res.duration * 100,
                                currentPosition: Util.timeToString(res.currentPosition), // 调用转换时间格式
                                duration: Util.timeToString(res.duration) // 调用转换时间格式 
                            }
                        });
                        // wx.setStorageSync('songState', that.data.songState);
                    } else if (status === 0) {
                        clearInterval(timer);
                    }
                }
            })
        }, 1000);
        //监听音乐停止
        wx.onBackgroundAudioStop(() => {
            console.info("停止")
            that.playNext();
        })

    },
    //
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

    },


    onReachBottom: function() {

    },

    onShareAppMessage: function() {

    }
})