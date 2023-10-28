import { useNavigation } from '@react-navigation/native';
import { NativeBaseProvider } from 'native-base';
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
// if you've installed @react-native-vector-icons
import Icon from 'react-native-vector-icons/FontAwesome';

interface Notification {
    id: string;
    text: string;
}

const Notifications: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([
        { id: '1', text: 'Your first notification' },
        { id: '2', text: 'Your second notification' },
        // ... more notifications
    ]);

    const navigation = useNavigation();

    const handleBackNav = () => {
        navigation.goBack();
    }

    return (
        <NativeBaseProvider>
            <View style={styles.header}>
                <Icon name="arrowleft" onPress={handleBackNav}/>
                <Text style={styles.title}>Notifications</Text>
            </View>
            <View style={styles.container}>
                <FlatList 
                    data={notifications}
                    renderItem={({ item }) => (
                        <View style={styles.notificationItem}>
                            <Icon name="bell" size={24} color="grey"/>
                            <Text style={styles.notificationText}>{item.text}</Text>
                        </View>
                    )}
                    keyExtractor={item => item.id}
                />
            </View>
        </NativeBaseProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingTop: 20,
    },
    notificationItem: {
        flexDirection: 'row',
        padding: 20,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
        alignItems: 'center',
    },
    notificationText: {
        marginLeft: 10,
        fontSize: 16,
    },
    title: {
        textAlign: 'center',
        padding: 10,
        marginLeft: "33%",
        fontWeight: 'bold'
    },
    header: {
        flexDirection: 'row',
        marginTop: 30,
        fontSize: 20
    }
});

export default Notifications;
