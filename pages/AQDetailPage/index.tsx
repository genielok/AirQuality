import { ActionSheetIOS, SafeAreaView, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { timeAgo } from '@/scripts/function';
import moment from 'moment';
import { ChartComponent } from './ChartComponent';
import { ETime, TTime } from '@/scripts/api';
import { fetchSenorByID, Sensor } from '@/scripts/api';
import { EChartsOption } from 'echarts';
import { SafeAreaProvider } from 'react-native-safe-area-context';

type DetailData = {
    country: string,
    name: string,
    locality: string,
    infoArr: {
        label: string,
        value: string
    }[]
}

const AQDetail = ({ detailInfo }: any) => {
    const [detailData, setDetailData] = useState<DetailData>()
    const [curSensor, setCurSensor] = useState<{ sensorId: number }>()
    const [sensorArr, setSensorArr] = useState<{ sensorId: number, sensorDisplayName: string }[]>()

    useEffect(() => {
        if (detailInfo) {
            const data = JSON.parse(detailInfo)
            const measures = data.sensors.map((item: { parameter: { displayName: string; units: string; }; }) => {
                return item.parameter.displayName + '(' + item.parameter.units + ')'
            })
            const formatData = {
                Qwner: data.owner.name,
                Measures: measures.join(','),
                Reporting: 'Update ' + timeAgo(data.datetimeLast.utc),
                Since: moment(data.datetimeFirst.utc).format('DD/MM/YYYY'),
                Provider: data.provider.name,

            }
            const result = Object.entries(formatData).map(([key, value]) => ({
                label: key,
                value: value
            }));
            setDetailData({
                country: data.country.name,
                name: data.name,
                locality: data.locality,
                infoArr: result
            })
            const sensorArr = data.sensors.map((item: Sensor) => ({
                sensorId: item.id,
                sensorDisplayName: item.parameter.displayName + ' ' + item.parameter.units
            }))
            setSensorArr(sensorArr)
            setCurSensor({
                sensorId: data.sensors[0].id
            })
            setSelectedSensor(data.sensors[0].parameter.displayName + ' ' + data.sensors[0].parameter.units)
        }
    }, [detailInfo])


    const [chartOptions, setChartOptions] = useState<EChartsOption>()
    const getSensorDetail = async (id: number, type: ETime) => {
        try {
            const now = new Date()
            let fromTime = null
            switch (type) {
                case ETime.hour24:
                case ETime.hour48:
                case ETime.hour72:
                    fromTime = new Date(now.getTime() - 24 * 60 * 60 * 1000 * (type + 1)).toISOString().split('.')[0] + 'Z';
                    break;
                case ETime.hour72:
                    fromTime = new Date(now.getTime() - 24 * 60 * 60 * 1000 * 7).toISOString().split('.')[0] + 'Z';
                    break;
                default:
                    fromTime = new Date(now.getTime() - 24 * 60 * 60 * 1000 * 30).toISOString().split('.')[0] + 'Z';
            }

            const params = {
                datetime_to: now.toISOString().split('.')[0] + 'Z',
                datetime_from: fromTime
            }

            const measurementArr = await fetchSenorByID(id, { limit: 50, ...params })
            let xData: string[] = []
            let yData: number[] = []
            measurementArr.forEach(element => {
                xData.push(element.time)
                yData.push(element.value)
            });
            setChartOptions({
                xAxis: {
                    type: 'category',
                    data: xData,
                },
                yAxis: {
                    type: 'value',
                },
                series: [
                    {
                        data: yData,
                        type: 'line',
                    },
                ],
            })
        } catch (error) {
            console.log('getSensorDetail', error)
        }
    }


    useEffect(() => {
        if (curSensor?.sensorId) {
            getSensorDetail(curSensor?.sensorId, ETime.hour24)
        }
    }, [curSensor])

    const [selectedPeriod, setSelectedPeriod] = useState(ETime.hour24)
    const [selectSensor, setSelectedSensor] = useState<string>()


    const onPress = (inputType: 'sensor' | 'time') => {
        let options = ['Cancel', ...Object.values(TTime)]
        if (inputType === 'sensor' && sensorArr) {
            options = ['Cancel', ...sensorArr.map(item => item.sensorDisplayName)]
        }
        return ActionSheetIOS.showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex: 0,
                userInterfaceStyle: 'dark',
            },
            buttonIndex => {
                if (buttonIndex !== 0) {
                    if (inputType === 'time') {
                        setSelectedPeriod(buttonIndex - 1)
                    }
                    else {
                        setSelectedSensor(options[buttonIndex])
                    }
                }
            },
        );
    }

    const onPressUpdateChart = () => {
        const sensorId = sensorArr?.find(item => item.sensorDisplayName === selectSensor)?.sensorId
        sensorId && getSensorDetail(sensorId, selectedPeriod)
    }

    return (
        <ScrollView >
            <View style={styles.titleArea}>
                <Text style={styles.country}>{detailData?.country}</Text>
                <Text style={styles.title}>{`${detailData?.name} / ${detailData?.locality}`}</Text>
            </View>
            <View style={styles.characteristics}>
                <Text style={styles.subTitle}>CHARACTERISTICS</Text>
                {
                    detailData?.infoArr?.map(item =>
                        <View key={item.label} style={styles.characteristicItem}>
                            <View style={styles.characteristicsLabel}>
                                <Text style={styles.characteristicsLabelText}>{item.label}</Text>
                            </View>
                            <View style={{ flex: 1 }} >
                                <Text style={[styles.characteristicsLabelText, styles.characteristicsValue]}>{item?.value}</Text>
                            </ View>
                        </View>
                    )
                }
            </View>
            <View style={styles.titleArea}>
                <Text style={styles.title}>Latest Readings</Text>
            </View>

            <View style={styles.chart}>
                <SafeAreaProvider>
                    <SafeAreaView >
                        <TouchableWithoutFeedback onPress={() => onPress('time')} >
                            <View style={styles.inputArea}>
                                <Text >{TTime[selectedPeriod]}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => onPress('sensor')} >
                            <View style={[styles.inputArea, { marginTop: 10 }]}>
                                <Text >{sensorArr?.find(item => item.sensorDisplayName === selectSensor)?.sensorDisplayName}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </SafeAreaView>
                </SafeAreaProvider>
                <TouchableWithoutFeedback onPress={onPressUpdateChart}>
                    <View style={styles.updateBtn}>
                        <Text style={styles.updateBtnText}>
                            Update
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
                {
                    chartOptions &&
                    <ChartComponent option={chartOptions} />

                }
            </View>

        </ScrollView>
    )
}

export default AQDetail

const styles = StyleSheet.create({
    titleArea: {
        backgroundColor: "#eef7ff",
        padding: 16,
    },
    subTitle: {
        color: "#30363c",
        fontWeight: 600,
        marginBottom: 24
    },
    country: {
        fontSize: 14,
        fontWeight: 600,
        marginBottom: 10,
        color: '#5a6672',

    },
    title: {
        color: "#1e64ab",
        fontSize: 20,
        fontWeight: 600
    },
    characteristics: {
        backgroundColor: "#fff",
        padding: 16,

    },
    characteristicItem: {
        flexDirection: 'row',
        alignItems: 'stretch'

    },
    characteristicsLabel: {
        width: 100
    },
    characteristicsLabelText: {
        color: '#5a6672',
        fontSize: 14,
        paddingRight: 32,
        fontWeight: 600,
        lineHeight: 30
    },
    characteristicsValue: {
        fontWeight: 400,
        wordWrap: 'break-word'
    },
    chart: {
        backgroundColor: '#fff',
        padding: 16,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputArea: {
        borderColor: '#aaa',
        borderWidth: 1,
        borderRadius: 10,
        width: 300,
        padding: 10
    },
    updateBtn: {

        borderColor: '#b0e8e6',
        backgroundColor: '#e6f8f8',
        borderWidth: 1,
        paddingVertical: 11,
        paddingHorizontal: 20,
        marginTop: 10,
        borderRadius: 100

    },
    updateBtnText: {
        fontWeight: 700,
        color: '#33a3a1',
    }
})