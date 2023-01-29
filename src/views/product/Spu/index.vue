<template>
  <div>
    <el-card style="margin: 20px 0">
      <!-- 三级联动 -->
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="scene != 0"
      ></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="scene == 0">
        <!-- SPU列表 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin: 20px 0"
          :disabled="!category3Id"
          @click="addSpu"
          >添加SPU</el-button
        >
        <el-table style="width: 100%" border :data="records">
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="spuName"
            label="spu名称"
            width="width"
          ></el-table-column>
          <el-table-column
            prop="description"
            label="spu描述"
            width="width"
          ></el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row }">
              <hint-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSku(row)"
              ></hint-button>
              <hint-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="updateSpu(row)"
              ></hint-button>
              <hint-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu全部的sku列表"
                @click="showDialog(row)"
              ></hint-button>
              <el-popconfirm
                title="确定删除吗？"
                icon="el-icon-info"
                iconColor="red"
                @onConfirm="deleteSpu(row)"
              >
                <hint-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                  slot="reference"
                ></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="margin-top: 20px; text-align: center"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          :total="total"
          layout="prev,pager,next,jumper,->,sizes,total"
          @current-change="getSpuList"
          @size-change="handlesizechange"
        ></el-pagination>
      </div>
      <SpuForm
        v-show="scene == 1"
        @changeScene="changeScene"
        ref="spu"
      ></SpuForm>
      <SkuForm
        v-show="scene == 2"
        ref="sku"
        @changeScenes="changeScenes"
      ></SkuForm>
    </el-card>
    <!-- sku列表的对话框 -->
    <el-dialog
      :title="`${spu.spuName}的sku列表`"
      :visible.sync="dialogTableVisible"
      :before-close="beforeCloseDialog"
    >
    <!-- 这里遍历的是个对象 所以会有很多警告 -->
      <el-table :data="skuList" border v-loading="loading">
        <el-table-column
          prop="skuName"
          label="名称"
          width="width"
        ></el-table-column>
        <el-table-column prop="price" label="价格" width="width">
          <template scope="scope"> ￥ {{ scope.row.price }}.00 元 </template>
        </el-table-column>
        <el-table-column prop="weight" label="重量" width="width">
          <template scope="scope"> {{ scope.row.weight }} kg </template>
        </el-table-column>
        <el-table-column prop="prop" label="默认图片" width="width">
          <template slot-scope="{ row }">
            <img
              style="width: auto; height: 100px"
              :src="row.skuDefaultImg"
              :alt="row.skuDesc"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
//引入子组件
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";
export default {
  name: "Spu",
  data() {
    return {
      //一二三级id
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //当前是第几页
      page: 1,
      //每页显示几条数据
      limit: 3,
      //spu列表的数据
      records: [],
      //需要展示数据的条数
      total: 0,
      //选择展示的场景 0 展示SPU列表数据  1 添加|修改SPU  2 添加SKU
      scene: 0,
      //控制dialog（sku列表）的显示与隐藏
      dialogTableVisible: false,
      //当前点击的spu对象
      spu: {},
      //当前点击的spu对象的全部sku列表
      skuList: {},
      //dialog的加载状态
      loading:true,
    };
  },
  methods: {
    /*点击页码的回调集成到getSpuList里了
    //点击页码的回调
    handlecurrentchange(page){
      //修改页码
      this.page = page;
      //重新发送请求
      this.getSpuList();
    },
    */
    //三级联动的自定义事件,可以把子组件的相应的id传递给父组件
    getCategoryId({ categoryId, level }) {
      //categoryId:获取到一、二、三级分类的id level:为了区分是几级id
      if (level == 1) {
        this.category1Id = categoryId;
        //清除2、3级分类的id
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        //清除3级id
        this.category3Id == "";
      } else {
        this.category3Id = categoryId;
        //获取SPU列表数据进行展示
        this.getSpuList();
      }
    },
    //获取SPU列表的方法
    async getSpuList(pager = 1) {
      this.page = pager;
      const { page, limit, category3Id } = this;
      //携带三个参数:page 第几页;limit 每一页需要展示多少条数据;三级分类id
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code == 200) {
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },
    //修改每页展示数据条数的回调
    handlesizechange(limit) {
      //修改limit
      this.limit = limit;
      //重新发送请求SPU列表
      this.getSpuList();
    },
    //点击添加spu的按钮
    addSpu() {
      //切换场景
      this.scene = 1;
      //通知子组件发请求
      //添加的时候子组件拿不到category3Id，所以这里拿到后发给子组件
      this.$refs.spu.addSpuData(this.category3Id);
    },
    //点击修改spu的按钮
    updateSpu(row) {
      this.scene = 1;
      this.$refs.spu.initSpuData(row);
    },
    //子传父事件，返回spu展示列表（SpuForm通知Spu）
    //修改 记为flag:1 否则是添加 记为flag:0
    changeScene({ scene, flag }) {
      this.scene = scene;
      //修改
      if ((flag = 1)) {
        //切换后要重新获取列表数据,并停留在当前页
        this.getSpuList(this.page);
      } else {
        //添加
        this.getSpuList();
      }
    },
    //删除spu的按钮
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        //代表Spu个数大于1删除的时候停留在当前页，如果SPu个数小于1回到上一页
        //为了防止当前第一页的东西被删光了，导致跳转到第0页。所以当前是第一页的时候也跳转到第一页
        this.getSpuList(
          this.records.length > 1 || this.page == 1 ? this.page : this.page - 1
        );
      }
    },
    //添加sku的按钮
    addSku(row) {
      this.scene = 2;
      //提供数据给子组件发请求，1级id 2级id，3级id和spuId在row里
      this.$refs.sku.getData(this.category1Id, this.category2Id, row);
    },
    //skuForm通知spuForm修改场景
    changeScenes(scene) {
      this.scene = scene;
    },
    //查看当前spu全部的sku列表的按钮
    async showDialog(spu) {
      //显示dialog
      this.dialogTableVisible = true;
      //保存当前spu
      this.spu = spu;
      //发请求
      let result = await this.$API.spu.reqSkuList(spu.id);
      if (result.code == 200) {
        this.skuList = result.data;
        //隐藏loading状态
        this.loading = false;
      }
    },
    //对话框关闭前的回调
    beforeCloseDialog(done){
      //关闭前修改loading属性为真，让下次可以出发loading
      this.loading = true;
      //清空skuList，防止下次点击的时候闪出上次的skuList
      this.skuList = [];
      //关闭对话框dialog
      done();
    }
  },
  //注册子组件
  components: {
    SpuForm,
    SkuForm,
  },
};
</script>

<style>
</style>