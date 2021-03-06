import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '@screens/auth/login';
import SettingScreen from '@screens/account/setting';
import UpdatePasswordScreen from '@screens/account/updatePassword';
import Tabs from './tabs';
import AppsListScreen from '@screens/apps/list';
import UsersListScreen from '@screens/users/list';
import LogsListScreen from '@screens/logs/list';
import LogDetailScreen from '@screens/logs/detail';
import ChartLogScreen from '@screens/charts/log';

import {useUserReactStore} from '@stores/userWithReact';

export type RootStackParamList = {
  SignIn: undefined;
  Home: undefined;
  Tabs: undefined;
  Setting: undefined;
  Users: undefined;
  Apps: undefined;
  Logs: undefined;
  LogDetail: {id: string};
  Charts: undefined;
  UpdatePassword: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

const Navigators = () => {
  const {userInfo} = useUserReactStore();
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{headerBackTitle: 'θΏε'}}>
        {!userInfo
          ? [
              <RootStack.Screen
                key="SignIn"
                name="SignIn"
                component={LoginScreen}
                options={{
                  title: 'η»ι',
                  headerTintColor: '#fff',
                  headerStyle: {backgroundColor: '#cf7217'},
                  headerShadowVisible: false,
                  // When logging out, a pop animation feels intuitive
                  // animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                }}
              />,
            ]
          : [
              <RootStack.Screen
                key="Tabs"
                name="Tabs"
                component={Tabs}
                options={{
                  headerShown: false,
                }}
              />,
              <RootStack.Screen
                key="Users"
                name="Users"
                component={UsersListScreen}
                options={{
                  title: 'η¨ζ·η?‘η',
                }}
              />,
              <RootStack.Screen
                key="Apps"
                name="Apps"
                component={AppsListScreen}
                options={{
                  title: 'εΊη¨η?‘η',
                }}
              />,
              <RootStack.Screen
                key="Logs"
                name="Logs"
                component={LogsListScreen}
                options={{
                  title: 'ζ₯εΏη?‘η',
                }}
              />,
              <RootStack.Screen
                key="LogDetail"
                name="LogDetail"
                component={LogDetailScreen}
                options={{
                  title: 'ζ₯εΏθ―¦ζ',
                }}
              />,
              <RootStack.Screen
                key="Charts"
                name="Charts"
                component={ChartLogScreen}
                options={{
                  title: 'ζ₯εΏη»θ?‘',
                }}
              />,
              <RootStack.Screen
                key="Setting"
                name="Setting"
                component={SettingScreen}
                options={{
                  title: 'θ?Ύη½?',
                }}
              />,
              <RootStack.Screen
                key="UpdatePassword"
                name="UpdatePassword"
                component={UpdatePasswordScreen}
                options={{
                  title: 'δΏ?ζΉε―η ',
                }}
              />,
            ]}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
export default Navigators;
