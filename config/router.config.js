export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/', redirect: '/user/login' },
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
    routes: [
      // 登陆
      { path: '/', redirect: '/user/login' },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [
          {
            path: '/dashboard/workplace',
            name: 'workplace',
            component: './Dashboard/Workplace',
          },
        ],
      },
      //权限管理
      {
        path: '/authorityManagement',
        icon: 'table',
        name: 'authorityManagement',
        routes: [
          {
            path: '/authorityManagement/roleManagement',
            name: 'roleManagement',
            component: './AuthorityManagement/RoleManagement/TableList',
          }
        ]
      },
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
            routes: [
              {
                path: '/webAdmin/materialManagement/materialTypeManagement',
                name: 'materialTypeManagement',
                component: './PortalManagement/MaterialManagement/MaterialTypeManagement/TableList',
              },
              {
                path: '/webAdmin/materialManagement/materialContentManagement',
                name: 'materialContentManagement',
                component: './PortalManagement/MaterialManagement/MaterialContentManagement/TableList',
              },
            ],
          },
          {
            path: '/webAdmin/paymentRecord',
            name: 'paymentRecord',
            component: './PortalManagement/paymentRecord/BasicList',
          },
        ],
      },
      // 教务系统管理
      {
        path: '/educationalAdministration',
        icon: 'table',
        name: 'educationalAdministration',
        routes: [
          {
            path: '/educationalAdministration/schoolManagement',
            name: 'schoolManagement',
            component: './educationalAdministration/schoolManagement/TableList',
          },
          {
            path: '/educationalAdministration/classroomManagement',
            name: 'classroomManagement',
            component: './educationalAdministration/classroomManagement/TableList',
          },
          {
            path: '/educationalAdministration/studentsManagement',
            name: 'studentsManagement',
            component: './educationalAdministration/studentsManagement/TableList',
          },
          {
            path: '/educationalAdministration/teacherManagement',
            name: 'teacherManagement',
            component: './educationalAdministration/teacherManagement/TableList',
          },
          {
            path: '/educationalAdministration/courseManagement',
            name: 'courseManagement',
            routes: [
              {
                path: '/educationalAdministration/courseManagement/formal',
                name: 'formalCourseManagement',
                component: './educationalAdministration/courseManagement/formal/TableList',
              },
              {
                path: '/educationalAdministration/courseManagement/experience',
                name: 'experienceCourseManagement',
                component: './EducationalAdministration/CourseManagement/Experience/TableList',
              },
            ],
          },
          {
            path: '/educationalAdministration/signUpManagement',
            name: 'signUpManagement',
            routes: [
              {
                path: '/educationalAdministration/signUpManagement/experience',
                name: 'signUpExperienceManagement',
                component: './educationalAdministration/signUpManagement/experience/TableList',
              },
              {
                path: '/educationalAdministration/signUpManagement/formal',
                name: 'signUpFormalManagement',
                component: './EducationalAdministration/signUpManagement/formal/TableList',
              },
            ],
          },
          {
            path: '/educationalAdministration/gradeManagement',
            name: 'gradeManagement',
            component: './educationalAdministration/gradeManagement/TableList',
          },
          {
            path: '/educationalAdministration/paymentRecordManagement',
            name: 'paymentRecordManagement',
            component: './educationalAdministration/paymentRecordManagement/TableList',
          },
          {
            path: '/educationalAdministration/suggestionManagement',
            name: 'suggestionManagement',
            component: './educationalAdministration/suggestionManagement/TableList',
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
