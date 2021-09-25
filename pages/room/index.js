const app = getApp()
// 在页面中定义插屏广告
let interstitialAd = null
import {
  getData
} from '../../api/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showFileter: false,
    tmpSelected: {
      area: [],
      sale: [],
      prop: []
    },
    selected: {
      area: [],
      sale: [],
      prop: []
    },
    tmpPriceMin: '',
    tmpPriceMax: '',
    tmpTotalMin: '',
    tmpTotalMax: '',
    tmpAreaMin: '',
    tmpAreaMax: '',
    priceMin: '',
    priceMax: '',
    totalMin: '',
    totalMax: '',
    areaMin: '',
    areaMax: '',
    minPrice: 0, // 最低价
    maxPrice: 0, // 最高价
    avgPrice: 0, // 均价
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const url = decodeURIComponent(options.url) || ''
    const name = options.name || ''
    if (url == '') {
      app.toast('参数有误')
      app.back()
      return
    }
    if (name) {
      wx.setNavigationBarTitle({
        title: name,
      })
    }
    this.setData({
      name,
      url
    })
    this.getRoomList()
    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-5a52a043c9051b93'
      })
      interstitialAd.onLoad(() => {})
      interstitialAd.onError((err) => {})
      interstitialAd.onClose(() => {})
    }
    const adTime = wx.getStorageSync('ad_time')
    if (!adTime || parseInt((new Date().getTime() - adTime) / 1000) > 300) {
      setTimeout(() => {
        // 在适合的场景显示插屏广告
        if (interstitialAd) {
          interstitialAd.show().then(() => {
            // 记录广告时间
            wx.setStorageSync('ad_time', new Date().getTime())
          }).catch((err) => {
            console.log(err)
          })
        }
      }, 5000);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.share(this, {
      title: `点击查看${this.data.name}房价`
    })
  },

  // 显示筛选弹窗
  showFileter() {
    this.setData({
      tmpSelected: Object.assign({}, this.data.selected),
      showFileter: true,
      tmpPriceMin: this.data.priceMin,
      tmpPriceMax: this.data.priceMax,
      tmpTotalMin: this.data.totalMin,
      tmpTotalMax: this.data.totalMax,
      tmpAreaMin: this.data.areaMin,
      tmpAreaMax: this.data.areaMax,
    })
  },

  onClose() {
    this.setData({
      showFileter: false
    })
  },

  confirm() {
    if (isNaN(Number(this.data.tmpPriceMin))) {
      app.toast('单价最低价格式有误')
      return
    }
    if (isNaN(Number(this.data.tmpPriceMax))) {
      app.toast('单价最高价格式有误')
      return
    }
    if (isNaN(Number(this.data.tmpTotalMin))) {
      app.toast('总价最低价格式有误')
      return
    }
    if (isNaN(Number(this.data.tmpTotalMax))) {
      app.toast('总价最高价格式有误')
      return
    }
    if (isNaN(Number(this.data.tmpAreaMin))) {
      app.toast('最小面积格式有误')
      return
    }
    if (isNaN(Number(this.data.tmpAreaMax))) {
      app.toast('最大面积格式有误')
      return
    }
    if (this.data.tmpPriceMax != '' && this.data.tmpPriceMax < this.data.tmpPriceMin) {
      app.toast('单价最高价设置有误')
      return
    }
    if (this.data.tmpTotalMax != '' && this.data.tmpTotalMax < this.data.tmpTotalMin) {
      app.toast('总价最高价设置有误')
      return
    }
    if (this.data.tmpAreaMax != '' && this.data.tmpAreaMax < this.data.tmpAreaMin) {
      app.toast('总价最高价设置有误')
      return
    }
    this.onClose()
    setTimeout(() => {
      this.setData({
        selected: Object.assign({}, this.data.tmpSelected),
        tmpSelected: {
          area: [],
          sale: [],
          prop: []
        },
        priceMin: this.data.tmpPriceMin,
        priceMax: this.data.tmpPriceMax,
        totalMin: this.data.tmpTotalMin,
        totalMax: this.data.tmpTotalMax,
        areaMin: this.data.tmpAreaMin,
        areaMax: this.data.tmpAreaMax,
        tmpPriceMin: '',
        tmpPriceMax: '',
        tmpTotalMin: '',
        tmpTotalMax: '',
        tmpAreaMin: '',
        tmpAreaMax: '',
      })
      this.filter()
    }, 500);
  },

  // 选中
  selectItem(e) {
    const index = e.currentTarget.dataset.index
    const type = e.currentTarget.dataset.type
    const tmpSelected = this.data.tmpSelected
    if (index == 0) {
      if (tmpSelected[type].indexOf(index) > -1) {
        return
      }
      tmpSelected[type] = [0]
    } else {
      // 是否选中了全部
      const allIndex = tmpSelected[type].indexOf(0)
      if (allIndex > -1) {
        tmpSelected[type].splice(allIndex, 1)
      }
      const tmpIndex = tmpSelected[type].indexOf(index)
      if (tmpIndex > -1) {
        tmpSelected[type].splice(tmpIndex, 1)
      } else {
        tmpSelected[type].push(index)
      }
    }
    this.setData({
      tmpSelected
    })
  },

  filter() {
    // 这里用 Object.assign()只有浅拷贝的效果，why?
    const selectedList = JSON.parse(JSON.stringify(this.data.selected))
    for (let key in selectedList) {
      if (selectedList[key].length == 0 || selectedList[key][0] == 0) {
        delete selectedList[key]
        continue
      }
      for (let index in selectedList[key]) {
        selectedList[key][index] = this.data[`${key}Filter`][selectedList[key][index]]
      }
    }
    const rooms = this.data.rooms
    let isEmpty = false
    let layoutShowCount = rooms.length
    let minPrice = 0
    let maxPrice = 0
    let totalPrice = 0
    let showCount = 0
    for (let room of rooms) {
      room.show = true
      let count = 0
      for (let item of room.rooms) {
        item.show = true
        // 单价
        if (this.data.priceMin && (item.price < this.data.priceMin * 10000 || item.price == '未知')) {
          item.show = false
            ++count
          continue
        }
        if (this.data.priceMax && (item.price > this.data.priceMax * 10000 || item.price == '未知')) {
          item.show = false
            ++count
          continue
        }
        // 总价
        if (this.data.totalMin && (item.total < this.data.totalMin * 10000 || isNaN(Number(item.total)))) {
          item.show = false
            ++count
          continue
        }
        if (this.data.totalMax && (item.total > this.data.totalMax * 10000 || isNaN(Number(item.total)))) {
          item.show = false
            ++count
          continue
        }
        // 面积
        if (this.data.areaMin && item.area * 1 < this.data.areaMin) {
          item.show = false
            ++count
          continue
        }
        if (this.data.areaMax && item.area * 1 > this.data.areaMax) {
          item.show = false
            ++count
          continue
        }
        for (let key in selectedList) {
          if (selectedList[key].indexOf(item[key]) == -1) {
            item.show = false
              ++count
            break
          }
        }
        // 计算
        if (item.show && item.price != '未知' && item.price > 0) {
          item.price = item.price * 1
          if (minPrice == 0 || item.price < minPrice) minPrice = item.price
          if (item.price > maxPrice) maxPrice = item.price
          totalPrice += item.price
          showCount++
        }
      }
      // 该层全部隐藏
      if (room.rooms.length == count) {
        room.show = false
        layoutShowCount--
      }
      count = 0
    }
    if (layoutShowCount == 0) {
      isEmpty = true
    }
    // 计算均价
    const avgPrice = showCount > 0 ? (totalPrice / showCount).toFixed(2) : 0
    this.setData({
      minPrice,
      maxPrice,
      avgPrice,
      rooms,
      isEmpty
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 100,
    })
  },

  reset() {
    this.setData({
      tmpSelected: {
        area: [],
        sale: [],
        prop: []
      },
      tmpPriceMin: '',
      tmpPriceMax: '',
      tmpTotalMin: '',
      tmpTotalMax: '',
      tmpAreaMin: '',
      tmpAreaMax: '',
    })
  },

  export () {
    app.toast('正在开发中')
  },

  // 获取房间列表
  getRoomList() {
    const that = this
    getData({
      type: 'room_info',
      url: that.data.url
    }).then(res => {
      if (res.data.length == 0) {
        // 链接变了
        app.toast('页面过期，请重新进入')
        app.back()
        return
      }
      // 筛选条件
      let areaFilter = []
      const propFilter = ['全部']
      const saleFilter = ['全部']
      const rooms = res.data
      let minPrice = 0
      let maxPrice = 0
      let totalPrice = 0
      let count = 0
      if (rooms.length > 0) {
        rooms.map(item => {
          item.show = true
          item.rooms.map(room => {
            if (room.price != '未知' && room.price > 0) {
              room.price = room.price * 1
              if (minPrice == 0 || room.price < minPrice) minPrice = room.price
              if (room.price > maxPrice) maxPrice = room.price
              totalPrice += room.price
              count++
            }
            room.show = true
            if (areaFilter.indexOf(room.area) == -1) {
              areaFilter.push(room.area)
            }
            if (propFilter.indexOf(room.prop) == -1) {
              propFilter.push(room.prop)
            }
            if (saleFilter.indexOf(room.sale) == -1) {
              saleFilter.push(room.sale)
            }
          })
        })
        // 排序
        areaFilter = areaFilter.sort((x, y) => {
          return x - y
        })
      }
      const avgPrice = count > 0 ? (totalPrice / count).toFixed(2) : 0
      areaFilter.unshift('全部')
      that.setData({
        rooms,
        areaFilter,
        propFilter,
        saleFilter,
        minPrice,
        maxPrice,
        avgPrice
      })
    }).catch(err => {
      console.log(err)
    })
  }
})