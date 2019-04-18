import request from '@/utils/request';
import globalData from '@/utils/globalData';

// 用账号登陆
export async function accountLogin(params) {
  return request(`${globalData.baseUrl + globalData.projectName}/web/login/account`, {
    method: globalData.POST,
    body: params,
  });
}

// 退出
export async function accountLogout() {
  return request(`${globalData.baseUrl + globalData.projectName}/web/logout`, {
    method: globalData.GET,
  });
}
