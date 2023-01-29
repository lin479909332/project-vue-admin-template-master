<template>
  <el-card>
    <div slot="header">
      <div class="category-header">
        <span>销售额类别占比</span>
        <el-radio-group v-model="value">
          <el-radio-button label="全部渠道"></el-radio-button>
          <el-radio-button label="线上"></el-radio-button>
          <el-radio-button label="门店"></el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div>
      <div class="charts" ref="charts"></div>
    </div>
  </el-card>
</template>

<script>
import * as echarts from "echarts";
import { mapState } from "vuex";
export default {
  name: "Category",
  data() {
    return {
      value: "全部渠道",
    };
  },
  mounted() {
    let pieChart = echarts.init(this.$refs.charts);
    pieChart.setOption({
      title: {
        text: "游戏",
        subtext: 1048,
        left: "center",
        top: "center",
      },
      tooltip: {
        trigger: "item",
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: true,
            position: "outside",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "40",
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: true,
          },
          data: [
            { value: 1048, name: "游戏" },
            { value: 735, name: "动画" },
            { value: 580, name: "漫画" },
            { value: 484, name: "电影" },
            { value: 300, name: "小说" },
          ],
        },
      ],
    });
    // 绑定事件 鼠标移动到
    pieChart.on("mouseover", (params) => {
      // 获取鼠标移动上去的对应数据
      const { name, value } = params.data;
      // 重新设置标题
      pieChart.setOption({
        title: {
          text: name,
          subtext: value,
        },
      });
    });
  },
  computed: {
    // 计算一个saleRank挂载到组件上
    ...mapState({
      saleRank: (state) => state.home.list.saleRank,
    }),
  },
  watch: {
    value(){
      
    }
  },
};
</script>

<style scoped>
.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.charts {
  width: 100%;
  height: 300px;
}
</style>