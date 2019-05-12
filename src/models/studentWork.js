import * as studentWorkService from '@/services/studentWork';
import globalData from '@/utils/globalData';

export default {
  namespace: 'studentWork',

  state: {
    list: [],
    pagination: globalData.initPagination,
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(studentWorkService.getList, payload);
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
      const response = yield call(studentWorkService.save, payload);
      yield put({
        type: 'save',
      });
      if (callback) callback(response);
    },
    *addStudentWorkToSession({ payload }, { call, put }) {
      yield call(studentWorkService.addStudentWorkToSession, payload);
      yield put({
        type: 'save',
      });
    },

    *pushWork({ payload, callback }, { call, put }) {
      const response = yield call(studentWorkService.pushWork, payload);
      yield put({
        type: 'save',
      });
      if (callback) callback(response);
    },

    *remove({ payload, callback }, { call, put }) {
      const response = yield call(studentWorkService.deleteBatch, payload);
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
