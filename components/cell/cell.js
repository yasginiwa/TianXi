// components/cell/cell.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    icon: String,
    title: String,
    price: String,
    ticketcode: String,
    ticketno: String
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onCellClick(e) {
      wx.navigateTo({
        url: `../ticketdetail/ticketdetail?productname=${this.data.title}&ticketcode=${this.data.ticketcode}&startdate=${this.data.startdate}&enddate=${this.data.enddate}&price=${this.data.price}`,
      })
    }
  }
})
