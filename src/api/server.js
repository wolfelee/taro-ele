import Taro, { request, showLoading, hideLoading } from '@tarojs/taro'

class Server {
  // 初始请求次数
  reqNum = 0

  ajax(url = '', data = {}, method = 'GET', params = {}) {
    // 提示
    showLoading({ title: '加载中...', mask: true })
    // 请求次数递增
    this.reqNum++

    // 判断请求类型
    let contentType
    // GET请求
    if (method === 'GET') {
      contentType = 'application/json'
      // POST 请求
    } else if (method === 'POST') {
      contentType = 'application/x-www-form-urlencoded'
    }

    // 用户token令牌
    let Authorization = Taro.getStorageSync('token') || ''

    return new Promise((resolve, reject) => {
      request({
        url,
        data,
        method,
        header: {
          'content-type': contentType,
          Authorization,
        },
        ...params,
        // 成功回调
        success(res) {
          resolve(res.data)
        },
        // 失败回调
        fail(res) {
          reject(res)
        },
        // 成功失败都回调
        complete: () => {
          // 请求次数递减
          this.reqNum--
          // reqNum=0 说明最后一个请求发送完毕
          if (this.reqNum === 0) {
            hideLoading()
          }
        },
      })
    })
  }
}

export default Server

// // 初始请求次数
// let reqNum = 0
// const ajax = (url, data = {}, method = 'GET', params) => {
//   showLoading({ title: '加载中...', mask: true })
//   // 请求次数递增
//   reqNum++

//   // 判断请求类型
//   let contentType
//   if (method === 'GET') {
//     contentType = 'application/json'
//   } else if (method === 'POST') {
//     contentType = 'application/x-www-form-urlencoded'
//   }

//   // 用户token令牌
//   let Authorization = Taro.getStorageSync('token') || ''

//   return new Promise((resolve, reject) => {
//     request({
//       url,
//       data,
//       header: {
//         'content-type': contentType,
//         Authorization,
//       },
//       method,
//       ...params,
//       // 成功回调
//       success(res) {
//         resolve(res.data)
//       },
//       // 失败回调
//       fail(res) {
//         reject(res)
//       },
//       // 成功失败都回调
//       complete() {
//         // 请求次数递减
//         reqNum--
//         // reqNum=0 说明最后一个请求发送完毕
//         if (reqNum === 0) {
//           hideLoading()
//         }
//       },
//     })
//   })
// }

// export default ajax
