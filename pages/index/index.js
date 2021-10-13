const app = getApp()
import {
  getData
} from '../../api/index'
import getState from '../../utils/state'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: false,
    list: [],
    selectedTownIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTownList()
    this.getTodayData()
    const selectedTownIndex = wx.getStorageSync('townIndex') || 0
    this.setData({
      selectedTownIndex
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.share(this)
  },

  // 选择镇区
  selectTown(e) {
    this.setData({
      selectedTownIndex: e.detail.value
    })
    wx.setStorageSync('townIndex', e.detail.value)
    this.search()
  },

  // 搜索
  search() {
    let url = '/pages/search/index'
    if (this.data.selectedTownIndex != null) {
      url += `?townIndex=${this.data.selectedTownIndex}`
    } 
    wx.navigateTo({
      url
    })
  },

  // 查看今日成交详细记录
  viewToday(e) {
    const index = e.currentTarget.dataset.index
    if (index == 0) {
      wx.navigateTo({
        url: '/pages/today/index',
      })
    }
  },

  // 获取首页数据
  getTodayData() {
    const that = this
    getData({
      type: 'index'
    }).then(res => {
      that.setData({
        list: res.data
      })
    }).catch(msg => {
      console.error(msg)
      app.toast(msg)
    })
  },

  // 获取镇区列表
  getTownList() {
    const that = this
    getState('town_list').then(res => {
      that.setData({
        form: true,
        towns: res
      })
    }).catch(msg => {
      console.error(msg)
    })
  },

  goGuidePrice() {
    wx.navigateTo({
      url: '/pages/guide/index',
    })
  }
})