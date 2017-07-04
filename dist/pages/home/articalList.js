// pages/home/articalList.js
const App = getApp();
let that;

Page({

    data: {
        listData: {},
    },
    getList() {
        App.Api().then(res => {})
    },
    onLoad: function(options) {
        that = this;
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