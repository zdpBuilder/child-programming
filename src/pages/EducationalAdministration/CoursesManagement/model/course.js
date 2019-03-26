import * as classroomService from '../service/course';
import globalData from '@/utils/globalData';

export default {
  namespace: 'course',

  state: {
    list: [],
    pagination: globalData.initPagination,
    schoolSelectData: [],
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(classroomService.getList, payload);
      yield put({
        type: 'queryList',
        payload: response,
      });
    },

    *fetchSchoolInfoList({ payload }, { call, put }) {
      const response = yield call(classroomService.getSchoolInfoSelect, payload);
      yield put({
        type: 'querySchoolInfoList',
        payload: response,
      });
    },

    *addAndUpdate({ payload, callback }, { call, put }) {
      const response = yield call(classroomService.save, payload);
      yield put({
        type: 'save',
      });
      if (callback) callback(response);
    },

    *remove({ payload, callback }, { call, put }) {
      const response = yield call(classroomService.deleteBatch, payload);
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

    querySchoolInfoList(state, action) {
      return {
        ...state,
        schoolSelectData: action.payload || [],
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
