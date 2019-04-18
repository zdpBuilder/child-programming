import { stringify } from 'qs';
import request from '@/utils/request';
import globalData from '@/utils/globalData';

export async function getList(params) {
  return request(
    `${globalData.baseUrl + globalData.projectName}/experienceCourse/getList?${stringify(params)}`,
    {
      method: globalData.GET,
    }
  );
}

export async function save(params) {
  return request(`${globalData.baseUrl + globalData.projectName}/experienceCourse/save`, {
    method: globalData.POST,
    body: params,
  });
}

export async function deleteBatch(params) {
  return request(
    `${globalData.baseUrl + globalData.projectName}/experienceCourse/delete?${stringify(params)}`,
    {
      method: globalData.GET,
    }
  );
}
