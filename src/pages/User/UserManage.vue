<template>
  <div>
    <!-- 所有用户信息 -->
    <div>
      <Table border :columns="userColumns" :data="users">
        <template slot-scope="{ row, index }" slot="action">
          <Button
            style="margin-right: 5px"
            type="error"
            size="small"
            @click="clickDelete(row.userId)"
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

    <!-- 删除 -->
    <Modal v-model="isDelete" title="删除">
      <p style="textAlign:center">确认删除吗？</p>
      <div slot="footer">
        <Button style="float:left" @click="isDelete=false">取消</Button>
        <Button type="info" @click="removeCheck()">确认</Button>
      </div>
    </Modal>

    <!-- 修改密码 -->
    <Modal v-model="isUpdate" title="修改密码">
      <Form ref="pwds" :model="pwds" :rules="pwdsValidate" :label-width="80">
        <FormItem label="密码" prop="password">
          <Input type="password" v-model="pwds.password" placeholder="请输入您的密码"></Input>
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
import { reqUsers, reqDeleteUser, reqUpdateUserPwd } from "../../api";

export default {
  data() {
    return {
      isUpdate: false,
      isDelete: false,

      id: "",

      // 全部用户信息
      userColumns: [
        { title: "账号", key: "username", align: "center" },
        { title: "姓名", key: "name", align: "center" },
        { title: "手机号", key: "tel", align: "center" },
        { title: "操作", slot: "action", align: "center" }
      ],
      users: [],
      pwds: {
        password: ""
      },
      pwdsValidate: {
        password: [{ required: true, trigger: "blur", message: "密码不能为空" }]
      },

      currentPage: 1,
      totalPages: 1
    };
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    // 获取所有的普通用户信息
    async getUsers() {
      let result = await reqUsers(this.currentPage);
      if (result.status === 200) {
        this.users = result.data.list;
        this.currentPage = result.data.currPage;
        this.totalPages = result.data.totalPage;
      }
    },

    // 点击删除
    clickDelete(id) {
      this.id = id;
      this.isDelete = true;
    },

    // 确认删除
    async removeCheck() {
      let id = this.id;
      let result = await reqDeleteUser(id);
      if (result.status === 200) {
        this.$Message.success("删除成功");
        this.getUsers();
        this.isDelete = false;
      } else {
        this.$Message.error(result.msg);
      }
    },

    // 点击 修改密码
    clickUpdatePassword(row) {
      this.id = row.userId;
      this.pwds.password = row.password;
      this.isUpdate = true;
    },

    // 确认 修改密码
    updatePasswordCheck(name) {
      let pwds = this.pwds;
      let id = this.id;
      this.$refs[name].validate(async valid => {
        if (valid) {
          let result = await reqUpdateUserPwd(id, pwds.password);
          if (result.status === 200) {
            this.$Message.success("修改成功");
            this.getUsers();
            this.isUpdate = false;
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
      this.isUpdate = false;
    },

    // 上一页
    async prePage() {
      let result = await reqUsers(this.currentPage - 1);
      if (result.status === 200) {
        this.users = result.data.list;
        this.currentPage = result.data.currPage;
        this.totalPages = result.data.totalPage;
      }
    },

    // 下一页
    async nextPage() {
      let result = await reqUsers(this.currentPage + 1);
      if (result.status === 200) {
        this.users = result.data.list;
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
  text-align: center;
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