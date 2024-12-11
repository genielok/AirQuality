import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

interface AQIDisplayProps {
    AQI: number;
}

const AQIDisplay: React.FC<AQIDisplayProps> = ({ AQI }) => {
    return (
        <View style={styles.aqi}>
            <AnimatedCircularProgress
                size={230}
                width={15}
                fill={AQI / 5}
                tintColor="#35C77E"
                backgroundColor="#E7E7E7"
                arcSweepAngle={250}
                rotation={235}
                lineCap="round"
            >
                {() => (
                    <View>
                        <Text style={styles.textAQI}>AQI</Text>
                        <Text style={styles.AQINumber}>{AQI}</Text>
                        <Text style={styles.textAQI}>Average</Text>
                    </View>
                )}
            </AnimatedCircularProgress>
        </View>
    );
};

// 使用 React.memo 包裹以优化渲染
export default React.memo(AQIDisplay);

const styles = StyleSheet.create({
    aqi: {
        marginTop: 40,
        display: 'flex',
        alignItems: 'center',
    },
    textAQI: {
        color: '#959595',
        textAlign: 'center',
    },
    AQINumber: {
        color: '#333333',
        fontSize: 40,
        textAlign: 'center',
        marginBottom: 8,
    },
});
