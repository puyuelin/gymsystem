<template>
  <div class="login-div" :style="loginDivStyle">
    <div v-if="!isNotice">
      <div class="login">
        <p class="title">登 录</p>
        <Form ref="user" :model="user" :rules="userValidate" :label-width="80">
          <FormItem label="账号" prop="username">
            <Input v-model="user.username" placeholder="请输入您的账号"></Input>
          </FormItem>
          <FormItem label="密码" prop="password">
            <Input type="password" v-model="user.password" placeholder="请输入您的密码"></Input>
          </FormItem>
          <FormItem label="权限" prop="authority">
            <RadioGroup v-model="user.authority">
              <Radio label="0">管理员</Radio>
              <Radio label="1">学生</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="公告" prop="notice">
            <RadioGroup v-model="user.notice">
              <Radio label="0">
                <span @click="clickNotice">同意公告？</span>
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem>
            <Button @click="handleReset('user')">取消</Button>
            <Button type="primary" @click="handleSubmit('user')" style="float:right">确认</Button>
          </FormItem>
        </Form>
        <div>
          <router-link to="/register">
            <p class="text">注册</p>
          </router-link>
        </div>
      </div>
    </div>

    <div class="notice" v-else>
      <div>
        <h1 class="title">{{notice.title}}</h1>
        <p class="context">{{notice.content}}</p>
        <div style="textAlign:center;marginTop:20px">
          <Button type="primary" @click="isNotice=false">确认</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reqLogin, reqGetNotice } from "../api";

export default {
  data() {
    return {
      isNotice: false,

      loginDivStyle: {
        backgroundImage: "url(" + require("../assets/images/bg1.jpg") + ")"
      },

      user: {
        username: "",
        password: "",
        authority: "",
        notice: ""
      },
      userValidate: {
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ],
        authority: [
          { required: true, message: "请选择您的权限", trigger: "change" }
        ],
        notice: [{ required: true, message: "请同意公告", trigger: "change" }]
      },

      notice: {
        title: "",
        content: ""
      }
    };
  },
  mounted() {
    if (this.user.username) {
      this.$router.replace("/home");
    }
  },
  methods: {
    // 登录
    handleSubmit(name) {
      let user = this.user;
      let result;
      this.$refs[name].validate(async valid => {
        if (valid) {
          result = await reqLogin(user.username, user.password, user.authority);
          if (result.status === 200) {
            this.$Message.success("登录成功");
            this.$router.replace("/home");
            window.localStorage.setItem("username", user.username);
            window.localStorage.setItem("authority", user.authority);
            window.localStorage.setItem("token", result.data.token);
          } else {
            this.$Message.error(result.msg);
          }
        } else {
          this.$Message.error("登录失败");
        }
      });
    },
    // 取消登录
    handleReset(name) {
      this.$refs[name].resetFields();
    },

    // 点击公告
    clickNotice() {
      this.isNotice = true;
      this.getNotice();
    },

    // 获取公告信息
    async getNotice() {
      let result = await reqGetNotice();
      if (result.status === 200) {
        this.notice.title = result.data.title;
        this.notice.content = result.data.content;
      }
    }
  }
};
</script>

<style>
.login-div {
  height: 100%;
  width: 100%;

  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */

  position: absolute;
  background-repeat: no-repeat;
  background-size: cover;
}

.login {
  width: 500px;
  /* margin: 200px auto 0; */
  padding: 30px;
  background: rgb(9, 187, 231, 0.7);
  border-radius: 20px;
}

.title {
  text-align: center;
  margin-bottom: 12px;
  color: white;
  font-size: 21px;
}

.text {
  font-size: 14px;
  text-align: right;
  color: rgb(212, 211, 211);
}

.text:hover {
  color: white;
}

.notice {
  width: 500px;
  max-height: 500px;
  overflow-y: scroll;
  margin: 200px auto 0;
  padding: 20px;
  background: rgb(9, 187, 231, 0.7);
  color: white;
}

.notice .title {
  text-align: center;
}
</style>
