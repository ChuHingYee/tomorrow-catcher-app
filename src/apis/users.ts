import request from '../utils/request';

/**
 * 登录
 */
export const Login = (data: API.LoginParams) => {
  console.log(data);
  return request<API.LoginResponse>({
    url: '/api/user/login',
    method: 'post',
    data,
  });
};

/**
 * 刷新Token
 */
export const RefreshToken = (data: API.RefreshTokenParams) => {
  return request<API.RefreshTokenResponse>({
    url: '/api/user/refresh',
    method: 'post',
    data,
  });
};

/**
 * 更改密码
 */
export const UpdatePassword = (data: API.UpdatePasswordParams) => {
  return request({
    url: '/api/user/password',
    method: 'put',
    data,
    hasToken: true,
  });
};

/**
 * 切换应用状态
 * @param params
 * @returns
 */
export const UpdateUserStatus = (data: API.UpdateUserStatusParams) => {
  return request({
    url: '/api/user/status',
    method: 'put',
    data,
    hasToken: true,
  });
};
