import React, {useState, useEffect} from 'react';
import {AppState} from 'react-native';
import {
  NativeBaseProvider,
  StorageManager,
  ColorMode,
  extendTheme,
} from 'native-base';
import SplashScreen from 'react-native-splash-screen';
import {useUserReactStore} from '@stores/userWithReact';
import Navigators from '@navigators/index';
import {SWRConfig} from 'swr';
import request from '@utils/request';
import {USER_INFO_KEY} from '@contants/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import type {AppStateStatus} from 'react-native';

const App = () => {
  const [isInit, setIsInit] = useState(false);
  const {setUserInfo} = useUserReactStore();
  const theme = extendTheme({
    colors: {
      primary: {
        50: '#fff1dd',
        100: '#fad8b5',
        200: '#f3bf89',
        300: '#eea55d',
        400: '#e88c30',
        500: '#cf7217',
        600: '#a15910',
        700: '#743e0a',
        800: '#472502',
        900: '#1d0b00',
      },
    },
  });
  NetInfo.addEventListener(state => {
    if (!state.isConnected) {
      console.log('duration');
    }
    console.log('Connection type', state.type);
    console.log('Is connected?', state.isConnected);
  });
  const colorModeManager: StorageManager = {
    get: async () => {
      try {
        let val = await AsyncStorage.getItem('@color-mode');
        return val === 'dark' ? 'dark' : 'light';
      } catch (e) {
        return 'light';
      }
    },
    set: async (value: ColorMode) => {
      console.log(value, 'value');
      try {
        await AsyncStorage.setItem('@color-mode', value as string);
      } catch (e) {
        console.log(e);
      }
    },
  };
  useEffect(() => {
    (async () => {
      const cache = await AsyncStorage.getItem(USER_INFO_KEY);
      console.log(cache, 'cachecachecache');
      if (cache) {
        try {
          const cacheInfo = JSON.parse(cache);
          setUserInfo(cacheInfo);
        } catch (error) {
          console.log(error);
        }
      }
      setIsInit(true);
      SplashScreen.hide();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <SWRConfig
      value={{
        provider: () => new Map(),
        isVisible: () => {
          return true;
        },
        initFocus(callback) {
          let appState = AppState.currentState;

          const onAppStateChange = (nextAppState: AppStateStatus) => {
            /* 如果正在从后台或非 active 模式恢复到 active 模式 */
            console.log(nextAppState, 'nextAppState');
            if (
              appState.match(/inactive|background/) &&
              nextAppState === 'active'
            ) {
              callback();
            }
            appState = nextAppState;
          };

          // 订阅 app 状态更改事件
          const subscription = AppState.addEventListener(
            'change',
            onAppStateChange,
          );

          return () => {
            subscription.remove();
          };
        },
        refreshInterval: 0,
        errorRetryCount: 5,
        dedupingInterval: 5000,
        fetcher: request,
        onError: err => {
          if (err && err.message === '402') {
            setUserInfo(null);
          }
        },
        initReconnect(callback) {
          callback();
        },
      }}>
      <NativeBaseProvider theme={theme} colorModeManager={colorModeManager}>
        {isInit && <Navigators />}
      </NativeBaseProvider>
    </SWRConfig>
  );
};
export default App;
