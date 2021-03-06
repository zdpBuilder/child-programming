import * as studentService from '@/services/student';
import { getStudentCourseScheduleList } from '@/services/studentCourseSchedule';
import globalData from '@/utils/globalData';

export default {
  namespace: 'student',

  state: {
    list: [],
    pagination: globalData.initPagination,
    courseSchduleList: [],
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(studentService.getList, payload);
      yield put({
        type: 'save',
        payload: {
          list: response || [],
          pagination: {
            total: response ? response.length : 0,
          },
        },
      });
    },

    *addAndUpdate({ payload, callback }, { call, put }) {
      const response = yield call(studentService.save, payload);
      yield put({
        type: 'save',
      });
      if (callback) callback(response);
    },

    *remove({ payload, callback }, { call, put }) {
      const response = yield call(studentService.deleteBatch, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },

    *fetchCourseScheduleList({ payload, callback }, { call, put }) {
      const response = yield call(getStudentCourseScheduleList, payload);
      yield put({
        type: 'save',
        payload: {
          courseSchduleList: response || [],
        },
      });
      if (callback) callback(response);
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
