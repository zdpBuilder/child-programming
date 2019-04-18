import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { getFakeCaptcha } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { accountLogin ,accountLogout} from '@/services/login';
import globalData from '@/utils/globalData';
import {message} from 'antd';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(accountLogin, payload);

      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.status === globalData.successCode) {
        // 放入session
        window.sessionStorage.setItem('currentUserInfo', JSON.stringify(response.data));
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/dashboard/workplace'));
      }else
        message.error("账号或密码错误");
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { call,put}) {

      const response = yield call(accountLogout);

      if(response.status === globalData.successCode){
        yield put({
          type: 'changeLoginStatus',
          payload: {
            data:{
            status: false, currentAuthority: undefined,
            }
          },
        });
        reloadAuthorized();
        yield put(
          routerRedux.push({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
      }else{
        message.error("退出失败")
      }

    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {

      setAuthority(payload.data.currentAuthority);
      return {
        ...state,
        ...payload,
      };
    },
  },
};
