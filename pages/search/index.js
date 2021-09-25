const app = getApp()
import contant from '../../utils/contant'
import getState from '../../utils/state'
import { search } from '../../api/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showMore: false,
    hideMore: true, // 隐藏表单次要信息
    usageList: contant.usage,
    townIndex: 0,
    usageIndex: 1,
    projectName: '',
    projectSite: '',
    developer: '',
    areaMin: '',
    areaMax: '',
    search: false,
    list: [],
    originalList: [], // 原始列表
    sort: 'desc'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const townIndex = options.townIndex || wx.getStorageSync('townIndex') || 0
    const usageIndex = options.usageIndex || wx.getStorageSync('usageIndex') || 1
    if (townIndex >= 0 || usageIndex >= 0) {
      this.setData({
        townIndex,
        usageIndex
      })
      this.searchSync()
      return
    }
    this.getTownList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.share(this)
  },

  async searchSync() {
    await this.getTownList()
    this.search()
  },

  // 选择事件
  selectForm(e) {
    const key = e.currentTarget.dataset.key
    if (this.data[key] == e.detail.value) {
      return
    }
    const data = {}
    data[key] = e.detail.value
    this.setData(data)
    this.search()
    wx.setStorageSync(key, e.detail.value)
  },

  // 展开条件
  showMore() {
    this.setData({
      showMore: !this.data.showMore
    })
    if (!this.data.showMore) {
      setTimeout(() => {
        this.setData({
          hideMore: true
        })
      }, 500);
      return
    }
    this.setData({
      hideMore: false
    })
  },

  // 查看详情
  viewDetail(e) {
    const index = e.currentTarget.dataset.index
    const url = this.data.list[index].url
    wx.navigateTo({
      url: `/pages/project/index?url=${encodeURIComponent(url)}`,
    })
  },

  // 重置
  reset() {
    this.setData({
      projectName: '',
      projectSite: '',
      developer: '',
      areaMin: '',
      areaMax: ''
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

  // 排序
  sort() {
    let sort = this.data.sort
    if (sort == 'desc') {
      sort = 'asc'
    } else if (sort == '') {
      sort = 'desc'
    } else {
      // 默认
      sort = ''
    }
    this.setData({
      sort
    })
    this.sortList()
  },

  sortList() {
    let list = this.data.originalList.slice(0)
    if (this.data.sort == 'desc') {
      list.sort((x,y) => {
        return y.stock - x.stock
      })
    } else if (this.data.sort == 'asc') {
      list.sort((x,y) => {
        return x.stock - y.stock
      })
    }
    this.setData({
      list
    })
  },

  // 搜索
  search() {
    const that = this
    const { projectName, projectSite, developer, areaMin, areaMax } = that.data
    search({
      townName: that.data.towns[that.data.townIndex].id,
      usage: that.data.usageList[that.data.usageIndex],
      projectName,
      projectSite,
      developer,
      areaMin,
      areaMax
    }).then(res => {
      const originalList = res.data.slice(0)
      that.setData({
        search: true,
        originalList
      })
      that.sortList()
    }).catch(err => {
      app.toast(err)
    })
  }
})