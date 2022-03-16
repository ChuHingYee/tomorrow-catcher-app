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
      <RootStack.Navigator screenOptions={{headerBackTitle: '返回'}}>
        {!userInfo
          ? [
              <RootStack.Screen
                key="SignIn"
                name="SignIn"
                component={LoginScreen}
                options={{
                  title: '登陆',
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
                  title: '用户管理',
                }}
              />,
              <RootStack.Screen
                key="Apps"
                name="Apps"
                component={AppsListScreen}
                options={{
                  title: '应用管理',
                }}
              />,
              <RootStack.Screen
                key="Logs"
                name="Logs"
                component={LogsListScreen}
                options={{
                  title: '日志管理',
                }}
              />,
              <RootStack.Screen
                key="LogDetail"
                name="LogDetail"
                component={LogDetailScreen}
                options={{
                  title: '日志详情',
                }}
              />,
              <RootStack.Screen
                key="Charts"
                name="Charts"
                component={ChartLogScreen}
                options={{
                  title: '日志统计',
                }}
              />,
              <RootStack.Screen
                key="Setting"
                name="Setting"
                component={SettingScreen}
                options={{
                  title: '设置',
                }}
              />,
              <RootStack.Screen
                key="UpdatePassword"
                name="UpdatePassword"
                component={UpdatePasswordScreen}
                options={{
                  title: '修改密码',
                }}
              />,
            ]}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
export default Navigators;
