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
    loading: true,
    tabActive: 0,
    townList: [],
    projectList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTodayForTown()
    this.getTodayForProject()
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.share(this, {
      title: '点击查看东莞楼市今日成交数据'
    })
  },

  // 查看详情
  viewDetail(e) {
    const index = e.currentTarget.dataset.index
    const url = this.data.projectList[index].url
    wx.navigateTo({
      url: `/pages/project/index?url=${encodeURIComponent(url)}`,
    })
  },

  // 搜索
  viewSearch(e) {
    const type = e.currentTarget.dataset.type
    const index = e.currentTarget.dataset.index
    const townName = this.data.townList[index].name
    let townIndex = 0
    getState('town_list').then(list => {
      for(let i in list) {
        if (list[i].name == townName) {
          townIndex = i
          break
        }
      }
      wx.navigateTo({
        url: `/pages/search/index?townIndex=${townIndex}&usageIndex=${type}`,
      })
    }).catch(err => {
      console.error(err)
    })
  },

  // 获取当日镇区销售情况
  getTodayForTown() {
    const that = this
    getData({
      type: 'today_town'
    }).then(res => {
      // 排序
      res.data.sort((a, b) => {
        const aTotal = parseInt(a.hourseCount) + parseInt(a.officeCount) + parseInt(a.parkCount) + parseInt(a.shopCount)
        const bTotal = parseInt(b.hourseCount) + parseInt(b.officeCount) + parseInt(b.parkCount) + parseInt(b.shopCount)
        return bTotal - aTotal
      })
      that.setData({
        loading: false,
        townList: res.data
      })
    }).catch(err => {
      console.error(err)
    })
  },

  // 获取当日楼盘销售情况
  getTodayForProject() {
    const that = this
    getData({
      type: 'today_project'
    }).then(res => {
      // 排序
      res.data.sort((a, b) => {
        return (parseInt(b.notRecordCount) + parseInt(b.recordCount)) - (parseInt(a.notRecordCount) + parseInt(a.recordCount))
      })
      that.setData({
        projectList: res.data
      })
    }).catch(err => {
      console.error(err)
    })
  }
})