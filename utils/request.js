const app = getApp()
export default function request(params) {
  const baseUrl = app.getConfig('baseUrl')
  const token = wx.getStorageSync('token')
  return new Promise((resolve, reject) => {
    if (params.needLogin === true && !token) {
      // 需要登录
      app.toast('请先登录')
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/login/index',
        })
      }, 1000);
      return reject('请先登录')
    }
    let contentType = "application/x-www-form-urlencoded"
    if (params.body) {
      contentType = "application/json"
    }
    const header = {
      "content-type": contentType,
      "auth-token": token,
    }
    let showLoading = false
    if (params.loading !== false) {
      showLoading = true
      wx.showLoading({
        title: '加载中',
        mask: true
      })
    }
    let timeout = 20000
    if (params.timeout > 0) {
      timeout = params.timeout
    }
    wx.request({
      url: `${baseUrl}${params.url}`,
      timeout,
      header,
      data: params.data || {},
      method: params.method || 'GET',
      success: res => {
        if (showLoading) {
          wx.hideLoading()
        }
        if (res.data.code == 0) {
          return resolve(res.data)
        }
        app.toast(res.message || '服务器开小差了')
        return reject(res.data)
      },
      fail: res => {
        if (showLoading) {
          wx.hideLoading()
        }
        app.toast('服务器开小差了')
        return reject(res)
      },
      complete: (res) => {
        if (wx.getAccountInfoSync().miniProgram.envVersion == 'trial') {
          // 体验版打印结果
          console.log(res)
        }
      }
    })
  })
}