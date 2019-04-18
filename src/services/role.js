import { stringify } from 'qs';
import request from '@/utils/request';
import globalData from '@/utils/globalData';

export async function getList(params) {
  return request(
    `${globalData.baseUrl + globalData.projectName}/role/getList?${stringify(params)}`,
    {
      method: globalData.GET,
    }
  );
}

export async function getRoleByRoleToken(params) {
  return request(
    `${globalData.baseUrl + globalData.projectName}/role/getRoleByRoleToken?${stringify(params)}`,
    {
      method: globalData.GET,
    }
  );
}
export async function save(params) {
  return request(`${globalData.baseUrl + globalData.projectName}/role/save`, {
    method: globalData.POST,
    body: params,
  });
}

export async function deleteBatch(params) {
  return request(
    `${globalData.baseUrl + globalData.projectName}/role/delete?${stringify(params)}`,
    {
      method: globalData.GET,
    }
  );
}
