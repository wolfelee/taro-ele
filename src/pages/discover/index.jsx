// 发现
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { View, Image, Text } from '@tarojs/components'
import ajax from '@/src/api'
import FooterBar from '@/src/components/FooterBar/FooterBar'
import imgUrl from '@/src/utils/imgUrl'
import Prize from './components/Prize/Prize'

import './index.scss'

const Discover = () => {
  const { latitude, longitude } = useSelector(data => data.currentAddress)
  const [discover, setDiscover] = useState([])
  const [suggests, setSuggests] = useState([])

  useEffect(() => {
    if (latitude && longitude) {
      Promise.all([
        // 活动
        ajax.reqDiscover({ latitude, longitude }),
        // 限时好礼
        ajax.reqSuggest(),
      ]).then(resArr => {
        // 解构
        const [resDiscover, resSuggest] = resArr
        const [discoverErr, discoverData] = resDiscover
        const [suggestErr, suggestData] = resSuggest

        if (discoverErr || suggestErr) {
          return
        }

        if (discoverData?.code === 0) {
          setDiscover(discoverData.data['1'])
        } else {
          console.log(discoverData)
        }

        if (suggestData?.code === 0) {
          setSuggests(suggestData.data)
        } else {
          console.log(suggestData)
        }
      })
    }
  }, [latitude, longitude])

  return (
    <View className='discover'>
      <View className='discover-main'>
        {discover.map(item => {
          return (
            <View key={item.id} className='discover-item'>
              <View className='discover-left'>
                <View
                  className='discover-title'
                  style={{ color: item.title_color }}
                >
                  {item.title}
                </View>
                <View className='discover-discover-subtitle'>
                  {item.subtitle}
                </View>
              </View>
              <Image
                src={imgUrl(item.main_pic_hash)}
                className='discover-img'
              />
            </View>
          )
        })}
      </View>
      <View className='suggest'>
        <View className='suggest-head'>
          <View className='suggest-head-title'>
            <View className='striping'></View>
            <View className='icon icon-icon-test'></View>
            <View className='title'>限时好礼</View>
            <View className='striping'></View>
          </View>
          <View className='tip'>金币换豪礼</View>
        </View>
        <View className='suggest-main'>
          {suggests.map((suggest, i) => {
            return <Prize key={suggest.title + i} suggest={suggest} />
          })}
          <View className='suggest-more'>
            查看更多<Text className='icon icon-jiantou1'></Text>
          </View>
        </View>
      </View>
      <FooterBar />
    </View>
  )
}

export default Discover
