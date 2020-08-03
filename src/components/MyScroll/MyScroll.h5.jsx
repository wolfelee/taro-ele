import React from 'react'
import { View } from '@tarojs/components'

import './MyScroll.scss'

const MyScroll = ({ children, ...options }) => {
  return <View className={options.className} ref={options.myRef}>{children}</View>
}

export default MyScroll
