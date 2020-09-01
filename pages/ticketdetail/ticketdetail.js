// pages/ticketdetail/ticketdetail.js
const wxbarcode = require('../../utils/qrcode/index.js')
const api = require('../../utils/api.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })

    //  请求查询此券详情
    wx.request({
      url: api.ticketqueryUrl,
      method: 'POST',
      data: {
        ticketcode: options.ticketcode
      },
      success: (res) => {

        wx.hideLoading()

        let ticket = res.data.data.result
        this.setData({
          productname: ticket.productname,
          ticketcode: ticket.ticketcode,
          price: ticket.price,
          startdate: ticket.startdate.substring(10, 0),
          enddate: ticket.enddate.substring(10, 0),
          description: ticket.description
        })

        wxbarcode.barcode('barcode', ticket.ticketcode, 600, 200);
        wxbarcode.qrcode('qrcode', ticket.ticketcode, 300, 300);

      },
      fail: (err) => {

        wx.hideLoading()

        wx.showToast({
          title: '网络开小差了...',
        })
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