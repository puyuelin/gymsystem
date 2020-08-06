<template>
  <div>
    <!-- 所有赛事信息 -->
    <div>
      <Table border :columns="eventColumns" :data="events">
        <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" size="small" @click="clickDetail(row)">详情</Button>
          <Button type="error" size="small" @click="clickDelete(row.competitionId)">删除</Button>
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
      <p style="textAlign:center">确定删除吗？</p>
      <div slot="footer">
        <Button style="float:left" @click="isDelete=false">取消</Button>
        <Button type="info" @click="deleteCheck()">确定</Button>
      </div>
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
            <Table border :columns="equipmentColumns" :data="equipments"></Table>
          </Col>
        </Row>
        <Row :gutter="24" style="margin-top:7px">
          <Col span="5" style="textAlign:right">场地预约情况</Col>
          <Col span="19" style="textAlign:left">
            <Table border :columns="fieldColumns" :data="fields"></Table>
          </Col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="error" style="float:left" @click="clickReject()">拒绝</Button>
        <Button type="info" @click="clickApprove()">批准</Button>
      </div>
    </Modal>

    <!-- 查看详情 -> 批准 -->
    <Modal v-model="isApprove" title="批准" @on-ok="approveCheck" @on-cancel="isApprove=false">
      <p style="textAlign:center">确定要批准吗？</p>
    </Modal>

    <!-- 查看详情 -> 拒绝 -->
    <Modal v-model="isReject" title="拒绝" @on-ok="rejectCheck" @on-cancel="isReject=false">
      <p style="textAlign:center">确定要拒绝吗？</p>
    </Modal>
  </div>
</template>

<script>
import {
  reqEvents,
  reqDeleteEvent,
  reqApprove,
  reqReject,
  reqAdminEventEquips,
  reqAdminEventFields
} from "../../api";
export default {
  data() {
    return {
      isSearch: false,
      isDetail: false,
      isApprove: false,
      isReject: false,
      isDelete: false,

      // 全部赛事信息
      eventColumns: [
        { title: "赛事编号", key: "competitionId", align: "center" },
        { title: "赛事标题", key: "title", align: "center" },
        { title: "开始时间", key: "startTime", align: "center" },
        { title: "结束时间", key: "endTime", align: "center" },
        { title: "赛事介绍", key: "intro", align: "center" },
        { title: "赛事类型", key: "typeName", align: "center" },
        { title: "状态", key: "statusName", align: "center" },
        { title: "操作", slot: "action", align: "center" }
      ],
      events: [],
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
        username: "",
        userId: ""
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

      currentPage: 1,
      totalPages: 1
    };
  },

  mounted() {
    this.getEvents();
    // this.getEquipments();
    // this.getFields();
  },
  methods: {
    // 获取所有赛事信息
    async getEvents() {
      let result = await reqEvents(this.currentPage);
      if (result.status === 200) {
        this.events = result.data.list;
        this.currentPage = result.data.currPage;
        this.totalPages = result.data.totalPage;
      }
    },

    // 点击删除
    clickDelete(competitionId) {
      this.competitionId = competitionId;
      this.isDelete = true;
    },

    // 确定删除
    async deleteCheck() {
      let result = await reqDeleteEvent(this.competitionId);
      if (result.status === 200) {
        this.$Message.success("删除成功");
        this.getEvents();
        this.isDelete = false;
      } else {
        this.$Message.error(result.msg);
      }
    },

    // 器材预约情况
    async getEquipments() {
      let result = await reqAdminEventEquips(
        this.eventDetail.startTime,
        this.eventDetail.endTime,
        this.eventDetail.userId
      );
      if (result.status === 200) {
        this.equipments = result.data.list;
      }
    },

    // 场地预约情况
    async getFields() {
      let result = await reqAdminEventFields(
        this.eventDetail.startTime,
        this.eventDetail.endTime,
        this.eventDetail.userId
      );
      if (result.status === 200) {
        this.fields = result.data.list;
      }
    },

    // 点击 查看详情
    clickDetail(row) {
      this.competitionId = row.competitionId;
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
      this.eventDetail.userId = row.userId;
      this.getEquipments();
      this.getFields();
      this.isDetail = true;
    },

    // 查看详情 -> 点击批准
    clickApprove() {
      this.isApprove = true;
    },

    // 确认 批准
    async approveCheck() {
      let result = await reqApprove(this.competitionId);
      if (result.status === 200) {
        this.$Message.success("已批准");
        this.getEvents();
        this.isDetail = false;
        this.isApprove = false;
      } else {
        this.$Message.error(result.msg);
      }
    },

    // 查看详情 -> 点击拒绝
    clickReject() {
      this.isReject = true;
    },

    // 确认 拒绝
    async rejectCheck() {
      let result = await reqReject(this.competitionId);
      if (result.status === 200) {
        this.$Message.success("已拒绝");
        this.getEvents();
        this.isDetail = false;
        this.isReject = false;
      } else {
        this.$Message.error(result.msg);
      }
    },

    // 上一页
    async prePage() {
      let result = await reqEvents(this.currentPage - 1);
      if (result.status === 200) {
        this.events = result.data.list;
        this.currentPage = result.data.currPage;
        this.totalPages = result.data.totalPage;
      }
    },

    // 下一页
    async nextPage() {
      let result = await reqEvents(this.currentPage + 1);
      if (result.status === 200) {
        this.events = result.data.list;
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