<template>
  <el-card class="box-card" style="margin: 10px 0">
    <div slot="header" class="clearfix">
      <!--  @tab-click="handleClick" -->
      <!-- 左侧部分 -->
      <el-tabs class="tab" v-model="activeName">
        <el-tab-pane label="销售额" name="sale"></el-tab-pane>
        <el-tab-pane label="访问量" name="visits"></el-tab-pane>
      </el-tabs>
      <!-- 右侧部分 -->
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <el-date-picker
          v-model="date"
          class="date"
          type="daterange"
          range-separator="|"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </div>
    </div>
    <!-- 内容区域 -->
    <div>
      <el-row :gutter="10">
        <el-col :span="18">
          <div class="charts" ref="charts"></div>
        </el-col>
        <el-col :span="6">
          <div class="rank">门店{{ title }}排名</div>
          <ul>
            <li v-for="(order,index) in listState.orderRank" :key="index">
              <span class="rindex">{{order.no}}</span>
              <span class="rshop">{{order.name}}</span>
              <span class="rvalue">{{order.money}}</span>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import * as echarts from "echarts";
import dayjs from "dayjs";
import { mapState } from "vuex";
export default {
  name: "Sale",
  data() {
    return {
      // 活跃标签栏
      activeName: "sale",
      // 挂载echarts组件实例 方便监听变换数据
      barChart: null,
      // 日期
      date: [],
    };
  },
  mounted() {
    this.barChart = echarts.init(this.$refs.charts);
    this.barChart.setOption({
      title: {
        text: "销售额趋势",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: [],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: [],
        },
      ],
    });
  },
  computed: {
    // 标题的计算属性
    title() {
      return this.activeName == "sale" ? "销售额趋势" : "访问量趋势";
    },
    // 计算一个listState挂载到组件上
    ...mapState({
      listState: (state) => state.home.list,
    }),
  },
  watch: {
    // 监听标题的变换 更改echarts的配置数据
    // 图表配置数据可以再次修改，如果有新的数值，新的数值，没有新的数值，还是用以前的
    title() {
      this.barChart.setOption({
        title: {
          text: this.title,
        },
        xAxis: {
          data:
            this.title == "销售额趋势"
              ? this.listState.orderFullYearAxis
              : this.listState.userFullYearAxis,
        },
        series: [
          {
            name: "Direct",
            type: "bar",
            barWidth: "60%",
            data:
              this.title == "销售额趋势"
                ? this.listState.orderFullYear
                : this.listState.userFullYear,
          },
        ],
      });
    },
    listState(){
      this.barChart.setOption({
      title: {
        text: "销售额趋势",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: this.listState.orderFullYearAxis,
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: this.listState.orderFullYear,
        },
      ],
    });
    }
  },
  methods: {
    // 今日
    setDay() {
      // dayjs 获取今天
      const today = dayjs().format("YYYY-MM-DD");
      // 赋值
      this.date = [today, today];
    },
    // 本周
    setWeek() {
      // 获取周一
      const start = dayjs().day(1).format("YYYY-MM-DD");
      // 获取周日
      const end = dayjs().day(7).format("YYYY-MM-DD");
      // 赋值
      this.date = [start, end];
    },
    // 本月
    setMonth() {
      // 获取本月初
      const start = dayjs().startOf("month").format("YYYY-MM-DD");
      // 获取本月底
      const end = dayjs().endOf("month").format("YYYY-MM-DD");
      // 赋值
      this.date = [start, end];
    },
    // 本年
    setYear() {
      // 获取本月初
      const start = dayjs().startOf("year").format("YYYY-MM-DD");
      // 获取本月底
      const end = dayjs().endOf("year").format("YYYY-MM-DD");
      // 赋值
      this.date = [start, end];
    },
  },
};
</script>

<style scoped>
/* 清除底部框线 */
.el-card__header {
  border-bottom: none;
}
.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.tab {
  width: 100%;
}
.el-tabs__item {
  font-size: 18px;
}
.right {
  position: absolute;
  right: 0;
}
.date {
  width: 250px !important;
  margin: 0 20px;
}
.right span {
  font-size: 16px;
  margin: 0 10px;
}
.charts {
  width: 100%;
  height: 300px;
}
.rank {
  padding: 0;
  font-size: 18px;
  font-weight: bold;
}
ul {
  padding: 0;
  list-style: none;
  width: 100%;
  height: 300px;
}
ul li {
  height: 12%;
}
.rindex {
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: black;
  color: white;
  text-align: center;
  margin-right: 20px;
}
.rshop {
  margin: 0 10px;
}
.rvalue {
  float: right;
}
</style>