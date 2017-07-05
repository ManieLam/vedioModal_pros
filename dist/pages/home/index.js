// pages/home/index.js
const App = getApp();
let that;
const Api = require('../../utils/Api');
let MusicCtr = require('../../utils/musicControll');
let Util = require("../../utils/util");
Page({
    data: {
        initHeader: {
            // 头部swiper自定义
            indicatorDots: true,
            autoplay: true,
            interval: 5000,
            duration: 500,
            height: 380,
            imgUrls: [],
        },
        navbar: ['发现', '收藏'],
        currentTab: 0, // 导航栏切换索引

        mode: 0,
        newsList: [], //快讯列表
        homeList: [], //书籍列表
        colList: [], //收藏列表
    },
    onNavbarTap(e) {
        let index = e.currentTarget.dataset.index;
        this.setData({ currentTab: index });
        index === 1 ? that.getCollectList() : that.getList();
    },
    getList() {
        Api.call({
            api: 'api/mag.home.json',
        }).then(res => {
            let category = res.category.filter(item => {
                item.book.length > 3 ? item.book.splice(0, 4) : null;
                return item.id != 8
            });

            that.setData({
                "initHeader.imgUrls": res.sliders,
                homeList: category,
            })
        })
    },
    getCollectList(options = {}) {
        Api.queryFavList({
            data: options
        }).then(res => {
            that.setData({
                    colList: res.books,
                    next_cursor: res.next_cursor
                })
                // console.log("colList", that.data.colList);
        })
    },


    //设置播放条数据
    setMusicData() {
        let musicData = MusicCtr.getMusicData();
        that.setData({
            musicData: musicData,
            playIndex: wx.getStorageSync("playIndex"),
            playing: wx.getStorageSync("playing"),
        })
    },
    //下一首
    playPre() {
        MusicCtr.playPrevious();
        that.setMusicData()
    },
    //上一首
    playNext() {
        MusicCtr.playNext();
        that.setMusicData()
    },
    //暂停
    stopAudio() {
        MusicCtr.stopMusic();
        that.setData({ playing: false })
        wx.setStorageSync("playing", false)
        that.setMusicData();

    },
    //播放
    playAudio(e) {
        let index = e.currentTarget.dataset.index;
        let lists = wx.getStorageSync("playList")

        MusicCtr.playMusic({ lists: lists, index: index })
        that.songPlay();
        that.setMusicData();
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


    onLoad: function(options) {
        that = this;
        that.getList();
    },

    onReady: function() {

    },

    onShow: function() {
        that.setMusicData();
        that.songPlay();

    },
    onUnload() { wx.clearStorage() },
    // onHide(){},
    onPullDownRefresh: function() {

    },

    onReachBottom: function() {
        if (that.data.currentTab === 1 && that.data.next_cursor) {
            that.getCollectList({ cursor: that.data.next_cursor })
        }
    },

    onShareAppMessage: function() {
        return {
            title: that.data.share_title,
            path: "/pages/home/index"
        }
    }
})