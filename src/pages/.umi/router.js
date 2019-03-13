import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/_renderRoutes';
import RendererWrapper0 from 'D:/oa-workspace/ant-design-pro-master/src/pages/.umi/LocaleWrapper.jsx'

let Router = require('dva/router').routerRedux.ConnectedRouter;

let routes = [
  {
    "path": "/user",
    "component": dynamic({ loader: () => import('../../layouts/UserLayout'), loading: require('D:/oa-workspace/ant-design-pro-master/src/components/PageLoading/index').default }),
    "routes": [
      {
        "path": "/user",
        "redirect": "/user/login",
        "exact": true
      },
      {
        "path": "/user/login",
        "component": dynamic({ loader: () => import('../User/Login'), loading: require('D:/oa-workspace/ant-design-pro-master/src/components/PageLoading/index').default }),
        "exact": true
      },
      {
        "path": "/user/register",
        "component": dynamic({ loader: () => import('../User/Register'), loading: require('D:/oa-workspace/ant-design-pro-master/src/components/PageLoading/index').default }),
        "exact": true
      },
      {
        "path": "/user/register-result",
        "component": dynamic({ loader: () => import('../User/RegisterResult'), loading: require('D:/oa-workspace/ant-design-pro-master/src/components/PageLoading/index').default }),
        "exact": true
      },
      {
        "component": () => React.createElement(require('D:/oa-workspace/ant-design-pro-master/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
      }
    ]
  },
  {
    "path": "/",
    "component": dynamic({ loader: () => import('../../layouts/BasicLayout'), loading: require('D:/oa-workspace/ant-design-pro-master/src/components/PageLoading/index').default }),
    "Routes": [require('../Authorized').default],
    "authority": [
      "admin",
      "user"
    ],
    "routes": [
      {
        "path": "/",
        "redirect": "/dashboard/workplace",
        "exact": true
      },
      {
        "path": "/dashboard",
        "name": "dashboard",
        "icon": "dashboard",
        "routes": [
          {
            "path": "/dashboard/workplace",
            "name": "workplace",
            "component": dynamic({ loader: () => import('../Dashboard/Workplace'), loading: require('D:/oa-workspace/ant-design-pro-master/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "component": () => React.createElement(require('D:/oa-workspace/ant-design-pro-master/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/webAdmin",
        "icon": "table",
        "name": "portalManagement",
        "routes": [
          {
            "path": "/webAdmin/worksManagement",
            "name": "worksManagement",
            "component": dynamic({ loader: () => import('../PortalManagement/WorksManagement/Projects'), loading: require('D:/oa-workspace/ant-design-pro-master/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "path": "/webAdmin/materialManagement",
            "name": "materialManagement",
            "component": dynamic({ loader: () => import('../PortalManagement/materialManagement/CardList'), loading: require('D:/oa-workspace/ant-design-pro-master/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "path": "/webAdmin/paymentRecord",
            "name": "paymentRecord",
            "component": dynamic({ loader: () => import('../PortalManagement/paymentRecord/BasicList'), loading: require('D:/oa-workspace/ant-design-pro-master/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "component": () => React.createElement(require('D:/oa-workspace/ant-design-pro-master/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/educationalAdministration",
        "icon": "table",
        "name": "educationalAdministration",
        "routes": [
          {
            "path": "/educationalAdministration/campusManagement",
            "name": "campusManagement",
            "component": dynamic({ loader: () => import('../educationalAdministration/campusManagement/BasicList'), loading: require('D:/oa-workspace/ant-design-pro-master/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "path": "/educationalAdministration/studentsManagement",
            "name": "studentsManagement",
            "component": dynamic({ loader: () => import('../educationalAdministration/studentsManagement/BasicList'), loading: require('D:/oa-workspace/ant-design-pro-master/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "path": "/educationalAdministration/teachersManagement",
            "name": "teachersManagement",
            "component": dynamic({ loader: () => import('../educationalAdministration/teachersManagement/BasicList'), loading: require('D:/oa-workspace/ant-design-pro-master/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "path": "/educationalAdministration/coursesManagement",
            "name": "coursesManagement",
            "component": dynamic({ loader: () => import('../educationalAdministration/coursesManagement/List'), loading: require('D:/oa-workspace/ant-design-pro-master/src/components/PageLoading/index').default }),
            "routes": [
              {
                "path": "/educationalAdministration/coursesManagement",
                "redirect": "/educationalAdministration/coursesManagement/typeManagement",
                "exact": true
              },
              {
                "path": "/educationalAdministration/coursesManagement/typeManagement",
                "name": "typeManagement",
                "component": dynamic({ loader: () => import('../educationalAdministration/coursesManagement/typeManagement'), loading: require('D:/oa-workspace/ant-design-pro-master/src/components/PageLoading/index').default }),
                "exact": true
              },
              {
                "path": "/educationalAdministration/coursesManagement/classScheduleCard",
                "name": "classScheduleCard",
                "component": dynamic({ loader: () => import('../educationalAdministration/coursesManagement/Applications'), loading: require('D:/oa-workspace/ant-design-pro-master/src/components/PageLoading/index').default }),
                "exact": true
              },
              {
                "path": "/educationalAdministration/coursesManagement/classAdjustment",
                "name": "classAdjustment",
                "component": dynamic({ loader: () => import('../educationalAdministration/coursesManagement/Articles'), loading: require('D:/oa-workspace/ant-design-pro-master/src/components/PageLoading/index').default }),
                "exact": true
              },
              {
                "component": () => React.createElement(require('D:/oa-workspace/ant-design-pro-master/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
              }
            ]
          },
          {
            "path": "/educationalAdministration/classManagement",
            "name": "classManagement",
            "component": dynamic({ loader: () => import('../educationalAdministration/classManagement/BasicList'), loading: require('D:/oa-workspace/ant-design-pro-master/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "path": "/educationalAdministration/signManagement",
            "name": "signManagement",
            "component": dynamic({ loader: () => import('../educationalAdministration/signManagement/Applications'), loading: require('D:/oa-workspace/ant-design-pro-master/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "component": () => React.createElement(require('D:/oa-workspace/ant-design-pro-master/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "name": "account",
        "icon": "user",
        "path": "/account",
        "routes": [
          {
            "path": "/account/center",
            "name": "center",
            "component": dynamic({ loader: () => import('../Account/Center/Center'), loading: require('D:/oa-workspace/ant-design-pro-master/src/components/PageLoading/index').default }),
            "routes": [
              {
                "path": "/account/center",
                "redirect": "/account/center/articles",
                "exact": true
              },
              {
                "path": "/account/center/articles",
                "component": dynamic({ loader: () => import('../Account/Center/Articles'), loading: require('D:/oa-workspace/ant-design-pro-master/src/components/PageLoading/index').default }),
                "exact": true
              },
              {
                "path": "/account/center/applications",
                "component": dynamic({ loader: () => import('../Account/Center/Applications'), loading: require('D:/oa-workspace/ant-design-pro-master/src/components/PageLoading/index').default }),
                "exact": true
              },
              {
                "path": "/account/center/projects",
                "component": dynamic({ loader: () => import('../Account/Center/Projects'), loading: require('D:/oa-workspace/ant-design-pro-master/src/components/PageLoading/index').default }),
                "exact": true
              },
              {
                "component": () => React.createElement(require('D:/oa-workspace/ant-design-pro-master/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
              }
            ]
          },
          {
            "path": "/account/settings",
            "name": "settings",
            "component": dynamic({ loader: () => import('../Account/Settings/Info'), loading: require('D:/oa-workspace/ant-design-pro-master/src/components/PageLoading/index').default }),
            "routes": [
              {
                "path": "/account/settings",
                "redirect": "/account/settings/base",
                "exact": true
              },
              {
                "path": "/account/settings/base",
                "component": dynamic({ loader: () => import('../Account/Settings/BaseView'), loading: require('D:/oa-workspace/ant-design-pro-master/src/components/PageLoading/index').default }),
                "exact": true
              },
              {
                "path": "/account/settings/security",
                "component": dynamic({ loader: () => import('../Account/Settings/SecurityView'), loading: require('D:/oa-workspace/ant-design-pro-master/src/components/PageLoading/index').default }),
                "exact": true
              },
              {
                "path": "/account/settings/binding",
                "component": dynamic({ loader: () => import('../Account/Settings/BindingView'), loading: require('D:/oa-workspace/ant-design-pro-master/src/components/PageLoading/index').default }),
                "exact": true
              },
              {
                "path": "/account/settings/notification",
                "component": dynamic({ loader: () => import('../Account/Settings/NotificationView'), loading: require('D:/oa-workspace/ant-design-pro-master/src/components/PageLoading/index').default }),
                "exact": true
              },
              {
                "component": () => React.createElement(require('D:/oa-workspace/ant-design-pro-master/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
              }
            ]
          },
          {
            "component": () => React.createElement(require('D:/oa-workspace/ant-design-pro-master/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "component": dynamic({ loader: () => import('../404'), loading: require('D:/oa-workspace/ant-design-pro-master/src/components/PageLoading/index').default }),
        "exact": true
      },
      {
        "component": () => React.createElement(require('D:/oa-workspace/ant-design-pro-master/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
      }
    ]
  },
  {
    "component": () => React.createElement(require('D:/oa-workspace/ant-design-pro-master/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
  }
];
window.g_plugins.applyForEach('patchRoutes', { initialValue: routes });

export default function() {
  return (
<RendererWrapper0>
          <Router history={window.g_history}>
      { renderRoutes(routes, {}) }
    </Router>
        </RendererWrapper0>
  );
}
