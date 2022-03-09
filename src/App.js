/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// import FlashMessage from 'react-native-flash-message';

import WelcomeScreen from './screens/welcome';
import ChatCreateScreen from './screens/chat-create';

import {colors} from './assets/themes';

const Stack = createNativeStackNavigator();
export const routes = {
  Welcome: {
    name: 'welcome',
    title: 'Welcome',
  },
  ChatList: {
    name: 'chat-list',
    title: 'Chat List',
  },
  ChatRoom: {
    name: 'chat-room',
    title: 'Chat Room',
  },
  ChatCreat: {
    name: 'chat-create',
    title: 'New Channel',
  },
};

function HomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
      }}>
      <Text>Home Screen</Text>
    </View>
  );
}

const App: () => Node = () => {
  const screenOptions = title => ({
    title,
    headerStyle: {
      backgroundColor: colors.amaranth,
    },
    headerTintColor: colors.white,
    headerTitleStyle: {
      fontWeight: '700',
    },
  });

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* <Stack.Screen
          name={routes.Welcome.name}
          options={screenOptions(routes.Welcome.title)}
          component={WelcomeScreen}
        /> */}
        <Stack.Screen
          name={routes.ChatCreat.name}
          options={screenOptions(routes.ChatCreat.title)}
          component={ChatCreateScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
