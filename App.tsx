import { useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import History from './components/History';
import List from './components/List';

const Tab = createBottomTabNavigator();

import {
  Raleway_400Regular,
  Raleway_600SemiBold,
  Raleway_700Bold,
  useFonts,
} from '@expo-google-fonts/raleway';
import { Arimo_400Regular,
  Arimo_500Medium,
  Arimo_700Bold 
} from '@expo-google-fonts/arimo';
import { Ionicons } from '@expo/vector-icons';



export default function App() {
  const [fontsLoaded] = useFonts({
    Raleway_400Regular,
    Raleway_600SemiBold,
    Raleway_700Bold,
    Arimo_400Regular, 
    Arimo_500Medium, 
    Arimo_700Bold
  });
  
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  function HomeScreen() {
    return (
      <View style={styles.container}>
        <List/>
      </View>
    );
  }
  
  function HistoryScreen() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Historique</Text>
        <History/>
      </View>
    );
  }

  if (fontsLoaded) {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'History') {
              iconName = 'time';
            }

            // Vous pouvez retourner n'importe quelle icône ici!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: { position: 'absolute', bottom: 0 },
          headerShown: false,
        })}
      >
          <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="History" component={HistoryScreen} options={{ title: 'Historique' }} />
      </Tab.Navigator>
    <View style={styles.container}>
      <StatusBar style="auto" />
    </View>
    </NavigationContainer>
  );
}
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50
  },
  text: {
    fontSize: 20,
  },
});