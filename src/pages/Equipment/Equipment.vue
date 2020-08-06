<template>
  <div>
    <div class="top">
      <div class="top-left">
        类型
        <Select v-model="typeId" style="width:200px">
          <Option v-for="item in types" :value="item.typeId" :key="item.typeId">{{ item.name }}</Option>
        </Select>
        <Button type="primary" @click="getEuipments()">搜索</Button>
      </div>
    </div>

    <!-- 所有器材信息 -->
    <div class="content">
      <Table border :columns="equipmentColumns" :data="equipments">
        <template slot-scope="{ row, index }" slot="action">
          <Button type="warning" size="small" @click="clickBook(row.kitId)">预约</Button>
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

    <!-- 预约 -->
    <Modal v-model="isBook" title="预约">
      <Form ref="book" :model="book" :rules="bookValidate" :label-width="100">
        <FormItem label="器材编号">
          <span>{{kitId}}</span>
        </FormItem>
        <FormItem label="时间">
          <Row>
            <Col span="11">
              <FormItem prop="date">
                <DatePicker
                  type="date"
                  placeholder="请选择时间"
                  format="yyyy-MM-dd"
                  @on-change="bookDateChange"
                ></DatePicker>
              </FormItem>
            </Col>
            <Col span="2" style="text-align: center">-</Col>
            <Col span="11">
              <FormItem prop="time">
                <Select v-model="book.time">
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
        <FormItem label="器材类型" prop="typeId">
          <Select v-model="book.typeId">
            <Option v-for="item in types" :value="item.typeId" :key="item.typeId">{{ item.name }}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="bookCancel('book')" style="float:left">取消</Button>
        <Button type="primary" @click="bookCheck('book')">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  reqUserEquipments,
  reqUserBookEquipment,
  reqUserTypes,
  reqUserTimes
} from "../../api";
export default {
  data() {
    return {
      isBook: false,

      typeId: 1,
      equipments: [],
      equipmentColumns: [
        { title: "器材编号", key: "kitId", align: "center" },
        { title: "物品名称", key: "name", align: "center" },
        { title: "状态", key: "statusName", align: "center" },
        { title: "租用价格", key: "price", align: "center" },
        { title: "赔偿信息", key: "message", align: "center" },
        { title: "操作", slot: "action", align: "center" }
      ],
      kitId: "",
      book: {
        date: "",
        time: "",
        typeId: 1
      },
      bookValidate: {
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
      types: [], // 器材类型
      times: [],

      currentPage: 1,
      totalPages: 1
    };
  },

  mounted() {
    this.getEuipments();
    this.getTypes();
    this.getTimes();
  },
  methods: {
    // 获取器材信息
    async getEuipments() {
      let result = await reqUserEquipments(this.typeId, this.currentPage);
      if (result.status === 200) {
        this.equipments = result.data.list;
        this.currentPage = result.data.currPage;
        this.totalPages = result.data.totalPage;
      }
    },

    // 点击 预约
    clickBook(kitId) {
      this.kitId = kitId;
      this.isBook = true;
    },

    // 确认 预约
    async bookCheck(name) {
      let book = this.book;
      let times = book.time.split(" ~ ");
      let startTime = book.date + " " + times[0];
      let endTime = book.date + " " + times[1];
      let kitId = this.kitId;
      this.$refs[name].validate(async valid => {
        if (valid) {
          let result = await reqUserBookEquipment(
            endTime,
            startTime,
            book.typeId,
            kitId
          );
          if (result.status === 200) {
            this.$Message.success("预约成功");
            this.getEuipments();
            this.isBook = false;
          } else {
            this.$Message.error(result.msg);
          }
        } else {
          this.$Message.error("预约失败");
        }
      });
    },

    // 取消 预约
    bookCancel(name) {
      this.$refs[name].resetFields();
      this.isBook = false;
    },

    // 上一页
    async prePage() {
      let result = await reqUserEquipments(this.typeId, this.currentPage - 1);
      if (result.status === 200) {
        this.equipments = result.data.list;
        this.currentPage = result.data.currPage;
        this.totalPages = result.data.totalPage;
      }
    },

    // 下一页
    async nextPage() {
      let result = await reqUserEquipments(this.typeId, this.currentPage + 1);
      if (result.status === 200) {
        this.equipments = result.data.list;
        this.currentPage = result.data.currPage;
        this.totalPages = result.data.totalPage;
      }
    },

    async getTypes() {
      let result = await reqUserTypes();
      if (result.status === 200) {
        this.types = result.data;
      }
    },

    async getTimes() {
      let result = await reqUserTimes();
      if (result.status === 200) {
        this.times = result.data;
      }
    },

    bookDateChange(date) {
      this.book.date = date;
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