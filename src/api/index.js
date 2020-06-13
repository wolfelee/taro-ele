import ajax from './request'

let BASEURL
if (process.env.TARO_ENV === 'h5') {
  BASEURL = '/api'
} else if (process.env.TARO_ENV === 'weapp') {
  BASEURL = 'http://localhost:4000/api'
}
// 获取ip地址
export const reqIpAddress = () =>
  ajax(BASEURL + '/ip', {
    key: 'UNZBZ-MJUKS-W76OY-6SGXP-7TIFE-AXBA3',
  })

// 搜索城市列表
export const reqCityList = params => ajax(BASEURL + '/city', params)

// 搜索当前城市详细地址
export const reqAddressDetail = params => ajax(BASEURL + '/address', params)

// 首页导航
export const reqNavList = params => ajax(BASEURL + '/navlist', params)

// 用户注册
export const reqRegister = params => {
  return ajax(BASEURL + '/register', params, 'POST')
}

// 用户登录
export const reqLogin = params => ajax(BASEURL + '/login', params, 'POST')

// 获取用户信息
export const reqUserInfo = () => ajax(BASEURL + '/userinfo')

// 获取用户地址
export const reqUserAddress = () => ajax(BASEURL + '/userAddress')

// 用户搜索地址
export const reqUseSearchAddress = params =>
  ajax(BASEURL + '/useSearchAddress', params)

// 编辑用户收货地址
export const reqSetUserAddress = params =>
  ajax(BASEURL + '/setUserAddress', params, 'POST')

// 添加用户收货地址
export const reqAddUserAddress = params =>
  ajax(BASEURL + '/addUserAddress', params, 'POST')

// 删除用户收货地址
export const reqDelUserAddress = id => ajax(BASEURL + '/delUserAddress', id)

// 修改用户名
export const reqSetUserName = username =>
  ajax(BASEURL + '/setUserName', username, 'POST')

// 修改用户密码
export const reqSetPassWord = params =>
  ajax(BASEURL + '/setPassWord', params, 'POST')

// 获取首页筛选条数据
export const reqGetBatchFilter = params =>
  ajax(BASEURL + '/getBatchFilter', params)

// 获取首页商品数据列表
export const reqGetMsiteShopList = params =>
  ajax(BASEURL + '/getMsiteShopList', params)
