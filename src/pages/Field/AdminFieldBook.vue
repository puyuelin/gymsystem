<template>
  <div>
    <div>
      <Table border :columns="bookColums" :data="books">
        <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" size="small" @click="clickApprove(row)">批准</Button>
          <Button type="error" size="small" @click="clickReject(row)">拒绝</Button>
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

    <!-- 批准 -->
    <Modal v-model="isApprove" title="批准">
      <Select v-model="gymId">
        <Option v-for="item in places" :value="item.gymId" :key="item.gymId">{{ item.locate }}</Option>
      </Select>
      <div slot="footer">
        <Button style="float:left" @click="isApprove=false">取消</Button>
        <Button type="info" @click="approveCheck()">确认</Button>
      </div>
    </Modal>

    <!-- 拒绝 -->
    <Modal v-model="isReject" title="拒绝">
      <p style="textAlign:center">确认拒绝吗？</p>
      <div slot="footer">
        <Button style="float:left" @click="isReject=false">取消</Button>
        <Button type="info" @click="rejectApprove()">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  reqBookFields,
  reqApproveBook,
  reqRejectBook,
  reqPlaces
} from "../../api";
export default {
  data() {
    return {
      isApprove: false,
      isReject: false,

      books: [],
      bookColums: [
        { title: "场地编号", key: "gymBookId", align: "center" },
        { title: "场地位置", key: "locate", align: "center" },
        { title: "账号", key: "username", align: "center" },
        { title: "姓名", key: "name", align: "center" },
        { title: "类型", key: "typeName", align: "center" },
        { title: "原因", key: "reason", align: "center" },
        { title: "开始时间", key: "startTime", align: "center" },
        { title: "结束时间", key: "endTime", align: "center" },
        { title: "状态", key: "statusName", align: "center" },
        { title: "操作", slot: "action", align: "center", width: 200 }
      ],
      gymBookId: "",
      gymId: "",
      places: [],
      gymId: 0,

      currentPage: 1,
      totalPages: 1
    };
  },
  mounted() {
    this.getBooks();
  },
  methods: {
    // 获取场地预约信息
    async getBooks() {
      let result = await reqBookFields(this.currentPage);
      if (result.status === 200) {
        this.books = result.data.list;
        this.currentPage = result.data.currPage;
        this.totalPages = result.data.totalPage;
      }
    },

    // 点击批准
    clickApprove(row) {
      this.gymBookId = row.gymBookId;
      this.getPlaces();
      this.isApprove = true;
    },

    // 根据gymBookId获取可用场地
    async getPlaces() {
      let result = await reqPlaces(this.gymBookId);
      if (result.status === 200) {
        this.places = result.data;
      }
    },

    // 确认批准
    async approveCheck() {
      let result = await reqApproveBook(this.gymBookId, this.gymId);
      if (result.status === 200) {
        this.$Message.success("已批准");
        this.isApprove = false;
        this.getBooks();
      } else {
        this.$Message.error(result.msg);
      }
    },

    // 点击拒绝
    clickReject(row) {
      this.gymBookId = row.gymBookId;
      this.isReject = true;
    },

    // 确认拒绝
    async rejectApprove() {
      let result = await reqRejectBook(this.gymBookId);
      if (result.status === 200) {
        this.$Message.success("已拒绝");
        this.isReject = false;
        this.getBooks();
      } else {
        this.$Message.error(result.msg);
      }
    },

    // 上一页
    async prePage() {
      let result = await reqBookFields(this.currentPage - 1);
      if (result.status === 200) {
        this.books = result.data.list;
        this.currentPage = result.data.currPage;
        this.totalPages = result.data.totalPage;
      }
    },

    // 下一页
    async nextPage() {
      let result = await reqBookFields(this.currentPage + 1);
      if (result.status === 200) {
        this.books = result.data.list;
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