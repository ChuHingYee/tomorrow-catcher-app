import create from 'zustand/vanilla';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {USER_INFO_KEY} from '../contants';
import {Login} from '@apis/users';

export interface UserStore {
  isLogining: boolean;
  userInfo: API.LoginResponse | null;
  login: (params: API.LoginParams) => Promise<API.LoginResponse>;
  logout: () => Promise<null>;
  setUserInfo: (params: API.LoginResponse | null, flag?: boolean) => void;
  setIsLogining: () => void;
}

export const useUserStore = create<UserStore>(set => ({
  isLogining: false,
  userInfo: null,
  setIsLogining: () =>
    set(state => {
      state.isLogining = !state.isLogining;
    }),
  setUserInfo: async (data: API.LoginResponse | null, flag = true) => {
    console.log(data);
    set(state => {
      state.userInfo = data;
    });
    if (flag) {
      await AsyncStorage.setItem(USER_INFO_KEY, JSON.stringify(data));
    }
  },
  login: (params: API.LoginParams) => {
    set(state => {
      state.isLogining = true;
    });
    return new Promise((resolve, reject) => {
      Login({
        account: params.account,
        password: params.password,
      })
        .then(async res => {
          set(state => {
            state.userInfo = res;
          });
          await AsyncStorage.setItem(USER_INFO_KEY, JSON.stringify(res));
          resolve(res);
        })
        .catch(err => {
          reject(err);
        })
        .finally(() => {
          set(state => {
            state.isLogining = false;
          });
        });
    });
  },
  logout: () => {
    return new Promise(async resolve => {
      set(state => {
        state.userInfo = null;
      });
      await AsyncStorage.setItem(USER_INFO_KEY, JSON.stringify(null));
      resolve(null);
    });
  },
}));
