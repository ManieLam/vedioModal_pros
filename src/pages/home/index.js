// pages/home/index.js
const App = getApp();
let that;
const Api = require('../../utils/Api');
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
        newsList: [],
        homeList: [],
    },
    onNavbarTap(e) {
        this.setData({ currentTab: e.currentTarget.dataset.index });
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
        // return{
        //   title:that.data.share_title,

        // }
    }
})