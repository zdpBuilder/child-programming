import * as campusService from '../service/class';
import globalData from '@/utils/globalData';

export default {
  namespace: 'class',

  state: {
    list: [],
    pagination: globalData.initPagination,
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(campusService.getList, payload);
      yield put({
        type: 'queryList',
        payload: response,
      });
    },

    *addAndUpdate({ payload, callback }, { call, put }) {
      const response = yield call(campusService.save, payload);
      yield put({
        type: 'save',
      });
      if (callback) callback(response);
    },

    *remove({ payload, callback }, { call, put }) {
      const response = yield call(campusService.deleteBatch, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
        pagination: {
          total: action.payload ? action.payload.length : 0,
        },
      };
    },

    save(state) {
      return {
        ...state,
      };
    },

    changeTable(state, action) {
      return {
        ...state,
        pagination: action.payload,
      };
    },
  },
};
