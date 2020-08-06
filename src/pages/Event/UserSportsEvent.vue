<template>
  <div>
    <div class="top">
      <Row>
        <Col span="24">
          <div class="top-right">
            <Button type="primary" icon="md-add" @click="isAdd=true">申请赛事</Button>
          </div>
        </Col>
      </Row>
    </div>

    <!-- 所有赛事信息 -->
    <div class="content">
      <Table border :columns="eventColumns" :data="events">
        <template slot-scope="{ row, index }" slot="action">
          <Button type="error" size="small" @click="clickCancel(row.competitionId)">取消申请</Button>
          <Button type="primary" size="small" @click="clickDetail(row)">查看详情</Button>
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

    <!-- 取消申请 -->
    <Modal v-model="isCancel" title="取消申请" @on-ok="cancelCheck" @on-cancel="isCancel=false">
      <p style="textAlign:center">确定要取消申请吗？</p>
    </Modal>

    <!-- 查看详情 -->
    <Modal v-model="isDetail" title="赛事详情" width="1050">
      <p slot="close" @click="isDetail=false">
        <Icon type="ios-close" />
      </p>
      <div>
        <Row :gutter="24">
          <Col span="5" style="textAlign:right">赛事编号</Col>
          <Col span="19" style="textAlign:left">{{eventDetail.eventNumber}}</Col>
        </Row>
        <Row :gutter="24">
          <Col span="5" style="textAlign:right">赛事标题</Col>
          <Col span="19" style="textAlign:left">{{eventDetail.eventTitle}}</Col>
        </Row>
        <Row :gutter="24">
          <Col span="5" style="textAlign:right">赛事类型</Col>
          <Col span="19" style="textAlign:left">{{eventDetail.eventType}}</Col>
        </Row>
        <Row :gutter="24">
          <Col span="5" style="textAlign:right">开始时间</Col>
          <Col span="19" style="textAlign:left">{{eventDetail.startTime}}</Col>
        </Row>
        <Row :gutter="24">
          <Col span="5" style="textAlign:right">结束时间</Col>
          <Col span="19" style="textAlign:left">{{eventDetail.endTime}}</Col>
        </Row>
        <Row :gutter="24">
          <Col span="5" style="textAlign:right">赛事介绍</Col>
          <Col span="19" style="textAlign:left">{{eventDetail.intro}}</Col>
        </Row>
        <Row :gutter="24">
          <Col span="5" style="textAlign:right">主办方</Col>
          <Col span="19" style="textAlign:left">{{eventDetail.name}}</Col>
        </Row>
        <Row :gutter="24">
          <Col span="5" style="textAlign:right">主办方学号</Col>
          <Col span="19" style="textAlign:left">{{eventDetail.username}}</Col>
        </Row>
        <Row :gutter="24">
          <Col span="5" style="textAlign:right">主办方联系方式</Col>
          <Col span="19" style="textAlign:left">{{eventDetail.tel}}</Col>
        </Row>
        <Row :gutter="24">
          <Col span="5" style="textAlign:right">状态</Col>
          <Col span="19" style="textAlign:left">{{eventDetail.statusName}}</Col>
        </Row>
        <Row :gutter="24">
          <Col span="5" style="textAlign:right">器材预约情况</Col>
          <Col span="19" style="textAlign:left">
            <Table border :columns="equipmentColumns" :data="detailEquips"></Table>
          </Col>
        </Row>
        <Row :gutter="24" style="margin-top:7px">
          <Col span="5" style="textAlign:right">场地预约情况</Col>
          <Col span="19" style="textAlign:left">
            <Table border :columns="fieldColumns" :data="detailFields"></Table>
          </Col>
        </Row>
      </div>
      <div slot="footer">
        <Button style="float:left" @click="isDetail=false">取消</Button>
        <Button type="primary" @click="clickUpdate()">修改</Button>
      </div>
    </Modal>

    <!-- 查看详情 -> 修改 -->
    <Modal v-model="isUpdate" title="修改" width="1050">
      <Form ref="updateEvent" :model="updateEvent" :rules="updateEventValidate" :label-width="80">
        <FormItem label="赛事编号" prop="eventNumber">
          <p>{{eventDetail.eventNumber}}</p>
        </FormItem>
        <FormItem label="赛事标题" prop="eventTitle">
          <Input v-model="updateEvent.eventTitle" placeholder="请输入赛事标题"></Input>
        </FormItem>
        <FormItem label="赛事类型" prop="typeId">
          <Select v-model="updateEvent.typeId">
            <Option
              v-for="item in eventTypes"
              :value="item.typeId"
              :key="item.typeId"
            >{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="起止时间">
          <Row>
            <Col span="12">
              <FormItem prop="startTime">
                <DatePicker
                  type="datetime"
                  placeholder="开始时间"
                  format="yyyy-MM-dd HH:mm:ss"
                  @on-change="updateStartTimeChange"
                ></DatePicker>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem prop="endTime">
                <DatePicker
                  type="datetime"
                  placeholder="结束时间"
                  format="yyyy-MM-dd HH:mm:ss"
                  @on-change="updateEndTimeChange"
                ></DatePicker>
              </FormItem>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="赛事介绍" prop="intro">
          <Input v-model="updateEvent.intro" type="textarea" placeholder="请输入赛事介绍" />
        </FormItem>
        <FormItem label="器材预约情况" v-if="isUpdateBook">
          <Table border :columns="equipmentColumns" :data="equipments"></Table>
        </FormItem>
        <FormItem label="场地预约情况" v-if="isUpdateBook" style="margin-top:6px">
          <Table border :columns="fieldColumns" :data="fields"></Table>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button style="float:left" @click="isUpdate=false">取消</Button>
        <Button type="primary" @click="updateCheck('updateEvent')">确认</Button>
      </div>
    </Modal>

    <!-- 添加 -->
    <Modal v-model="isAdd" title="添加" width="1050">
      <Form ref="newEvent" :model="newEvent" :rules="updateEventValidate" :label-width="80">
        <FormItem label="赛事标题" prop="eventTitle">
          <Input v-model="newEvent.eventTitle" placeholder="请输入赛事标题"></Input>
        </FormItem>
        <FormItem label="赛事类型" prop="typeId">
          <Select v-model="newEvent.typeId">
            <Option
              v-for="item in eventTypes"
              :value="item.typeId"
              :key="item.typeId"
            >{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="起止时间">
          <Row>
            <Col span="12">
              <FormItem prop="startTime">
                <DatePicker
                  type="datetime"
                  placeholder="开始时间"
                  format="yyyy-MM-dd HH:mm:ss"
                  @on-change="addStartTimeChange"
                ></DatePicker>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem prop="endTime">
                <DatePicker
                  type="datetime"
                  placeholder="结束时间"
                  format="yyyy-MM-dd HH:mm:ss"
                  @on-change="addEndTimeChange"
                ></DatePicker>
              </FormItem>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="赛事介绍" prop="intro">
          <Input v-model="newEvent.intro" type="textarea" placeholder="请输入赛事介绍" />
        </FormItem>
        <FormItem label="器材预约情况" v-if="isAddBook">
          <Table border :columns="equipmentColumns" :data="equipments"></Table>
        </FormItem>
        <FormItem label="场地预约情况" v-if="isAddBook" style="margin-top:6px">
          <Table border :columns="fieldColumns" :data="fields"></Table>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button style="float:left" @click="addCancel('newEvent')">取消</Button>
        <Button type="primary" @click="addCheck('newEvent')">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  reqUserEvents,
  reqUserCancelEvent,
  reqUserEvent,
  reqUserUpdateEvent,
  reqUserAddEvent,
  reqUserTypes,
  reqUserTimes,
  reqEventEquipments,
  reqEventFields
} from "../../api";
export default {
  data() {
    return {
      isSearch: false,
      isCancel: false,
      isDetail: false,
      isUpdate: false,
      isAdd: false,
      isAddBook: false,
      isUpdateBook: false,

      typeId: "",
      eventTypes: [], // 赛事类型
      times: [],
      eventColumns: [
        { title: "赛事编号", key: "competitionId", align: "center" },
        { title: "赛事标题", key: "title", align: "center" },
        { title: "赛事介绍", key: "intro", align: "center" },
        { title: "开始时间", key: "startTime", align: "center" },
        { title: "结束时间", key: "endTime", align: "center" },
        { title: "赛事类型", key: "typeName", align: "center" },
        { title: "状态", key: "statusName", align: "center" },
        { title: "操作", slot: "action", align: "center", width: 200 }
      ],
      events: [], // 全部赛事信息
      competitionId: "",
      // 赛事详情
      eventDetail: {
        eventNumber: "",
        eventTitle: "",
        eventType: "",
        intro: "",
        startTime: "",
        endTime: "",
        name: "",
        statusName: "",
        tel: "",
        username: ""
      },
      // 修改的 赛事信息
      updateEvent: {
        eventTitle: "",
        typeId: 1,
        intro: "",
        startTime: "",
        endTime: ""
      },
      updateEventValidate: {
        eventTitle: [
          { required: true, message: "赛事标题不能为空", trigger: "blur" }
        ],
        typeId: [
          {
            required: true,
            message: "赛事类型不能为空",
            trigger: "change",
            type: "number"
          }
        ],
        startTime: [
          {
            required: true,
            message: "请选择时间",
            trigger: "change",
            pattern: /.+/
          }
        ],
        endTime: [
          {
            required: true,
            message: "请选择时间",
            trigger: "change",
            pattern: /.+/
          }
        ],
        intro: [
          { required: true, message: "赛事介绍不能为空", trigger: "blur" }
        ]
      },
      // 添加
      newEvent: {
        eventTitle: "",
        typeId: 1,
        startTime: "",
        endTime: "",
        intro: ""
      },

      equipments: [], //器材预约情况
      equipmentColumns: [
        {
          title: "器材预约编号",
          key: "kitBookId",
          align: "center",
          width: 100
        },
        { title: "开始时间", key: "startTime", align: "center", width: 200 },
        { title: "结束时间", key: "endTime", align: "center", width: 200 },
        { title: "器材名", key: "kitName", align: "center" },
        { title: "状态", key: "statusName", align: "center" }
      ],

      fields: [], // 场地预约情况
      fieldColumns: [
        {
          title: "场地预约编号",
          key: "gymBookId",
          align: "center",
          width: 100
        },
        { title: "开始时间", key: "startTime", align: "center", width: 200 },
        { title: "结束时间", key: "endTime", align: "center", width: 200 },
        { title: "场地名", key: "locate", align: "center" },
        { title: "状态", key: "statusName", align: "center" }
      ],

      detailEquips: [],
      detailFields: [],

      currentPage: 1,
      totalPages: 1
    };
  },

  mounted() {
    this.getUserEvents();
    this.getTypes();
    this.getTimes();
  },
  methods: {
    // 获取所有赛事信息
    async getUserEvents() {
      let result = await reqUserEvents(this.currentPage);
      if (result.status === 200) {
        this.events = result.data.list;
        this.currentPage = result.data.currPage;
        this.totalPages = result.data.totalPage;
      }
    },

    // 点击 取消申请
    clickCancel(competitionId) {
      this.competitionId = competitionId;
      this.isCancel = true;
    },

    // 确认 取消申请
    async cancelCheck() {
      let result = await reqUserCancelEvent(this.competitionId);
      if (result.status === 200) {
        this.$Message.success("已取消");
        this.getUserEvents();
        this.isCancel = false;
      } else {
        this.$Message.error(result.msg);
      }
    },

    // 点击 查看详情
    clickDetail(row) {
      this.eventDetail.eventNumber = row.competitionId;
      this.eventDetail.eventTitle = row.title;
      this.eventDetail.eventType = row.typeName;
      this.eventDetail.intro = row.intro;
      this.eventDetail.startTime = row.startTime;
      this.eventDetail.endTime = row.endTime;
      this.eventDetail.name = row.name;
      this.eventDetail.statusName = row.statusName;
      this.eventDetail.tel = row.tel;
      this.eventDetail.username = row.username;
      this.getDetailEquips();
      this.getDetailFields();
      this.isDetail = true;
    },

    // 获取器材预约情况
    async getDetailEquips() {
      let result = await reqEventEquipments(
        this.eventDetail.startTime,
        this.eventDetail.endTime
      );
      if (result.status === 200) {
        this.detailEquips = result.data.list;
      }
    },

    // 获取场地预约情况
    async getDetailFields() {
      let result = await reqEventFields(
        this.eventDetail.startTime,
        this.eventDetail.endTime
      );
      if (result.status === 200) {
        this.detailFields = result.data.list;
      }
    },

    // 查看详情 -> 点击修改
    clickUpdate() {
      this.updateEvent.eventTitle = this.eventDetail.eventTitle;
      this.updateEvent.typeId = this.eventDetail.typeId;
      this.updateEvent.startTime = this.eventDetail.startTime;
      this.updateEvent.endTime = this.eventDetail.endTime;
      this.updateEvent.intro = this.eventDetail.intro;
      this.isUpdate = true;
      this.isDetail = false;
    },

    // 确认修改
    updateCheck(name) {
      let result;
      let updateEvent = this.updateEvent;
      let competitionId = this.eventDetail.eventNumber;
      this.$refs[name].validate(async valid => {
        if (valid) {
          let result = await reqUserUpdateEvent(
            competitionId,
            updateEvent.endTime,
            updateEvent.intro,
            updateEvent.startTime,
            updateEvent.eventTitle,
            updateEvent.typeId
          );
          if (result.status === 200) {
            this.$Message.success("修改成功");
            this.getUserEvents();
            this.isUpdate = false;
          } else {
            this.$Message.error(result.msg);
          }
        } else {
          this.$Message.error("修改失败");
        }
      });
    },

    // 确认 添加
    addCheck(name) {
      let result;
      let newEvent = this.newEvent;
      this.$refs[name].validate(async valid => {
        if (valid) {
          let result = await reqUserAddEvent(
            newEvent.endTime,
            newEvent.intro,
            newEvent.startTime,
            newEvent.eventTitle,
            newEvent.typeId
          );
          if (result.status === 200) {
            this.$Message.success("添加成功");
            this.getUserEvents();
            this.isAdd = false;
          } else {
            this.$Message.error(result.msg);
          }
        } else {
          this.$Message.error("添加失败");
        }
      });
    },

    // 取消 添加
    addCancel(name) {
      this.$refs[name].resetFields();
      this.isAdd = false;
    },

    // 获取类型
    async getTypes() {
      let result = await reqUserTypes();
      if (result.status === 200) {
        this.eventTypes = result.data;
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
      let result = await reqUserEvents(this.currentPage - 1);
      if (result.status === 200) {
        this.events = result.data.list;
        this.currentPage = result.data.currPage;
        this.totalPages = result.data.totalPage;
      }
    },

    // 下一页
    async nextPage() {
      let result = await reqUserEvents(this.currentPage + 1);
      if (result.status === 200) {
        this.events = result.data.list;
        this.currentPage = result.data.currPage;
        this.totalPages = result.data.totalPage;
      }
    },

    // 获取器材预约情况
    async getEquipments(startTime, endTime) {
      let result = await reqEventEquipments(startTime, endTime);
      if (result.status === 200) {
        this.equipments = result.data.list;
      }
    },

    // 获取场地预约情况
    async getFields(startTime, endTime) {
      let result = await reqEventFields(startTime, endTime);
      if (result.status === 200) {
        this.fields = result.data.list;
      }
    },

    // 添加  判断预约情况
    addBookSituation() {
      if (
        (this.newEvent.startTime === undefined ||
          this.newEvent.startTime === null ||
          this.newEvent.startTime === "") &&
        (this.newEvent.endTime === undefined ||
          this.newEvent.endTime === null ||
          this.newEvent.endTime === "")
      ) {
        this.isAddBook = false;
      } else {
        this.isAddBook = true;
        this.getEquipments(this.newEvent.startTime, this.newEvent.endTime);
        this.getFields(this.newEvent.startTime, this.newEvent.endTime);
        if (this.equipments.length === 0 || this.fields.length === 0) {
          this.$Message.warning("未查询到您的预约情况，可能会影响您的赛事审批");
        }
      }
    },

    // 更新  判断预约情况
    updateBookSituation() {
      if (
        (this.updateEvent.startTime === undefined ||
          this.updateEvent.startTime === null ||
          this.updateEvent.startTime === "") &&
        (this.updateEvent.endTime === undefined ||
          this.updateEvent.endTime === null ||
          this.updateEvent.endTime === "")
      ) {
        this.isUpdateBook = false;
      } else {
        this.isUpdateBook = true;
        this.getEquipments(
          this.updateEvent.startTime,
          this.updateEvent.endTime
        );
        this.getFields(this.updateEvent.startTime, this.updateEvent.endTime);
        if (this.equipments.length === 0 || this.fields.length === 0) {
          this.$Message.warning("未查询到您的预约情况，可能会影响您的赛事审批");
        }
      }
    },

    addStartTimeChange(e) {
      this.newEvent.startTime = e;
      this.addBookSituation();
    },

    addEndTimeChange(e) {
      this.newEvent.endTime = e;
      this.addBookSituation();
    },

    updateStartTimeChange(e) {
      this.updateEvent.startTime = e;
      this.updateBookSituation();
    },

    updateEndTimeChange(e) {
      this.updateEvent.endTime = e;
      this.updateBookSituation();
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