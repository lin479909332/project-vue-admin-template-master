<template>
  <div>
    <el-table style="width: 100%; margin: 10px 0" border :data="records">
      <el-table-column
        type="index"
        label="序号"
        width="80"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="skuName"
        label="名称"
        width="width"
      ></el-table-column>
      <el-table-column
        prop="skuDesc"
        label="描述"
        width="width"
      ></el-table-column>
      <el-table-column prop="prop" label="默认图片" width="150" align="center">
        <template slot-scope="{ row }">
          <img
            style="width: 100px; height: 100px"
            :src="row.skuDefaultImg"
            alt="row.skuName"
          />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="130">
        <template scope="scope"> {{ scope.row.weight }} kg </template>
      </el-table-column>
      <el-table-column prop="price" label="价格" width="130">
        <template scope="scope"> ￥{{ scope.row.price }}.00 </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="300" align="center">
        <template slot-scope="{ row }">
          <hint-button
            type="success"
            icon="el-icon-upload2"
            size="mini"
            title="上架sku"
            v-if="row.isSale == 0"
            @click="sale(row)"
          ></hint-button>
          <el-button
            type="warning"
            icon="el-icon-download"
            size="mini"
            title="下架sku"
            @click="cancel(row)"
            v-else
          ></el-button>
          <hint-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            title="编辑sku(正在开发中)"
            @click="editSku"
          ></hint-button>
          <hint-button
            type="info"
            icon="el-icon-info"
            size="mini"
            title="sku详情"
            @click="getSkuInfo(row)"
          ></hint-button>
          <hint-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            title="删除sku"
          ></hint-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 
      @current-change="getSpuList" 点击页面切换
      @size-change="handlesizechange" 点击页面容量切换（limit）
     -->
    <el-pagination
      @current-change="getSkuList"
      @size-change="handlesizechange"
      style="margin-top: 20px; text-align: center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      :total="total"
      layout="prev,pager,next,jumper,->,sizes,total"
    ></el-pagination>

    <el-drawer :visible.sync="show" :show-close="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}.00 元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag
              type="success"
              v-for="attr in skuInfo.skuAttrValueList"
              :key="attr.id"
              style="margin-right: 10px"
            >
              {{ attr.valueName }}
            </el-tag>
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="12">
          <el-carousel height="500px">
            <el-carousel-item
              v-for="skuImage in skuInfo.skuImageList"
              :key="skuImage.id"
            >
              <img :src="skuImage.imgUrl" :alt="skuImage.imgName" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      //当前是第几页
      page: 1,
      //每页一共显示多少数据
      limit: 10,
      //sku列表的数据
      records: [],
      //数据条数
      total: 0,
      //是否显示抽屉
      show: false,
      //skuInfo详情信息
      skuInfo: {},
    };
  },
  mounted() {
    //获取sku列表的数据
    this.getSkuList();
  },
  methods: {
    //获取sku列表数据的方法
    async getSkuList(pages = 1) {
      this.page = pages;
      //解构参数
      const { page, limit } = this;
      //发请求
      let result = await this.$API.sku.reqSkuList(page, limit);
      if (result.code == 200) {
        //保存sku列表的数据
        this.records = result.data.records;
        //保存数据条数
        this.total = result.data.total;
      }
    },
    //页面容量切换的方法
    handlesizechange(limit) {
      //将用户选择的容量复制给limit
      this.limit = limit;
      //重新获取sku列表数据
      this.getSkuList();
    },
    //上架sku
    async sale(row) {
      let result = await this.$API.sku.reqSale(row.id);
      if (result.code == 200) {
        row.isSale = 1;
        this.$message({
          type: "success",
          showClose: true,
          message: "上架成功！",
        });
      }
    },
    //下架sku
    async cancel(row) {
      let result = await this.$API.sku.reqCancel(row.id);
      if (result.code == 200) {
        row.isSale = 0;
        this.$message({
          type: "success",
          showClose: true,
          message: "下架成功！",
        });
      }
    },
    //编辑sku（开发中）
    editSku() {
      this.$message({
        type: "info",
        showClose: true,
        message: "正在开发ing...",
      });
    },
    //点击sku详情按钮
    async getSkuInfo(sku) {
      //发请求
      let result = await this.$API.sku.reqSkuById(sku.id);
      if (result.code == 200) {
        this.skuInfo = result.data;
      }
      //显示抽屉
      this.show = true;
    },
  },
};
</script>

<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.el-carousel__item img {
  width: 500px;
  height: 500px;
}
.el-carousel__button  {
  width: 10px;
  height: 10px;
  background: grey;
  border-radius: 50%;
}
</style>

<style scoped>
.el-row .el-col-5 {
  font-size: 20px;
  font-weight: bold;
  text-align: right;
}
.el-row .el-col-16 {
  font-size: 18px;
}
.el-col {
  margin: 10px 10px;
  line-height: 40px;
}
/* 
深度选择器 在父组件的style标签且具有scope的情况下影响到子组件的样式
>>>          一般用于源生css
/deep/       一般用于less
::v-deep     一般用于scss
*/
/* 写在这里vscode会报错 强迫症受不了 写在上面去了 效果一样
>>>.el-carousel__button  {
  width: 10px;
  height: 10px;
  background: grey;
  border-radius: 50%;
}
*/
</style>