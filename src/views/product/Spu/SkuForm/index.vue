<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称"> {{ spu.spuName }} </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="sku名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input
          placeholder="价格(元)"
          v-model="skuInfo.price"
          type="number"
        ></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item
            style="margin: 10px 0"
            :label="attr.attrName"
            v-for="attr in attrInfoList"
            :key="attr.id"
          >
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <el-option
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
                v-for="attrValue in attr.attrValueList"
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item
            :label="saleAttr.saleAttrName"
            v-for="saleAttr in spuSaleAttrList"
            :key="saleAttr.id"
          >
            <el-select
              placeholder="请选择"
              v-model="saleAttr.saleAttrIdAndValueId"
            >
              <el-option
                :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttr.id}:${saleAttrValue.id}`"
                v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          style="width: 100%"
          border
          :data="spuImageList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            prop="prop"
            width="80px"
          ></el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{ row }">
              <img :src="row.imgUrl" style="width: auto; height: 100px" />
            </template>
          </el-table-column>
          <el-table-column
            prop="imgName"
            label="名称"
            width="width"
          ></el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                v-if="row.isDefault == 0"
                @click="changeDefault(row)"
                >设为默认</el-button
              >
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      //存储图片的信息
      spuImageList: [],
      //存储销售属性
      spuSaleAttrList: [],
      //存储平台属性的数据
      attrInfoList: [],
      //收集sku数据的字段
      skuInfo: {
        //父组件直接给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        //通过双向绑定收集的数据
        skuName: "",
        price: 0,
        skuDesc: "",
        weight: "",
        //自己写代码才能收集到的数据
        //默认图片的地址
        skuDefaultImg: "",
        //收集图片的字段
        skuImageList: [
          // {
          //   id: 0,
          // ↓ 发请求的时候服务器需要 ↓
          //   imgName: "string",
          // ↓ 发请求的时候服务器需要 ↓
          //   imgUrl: "string",
          // ↓ 发请求的时候服务器需要 ↓
          //   isDefault: "string",
          //   skuId: 0,
          // ↓ 发请求的时候服务器需要 ↓
          //   spuImgId: 0,
          // },
        ],
        //平台属性
        skuAttrValueList: [
          // {
          // ↓ 发请求的时候服务器需要 ↓
          //   attrId: 0,
          // ↓ 发请求的时候服务器需要 ↓
          //   valueId: 0,
          // },
        ],
        //销售属性
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   ↓ 发请求的时候服务器需要 ↓
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   ↓ 发请求的时候服务器需要 ↓
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],
      },
      //spu数据
      spu: {},
      //收集图片的数据字段:但是需要注意，收集的数据目前缺少isDefault字段，将来提交给服务器数据的时候，需要整理参数
      //已添加上isDefault字段
      imageList: [],
    };
  },
  methods: {
    //获取skuForm数据
    async getData(category1Id, category2Id, spu) {
      //保存spu数据
      this.spu = spu;
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.spuId = spu.id;
      this.skuInfo.tmId = spu.tmId;
      //获取图片数据
      let result = await this.$API.spu.reqSpuImageList(spu.id);
      if (result.code == 200) {
        let list = result.data;
        //给返回的数据添加上isDefault字段
        list.forEach((item) => {
          item.isDefault = 0;
        });
        this.spuImageList = list;
      }
      //获取销售属性数据
      let result1 = await this.$API.spu.reqSpuSaleAttrList(spu.id);
      if (result1.code == 200) {
        this.spuSaleAttrList = result1.data;
      }
      //获取平台属性数据
      let result2 = await this.$API.spu.reqAttrInfoList(
        category1Id,
        category2Id,
        spu.category3Id
      );
      if (result2.code == 200) {
        this.attrInfoList = result2.data;
      }
    },
    //table表格复选框按钮的事件
    handleSelectionChange(params) {
      //获取到用户选中图片的信息数据，但是需要注意，当前收集的数据当中，缺少isDefault字段
      //添加isDefault字段后赋值
      this.imageList = params;
    },
    //点击设置默认的事件
    changeDefault(row) {
      //排他操作，先把所有的图片列表的isDefault设置为0
      this.spuImageList.forEach((item) => {
        item.isDefault = 0;
      });
      //自己选中的isDefault设置为1
      row.isDefault = 1;
      //收集默认图片的地址
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    //点击取消按钮
    cancel() {
      //自定义事件通知spuForm切换场景
      this.$emit("changeScenes", 0);
      //清空数据
      Object.assign(this._data, this.$options.data());
    },
    //点击保存按钮
    async save() {
      //解构
      const { skuInfo, attrInfoList, spuSaleAttrList, imageList } = this;
      //整理参数
      //整理平台属性
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        //用户对平台属性进行了选择
        if (item.attrIdAndValueId) {
          //对收集到的字符串进行分割，分割后是数组所以用数组保存
          const [attrId, valueId] = item.attrIdAndValueId.split(":");
          //添加到数组中，最后赋值给skuInfo.skuAttrValueList
          prev.push({ attrId, valueId });
        }
        //返回之前的结果
        return prev;
      }, []);
      //整理销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        //用户对销售属性进行了选择
        if (item.saleAttrIdAndValueId) {
          //对收集到的字符串进行分割，分割后是数组所以用数组保存
          const [saleAttrId, saleAttrValueId] =
            item.saleAttrIdAndValueId.split(":");
          //添加到数组中，最后赋值给skuInfo.skuSaleAttrValueList
          prev.push({ saleAttrId, saleAttrValueId });
        }
        //返回之前的结果
        return prev;
      }, []);
      //整理图片的数据
      skuInfo.skuImageList = imageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        };
      });
      //发请求
      let result = await this.$API.spu.reqAddSku(skuInfo);
      if (result.code == 200) {
        //提示消息
        this.$message({
          type: "success",
          message: "添加SKU成功",
        });
        //自定义事件通知spuForm切换场景
        this.$emit("changeScenes", 0);
      }
    },
  },
};
</script>

<style>
</style>