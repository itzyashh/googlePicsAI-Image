import { Stack } from 'expo-router';
import { Button, StyleSheet, View } from 'react-native';

import { ScreenContent } from '~/components/ScreenContent';
import { supabase } from '~/utils/supabase';

export default function Home() {

  const onLogout = () => {
    supabase.auth.signOut();
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Tab Two' }} />
      <View style={styles.container}>
        <Button title="Logout" onPress={onLogout} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
