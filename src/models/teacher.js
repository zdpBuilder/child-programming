import * as teacherService from '@/services/teacher';
import globalData from '@/utils/globalData';

export default {
  namespace: 'teacher',

  state: {
    list: [],
    pagination: globalData.initPagination,
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
