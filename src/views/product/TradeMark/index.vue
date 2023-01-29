<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0px"
      @click="showDialog"
      >添加</el-button
    >
    <el-table style="width: 100%" border :data="list">
      <!-- 
        表格组件
        data:表格组件将来需要展示的数据------数组类型
        border:是给表格添加边框
        column属性
        label:显示标题
        width:对应列的宽度
        align:标题的对齐方式
       -->
      <el-table-column
        type="index"
        prop="prop"
        label="序号"
        width="80px"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="tmName"
        label="品牌名称"
        width="width"
      ></el-table-column>
      <el-table-column prop="prop" label="品牌logo" width="width">
        <template slot-scope="{ row }">
          <img :src="row.logoUrl" style="height: 100px; width: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 
      分页器
      当前第几页、数据总条数、每一页展示条数、连续页码数
      @size-change="handlesizechange"
      @current-change="handlecurrentchange"
      current-page:代表的是当前第几页
      total:代表分页器一共需要展示数据条数
      page-size:代表的是每一页需要展示多少条数据
      page-sizes:代表可以设置每一页展示多少条数据
      layout:可以实现分页器布局
      pager-count:按钮的数量如果9连续页码是7
    -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[3, 5, 10]"
      :pager-count="7"
      @current-change="handlecurrentchange"
      @size-change="handlesizechange"
      layout="prev,pager,next,jumper,->,sizes,total"
    ></el-pagination>

    <el-dialog
      :title="this.tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <!-- Form组件提供了表单验证的功能，只需要通过rules属性传入约定的验证规则，
        并将 Form-Item的 prop属性设置为需校验的字段名即可-->
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌logo" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/upload"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TradeMark",
  data() {
    var validateTmName = (rule, value, callback) => {
      if (value.trim().length < 2 || value.trim().length > 10) {
        callback(new Error("品牌名称长度须 2-10 位"));
      } else {
        callback();
      }
    };
    return {
      // 当前页码
      page: 1,
      // 当前页面展示数据条数
      limit: 3,
      //总共的数据条数
      total: 0,
      //列表展示的数据
      list: [],
      //是否显示对话框
      dialogFormVisible: false,
      //收集品牌信息:对象身上的属性，不能瞎写，需要看文档的
      tmForm: {
        logoUrl: "",
        tmName: "",
      },
      //表单验证规则
      rules: {
        //require:必须要校验字段（前面五角星有关系）message提示信息
        //trigger:用户行为设置(事件的设置:blur【失去焦点】、change【文本放生变换】）

        //品牌名称的验证规则
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          //自定义校验规则
          { validator: validateTmName, trigger: "blur" },
        ],
        //品牌logo的验证规则
        logoUrl: [{ required: true, message: "请上传品牌logo" }],
      },
    };
  },
  mounted() {
    //获取列表数据
    this.getPageList();
  },
  methods: {
    //获取列表数据的方法
    async getPageList(pager) {
      //解构参数
      const { page, limit } = this;
      //向服务器发请求
      let result = await this.$API.trademark.reqTradeMarkList(page, limit);
      if (result.code == 200) {
        //保存总共的数据条数和列表展示的数据
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    handlecurrentchange(page) {
      //跳转到当前点击的页面
      this.page = page;
      //重新获取页面列表数据
      this.getPageList();
    },
    handlesizechange(limit) {
      //修改每页展示多少条数据
      this.limit = limit;
      //重新获取页面列表数据
      this.getPageList();
    },
    showDialog() {
      //显示对话框
      this.dialogFormVisible = true;
      //清空数据
      this.tmForm = { tmName: "", logoUrl: "" };
    },
    //修改品牌
    updateTradeMark(row) {
      //显示对话框
      this.dialogFormVisible = true;
      //将已有的品牌信息赋值给tmForm进行展示
      //将服务器返回品牌的信息,直接赋值给了tmForm进行展示。
      //也就是tmForm存储即为服务器返回品牌信息
      //深拷贝一份
      this.tmForm = { ...row };
    },
    // 图片上传成功
    handleAvatarSuccess(res, file) {
      //res:上传成功之后返回前端数据
      //file:上传成功之后服务器返回前端数据
      this.tmForm.logoUrl = res.data;
    },
    //图片上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //添加按钮 (添加|修改共用)
    addOrUpdateTradeMark() {
      this.$refs.ruleForm.validate(async (success) => {
        //如果全部验证通过
        if (success) {
          //隐藏消息框
          this.dialogFormVisible = false;
          //发请求
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(
            this.tmForm
          );
          if (result.code == 200) {
            //弹出成功消息
            this.$message({
              showClose: true,
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
              type: "success",
            });
            //重新获取页面
            //添加或者修改品牌成功以后，需要再次获取品牌列表进行展示
            //如果添加品牌:停留在第一页,修改品牌应该留在当前页面
            this.getPageList(this.tmForm.id ? this.page : 1);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //删除品牌的按钮
    deleteTradeMark(row) {
      this.$confirm(`是否要删除${row.tmName}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          //确定删除时触发
          //发请求
          let result = await this.$API.trademark.reqDeleteTradeMark(row.id);
          //删除成功
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            //再次获取列表数据
            this.handlecurrentchange(this.list.length > 1 ? this.page : this.page - 1);
          }
        })
        .catch(() => {
          //取消删除时触发
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>