import { axiosPostJ, axiosG, axiosD, axiosPutJ, axiosF } from "@/api/axios";

export const visitApi = (data) => axiosG("/", data); //登记

export const loginApi = (data) => axiosPostJ("/user/login", data); //登录
export const logoutApi = (data) => axiosD("/user/logout", data); //退出登录
export const getUserInfoApi = (data) => axiosG("/user/info", data); //拉取个人信息
export const editUserInfoApi = (data) => axiosPutJ("/user/updateInfo", data); //修改个人信息
export const initMenuApi = (data) => axiosG("/user/initMenu", data); //获取菜单更新权限
export const sendForgetEmailApi = (data) =>
  axiosG("/user/sendForgetEmail", data); //发送找回密码验证码邮件
export const getForgetPassTokenApi = (data) =>
  axiosG("/user/getForgetPassToken", data); //邮件验证并返回重置密码临时Token
export const updatePassBySessionTokenApi = (data) =>
  axiosPostJ("/user/updatePassBySessionToken", data); //sessionToken验证并设置新密码
export const getLoginCaptchaApi = (data) =>
  axiosG("/user/getLoginCaptcha", data); //获取登录验证码

export const userListApi = (data) => axiosG("/user/list", data); //获取用户列表
export const studentListApi = (data) => axiosG("/user/studentList", data); //获取学生列表
export const readUserApi = (data) => axiosG("/user/read", data); //读取指定用户
export const delUserApi = (data) => axiosD("/user/del", data); //获取用户列表
export const addUserApi = (data) => axiosPostJ("/user/add", data); //新增用户
export const editUserApi = (data) => axiosPutJ("/user/edit", data); //编辑用户

//角色
export const roleListApi = (data) => axiosG("/role/list", data); //获取列表
export const readRoleApi = (data) => axiosG("/role/read", data); //读取指定
export const delRoleApi = (data) => axiosD("/role/del", data); //获取列表
export const addRoleApi = (data) => axiosPostJ("/role/add", data); //新增
export const editRoleApi = (data) => axiosPutJ("/role/edit", data); //编辑

//部门
export const deptListApi = (data) => axiosG("/dept/list", data); //获取列表
export const delDeptApi = (data) => axiosD("/dept/del", data); //获取列表
export const addDeptApi = (data) => axiosPostJ("/dept/add", data); //新增
export const editDeptApi = (data) => axiosPutJ("/dept/edit", data); //编辑
// export const exportDeptApi = (data) => axiosG('/dept/edit', data) //导出

//菜单
export const menuListApi = (data) => axiosG("/menu/list", data); //获取列表
export const delMenuApi = (data) => axiosD("/menu/del", data); //获取列表
export const addMenuApi = (data) => axiosPostJ("/menu/add", data); //新增
export const editMenuApi = (data) => axiosPutJ("/menu/edit", data); //编辑
// export const exportMenuApi = (data) => axiosG('/menu/edit', data) //导出

//配置
export const configListApi = (data) => axiosG("/config/list", data); //获取列表
export const readConfigApi = (data) => axiosG("/config/read", data); //读取指定
export const delConfigApi = (data) => axiosD("/config/del", data); //获取列表
export const addConfigApi = (data) => axiosPostJ("/config/add", data); //新增
export const editConfigApi = (data) => axiosPutJ("/config/edit", data); //编辑
// export const exportConfigApi = (data) => axiosG('/config/edit', data) //导出

//文章
export const articleListApi = (data) => axiosG("/article/list", data); //获取列表
export const readArticleApi = (data) => axiosG("/article/read", data); //读取指定
export const delArticleApi = (data) => axiosD("/article/del", data); //获取列表
export const addArticleApi = (data) => axiosPostJ("/article/add", data); //新增
export const editArticleApi = (data) => axiosPutJ("/article/edit", data); //编辑
// export const exportArticleApi = (data) => axiosG('/article/edit', data) //导出

//学校
export const schoolListApi = (data) => axiosG("/school/list", data); //获取文章列表
export const readSchoolApi = (data) => axiosG("/school/read", data); //读取指定
export const delSchoolApi = (data) => axiosD("/school/del", data); //获取列表
export const addSchoolApi = (data) => axiosPostJ("/school/add", data); //新增
export const editSchoolApi = (data) => axiosPutJ("/school/edit", data); //编辑
// export const exportSchoolApi = (data) => axiosG('/school/edit', data) //导出

//教练
export const coachListApi = (data) => axiosG("/coach/list", data); //获取列表
export const readCoachApi = (data) => axiosG("/coach/read", data); //读取指定
export const delCoachApi = (data) => axiosD("/coach/del", data); //获取列表
export const addCoachApi = (data) => axiosPostJ("/coach/add", data); //新增
export const editCoachApi = (data) => axiosPutJ("/coach/edit", data); //编辑
// export const exportCoachApi = (data) => axiosG('/coach/edit', data) //导出

//科一考试安排
export const subject1ExamListApi = (data) => axiosG("/subject1Exam/list", data); //获取列表
export const readSubject1ExamApi = (data) => axiosG("/subject1Exam/read", data); //读取指定
export const delSubject1ExamApi = (data) => axiosD("/subject1Exam/del", data); //获取列表
export const addSubject1ExamApi = (data) =>
  axiosPostJ("/subject1Exam/add", data); //新增
export const editSubject1ExamApi = (data) =>
  axiosPutJ("/subject1Exam/edit", data); //编辑
// export const exportSubject1ExamApi = (data) => axiosG('/subject1Exam/edit', data) //导出

//科二三预约
export const subject23AppointmentListApi = (data) =>
  axiosG("/subject23Appointment/list", data); //获取列表
export const readSubject23AppointmentApi = (data) =>
  axiosG("/subject23Appointment/read", data); //读取指定
export const delSubject23AppointmentApi = (data) =>
  axiosD("/subject23Appointment/del", data); //获取列表
export const addSubject23AppointmentApi = (data) =>
  axiosPostJ("/subject23Appointment/add", data); //新增
export const editSubject23AppointmentApi = (data) =>
  axiosPutJ("/subject23Appointment/edit", data); //编辑
// export const exportSubject23AppointmentApi = (data) => axiosG('/subject23Appointment/edit', data) //导出

//科二三考试安排
export const subject23ExamListApi = (data) =>
  axiosG("/subject23Exam/list", data); //获取列表
export const readSubject23ExamApi = (data) =>
  axiosG("/subject23Exam/read", data); //读取指定
export const delSubject23ExamApi = (data) => axiosD("/subject23Exam/del", data); //获取列表
export const addSubject23ExamApi = (data) =>
  axiosPostJ("/subject23Exam/add", data); //新增
export const editSubject23ExamApi = (data) =>
  axiosPutJ("/subject23Exam/edit", data); //编辑
// export const exportSubject23ExamApi = (data) => axiosG('/subject23Exam/edit', data) //导出

//上传
export const uploadPictureURL = "/file/upload"; //上传图片URL
export const uploadPictureApi = (data) => axiosF(uploadPictureURL, data); //上传图片
