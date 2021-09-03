import configs from './config.js'
App({
  onLaunch() {
    const that = this
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      if (res.hasUpdate) {
        that.toast('检查更新...', 'loading')
      }
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
      that.toast('新版本加载失败，请点击右上角重新进入小程序')
    })
  },
  globalData: {

  },
  // 简化toast
  toast(title, icon = 'none', duration = 2000) {
    if (typeof title == 'object') {
      title = title.message || '加载失败'
    }
    wx.showToast({
      title,
      icon,
      duration
    })
  },
  // 构造当前页面路径
  buildRoute(page) {
    const route = '/' + page.route
    if (!page.options) {
      return route
    }
    const ops = []
    for (let k in page.options) {
      ops.push(`${k}=${page.options[k]}`)
    }
    console.log(`${route}?${ops.join('&')}`)
    return `${route}?${ops.join('&')}`
  },
  getConfig(key = '') {
    if (key == '') {
      return configs
    }
    if (!configs[key]) {
      console.error('config is not exist')
      return ''
    }
    if (typeof configs[key] === 'object') {
      const localEnv = this.getConfig('env')
      return configs[key][localEnv]
    }
    return configs[key]
  },
  // 返回操作
  back(duration = 1000, delta = 1) {
    setTimeout(() => {
      wx.navigateBack({
        delta,
        fail: function () {
          wx.navigateTo({
            url: '/pages/index/index',
          })
        }
      })
    }, duration);
  },
  // 通用分享
  share(page, obj = {}) {
    const title = obj.title || '随时随地查东莞楼盘备案价！'
    const imageUrl = obj.imageUrl || '/asset/imgs/share.png'
    const path = this.buildRoute(page)
    return {
      title,
      imageUrl,
      path
    }
  }
})