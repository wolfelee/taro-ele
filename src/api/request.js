import Taro, { request, showLoading, hideLoading } from '@tarojs/taro'

// 初始请求次数
let reqNum = 0
const ajax = (url, data = {}, method = 'GET', params) => {
  showLoading({ title: '加载中...', mask: true })
  // 请求次数递增
  reqNum++

  // 判断请求类型
  let contentType
  if (method === 'GET') {
    contentType = 'application/json'
  } else if (method === 'POST') {
    contentType = 'application/x-www-form-urlencoded'
  }

  // 用户token令牌
  let Authorization = Taro.getStorageSync('token') || ''

  return new Promise(resolve => {
    request({
      url,
      data,
      header: {
        'content-type': contentType,
        Authorization,
      },
      method,
      ...params,
      // 成功回调
      success(res) {
        resolve(res.data)
      },
      // 失败回调
      fail(res) {
        if (res.status === 401) {
          resolve({
            code: 5,
            message: '请先登录',
          })
          Taro.removeStorageSync('token')
        } else {
          resolve({
            code: 500,
            message: '服务器繁忙',
          })
        }
      },
      // 成功失败都回调
      complete() {
        // 请求次数递减
        reqNum--
        // reqNum=0 说明最后一个请求发送完毕
        if (reqNum === 0) {
          hideLoading()
        }
      },
    })
  })
}

export default ajax
