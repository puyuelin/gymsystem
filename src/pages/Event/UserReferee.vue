<template>
  <div>
    <!-- 所有裁判信息 -->
    <div>
      <Table border :columns="refereeColumns" :data="referees"></Table>
    </div>

    <!-- 分页 -->
    <div class="bottom">
      <template>
        <Button type="primary" @click="prePage()">上一页</Button>
        <span>{{currentPage}}/{{totalPages}}</span>
        <Button type="primary" @click="nextPage()">下一页</Button>
      </template>
    </div>
  </div>
</template>

<script>
import { reqUserReferees } from "../../api";
export default {
  data() {
    return {
      isSearch: false,

      // 全部裁判信息
      refereeColumns: [
        { title: "裁判编号", key: "refereeId", align: "center" },
        { title: "裁判姓名", key: "name", align: "center" },
        {
          title: "裁判头像",
          key: "head",
          align: "center",
          render: (h, params) => {
            return h("div", {}, [
              h("img", {
                style: {
                  height: "45px",
                  margin: "5px"
                },
                attrs: {
                  src: "http://39.98.226.151/srs/sys/" + params.row.head
                }
              })
            ]);
          }
        },
        { title: "裁判类型", key: "typeName", align: "center" },
        { title: "裁判说明", key: "intro", align: "center" },
        { title: "裁判联系方式", key: "tel", align: "center" }
      ],
      referees: [],

      currentPage: 1,
      totalPages: 1
    };
  },
  mounted() {
    this.getUserReferees();
  },
  methods: {
    // 获取所有裁判信息
    async getUserReferees() {
      let result = await reqUserReferees(this.currentPage);
      if (result.status === 200) {
        this.referees = result.data.list;
        this.currentPage = result.data.currPage;
        this.totalPages = result.data.totalPage;
      }
    },

    // 上一页
    async prePage() {
      let result = await reqUserReferees(this.currentPage - 1);
      if (result.status === 200) {
        this.referees = result.data.list;
        this.currentPage = result.data.currPage;
        this.totalPages = result.data.totalPage;
      }
    },

    // 下一页
    async nextPage() {
      let result = await reqUserReferees(this.currentPage + 1);
      if (result.status === 200) {
        this.referees = result.data.list;
        this.currentPage = result.data.currPage;
        this.totalPages = result.data.totalPage;
      }
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
  text-align: center;
}

.content {
  margin-top: 30px;
}

.bottom {
  float: right;
  margin: 20px 0 0;
}
</style>