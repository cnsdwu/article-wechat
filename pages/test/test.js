//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    test: [],
    staffA: {
      firstName: 'Hulk',
      lastName: 'Hu'
    },
    staffB: {
      firstName: 'Shang',
      lastName: 'You'
    },
    staffC: {
      firstName: 'Gideon',
      lastName: 'Lin'
    }
  },
  onLoad: function() {
    this.setData({
      test: (wx.getStorageSync('test') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  }
})