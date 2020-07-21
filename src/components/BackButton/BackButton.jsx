import React from 'react'
import { View, Image } from '@tarojs/components'

import './BackButton.scss'

const BackButton = ({ renderIcon, onLink, text = '返回' }) => {
  return (
    <View className='backbutton' onClick={onLink}>
      {renderIcon}
      {/* <View className='backbutton-text'>{text}</View> */}
    </View>
  )
}

export default BackButton
