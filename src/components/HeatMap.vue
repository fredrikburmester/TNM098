<script>
import 'echarts'
import VChart, { THEME_KEY } from 'vue-echarts'
import { defineComponent, watch } from 'vue'
import { useAreasStore } from '@/stores/areas'
import { useCategoriesStore } from '@/stores/categories'
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

export default defineComponent({
    name: 'HeatMap',

    components: {
        VChart,
    },
    provide: {
        [THEME_KEY]: 'light',
    },
    setup() {
        const areasStore = useAreasStore()
        const categoriesStore = useCategoriesStore()
        let loading = ref(true)
        let opacity = ref(0.2)
        let selectedCategory = ref(categoriesStore.selectedCategory)
        let includedDates = 0

        const allKeys = Object.keys(areasStore.reports)
            .map((key) => {
                return key
            })
            .sort((a, b) => {
                return new Date(a) - new Date(b)
            })

        const areas = areasStore.areas.map((area) => area.name)

        const getDataPerCategory = (category) => {
            let data = areasStore.perLineData.map((report) => {
                return [report.datetime, parseInt(report.location), parseFloat(report[categoriesStore.categories[category]])]
            })
            return data
        }

        // const getDataPerInterval = () => {
        //     try {
        //         let sortedReports = areasStore.perLineData.sort((a, b) => {
        //             return new Date(a.datetime) - new Date(b.datetime)
        //         })
        //         let perDateTimeData = []

        //         let currentReportDateTime = sortedReports[0].datetime
        //         let groupReports = []
        //         for (let r of sortedReports) {
        //             if (r.datetime == currentReportDateTime) {
        //                 groupReports.push(r)
        //             } else if (r.datetime !== currentReportDateTime) {
        //                 currentReportDateTime = r.datetime
        //                 perDateTimeData.push(groupReports)
        //                 groupReports = []
        //                 groupReports.push(r)
        //             }
        //         }

        //         return perDateTimeData
        //     } catch (e) {
        //         console.log('error', e)
        //         return null
        //     }
        // }

        let dataPerCategory = []
        for (let category of Object.keys(categoriesStore.categories)) {
            dataPerCategory.push({
                id: category,
                data: getDataPerCategory(category),
            })
        }

        console.log(dataPerCategory[categoriesStore.selectedCategory].data)

        let option = ref({
            tooltip: {
                position: 'top',
            },
            toolbox: {},
            dataset: {
                source: dataPerCategory[categoriesStore.selectedCategory].data.filter((report) => {
                    // if report[0] in array
                    return allKeys.splice(0, includedDates)
                }),
            },
            dataZoom: [
                {
                    type: 'inside',
                },
                {
                    type: 'slider',
                    top: '70%',
                },
            ],
            grid: {
                height: '50%',
                top: '10%',
            },
            // stateAnimation: {
            //     duration: 300,
            //     easing: 'cubicOut',
            // },
            xAxis: {
                type: 'category',
                data: allKeys.splice(0, includedDates),
                splitArea: {
                    show: false,
                },
                axisLabel: {
                    formatter: function (value) {
                        return value // `${new Date(value).getFullYear()}/${new Date(value).getMonth() + 1}/${new Date(value).getDate()}`
                    },
                },
            },
            yAxis: {
                type: 'category',
                data: areas,
                splitArea: {
                    show: true,
                },
            },
            visualMap: {
                min: 0,
                max: 10,
                calculable: true,
                orient: 'vertical',
                right: '5%',
                bottom: '40%',
            },
            series: [
                {
                    name: 'Heat Map',
                    type: 'heatmap',
                    label: {
                        show: false,
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                        },
                    },
                },
            ],
        })

        var myChart

        watch(
            () => categoriesStore.selectedCategory,
            (val) => {
                opacity.value = 0.2
                selectedCategory.value = val
                option.value.series[0].data = dataPerCategory[selectedCategory.value].data
                myChart.setOption(option.value)
            }
        )
        watch(
            () => areasStore.selectedArea,
            (val) => {
                if (val) {
                    // myChart.setOption({
                    //     series: [
                    //         {
                    //             data: dataPerCategory[selectedCategory.value].data.filter((item) => {
                    //                 return item[1] === val
                    //             }),
                    //         },
                    //     ],
                    //     // yAxis: [
                    //     //     {
                    //     //         data: [areasStore.areas[val].name],
                    //     //     },
                    //     // ],
                    // })
                    // option.value.yAxis.data = areas.filter((item) => {
                    //     return item === val
                    // })
                    // option.value.yAxis.data = [areasStore.areas[val].name]
                    option.value.series[0].data = dataPerCategory[selectedCategory.value].data.filter((item) => {
                        return item[1] === val
                    })

                    console.log(option.value.series[0].data.length, option.value.series[0].data.size)
                } else {
                    option.value.series[0].data = dataPerCategory[selectedCategory.value].data
                    option.value.yAxis.data = areas
                }
                myChart.setOption(option.value)
            }
        )

        // const pushDataToChart = (dataArray) => {
        //     console.log(option.value.series[0].data)
        //     if (!option.value.series[0].data) {
        //         option.value.series[0].data = dataArray
        //     } else {
        //         option.value.series[0].data = option.value.series[0].data.concat(dataArray)
        //     }
        //     myChart.setOption(option.value)
        // }

        onMounted(() => {
            let chartDom = document.getElementById('main__heatmap')
            myChart = echarts.init(chartDom, 'dark')
            myChart.setOption(option.value)

            myChart.on('finished', () => {
                console.log('finished')
                opacity.value = 1
            })

            // let dataPerInterval = getDataPerInterval()

            let i = 0
            setInterval(() => {
                includedDates = i
                if (i > 7) {
                    option.value.xAxis.data = allKeys.splice(includedDates - 7, includedDates)
                } else {
                    option.value.xAxis.data = allKeys.splice(0, includedDates)
                }
                myChart.setOption(option.value)
                console.log('included dates', includedDates)
                i = i + 1
            }, (i + 1) * 2000)
        })

        return { option, loading, selectedCategory, opacity }
    },
})
</script>

<template>
    <!-- <v-chart :key="selectedCategory" class="chart" :option="option" :loading="loading" /> -->
    <div>
        <div id="main__heatmap" :style="{ opacity: 1, transition: 'all 1s' }"></div>
        <button v-if="opacity != 1" id="loading-spinner" class="btn btn-ghost loading z-50 text-white"></button>
    </div>
    <div>{{ opacity }}</div>
</template>

<style scoped>
.chart {
    padding: 30px;
    height: 400px;
    background-color: white;
}
#main__heatmap {
    height: 500px;
    width: 100%;
}
#loading-spinner {
    position: absolute;
    top: 30%;
    left: 50%;
}
</style>
