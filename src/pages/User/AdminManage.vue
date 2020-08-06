<template>
  <div>
    <div class="top">
      <Row>
        <Col span="24">
          <div class="top-right">
            <Button type="primary" icon="md-add" @click="isAdd = true">添加</Button>
          </div>
        </Col>
      </Row>
    </div>

    <!-- 所有管理员信息 -->
    <div class="content">
      <Table border :columns="adminColumns" :data="admins">
        <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" size="small" style="margin-right: 5px" @click="clickUpdate(row)">编辑</Button>
          <Button
            type="error"
            size="small"
            style="margin-right: 5px"
            @click="clickDelete(row.adminId)"
          >删除</Button>
          <Button type="warning" size="small" @click="clickUpdatePassword(row)">修改密码</Button>
        </template>
      </Table>
    </div>

    <!-- 分页 -->
    <div class="bottom">
      <template>
        <Button type="primary" @click="prePage()">上一页</Button>
        <span>{{currentPage}}/{{totalPages}}</span>
        <Button type="primary" @click="nextPage()">下一页</Button>
      </template>
    </div>

    <!-- 添加 -->
    <Modal v-model="isAdd" title="添加">
      <Form ref="newAdmin" :model="newAdmin" :rules="newAdminValidate" :label-width="80">
        <FormItem label="账号" prop="username">
          <Input v-model="newAdmin.username" placeholder="请输入账号"></Input>
        </FormItem>
        <FormItem label="姓名" prop="name">
          <Input v-model="newAdmin.name" placeholder="请输入姓名"></Input>
        </FormItem>
        <FormItem label="手机号" prop="telephone">
          <Input v-model="newAdmin.telephone" placeholder="请输入手机号"></Input>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input type="password" v-model="newAdmin.password" placeholder="请输入密码"></Input>
        </FormItem>
        <FormItem label="密码确认" prop="passwdCheck">
          <Input type="password" v-model="newAdmin.passwdCheck" placeholder="请确认您的密码"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button style="float:left" @click="addCancel('newAdmin')">取消</Button>
        <Button type="info" @click="addCheck('newAdmin')">确认</Button>
      </div>
    </Modal>

    <!-- 编辑 -->
    <Modal v-model="isUpdate" title="编辑">
      <Form ref="updateAdmin" :model="updateAdmin" :rules="updateAdminValidate" :label-width="80">
        <FormItem label="账号" prop="username">
          <Input v-model="updateAdmin.username" placeholder="请输入账号"></Input>
        </FormItem>
        <FormItem label="姓名" prop="name">
          <Input v-model="updateAdmin.name" placeholder="请输入姓名"></Input>
        </FormItem>
        <FormItem label="手机号" prop="telephone">
          <Input v-model="updateAdmin.telephone" placeholder="请输入手机号"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button style="float:left" @click="isUpdate=false">取消</Button>
        <Button type="info" @click="updateCheck('updateAdmin')">确认</Button>
      </div>
    </Modal>

    <!-- 删除 -->
    <Modal v-model="isDelete" title="删除">
      <p style="textAlign:center">确认删除吗？</p>
      <div slot="footer">
        <Button style="float:left" @click="isDelete=false">取消</Button>
        <Button type="info" @click="removeCheck()">确认</Button>
      </div>
    </Modal>

    <!-- 修改密码 -->
    <Modal v-model="isUpdatePassword" title="修改密码">
      <Form ref="pwds" :model="pwds" :rules="pwdsValidate" :label-width="80">
        <FormItem label="密码" prop="password">
          <Input type="password" v-model="pwds.password" placeholder="请输入新密码"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button style="float:left" @click="updatePassword('pwds')">取消</Button>
        <Button type="info" @click="updatePasswordCheck('pwds')">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  reqAdmins,
  reqAddAdmin,
  reqDeleteAdmin,
  reqUpdateAdmin,
  reqUpdateAdminPwd
} from "../../api";

export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("密码不能为空"));
      } else {
        if (this.newAdmin.passwdCheck !== "") {
          // 对第二个密码框单独验证
          this.$refs.newAdmin.validateField("passwdCheck");
        }
        callback();
      }
    };
    const validatePassCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("密码不能为空"));
      } else if (value !== this.newAdmin.password) {
        callback(new Error("两次密码不一样"));
      } else {
        callback();
      }
    };
    return {
      isAdd: false,
      isUpdate: false,
      isDelete: false,
      isUpdatePassword: false,

      adminColumns: [
        { title: "账号", key: "username", align: "center" },
        { title: "姓名", key: "name", align: "center" },
        { title: "手机号", key: "tel", align: "center" },
        { title: "操作", slot: "action", align: "center" }
      ],
      admins: [], // 全部管理员信息

      // 添加的管理员信息
      newAdmin: {
        username: "",
        name: "",
        telephone: "",
        password: "",
        passwdCheck: ""
      },
      newAdminValidate: {
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" }
        ],
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        telephone: [
          { required: true, message: "手机号不能为空", trigger: "blur" }
        ],
        password: [
          {
            required: true,
            validator: validatePass,
            message: "密码不能为空",
            trigger: "blur"
          }
        ],
        passwdCheck: [
          { validator: validatePassCheck, required: true, trigger: "blur" }
        ]
      },

      id: "",

      // 更新的管理员信息
      updateAdmin: {
        username: "",
        name: "",
        telephone: ""
      },
      updateAdminValidate: {
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" }
        ],
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        telephone: [
          { required: true, message: "手机号不能为空", trigger: "blur" }
        ]
      },

      pwds: {
        password: ""
      },
      pwdValidate: {
        password: [{ required: true, message: "密码不能为空", trigger: "blur" }]
      },

      currentPage: 1,
      totalPages: 1
    };
  },
  mounted() {
    this.getAdmins();
  },
  methods: {
    // 获取所有的管理员信息
    async getAdmins() {
      let result = await reqAdmins(this.currentPage);
      if (result.status === 200) {
        this.admins = result.data.list;
        this.currentPage = result.data.currPage;
        this.totalPages = result.data.totalPage;
      }
    },

    // 确认添加
    addCheck(name) {
      let newAdmin = this.newAdmin;
      this.$refs[name].validate(async valid => {
        if (valid) {
          let result = await reqAddAdmin(
            newAdmin.username,
            newAdmin.name,
            newAdmin.telephone,
            newAdmin.password
          );
          if (result.status === 200) {
            this.$Message.success("添加成功");
            this.isAdd = false;
            this.getAdmins();
          } else {
            this.$Message.error(result.msg);
          }
        } else {
          this.$Message.error("添加失败");
        }
      });
    },

    // 取消添加
    addCancel(name) {
      this.$refs[name].resetFields();
      this.isAdd = false;
    },

    // 点击删除
    clickDelete(id) {
      this.id = id;
      this.isDelete = true;
    },

    // 确认删除
    async removeCheck() {
      let result = await reqDeleteAdmin(this.id);
      if (result.status === 200) {
        this.$Message.success("删除成功");
        this.getAdmins();
        this.isDelete = false;
      } else {
        this.$Message.error(result.msg);
      }
    },

    // 点击编辑
    clickUpdate(row) {
      this.id = row.adminId;
      this.updateAdmin.username = row.username;
      this.updateAdmin.name = row.name;
      this.updateAdmin.telephone = row.tel;
      this.isUpdate = true;
    },

    // 确认更新
    updateCheck(name) {
      let updateAdmin = this.updateAdmin;
      let id = this.id;

      this.$refs[name].validate(async valid => {
        if (valid) {
          let result = await reqUpdateAdmin(
            id,
            updateAdmin.username,
            updateAdmin.name,
            updateAdmin.telephone
          );

          if (result.status === 200) {
            this.$Message.success("更新成功");
            this.isUpdate = false;
            this.getAdmins();
          } else {
            this.$Message.error(result.msg);
          }
        } else {
          this.$Message.error("更新失败");
        }
      });
    },

    // 点击 修改密码
    clickUpdatePassword(row) {
      this.id = row.adminId;
      this.pwds.password = row.password;
      this.isUpdatePassword = true;
    },

    // 确认 修改密码
    updatePasswordCheck(name) {
      let pwds = this.pwds;
      let id = this.id;
      this.$refs[name].validate(async valid => {
        if (valid) {
          let result = await reqUpdateAdminPwd(id, pwds.password);
          if (result.status === 200) {
            this.$Message.success("修改成功");
            this.getAdmins();
            this.isUpdatePassword = false;
          } else {
            this.$Message.error(result.msg);
          }
        } else {
          this.$Message.error("修改失败");
        }
      });
    },

    // 取消 修改密码
    updatePassword(name) {
      this.$refs[name].resetFields();
      this.isUpdatePassword = false;
    },

    // 上一页
    async prePage() {
      let result = await reqAdmins(this.currentPage - 1);
      if (result.status === 200) {
        this.admins = result.data.list;
        this.currentPage = result.data.currPage;
        this.totalPages = result.data.totalPage;
      }
    },

    // 下一页
    async nextPage() {
      let result = await reqAdmins(this.currentPage + 1);
      if (result.status === 200) {
        this.admins = result.data.list;
        this.currentPage = result.data.currPage;
        this.totalPages = result.data.totalPage;
      }
    }
  }
};
</script>

<style>
.top-left {
  text-align: left;
}

.search {
  text-align: left;
}

.top-right {
  text-align: right;
}

.content {
  margin-top: 30px;
}

.bottom {
  float: right;
  margin: 20px 0 0;
}
</style>