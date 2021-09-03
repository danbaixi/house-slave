import request from '../utils/request'

// 获取数据
// type=index 首页数据
// type=today_town 镇区今日成交数
// type=today_project 项目今日成交数
// type=project_info 楼盘详情
// type=room_info 房间详情
// type=town_list 镇区列表
export function getData(data) {
  return request({
    url: '/getData',
    data
  })
}

// 搜索楼盘
export function search(data) {
  return request({
    url: '/search',
    data,
    method: 'POST'
  })
}