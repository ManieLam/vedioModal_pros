// pages/home/articalList.js
const App = getApp();
let that;
const Api = require('../../utils/Api');

Page({

    data: {
        listData: {},
    },
    getList(options = {}) {
        let params = Object.assign({}, {
            cat: that.data.id,
        }, options)
        Api.call({
            api: 'api/mag.book.list.json',
            data: params
        }).then(res => {
            // wx.setNavigationBarTitle({ title: res.page_title })
            that.setData({
                listData: res,
                share_title: res.share_title,
            })
            console.log("listData", that.data.listData);
        })
    },
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