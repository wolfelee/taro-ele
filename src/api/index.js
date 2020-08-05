import to from 'await-to-js'
import Server from './server'
import configStore from '../redux/store'
import { removeToken } from '../redux/actions/user'

let BASEURL
if (process.env.TARO_ENV === 'h5') {
  BASEURL = '/api'
} else if (process.env.TARO_ENV === 'weapp') {
  BASEURL = 'http://localhost:4000/api'
}

const store = configStore()

class Ajax extends Server {
  // 异常处理 401 500
  errMessage(err) {
    if (!err) {
      return null
    }

    if (err.status === 401) {
      // 清空token
      store.dispatch(removeToken())

      return {
        name: '401',
        message: '请先登录',
      }
    } else if (err.status === 500) {
      return {
        name: '500',
        message: '服务器繁忙',
      }
    } else {
      return {
        name: 'err',
        message: '其他错误',
        status: err.status,
      }
    }
  }

  // 获取ip地址
  async reqIpAddress() {
    let [err, result] = await to(
      this.ajax(BASEURL + '/ip', { key: 'UNZBZ-MJUKS-W76OY-6SGXP-7TIFE-AXBA3' })
    )
    err = this.errMessage(err)

    return [err, result]
  }

  // 搜索城市列表
  async reqCityList(params) {
    let [err, result] = await to(this.ajax(BASEURL + '/city', params))
    err = this.errMessage(err)

    return [err, result]
  }

  // 搜索当前城市详细地址
  async reqAddressDetail(params) {
    let [err, result] = await to(this.ajax(BASEURL + '/address', params))
    err = this.errMessage(err)

    return [err, result]
  }

  // 首页导航
  async reqNavList(params) {
    let [err, result] = await to(this.ajax(BASEURL + '/navlist', params))
    err = this.errMessage(err)

    return [err, result]
  }

  // 用户注册
  async reqRegister(params) {
    let [err, result] = await to(
      this.ajax(BASEURL + '/register', params, 'POST')
    )
    err = this.errMessage(err)

    return [err, result]
  }

  // 用户登录
  async reqLogin(params) {
    let [err, result] = await to(this.ajax(BASEURL + '/login', params, 'POST'))
    err = this.errMessage(err)

    return [err, result]
  }

  // 获取用户信息
  async reqUserInfo() {
    let [err, result] = await to(this.ajax(BASEURL + '/userinfo'))
    err = this.errMessage(err)

    return [err, result]
  }

  // 获取用户地址
  async reqUserAddress() {
    let [err, result] = await to(this.ajax(BASEURL + '/userAddress'))
    err = this.errMessage(err)

    return [err, result]
  }

  // 用户搜索地址
  async reqUseSearchAddress(params) {
    let [err, result] = await to(
      this.ajax(BASEURL + '/useSearchAddress', params)
    )
    err = this.errMessage(err)

    return [err, result]
  }

  // 编辑用户收货地址
  async reqSetUserAddress(params) {
    let [err, result] = await to(
      this.ajax(BASEURL + '/setUserAddress', params, 'POST')
    )
    err = this.errMessage(err)

    return [err, result]
  }

  // 添加用户收货地址
  async reqAddUserAddress(params) {
    let [err, result] = await to(
      this.ajax(BASEURL + '/addUserAddress', params, 'POST')
    )
    err = this.errMessage(err)

    return [err, result]
  }

  // 删除用户收货地址
  async reqDelUserAddress(id) {
    let [err, result] = await to(this.ajax(BASEURL + '/delUserAddress', id))
    err = this.errMessage(err)

    return [err, result]
  }

  // 修改用户名
  async reqSetUserName(username) {
    let [err, result] = await to(
      this.ajax(BASEURL + '/setUserName', username, 'POST')
    )
    err = this.errMessage(err)

    return [err, result]
  }

  // 修改用户密码
  async reqSetPassWord(params) {
    let [err, result] = await to(
      this.ajax(BASEURL + '/setPassWord', params, 'POST')
    )
    err = this.errMessage(err)

    return [err, result]
  }

  // 获取首页筛选条数据
  async reqGetBatchFilter(params) {
    let [err, result] = await to(this.ajax(BASEURL + '/getBatchFilter', params))
    err = this.errMessage(err)
    console.log(err)
    return [err, result]
  }

  // 获取首页商品数据列表
  async reqGetMsiteShopList(params) {
    let [err, result] = await to(
      this.ajax(BASEURL + '/getMsiteShopList', params)
    )
    err = this.errMessage(err)

    return [err, result]
  }

  // 商家列表头部滑动分类数据
  async reqGetFoodsPage({ latitude, longitude, entry_id }) {
    let [err, result] = await to(
      this.ajax(BASEURL + '/getFoodsPage', { latitude, longitude, entry_id })
    )
    err = this.errMessage(err)

    return [err, result]
  }

  // 商家列表头部更多分类
  async reqGetFoodsClass({ latitude, longitude }) {
    let [err, result] = await to(
      this.ajax(BASEURL + '/getFoodsClass', { latitude, longitude })
    )
    err = this.errMessage(err)

    return [err, result]
  }

  // 获取商家详情信息
  async reqGetShop(id) {
    let [err, result] = await to(this.ajax(BASEURL + '/getShop', { id }))
    err = this.errMessage(err)

    return [err, result]
  }

  // 获取商家评价
  async reqEstimate() {
    let [err, result] = await to(this.ajax(BASEURL + '/getEstimate'))
    err = this.errMessage(err)

    return [err, result]
  }

  // 获取商家评论更多
  async reqRatings({ name, offset, limit, has_content }) {
    let [err, result] = await to(
      this.ajax(BASEURL + '/getRatings', { name, offset, limit, has_content })
    )
    err = this.errMessage(err)

    return [err, result]
  }

  // 获取商家品牌故事
  async reqBrandStory() {
    let [err, result] = await to(this.ajax(BASEURL + '/brandStory'))
    err = this.errMessage(err)

    return [err, result]
  }

  // 热门搜索
  async reqHotSearchWords({ latitude, longitude }) {
    let [err, result] = await to(
      this.ajax(BASEURL + '/hotSearchWords', { latitude, longitude })
    )
    err = this.errMessage(err)

    return [err, result]
  }

  // 搜索结果
  async reqTypeaHead(value) {
    let [err, result] = await to(this.ajax(BASEURL + '/typeaHead', { value }))
    err = this.errMessage(err)

    return [err, result]
  }

  // 发现 限时抽奖
  async reqSuggest() {
    let [err, result] = await to(this.ajax(BASEURL + '/suggest'))
    err = this.errMessage(err)

    return [err, result]
  }
  // 发现
  async reqDiscover({ latitude, longitude }) {
    let [err, result] = await to(
      this.ajax(BASEURL + '/discover', { latitude, longitude })
    )
    err = this.errMessage(err)

    return [err, result]
  }

  // 支付
  async reqPay(params) {
    let [err, result] = await to(this.ajax(BASEURL + '/pay', params, 'POST'))
    err = this.errMessage(err)

    return [err, result]
  }

  // 订单列表
  async getOrder() {
    let [err, result] = await to(this.ajax(BASEURL + '/getOrder'))
    err = this.errMessage(err)

    return [err, result]
  }
  // 订单详情
  async getOrderDetail({ id }) {
    let [err, result] = await to(this.ajax(BASEURL + '/getOrderDetail', { id }))
    err = this.errMessage(err)

    return [err, result]
  }
}

export default new Ajax()

// 获取ip地址
// export const reqIpAddress = () =>
//   ajax(BASEURL + '/ip', {
//     key: 'UNZBZ-MJUKS-W76OY-6SGXP-7TIFE-AXBA3',
//   })

// 搜索城市列表
// export const reqCityList = params => ajax(BASEURL + '/city', params)

// 搜索当前城市详细地址
// export const reqAddressDetail = params => ajax(BASEURL + '/address', params)

// 首页导航
// export const reqNavList = params => ajax(BASEURL + '/navlist', params)

// 用户注册
// export const reqRegister = params => {
//   return ajax(BASEURL + '/register', params, 'POST')
// }

// 用户登录
// export const reqLogin = params => ajax(BASEURL + '/login', params, 'POST')

// 获取用户信息
// export const reqUserInfo = () => ajax(BASEURL + '/userinfo')

// 获取用户地址
// export const reqUserAddress = () => ajax(BASEURL + '/userAddress')

// 用户搜索地址
// export const reqUseSearchAddress = params =>
//   ajax(BASEURL + '/useSearchAddress', params)

// 编辑用户收货地址
// export const reqSetUserAddress = params =>
//   ajax(BASEURL + '/setUserAddress', params, 'POST')

// 添加用户收货地址
// export const reqAddUserAddress = params =>
//   ajax(BASEURL + '/addUserAddress', params, 'POST')

// 删除用户收货地址
// export const reqDelUserAddress = id => ajax(BASEURL + '/delUserAddress', id)

// 修改用户名
// export const reqSetUserName = username =>
//   ajax(BASEURL + '/setUserName', username, 'POST')

// 修改用户密码
// export const reqSetPassWord = params =>
//   ajax(BASEURL + '/setPassWord', params, 'POST')

// 获取首页筛选条数据
// export const reqGetBatchFilter = params =>
//   ajax(BASEURL + '/getBatchFilter', params)

// // 获取首页商品数据列表
// export const reqGetMsiteShopList = params =>
//   ajax(BASEURL + '/getMsiteShopList', params)

// // 商家列表头部滑动分类数据
// export const reqGetFoodsPage = ({ latitude, longitude, entry_id }) =>
//   ajax(BASEURL + '/getFoodsPage', { latitude, longitude, entry_id })

// // 商家列表头部更多分类
// export const reqGetFoodsClass = ({ latitude, longitude }) =>
//   ajax(BASEURL + '/getFoodsClass', { latitude, longitude })

// // 获取商家详情信息
// export const reqGetShop = () => ajax(BASEURL + '/getShop')

// // 获取商家评价
// export const reqEstimate = () => ajax(BASEURL + '/getEstimate')
// // 获取商家评论更多
// export const reqRatings = ({ name, offset, limit, has_content }) =>
//   ajax(BASEURL + '/getRatings', { name, offset, limit, has_content })
// // 获取商家品牌故事
// export const reqBrandStory = () => ajax(BASEURL + '/brandStory')

// // 热门搜索
// export const reqHotSearchWords = ({ latitude, longitude }) =>
//   ajax(BASEURL + '/hotSearchWords', { latitude, longitude })

// // 搜索结果
// export const reqTypeaHead = value => ajax(BASEURL + '/typeaHead', { value })

// // 发现 限时抽奖
// export const reqSuggest = () => ajax(BASEURL + '/suggest')
// // 发现
// export const reqDiscover = ({ latitude, longitude }) =>
//   ajax(BASEURL + '/discover', { latitude, longitude })

// // 支付
// export const reqPay = params => ajax(BASEURL + '/pay', params, 'POST')

// // 订单列表
// export const getOrder = () => ajax(BASEURL + '/getOrder')
// // 订单详情
// export const getOrderDetail = ({ id }) =>
//   ajax(BASEURL + '/getOrderDetail', { id })
