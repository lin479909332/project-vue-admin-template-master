<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
//引入echarts
import * as echarts from "echarts";
export default {
  name: "barChart",
  mounted() {
    // 初始化echarts实例
    let barChart = echarts.init(this.$refs.charts);
    barChart.setOption({
      xAxis: {
        show: false,
        type: "category",
      },
      yAxis: {
        show: false,
      },
      series: {
        type: "bar",
        data: [20, 63, 45, 67, 70, 93, 38, 60, 62, 75, 66, 24],
        color: "#5172ca",
      },
      grid: {
        bottom: 0,
        top: 0,
        left: 0,
        right: 0,
      },
      tooltip: {
        show: true,
      },
    });
  },
};
</script>

<style>
.charts {
  width: 100%;
  height: 100%;
}
</style>