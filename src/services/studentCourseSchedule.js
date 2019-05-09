import { stringify } from 'qs';
import request from '@/utils/request';
import globalData from '@/utils/globalData';

export async function getStudentCourseScheduleList(params) {
  return request(
    `${globalData.baseUrl +
      globalData.projectName}/studentCourseSchedule/getStudentCourseScheduleList?${stringify(
      params
    )}`,
    {
      method: globalData.GET,
    }
  );
}

export async function getStudentInfoList(params) {
  return request(
    `${globalData.baseUrl +
      globalData.projectName}/studentCourseSchedule/getStudentInfoList?${stringify(params)}`,
    {
      method: globalData.GET,
    }
  );
}
