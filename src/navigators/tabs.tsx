import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, useColorMode} from 'native-base';
import HomeScreen from '@screens/home/home';
import MineScreen from '@screens/account/mine';

const Tab = createBottomTabNavigator();

const homeOff = require('@assets/images/home.png');
const homeOn = require('@assets/images/home_on.png');
const mineOff = require('@assets/images/user.png');
const mineOn = require('@assets/images/user_on.png');

export default function Tabs() {
  const {colorMode} = useColorMode();
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={() => ({
        tabBarActiveTintColor: '#cf7217',
        tabBarStyle: {
          backgroundColor: colorMode === 'dark' ? '#422c15' : '#fff',
        },
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: '工作台',
          headerShown: false,
          tabBarIcon: ({focused, size}) => (
            <Image
              alt="工作台"
              source={focused ? homeOn : homeOff}
              width={size}
              height={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Mine"
        component={MineScreen}
        options={{
          title: '我的',
          headerStyle: {
            backgroundColor: '#cf7217',
            borderBottomWidth: 0,
          },
          headerShadowVisible: false,
          headerTitleStyle: {
            color: colorMode === 'dark' ? '#eee' : '#fff',
          },
          tabBarIcon: ({focused, size}) => (
            <Image
              alt="我的"
              source={focused ? mineOn : mineOff}
              width={size}
              height={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
