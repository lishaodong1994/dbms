<template>
  <div id="chart"></div>
</template>

<script>
import * as echarts from 'echarts'
import {G_getReport} from '@/API/home'
import _ from 'lodash'
export default {
  data() {
    return {
      option:[]
    }
  },
  mounted() {
   this.getReport()
  },
  methods:{
    async getReport(){
      const {data,meta} = await G_getReport()
      if(meta.status!==200){return this.$message.error('获取数据失败')}
      this.option = _.merge(data, {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      })
      var myChart = echarts.init(document.getElementById('chart'),'dark')
      myChart.setOption(this.option)
    }
  }
}
</script>
 
<style scoped lang="less">
#chart{
  width: 500px;
  height: 500px;
}
</style>