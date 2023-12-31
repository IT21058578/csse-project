import { useNavigation } from '@react-navigation/native';
import { NativeBaseProvider } from 'native-base';
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
// if you've installed @react-native-vector-icons
import Icon from 'react-native-vector-icons/FontAwesome';

interface Notification {
    id: string;
    text: string;
    timestamp: Date; 
}


const Notifications: React.FC = () => {

    const [notifications, setNotifications] = useState<Notification[]>([
        { id: '1', text: 'Your first notification', timestamp: new Date(Date.now() - 3600 * 1000) }, // 1 hour ago
        { id: '2', text: 'Your second notification', timestamp: new Date(Date.now() - 24 * 3600 * 1000) }, // 1 day ago
        // ... more notifications
    ]);    

    const timeAgo = (past: Date) => {
        const seconds = Math.floor((new Date().getTime() - past.getTime()) / 1000);
    
        const intervals = [
            { label: 'year', seconds: 31536000 },
            { label: 'month', seconds: 2592000 },
            { label: 'week', seconds: 604800 },
            { label: 'day', seconds: 86400 },
            { label: 'hour', seconds: 3600 },
            { label: 'minute', seconds: 60 }
        ];
    
        for (let interval of intervals) {
            const count = Math.floor(seconds / interval.seconds);
            if (count >= 1) {
                return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
            }
        }
    
        return 'just now';
    };
    
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
                            <View style={{flex: 1, marginLeft: 10}}> 
                                <Text style={styles.notificationText}>{item.text}</Text>
                                <Text style={styles.timeAgoText}>{timeAgo(item.timestamp)}</Text>
                            </View>
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
    },
    timeAgoText: {
        marginTop: 5,
        fontSize: 12,
        color: 'grey',
    }
    
});

export default Notifications;
