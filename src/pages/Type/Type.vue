<template>
  <div>
    <div class="top">
      <Row>
        <Col span="24">
          <div class="top-right">
            <Button type="primary" icon="md-add" @click="isAdd = true">添加</Button>
          </div>
        </Col>
      </Row>
    </div>

    <!-- 所有信息 -->
    <div class="content">
      <Table border :columns="typeColums" :data="types"></Table>
    </div>

    <!-- 添加 -->
    <Modal v-model="isAdd" title="添加">
      <Form ref="newType" :model="newType" :rules="newTypeValidate" :label-width="80">
        <FormItem label="类型名" prop="name">
          <Input v-model="newType.name" placeholder="请输入类型名"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button style="float:left" @click="addCancel('newType')">取消</Button>
        <Button type="info" @click="addCheck('newType')">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { reqTypes, reqAddType } from "../../api";
export default {
  data() {
    return {
      isAdd: false,

      types: [],
      typeColums: [
        { title: "类型编号", key: "typeId", align: "center" },
        { title: "类型名", key: "name", align: "center" }
      ],

      newType: {
        name: ""
      },
      newTypeValidate: {
        name: [{ required: true, message: "类型名不能为空", trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.getTypes();
  },
  methods: {
    //   获取所有的类型
    async getTypes() {
      let result = await reqTypes();
      if (result.status === 200) {
        this.types = result.data;
      }
    },

    // 确认 添加
    addCheck(name) {
      let newType = this.newType;
      this.$refs[name].validate(async valid => {
        if (valid) {
          result = await reqAddType(newType.name);
          if (result.status === 200) {
            this.$Message.success("添加成功");
            this.isAdd = false;
            this.getTypes();
          }
        } else {
          this.$Message.error(result.msg);
        }
      });
    },

    // 取消添加
    addCancel(name) {
      this.$refs[name].resetFields();
      this.isAdd = false;
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