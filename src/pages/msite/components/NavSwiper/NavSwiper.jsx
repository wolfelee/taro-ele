import Taro from '@tarojs/taro'
import React, { useState } from 'react'
import { View, Image } from '@tarojs/components'
import imgUrl from '@/src/utils/imgUrl'

import './NavSwiper.scss'

const NavSwiper = ({ navList }) => {
  const [framework] = useState(Array(10).fill(1))

  // 跳转商家列表
  const goFood = navItem => {
    const { name, id } = navItem
    Taro.redirectTo({ url: `/pages/food/index?id=${id}&name=${name}` })
  }

  return (
    <View className='navswiper'>
      {navList.length ? (
        // 导航
        <View className='navswiper-main'>
          {navList &&
            navList.map(navItem => {
              return (
                <View className='navswiper-main-item' key={navItem.id}>
                  <View onClick={() => goFood(navItem)}>
                    <View className='navswiper-main-item-image'>
                      <Image
                        className='nav-image'
                        mode='widthFix'
                        src={imgUrl(navItem.image_hash)}
                      ></Image>
                    </View>
                    <View className='navswiper-main-item-title'>
                      {navItem.name}
                    </View>
                  </View>
                </View>
              )
            })}
        </View>
      ) : (
        // 骨架
        <View className='framework'>
          {framework.map((item, i) => {
            return (
              <View className='framework-item' key={i}>
                <View className='framework-item-title'></View>
                <View className='framework-item-txt'></View>
              </View>
            )
          })}
        </View>
      )}
    </View>
  )
}
NavSwiper.defaultProps = {
  navList: [],
}

export default NavSwiper
