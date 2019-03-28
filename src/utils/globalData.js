/* 全局数据配置 */
export default {
  baseUrl: 'http://localhost:8080/', // 访问基础路径
  projectName: 'child-programming-background', // 项目名称
  successCode: 200, // 成功状态码
  failCode: 0, // 失败状态码
  GET: 'GET',
  POST: 'POST',
  initPagination: {
    total: 0,
    current: 1,
    pageSize: 10,
  },
  UPLOAD_IMG: {
    URL: 'http://localhost:8080/child-programming-background/upload/uploadFile?businessType=',
    MAX_SIZE: 2, // MB
  },
  FILE_UPLOAD_DIRECTORY_NAME: {
    STUDENT: 'student',
    TEACHER: 'teacher',
  },
  photoBaseUrl: 'http://localhost:8080/child-programming-background/upload_files/', // 图片访问基础路径
};
