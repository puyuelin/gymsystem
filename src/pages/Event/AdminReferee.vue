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

    <!-- 所有裁判信息 -->
    <div class="content">
      <Table border :columns="refereeColumns" :data="referees">
        <template slot-scope="{ row, index }" slot="action">
          <Button
            type="error"
            size="small"
            style="margin-right: 5px"
            @click="clickDelete(row.refereeId)"
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
    <Modal v-model="isAdd" title="添加">
      <Form ref="newReferee" :model="newReferee" :rules="newRefereeValidate" :label-width="110">
        <FormItem label="裁判姓名" prop="refereeName">
          <Input v-model="newReferee.refereeName" placeholder="请输入裁判姓名"></Input>
        </FormItem>
        <FormItem label="裁判类型" prop="refereeType">
          <Select
            v-model="newReferee.refereeType"
            placeholder="请选择裁判类型"
            @on-change="typeIdSelect(newReferee.refereeType)"
          >
            <Option
              v-for="item in refereeTypes"
              :value="item.typeId"
              :key="item.typeId"
            >{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="裁判联系方式" prop="refereeTelephone">
          <Input v-model="newReferee.refereeTelephone" placeholder="请输入裁判联系方式"></Input>
        </FormItem>

        <FormItem label="裁判头像" prop="refereeAvatar">
          <div class="demo-upload-list" v-if="hasImage">
            <img :src="newReferee.refereeAvatar" />
            <div class="demo-upload-list-cover">
              <Icon type="ios-trash-outline" @click.native="handleRemove()"></Icon>
              <Icon type="ios-eye-outline" @click.native="handleView(newReferee.refereeAvatar)"></Icon>
            </div>
          </div>
          <Upload
            :action="actionUrl"
            :format="['jpg','jpeg','png']"
            :max-size="2048"
            :on-exceeded-size="handleMaxSize"
            :on-success="handleSuccess"
            :show-upload-list="false"
            :headers="headers"
            style="width:58px;"
          >
            <Button icon="ios-cloud-upload-outline">上传图片</Button>
          </Upload>
        </FormItem>

        <FormItem label="裁判介绍" prop="refereeIntruduction">
          <Input v-model="newReferee.refereeIntruduction" type="textarea" placeholder="请介绍裁判" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button style="float:left" @click="addCancel('newReferee')">取消</Button>
        <Button type="info" @click="addCheck('newReferee')">确认</Button>
      </div>
    </Modal>

    <!-- 编辑 -->
    <Modal v-model="isUpdate" title="编辑">
      <Form
        ref="updateReferee"
        :model="updateReferee"
        :rules="updateRefereeValidate"
        :label-width="110"
      >
        <FormItem label="裁判编号">
          <p>{{refereeId}}</p>
        </FormItem>
        <FormItem label="裁判姓名" prop="refereeName">
          <Input v-model="updateReferee.refereeName" placeholder="请输入裁判姓名"></Input>
        </FormItem>
        <FormItem label="裁判类型" prop="refereeType">
          <Select
            v-model="updateReferee.refereeType"
            placeholder="请选择裁判类型"
            @on-change="typeIdUpdateSelect(updateReferee.refereeType)"
          >
            <Option
              v-for="item in refereeTypes"
              :value="item.typeId"
              :key="item.typeId"
            >{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="裁判联系方式" prop="refereeTelephone">
          <Input v-model="updateReferee.refereeTelephone" placeholder="请输入裁判联系方式"></Input>
        </FormItem>

        <FormItem label="裁判头像" prop="refereeAvatar">
          <div class="demo-upload-list" v-if="hasImage">
            <img :src="updateReferee.refereeAvatar" />
            <div class="demo-upload-list-cover">
              <Icon type="ios-trash-outline" @click.native="handleRemove()"></Icon>
              <Icon type="ios-eye-outline" @click.native="handleView(updateReferee.refereeAvatar)"></Icon>
            </div>
          </div>
          <Upload
            :action="actionUrl"
            :format="['jpg','jpeg','png']"
            :max-size="2048"
            :on-exceeded-size="handleMaxSize"
            :on-success="updateImgSuccess"
            :show-upload-list="false"
            :headers="headers"
            style="width:58px;"
          >
            <Button icon="ios-cloud-upload-outline">上传图片</Button>
          </Upload>
        </FormItem>

        <FormItem label="裁判介绍" prop="refereeIntruduction">
          <Input v-model="updateReferee.refereeIntruduction" type="textarea" placeholder="请介绍裁判" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button style="float:left" @click="isUpdate=false">取消</Button>
        <Button type="info" @click="updateCheck('updateReferee')">确认</Button>
      </div>
    </Modal>

    <!-- 删除 -->
    <Modal v-model="isDelete" title="删除" @on-ok="removeCheck" @on-cancel="isDelete=false">
      <p style="textAlign:center">确认删除吗？</p>
    </Modal>

    <!-- 查看图片 -->
    <Modal title="图片预览" v-model="visible">
      <img :src="showImageUrl" v-if="visible" style="width: 100%" />
    </Modal>
  </div>
</template>

<script>
import {
  reqReferees,
  reqAddReferee,
  reqTypes,
  reqUpdateReferee,
  reqDeleteReferee,
  reqImg
} from "../../api";
export default {
  data() {
    return {
      isAdd: false,
      isUpdate: false,
      isDelete: false,
      visible: false,

      actionUrl: "/srs/sys/file/uploadPic",
      showImageUrl: "",
      hasImage: false,

      refereeTypes: [],

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
        { title: "裁判联系方式", key: "tel", align: "center" },
        { title: "操作", slot: "action", align: "center" }
      ],
      referees: [],
      refereeId: "",
      // 添加的裁判信息
      newReferee: {
        refereeName: "",
        refereeType: 1,
        refereeTelephone: "",
        refereeAvatar: "",
        refereeIntruduction: ""
      },
      newRefereeValidate: {
        refereeName: [
          { required: true, message: "裁判姓名不能为空", trigger: "blur" }
        ],
        refereeType: [
          {
            required: true,
            trigger: "change",
            message: "请选择裁判类型",
            type: "number"
          }
        ],
        refereeTelephone: [
          { required: true, message: "裁判联系方式不能为空", trigger: "blur" }
        ],
        refereeAvatar: [
          { required: true, message: "裁判头像不能为空", trigger: "blur" }
        ],
        refereeIntruduction: [
          { required: true, message: "裁判介绍不能为空", trigger: "blur" }
        ]
      },

      // 更新的裁判信息
      updateReferee: {
        refereeName: "",
        refereeType: 1,
        refereeTelephone: "",
        refereeAvatar: "",
        refereeIntruduction: ""
      },
      updateRefereeValidate: {
        refereeName: [
          { required: true, message: "裁判姓名不能为空", trigger: "blur" }
        ],
        refereeType: [
          {
            required: true,
            trigger: "change",
            message: "请选择裁判类型",
            type: "number"
          }
        ],
        refereeTelephone: [
          { required: true, message: "裁判联系方式不能为空", trigger: "blur" }
        ],
        refereeAvatar: [
          { required: true, message: "裁判头像不能为空", trigger: "blur" }
        ],
        refereeIntruduction: [
          { required: true, message: "裁判介绍不能为空", trigger: "blur" }
        ]
      },
      addAvatar: "",
      updateAvatar: "",

      currentPage: 1,
      totalPages: 1
    };
  },
  mounted() {
    this.getReferees();
    this.getTypes();
  },
  computed: {
    headers() {
      return {
        token: window.localStorage.getItem("token")
      };
    }
  },
  methods: {
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "图片大小限制",
        desc: "文件 " + file.name + "太大,不能超过 2M."
      });
    },
    handleView(imageUrl) {
      this.showImageUrl = imageUrl;
      this.visible = true;
    },
    handleRemove() {
      this.newReferee.refereeAvatar = "";
      this.updateReferee.refereeAvatar = "";
      this.hasImage = false;
    },
    // 添加图片成功
    handleSuccess(res, file) {
      this.newReferee.refereeAvatar =
        "http://39.98.226.151/srs/sys/" + res.data;
      // this.addAvatar = res.data;
      this.hasImage = true;
    },
    // 更新图片成功
    updateImgSuccess(res, file) {
      this.updateReferee.refereeAvatar =
        "http://39.98.226.151/srs/sys/" + res.data;
      // this.updateAvatar = res.data;
      this.hasImage = true;
    },

    // 获取所有裁判信息
    async getReferees() {
      let result = await reqReferees(this.currentPage);
      if (result.status === 200) {
        this.referees = result.data.list;
        this.currentPage = result.data.currPage;
        this.totalPages = result.data.totalPage;
      }
    },

    //
    typeIdSelect(typeId) {
      this.newReferee.refereeType = typeId;
    },

    // 确认添加
    addCheck(name) {
      let result;
      let newReferee = this.newReferee;
      let avatar = this.newReferee.refereeAvatar.split(
        "http://39.98.226.151/srs/sys/"
      );
      let addAvatar = avatar[1];
      this.$refs[name].validate(async valid => {
        if (valid) {
          result = await reqAddReferee(
            addAvatar,
            newReferee.refereeIntruduction,
            newReferee.refereeName,
            newReferee.refereeTelephone,
            newReferee.refereeType
          );
          if (result.status === 200) {
            this.$Message.success("添加成功");
            this.getReferees();
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

    // 点击 修改
    clickUpdate(row) {
      this.refereeId = row.refereeId;
      this.updateReferee.refereeName = row.name;
      this.updateReferee.refereeType = row.typeId;
      this.updateReferee.refereeTelephone = row.tel;
      this.updateReferee.refereeAvatar =
        "http://39.98.226.151/srs/sys/" + row.head;
      this.updateReferee.refereeIntruduction = row.intro;
      this.isUpdate = true;
      this.hasImage = true;
    },

    typeIdUpdateSelect(typeId) {
      this.updateReferee.refereeType = typeId;
    },

    // 确认 修改
    updateCheck(name) {
      let result;
      let updateReferee = this.updateReferee;
      let refereeId = this.refereeId;
      let avatar = this.updateReferee.refereeAvatar.split(
        "http://39.98.226.151/srs/sys/"
      );
      let updateAvatar = avatar[1];

      this.$refs[name].validate(async valid => {
        if (valid) {
          result = await reqUpdateReferee(
            updateAvatar,
            updateReferee.refereeIntruduction,
            updateReferee.refereeName,
            refereeId,
            updateReferee.refereeTelephone,
            updateReferee.refereeType
          );
          if (result.status === 200) {
            this.$Message.success("更新成功");
            this.getReferees();
            this.isUpdate = false;
          } else {
            this.$Message.error(result.msg);
          }
        } else {
          this.$Message.error("更新失败");
        }
      });
    },

    // 点击 删除
    clickDelete(refereeId) {
      this.refereeId = refereeId;
      this.isDelete = true;
    },

    // 确认删除
    async removeCheck() {
      let result = await reqDeleteReferee(this.refereeId);
      if (result.status === 200) {
        this.$Message.success("删除成功");
        this.getReferees();
        this.isDelete = false;
      } else {
        this.$Message.error(result.msg);
      }
    },

    // 获取类型
    async getTypes() {
      let result = await reqTypes();
      if (result.status === 200) {
        this.refereeTypes = result.data;
      }
    },

    // 上一页
    async prePage() {
      let result = await reqReferees(this.currentPage - 1);
      if (result.status === 200) {
        this.referees = result.data.list;
        this.currentPage = result.data.currPage;
        this.totalPages = result.data.totalPage;
      }
    },

    // 下一页
    async nextPage() {
      let result = await reqReferees(this.currentPage + 1);
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

.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}

.ivu-icon {
  line-height: 58px;
}
</style>