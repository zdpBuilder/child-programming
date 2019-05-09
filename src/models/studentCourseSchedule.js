import * as studentCourseScheduleService from '@/services/studentCourseSchedule';
import { getGradeInfoSelect } from '@/services/grade';
import globalData from '@/utils/globalData';

export default {
  namespace: 'studentCourseSchedule',

  state: {
    studentInfoList: [],
    gradeSelectData: [],
    pagination: globalData.initPagination,
    courseSchduleList: [],
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(studentCourseScheduleService.getStudentInfoList, payload);
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

    *fetchGradeInfoList({ payload }, { call, put }) {
      const response = yield call(getGradeInfoSelect, payload);
      yield put({
        type: 'save',
        payload: {
          gradeSelectData: response || [],
        },
      });
    },

    *fetchCourseScheduleList({ payload }, { call, put }) {
      const response = yield call(
        studentCourseScheduleService.getStudentCourseScheduleList,
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
