<template>
  <div>
    <el-card style="margin: 20px 0">
      <!-- show传递给子组件控制三级联动 -->
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="!isShowTable"
      ></CategorySelect>
    </el-card>
    <el-card>
      <!-- 属性显示界面 -->
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <el-table style="width: 100%; margin: 20px 0" border :data="attrList">
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="attrName"
            label="属性名称"
            width="150"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row }">
              <el-tag
                type="success"
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                style="margin: 0 10px"
              >
                {{ attrValue.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150" align="center">
            <template slot-scope="{ row,$index }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteAttr(row,$index)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加|修改属性界面 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrInfo.attrName"
          @click="addAttrValue"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table
          style="width: 100%; margin: 20px 0"
          border
          :data="attrInfo.attrValueList"
        >
          <el-table-column
            align="center"
            type="index"
            label="序号"
            width="80"
          ></el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
                :ref="$index"
              ></el-input>
              <span
                style="display: block"
                v-else
                @click="toEdit(row, $index)"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                confirm-button-text="确定"
                cancel-button-text="取消"
                icon="el-icon-info"
                icon-color="red"
                :title="`确定要删除${row.valueName}吗`"
                :ref="$index"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 属性值列表里没数据的时候 不能使用保存按钮 -->
        <el-button
          type="primary"
          @click="addOrUpdateAttr"
          :disabled="attrInfo.attrValueList.length < 1"
          >保存</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      //一二三级id
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //平台属性的字段
      attrList: [],
      //控制添加|修改表格的显示与隐藏
      isShowTable: true,
      //接收平台属性的数据
      attrInfo: {
        //属性名
        attrName: "",
        //属性值，可能存在多个 所以用数组
        attrValueList: [],
        //三级分类的id
        categoryId: 0,
        //服务器区分几级分类
        categoryLevel: 3,
      },
    };
  },
  methods: {
    //自定义事件的回调
    getCategoryId({ categoryId, level }) {
      //区分三级分类相应的id,以及父组件进行存储
      //收到子组件传递来的一级id
      if (level == 1) {
        //保存对应id，后续发请求用
        this.category1Id = categoryId;
        //清空二级、三级id
        this.category2Id = "";
        this.category3Id = "";
        //收到子组件传递来的二级id
      } else if (level == 2) {
        //保存对应id，后续发请求用
        this.category2Id = categoryId;
        //清空三级id
        this.category3Id = "";
        //收到子组件传递来的三级id
      } else {
        //保存对应id，后续发请求用
        this.category3Id = categoryId;
        //发请求
        this.getAttrList();
      }
    },
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    //向属性值的数组里面添加元素
    //attrId:是你相应的属性的id，目前而言我们是添加属性的操作，还没有相应的属性的id，目前而言带给服务器的id为undefined
    //valueName:相应的属性值的名称
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        ///对于修改某一个属性的时候，可以在已有的属性值基础之上新增新的属性值（新增属性值的时候，需要把已有的属性的id带上
        attrId: this.attrInfo.id,
        valueName: "",
        //切换编辑|查看模式    true编辑模式，false查看模式
        flag: true,
      });
      //新增属性值时聚焦
      //等待节点渲染完毕
      this.$nextTick(() => {
        //由于新增的永远是在最后一项，这里的下标直接用数组长度-1即
        //这里会出警告
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    addAttr() {
      //切换表格的显示与隐藏
      this.isShowTable = false;
      //清空数据
      this.attrInfo = {
        //属性名
        attrName: "",
        //属性值，可能存在多个 所以用数组
        attrValueList: [],
        //三级分类的id
        //在这里手机三级分类的id
        categoryId: this.category3Id,
        //服务器区分几级分类
        categoryLevel: 3,
      };
    },
    //修改|更新数据
    updateAttr(row) {
      //切换表格的显示与隐藏
      this.isShowTable = false;
      //选中的属性赋值给attrInfo
      //由于这里的数据比较复杂 且涉及到较多的双向绑定 所以这里用深拷贝
      this.attrInfo = cloneDeep(row);
      //在修改某一个属性的时候，将相应的属性值元素添加上flag这个标记
      this.attrInfo.attrValueList.forEach((item) => {
        /*
        这样书写也可以给属性值添加flag自动，但是会发现视图不会跟着变化(因为flag不是响应式数据)
        item.flag = false
        */
        //因为vue无法探测普通的新增 property,这样书写的属性并非响应式属性（数据变化视图跟着变)
        //第一个参数:对象  第二个参数:添加新的响应式属性  第三参数:新的属性的属性值
        this.$set(item, "flag", false);
      });
    },
    //切换为浏览模式
    toLook(row) {
      //判断用户是否输入空串
      if (row.valueName.trim() == "") {
        this.$message.error("属性值不能为空，请重新输入！");
        return;
      }
      //判断用户输入的属性值是否与已有的属性值重复
      //some返回一个布尔值
      let isRepeat = this.attrInfo.attrValueList.some((item) => {
        //row是用户新增的属性值，这里要把row去除，否则时钟返回true
        if (row !== item) {
          //发现用户输入的属性值与已有的属性值重复
          return row.valueName == item.valueName;
        }
      });
      //提示重复
      if (isRepeat) {
        this.$message.error("属性值出现重复，请重新输入！");
        return;
      }
      //切换查看模式的切换与隐藏
      row.flag = false;
    },
    //切换回编辑模式
    toEdit(row, index) {
      //切换查看模式的切换与隐藏
      row.flag = true;
      //获取input节点,实现自动聚焦
      //需要注意:点击span的时候，切换为input变为编辑模式，但是需要注意,对于浏览器而言，页面重绘与重排是要耗时间的
      //点击span的时候，重绘重排一个input它是需要耗费事件，因此我们不可能一点击span立马获取到input
      //$nextTick,当节点渲染完毕了,会执行一次
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    //点击pop提示框的删除按钮
    deleteAttrValue(index) {
      //这个删除操作目前不需要发请求
      this.attrInfo.attrValueList.splice(index, 1);
    },
    //点击保存按钮
    async addOrUpdateAttr() {
      //整理参数:如果用户添加很多属性值，且属性值为空的不应该提交给服务器
      //提交给服务器数据当中不应该出现flag字段
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          //过滤掉属性值为空的
          if (item.valueName != "") {
            //删除掉flag属性
            delete item.flag;
            return true;
          }
        }
      );
      try {
        //发请求
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        //重新获取属性列表
        this.getAttrList();
        //显示表格界面
        this.isShowTable = true;
        //提示消息
        this.$message({ type: "success", message: "保存成功" });
      } catch (error) {
        //提示消息（保存失败）
        this.$message({ type: "error", message: "保存失败" });
      }
    },
    //自己做的删除属性
    deleteAttr(row,index) {
      console.log(row);
      this.$confirm(`此操作将删除${row.attrName}。是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.attrList.splice(index,1);
        })
        .catch(() => {
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
</style>