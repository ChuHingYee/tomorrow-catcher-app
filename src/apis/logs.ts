import request from '../utils/request';

/**
 * 获取应用详情
 * @param params
 * @returns
 */
export const GetLogDetail = (params: API.LogItemDetailParams) => {
  return request<API.LogItemDetailResponse>({
    url: `/api/logs/${params._id}`,
    method: 'get',
    hasToken: true,
  });
};
