import { stringify } from 'qs';
import request from '@/utils/request';
import globalData from '@/utils/globalData';

export async function getList(params) {
  return request(
    `${globalData.baseUrl + globalData.projectName}/grade/getList?${stringify(params)}`,
    {
      method: globalData.GET,
    }
  );
}

export async function save(params) {
  return request(`${globalData.baseUrl + globalData.projectName}/grade/save`, {
    method: globalData.POST,
    body: params,
  });
}

export async function deleteBatch(params) {
  return request(
    `${globalData.baseUrl + globalData.projectName}/grade/delete?${stringify(params)}`,
    {
      method: globalData.GET,
    }
  );
}

export async function init(params) {
  return request(
    `${globalData.baseUrl + globalData.projectName}/grade/initGrade?${stringify(params)}`,
    {
      method: globalData.GET,
    }
  );
}
