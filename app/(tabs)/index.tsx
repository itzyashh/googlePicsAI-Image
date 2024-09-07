import { Link, Stack } from 'expo-router';
import { Dimensions, FlatList, Text, TouchableOpacity, View } from 'react-native';

import { Image } from 'expo-image';
import { useMedia } from '~/providers/MediaProvider';


const ScreenWidth = Dimensions.get('window').width;

export default function Home() {

  const {localAssets, loadLocalAssets, hasNextPage} = useMedia();


  return (
    <>
      <Stack.Screen options={{ title: 'Photos' }} />
      <FlatList
        data={localAssets}
        numColumns={4}
        keyExtractor={(item) => item.id}
        onEndReached={loadLocalAssets}
        onEndReachedThreshold={0.5}
        columnWrapperClassName='gap-[1px]'
        contentContainerClassName='gap-[1px]'
        renderItem={({ item }) => (
          <Link href={`/asset?id=${item.id}`} asChild>
            <TouchableOpacity >
            <Image
              source={{ uri: item.uri }}
              style={{ width: ScreenWidth /4, aspectRatio: 1 }}
              />
              </TouchableOpacity>
          </Link>
        )}
        />
     { hasNextPage &&  <Text onPress={loadLocalAssets} className='text-center'>Load more</Text>}
        <Text>Total assets: {localAssets.length}</Text>
    </>
  );
}

