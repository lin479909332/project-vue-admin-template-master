<template>
  <div>
    <div class="header">
      <span class="search-header">搜索用户数</span>
      <i class="el-icon-info"></i>
    </div>
    <div class="main">
      <span class="main-title">12321</span>
      <span class="main-content">17.1</span>
      <i class="el-icon-caret-top"></i>
      <i class="el-icon-caret-bottom"></i>
    </div>
    <div class="footer">
      <div class="charts" ref="charts"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "LineCharts",
  mounted() {
    // 初始化echarts实例
    let lineChart = echarts.init(this.$refs.charts);
    lineChart.setOption({
      xAxis: {
        show: false,
        type: "category",
      },
      yAxis: {
        show: false,
      },
      series: {
        type: "line",
        data: [9, 90, 38, 45, 24, 85, 44, 12, 94, 33],
        // 拐点样式设计
        itemStyle: {
          opacity: 0,
        },
        //线条样式设计
        lineStyle: {
          // 渐变
          color: "#5172ca",
        },
        //填充颜色
        areaStyle: {
          // 渐变
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#5172ca", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "#fff", // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
        smooth: true,
      },
      grid: {
        bottom: 0,
        top: 0,
        left: 0,
        right: 0,
      },
    });
  },
};
</script>

<style scoped>
.el-icon-info {
  color: #cacaca;
}
.header{
  display: flex;
  align-items: center;
}
.search-header{
  margin-right: 20px;
}
.el-icon-caret-top {
  color: #d81e06;
}
.el-icon-caret-bottom{
  color: #1afa29;
}
.main{
  margin: 10px 0;
}
.main-title{
  margin-right: 20px;
  font-size: 26px;
}
.main-content{
  margin-right: 10px;
  color: gray;
}
.charts{
  width: 100%;
  height: 50px;
}
</style>