import { Stack } from 'expo-router';
import { Dimensions, FlatList,StyleSheet, Text, View } from 'react-native';

import { ScreenContent } from '~/components/ScreenContent';
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useState } from 'react';
import { Image } from 'expo-image';


const ScreenWidth = Dimensions.get('window').width;

export default function Home() {
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  const [localAssets, setLocalAssets] = useState<MediaLibrary.Asset[]>([]);

  useEffect(() => {
    if (permissionResponse?.status !== 'granted') {
      requestPermission();
    }

  }, []);

  useEffect(() => {

    if (permissionResponse?.status === 'granted') {
      loadLocalAssets();
    }

  }, [permissionResponse]);

  const loadLocalAssets = async () => {
    const assetsPage = await MediaLibrary.getAssetsAsync()
    console.log(JSON.stringify(assetsPage, null, 2));
    setLocalAssets(assetsPage.assets);
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Photos' }} />
      <FlatList
        data={localAssets}
        numColumns={4}
        keyExtractor={(item) => item.id}
        columnWrapperClassName='gap-[1px]'
        contentContainerClassName='gap-[1px]'
        renderItem={({ item }) => (
          <View style={{}}>
            <Image
              source={{ uri: item.uri }}
              style={{ width: ScreenWidth /4, aspectRatio: 1 }}
            />
          </View>
        )}
        />
        <Text>Total assets: {localAssets.length}</Text>
    </>
  );
}

