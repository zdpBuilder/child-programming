import { stringify } from 'qs';
import request from '@/utils/request';
import globalData from '@/utils/globalData';

export async function getList() {
  return request(`${globalData.baseUrl + globalData.projectName}/menu/getList`, {
    method: globalData.GET,
  });
}

export async function save(params) {
  return request(`${globalData.baseUrl + globalData.projectName}/menu/save`, {
    method: globalData.POST,
    body: params,
  });
}

export async function deleteBatch(params) {
  return request(
    `${globalData.baseUrl + globalData.projectName}/menu/delete?${stringify(params)}`,
    {
      method: globalData.GET,
    }
  );
}

export async function assignAuthority(params) {
  return request(
    `${globalData.baseUrl + globalData.projectName}/menu/assignAuthority?menuIds=${
      params.menuIds
    }&roleToken=${params.roleToken}`,
    {
      method: globalData.GET,
    }
  );
}
