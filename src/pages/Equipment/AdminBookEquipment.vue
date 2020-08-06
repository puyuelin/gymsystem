<template>
  <div>
    <!-- 信息 -->
    <div>
      <Table border :columns="bookColumns" :data="books">
        <template slot-scope="{ row, index }" slot="action">
          <Button type="error" size="small" @click="clickDelete(row.kitBookId)">删除</Button>
          <Button type="success" size="small" @click="clickUse(row.kitBookId)">租借</Button>
          <Button type="warning" size="small" @click="clickDamage(row.kitBookId)">损坏</Button>
          <Button type="info" size="small" @click="clickBack(row.kitBookId)">归还</Button>
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
    <Modal v-model="isDelete" title="删除" @on-ok="deleteCheck()" @on-cancel="isDelete=false">
      <p style="textAlign:center">是否确认删除？</p>
    </Modal>

    <!-- 租借 -->
    <Modal v-model="isUse" title="租借" @on-ok="useCheck()" @on-cancel="isUse=false">
      <p style="textAlign:center">是否确认租借？</p>
    </Modal>

    <!-- 损坏 -->
    <Modal v-model="isDamage" title="损坏" @on-ok="damageCheck()" @on-cancel="isDamage=false">
      <p style="textAlign:center">是否确认损坏？</p>
    </Modal>

    <!-- 归还 -->
    <Modal v-model="isBack" title="归还" @on-ok="backCheck()" @on-cancel="isBack=false">
      <p style="textAlign:center">是否确认归还？</p>
    </Modal>
  </div>
</template>

<script>
import {
  reqBookEquipments,
  reqDeleteBookEquipment,
  reqBookUse,
  reqBookDamage,
  reqBookBack
} from "../../api";
export default {
  data() {
    return {
      isDelete: false,
      isUse: false,
      isDamage: false,
      isBack: false,

      books: [],
      bookColumns: [
        { title: "编号", key: "kitBookId", align: "center" },
        { title: "器材名", key: "kitName", align: "center" },
        { title: "姓名", key: "userName", align: "center" },
        { title: "开始时间", key: "startTime", align: "center" },
        { title: "结束时间", key: "endTime", align: "center" },
        { title: "状态", key: "statusName", align: "center" },
        { title: "操作", slot: "action", align: "center", width: 300 }
      ],
      kitBookId: "",
      currentPage: 1,
      totalPages: 1
    };
  },
  mounted() {
    this.getBooks();
  },
  methods: {
    //   获取信息
    async getBooks() {
      let result = await reqBookEquipments(this.currentPage);
      if (result.status === 200) {
        this.books = result.data.list;
        this.currentPage = result.data.currPage;
        this.totalPages = result.data.totalPage;
      }
    },

    // 点击 删除
    clickDelete(kitBookId) {
      this.kitBookId = kitBookId;
      this.isDelete = true;
    },

    // 确认 删除
    async deleteCheck() {
      let result = await reqDeleteBookEquipment(this.kitBookId);
      if (result.status === 200) {
        this.$Message.success("删除成功");
        this.isDelete = false;
        this.getBooks();
      } else {
        this.$Message.error(result.msg);
      }
    },

    // 点击 租借
    clickUse(kitBookId) {
      this.kitBookId = kitBookId;
      this.isUse = true;
    },

    // 确认 租借
    async useCheck() {
      let result = await reqBookUse(this.kitBookId);
      if (result.status === 200) {
        this.$Message.success("已租借");
        this.isUse = false;
        this.getBooks();
      } else {
        this.$Message.error(result.msg);
      }
    },

    //  点击 损坏
    clickDamage(kitBookId) {
      this.kitBookId = kitBookId;
      this.isDamage = true;
    },

    // 确认 损坏
    async damageCheck() {
      let result = await reqBookDamage(this.kitBookId);
      if (result.status === 200) {
        this.$Message.success("已损坏");
        this.isDamage = false;
        this.getBooks();
      } else {
        this.$Message.error(result.msg);
      }
    },

    // 点击 归还
    clickBack(kitBookId) {
      this.kitBookId = kitBookId;
      this.isBack = true;
    },

    // 确认 归还
    async backCheck() {
      let result = await reqBookBack(this.kitBookId);
      if (result.status === 200) {
        this.$Message.success("已归还");
        this.isBack = false;
        this.getBooks();
      } else {
        this.$Message.error(result.msg);
      }
    },

    // 上一页
    async prePage() {
      let result = await reqBookEquipments(this.currentPage - 1);
      if (result.status === 200) {
        this.books = result.data.list;
        this.currentPage = result.data.currPage;
        this.totalPages = result.data.totalPage;
      }
    },

    // 下一页
    async nextPage() {
      let result = await reqBookEquipments(this.currentPage + 1);
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
</style>