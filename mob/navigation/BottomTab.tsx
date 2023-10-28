import React from 'react'
import BerlinTabBarNavigator from '../components/navBottom/Tabs';
import {Ionicons as Icon} from '@expo/vector-icons'
// import Home from '../screens/HomeScreen';
// import PersonalRoomSchedule from "../screens/PersonalRoomSchedule";
// import CreatedTasks from '../screens/CreatedTasks';
import Profile from '../screens/Profile';
import Register from '../screens/RegisterScreen';

const Tabs = BerlinTabBarNavigator()

const TabBarIcon = (props: any) => {
    return (
        <Icon
            name={props.name}
            size={props.size ? props.size : 24}
            color={props.tintColor}
        />
    )
}

export default () => (
    <Tabs.Navigator backBehavior='history'
    screenOptions={{
        animation: 'slide_from_right'
    }}
                    initialRouteName="TabOne"
                    tabBarOptions={{
                     labelStyle: {fontSize: 12, marginTop: 5, fontWeight: 'bold'},
                                           activeTintColor: "#7A28CB",
                                           inactiveTintColor: "#9e9e9e",
                                           activeBackgroundColor: "#e5cfff",
                                           activeTabColor:'#7A28CB'
                    }}
                    appearance={{
                        topPadding: 10, // Replace with your desired values
                        bottomPadding: 10,
                        horizontalPadding: 10,
                        tabBarBackground: "#ffffff",
                    }}
    >
        {/* <Tabs.Screen
            name="TabOne"
            component={Home}
            options={{
                tabBarIcon: ({focused, color}: any) => (
                    <TabBarIcon
                        focused={focused}
                        tintColor={color}
                        name="home-sharp"
                    />
                ),

            }}
        /> */}

        {/* <Tabs.Screen
            name="TabTwo"
            component={PersonalRoomSchedule}
            options={{
                tabBarIcon: ({focused, color}: any) => (
                    <TabBarIcon
                        focused={focused}
                        tintColor={color}
                        name="person"
                    />
                ),
            }}
        /> */}
        <Tabs.Screen
            name="TabThree"
            // component={CreatedTasks}
            component={Register}
            options={{
                tabBarIcon: ({focused, color}: any) => (
                    <TabBarIcon
                        focused={focused}
                        tintColor={color}
                        name="rocket"
                    />
                ),
            }}
        />

        <Tabs.Screen
            name="FourthTab"
            component={Profile}
            options={{
                tabBarIcon: ({focused, color}: any) => (
                    <TabBarIcon
                        focused={focused}
                        tintColor={color}
                        name="ios-notifications"
                    />
                ),
            }}
        />
    </Tabs.Navigator>
)

