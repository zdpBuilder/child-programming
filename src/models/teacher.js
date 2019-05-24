import * as teacherService from '@/services/teacher';
import * as roleService from '@/services/role';
import { getTeacherCourseScheduleList } from '@/services/teacherCourseSchedule';
import globalData from '@/utils/globalData';

export default {
  namespace: 'teacher',

  state: {
    list: [],
    pagination: globalData.initPagination,
    roleListData: [],
    courseSchduleList: [],
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(teacherService.getList, payload);
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

    *fetchRoleList({ payload }, { call, put }) {
      const response = yield call(roleService.getList, payload);
      yield put({
        type: 'save',
        payload: {
          roleListData: response || [],
        },
      });
    },
    *addAndUpdate({ payload, callback }, { call, put }) {
      const response = yield call(teacherService.save, payload);
      yield put({
        type: 'save',
      });
      if (callback) callback(response);
    },

    *remove({ payload, callback }, { call, put }) {
      const response = yield call(teacherService.deleteBatch, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },

    *resetPassword({ payload, callback }, { call, put }) {
      const response = yield call(teacherService.resetPassword, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *fetchCourseScheduleList({ payload, callback }, { call, put }) {
      const response = yield call(getTeacherCourseScheduleList, payload);
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
