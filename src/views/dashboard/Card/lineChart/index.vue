<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
//引入echarts
import * as echarts from "echarts";
export default {
  name: "lineChart",
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
          color: "purple",
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
                color: "purple", // 0% 处的颜色
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

<style>
.charts {
  width: 100%;
  height: 100%;
}
</style>