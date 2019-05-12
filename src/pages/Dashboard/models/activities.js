import { queryActivities } from '@/services/api';
import * as materialSerivce from '@/services/material';

export default {
  namespace: 'activities',

  state: {
    list: [],
    materialList: [],
  },

  effects: {
    *fetchList(_, { call, put }) {
      const response = yield call(queryActivities);
      yield put({
        type: 'saveList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *fetchMaterialList({ payload }, { call, put }) {
      const response = yield call(materialSerivce.getList, payload);
      yield put({
        type: 'saveMaterialList',
        payload: response || [],
      });
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveMaterialList(state, action) {
      return {
        ...state,
        materialList: action.payload,
      };
    },
  },
};
