<template>
  <div>
    <!-- 课程 -->
    <div v-if="isCourse">
      <div class="top">
        <div class="top-right">
          <Button type="primary" icon="md-add" @click="isAddCourse=true">新增</Button>
        </div>
      </div>

      <div class="content">
        <Table border :columns="courseColumns" :data="courses">
          <template slot-scope="{ row, index }" slot="action">
            <Button
              type="error"
              size="small"
              style="margin-right: 5px"
              @click="clickDeleteCourse(row.courseId)"
            >删除</Button>
            <Button
              type="info"
              size="small"
              style="margin-right: 5px"
              @click="clickUpdateCourse(row)"
            >更改</Button>
            <Button type="success" size="small" @click="clickCourseDetail(row.courseId)">详情</Button>
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
      <Modal v-model="isAddCourse" title="添加">
        <Form ref="newCourse" :model="newCourse" :rules="newCourseValidate" :label-width="125">
          <FormItem label="类别" prop="typeId">
            <Select v-model="newCourse.typeId">
              <Option v-for="item in types" :value="item.typeId" :key="item.typeId">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="班级名" prop="courseName">
            <Input v-model="newCourse.courseName" placeholder="请输入班级名"></Input>
          </FormItem>
          <FormItem label="任课老师" prop="teacherName">
            <Input v-model="newCourse.teacherName" placeholder="请输入任课老师名"></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button style="float:left" @click="addCourseCancel('newCourse')">取消</Button>
          <Button type="info" @click="addCourseCheck('newCourse')">提交</Button>
        </div>
      </Modal>

      <!-- 删除 -->
      <Modal v-model="isDeleteCourse" title="删除">
        <p style="textAlign:center">确认删除吗？</p>
        <div slot="footer">
          <Button style="float:left" @click="isDeleteCourse=false">否</Button>
          <Button type="info" @click="deleteCourseCheck()">是</Button>
        </div>
      </Modal>

      <!-- 更新 -->
      <Modal v-model="isUpdateCourse" title="更新">
        <Form
          ref="updateCourse"
          :model="updateCourse"
          :rules="newCourseValidate"
          :label-width="125"
        >
          <FormItem label="课程编号" prop="courseId">
            <p>{{updateCourse.courseId}}</p>
          </FormItem>
          <FormItem label="类别" prop="typeId">
            <Select v-model="updateCourse.typeId">
              <Option v-for="item in types" :value="item.typeId" :key="item.typeId">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="班级名" prop="courseName">
            <Input v-model="updateCourse.courseName" placeholder="请输入班级名"></Input>
          </FormItem>
          <FormItem label="任课老师" prop="teacherName">
            <Input v-model="updateCourse.teacherName" placeholder="请输入任课老师名"></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button style="float:left" @click="updateCourseCancel('updateCourse')">取消</Button>
          <Button type="info" @click="updateCourseCheck('updateCourse')">提交</Button>
        </div>
      </Modal>
    </div>

    <!-- 上课场地 -->
    <div v-else>
      <div class="top">
        <Row>
          <Col span="12">
            <div class="top-left">
              <Button type="primary" icon="md-arrow-back" @click="backCheck()">返回</Button>
            </div>
          </Col>
          <Col span="12">
            <div class="top-right">
              <Button type="primary" icon="md-add" @click="clickAdd()">新增</Button>
            </div>
          </Col>
        </Row>
      </div>

      <div class="content">
        <Table border :columns="classFieldColumns" :data="classFields">
          <template slot-scope="{ row, index }" slot="action">
            <Button
              type="error"
              size="small"
              style="margin-right: 5px"
              @click="clickDelete(row.courseGymId)"
            >删除</Button>
          </template>
        </Table>
      </div>

      <!-- 分页 -->
      <div class="bottom">
        <template>
          <Button type="primary" @click="preClassPage()">上一页</Button>
          <span>{{currentPage}}/{{totalPages}}</span>
          <Button type="primary" @click="nextClassPage()">下一页</Button>
        </template>
      </div>

      <!-- 添加 -->
      <Modal v-model="isAdd" title="添加">
        <Form
          ref="newClassField"
          :model="newClassField"
          :rules="newClassFieldValidate"
          :label-width="125"
        >
          <FormItem label="类别" prop="typeId">
            <Select v-model="newClassField.typeId">
              <Option v-for="item in types" :value="item.typeId" :key="item.typeId">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="场地位置" prop="gymId">
            <Select v-model="newClassField.gymId">
              <Option v-for="item in places" :value="item.gymId" :key="item.gymId">{{ item.locate }}</Option>
            </Select>
          </FormItem>
          <FormItem label="时间">
            <Row>
              <Col span="11">
                <FormItem prop="date">
                  <DatePicker
                    type="date"
                    placeholder="请选择时间"
                    @on-change="dateChange"
                    format="yyyy-MM-dd"
                  ></DatePicker>
                </FormItem>
              </Col>
              <Col span="2" style="text-align: center">-</Col>
              <Col span="11">
                <FormItem prop="time">
                  <Select v-model="newClassField.time">
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
        </Form>
        <div slot="footer">
          <Button style="float:left" @click="addCancel('newClassField')">取消</Button>
          <Button type="info" @click="addCheck('newClassField')">提交</Button>
        </div>
      </Modal>

      <!-- 删除 -->
      <Modal v-model="isDelete" title="删除">
        <p style="textAlign:center">确认删除吗？</p>
        <div slot="footer">
          <Button style="float:left" @click="isDelete=false">取消</Button>
          <Button type="info" @click="deleteCheck()">确认</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
import {
  reqClassFields,
  reqTypes,
  reqAddClassField,
  reqCourses,
  reqAddCourse,
  reqDeleteCourse,
  reqUpdateCourse,
  reqTimes,
  reqDeleteClassField,
  reqFieldPlaces
} from "../../api";

export default {
  data() {
    return {
      isDeleteCourse: false,
      isUpdateCourse: false,
      isAddCourse: false,
      isCourse: true,
      isDelete: false,

      fieldTypes: [], // 场地类别
      fieldPlaces: [], // 场地位置

      /** 课程管理 */
      types: [], // 类别
      courses: [], // 课程信息
      courseColumns: [
        { title: "课程编号", key: "courseId", align: "center" },
        { title: "类别名", key: "typeName", align: "center" },
        { title: "班级名", key: "courseName", align: "center" },
        { title: "任课老师", key: "teacherName", align: "center" },
        { title: "操作", slot: "action", align: "center" }
      ],
      // 新课程
      newCourse: {
        typeId: 1,
        courseName: "",
        teacherName: ""
      },
      newCourseValidate: {
        typeId: [
          {
            required: true,
            message: "请选择类型",
            trigger: "change",
            type: "number"
          }
        ],
        courseName: [
          { required: true, message: "课程名不能为空", trigger: "blur" }
        ],
        teacherName: [
          { required: true, message: "老师名不能为空", trigger: "blur" }
        ]
      },
      courseId: "", // 课程id
      updateCourse: {
        courseId: "",
        typeId: 1,
        courseName: "",
        teacherName: ""
      },
      currentPage: 1,
      totalPages: 1,

      /** 上课场地管理 */
      isAdd: false,
      classFieldColumns: [
        { title: "场地编号", key: "courseGymId", align: "center" },
        { title: "场地类别", key: "typeName", align: "center" },
        { title: "班级名", key: "courseName", align: "center" },
        { title: "场地位置", key: "locate", align: "center" },
        { title: "上课开始时间", key: "startTime", align: "center" },
        { title: "上课结束时间", key: "endTime", align: "center" },
        { title: "操作", slot: "action", align: "center" }
      ],
      classFields: [], // 上课场地信息
      places: [], // 场地位置
      // 添加
      newClassField: {
        courseId: "",
        typeId: 1,
        gymId: 0,
        date: "",
        time: ""
      },
      newClassFieldValidate: {
        typeId: [
          {
            required: true,
            message: "请选择类别",
            trigger: "change",
            type: "number"
          }
        ],
        gymId: [
          {
            required: true,
            message: "请输入场地位置",
            trigger: "blur",
            type: "number"
          }
        ],
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
        ]
      },
      times: [], // 时间段
      courseGymId: "",
      currentClassPage: 1,
      totalClassPages: 1
    };
  },
  mounted() {
    this.getCourses();
    this.getTypes();
  },
  methods: {
    /** 课程管理 */
    // 获取课程
    async getCourses() {
      let result = await reqCourses(this.currentPage);
      if (result.status === 200) {
        this.courses = result.data.list;
        this.currentPage = result.data.currPage;
        this.totalPages = result.data.totalPage;
      }
    },

    // 点击 添加课程
    clickAddCourse() {
      this.isAddCourse = true;
      this.getTypes();
    },

    // 确认 添加课程
    addCourseCheck(name) {
      let result;
      let newCourse = this.newCourse;
      this.$refs[name].validate(async valid => {
        if (valid) {
          result = await reqAddCourse(
            newCourse.typeId,
            newCourse.courseName,
            newCourse.teacherName
          );
          if (result.status === 200) {
            this.$Message.success("添加成功");
            this.getCourses();
            this.isAddCourse = false;
          } else {
            this.$Message.error(result.msg);
          }
        } else {
          this.$Message.error("添加失败");
        }
      });
    },

    // 取消 添加课程
    addCourseCancel(name) {
      this.$refs[name].resetFields();
      this.isAddCourse = false;
    },

    // 点击 删除课程
    clickDeleteCourse(id) {
      this.courseId = id;
      this.isDeleteCourse = true;
    },

    // 确认 删除课程
    async deleteCourseCheck() {
      let result = await reqDeleteCourse(this.courseId);
      if (result.status === 200) {
        this.$Message.success("删除成功");
        this.getCourses();
        this.isDeleteCourse = false;
      } else {
        this.$Message.error(result.msg);
      }
    },

    // 点击 更改课程
    clickUpdateCourse(row) {
      this.updateCourse.courseId = row.courseId;
      this.updateCourse.typeId = row.typeId;
      this.updateCourse.courseName = row.courseName;
      this.updateCourse.teacherName = row.teacherName;
      this.getTypes();
      this.isUpdateCourse = true;
    },

    // 确认 更改课程
    updateCourseCheck(name) {
      let result;
      let updateCourse = this.updateCourse;
      this.$refs[name].validate(async valid => {
        if (valid) {
          result = await reqUpdateCourse(
            updateCourse.courseId,
            updateCourse.typeId,
            updateCourse.courseName,
            updateCourse.teacherName
          );
          if (result.status === 200) {
            this.$Message.success("更新成功");
            this.getCourses();
            this.isUpdateCourse = false;
          } else {
            this.$Message.error(result.msg);
          }
        } else {
          this.$Message.error("更新失败");
        }
      });
    },

    // 取消 更改课程
    updateCourseCancel(name) {
      this.$refs[name].resetFields();
      this.isUpdateCourse = false;
    },

    // 上一页
    async prePage() {
      let result = await reqCourses(this.currentPage - 1);
      if (result.status === 200) {
        this.courses = result.data.list;
        this.currentPage = result.data.currPage;
        this.totalPages = result.data.totalPage;
      }
    },

    // 下一页
    async nextPage() {
      let result = await reqCourses(this.currentPage + 1);
      if (result.status === 200) {
        this.courses = result.data.list;
        this.currentPage = result.data.currPage;
        this.totalPages = result.data.totalPage;
      }
    },

    /** 课程场地管理 */
    // 点击 详情
    clickCourseDetail(id) {
      this.courseId = id;
      this.isCourse = false;
      this.getClassFields();
    },

    // 获取上课场地的信息
    async getClassFields() {
      let result = await reqClassFields(this.courseId, this.currentClassPage);
      if (result.status === 200) {
        this.classFields = result.data.list;
        this.currentClassPage = result.data.currPage;
        this.totalClassPages = result.data.totalPage;
      }
    },

    // 获取场地位置
    async getPlaces(typeId) {
      let result = await reqFieldPlaces(typeId);
      if (result.status === 200) {
        this.places = result.data.list;
      }
    },

    // 点击 添加
    clickAdd() {
      this.isAdd = true;
      this.getTypes();
      this.getTimes();
      this.getPlaces(this.newClassField.typeId);
    },

    // 确认添加
    addCheck(name) {
      let result;
      let courseId = this.courseId;
      let newClassField = this.newClassField;
      let times = newClassField.time.split(" ~ ");
      let startTime = newClassField.date + " " + times[0];
      let endTime = newClassField.date + " " + times[1];
      this.$refs[name].validate(async valid => {
        if (valid) {
          result = await reqAddClassField(
            courseId,
            startTime,
            endTime,
            newClassField.gymId,
            newClassField.typeId
          );
          if (result.status === 200) {
            this.$Message.info("添加成功");
            this.getClassFields();
            this.isAdd = false;
          } else {
            this.$Message.success(result.msg);
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
    clickDelete(courseGymId) {
      this.courseGymId = courseGymId;
      this.isDelete = true;
    },

    // 确认删除
    async deleteCheck() {
      let result = await reqDeleteClassField(this.courseGymId);
      if (result.status === 200) {
        this.$Message.success("删除成功");
        this.getClassFields();
        this.isDelete = false;
      } else {
        this.$Message.success(result.msg);
      }
    },

    // 上一页
    async preClassPage() {
      let result = await reqClassFields(
        this.courseId,
        this.currentClassPage - 1
      );
      if (result.status === 200) {
        this.classFields = result.data.list;
        this.currentClassPage = result.data.currPage;
        this.totalClassPages = result.data.totalPage;
      }
    },

    // 下一页
    async nextClassPage() {
      let result = await reqClassFields(
        this.courseId,
        this.currentClassPage + 1
      );
      if (result.status === 200) {
        this.classFields = result.data.list;
        this.currentClassPage = result.data.currPage;
        this.totalClassPages = result.data.totalPage;
      }
    },

    // 获取类别
    async getTypes() {
      let result = await reqTypes();
      if (result.status === 200) {
        this.types = result.data;
      }
    },

    async getTimes() {
      let result = await reqTimes();
      if (result.status === 200) {
        this.times = result.data;
      }
    },

    backCheck() {
      this.isCourse = true;
    },

    dateChange(e) {
      this.newClassField.date = e;
    }
  }
};
</script>

<style>
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