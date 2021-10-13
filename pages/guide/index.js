const app = getApp()
import { getGuidePrice } from '../../api/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    total: 0,
    search: '',
    sort: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.share(this, {
      title: '最新公布的东莞二手房参考价'
    })
  },

  // 搜索
  search() {
    const list = this.data.list
    let total = 0
    for(let i=0; i<list.length; i++) {
      if (list[i].name.search(this.data.search) != -1 || list[i].town.search(this.data.search) != -1) {
        list[i].display = true
        total++
      } else {
        list[i].display = false
      }
    }
    this.setData({
      total,
      list,
      sort: false
    })
  },

  clear() {
    this.setData({
      search: ''
    })
    this.search()
  },

  // 排序
  sort() {
    let list = this.data.list
    let sort = this.data.sort
    if (sort === false || sort == 'asc') {
      sort = 'desc'
      // 降序
      list.sort((x,y) => {
        return y.price - x.price
      })
    } else if (sort == 'desc') {
      sort = 'asc'
      // 升序
      list.sort((x,y) => {
        return x.price - y.price
      })
    }

    this.setData({
      sort,
      list
    })
  },

  // 获取数据
  getData() {
    const that = this
    getGuidePrice().then(res => {
      for(let i=0;i<res.data.length;i++) {
        res.data[i].display = true
      }
      that.setData({
        list: res.data,
        total: res.data.length
      })
    })
  }
})