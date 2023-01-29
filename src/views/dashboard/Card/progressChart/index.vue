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
    let progressChart = echarts.init(this.$refs.charts);
    progressChart.setOption({
      xAxis: {
        show: false,
        //最小值和最大值的设置
        min: 0,
        max: 100,
      },
      yAxis: {
        show: false,
        type: "category",
      },
      series: {
        type: "bar",
        data: [78],
        color: "yellowGreen",
        // 柱状图宽度
        barWidth: 10,
        // 显示背景
        showBackground: true,
        // 设置背景颜色
        backgroundStyle: {
          color: "#eee",
        },
        //文本设置
        label:{
          // 显示文本
          show:true,
          //改变文本内容
          formatter:"|",
          //改变文本位置
          position: 'right',
          //颜色
          color: "yellowGreen",
        }
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