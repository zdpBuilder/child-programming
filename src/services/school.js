import { stringify } from 'qs';
import request from '@/utils/request';
import globalData from '@/utils/globalData';

export async function getList(params) {
  return request(
    `${globalData.baseUrl + globalData.projectName}/school/getList?${stringify(params)}`,
    {
      method: globalData.GET,
    }
  );
}

export async function save(params) {
  return request(`${globalData.baseUrl + globalData.projectName}/school/save`, {
    method: globalData.POST,
    body: params,
  });
}

export async function deleteBatch(params) {
  return request(
    `${globalData.baseUrl + globalData.projectName}/school/delete?${stringify(params)}`,
    {
      method: globalData.GET,
    }
  );
}

export async function getSchoolInfoSelect() {
  return request(`${globalData.baseUrl + globalData.projectName}/school/getSchoolInfoSelect`, {
    method: globalData.GET,
  });
}
