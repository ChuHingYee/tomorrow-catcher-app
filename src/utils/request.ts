import axios, {AxiosRequestConfig} from 'axios';
import {RefreshToken} from '@apis/users';
import {useUserStore} from '@stores/user';
import Config from 'react-native-config';
export interface CustomAxiosConfig extends AxiosRequestConfig {
  hasToken?: boolean;
}
// create an axios instance
const service = axios.create({
  timeout: 100000, // request timeout
  baseURL: Config.API_BASE,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
});
let refreshTokenRequest = null as null | Promise<any>;

const handleErr = async (error: any) => {
  console.log(error);
  const {getState} = useUserStore;
  const userState = getState();
  const {response} = error;
  if (response) {
    if (response.status === 401) {
      if (response.config.url !== '/api/user/refresh') {
        await refreshToken();
        return Promise.resolve({success: true});
      } else {
        refreshTokenRequest = null;
        userState.logout();
      }
    }
  }
  return Promise.reject(error);
};

/**
 * 更新token
 */
const refreshToken = async () => {
  const {getState} = useUserStore;
  const userState = getState();
  const userInfo = userState.userInfo;
  if (userInfo) {
    if (!refreshTokenRequest) {
      refreshTokenRequest = RefreshToken({
        _id: userInfo.id,
        token: userInfo.refreshToken,
      });
    }
    const refreshResult = await refreshTokenRequest;
    if (refreshResult) {
      userInfo.token = refreshResult.token;
      userInfo.refreshToken = refreshResult.refreshToken;
      userState.setUserInfo(userInfo);
    }
    refreshTokenRequest = null;
    return Promise.reject('refresh-success');
  }
};

service.interceptors.request.use(async config => {
  const {hasToken, ...rest} = config as CustomAxiosConfig;
  config = {
    ...rest,
  };
  const {getState} = useUserStore;
  if (hasToken) {
    const userState = getState();
    const userInfo = userState.userInfo;
    if (userInfo) {
      rest.headers!.Authorization = `Bearer ${userInfo.token}`;
    }
  }
  return rest;
}, handleErr);

service.interceptors.response.use(response => {
  return response;
}, handleErr);

export default function request<T>(config: CustomAxiosConfig) {
  return new Promise<T>(async (resolve, reject) => {
    try {
      const result = await service(config);
      if (result.status === 200) {
        resolve(result.data.data);
      } else {
        reject(result);
      }
    } catch (error) {
      if (error === 'refresh-success') {
        resolve(request({...config}));
      } else {
        reject(error);
      }
    }
  });
}
