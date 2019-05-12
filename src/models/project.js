import { queryProjectNotice } from '@/services/api';
import * as studentWork from '@/services/studentWork';

export default {
  namespace: 'project',

  state: {
    notice: [],
    list: [],
  },

  effects: {
    *fetchNotice(_, { call, put }) {
      const response = yield call(queryProjectNotice);
      yield put({
        type: 'saveNotice',
        payload: Array.isArray(response) ? response : [],
      });
    },

    *fetchStudentWorkList({ payload }, { call, put }) {
      const response = yield call(studentWork.getPortalList, payload);
      yield put({
        type: 'saveList',
        payload: response || [],
      });
    },
  },
  reducers: {
    saveNotice(state, action) {
      return {
        ...state,
        notice: action.payload,
      };
    },
    saveList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};
