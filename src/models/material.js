import * as materialSerivce from '@/services/material';
import * as materialTypeSerivce from '@/services/materialType';
import globalData from '@/utils/globalData';

export default {
  namespace: 'material',

  state: {
    list: [],
    pagination: globalData.initPagination,
    materialTypeListData: [],
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(materialSerivce.getList, payload);
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

    *fetchMaterialTypeList({ payload }, { call, put }) {
      const response = yield call(materialTypeSerivce.getList, payload);
      yield put({
        type: 'save',
        payload: {
          materialTypeListData: response || [],
        },
      });
    },
    *addAndUpdate({ payload, callback }, { call, put }) {
      const response = yield call(materialSerivce.save, payload);
      yield put({
        type: 'save',
      });
      if (callback) callback(response);
    },

    *remove({ payload, callback }, { call, put }) {
      const response = yield call(materialSerivce.deleteBatch, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },

    *push({ payload, callback }, { call, put }) {
      const response = yield call(materialSerivce.pushBatch, payload);
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
