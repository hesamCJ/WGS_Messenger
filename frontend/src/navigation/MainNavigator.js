import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Screen imports
import ChatsScreen from '../screens/main/ChatsScreen';
import ChatDetailScreen from '../screens/main/ChatDetailScreen';
import CallsScreen from '../screens/main/CallsScreen';
import StoriesScreen from '../screens/main/StoriesScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import SearchScreen from '../screens/main/SearchScreen';
import CreateGroupScreen from '../screens/main/CreateGroupScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ChatsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
          shadowColor: 'transparent'
        },
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18
        },
        headerTitleAlign: 'center'
      }}
    >
      <Stack.Screen
        name="ChatsList"
        component={ChatsScreen}
        options={{ title: 'Chats' }}
      />
      <Stack.Screen
        name="ChatDetail"
        component={ChatDetailScreen}
        options={({ route }) => ({
          title: route.params?.chatName || 'Chat'
        })}
      />
      <Stack.Screen
        name="CreateGroup"
        component={CreateGroupScreen}
        options={{ title: 'New Group' }}
      />
    </Stack.Navigator>
  );
};

const CallsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
          shadowColor: 'transparent'
        }
      }}
    >
      <Stack.Screen
        name="CallsList"
        component={CallsScreen}
        options={{ title: 'Calls' }}
      />
    </Stack.Navigator>
  );
};

const StoriesStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
          shadowColor: 'transparent'
        }
      }}
    >
      <Stack.Screen
        name="StoriesList"
        component={StoriesScreen}
        options={{ title: 'Stories' }}
      />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
          shadowColor: 'transparent'
        }
      }}
    >
      <Stack.Screen
        name="ProfileSettings"
        component={ProfileScreen}
        options={{ title: 'Settings' }}
      />
    </Stack.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0084ff',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#eee',
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5
        }
      }}
    >
      <Tab.Screen
        name="Chats"
        component={ChatsStack}
        options={{
          tabBarLabel: 'Chats',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="message" color={color} size={size} />
          )
        }}
      />
      <Tab.Screen
        name="Calls"
        component={CallsStack}
        options={{
          tabBarLabel: 'Calls',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="phone" color={color} size={size} />
          )
        }}
      />
      <Tab.Screen
        name="Stories"
        component={StoriesStack}
        options={{
          tabBarLabel: 'Stories',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="circle" color={color} size={size} />
          )
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          )
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
