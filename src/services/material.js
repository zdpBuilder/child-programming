import { stringify } from 'qs';
import request from '@/utils/request';
import globalData from '@/utils/globalData';

export async function getList(params) {
  return request(
    `${globalData.baseUrl + globalData.projectName}/material/getList?${stringify(params)}`,
    {
      method: globalData.GET,
    }
  );
}

export async function save(params) {
  return request(`${globalData.baseUrl + globalData.projectName}/material/save`, {
    method: globalData.POST,
    body: params,
  });
}

export async function deleteBatch(params) {
  return request(
    `${globalData.baseUrl + globalData.projectName}/material/delete?${stringify(params)}`,
    {
      method: globalData.GET,
    }
  );
}
