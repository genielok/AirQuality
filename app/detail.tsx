import AQDetail from '@/pages/AQDetailPage';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { router } from 'expo-router';

export default function DetailPage(params: { route: { params: { detailInfo: any; }; }; }) {
    const detailInfo = params.route.params.detailInfo
    return (
        <SafeAreaView style={styles.container}>
            <TouchableWithoutFeedback onPress={() => { router.back() }}>
                <View style={styles.tab}>
                    <Ionicons style={{ marginLeft: 10 }} name="arrow-back" size={24} color="black" />
                    <Text style={{ fontSize: 18, marginLeft: 10, fontWeight: 500 }}>Back</Text>
                    <View></View>
                </View>
            </TouchableWithoutFeedback>
            <AQDetail detailInfo={detailInfo} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    tab: {
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
    },
    tabText: {
        color: '#000',
        fontSize: 18,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
