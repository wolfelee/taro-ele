import React from 'react'
import { View } from '@tarojs/components'

import './BackButton.scss'

const BackButton = ({ renderIcon, onLink }) => {
  return (
    <View className='backbutton' onClick={onLink}>
      {renderIcon}
    </View>
  )
}

export default BackButton
