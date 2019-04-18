import memoizeOne from 'memoize-one';
import isEqual from 'lodash/isEqual';
import { formatMessage } from 'umi/locale';
import Authorized from '@/utils/Authorized';
import * as menuService from '@/services/menu';

const { check } = Authorized;

// Conversion router to menu.
function formatter(data, parentAuthority, parentName) {
  return data
    .map(item => {
      if (!item.name || !item.path) {
        return null;
      }

      let locale = 'menu';
      if (parentName) {
        locale = `${parentName}.${item.name}`;
      } else {
        locale = `menu.${item.name}`;
      }

      const result = {
        ...item,
        name: formatMessage({ id: locale, defaultMessage: item.name }),
        locale,
        authority: item.authority || parentAuthority,
      };
      if (item.routes) {
        const children = formatter(item.routes, item.authority, locale);
        // Reduce memory usage
        result.children = children;
      }
      delete result.routes;
      return result;
    })
    .filter(item => item);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

/**
 * get SubMenu or Item
 */
const getSubMenu = item => {
  // doc: add hideChildrenInMenu
  if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
    return {
      ...item,
      children: filterMenuData(item.children), // eslint-disable-line
    };
  }
  return item;
};

/**
 * filter menuData
 */
const filterMenuData = menuData => {
  if (!menuData) {
    return [];
  }
  return menuData
    .filter(item => item.name && !item.hideInMenu)
    .map(item => check(item.authority, getSubMenu(item)))
    .filter(item => item);
};
/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 */
const getBreadcrumbNameMap = menuData => {
  const routerMap = {};

  const flattenMenuData = data => {
    data.forEach(menuItem => {
      if (menuItem.children) {
        flattenMenuData(menuItem.children);
      }
      // Reduce memory usage
      routerMap[menuItem.path] = menuItem;
    });
  };
  flattenMenuData(menuData);
  return routerMap;
};

const memoizeOneGetBreadcrumbNameMap = memoizeOne(getBreadcrumbNameMap, isEqual);

export default {
  namespace: 'menu',

  state: {
    menuData: [],
    breadcrumbNameMap: {},
  },

  effects: {
    *getMenuData({ payload }, {call, put }) {
      // const { routes, authority } = payload;
    // const menuData = filterMenuData(memoizeOneFormatter(routes, authority));
    // console.info(JSON.stringify(menuData)) //let menuData = [{"path":"/dashboard","name":"Dashboard","icon":"dashboard","locale":"menu.dashboard","authority":["user"],"children":[{"path":"/dashboard/workplace","name":"工作台","exact":true,"locale":"menu.dashboard.workplace"}]},{"path":"/webAdmin","icon":"table","name":"门户网站管理","locale":"menu.portalManagement","authority":["admin","user"],"children":[{"path":"/webAdmin/worksManagement","name":"作品管理","exact":true,"locale":"menu.portalManagement.worksManagement"},{"path":"/webAdmin/materialManagement","name":"资料管理","locale":"menu.portalManagement.materialManagement","children":[{"path":"/webAdmin/materialManagement/materialTypeManagement","name":"资料类别管理","exact":true,"locale":"menu.portalManagement.materialManagement.materialTypeManagement"},{"path":"/webAdmin/materialManagement/materialContentManagement","name":"资料内容管理","exact":true,"locale":"menu.portalManagement.materialManagement.materialContentManagement"}]},{"path":"/webAdmin/paymentRecord","name":"缴费记录管理","exact":true,"locale":"menu.portalManagement.paymentRecord"}]},{"path":"/educationalAdministration","icon":"table","name":"教务管理","locale":"menu.educationalAdministration","authority":["admin","user"],"children":[{"path":"/educationalAdministration/schoolManagement","name":"校区管理","exact":true,"locale":"menu.educationalAdministration.schoolManagement"},{"path":"/educationalAdministration/classroomManagement","name":"教室管理","exact":true,"locale":"menu.educationalAdministration.classroomManagement"},{"path":"/educationalAdministration/studentsManagement","name":"学生信息管理","exact":true,"locale":"menu.educationalAdministration.studentsManagement"},{"path":"/educationalAdministration/teacherManagement","name":"教师信息管理","exact":true,"locale":"menu.educationalAdministration.teacherManagement"},{"path":"/educationalAdministration/courseManagement","name":"课程管理","locale":"menu.educationalAdministration.courseManagement","children":[{"path":"/educationalAdministration/courseManagement/formal","name":" 正式课管理","exact":true,"locale":"menu.educationalAdministration.courseManagement.formalCourseManagement"}]},{"path":"/educationalAdministration/gradeManagement","name":" 班级管理","exact":true,"locale":"menu.educationalAdministration.gradeManagement"},{"path":"/educationalAdministration/signManagement","name":" 签到管理","exact":true,"locale":"menu.educationalAdministration.signManagement"}]},{"name":"个人页","icon":"user","path":"/account","locale":"menu.account","authority":["admin","user"],"children":[{"path":"/account/center","name":"个人中心","locale":"menu.account.center","children":[]},{"path":"/account/settings","name":"个人设置","locale":"menu.account.settings","children":[]}]}];

      let menuData = yield call(menuService.getList, payload);
      console.info(menuData);
      menuData= filterMenuData(menuData);
      const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap(menuData);
      yield put({
        type: 'save',
        payload: { menuData, breadcrumbNameMap },
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
