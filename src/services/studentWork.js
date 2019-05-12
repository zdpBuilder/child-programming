import { stringify } from 'qs';
import request from '@/utils/request';
import globalData from '@/utils/globalData';

export async function getList(params) {
  return request(
    `${globalData.baseUrl + globalData.projectName}/studentWork/getList?${stringify(params)}`,
    {
      method: globalData.GET,
    }
  );
}

export async function save(params) {
  return request(`${globalData.baseUrl + globalData.projectName}/studentWork/save`, {
    method: globalData.POST,
    body: params,
  });
}

export async function addStudentWorkToSession(params) {
  return request(
    `${globalData.baseUrl + globalData.projectName}/studentWork/saveStudentWorkToSession`,
    {
      method: globalData.POST,
      body: params,
    }
  );
}

export async function pushWork(params) {
  return request(`${globalData.baseUrl + globalData.projectName}/studentWork/pushStudentWork`, {
    method: globalData.POST,
    body: params,
  });
}

export async function deleteBatch(params) {
  return request(
    `${globalData.baseUrl + globalData.projectName}/studentWork/delete?${stringify(params)}`,
    {
      method: globalData.GET,
    }
  );
}
