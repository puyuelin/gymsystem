<template>
  <div>
    <div>
      <div class="top">
        <Row>
          <Col span="24">
            <div class="top-right">
              <Button type="primary" icon="md-add" @click="isApply=true">申请</Button>
            </div>
          </Col>
        </Row>
      </div>

      <!-- 信息 -->
      <div class="content">
        <Table border :columns="applyColumns" :data="applies">
          <template slot-scope="{ row, index }" slot="action">
            <Button type="info" size="small" @click="clickCancel(row.gymBookId)">取消</Button>
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

      <!-- 申请 -->
      <Modal v-model="isApply" title="申请">
        <Form ref="newApply" :model="newApply" :rules="newApplyValidate" :label-width="80">
          <FormItem label="类型" prop="typeId">
            <Select v-model="newApply.typeId">
              <Option
                v-for="item in fieldTypes"
                :value="item.typeId"
                :key="item.typeId"
              >{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="时间">
            <Row>
              <Col span="11">
                <FormItem prop="date">
                  <DatePicker
                    type="date"
                    placeholder="请选择时间"
                    @on-change="dateChange"
                    format="yyyy-MM-dd"
                  ></DatePicker>
                </FormItem>
              </Col>
              <Col span="2" style="text-align: center">-</Col>
              <Col span="11">
                <FormItem prop="time">
                  <Select v-model="newApply.time">
                    <Option
                      v-for="item in times"
                      :value="item.time"
                      :key="item.timeId"
                    >{{ item.time }}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="原因" prop="reason">
            <Input type="textarea" v-model="newApply.reason" placeholder="请输入原因" />
          </FormItem>
        </Form>
        <div slot="footer">
          <Button style="float:left" @click="applyCancel('newApply')">取消</Button>
          <Button type="info" @click="applyCheck('newApply')">确认</Button>
        </div>
      </Modal>

      <!-- 取消 -->
      <Modal v-model="isCancel" title="取消">
        <p style="textAlign:center">确认取消申请？</p>
        <div slot="footer">
          <Button style="float:left" @click="isCancel=false">否</Button>
          <Button type="error" @click="cancelCheck()">是</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
import {
  reqCancelBook,
  reqUserTypes,
  reqCheckBook,
  reqUserFields,
  reqUserTimes
} from "../../api";
export default {
  data() {
    return {
      isApply: false,
      isCancel: false,

      fieldType: "",
      fieldTypes: [], // 场地类别
      times: [], // 时间

      fieldPlaces: [], // 场地位置

      applyColumns: [
        { title: "场地预约编号", key: "gymBookId", align: "center" },
        { title: "开始时间", key: "startTime", align: "center" },
        { title: "结束时间", key: "endTime", align: "center" },
        { title: "类型", key: "typeName", align: "center" },
        { title: "原因", key: "reason", align: "center" },
        { title: "状态", key: "statusName", align: "center" },
        { title: "操作", slot: "action", align: "center" }
      ],
      applies: [], // 申请 信息
      // 我的申请 -> 提交的信息
      newApply: {
        reason: "",
        typeId: 1,
        date: "",
        time: ""
      },
      newApplyValidate: {
        reason: [{ required: true, message: "请输入原因", trigger: "blur" }],
        date: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change",
            pattern: /.+/
          }
        ],
        time: [
          {
            required: true,
            type: "string",
            message: "请选择时间",
            trigger: "change"
          }
        ],
        typeId: [
          {
            required: true,
            message: "请选择类型",
            trigger: "change",
            type: "number"
          }
        ]
      },
      gymBookId: "",
      currentPage: 1,
      totalPages: 1
    };
  },
  mounted() {
    this.getUserFields();
    this.getTypes();
    this.getTimes();
  },
  methods: {
    // 获取场地信息
    async getUserFields() {
      let result = await reqUserFields(this.currentPage);
      if (result.status === 200) {
        this.applies = result.data.list;
        this.currentPage = result.data.currPage;
        this.totalPages = result.data.totalPage;
      }
    },

    // 确认提交申请
    applyCheck(name) {
      let newApply = this.newApply;
      let times = newApply.time.split(" ~ ");
      let startTime = newApply.date + " " + times[0];
      let endTime = newApply.date + " " + times[1];
      let result;
      this.$refs[name].validate(async valid => {
        if (valid) {
          result = await reqCheckBook(
            endTime,
            newApply.reason,
            startTime,
            newApply.typeId
          );
          if (result.status === 200) {
            this.$Message.success("申请成功");
            this.getUserFields();
            this.isApply = false;
          } else {
            this.$Message.error(result.msg);
          }
        } else {
          this.$Message.error("申请失败");
        }
      });
    },

    // 取消提交申请
    applyCancel(name) {
      this.$refs[name].resetFields();
      this.isApply = false;
    },

    // 点击 取消
    clickCancel(gymBookId) {
      this.gymBookId = gymBookId;
      this.isCancel = true;
    },

    // 确认 取消
    async cancelCheck() {
      let result = await reqCancelBook(this.gymBookId);
      if (result.status === 200) {
        this.$Message.success("取消成功");
        this.getUserFields();
        this.isCancel = false;
      } else {
        this.$Message.error(result.msg);
      }
    },

    async getTypes() {
      let result = await reqUserTypes();
      if (result.status === 200) {
        this.fieldTypes = result.data;
      }
    },

    async getTimes() {
      let result = await reqUserTimes();
      if (result.status === 200) {
        this.times = result.data;
      }
    },

    // 上一页
    async prePage() {
      let result = await reqUserFields(this.currentPage - 1);
      if (result.status === 200) {
        this.applies = result.data.list;
        this.currentPage = result.data.currPage;
        this.totalPages = result.data.totalPage;
      }
    },

    // 下一页
    async nextPage() {
      let result = await reqUserFields(this.currentPage + 1);
      if (result.status === 200) {
        this.applies = result.data.list;
        this.currentPage = result.data.currPage;
        this.totalPages = result.data.totalPage;
      }
    },

    dateChange(date) {
      this.newApply.date = date;
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

.bg {
  background: #2f95dd;
  color: #ffffff;
}
</style>