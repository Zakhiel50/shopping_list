import { useCallback, useState } from 'react';
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
import { CardColor } from './colors';
import { SafeAreaProvider } from 'react-native-safe-area-context';



export default function App() {
  const [totalPrice, setTotalPrice] = useState<number>();
  const [historyTotalPrice, setHistoryTotalPrice] = useState<number>()

  const handleTotalPriceChange = (price: number) => {
      setTotalPrice(price);
  };

  const handleHistoryPriceChange = (price:number) => {
    setHistoryTotalPrice(price)
  }

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
        <Text style={{textAlign: 'center', paddingVertical: 10, backgroundColor: CardColor, width: '100%', color: '#fff', fontWeight:'bold', marginBottom: 10}}>
        {totalPrice && totalPrice > 0 ? 
          <Text>TOTAL: {totalPrice.toFixed(2)} €</Text>
          : null}
          </Text>
        <List onTotalPriceChange={handleTotalPriceChange} />
      </View>
    );
  }

  
  function HistoryScreen() {
    return (
      <View style={styles.container}>
        <Text style={{textAlign: 'center', paddingVertical: 10, backgroundColor: CardColor, width: '100%', color: '#fff', fontWeight:'bold', marginBottom: 10}}>
          {historyTotalPrice && historyTotalPrice > 0 ? 
          <Text>TOTAL: {historyTotalPrice.toFixed(2)} €</Text>
          : null}
          </Text>
        <Text style={styles.text}>Ticket de caisse</Text>
        <History onHistoryTotalPriceChange={handleHistoryPriceChange}/>
      </View>
    );
  }

  if (fontsLoaded) {
  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Liste') {
              iconName = 'list';
            } else if (route.name === 'Caisse') {
              iconName = 'cart';
            }

            // Vous pouvez retourner n'importe quelle icône ici!
            return <Ionicons name={iconName} size={(size)} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: { position: 'absolute', bottom: 0 },
          headerShown: false,
        })}
      >
          <Tab.Screen name="Liste" component={HomeScreen} />
        <Tab.Screen name="Caisse" component={HistoryScreen} options={{ title: 'Ticket de Caisse' }} />
      </Tab.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>
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