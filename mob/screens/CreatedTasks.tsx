import * as React from "react";
import { View ,Text , Image , ScrollView } from "react-native";
import { StyleSheet } from "react-native";
import Font from "../constants/Font";
import HomeScheduleBox from "../components/schedule/homeScheduleBox";
import { scheduleTypes } from "../types";
import { schedulesApi } from "../data/virtualData";
import { useGetAllPersonalDaySchedulesQuery } from "../Redux/API/schedules.api.slice";
import AppTextInput from "../components/AppTextInput";

const CreatedTasks = () => {

    const {
        data,
        data: scheduleList,
        isLoading,
      } = useGetAllPersonalDaySchedulesQuery("api/scheduleApi");
     
    return(
        <View style={styles.flexBox}>
            <View style={styles.Box}>
                <Text style={[styles.tasksCreatedBy, styles.searchForTaskFlexBox]}>
                Tasks Created By You
                </Text>
                <Image
                style={[styles.allTasksChild, styles.allTasksChildLayout]}
                source={require("../assets/images/icon.png")}
                />
            </View>
            <View style={styles.Box2}>
                <AppTextInput placeholder="Search tasks"/>
            </View>
            <View style={styles.Box1}>
                <ScrollView
                    horizontal={false}
                    showsVerticalScrollIndicator={true}
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled={true}
                    contentContainerStyle={styles.frameScrollViewContent}
                >

                    {isLoading ? (
                    <Text>Loading...</Text>
                    ) : (
                    schedulesApi.map((schedule: scheduleTypes) => (
                        <HomeScheduleBox {...schedule} key={schedule.id}/>
                    ))
                    )}

                </ScrollView>

            </View>
        </View>
    );
}

export default CreatedTasks;

const styles = StyleSheet.create ({
    flexBox: {
        flex:1,
    },
    Box: {
        width: "100%",
        height: 70,
        padding:25
    },
    Box1: {
        width: "100%",
        height: "100%",
        padding: 25
    },
    Box2: {
        width: "100%",
        height: "auto",
        padding: 25
    },
    tasksCreatedBy: {
        top: 57,
        left: 72,
        fontSize: 20,
        fontWeight: "600",
        fontFamily: Font["poppins-bold"],
        color: "#10275a",
    },
    allTasksChild: {
        height: "9.11%",
        width: "19.73%",
        top: "6.93%",
        right: "79.2%",
        bottom: "85.96%",
        left: "6.07%",
    },
    allTasksChildLayout: {
        maxHeight: "50%",
        maxWidth: "50%",
        position: "absolute",
        overflow: "hidden",
    },
    searchForTaskFlexBox: {
        textAlign: "left",
        position: "absolute",
    },
    frameScrollViewContent: {
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
    },
})