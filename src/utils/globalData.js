/* 全局数据配置 */
export default {
  baseUrl: 'http://localhost:8080/', // 访问基础路径
  projectName: 'child-programming-background', // 项目名称
  successCode: 200, // 成功状态码
  errorCode: 0, // 失败状态码
  GET: 'GET',
  POST: 'POST',
  initPagination: {
    total: 0,
    current: 1,
    pageSize: 10,
  },
};
