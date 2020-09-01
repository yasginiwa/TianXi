// pages/wheel/index.js
const api = require('../../utils/api.js')
const format = require('../../utils/date-format.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    award: 1,
    mode: 2,
    userinfo: {
      nickname: null,
      gender: null,
      city: null,
      openid: null,
      chances: 3,
      isLogin: false
    },
    awardList: [
      { productname: '芝士小方换购券', productid: '1051466', price: '10.00' },
      { productname: null, productid: null, price: null },
      { productname: '甜戏10元抵扣券', productid: '1051467', price: '10.00' },
      { productname: null, productid: null, price: null },
      { productname: '甜戏巴旦木牛轧糖', productid: '1051468', price: '10.00' },
      { productname: '甜戏礼盒', productid: '1051469', price: '10.00' }
    ], // 顺时针对应每个奖项
    // winners: [
    //   { msg: 'aaa获得了111' },
    //   { msg: 'bbb获得了222' },
    //   { msg: 'ccc获得了333' }
    // ]
  },

  onLoad: function (options) {
    
    //  进入页面时获取userinfo
    wx.getStorage({
      key: 'userinfo',
      success: (res) => {
        this.setData({
          userinfo: res.data
        })
      },
    })

    //  请求通告栏中的获奖者
    wx.request({
      url: api.getwinnersUrl,
      success: (res) => {
        this.setData({
          winners: res.data.data.result
        })
      }
    })
  },

  //  首次进入小程序需登录 获取用户信息
  getUserInfo(e) {
    let rawData = JSON.parse(e.detail.rawData)

    //  存储userinfo至本地缓存
    this.setData({
      isLogin: true,
      userinfo: {
        'nickname': rawData.nickName,
        'gender': rawData.gender,
        'city': rawData.city,
        'openid': wx.getStorageSync('openid'),
        // 'chances': wx.getStorageSync('userinfo').chances,
        "chances": 3,
        'isLogin': true
      }
    })

    wx.removeStorage({ key: 'openid' })

    let userinfo = this.data.userinfo

    wx.request({
      method: 'POST',
      url: api.adduserUrl,
      data: {
        nickname: userinfo.nickname,
        gender: userinfo.gender,
        city: userinfo.city,
        openid: userinfo.openid,
        chances: userinfo.chances,
        isLogin: userinfo.isLogin
      },
      success: (res) => {
        console.log(res)
      }
    })

  },

  // 用户点击开始抽奖
  async wheelStart() {

    //  抽奖次数用完的情况
    if (!this.data.userinfo.chances) {
      wx.showToast({
        title: '暂无抽奖机会...',
        duration: 2000,
        icon: 'none',
        mask: true
      })
      return
    }

    //  抽一次 减一次机会
    let chances = parseInt(this.data.userinfo.chances)
    chances--

    //  设置奖项
    this.setData({
      award: Math.floor(Math.random() * 6 + 1), //安全起见生成奖项应该由后端完成，生成1到6随机
      ['userinfo.chances']: chances
    })

    //  存储至本地缓存
    wx.setStorage({
      key: 'userinfo',
      data: this.data.userinfo,
    })

    //  请求更新减少抽奖机会
    let userinfo = this.data.userinfo

    wx.request({
      url: api.updatechancesUrl,
      method: 'POST',
      data: {
        chances: userinfo.chances,
        openid: userinfo.openid
      },
      success: (res) => {
        console.log(res)
      }
    })

    // 触发组件开始方法
    this.selectComponent('#sol-wheel').begin()

  },

  // 抽奖完成后操作
  async wheelSuccess() {
    const index = this.data.award - 1
    console.log(index)
    console.log('bind:success', this.data.awardList[index])

    let productid = this.data.awardList[index].productid, //  优惠券一网烘焙标识符
      startdate = format('yyyy-MM-dd hh:mm:ss', new Date()),  //  优惠券有效起始时间
      enddate = '2020-03-15 00:00:00',  //  优惠券有效截至时间
      openid = this.data.userinfo.openid  //  微信openid

    if (index == 1 || index == 3) {
      wx.showToast({
        title: '谢谢参与!',
        icon: 'none',
        duration: 2000
      })

    } else {
      wx.showToast({
        title: `恭喜你获得 ${this.data.awardList[index].productname}`,
        icon: 'none',
        duration: 2000
      })
    }

    if (productid) {
      //  请求生成优惠券
      let ticketGen = () => {
        return new Promise((reslove, reject) => {
          wx.request({
            url: api.ticketgenUrl,
            method: 'POST',
            data: {
              productid: productid,
              startdate: startdate,
              enddate: enddate,
              openid: openid
            },
            success: (res) => {
              reslove(res.data.data.result)
            },
            fail: (err) => {
              wx.showToast({
                title: '网络开小差了...',
                icon: 'none'
              })
            }
          })
        })
      }

      //  增加抽奖记录
      let ticket = await ticketGen()

      wx.request({
        url: api.addrecordUrl,
        method: 'POST',
        data: {
          openid: openid,
          productid: productid,
          startdate: startdate,
          enddate: enddate,
          ticketno: ticket.ticketno,
          ticketcode: ticket.ticketcode
        },
        success: (res) => {
          console.log(res)
        },
        fail: (err) => {
          wx.showToast({
            title: '网络开小差了...',
            icon: 'none'
          })
        }
      })

    } else {

      //  增加抽奖记录
      wx.request({
        url: api.addrecordUrl,
        method: 'POST',
        data: {
          openid: openid,
          productid: null,
          startdate: null,
          enddate: null,
          ticketno: null,
          ticketcode: null
        },
        success: (res) => {
          console.log(res)
        },
        fail: (err) => {
          wx.showToast({
            title: '网络开小差了...',
            icon: 'none'
          })
        }
      })

    }





  },
  /* 转发*/
  onShareAppMessage: function (ops) {
    return {
      title: '甜戏大转盘',
      path: '/pages/index/index'
    }
  },
  // 转到中奖记录
  onClickRecord() {
    console.log('navto')
    wx.navigateTo({
      url: '../record/record'
    })
  }
})
