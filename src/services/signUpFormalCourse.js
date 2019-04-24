import { stringify } from 'qs';
import request from '@/utils/request';
import globalData from '@/utils/globalData';

export async function getList(params) {
  return request(
    `${globalData.baseUrl + globalData.projectName}/signUpFormalCourse/getList?${stringify(
      params
    )}`,
    {
      method: globalData.GET,
    }
  );
}

export async function deleteBatch(params) {
  return request(
    `${globalData.baseUrl + globalData.projectName}/signUpFormalCourse/delete?${stringify(params)}`,
    {
      method: globalData.GET,
    }
  );
}
