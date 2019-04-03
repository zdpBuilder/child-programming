/* 全局数据配置 */
export default {
  baseUrl: 'http://localhost:8080/', // 访问基础路径
  projectName: 'child-programming-background', // 项目名称
  successCode: 200, // 成功状态码
  failCode: 0, // 失败状态码
  GET: 'GET',
  POST: 'POST',
  initPagination: {
    // 分页信息初始化
    total: 0, // 数据量
    current: 1, // 当前页数
    pageSize: 10, // 每页显示的数据量
  },
  upLoadImgSetting: {
    url: 'http://localhost:8080/child-programming-background/upload/uploadFile?businessType=',
    maxSize: 2, // MB
  },
  fileUpLoadDirectoryName: {
    student: 'student',
    teacher: 'teacher',
  },
  photoBaseUrl: 'http://localhost:8080/child-programming-background/upload_files/', // 图片访问基础路径
  weekendData: ['一', '二', '三', '四', '五', '六', '日'], // 一周
  timeData: () => {
    const time = [];
    for (let i = 0; i < 24; i += 1) {
      time[i] = {};
      time[i].value = i;
      time[i].label = `${i}时`;
      const children = [];
      for (let j = 0; j <= 60; j += 1) {
        children[j] = {};
        children[j].value = j;
        children[j].label = `${j}分`;
      }
      time[i].children = children;
    }
    return time;
  }, // 时分
};
