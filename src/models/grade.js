import * as gradeService from '@/services/grade';
import globalData from '@/utils/globalData';

export default {
  namespace: 'grade',

  state: {
    list: [],
    pagination: globalData.initPagination,
    initGradeInfo: {},
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(gradeService.getList, payload);
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

    *init({ payload }, { call, put }) {
      const response = yield call(gradeService.init, payload);
      yield put({
        type: 'save',
        payload: {
          initGradeInfo: response || {},
        },
      });
    },

    *addAndUpdate({ payload, callback }, { call, put }) {
      const response = yield call(gradeService.save, payload);
      yield put({
        type: 'save',
      });
      if (callback) callback(response);
    },

    *remove({ payload, callback }, { call, put }) {
      const response = yield call(gradeService.deleteBatch, payload);
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
