import * as paymentRecordService from '@/services/paymentRecord';
import globalData from '@/utils/globalData';

export default {
  namespace: 'paymentRecord',

  state: {
    list: [],
    pagination: globalData.initPagination,
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(paymentRecordService.getAllRecordList, payload);
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
