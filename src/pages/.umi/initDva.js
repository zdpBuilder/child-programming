import dva from 'dva';
import createLoading from 'dva-loading';

const runtimeDva = window.g_plugins.mergeConfig('dva');
let app = dva({
  history: window.g_history,
  
  ...(runtimeDva.config || {}),
});

window.g_app = app;
app.use(createLoading());
(runtimeDva.plugins || []).forEach(plugin => {
  app.use(plugin);
});

app.model({ namespace: 'global', ...(require('D:/oa-workspace/ant-design-pro-master/src/models/global.js').default) });
app.model({ namespace: 'list', ...(require('D:/oa-workspace/ant-design-pro-master/src/models/list.js').default) });
app.model({ namespace: 'login', ...(require('D:/oa-workspace/ant-design-pro-master/src/models/login.js').default) });
app.model({ namespace: 'menu', ...(require('D:/oa-workspace/ant-design-pro-master/src/models/menu.js').default) });
app.model({ namespace: 'project', ...(require('D:/oa-workspace/ant-design-pro-master/src/models/project.js').default) });
app.model({ namespace: 'setting', ...(require('D:/oa-workspace/ant-design-pro-master/src/models/setting.js').default) });
app.model({ namespace: 'user', ...(require('D:/oa-workspace/ant-design-pro-master/src/models/user.js').default) });
app.model({ namespace: 'worksManagement', ...(require('D:/oa-workspace/ant-design-pro-master/src/models/worksManagement.js').default) });
app.model({ namespace: 'register', ...(require('D:/oa-workspace/ant-design-pro-master/src/pages/User/models/register.js').default) });
app.model({ namespace: 'activities', ...(require('D:/oa-workspace/ant-design-pro-master/src/pages/Dashboard/models/activities.js').default) });
app.model({ namespace: 'chart', ...(require('D:/oa-workspace/ant-design-pro-master/src/pages/Dashboard/models/chart.js').default) });
app.model({ namespace: 'monitor', ...(require('D:/oa-workspace/ant-design-pro-master/src/pages/Dashboard/models/monitor.js').default) });
app.model({ namespace: 'geographic', ...(require('D:/oa-workspace/ant-design-pro-master/src/pages/Account/Settings/models/geographic.js').default) });
