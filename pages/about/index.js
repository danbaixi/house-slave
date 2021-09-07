Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 'about',
    github: 'github.com/danbaixi/house-slave',
    email: 'danbaixixi@gmail.com'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const page = options.page || 'about'
    this.setData({
      page
    })
    let pageTitle = '关于项目'
    if (page == 'protocol') {
      pageTitle = '免责声明'
    }
    wx.setNavigationBarTitle({
      title: pageTitle,
    })
  },

  copy(e) {
    const type = e.currentTarget.dataset.type
    wx.setClipboardData({
      data: this.data[type]
    })
  }
})