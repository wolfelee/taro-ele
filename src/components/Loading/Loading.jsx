// 加载组件
import React from 'react'
import { View, Text } from '@tarojs/components'

import './Loading.scss'

const Loading = ({ title = '加载中...', icon }) => {
  return (
    <View className='loading'>
      {icon && (
        <View className='loading-rotate'>
          <Text className='icon icon-jiazailoading loading-rotate-icon'></Text>
        </View>
      )}
      <View className='loading-title'>{title}</View>
    </View>
  )
}

export default Loading
