// 选择收货地址
import Taro, { useDidShow } from '@tarojs/taro'
import React, { useState, useRef, useMemo } from 'react'
import { View, ScrollView } from '@tarojs/components'
import classnames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import {
  getUserAddressList,
  setCurrentAddress,
  removeUserAddress,
} from '@/src/redux/actions/user'
import ajax from '@/src/api'
import NavBar from '@/src/components/NavBar/NavBar'

import SelectAddressSearch from '../SelectAddressSearch/SelectAddressSearch'
import SelectAddressResult from '../SelectAddressResult/SelectAddressResult'
import SelectAddressAtAddress from '../SelectAddressAtAddress/SelectAddressAtAddress'
import SelectAddressProfile from '../SelectAddressProfile/SelectAddressProfile'
import './SelectAddress.scss'

const SelectAddress = ({
  addressShow,
  onSetAddressShow,
  onSetCityShow,
  onLocationCity,
  onRemoveOffset,
}) => {
  const dispatch = useDispatch()
  // 当前地址
  const currentAddress = useSelector(state => state.currentAddress)
  // 收货地址列表
  const userAddressList = useSelector(state => state.userAddressList)

  // 搜索关键字
  const [searchValue, setSearchValue] = useState('')
  // 搜索地址列表
  const [detailList, setDetailList] = useState([])
  // 定时器
  const timeRef = useRef(null)

  // 搜索详细地址
  const onSearchValue = e => {
    let { value } = e.detail
    clearTimeout(timeRef.current)
    if (!value.trim()) {
      return onInitDetail()
    }
    timeRef.current = setTimeout(() => {
      setSearchValue(value)
      getDetila(value)
    }, 250)
  }

  // 发送请求获取详细地址
  const getDetila = async value => {
    const { latitude, longitude } = currentAddress
    const [err, result] = await ajax.reqAddressDetail({
      keyword: value,
      offset: 0,
      limit: 20,
      latitude,
      longitude,
    })

    if (err) {
      console.log(err)
      return
    }
    
    if (result.code === 0) {
      setDetailList(result.data)
    } else {
      console.log(result)
      Taro.showToast({ title: result.message, icon: 'none' })
    }
  }

  // 初始化搜索状态
  const onInitDetail = () => {
    // 清空搜索内容
    setSearchValue('')
    // 清空列表数据
    setDetailList([])
  }

  // 打开选择城市 && 初始化状态
  const onOpenCity = () => {
    onInitDetail()
    onSetCityShow(true)
  }

  // 保存选择收货地址
  const onSaveAddress = detail => {
    const { name, latitude, longitude } = detail
    //商家列表更新参数 更新收货地址
    onRemoveOffset()
    dispatch(
      setCurrentAddress({
        address: name,
        latitude,
        longitude,
      })
    )

    onInitDetail()
    // 关闭选择收货地址
    onSetAddressShow(false)
  }

  useDidShow(() => {
    dispatch(getUserAddressList())
  })

  // 当前地址
  const atAddress = useMemo(() => {
    if (currentAddress) {
      if (!currentAddress.city && !currentAddress.address) {
        return '未能获取地址'
      }
      return currentAddress.address
    }
  }, [currentAddress])

  // 跳转到新增地址
  const onAddAddress = () => {
    dispatch(removeUserAddress())
    Taro.navigateTo({ url: '/pages/profile/pages/add/index' })
  }

  // 用户选择地址
  const handleUserAddress = userAddress => {
    // 商家列表更新参数  关闭选择收货地址
    onSetAddressShow(false)
    onRemoveOffset()
    dispatch(setCurrentAddress(userAddress))
  }

  return (
    <ScrollView
      scrollY
      className={classnames('selectaddress', {
        end: addressShow,
        start: !addressShow,
      })}
    >
      {/* navbar */}
      <NavBar
        onClose={onSetAddressShow}
        title='选择收货地址'
        renderRight={
          <View className='add' onClick={onAddAddress}>
            新增地址
          </View>
        }
      ></NavBar>

      {/* 选择城市,搜索地址 */}
      <SelectAddressSearch
        currentAddress={currentAddress}
        searchValue={searchValue}
        onOpenCity={onOpenCity}
        onSearchValue={onSearchValue}
        onInitDetail={onInitDetail}
      />

      {/* 搜索地址 */}
      <SelectAddressResult
        detailList={detailList}
        onSaveAddress={onSaveAddress}
      />

      {/* 当前地址 */}
      <SelectAddressAtAddress
        atAddress={atAddress}
        onLocationCity={onLocationCity}
      />

      {/* 收货地址 */}
      {userAddressList.length > 0 && (
        <SelectAddressProfile
          userAddressList={userAddressList}
          onClick={handleUserAddress}
        />
      )}
    </ScrollView>
  )
}

SelectAddress.defaultProps = {
  addressShow: false,
  address: {},
  onSetAddressShow: () => {},
  onSetCityShow: () => {},
  onLocationCity: () => {},
  setCurrentAddress: () => {},
}

export default SelectAddress
