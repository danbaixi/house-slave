const app = getApp()
import {
  getData
} from '../../api/index'
import { formatRichText } from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabActive: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const url = decodeURIComponent(options.url) || ''
    if (url == '') {
      app.toast('参数有误')
      app.back()
      return
    }
    this.setData({
      url
    })
    this.getDetail()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.share(this)
  },

  // 查看详情
  viewDetail(e) {
    const index = e.currentTarget.dataset.index
    const url = this.data.all[index].url
    wx.navigateTo({
      url: `/pages/project/index?url=${encodeURIComponent(url)}`,
    })
  },

  // 查看房间
  viewRoom(e) {
    const index = e.currentTarget.dataset.index
    const url = this.data.hourse[index].url
    wx.navigateTo({
      url: `/pages/room/index?name=${this.data.info[0].value}&url=${encodeURIComponent(url)}`,
    })
  },

  //获取详情
  getDetail() {
    const that = this
    getData({
      type: 'project_info',
      url: that.data.url
    }).then(res => {
      res.data.contract = formatRichText(res.data.contract)
      that.setData({
        ...res.data
      })
    }).catch(err => {
      console.log(err)
    })
  }
})