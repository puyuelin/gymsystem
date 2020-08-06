<template>
  <div>
    <div class="top">
      <Row>
        <Col span="12">
          <div class="top-left">
            <Select v-model="type" style="width:200px">
              <Option v-for="item in types" :value="item.typeId" :key="item.typeId">{{ item.name }}</Option>
            </Select>
            <Button type="primary" icon="ios-search" @click="getEquipments()">搜索</Button>
          </div>
        </Col>
        <Col span="12">
          <div class="top-right">
            <Button type="primary" icon="md-add" @click="isAdd=true">添加</Button>
          </div>
        </Col>
      </Row>
    </div>

    <!-- 所有器材信息 -->
    <div class="content">
      <Table border :columns="equipmentColumns" :data="equipments">
        <template slot-scope="{ row, index }" slot="action">
          <Button
            type="error"
            size="small"
            style="margin-right: 5px"
            @click="clickDelete(row.kitId)"
          >删除</Button>
          <Button type="primary" size="small" @click="clickUpdate(row)">编辑</Button>
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

    <!-- 添加 -->
    <Modal
      v-model="isAdd"
      title="添加"
      @on-ok="addCheck('newEquipment')"
      @on-cancel="addCancel('newEquipment')"
    >
      <Form ref="newEquipment" :model="newEquipment" :rules="equipmentValidate" :label-width="80">
        <FormItem label="物品名称" prop="name">
          <Input v-model="newEquipment.name" placeholder="请输入物品名称"></Input>
        </FormItem>
        <FormItem label="类型" prop="typeId">
          <Select v-model="newEquipment.typeId">
            <Option v-for="item in types" :value="item.typeId" :key="item.typeId">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="租用价格" prop="price">
          <Input number v-model="newEquipment.price" placeholder="请输入租用价格"></Input>
        </FormItem>
        <FormItem label="赔偿信息" prop="message">
          <Input type="textarea" v-model="newEquipment.message" placeholder="请输入赔偿信息"></Input>
        </FormItem>
      </Form>
    </Modal>

    <!-- 删除 -->
    <Modal v-model="isDelete" title="删除" @on-ok="deleteCheck()" @on-cancel="isDelete=false">
      <p style="textAlign:center">是否确认删除？</p>
    </Modal>

    <!-- 编辑 -->
    <Modal
      v-model="isUpdate"
      title="编辑"
      @on-ok="updateCheck('updateEquipment')"
      @on-cancel="updateCancel('updateEquipment')"
    >
      <Form
        ref="updateEquipment"
        :model="updateEquipment"
        :rules="equipmentValidate"
        :label-width="80"
      >
        <FormItem label="编号" prop="name">
          <p>{{updateEquipment.id}}</p>
        </FormItem>
        <FormItem label="物品名称" prop="name">
          <Input v-model="updateEquipment.name" placeholder="请输入物品名称"></Input>
        </FormItem>
        <!-- <FormItem label="状态" prop="status">
          <Select v-model="updateEquipment.status">
            <Option v-for="item in status" :value="item.status" :key="item.status">{{ item.name }}</Option>
          </Select>
        </FormItem> -->
        <FormItem label="租用价格" prop="price">
          <Input number v-model="updateEquipment.price" placeholder="请输入租用价格"></Input>
        </FormItem>
        <FormItem label="赔偿信息" prop="message">
          <Input type="textarea" v-model="updateEquipment.message" placeholder="请输入赔偿信息"></Input>
        </FormItem>
        <FormItem label="类型" prop="typeId">
          <Select v-model="updateEquipment.typeId">
            <Option v-for="item in types" :value="item.typeId" :key="item.typeId">{{ item.name }}</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import {
  reqEquipments,
  reqDeleteEquipment,
  reqAddEquipment,
  reqUpdateEquipment,
  reqTypes
} from "../../api";

export default {
  data() {
    return {
      isSearch: false,
      isDelete: false,
      isRepair: false,
      isUpdate: false,
      isAdd: false,

      id: "",

      type: 1,
      types: [], // 器材类型

      status: [
        { status: 0, name: "正常" },
        { status: 1, name: "关闭" }
      ],

      // 获取全部器材信息
      equipmentColumns: [
        { title: "编号", key: "kitId", align: "center" },
        { title: "物品名称", key: "name", align: "center" },
        { title: "状态", key: "statusName", align: "center" },
        { title: "租用价格", key: "price", align: "center" },
        { title: "赔偿信息", key: "message", align: "center" },
        { title: "操作", slot: "action", align: "center" }
      ],
      equipments: [],

      // 添加
      newEquipment: {
        message: "",
        name: "",
        price: 0,
        typeId: 1
      },
      equipmentValidate: {
        message: [
          { required: true, message: "赔偿信息不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "物品名称不能为空", trigger: "blur" }
        ],
        price: [
          {
            required: true,
            message: "租用价格不能为空",
            trigger: "blur",
            type: "number"
          }
        ],
        typeId: [
          {
            required: true,
            message: "请选择器材状态",
            trigger: "change",
            type: "number"
          }
        ],
        status: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
            type: "number"
          }
        ]
      },

      // 更新
      updateEquipment: {
        id: "",
        message: "",
        name: "",
        price: 0,
        status: 0,
        typeId: 1
      },

      currentPage: 1,
      totalPages: 1
    };
  },
  mounted() {
    this.getEquipments();
    this.getTypes();
  },
  methods: {
    // 获取所有器材信息，默认
    async getEquipments() {
      var type = parseInt(this.type);
      let result = await reqEquipments(type, this.currentPage);
      if (result.status === 200) {
        this.equipments = result.data.list;
        this.currentPage = result.data.currPage;
        this.totalPages = result.data.totalPage;
      }
    },

    // 确认 添加
    addCheck(name) {
      let newEquipment = this.newEquipment;
      let result;
      this.$refs[name].validate(async valid => {
        if (valid) {
          result = await reqAddEquipment(
            newEquipment.message,
            newEquipment.name,
            newEquipment.price,
            newEquipment.typeId
          );
          if (result.status === 200) {
            this.$Message.success("添加成功");
            this.isAdd = false;
            this.getEquipments();
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

    // 点击 删除
    clickDelete(id) {
      this.id = id;
      this.isDelete = true;
    },

    // 确认 删除
    async deleteCheck() {
      let result = await reqDeleteEquipment(this.id);
      if (result.status === 200) {
        this.$Message.success("删除成功");
        this.isDelete = false;
        this.getEquipments();
      } else {
        this.$Message.error(result.msg);
      }
    },

    // 点击 编辑
    clickUpdate(row) {
      this.updateEquipment.id = row.kitId;
      this.updateEquipment.message = row.message;
      this.updateEquipment.name = row.name;
      this.updateEquipment.price = row.price;
      // this.updateEquipment.status = row.status;
      this.updateEquipment.typeId = row.typeId;
      this.isUpdate = true;
    },

    // 确认 编辑
    updateCheck(name) {
      let updateEquipment = this.updateEquipment;
      let result;
      this.$refs[name].validate(async valid => {
        if (valid) {
          result = await reqUpdateEquipment(
            updateEquipment.id,
            updateEquipment.message,
            updateEquipment.name,
            updateEquipment.price,
            updateEquipment.typeId
          );
          if (result.status === 200) {
            this.$Message.success("更新成功");
            this.isUpdate = false;
            this.getEquipments();
          } else {
            this.$Message.error(result.msg);
          }
        } else {
          this.$Message.error("更新失败");
        }
      });
    },

    // 取消编辑
    updateCancel(name) {
      this.$refs[name].resetFields();
      this.isUpdate = false;
    },

    // 获取类型
    async getTypes() {
      let result = await reqTypes();
      if (result.status === 200) {
        this.types = result.data;
      }
    },

    // 上一页
    async prePage() {
      let result = await reqEquipments(this.type, this.currentPage - 1);
      if (result.status === 200) {
        this.equipments = result.data.list;
        this.currentPage = result.data.currPage;
        this.totalPages = result.data.totalPage;
      }
    },

    // 下一页
    async nextPage() {
      let result = await reqEquipments(this.type, this.currentPage + 1);
      if (result.status === 200) {
        this.equipments = result.data.list;
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