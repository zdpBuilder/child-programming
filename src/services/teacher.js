import { stringify } from 'qs';
import request from '@/utils/request';
import globalData from '@/utils/globalData';

export async function getList(params) {
  return request(
    `${globalData.baseUrl + globalData.projectName}/teacher/getList?${stringify(params)}`,
    {
      method: globalData.GET,
    }
  );
}

export async function save(params) {
  return request(`${globalData.baseUrl + globalData.projectName}/teacher/save`, {
    method: globalData.POST,
    body: params,
  });
}

export async function deleteBatch(params) {
  return request(
    `${globalData.baseUrl + globalData.projectName}/teacher/delete?${stringify(params)}`,
    {
      method: globalData.GET,
    }
  );
}

export async function resetPassword(params) {
  return request(
    `${globalData.baseUrl + globalData.projectName}/teacher/resetPassword?${stringify(params)}`,
    {
      method: globalData.GET,
    }
  );
}

export async function getTeacherByLoginId(params) {
  return request(
    `${globalData.baseUrl + globalData.projectName}/teacher/getTeacherByLoginId?${stringify(
      params
    )}`,
    {
      method: globalData.GET,
    }
  );
}
