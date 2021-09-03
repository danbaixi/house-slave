// 状态管理
import {
  getData
} from '../api/index'

// 获取数据
export default function getState(key) {
  return new Promise((resolve, reject) => {
    const cache = wx.getStorageSync(key)
    if (cache) {
      return resolve(cache)
    }
    getData({
      type: key
    }).then(res => {
      wx.setStorageSync(key, res.data)
      return resolve(res.data)
    }).catch(err => {
      return reject(err)
    })
  })
}