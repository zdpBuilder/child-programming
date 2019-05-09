import * as teacherCourseScheduleService from '@/services/teacherCourseSchedule';
import globalData from '@/utils/globalData';

export default {
  namespace: 'teacherCourseSchedule',

  state: {
    studentInfoList: [],
    gradeSelectData: [],
    pagination: globalData.initPagination,
    courseSchduleList: [],
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(teacherCourseScheduleService.getTeacherInfoList, payload);
      yield put({
        type: 'save',
        payload: {
          studentInfoList: response || [],
          pagination: {
            total: response ? response.length : 0,
          },
        },
      });
    },

    *fetchCourseScheduleList({ payload }, { call, put }) {
      const response = yield call(
        teacherCourseScheduleService.getTeacherCourseScheduleList,
        payload
      );
      yield put({
        type: 'save',
        payload: {
          courseSchduleList: response || [],
        },
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
