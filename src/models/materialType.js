import * as materialTypeService from '@/services/materialType';
import globalData from '@/utils/globalData';

export default {
  namespace: 'materialType',

  state: {
    list: [],
    pagination: globalData.initPagination,
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(materialTypeService.getList, payload);
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
      const response = yield call(materialTypeService.save, payload);
      yield put({
        type: 'save',
      });
      if (callback) callback(response);
    },

    *remove({ payload, callback }, { call, put }) {
      const response = yield call(materialTypeService.deleteBatch, payload);
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
