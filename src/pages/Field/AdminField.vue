<template>
  <div>
    <div class="top">
      <Row>
        <Col span="24">
          <div class="top-right">
            <Button type="primary" icon="md-add" @click="isAdd=true">申请</Button>
          </div>
        </Col>
      </Row>
    </div>

    <!-- 所有场地信息 -->
    <div class="content">
      <Table border :columns="fieldColumns" :data="fields">
        <template slot-scope="{ row, index }" slot="action">
          <Button
            type="error"
            size="small"
            style="margin-right: 5px"
            @click="clickDelete(row.gymId)"
          >删除</Button>
          <Button type="primary" size="small" @click="clickUpdate(row)">更新</Button>
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
    <Modal v-model="isAdd" title="添加">
      <Form ref="newFirld" :model="newFirld" :rules="newFieldValidate" :label-width="125">
        <FormItem label="场地状态" prop="status">
          <Select v-model="newFirld.status">
            <Option v-for="item in status" :value="item.status" :key="item.status">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="场地类别" prop="fieldType">
          <Select v-model="newFirld.fieldType">
            <Option
              v-for="item in fieldTypes"
              :value="item.typeId"
              :key="item.typeId"
            >{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="场地位置" prop="fieldPlace">
          <Input v-model="newFirld.fieldPlace" placeholder="请输入场地位置"></Input>
        </FormItem>
        <FormItem label="收费" prop="price">
          <Input number v-model="newFirld.price" placeholder="请输入金额"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button style="float:left" @click="addCancel('newFirld')">取消</Button>
        <Button type="info" @click="addCheck('newFirld')">确认</Button>
      </div>
    </Modal>

    <!-- 删除 -->
    <Modal v-model="isDelete" title="删除">
      <p style="textAlign:center">确认删除此条场地信息吗？</p>
      <div slot="footer">
        <Button style="float:left" @click="isDelete=false">取消</Button>
        <Button type="info" @click="deleteCheck()">确认</Button>
      </div>
    </Modal>

    <!-- 编辑 -->
    <Modal v-model="isUpdate" title="编辑">
      <Form ref="updateField" :model="updateField" :rules="updateFieldValidate" :label-width="125">
        <FormItem label="场地编号" prop="fieldNumber">
          <p>{{updateField.fieldNumber}}</p>
        </FormItem>
        <FormItem label="场地类别" prop="fieldType">
          <Select v-model="updateField.fieldType">
            <Option
              v-for="item in fieldTypes"
              :value="item.typeId"
              :key="item.typeId"
            >{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="场地位置" prop="fieldPlace">
          <Input v-model="updateField.fieldPlace" placeholder="请输入场地位置"></Input>
        </FormItem>
        <FormItem label="场地状态" prop="status">
          <Select v-model="updateField.status">
            <Option v-for="item in status" :value="item.status" :key="item.status">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="费用" prop="charge">
          <Input number v-model="updateField.charge" placeholder="请输入费用"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button style="float:left" @click="isUpdate=false">取消</Button>
        <Button type="info" @click="updateCheck('updateField')">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  reqTimes,
  reqTypes,
  reqFields,
  reqAddField,
  reqDeleteField,
  reqUpdateField
} from "../../api";
export default {
  data() {
    return {
      isSearch: false,
      isAdd: false,
      isDelete: false,
      isUpdate: false,

      status: [
        { status: 0, name: "正常" },
        { status: 1, name: "关闭" }
      ],

      fieldTypes: [],
      // 场地信息
      fieldColumns: [
        { title: "场地编号", key: "gymId", align: "center" },
        { title: "场地类别", key: "typeName", align: "center" },
        { title: "场地位置", key: "locate", align: "center" },
        { title: "场地状态", key: "statusName", align: "center" },
        { title: "收费", key: "price", align: "center" },
        { title: "操作", slot: "action", align: "center" }
      ],
      fields: [],
      // 添加
      newFirld: {
        status: 0,
        fieldType: 1,
        fieldPlace: "",
        price: 0
      },
      newFieldValidate: {
        status: [
          {
            required: true,
            message: "请选择场地状态",
            trigger: "change",
            type: "number"
          }
        ],
        fieldType: [
          {
            required: true,
            message: "请选择场地类别",
            trigger: "change",
            type: "number"
          }
        ],
        fieldPlace: [
          { required: true, message: "请输入场地位置", trigger: "blur" }
        ],
        price: [
          {
            required: true,
            message: "请输入金额",
            trigger: "blur",
            type: "number"
          }
        ]
      },
      gymId: "",
      // 更新的场地信息
      updateField: {
        fieldNumber: "",
        fieldType: 1,
        fieldPlace: "",
        charge: 0,
        status: 0
      },
      updateFieldValidate: {
        fieldType: [
          {
            required: true,
            message: "请选择场地类别",
            trigger: "change",
            type: "number"
          }
        ],
        fieldPlace: [
          { required: true, message: "请输入场地位置", trigger: "blur" }
        ],
        charge: [
          {
            required: true,
            message: "请填写费用",
            trigger: "blur",
            type: "number"
          }
        ],
        status: [
          {
            required: true,
            message: "请选择场地状态",
            trigger: "change",
            type: "number"
          }
        ]
      },
      currentPage: 1,
      totalPages: 1
    };
  },
  mounted() {
    this.getFields();
    this.getFieldTypes();
  },
  methods: {
    // 获取场地信息
    async getFields() {
      let result = await reqFields(this.currentPage);
      if (result.status === 200) {
        this.fields = result.data.list;
        this.currentPage = result.data.currPage;
        this.totalPages = result.data.totalPage;
      }
    },

    // 确认添加
    addCheck(name) {
      let newFirld = this.newFirld;
      this.$refs[name].validate(async valid => {
        if (valid) {
          let result = await reqAddField(
            newFirld.fieldPlace,
            newFirld.price,
            newFirld.status,
            newFirld.fieldType
          );
          if (result.status === 200) {
            this.$Message.success("添加成功");
            this.getFields();
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

    // 点击删除
    clickDelete(gymId) {
      this.gymId = gymId;
      this.isDelete = true;
    },

    // 确认删除
    async deleteCheck() {
      let result = await reqDeleteField(this.gymId);
      if (result.status === 200) {
        this.$Message.success("删除成功");
        this.getFields();
        this.isDelete = false;
      } else {
        this.$Message.error(result.msg);
      }
    },

    // 点击 维修
    clickUpdate(row) {
      this.isUpdate = true;
      this.updateField.fieldNumber = row.gymId;
      this.updateField.fieldPlace = row.locate;
      this.updateField.charge = row.price;
      this.updateField.status = row.status;
      this.updateField.fieldType = row.typeId;
    },

    // 确认更新
    updateCheck(name) {
      let updateField = this.updateField;
      this.$refs[name].validate(async valid => {
        if (valid) {
          let result = await reqUpdateField(
            updateField.fieldNumber,
            updateField.fieldPlace,
            updateField.charge,
            updateField.status,
            updateField.fieldType
          );
          if (result.status === 200) {
            this.$Message.success("更新成功");
            this.getFields();
            this.isUpdate = false;
          }else{
            this.$Message.error(result.msg);
          }
        } else {
          this.$Message.error("更新失败");
        }
      });
    },

    // 上一页
    async prePage() {
      let result = await reqFields(this.currentPage - 1);
      if (result.status === 200) {
        this.fields = result.data.list;
        this.currentPage = result.data.currPage;
        this.totalPages = result.data.totalPage;
      }
    },

    // 下一页
    async nextPage() {
      let result = await reqFields(this.currentPage + 1);
      if (result.status === 200) {
        this.fields = result.data.list;
        this.currentPage = result.data.currPage;
        this.totalPages = result.data.totalPage;
      }
    },

    // 获取场地类别
    async getFieldTypes() {
      let result = await reqTypes();
      if (result.status === 200) {
        this.fieldTypes = result.data;
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