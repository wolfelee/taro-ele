import React from 'react'
import { ScrollView } from '@tarojs/components'

import './MyScroll.scss'

const MyScroll = ({ children, ...options }) => {
  return <ScrollView {...options}>{children}</ScrollView>
}

export default MyScroll
