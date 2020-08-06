<template>
  <div class="register-div" :style="loginDivStyle">
    <div class="register">
      <p class="title">注 册</p>
      <Form ref="newUser" :model="newUser" :rules="newUserValidate" :label-width="80">
        <FormItem label="账号" prop="username">
          <Input type="text" v-model="newUser.username" placeholder="请输入您的账号"></Input>
        </FormItem>
        <FormItem label="姓名" prop="name">
          <Input type="text" v-model="newUser.name" placeholder="请输入您的名字"></Input>
        </FormItem>
        <FormItem label="手机号" prop="telephone">
          <Input type="text" v-model="newUser.telephone" placeholder="请输入您的账号"></Input>
        </FormItem>
        <FormItem label="密码" prop="passwd">
          <Input type="password" v-model="newUser.passwd" placeholder="请输入您的密码"></Input>
        </FormItem>
        <FormItem label="密码确认" prop="passwdCheck">
          <Input type="password" v-model="newUser.passwdCheck" placeholder="请确认您的密码"></Input>
        </FormItem>
        <FormItem>
          <Button @click="handleReset('newUser')" style="float:left">取消</Button>
          <Button type="primary" @click="handleSubmit('newUser')" style="float:right">注册</Button>
        </FormItem>
      </Form>
      <router-link to="/login">
        <p class="text">登录</p>
      </router-link>
    </div>
  </div>
</template>

<script>
import { reqRegister } from "../api";

export default {
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error("用户名不能为空"));
      } else {
        callback();
      }
    };
    const validateName = (rule, value, callback) => {
      if (!value) {
        callback(new Error("姓名不能为空"));
      } else {
        callback();
      }
    };
    const validateTelephone = (rule, value, callback) => {
      if (!value) {
        callback(new Error("手机号不能为空"));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("密码不能为空"));
      } else {
        if (this.newUser.passwdCheck !== "") {
          // 对第二个密码框单独验证
          this.$refs.newUser.validateField("passwdCheck");
        }
        callback();
      }
    };
    const validatePassCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("密码不能为空"));
      } else if (value !== this.newUser.passwd) {
        callback(new Error("两次密码不一样"));
      } else {
        callback();
      }
    };

    return {
      loginDivStyle: {
        backgroundImage: "url(" + require("../assets/images/bg1.jpg") + ")"
      },

      newUser: {
        username: "",
        name: "",
        telephone: "",
        passwd: "",
        passwdCheck: ""
      },
      newUserValidate: {
        username: [
          { validator: validateUsername, required: true, trigger: "blur" }
        ],
        name: [{ validator: validateName, required: true, trigger: "blur" }],
        telephone: [
          { validator: validateTelephone, required: true, trigger: "blur" }
        ],
        passwd: [{ validator: validatePass, required: true, trigger: "blur" }],
        passwdCheck: [
          { validator: validatePassCheck, required: true, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 注册
    handleSubmit(name) {
      let newUser = this.newUser;

      this.$refs[name].validate(async valid => {
        if (valid) {
          let result = await reqRegister(
            newUser.username,
            newUser.name,
            newUser.telephone,
            newUser.passwd
          );

          if (result.status === 200) {
            this.$Message.success("注册成功");
            this.$router.replace("/login");
          }else{
            this.$Message.error(result.msg);
          }
        } else {
          this.$Message.error("注册失败");
        }
      });
    },

    // 取消 注册
    handleReset(name) {
      this.$refs[name].resetFields();
      this.$router.replace("/login");
    }
  }
};
</script>

<style>
.register-div {
  height: 100%;
  width: 100%;

  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */

  position: absolute;
  background-repeat: no-repeat;
  background-size: cover;
}

.register {
  width: 500px;
  /* margin: 120px auto 0; */
  padding: 30px;
  background: rgb(9, 187, 231, 0.7);
  border-radius: 20px;
}

.register {
  text-align: center;
  margin-bottom: 12px;
  color: white;
  font-size: 21px;
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
</style>