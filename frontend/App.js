import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from './src/context/authStore';
import * as SecureStore from 'expo-secure-store';

// Screen imports
import AuthNavigator from './src/navigation/AuthNavigator';
import MainNavigator from './src/navigation/MainNavigator';
import SplashScreen from './src/screens/auth/SplashScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const { isLoggedIn, setIsLoggedIn, loading, setLoading } = useAuthStore();

  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (token) {
        setIsLoggedIn(true);
      }
    } catch (e) {
      // Restoring token failed
      console.log('Failed to restore token:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Stack.Screen
            name="MainApp"
            component={MainNavigator}
            options={{
              animationEnabled: false
            }}
          />
        ) : (
          <Stack.Screen
            name="Auth"
            component={AuthNavigator}
            options={{
              animationEnabled: false
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
