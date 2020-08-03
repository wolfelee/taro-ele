// 首页
import Taro, { useDidShow, useDidHide, getCurrentInstance } from '@tarojs/taro'
import React, {
  useLayoutEffect,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react'
import { View } from '@tarojs/components'
import { useSelector, useDispatch } from 'react-redux'
import _ from 'lodash'
import { H5, WEAPP } from '@/src/config/base'
import getDom from '@/src/utils/getDom'

import ajax from '@/src/api'
import { initCurrentAddress } from '@/src/redux/actions/user'
import { actionGetBatchFilter } from '@/src/redux/actions/filterShop'

import MyScroll from '@/src/components/MyScroll/MyScroll'
import FooterBar from '@/src/components/FooterBar/FooterBar'
import TipNull from '@/src/components/TipNull/TipNull'
import FilterShops from '@/src/components/FilterShops/FilterShops'
import Shop from '@/src/components/Shop/Shop'
import Loading from '@/src/components/Loading/Loading'

import MsiteHeader from './components/Header/Header'
import MsiteSelectAddress from './components/SelectAddress/SelectAddress'
import MsiteSelectCity from './components/SelectCity/SelectCity'
import MsiteSwiper from './components/NavSwiper/NavSwiper'
import MsiteAdvertising from './components/Advertising/Advertising'
import MsiteSvip from './components/Svip/Svip'

import './index.scss'

const msiteDom = document.querySelector('.msite')

if (H5) {
  var tuaScroll = require('tua-body-scroll-lock')
}

const Msite = () => {
  if (H5) {
    var router = getCurrentInstance()
  }
  // 当前用户收货地址 选条数据 用户token  商品列表参数
  const { currentAddress, batchFilter, token, shopParams } = useSelector(
    state => state
  )

  // dispatch
  const dispatch = useDispatch()
  // 导航数据
  const [navList, setNavList] = useState([])
  // 商家列表数据
  const [shopList, setShopList] = useState([])
  // 收货地址 默认:隐藏
  const [addressShow, setAddressShow] = useState(false)
  // 城市选择 默认:隐藏
  const [cityShow, setCityShow] = useState(false)
  // 初始化 商家top值
  const [initTop, setInitTop] = useState(0)
  const [top, setTop] = useState(0)
  // 请求条初始区间 + linmit
  const [offset, setOffset] = useState(0)
  // 滚动/禁止滚动
  const [weiScroll, setWeiScroll] = useState(true)
  // 节流
  const [bottomFlag, setBottomFlag] = useState(false)
  // 是否有更多商家
  const [isMore, setIsMore] = useState(true)

  const myRef = useRef()

  // 用户是否登录,是否有收货地址,是否加载商家筛选条
  const isLogin = useMemo(() => {
    return token && !!batchFilter.sort.length && currentAddress.latitude
  }, [token, batchFilter, currentAddress])

  // 收货地址 显示/隐藏
  const onSetAddressShow = flag => {
    setAddressShow(flag)
  }
  // 城市选择 显示/隐藏
  const onSetCityShow = flag => {
    setCityShow(flag)
  }

  // 重新获取城市 经纬度及城市
  const onLocationCity = useCallback(() => {
    removeOffset()
    dispatch(initCurrentAddress())
  }, [dispatch])

  // 获取导航数据
  const _getNavList = useCallback(async () => {
    const { latitude, longitude } = currentAddress
    if (latitude && longitude) {
      const [err, result] = await ajax.reqNavList({ latitude, longitude })
      if (err) {
        console.log(err)
        return
      }

      if (result.code === 0) {
        setNavList(result.data)
      } else {
        console.log(result)
      }
    }
  }, [currentAddress])

  // 获取首页筛选条数据
  const _getFilter = useCallback(() => {
    const { latitude, longitude } = currentAddress
    if (latitude && longitude && !batchFilter.sort.length) {
      dispatch(actionGetBatchFilter({ latitude, longitude }))
    }
  }, [currentAddress, batchFilter, dispatch])

  // 获取商家列表
  const _getShopList = useCallback(async () => {
    if (isLogin && isMore) {
      const [err, result] = await ajax.reqGetMsiteShopList({
        latitude: currentAddress.latitude,
        longitude: currentAddress.longitude,
        ...shopParams,
        offset,
      })

      if (err) {
        console.log(err)
        return
      }

      if (result.code === 0) {
        if (offset === 0) {
          setShopList(result.data)
        } else {
          if (result.data.length) {
            setShopList(data => [...data, ...result.data])
          } else {
            setIsMore(false)
          }
        }
        setBottomFlag(true)
        // 计算top值
        initTop || _getOptionsTop()
      } else {
        console.log(result)
      }
    }
  }, [isLogin, shopParams, currentAddress, offset, isMore, initTop])

  // 清空offset 没用更多提示
  const removeOffset = () => {
    setOffset(0)
    setIsMore(true)
  }

  useEffect(() => {
    _getNavList()
  }, [_getNavList])

  useEffect(() => {
    _getFilter()
  }, [_getFilter])

  useEffect(() => {
    _getShopList()
  }, [_getShopList])

  // 跳转登录
  const goLogin = () => {
    Taro.redirectTo({ url: '/pages/login/index' })
  }

  // #filtershops 计算top值
  const _getOptionsTop = async () => {
    const result = await getDom('#filtershops')
    const domTop = result[0][0].top
    setInitTop(domTop)
  }

  // 获取筛选据顶部距离
  // useEffect(() => {
  //   if (H5) {
  //     const filterDom = document.querySelector('#filtershops')
  //     setInitTop(filterDom?.offsetTop)
  //     console.log('h5', filterDom?.offsetTop)
  //   }
  // }, [batchFilter])

  // 设置滚动条位置和禁止滚动,每次要不同值否则无效,
  const onFilterTop = () => {
    const myInitTop = initTop + 0.1
    if (initTop === top) {
      setTop(myInitTop)
    } else {
      setTop(myInitTop - 0.1)
    }
    if (H5) {
      window.scrollTo(0, myInitTop)
    }
  }

  // 禁止滚动
  const weSetScroll = flag => {
    if (H5) {
      setTimeout(() => {
        if (flag) {
          tuaScroll.unlock(msiteDom)
        } else {
          tuaScroll.lock(msiteDom)
        }
      }, 0)
    }
    setWeiScroll(flag)
  }

  // 滚动到底部加载更多商家列表
  const scrolltolower = () => {
    if (bottomFlag && isLogin && isMore) {
      setOffset(num => {
        return num + shopParams.limit
      })
      setBottomFlag(false)
    }
  }

  if (H5) {
    const scorllTest = useCallback(
      _.throttle(() => {
        const { scrollHeight } = myRef.current
        const myScrollTop =
          document.documentElement.scrollTop ||
          document.body.scrollTop ||
          window.pageYOffset
        const myHeight =
          window.innerHeight ||
          document.documentElement.clientHeight ||
          document.body.clientHeight

        // 未滚动到底部
        if (scrollHeight - myHeight > myScrollTop) {
          return
        } else {
          if (bottomFlag && isLogin && isMore) {
            //更新offset
            setOffset(num => {
              return num + shopParams.limit
            })
            setBottomFlag(false)
          }
        }
      }, 200),

      [bottomFlag, isLogin, isMore, shopParams]
    )

    useLayoutEffect(() => {
      if (router.app.config && router.app.config.router) {
        if (router.app.config.router.pathname === '/pages/msite/index') {
          document.addEventListener('scroll', scorllTest, false)
        }
      }
      return () => {
        document.removeEventListener('scroll', scorllTest, false)
        tuaScroll.unlock(msiteDom)
      }
    }, [scorllTest, router])
    useDidShow(() => {
      document.addEventListener('scroll', scorllTest, false)
    })
    useDidHide(() => {
      document.removeEventListener('scroll', scorllTest, false)
      tuaScroll.unlock(msiteDom)
    })
  }
  return (
    <MyScroll
      scrollY={weiScroll}
      scrollTop={top}
      className='msite'
      lowerThreshold={100}
      onScrollToLower={scrolltolower}
      myRef={myRef}
    >
      <View className='msite-main'>
        {/* 头部地址,搜索 */}
        <MsiteHeader
          onSetAddressShow={onSetAddressShow}
          currentAddress={currentAddress}
        />

        {/* switch 导航 */}
        <MsiteSwiper navList={navList} />

        {/* 广告 */}
        <MsiteAdvertising
          title='品质套餐'
          detail='搭配齐全吃得好'
          img='https://cube.elemecdn.com/e/ee/df43e7e53f6e1346c3fda0609f1d3png.png'
          url='/pages/ranking'
        />

        {/* Svip */}
        <MsiteSvip />

        <View className='list-title'>推荐商家</View>
        {/*登录渲染商家筛选及列表 */}
        {isLogin && (
          <View className='options'>
            <FilterShops
              batchFilter={batchFilter}
              onFilterTop={onFilterTop}
              weSetScroll={weSetScroll}
              onRemoveOffset={removeOffset}
            />
            <View className='shop-list'>
              {shopList.map(shop => {
                return (
                  <Shop key={shop.restaurant.id} restaurant={shop.restaurant} />
                )
              })}
              <Loading
                title={isMore ? '加载中...' : '没有更多了'}
                icon={isMore}
              />
            </View>
          </View>
        )}

        {/* 无收货地址 */}
        {!currentAddress.city && (
          <TipNull
            img='//fuss10.elemecdn.com/2/67/64f199059800f254c47e16495442bgif.gif'
            title='输入地址后才能订餐哦!'
            buttonText='手动选择地址'
            onButtonClick={() => onSetAddressShow(true)}
          />
        )}

        {/* 未登录提示登录*/}
        {!isLogin && currentAddress.city && (
          <TipNull
            img='//fuss10.elemecdn.com/d/60/70008646170d1f654e926a2aaa3afpng.png'
            title='没有结果'
            contentText='登录后查看更多商家'
            buttonText='登录'
            onButtonClick={goLogin}
          />
        )}

        {/* 选择收货地址 */}
        <MsiteSelectAddress
          addressShow={addressShow}
          onSetAddressShow={onSetAddressShow}
          onSetCityShow={onSetCityShow}
          onLocationCity={onLocationCity}
          onRemoveOffset={removeOffset}
        />

        {/* 选择城市 */}
        <MsiteSelectCity
          cityShow={cityShow}
          onSetCityShow={onSetCityShow}
          onRemoveOffset={removeOffset}
        />
      </View>
      {/* 底部bar */}
      <FooterBar />
    </MyScroll>
  )
}

export default Msite
