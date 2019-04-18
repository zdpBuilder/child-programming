import * as roleService from '@/services/role';
import * as menuService from '@/services/menu';
import globalData from '@/utils/globalData';

export default {
  namespace: 'role',

  state: {
    list: [],
    pagination: globalData.initPagination,
    menuData:[]
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(roleService.getList, payload);
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
    *getMenuData({ payload }, { call, put }) {
      const response = yield call(menuService.getList, payload);
      yield put({
        type: 'save',
        payload: {
          menuData: response || [],
        },
      });
    },

    *assignAuthority({ payload, callback }, { call }) {
      const response = yield call(menuService.assignAuthority, payload);

      if (callback) callback(response);
    },

    *addAndUpdate({ payload, callback }, { call, put }) {
      const response = yield call(roleService.save, payload);
      yield put({
        type: 'save',
      });
      if (callback) callback(response);
    },

    *remove({ payload, callback }, { call, put }) {
      const response = yield call(roleService.deleteBatch, payload);
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
