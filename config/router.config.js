export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      // dashboard
      { path: '/', redirect: '/dashboard/workplace' },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [
        /*  {
            path: '/dashboard/analysis',
            name: 'analysis',
            component: './Dashboard/Analysis',
          },
          {
            path: '/dashboard/monitor',
            name: 'monitor',
            component: './Dashboard/Monitor',
          },*/
          {
            path: '/dashboard/workplace',
            name: 'workplace',
            component: './Dashboard/Workplace',
          },
        ],
      },
  /*    // forms
      {
        path: '/form',
        icon: 'form',
        name: 'form',
        routes: [
          {
            path: '/form/basic-form',
            name: 'basicform',
            component: './Forms/BasicForm',
          },
          {
            path: '/form/step-form',
            name: 'stepform',
            component: './Forms/StepForm',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/form/step-form',
                redirect: '/form/step-form/info',
              },
              {
                path: '/form/step-form/info',
                name: 'info',
                component: './Forms/StepForm/Step1',
              },
              {
                path: '/form/step-form/confirm',
                name: 'confirm',
                component: './Forms/StepForm/Step2',
              },
              {
                path: '/form/step-form/result',
                name: 'result',
                component: './Forms/StepForm/Step3',
              },
            ],
          },
          {
            path: '/form/advanced-form',
            name: 'advancedform',
            authority: ['admin'],
            component: './Forms/AdvancedForm',
          },
        ],
      },*/
      // list
    /*  {
        path: '/list',
        icon: 'table',
        name: 'list',
        routes: [
          {
            path: '/list/table-list',
            name: 'searchtable',
            component: './List/TableList',
          },
          {
            path: '/list/basic-list',
            name: 'basiclist',
            component: './List/BasicList',
          },
          {
            path: '/list/card-list',
            name: 'cardlist',
            component: './List/CardList',
          },
          {
            path: '/list/search',
            name: 'searchlist',
            component: './List/List',
            routes: [
              {
                path: '/list/search',
                redirect: '/list/search/articles',
              },
              {
                path: '/list/search/articles',
                name: 'articles',
                component: './List/Articles',
              },
              {
                path: '/list/search/projects',
                name: 'projects',
                component: './List/Projects',
              },
              {
                path: '/list/search/applications',
                name: 'applications',
                component: './List/Applications',
              },
            ],
          },
        ],
      },*/
      // webAdmin 门户网站管理
      {
        path: '/webAdmin',
        icon: 'table',
        name: 'portalManagement',
        routes: [
          {
            path: '/webAdmin/worksManagement',
            name: 'worksManagement',
            component: './PortalManagement/WorksManagement/Projects',
      },
          {
            path: '/webAdmin/materialManagement',
            name: 'materialManagement',
            component: './PortalManagement/materialManagement/CardList',
          },
          {
            path: '/webAdmin/paymentRecord',
            name: 'paymentRecord',
            component: './PortalManagement/paymentRecord/BasicList',
          },
        /*  {
            path: '/webAdmin/privilegeManagement',
            name: 'privilegeManagement',
            component: './PortalManagement/privilegeManagement/TableList',
          },*/
        ],
      },
      //教务系统管理
      {
        path: '/educationalAdministration',
        icon: 'table',
        name: 'educationalAdministration',
        routes: [
          {
            path: '/educationalAdministration/campusManagement',
            name: 'campusManagement',
            component: './educationalAdministration/campusManagement/BasicList',
          },
          {
            path: '/educationalAdministration/studentsManagement',
            name: 'studentsManagement',
            component: './educationalAdministration/studentsManagement/BasicList',
          },
          {
            path: '/educationalAdministration/teachersManagement',
            name: 'teachersManagement',
            component: './educationalAdministration/teachersManagement/BasicList',
          },
          {
            path: '/educationalAdministration/coursesManagement',
            name: 'coursesManagement',
            component: './educationalAdministration/coursesManagement/List',
            routes:[
              {
                path: '/educationalAdministration/coursesManagement',
                redirect: '/educationalAdministration/coursesManagement/typeManagement',
              },
              {
                path: '/educationalAdministration/coursesManagement/typeManagement',
                name: 'typeManagement',
                component: './educationalAdministration/coursesManagement/typeManagement',
              },
              {
                path: '/educationalAdministration/coursesManagement/classScheduleCard',
                name: 'classScheduleCard',
                component: './educationalAdministration/coursesManagement/Applications',
              },
              {
                path: '/educationalAdministration/coursesManagement/classAdjustment',
                name: 'classAdjustment',
                component: './educationalAdministration/coursesManagement/Articles',
              },
            ],

          },
          {
            path: '/educationalAdministration/classManagement',
            name: 'classManagement',
            component: './educationalAdministration/classManagement/BasicList',
          },
          {
            path: '/educationalAdministration/signManagement',
            name: 'signManagement',
            component: './educationalAdministration/signManagement/Applications',
          },
        ],
      },

      {
        name: 'account',
        icon: 'user',
        path: '/account',
        routes: [
          {
            path: '/account/center',
            name: 'center',
            component: './Account/Center/Center',
            routes: [
              {
                path: '/account/center',
                redirect: '/account/center/articles',
              },
              {
                path: '/account/center/articles',
                component: './Account/Center/Articles',
              },
              {
                path: '/account/center/applications',
                component: './Account/Center/Applications',
              },
              {
                path: '/account/center/projects',
                component: './Account/Center/Projects',
              },
            ],
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: './Account/Settings/Info',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              },
              {
                path: '/account/settings/security',
                component: './Account/Settings/SecurityView',
              },
              {
                path: '/account/settings/binding',
                component: './Account/Settings/BindingView',
              },
              {
                path: '/account/settings/notification',
                component: './Account/Settings/NotificationView',
              },
            ],
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
