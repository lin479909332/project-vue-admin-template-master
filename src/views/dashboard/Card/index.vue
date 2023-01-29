<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <!-- 第1个card -->
          <Detail title="总销售额" count="￥126560">
            <template slot="charts">
              <span
                >周同比&nbsp;&nbsp;56.7%
                <i class="el-icon-caret-top"></i>
              </span>
              &nbsp;&nbsp;
              <span
                >日同比&nbsp;&nbsp;16.9%
                <i class="el-icon-caret-bottom"></i>
              </span>
            </template>
            <template slot="footer">
              <span>日销售额 ￥12423</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <!-- 第2个card -->
          <Detail title="访问量" count="88460">
            <template slot="charts">
              <lineChart></lineChart>
            </template>
            <template slot="footer">
              <span>日访问量 54823</span>
            </template>
          </Detail>
        </el-card></el-col
      >
      <el-col :span="6">
        <el-card>
          <!-- 第3个card -->
          <Detail title="支付笔数" count="88460">
            <template slot="charts">
              <barChart></barChart>
            </template>
            <template slot="footer">
              <span>转化率64%</span>
            </template>
          </Detail>
        </el-card></el-col
      >
      <el-col :span="6">
        <el-card>
          <!-- 第4个card -->
          <Detail title="运营活动效果" count="78%">
            <template slot="charts">
              <ProgressChart></ProgressChart>
            </template>
            <template slot="footer">
              <span
                >周同比&nbsp;&nbsp;11.7%
                <i class="el-icon-caret-top"></i>
              </span>
              &nbsp;&nbsp;
              <span
                >日同比&nbsp;&nbsp;12.9%
                <i class="el-icon-caret-bottom"></i>
              </span>
            </template>
          </Detail> </el-card
      ></el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from "./Detail/index.vue";
import lineChart from "./lineChart";
import barChart from "./barChart";
import progressChart from "./progressChart";
import ProgressChart from "./progressChart/index.vue";
export default {
  name: "Card",
  components: { Detail, lineChart, barChart, progressChart, ProgressChart },
};
</script>

<style scoped>
.el-icon-caret-top {
  color: #d81e06;
}
.el-icon-caret-bottom{
  color: #1afa29;
}
</style>