import ajax from './ajax'

/**
 * 用户管理
 */
// 登录
export const reqLogin = (username, password, type) => ajax('/srs/auth/login', { username, password, type }, 'POST');

// 注册
export const reqRegister = (username, name, tel, password) => ajax('/srs/auth/register', { username, name, tel, password }, 'POST');

// 退出登录
export const reqLogout = () => ajax('/srs/auth/logout', {}, 'POST');

// 修改密码
export const reqEditPassword = (password, oldPassword) => ajax('/srs/client/user/updatePassword', { password, oldPassword }, 'POST');

// 接收用户信息
export const reqUserInfo = () => ajax('/srs/client/user/info', {}, 'POST');

// 修改用户个人资料
export const reqUpdateUserInfo = (name, tel) => ajax('/srs/client/user/update', { name, tel }, 'POST');

/** 管理员管理 */
// 获取所有管理员的信息
export const reqAdmins = (pageNum) => ajax('/srs/sys/admin/list', { pageNum }, 'POST');

// 添加管理员
export const reqAddAdmin = (username, name, tel, password) => ajax('/srs/sys/admin/save', { username, name, tel, password }, 'POST');

// 删除管理员
export const reqDeleteAdmin = (adminIds) => ajax('/srs/sys/admin/delete', { adminIds }, 'POST');

// 修改密码
export const reqUpdateAdminPwd = (adminId, password) => ajax('/srs/sys/admin/updatePassword', { adminId, password }, 'POST');

// 更新管理员
export const reqUpdateAdmin = (adminId, username, name, tel) => ajax('/srs/sys/admin/update', { adminId, username, name, tel }, 'POST');

/** 用户管理 */
// 获取所有普通用户的信息
export const reqUsers = (pageNum) => ajax('/srs/sys/user/list', { pageNum }, 'POST');

// 删除用户
export const reqDeleteUser = (userIds) => ajax('/srs/sys/user/delete', { userIds }, 'POST');

// 修改密码
export const reqUpdateUserPwd = (userId, password) => ajax('/srs/sys/user/updatePassword', { userId, password }, 'POST');




/**
 * 公告
 */
/** 管理员 公告 */
// 获取公告
export const reqNotice = () => ajax('/srs/sys/notice/info', {}, 'POST');

// 更新公告
export const reqUpdateNotice = (title, content, noticeId) => ajax('/srs/sys/notice/update', { title, content, noticeId }, 'POST');

/** 登陆时 查看公告 */
export const reqGetNotice = () => ajax('/srs/auth/notice/info', {}, 'POST');



/**
 * 器材管理
 */
/** 管理员  器材管理 */
// 获取所有器材信息
export const reqEquipments = (typeId, pageNum) => ajax('/srs/sys/kit/list', { typeId, pageNum }, 'POST');

// 添加
export const reqAddEquipment = (message, name, price, typeId) => ajax('/srs/sys/kit/insert', { message, name, price, typeId }, 'POST');

// 删除
export const reqDeleteEquipment = (kitIds) => ajax('/srs/sys/kit/delete', { kitIds }, 'POST');

// 更新
export const reqUpdateEquipment = (kitId, message, name, price, typeId) => ajax('/srs/sys/kit/update', { kitId, message, name, price, typeId }, 'POST');

// 统计某类器材
export const reqCountByType = (typeId) => ajax('/srs/sys/kit/countByType', { typeId }, 'POST');

/** 管理员  器材预约*/
// 获取信息
export const reqBookEquipments = (pageNum) => ajax('/srs/sys/kit/book/list', { pageNum }, 'POST');

// 删除
export const reqDeleteBookEquipment = (kitBookIds) => ajax('/srs/sys/kit/book/delete', { kitBookIds }, 'POST');

// 更新状态为租借中
export const reqBookUse = (kitBookId) => ajax('/srs/sys/kit/book/use', { kitBookId }, 'POST');

// 更新状态为损坏
export const reqBookDamage = (kitBookId) => ajax('/srs/sys/kit/book/damage', { kitBookId }, 'POST');

// 更新状态为归还
export const reqBookBack = (kitBookId) => ajax('/srs/sys/kit/book/back', { kitBookId }, 'POST');


/** 用户  器材管理 */
// 获取所有器材信息
export const reqUserEquipments = (typeId, pageNum) => ajax('/srs/client/kit/list', { typeId, pageNum }, 'POST');

// 预约
export const reqUserBookEquipment = (endTime, startTime, typeId, kitId) => ajax('/srs/client/kit/book/insert', { endTime, startTime, typeId, kitId }, 'POST');


/** 用户 器材预约 */
// 获取信息
export const reqUserBookEquipments = (pageNum) => ajax('/srs/client/kit/book/list', { pageNum }, 'POST');

// 取消预约
export const reqCancelUserBook = (kitBookId) => ajax('/srs/client/kit/book/cancel', { kitBookId }, 'POST');





/**
 * 赛事管理
 */
//上传图片
export const reqImg = (file) => ajax('/srs/sys/file/uploadPic', { file }, 'POST');

/** 管理员  赛事管理 */
// 获取所有赛事信息
export const reqEvents = (pageNum) => ajax('/srs/sys/competition/list', { pageNum }, 'POST');

// 器材预约情况
export const reqAdminEventEquips = (startTime, endTime, userId) => ajax('/srs/sys/kit/book/listByUserId', { startTime, endTime, userId }, 'POST');

// 场地预约情况
export const reqAdminEventFields = (startTime, endTime, userId) => ajax('/srs/sys/gym/book/listByUserId', { startTime, endTime, userId }, 'POST');

//  删除
export const reqDeleteEvent = (competitionIds) => ajax('/srs/sys/competition/delete', { competitionIds }, 'POST');

// 审核通过
export const reqApprove = (competitionId) => ajax('/srs/sys/competition/success', { competitionId }, 'POST');

// 审核不通过  拒绝
export const reqReject = (competitionId) => ajax('/srs/sys/competition/fail', { competitionId }, 'POST');

/** 管理员  裁判管理 */
// 获取所有裁判信息
export const reqReferees = (pageNum) => ajax('/srs/sys/referee/list', { pageNum }, 'POST');

// 添加
export const reqAddReferee = (head, intro, name, tel, typeId) => ajax('/srs/sys/referee/insert', { head, intro, name, tel, typeId }, 'POST');

// 删除
export const reqDeleteReferee = (refereeIds) => ajax('/srs/sys/referee/delete', { refereeIds }, 'POST');

// 更新
export const reqUpdateReferee = (head, intro, name, refereeId, tel, typeId) => ajax('/srs/sys/referee/update', { head, intro, name, refereeId, tel, typeId }, 'POST');

/** 用户  赛事管理 */
// 获取所有赛事信息
export const reqUserEvents = (pageNum) => ajax('/srs/client/competition/list', { pageNum }, 'POST');

// 获取单个赛事信息
export const reqUserEvent = (competitionId) => ajax('/srs/client/competition/info', { competitionId }, 'POST');

// 添加
export const reqUserAddEvent = (endTime, intro, startTime, title, typeId) => ajax('/srs/client/competition/insert', { endTime, intro, startTime, title, typeId }, 'POST');

// 取消
export const reqUserCancelEvent = (competitionId) => ajax('/srs/client/competition/cancel', { competitionId }, 'POST');

// 更新
export const reqUserUpdateEvent = (competitionId, endTime, intro, startTime, title, typeId) => ajax('/srs/client/competition/update', { competitionId, endTime, intro, startTime, title, typeId }, 'POST');

// 获取器材预约情况
export const reqEventEquipments = (startTime, endTime) => ajax('/srs/client/kit/book/list', { startTime, endTime }, 'POST');

// 获取场地预约情况
export const reqEventFields = (startTime, endTime) => ajax('/srs/client/gym/book/list', { startTime, endTime }, 'POST');

/** 用户 裁判简介 */
// 获取所有裁判信息
export const reqUserReferees = (pageNum) => ajax('/srs/client/referee/list', { pageNum }, 'POST');




/**
 * 场地管理
 */
/** 管理员 场地信息管理 */
// 获取所有场地信息
export const reqFields = (pageNum) => ajax('/srs/sys/gym/list', { pageNum }, 'POST');

// 添加
export const reqAddField = (locate, price, status, typeId) => ajax('/srs/sys/gym/insert', { locate, price, status, typeId }, 'POST');

// 删除
export const reqDeleteField = (gymIds) => ajax('/srs/sys/gym/delete', { gymIds }, 'POST');

// 更新
export const reqUpdateField = (gymId, locate, price, status, typeId) => ajax('/srs/sys/gym/update', { gymId, locate, price, status, typeId }, 'POST')

/** 管理员 上课场地管理 */
/** 管理员 课程管理 */
// 获取课程
export const reqCourses = (pageNum) => ajax('/srs/sys/course/list', { pageNum }, 'POST');

// 添加课程
export const reqAddCourse = (typeId, courseName, teacherName) => ajax('/srs/sys/course/insert', { typeId, courseName, teacherName }, 'POST');

// 删除课程
export const reqDeleteCourse = (courseIds) => ajax('/srs/sys/course/delete', { courseIds }, 'POST');

// 更新课程
export const reqUpdateCourse = (courseId, typeId, courseName, teacherName) => ajax('/srs/sys/course/update', { courseId, typeId, courseName, teacherName }, 'POST');

/** 管理员 课程场地管理 */
// 获取上课场地的信息
export const reqClassFields = (courseId, pageNum) => ajax('/srs/sys/course/gym/list', { courseId, pageNum }, 'POST');

// 获取场地位置
export const reqFieldPlaces = (typeId) => ajax('/srs/sys/gym/list', { typeId }, 'POST');

// 添加
export const reqAddClassField = (courseId, startTime, endTime, gymId, typeId) => ajax('/srs/sys/course/gym/insert', { courseId, startTime, endTime, gymId, typeId }, 'POST');

// 删除
export const reqDeleteClassField = (courseGymIds) => ajax('/srs/sys/course/gym/delete', { courseGymIds }, 'POST');

/** 管理员 违约处理 */
// 获取所有信息
export const reqPromises = (pageNum) => ajax('/srs/sys/gym/default/list', { pageNum }, 'POST');

// 取消禁用
export const reqCancelPromise = (gymDefaultId) => ajax('/srs/sys/gym/default/cancel', { gymDefaultId }, 'POST');

// 新增
export const reqAddPromise = (endTime, reason, startTime, username) => ajax('/srs/sys/gym/default/insert', { endTime, reason, startTime, username }, 'POST');

/** 管理员 场地预约 */
// 获取所有信息
export const reqBookFields = (pageNum) => ajax('/srs/sys/gym/book/list', { pageNum }, 'POST');

// 根据gymBookId获取可用场地
export const reqPlaces = (gymBookId) => ajax('/srs/sys/gym/book/listAvailable', { gymBookId }, 'POST');

// 批准
export const reqApproveBook = (gymBookId, gymId) => ajax('/srs/sys/gym/book/success', { gymBookId, gymId }, 'POST');

// 拒绝
export const reqRejectBook = (gymBookId) => ajax('/srs/sys/gym/book/fail', { gymBookId }, 'POST');

// 获取可用场地
export const reqAvailableFields = (gymBookId) => ajax('/srs/sys/gym/book/listAvailable', { gymBookId }, 'POST');

/** 普通用户 场地预约 */
// 获取场地信息
export const reqUserFields = (pageNum) => ajax('/srs/client/gym/book/list', { pageNum }, 'POST');

// 取消申请
export const reqCancelBook = (gymBookId) => ajax('/srs/client/gym/book/cancel', { gymBookId }, 'POST');

// 提交申请
export const reqCheckBook = (endTime, reason, startTime, typeId) => ajax('/srs/client/gym/book/insert', { endTime, reason, startTime, typeId }, 'POST');



/**
 * 类型管理
 */
// 获取类型
export const reqTypes = () => ajax('/srs/sys/type/list', {}, 'POST');

// 添加类型
export const reqAddType = (name) => ajax('/srs/sys/type/insert', { name }, 'POST');

// 用户 获取类型
export const reqUserTypes = () => ajax('/srs/client/type/list', {}, 'POST');

/**
 * 时间段
 */
// 管理员 获取时间段
export const reqTimes = () => ajax('/srs/sys/time/all', {}, 'POST');

// 用户 获取时间段
export const reqUserTimes = () => ajax('/srs/client/time/all', {}, 'POST');