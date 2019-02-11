// pages/indexs/index.js
//获取应用实例
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        articles: {},
        encryptedData: '',
        iv: '',
        code: '',
        inputComment: '',
        heart: 'heart1.png',
        comments: []
    },
    like: function(event) {
        var that = this;
        getEn(this);
        wx.request({
            url: 'https://api.mxzu.net/article/index.php', //仅为示例，并非真实的接口地址
            method: 'POST',
            data: {
                action: 'like',
                encryptedData: this.data.encryptedData,
                code: this.data.code,
                iv: this.data.iv,
                articleId: this.data.articles.id,
                token: 'a6819d21b4433e333eca5357d92e2496ee0a1e2b1fe2351e0275d45b11ba116e'
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function(res) {
                var temp = that.data.articles;
                if (res.data.status == 1) {
                    if (res.data.code == 0) {
                        var likes = wx.getStorageSync('likes') || '';
                        if (likes.indexOf('@' + that.data.articles.id + '@') != -1) {
                            likes = likes.replace('@' + that.data.articles.id + '@', '');
                            wx.setStorageSync('likes', likes);
                        }
                        temp['like']--;
                        that.setData({
                            articles: temp,
                            heart: 'heart1.png'
                        })
                    } else {
                        var likes = wx.getStorageSync('likes') || '';
                        if (likes.indexOf('@' + that.data.articles.id + '@') == -1) {
                            likes += '@' + that.data.articles.id + '@';
                            wx.setStorageSync('likes', likes);
                        }
                        temp['like']++;
                        that.setData({
                            articles: temp,
                            heart: 'heart2.png'
                        })
                    }
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 1000
                    })
                }
            }
        })
    },
    admire: function(event) {
        var that = this;
        getEn(this);
        wx.request({
            url: 'https://api.mxzu.net/article/index.php', //仅为示例，并非真实的接口地址
            method: 'POST',
            data: {
                action: 'admire',
                encryptedData: this.data.encryptedData,
                code: this.data.code,
                iv: this.data.iv,
                commentId: event.currentTarget.dataset.id,
                token: 'a6819d21b4433e333eca5357d92e2496ee0a1e2b1fe2351e0275d45b11ba116e'
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function(res) {
                var temp = that.data.comments;
                var index = event.currentTarget.dataset.index;
                var flag = that.admireFlag;
                var admires = wx.getStorageSync('admires' + that.data.articles.id) || '';
                if (res.data.status == 1) {
                    if (res.data.code == 0) {
                        if (admires.indexOf('@' + event.currentTarget.dataset.id + '@') != -1) {
                            admires = admires.replace('@' + event.currentTarget.dataset.id + '@', '');
                            wx.setStorageSync('admires' + that.data.articles.id, admires);
                        }
                        temp[index].admire--;
                        temp[index].flag = false;
                        that.setData({
                            comments: temp
                        })
                    } else {
                        if (admires.indexOf('@' + event.currentTarget.dataset.id + '@') == -1) {
                            admires += '@' + event.currentTarget.dataset.id + '@';
                            wx.setStorageSync('admires' + that.data.articles.id, admires);
                        }
                        temp[index].admire++;
                        temp[index].flag = true;
                        that.setData({
                            comments: temp
                        })
                    }
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 1000
                    })
                }
            }
        })
    },
    comment: function(event) {
        var that = this;
        getEn(this);
        wx.request({
            url: 'https://api.mxzu.net/article/index.php', //仅为示例，并非真实的接口地址
            method: 'POST',
            data: {
                action: 'comment',
                encryptedData: this.data.encryptedData,
                code: this.data.code,
                iv: this.data.iv,
                articleId: this.data.articles.id,
                content: this.data.inputComment,
                token: 'a6819d21b4433e333eca5357d92e2496ee0a1e2b1fe2351e0275d45b11ba116e'
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function(res) {
                if (res.data.status == 1) {
                    getComment(that.data.articles.id, that)
                    that.setData({
                        inputComment: ''
                    })
                    wx.showToast({
                        title: res.data.message,
                        icon: 'success',
                        duration: 2000
                    })
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 1000
                    })
                }

            }
        })
    },
    inputComment: function(event) {
        this.setData({
            inputComment: event.detail.value
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.showLoading({
            title: '加载中',
            mask: false,
        })
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo
                    })
                    getArticle(this);
                }
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        getEn(this);
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})

function getArticle(that) {
    wx.request({
        url: 'https://api.mxzu.net/article/index.php', //仅为示例，并非真实的接口地址
        method: 'POST',
        data: {
            action: 'get',
            token: 'a6819d21b4433e333eca5357d92e2496ee0a1e2b1fe2351e0275d45b11ba116e'
        },
        header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function(res) {
            that.setData({
                articles: res.data.value
            })
            var likes = wx.getStorageSync('likes') || '';
            if (likes.indexOf('@' + res.data.value.id + '@') != -1) {
                that.setData({
                    heart: 'heart2.png'
                })
            }
            getComment(res.data.value.id, that);
        }
    })
}

function getComment(id, that) {
    wx.request({
        url: 'https://api.mxzu.net/article/index.php', //仅为示例，并非真实的接口地址
        method: 'POST',
        data: {
            action: 'getComment',
            articleId: id,
            token: 'a6819d21b4433e333eca5357d92e2496ee0a1e2b1fe2351e0275d45b11ba116e'
        },
        header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function(res) {
            if (res.data.status == 1) {
                var admires = wx.getStorageSync('admires' + id) || '';
                for (var i in res.data.value) {
                    if (admires.indexOf('@' + res.data.value[i].id + '@') != -1) {
                        res.data.value[i].flag = true;
                    }
                }
                that.setData({
                    comments: res.data.value
                })
            } else if (res.data.code == 0) {

            } else {
                wx.showToast({
                    title: '评论内容加载失败',
                    icon: 'none',
                    duration: 1000
                })
            }

            wx.hideLoading()
        }
    })
}

function getEn(that) {
    // 登录
    wx.login({
        success: resCode => {
            that.setData({
                code: resCode.code
            })
        }
    })

    // 获取用户信息
    wx.getSetting({
        success: resUser => {
            if (resUser.authSetting['scope.userInfo']) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                wx.getUserInfo({
                    success: resInfo => {
                        // 可以将 res 发送给后台解码出 unionId
                        that.setData({
                            encryptedData: resInfo.encryptedData,
                            iv: resInfo.iv
                        })
                    }
                })
            }
        }
    })

}