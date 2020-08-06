import Vue from 'vue'
import Router from 'vue-router'

// 用户管理
import Login from '@/pages/Login'
import Register from '@/pages/Register.vue'
import Home from '@/pages/Home'
import AdminManage from '@/pages/User/AdminManage'
import UserManage from '@/pages/User/UserManage'
// 公告
import Notice from '@/pages/Notice/Notice'
// 体育赛事
import AdminSportsEvent from '@/pages/Event/AdminSportsEvent'
import AdminReferee from '@/pages/Event/AdminReferee'
import UserSportsEvent from '@/pages/Event/UserSportsEvent'
import UserReferee from '@/pages/Event/UserReferee'
// 器材
import AdminEquipment from '@/pages/Equipment/AdminEquipment'
import AdminBookEquipment from '@/pages/Equipment/AdminBookEquipment'
import UserEquipment from '@/pages/Equipment/UserEquipment'
import Equipment from '@/pages/Equipment/Equipment'
// 场地
import AdminField from '@/pages/Field/AdminField'
import AdminClassField from '@/pages/Field/AdminClassField'
import AdminBreakPromise from '@/pages/Field/AdminBreakPromise'
import AdminFieldBook from '@/pages/Field/AdminFieldBook'
import UserField from '@/pages/Field/UserField'
// 类型
import Type from '@/pages/Type/Type'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/register',
      component: Register
    },
    {
      path: '/home',
      component: Home,
      children: [
        {
          path: '/',
          redirect: '/home/adminmanage'
        },
        {
          path: '/home/adminmanage',
          component: AdminManage,
        },
        {
          path: '/home/usermanage',
          component: UserManage
        },
        {
          path: '/home/adminsportsevent',
          component: AdminSportsEvent
        },
        {
          path: '/home/adminreferee',
          component: AdminReferee
        },
        {
          path: '/home/usersportsevent',
          component: UserSportsEvent
        },
        {
          path: '/home/userreferee',
          component: UserReferee
        },
        {
          path: '/home/adminequipment',
          component: AdminEquipment
        },
        {
          path: '/home/adminbookequipment',
          component: AdminBookEquipment
        },
        {
          path: '/home/userequipment',
          component: UserEquipment
        },
        {
          path: '/home/equipment',
          component: Equipment
        },
        {
          path: '/home/adminfield',
          component: AdminField
        },
        {
          path: '/home/adminfieldbook',
          component: AdminFieldBook
        },
        {
          path: '/home/adminclassfield',
          component: AdminClassField
        },
        {
          path: '/home/adminbreakpromise',
          component: AdminBreakPromise
        },
        {
          path: '/home/userfield',
          component: UserField
        },
        {
          path: '/home/notice',
          component: Notice
        },
        {
          path: '/home/type',
          component: Type
        }
      ]
    }
  ]
})
