import { View, Text } from 'react-native'
import React from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import { useMedia } from '~/providers/MediaProvider'
import { Image, ImageBackground } from 'expo-image'
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { useHeaderHeight } from '@react-navigation/elements'
import { useAuth } from '~/providers/AuthProvider'
import { getImagekitUrlFromPath } from '~/lib/imagekit'
const Page = () => {


    const {id} = useLocalSearchParams<{id: string}>()
    const {findAsset, uploadAsset} = useMedia()
    const asset = findAsset(id)

    const { user } = useAuth()
    
    const imageKitUrl = getImagekitUrlFromPath(`/${user?.id}/${asset?.filename}`, [])

    console.log('imageKitUrl', imageKitUrl)


  return (
    <ImageBackground
    source={{ uri: asset?.uri }}
    blurRadius={100}
    style={{ paddingTop: useHeaderHeight()}}
    className='flex-1 items-center justify-center'>
        <Stack.Screen options={{ 
            headerRight: () => <SimpleLineIcons name='cloud-upload' size={24} color='white' onPress={() =>{
                if(asset){
                    uploadAsset?.(asset)
                }
            }} />,
         }} />
        <Image
         contentFit='contain'
         source={{ uri: asset?.uri }} style={{ width: '100%', height: '100%' }} />
    </ImageBackground>
  )
}

export default Page