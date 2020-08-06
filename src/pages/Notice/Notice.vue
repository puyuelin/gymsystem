<template>
  <div>
    <div class="container">
      <div class="content">
        <h1 class="title">{{notice.title}}</h1>
        <div class="context">{{notice.content}}</div>
      </div>
    </div>

    <div class="action">
      <Button class="update-btn" type="warning" @click="clickUpdate()">更新</Button>
    </div>

    <!-- 更新 -->
    <Modal v-model="isUpdate" title="更新">
      <Form
        ref="updateNotice"
        :model="updateNotice"
        :rules="updateNoticeValidate"
        :label-width="80"
        class-name="vertical-center-modal"
      >
        <FormItem label="标题" prop="title">
          <Input v-model="updateNotice.title" placeholder="请输入您的标题"></Input>
        </FormItem>
        <FormItem label="正文" prop="content">
          <Input
            type="textarea"
            size="large"
            rows="15"
            v-model="updateNotice.content"
            placeholder="请输入您的正文"
          ></Input>
        </FormItem>
      </Form>

      <div slot="footer">
        <Button style="float:left" type="info" @click="updateCancel('updateNotice')">取消</Button>
        <Button type="error" @click="updateCheck('updateNotice')">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { reqNotice, reqUpdateNotice } from "../../api";

export default {
  data() {
    return {
      isDelete: false,
      isUpdate: false,

      notice: {
        title: "",
        content: ""
      },

      // 更新
      updateNotice: {
        title: "",
        content: ""
      },
      updateNoticeValidate: {
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        content: [{ required: true, message: "正文不能为空", trigger: "blur" }]
      },
      noticeId: 1
    };
  },
  mounted() {
    this.getNotice();
  },
  methods: {
    // 获取公告
    async getNotice() {
      let notice = this.notice;
      let result = await reqNotice();
      if (result.status === 200) {
        notice.title = result.data.title;
        notice.content = result.data.content;
        this.noticeId = result.data.noticeId;
      }
    },

    // 点击 更新
    clickUpdate() {
      this.isUpdate = true;
    },

    // 确认 更新
    updateCheck(name) {
      let updateNotice = this.updateNotice;
      let noticeId = this.noticeId;
      this.$refs[name].validate(async valid => {
        if (valid) {
          let result = await reqUpdateNotice(
            updateNotice.title,
            updateNotice.content,
            noticeId
          );
          if (result.status === 200) {
            this.$Message.success("更新成功");
            this.getNotice();
            this.isUpdate = false;
          }else{
            this.$Message.error(result.msg)
          }
        } else {
          this.$Message.error("更新失败");
        }
      });
    },

    // 取消 更新
    updateCancel(name) {
      this.$refs[name].resetFields();
      this.isUpdate = false;
    }
  }
};
</script>

<style>
.container {
  background: rgb(106, 204, 243);
  color: white;
  border-radius: 15px;
  width: 960px;
  margin: 0 auto;
}

.title {
  text-align: center;
}

.content {
  padding: 20px;
}

.context {
  line-height: 24px;
  font-size: 16px;
}

.action {
  margin-top: 20px;
  width: 960px;
  margin: 20px auto 0;
}

.delete-btn {
  float: left;
}

.update-btn {
  float: right;
}

.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>