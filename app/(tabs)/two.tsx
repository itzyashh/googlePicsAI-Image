import { Stack } from 'expo-router';
import { useState } from 'react';
import { Button, StyleSheet, View,Image, ActivityIndicator } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

import { ScreenContent } from '~/components/ScreenContent';
import { getImagekitUrlFromPath } from '~/lib/imagekit';
import { supabase } from '~/utils/supabase';

export default function Home() {

  const onLogout = () => {
    supabase.auth.signOut();
  }

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  let ramdomId = Math.floor(Math.random() * 1000);
  const [imageKitUri, setImageKitUri] = useState()

  // const imageKitUri = getImagekitUrlFromPath(`ik-genimg-prompt-${prompt}/ai/${ramdomId}.png`, [
    
  // ]);

  const onGenerate = () => {
    if (!prompt) {
      return;
    }
    console.log('prompt', prompt);
    const res = getImagekitUrlFromPath(`ik-genimg-prompt-${prompt}/ai/${ramdomId}.png`, [
    
    ]);
    console.log('res', res);
    setImageKitUri(res);


  }

  return (
    <>
      <Stack.Screen options={{ title: 'AI Image' }} />
      <View style={styles.container}>
        <Button title="Logout" onPress={onLogout} />
        <View style={styles.container} >
      { loading ? <ActivityIndicator /> :   <Image
           onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onError={(err) => {
            setLoading(false);
            setImageKitUri(null);
            console.log('error',err);
          }}
           source={{ uri: imageKitUri }} style={{ width: '100%', aspectRatio: 1 }} />
          }
          </View>
        <View style={styles.promptContainer}>
        <TextInput
          style={styles.inputText}
          value={prompt}
          onChangeText={setPrompt}
         placeholder="Enter image prompt" />
        <Button
        title="Generate" onPress={onGenerate} />
      </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  promptContainer: {
    padding: 10,
    flexDirection: 'row',

    justifyContent: 'space-between',
  },
  inputText: {
    height: 40,
    padding: 10,
  },
});
