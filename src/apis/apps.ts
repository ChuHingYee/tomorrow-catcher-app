import request from '../utils/request';

/**
 * 修改应用
 * @param params
 * @returns
 */
export const UpdateAppItem = (data: API.UpdateAppItemParams) => {
  return request({
    url: '/api/type',
    method: 'put',
    data,
    hasToken: true,
  });
};
