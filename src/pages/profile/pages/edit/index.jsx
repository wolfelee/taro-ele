// 编辑地址
import Taro from '@tarojs/taro'
import React from 'react'
import { View } from '@tarojs/components'
import { useSelector } from 'react-redux'
import ajax from '@/src/api'
import NavBar from '@/src/components/NavBar/NavBar'
import UserAddress from '@/src/components/UserAddress/UserAddress'
import './index.scss'

const ProfileAddressEdit = () => {
  const userAddress = useSelector(state => state.userAddress)

  // 获取修改的数据
  const onForm = async myAddress => {
    const [err, result] = await ajax.reqSetUserAddress(myAddress)
    
    if (err) {
      console.log(err)
      return
    }

    if (result.code === 0) {
      Taro.navigateTo({ url: '/pages/profile/pages/address/index' })
    } else {
      console.log(result)
      Taro.showToast({ title: result.message, icon: 'none' })
    }
  }

  return (
    <View className='edit'>
      {process.env.TARO_ENV === 'h5' && <NavBar title='编辑地址' />}
      <UserAddress userAddress={userAddress} onForm={onForm} />
    </View>
  )
}

export default ProfileAddressEdit
