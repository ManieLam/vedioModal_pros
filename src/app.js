//app.js
const Api = require('./utils/Api')
const Auth = require('./utils/Auth')


App({
    onLaunch: function() {},
    globalData: {
        userInfo: Auth.user()
    },

    copyUrl: function(url) {
        wx.setClipboardData({
            data: url,
            success: function(res) {
                wx.showModal({
                    title: '购买链接复制成功',
                    content: '请粘贴链接至浏览器打开！',
                    showCancel: false
                })
            }
        })
    },

    copyCode: function(code) {
        wx.setClipboardData({
            data: code,
            success: function(res) {
                wx.showModal({
                    title: '淘口令复制成功',
                    content: '请打开淘宝就可以一键购买！',
                    showCancel: false
                })
            }
        })
    }
})