import { APP_ID, API_HOST } from 'config.js';
const Auth = require('Auth.js');

function noop() {}
var defaultOptions = {
    method: 'GET',
    header: {
        'content-type': 'application/x-www-form-urlencoded'
    },
    success: noop,
    fail: noop,
    complete: noop
};
/**公用调用接口模块
 * @param  {object} options
 * @param  {Promise} 
 */
var call = function(options = {}) {
    let that = this;
    return new Promise((resolve, reject) => {
        wx.canIUse('showLoading') ? wx.showLoading({ title: '拼命加载中' }) : wx.showToast({ title: '拼命加载中', icon: 'loading' });
        var params = Object.assign({}, defaultOptions, options);
        params.url = options.url || (API_HOST + params.api);

        params.success = function(res) {
            wx.canIUse('showLoading') ? wx.hideLoading() : null;
            if (res.statusCode == 200) {
                if (res.data.errcode == 0) {
                    resolve(res.data);
                } else {
                    reject(res.data);
                }
            } else {
                reject(res.data);
            }
        }

        params.fail = function(res) {
            reject(res);
        }

        wx.request(params);
    });

}

/**
 * 需要授权的接口调用
 * @param  {Function} fn
 * @return {Promise}
 */
const guard = function(fn) {
    // console.info(1111)
    const self = this
    return function() {
        if (Auth.check()) {
            return fn.apply(self, arguments)
        } else {
            return Auth.login()
                .then(data => {
                    return fn.apply(self, arguments)
                })
        }
    }
}

/**
 * 点赞话题
 * @param  {int} id 话题id
 * @return {promise}
 */
const likeTopic = function likeTopic(id) {
    return new Promise(function(resolve, reject) {
        wx.request({
            url: API_HOST + 'api/mag.article.like.json?access_token=' + Auth.token(),
            method: 'POST',
            data: {
                post_id: id
            },
            success: function(res) {
                if (res.data.errcode === 0) {
                    wx.showToast({ title: res.data.errmsg || '万分感谢点赞！', })
                    resolve(res.data)
                } else {
                    wx.showToast({ title: res.data.errmsg || '失败T^T', })
                    reject(res)
                }
            },
            fail: function(res) {
                reject(res)
            }
        })
    })
}

/**
 * 取消点赞话题
 * @param  {int} id 话题id
 * @return {Promise}
 */
const unlikeTopic = function unlikeTopic(id) {
    return new Promise(function(resolve, reject) {
        wx.request({
            url: API_HOST + 'api/mag.article.unlike.json?access_token=' + Auth.token(),
            method: 'POST',
            data: {
                post_id: id
            },
            success: function(res) {
                if (res.data.errcode === 0) {
                    wx.showToast({
                        title: res.data.errmsg || '取消点赞了T^T',
                    })
                    resolve(res.data)
                } else {
                    wx.showToast({
                        title: res.data.errmsg || '失败T^T',
                    })
                    reject(res)
                }
            },
            fail: function(res) {
                reject(res)
            }
        })
    })
}

/**
 * 收藏话题
 * @param  {int} id 话题id
 * @return {promise}
 */
const favTopic = function favTopic(id) {
    return new Promise(function(resolve, reject) {
        wx.request({
            url: API_HOST + 'api/mag.book.fav.json?access_token=' + Auth.token(),
            method: 'POST',
            data: {
                post_id: id
            },
            success: function(res) {
                if (res.data.errcode === 0) {
                    wx.showToast({
                        title: res.data.errmsg || '感谢收藏',
                    })
                    resolve(res.data)
                } else {
                    wx.showToast({
                        title: res.data.errmsg || '失败了T^T',
                    })
                    reject(res)
                }
            },
            fail: function(res) {
                reject(res)
            }
        })
    })
}

/**
 * 取消收藏话题
 * @param  {int} id 话题id
 * @return {promise}
 */
const unfavTopic = function unfavTopic(id) {
    return new Promise(function(resolve, reject) {
        wx.request({
            url: API_HOST + 'api/mag.book.unfav.json?access_token=' + Auth.token(),
            method: 'POST',
            data: {
                post_id: id
            },
            success: function(res) {
                if (res.data.errcode === 0) {
                    wx.showToast({
                        title: res.data.errmsg || '取消收藏了T^T',
                    })
                    resolve(res.data)
                } else {
                    wx.showToast({
                        title: res.data.errmsg || '失败了T^T',
                    })
                    reject(res)
                }
            },
            fail: function(res) {
                reject(res)
            }
        })
    })
}

/**
 * 创建评论
 * @param  {object} args 参数
 * @return {promise}
 */
const createReply = function createReply(args) {
    return new Promise(function(resolve, reject) {
        wx.request({
            url: API_HOST + 'api/mag.article.reply.json?access_token=' + Auth.token(),
            method: 'POST',
            data: args,
            success: function(res) {
                if (res.data.errcode === 0) {
                    wx.showToast({
                        title: res.data.errmsg || '感谢您的评论',
                    })
                    resolve(res.data)
                } else {
                    wx.showToast({
                        title: res.data.errmsg || '失败了T^T',
                    })
                    reject(res)
                }
            },
            fail: function(res) {
                reject(res)
            }
        })
    })
}

/**
 * 删除评论
 * @param  {int} id 评论id
 * @return {promise}
 */
const deleteReply = function deleteReply(id) {
    return new Promise(function(resolve, reject) {
        wx.request({
            url: API_HOST + 'api/mag.article.unreply.json?access_token=' + Auth.token(),
            method: 'POST',
            data: {
                id: id
            },
            success: function(res) {
                if (res.data.errcode === 0) {
                    wx.showToast({
                        title: res.data.errmsg || '删除成功'
                    })
                    resolve(res.data)
                } else {
                    wx.showToast({
                        title: res.data.errmsg || '失败了T^T'
                    })
                    reject(res)
                }
            },
            fail: function(res) {
                reject(res)
            }
        })
    })
}

/**
 * 获取收藏列表
 * @param  {object} args<{cursor}>
 * @return {promise}
 */
const queryFavList = function queryFavList(args) {
    return new Promise(function(resolve, reject) {
        wx.request({
            url: API_HOST + 'api/mag.fav.list.json?access_token=' + Auth.token(),
            method: 'GET',
            data: args,
            success: function(res) {
                if (res.data.errcode === 0) {
                    resolve(res.data)
                } else {
                    wx.showToast({
                        title: res.data.errmsg
                    })
                    reject(res)
                }
            },
            fail: function(res) {
                reject(res.data)
            }
        })
    })
}

/**
 * 我的消息列表
 * @param  {object} args<{cursor}>
 * @return {promise}
 */
// const queryNotificationList = function queryNotificationList(args) {
//     return new Promise(function(resolve, reject) {
//         wx.request({
//             url: API_HOST + 'api2/notification.list.json?access_token=' + Auth.token(),
//             method: 'GET',
//             data: args,
//             success: function(res) {
//                 if (res.data.errcode === 0) {
//                     resolve(res.data)
//                 } else {
//                     wx.showToast({
//                         title: res.data.errmsg
//                     })
//                     reject(res)
//                 }
//             },
//             fail: function(res) {
//                 reject(res)
//             }
//         })
//     })
// }



module.exports = {
    call: call,
    // postCollect: guard(postCollect),
    // getCollect: guard(getCollect),
    likeTopic: guard(likeTopic),
    unlikeTopic: guard(unlikeTopic),
    favTopic: guard(favTopic),
    unfavTopic: guard(unfavTopic),
    createReply: guard(createReply),
    deleteReply: guard(deleteReply),
    queryFavList: guard(queryFavList),
    // queryNotificationList: guard(queryNotificationList)
}