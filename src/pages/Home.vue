<template>
  <div class="layout">
    <Layout>
      <Header>
        <Menu mode="horizontal" theme="dark" active-name="1">
          <div class="layout-logo">{{user.username}}</div>
          <div class="layout-nav">
            <Dropdown @on-click="dropdownClick">
              <a href="javascript:void(0)">
                设置
                <Icon type="ios-arrow-down"></Icon>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem name="logout">退出登录</DropdownItem>
                <DropdownItem name="editPassword" v-if="user.authority==1">修改密码</DropdownItem>
                <DropdownItem name="updateUser" v-if="user.authority==1">修改个人资料</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </Menu>
      </Header>

      <Layout>
        <Sider hide-trigger :style="{background: '#fff'}">
          <Menu active-name="/home/adminmanage" theme="light" width="auto">
            <MenuGroup title="用户管理" v-if="user.authority==0">
              <MenuItem name="/home/adminmanage" to="/home/adminmanage">管理员信息</MenuItem>
              <MenuItem name="/home/usermanage" to="/home/usermanage">用户信息</MenuItem>
            </MenuGroup>

            <MenuGroup title="体育赛事管理">
              <MenuItem
                name="/home/adminsportsevent"
                to="/home/adminsportsevent"
                v-if="user.authority==0"
              >赛事管理</MenuItem>
              <MenuItem
                name="/home/adminreferee"
                to="/home/adminreferee"
                v-if="user.authority==0"
              >裁判管理</MenuItem>
              <MenuItem
                name="/home/usersportsevent"
                to="/home/usersportsevent"
                v-if="user.authority==1"
              >赛事管理</MenuItem>
              <MenuItem
                name="/home/userreferee"
                to="/home/userreferee"
                v-if="user.authority==1"
              >裁判管理</MenuItem>
            </MenuGroup>

            <MenuGroup title="场地管理">
              <MenuItem
                name="/home/adminfield"
                to="/home/adminfield"
                v-if="user.authority==0"
              >场地信息管理</MenuItem>
              <MenuItem
                name="/home/adminclassfield"
                to="/home/adminclassfield"
                v-if="user.authority==0"
              >上课场地管理</MenuItem>
              <MenuItem
                name="/home/adminbreakpromise"
                to="/home/adminbreakpromise"
                v-if="user.authority==0"
              >失约处理</MenuItem>
              <MenuItem
                name="/home/adminfieldbook"
                to="/home/adminfieldbook"
                v-if="user.authority==0"
              >场地预约</MenuItem>
              <MenuItem name="/home/userfield" to="/home/userfield" v-if="user.authority==1">场地预约</MenuItem>
            </MenuGroup>

            <MenuGroup title="器材管理">
              <MenuItem
                name="/home/adminequipment"
                to="/home/adminequipment"
                v-if="user.authority==0"
              >器材管理</MenuItem>
              <MenuItem
                name="/home/adminbookequipment"
                to="/home/adminbookequipment"
                v-if="user.authority==0"
              >器材预约</MenuItem>
              <MenuItem name="/home/equipment" to="/home/equipment" v-if="user.authority==1">器材信息</MenuItem>
              <MenuItem
                name="/home/userequipment"
                to="/home/userequipment"
                v-if="user.authority==1"
              >器材预约</MenuItem>
            </MenuGroup>

            <MenuGroup title="其它" v-if="user.authority==0">
              <MenuItem name="/home/notice" to="/home/notice">馆内设施罚款条例公告</MenuItem>
              <MenuItem name="/home/type" to="/home/type">类型管理</MenuItem>
            </MenuGroup>
          </Menu>
        </Sider>

        <Layout :style="{padding: '24px', }">
          <Content :style="{padding: '24px', background: '#fff',minHeight:'0px'}">
            <router-view></router-view>
          </Content>
        </Layout>
      </Layout>
    </Layout>

    <!-- 修改密码 -->
    <Modal
      v-model="isEditPassword"
      title="修改密码"
      @on-ok="editPassword('pwds')"
      @on-cancel="editPasswordCancel('pwds')"
    >
      <Form ref="pwds" :model="pwds" :rules="pwdRule" :label-width="100">
        <FormItem label="原密码" prop="oldPassword">
          <Input type="password" v-model="pwds.oldPassword" placeholder="请输入您的原密码"></Input>
        </FormItem>
        <FormItem label="新密码" prop="passwd">
          <Input type="password" v-model="pwds.passwd" placeholder="请输入您的新密码"></Input>
        </FormItem>
        <FormItem label="新密码确认" prop="passwdCheck">
          <Input type="password" v-model="pwds.passwdCheck" placeholder="确认您的新密码"></Input>
        </FormItem>
      </Form>
    </Modal>

    <!-- 修改个人资料 -->
    <Modal
      v-model="isUpdate"
      title="修改个人资料"
      @on-ok="updateCheck('updateUser')"
      @on-cancel="updateCancel('updateUser')"
    >
      <Form ref="updateUser" :model="updateUser" :rules="updateUserValidate" :label-width="100">
        <FormItem label="名字" prop="name">
          <Input v-model="updateUser.name" placeholder="请输入您的姓名"></Input>
        </FormItem>
        <FormItem label="手机号" prop="telephone">
          <Input v-model="updateUser.telephone" placeholder="请输入您的手机号"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import {
  reqLogout,
  reqEditPassword,
  reqUserInfo,
  reqUpdateUserInfo
} from "../api";

export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("密码不能为空"));
      } else {
        if (this.pwds.passwdCheck !== "") {
          this.$refs.pwds.validateField("passwdCheck");
        }
        callback();
      }
    };
    const validatePassCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("密码不能为空"));
      } else if (value !== this.pwds.passwd) {
        callback(new Error("两次密码不一样"));
      } else {
        callback();
      }
    };
    return {
      isEditPassword: false,
      isUpdate: false,

      pwds: {
        oldPassword: "",
        passwd: "",
        passwdCheck: ""
      },
      pwdRule: {
        oldPassword: [
          { message: "密码不能为空", trigger: "blur", required: true }
        ],
        passwd: [{ validator: validatePass, trigger: "blur", required: true }],
        passwdCheck: [
          { validator: validatePassCheck, trigger: "blur", required: true }
        ]
      },

      updateUser: {
        name: "",
        telephone: ""
      },
      updateUserValidate: {
        name: [{ required: true, message: "名字不能为空", trigger: "blur" }],
        telephone: [
          { required: true, message: "手机号不能为空", trigger: "blur" }
        ]
      },

      user: {
        authority: "",
        username: ""
      }
    };
  },
  mounted() {
    this.user.username = window.localStorage.getItem("username");
    this.user.authority = window.localStorage.getItem("authority");
    if (!this.user.username) {
      this.$router.replace("/login");
    }
  },
  methods: {
    dropdownClick(name) {
      switch (name) {
        case "logout":
          this.logout();
          break;
        case "editPassword":
          this.isEditPassword = true;
          break;
        case "updateUser":
          this.isUpdate = true;
          this.getUerInfo();
          break;
      }
    },

    // 退出登录
    async logout() {
      let result = await reqLogout();
      if (result.status === 200) {
        window.localStorage.removeItem("username");
        window.localStorage.removeItem("authority");
        this.$router.replace("/login");
      }
    },

    // 确认 修改密码
    editPassword(name) {
      let pwds = this.pwds;

      this.$refs[name].validate(async valid => {
        if (valid) {
          let result = await reqEditPassword(pwds.passwd, pwds.oldPassword);
          if (result.status === 200) {
            this.$Message.info("修改密码成功");
            this.$refs[name].resetFields();
            this.isEditPassword = false;
          } else {
            this.$Message.error(result.msg);
          }
        } else {
          this.$Message.error("修改失败");
        }
      });
    },

    // 取消 修改密码
    editPasswordCancel(name) {
      this.$refs[name].resetFields();
    },

    // 获得 个人信息
    async getUerInfo() {
      let result = await reqUserInfo();
      if (result.status === 200) {
        this.updateUser.name = result.data.name;
        this.updateUser.telephone = result.data.tel;
      }
    },

    // 确认 修改个人资料
    updateCheck(name) {
      let updateUser = this.updateUser;
      let result;

      this.$refs[name].validate(async valid => {
        if (valid) {
          result = await reqUpdateUserInfo(
            updateUser.name,
            updateUser.telephone
          );
          if (result.status === 200) {
            this.$Message.success("修改成功");
            this.isUpdate = false;
          } else {
            this.$Message.error(result.msg);
          }
        } else {
          this.$Message.error("修改失败");
        }
      });
    },

    // 取消 修改个人资料
    updateCancel(name) {
      this.$refs[name].resetFields();
      this.isUpdate = false;
    }
  }
};
</script>

<style>
.layout {
  background: #e5e6e7;
  overflow: hidden;
}

.layout-logo {
  float: left;
  text-align: center;
  color: white;
}

.layout-nav {
  float: right;
}

.layout-nav a {
  color: white;
}
</style>