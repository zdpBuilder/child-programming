import * as suggestionService from '@/services/suggestion';

export default {
  namespace: 'suggestion',

  state: {
    list: [],
    pagination: {
      total: 0, // 数据量
      pageSize: 6, // 每页显示的数据量
    },
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(suggestionService.getList, payload);
      yield put({
        type: 'save',
        payload: {
          list: response || [],
          pagination: {
            total: response ? response.length : 0,
            pageSize: 6, // 每页显示的数据量
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
