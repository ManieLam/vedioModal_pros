// pages/home/detail.js
const App = getApp();
let that;
const Api = require('../../utils/Api');

Page({

    data: {
        musicData: {},
        bookList: {},
        playAblumn: [],
        playing: false,
    },
    getList(options = {}) {
        let params = Object.assign({}, options, {
            id: that.data.id,
        })
        Api.call({
            api: 'api/mag.book.get.json',
            data: params
        }).then(res => {
            wx.setNavigationBarTitle({ title: res.page_title })
            let result = res.book;
            that.setData({
                bookList: result,
                playAblumn: result.audio,
                is_faved: result.is_faved,
                share_title: res.share_title
            })
        })
    },
    //收藏& 取消收藏
    bindCollect() {},
    //播放
    playAudio() {},
    //暂停
    stopAudio() {},
    //
    onLoad: function(options) {
        that = this;
        that.setData({ id: options.id })
        that.getList();
    },

    onReady: function() {

    },

    onShow: function() {

    },

    onPullDownRefresh: function() {

    },


    onReachBottom: function() {

    },

    onShareAppMessage: function() {

    }
})