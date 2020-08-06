<template>
  <div>
    <div class="top">
      <Row>
        <Col span="24">
          <div class="top-right">
            <Button type="primary" icon="md-add" @click="isAdd=true">新增</Button>
          </div>
        </Col>
      </Row>
    </div>

    <!-- 失约处理 信息 -->
    <div class="content">
      <Table border :columns="promiseColumns" :data="promises">
        <template slot-scope="{ row, index }" slot="action">
          <Button type="error" size="small" @click="clickCancel(row.gymDefaultId)">取消禁用</Button>
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

    <!-- 取消禁用 -->
    <Modal v-model="isCancel" title="取消禁用">
      <p style="textAlign:center">是否取消禁用？</p>
      <div slot="footer">
        <Button style="float:left" @click="isCancel=false">取消</Button>
        <Button type="info" @click="CancelCheck()">确定</Button>
      </div>
    </Modal>

    <!-- 新增 -->
    <Modal v-model="isAdd" title="新增">
      <Form ref="newPromise" :model="newPromise" :rules="newPromiseValidate" :label-width="100">
        <FormItem label="学号" prop="userId">
          <Input v-model="newPromise.userId" placeholder="请输入学号"></Input>
        </FormItem>
        <FormItem label="原因" prop="reason">
          <Input type="textarea" v-model="newPromise.reason" placeholder="请输入原因"></Input>
        </FormItem>
        <FormItem label="时间">
          <Row>
            <Col span="11">
              <FormItem prop="startTime">
                <DatePicker
                  type="datetime"
                  placeholder="请选择时间"
                  format="yyyy-MM-dd HH:mm:ss"
                  @on-change="startTimeChange"
                ></DatePicker>
              </FormItem>
            </Col>
            <Col span="2" style="text-align: center">-</Col>
            <Col span="11">
              <FormItem prop="endTime">
                <DatePicker
                  type="datetime"
                  placeholder="请选择时间"
                  format="yyyy-MM-dd HH:mm:ss"
                  @on-change="endTimeChange"
                ></DatePicker>
              </FormItem>
            </Col>
          </Row>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button style="float:left" @click="addCancel('newPromise')">取消</Button>
        <Button type="info" @click="addCheck('newPromise')">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  reqPromises,
  reqCancelPromise,
  reqAddPromise,
  reqTimes
} from "../../api";
export default {
  data() {
    return {
      isAdd: false,
      isCancel: false,

      times: [],

      // 违约 信息
      promiseColumns: [
        { title: "审批号", key: "gymDefaultId", align: "center" },
        { title: "学号", key: "username", align: "center" },
        { title: "原因", key: "reason", align: "center" },
        { title: "开始时间", key: "startTime", align: "center" },
        { title: "结束时间", key: "endTime", align: "center" },
        { title: "状态", key: "statusName", align: "center" },
        { title: "操作", slot: "action", align: "center" }
      ],
      promises: [],
      gymDefaultId: "",
      newPromise: {
        reason: "",
        startTime: "",
        endTime: "",
        userId: ""
      },
      newPromiseValidate: {
        userId: [{ required: true, message: "学号不能为空", trigger: "blur" }],
        reason: [{ required: true, message: "原因不能为空", trigger: "blur" }],
        startTime: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change",
            pattern: /.+/
          }
        ],
        endTime: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change",
            pattern: /.+/
          }
        ]
      },
      currentPage: 1,
      totalPages: 1
    };
  },
  mounted() {
    this.getPromises();
    this.getTimes();
  },
  methods: {
    //  获取所有信息
    async getPromises() {
      let result = await reqPromises(this.currentPage);
      if (result.status === 200) {
        this.promises = result.data.list;
        this.currentPage = result.data.currPage;
        this.totalPages = result.data.totalPage;
      }
    },

    clickCancel(id) {
      this.gymDefaultId = id;
      this.isCancel = true;
    },

    // 确定  取消禁用
    async CancelCheck() {
      let result = await reqCancelPromise(this.gymDefaultId);
      if (result.status === 200) {
        this.$Message.success("取消成功");
        this.isCancel = false;
        this.getPromises();
      } else {
        this.$Message.error(result.msg);
      }
    },

    // 确定 添加
    addCheck(name) {
      let newPromise = this.newPromise;
      let result;
      this.$refs[name].validate(async valid => {
        if (valid) {
          result = await reqAddPromise(
            newPromise.endTime,
            newPromise.reason,
            newPromise.startTime,
            newPromise.userId
          );
          if (result.status === 200) {
            this.$Message.success("添加成功");
            this.getPromises();
            this.isAdd = false;
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

    // 上一页
    async prePage() {
      let result = await reqPromises(this.currentPage - 1);
      if (result.status === 200) {
        this.promises = result.data.list;
        this.currentPage = result.data.currPage;
        this.totalPages = result.data.totalPage;
      }
    },

    // 下一页
    async nextPage() {
      let result = await reqPromises(this.currentPage + 1);
      if (result.status === 200) {
        this.promises = result.data.list;
        this.currentPage = result.data.currPage;
        this.totalPages = result.data.totalPage;
      }
    },

    async getTimes() {
      let result = await reqTimes();
      if (result.status === 200) {
        this.times = result.data;
      }
    },

    startTimeChange(e) {
      this.newPromise.startTime = e;
    },

    endTimeChange(e) {
      this.newPromise.endTime = e;
    }
  }
};
</script>

<style>
.top-left {
  text-align: center;
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

.bg {
  background: #2f95dd;
  color: #ffffff;
}
</style>