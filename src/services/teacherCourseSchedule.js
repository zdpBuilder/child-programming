import { stringify } from 'qs';
import request from '@/utils/request';
import globalData from '@/utils/globalData';

export async function getTeacherCourseScheduleList(params) {
  return request(
    `${globalData.baseUrl +
      globalData.projectName}/teachersCourseSchedule/getTeacherCourseScheduleList?${stringify(
      params
    )}`,
    {
      method: globalData.GET,
    }
  );
}

export async function getTeacherInfoList(params) {
  return request(
    `${globalData.baseUrl +
      globalData.projectName}/teachersCourseSchedule/getTeacherInfoList?${stringify(params)}`,
    {
      method: globalData.GET,
    }
  );
}
