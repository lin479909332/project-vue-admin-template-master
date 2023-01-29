<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category1Id"
          @change="handler1"
          :disabled="show"
        >
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="c1 in list1"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category2Id"
          @change="handler2"
          :disabled="show"
        >
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="c2 in list2"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category3Id"
          @change="handler3"
          :disabled="show"
        >
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="c3 in list3"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  // 父传子控制三级联动是否可用
  props:["show"],
  data() {
    return {
      //一级分类的数据
      list1: [],
      //一级分类的数据
      list2: [],
      //一级分类的数据
      list3: [],
      //收集一二三级分类的id
      cForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  mounted() {
    //获取一级分类的方法
    this.getCategory1List();
  },
  methods: {
    //获取一级分类
    async getCategory1List() {
      let result = await this.$API.attr.reqCategory1List();
      if (result.code == 200) {
        this.list1 = result.data;
      }
    },
    //一级分类的select事件回调（当一级分类的option发生变化的时候获取相应二级分类的数据)
    async handler1() {
      //清空二三级标签
      this.list2 = [];
      this.list3 = [];
      this.cForm.category2Id = "";
      this.cForm.category3Id = "";
      const { category1Id } = this.cForm;
      //字传父，自定义事件传递自身id及自己是几级id
      this.$emit("getCategoryId", { categoryId: category1Id, level: 1 });
      let result = await this.$API.attr.reqCategory2List(category1Id);
      if (result.code == 200) {
        this.list2 = result.data;
      }
    },
    //二级分类的select事件回调（当一级分类的option发生变化的时候获取相应二级分类的数据)
    async handler2() {
      //清空三级标签
      this.list3 = [];
      this.cForm.category3Id = "";
      const { category2Id } = this.cForm;
      //字传父，自定义事件传递自身id及自己是几级id
      this.$emit("getCategoryId", { categoryId: category2Id, level: 2 });
      let result = await this.$API.attr.reqCategory3List(category2Id);
      if (result.code == 200) {
        this.list3 = result.data;
      }
    },
    handler3() {
      const { category3Id } = this.cForm;
      //字传父，自定义事件传递自身id及自己是几级id
      this.$emit("getCategoryId", { categoryId: category3Id, level: 3 });
    },
  },
};
</script>

<style>
</style>