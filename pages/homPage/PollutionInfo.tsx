import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Sensor } from '@/scripts/api';
import * as Progress from 'react-native-progress';
import { calculateProgressBar } from '@/scripts/function';

interface PollutionInfoProps {
    sensors: Sensor[];
}
interface PollutionItem {
    id: number,
    name: string,
    value: number,
    progress: number,
    color: string
}


const PollutionInfo = (props: PollutionInfoProps) => {
    const [pollutionData, setPollutionData] = useState<PollutionItem[]>([])

    useEffect(() => {
        const result: PollutionItem[] = []
        if (props.sensors) {
            props.sensors.forEach(item => {
                const pollutionProgress = calculateProgressBar(item.parameter.id, item.latest.value)
                const pollution = {
                    id: item.parameter.id,
                    name: item.parameter.displayName,
                    value: item.latest.value,
                    ...pollutionProgress
                }
                result.push(pollution)
            });
        }
        setPollutionData(result)
    }, [props?.sensors])

    return (
        <View style={styles.container}>
            <View style={styles.boxContainer}>
                {pollutionData.map((item, index) => {
                    return (
                        <View style={styles.column} key={index}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.value}>{item.value}</Text>
                            <Progress.Bar progress={item.progress} width={80} borderWidth={0} height={8} unfilledColor='#E7E7E7' color={item.color} />
                        </View>
                    );
                })}
            </View>
        </View>
    )
}

export default PollutionInfo

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 30
    },
    boxContainer: {
        flexDirection: "row", // 水平排列
        justifyContent: "space-between", // 子元素之间平分空间
        padding: 20,
    },
    column: {
        flex: 1, // 每列均分
        marginHorizontal: 5, // 每列之间留一些间距
        justifyContent: "center", // 垂直居中对齐
    },
    name: {
        fontSize: 13,
        color: '#959595',
    },
    value: {
        fontSize: 13,
        color: '#333333',
        fontWeight: '600',
        paddingVertical: 4
    }

})

