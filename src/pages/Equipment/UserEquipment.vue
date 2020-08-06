<template>
  <div>
    <!-- 所有器材信息 -->
    <div>
      <Table border :columns="equipmentColumns" :data="equipments">
        <template slot-scope="{ row, index }" slot="action">
          <Button type="warning" size="small" @click="clickCancelBook(row.kitBookId)">取消预约</Button>
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

    <!-- 取消预约 -->
    <Modal v-model="isCancel" title="取消预约">
      <p style="textAlign:center">确认取消预约吗？</p>
      <div slot="footer">
        <Button @click="isCancel=false" style="float:left">取消</Button>
        <Button type="primary" @click="bookCancelCheck()">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  reqCancelUserBook,
  reqUserBookEquipments
} from "../../api";

export default {
  data() {
    return {
      isCancel: false,

      equipmentColumns: [
        { title: "编号", key: "kitBookId", align: "center" },
        { title: "类型", key: "kitName", align: "center" },
        { title: "开始时间", key: "startTime", align: "center" },
        { title: "结束时间", key: "endTime", align: "center" },
        { title: "状态", key: "statusName", align: "center" },
        { title: "操作", slot: "action", align: "center" }
      ],
      equipments: [], // 全部器材信息

      kitBookId: "",

      currentPage: 1,
      totalPages: 1
    };
  },
  mounted() {
    this.getUserEquipments();
  },
  methods: {
    // 获取所有信息
    async getUserEquipments() {
      let result = await reqUserBookEquipments(this.currentPage);
      if (result.status === 200) {
        this.equipments = result.data.list;
        this.currentPage = result.data.currPage;
        this.totalPages = result.data.totalPage;
      }
    },

    // 点击 取消预约
    clickCancelBook(kitBookId) {
      this.kitBookId = kitBookId;
      this.isCancel = true;
    },

    // 确认 取消预约
    async bookCancelCheck() {
      let result = await reqCancelUserBook(this.kitBookId);
      if (result.status === 200) {
        this.$Message.success("已取消");
        this.isCancel = false;
        this.getUserEquipments();
      } else {
        this.$Message.error(result.msg);
      }
    },

    // 上一页
    async prePage() {
      let result = await reqUserBookEquipments(this.currentPage - 1);
      if (result.status === 200) {
        this.equipments = result.data.list;
        this.currentPage = result.data.currPage;
        this.totalPages = result.data.totalPage;
      }
    },

    // 下一页
    async nextPage() {
      let result = await reqUserBookEquipments(this.currentPage + 1);
      if (result.status = 200) {
        this.equipments === result.data.list;
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

.pay-img {
  width: 200px;
  display: inline-block;
}
</style>