<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="请输入SPU" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="tm in tradeMarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          rows="4"
          placeholder="描述"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 
        上传图片: action图片上传的地址
        list-type:文件列表的类型
        on-preview:图片预览的时候会触发
        on-remove:删除图片的时候会触发 
        file-list:照片墙需要展示的数据【数组:数组里面的元素务必要有name、url属性】
        on-success:文件上传成功后触发
        -->
        <el-upload
          action="/dev-api/admin/product/upload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="spuImageList"
          :on-success="handleSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          :placeholder="`还有${unSelectSaleAttr.length}项未选择`"
          v-model="attrIdAndAttrName"
        >
          <el-option
            :label="unselect.name"
            :value="`${unselect.id}:${unselect.name}`"
            v-for="unselect in unSelectSaleAttr"
            :key="unselect.id"
          ></el-option>
        </el-select>
        <el-button
          style="margin: 0 10px"
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrIdAndAttrName"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <el-table
          style="width: 100%; margin: 20px 0"
          border
          :data="spu.spuSaleAttrList"
        >
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="saleAttrName"
            label="属性名"
            width="width"
          ></el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row }">
              <!-- @close="handleClose(tag)" -->
              <el-tag
                :key="tag.id"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- 
                这个enter事件不可以用
                @keyup.enter.native="handleInputConfirm"
                失去焦点事件
                @blur="handleInputConfirm(row)"
               -->
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @blur="handleInputConfirm(row)"
                @keyup.enter.native="$event.target.blur"
              >
              </el-input>
              <!-- @click="showInput" -->
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row)"
                >+ 添 加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="spu.spuSaleAttrList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      //存储spu信息属性
      //spu属性初始化的时候是一个空的对象,在修改sPu的时候，会想服务器发请求，返回spu信息(对象》，在修改的时候可以利用服务器返回的这个对象收集最新的数据提交给服务器//添加SPU，如果是添加SPu的时候并没有向服务器发请求，数据收集到哪里呀[SPU]，收集数据的时候有哪些字段？，看文档
      spu: {
        //三级分类的id
        category3Id: 0,
        //描述
        description: "",
        //spu名称
        spuName: "",
        //品牌的id
        tmId: "",
        //收集spu图片的信息
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        //平台属性与属性值的收集
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
      },
      //存储品牌信息
      tradeMarkList: [],
      //存储spu图片的数据
      spuImageList: [],
      //销售属性的数据
      saleAttrList: [],
      //收集未选择的销售属性id
      attrIdAndAttrName: "",
    };
  },
  methods: {
    //图片删除
    handleRemove(file, fileList) {
      //file 当前删除的图片
      //fileList 剩余的图片（不包含删除的图片）
      //console.log(file, fileList);
      //收集照片墙图片的数据
      //对于已有的图片【照片钱中显示的图片:有name、url字段的】，因为照片墙显示数据务必要有这两个属性
      //对于服务器而言，不需要name、url字段，将来对于有的图片的数据在提交给服务器的时候，需要处理的
      this.spuImageList = fileList;
    },
    //图片预览
    handlePictureCardPreview(file) {
      //获取被点击的图片url并赋值给dialog框的imgUrl
      this.dialogImageUrl = file.url;
      //控制dialog框的显示与隐藏
      this.dialogVisible = true;
    },
    //初始化spu
    async initSpuData(spu) {
      //获取Spu信息的数据
      let spuResult = await this.$API.spu.reqSpu(spu.id);
      if (spuResult.code == 200) {
        this.spu = spuResult.data;
      }
      //获取品牌的信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      //获取spu图片的数据
      let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id);
      if (spuImageResult.code == 200) {
        let listArr = spuImageResult.data;
        //由于照片墙显示图片的数据需要数组，数组里面的元素需要有name与url字段
        //需要把服务器返回的数据进行修改
        listArr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = listArr;
      }
      //获取平台全部销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    //上传图片成功后的回调
    handleSuccess(response, file, fileList) {
      //response服务器返回的上传成功信息
      //file刚上传的图片的信息
      //fileList 整个照片墙的信息（包含刚添加的图片）
      this.spuImageList = fileList;
    },
    //添加销售属性后的回调
    addSaleAttr() {
      //需要收集的数据
      //baseSaleAttrId
      //saleAttrName
      //spuSaleAttrValueList
      //把收集到的销售属性数据进行分割
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(":");
      let newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      //添加新的销售属性
      this.spu.spuSaleAttrList.push(newSaleAttr);
    },
    //添加销售属性值后的回调
    addSaleAttrValue(row) {
      //row 是当前的spuSaleAttrList
      //console.log(row);
      //这里不能直接修改，需要响应式修改
      this.$set(row, "inputVisible", true);
      //通过响应式数据inputValue字段收集新增的销售属性值
      this.$set(row, "inputValue", "");
      //自动聚焦
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus();
      });
    },
    //添加销售属性值el-input失去焦点后执行的回调
    handleInputConfirm(row) {
      //row 是当前的spuSaleAttrList
      //解构销售属性当中收集的数据【就是用户输入在el-input的数据】
      const { baseSaleAttrId, inputValue } = row;
      //判断用户是否输入了空字符
      if (inputValue.trim() == "") {
        this.$message.error("属性值不能为空，请重新输入");
        return;
      }
      //判断用户输入的销售属性值（inputValue）是否与原有的销售属性值（item.saleAttrValueName）有重复
      //有重复 返回false 没重复 返回true
      let result = row.spuSaleAttrValueList.every((item) => {
        return item.saleAttrValueName != inputValue;
      });
      if (!result) {
        this.$message.error("属性值不能出现重复，请重新输入");
        return;
      }
      //新增的销售属性值，这里有格式，请根据文档来  baseSaleAttrId   saleAttrValueName
      let newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue };
      //将新增的销售属性值添加到销售属性值列表中
      row.spuSaleAttrValueList.push(newSaleAttrValue);
      //修改inputVisible为false，即显示button
      //这里已经是响应式数据了 所以可以直接修改
      row.inputVisible = false;
    },
    //保存按钮：添加或更新spu
    async addOrUpdateSpu() {
      //整理参数:需要整理照片墙的数据
      //携带参数:对于图片,需要携带imgName与imgUrl字段
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imgName: item.name,
          //如果是新增图片的话 图片上传到服务器的地址是 item.response.data
          //原有的图片是 item.url
          imgUrl: (item.response && item.response.data) || item.url,
        };
      });
      //发请求
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
      //提示信息
      if (result.code == 200) {
        this.$message({
          type: "success",
          message: "保存成功！",
        });
      }
      //通知父组件切换场景（以前写过了）
      //父组件要判断这个保存是添加的还是修改的，这里用spu.id来判断
      //如果有则是修改 记为flag:1 否则是添加 记为flag:0
      this.$emit("changeScene", { scene: 0, flag: this.spu.id ? "1" : "0" });
      //保存后清空数据
      Object.assign(this._data, this.$options.data());
    },
    //父组件点击添加SPU后的方法
    async addSpuData(category3Id) {
      //获取品牌的信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      //获取平台全部销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
      //保存category3Id
      this.spu.category3Id = category3Id;
    },
    //取消按钮的回调
    cancel() {
      //通知父亲切换场景
      this.$emit("changeScene", { scene: 0, flag: "" });
      //清理数据
      //object.assign:es6中新增的方法可以合并对象
      //组件实例this._data,可以操作data当中响应式数据
      //this.$options可以获取配置对象，配置对象的data函数执行，返回的响应式数据为空的
      Object.assign(this._data, this.$options.data());
    },
  },
  computed: {
    //计算还未选择的销售属性
    //整个平台的销售属性一共三个:颜色、尺寸、版本----saleAttrList
    //当前Spu拥有的属于自己的销售属性SPU.spuSaleAttrList ----颜色
    //数组的过滤方法，可以从已有的数组当中过滤出用户需要的元素，并返回一个新的数据
    unSelectSaleAttr() {
      let result = this.saleAttrList.filter((item) => {
        //every数组的方法,会返回一个布尔值【真，假的】
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName;
        });
      });
      return result;
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>