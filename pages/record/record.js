// pages/record/record.js
const api = require('../../utils/api.js')
const format = require('../../utils/date-format.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tickets: [
      // {
      //   icon: '../../assets/images/box.png',
      //   title: '礼盒1',
      //   price: '20.00',
      //   valid: '2020-02-14 至 2020-03-01',
      //   ticketcode: '010203040506'
      // },
      // {
      //   icon: '../../assets/images/box.png',
      //   title: '礼盒2',
      //   price: '30.00',
      //   valid: '2020-02-14 至 2020-03-01',
      //   ticketcode: '020203040506'
      // },
      // {
      //   icon: '../../assets/images/box.png',
      //   title: '礼盒3',
      //   price: '40.00',
      //   valid: '2020-02-14 至 2020-03-01',
      //   ticketcode: '030203040506'
      // }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let openid = wx.getStorageSync('userinfo').openid

    wx.request({
      url: api.awardrecordsUrl,
      data: {
        'openid': openid
      },
      success: (res) => {
        let tickets = res.data.data.result

        console.log(tickets)
        this.setData({
          tickets: tickets
        })
      },
      fail: (err) => {

      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})