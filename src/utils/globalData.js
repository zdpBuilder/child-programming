/* 全局数据配置 */
export default {
  baseUrl: 'http://localhost:8080/', // 访问基础路径
  scratchPlayerUrl:
    'http://localhost:8080/child-programming-background/assets/plugins/scratch-player/index.html',
  workDefaultBgUrl: 'http://localhost:8080/child-programming-background/assets/images/workBg.jpg',
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
    type: 'image/*,.pdf',
  },
  upLoadFileSetting: {
    maxSize: 1024, // MB
    type: 'video/*,image/*,.pdf,.doc,.docx,.zip,.sb3,.sb2', // 文件格式
  },
  fileUpLoadDirectoryName: {
    student: 'student',
    teacher: 'teacher',
    formalCourse: 'formalCourse',
    material: 'material',
    studentWork: 'studentWork',
    experienceCourse: 'experienceCourse',
  },
  photoBaseUrl: 'http://localhost:8080/child-programming-background/upload_files/', // 图片访问基础路径
  weekendData: ['一', '二', '三', '四', '五', '六', '日'], // 一周
};
