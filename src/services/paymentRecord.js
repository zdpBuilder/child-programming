import { stringify } from 'qs';
import request from '@/utils/request';
import globalData from '@/utils/globalData';

export async function getAllRecordList(params) {
  return request(
    `${globalData.baseUrl + globalData.projectName}/paymentRecord/getAllRecordList?${stringify(
      params
    )}`,
    {
      method: globalData.GET,
    }
  );
}

export async function save(params) {
  return request(`${globalData.baseUrl + globalData.projectName}/paymentRecord/save`, {
    method: globalData.POST,
    body: params,
  });
}
