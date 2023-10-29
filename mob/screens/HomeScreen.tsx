import * as React from "react";
import { Text, StyleSheet, View, ScrollView } from "react-native";
import { Button } from "react-native-paper";
import ContainerFrame from "../components/ContainerFrame";
import Font from "../constants/Font";
import { Color, FontSize, Padding, Border } from "../Styles/GlobalStyles";
import { Requests, scheduleTypes } from "../types";
import HomeScheduleBox from "../components/schedule/homeScheduleBox";
import { requisitions } from "../data/virtualData";
import { useGetAllitemrequestsQuery } from "../Redux/API/ItemRequestApiSlice";
import BottomTab from "../navigation/BottomTab";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const Home: React.FC<Props> = ({ navigation: { navigate } }) => {

  const {
    data,
    data: procurementsList,
    isLoading,
  } = useGetAllitemrequestsQuery("api/procurements");

  return (
    <View style={styles.home}>

      <View style={styles.frameParent}>

        <ContainerFrame />

        <View style={[styles.frame, styles.frameFlexBox]}>
          <Text style={[styles.todayTask, styles.taskTypo]}>REQUISITIONS</Text>
          <Button
            style={styles.viewAll}
            mode="text"
            labelStyle={styles.viewAllBtn}>
            View all
          </Button>
        </View>

      </View>

      <ScrollView
        style={styles.frame3}
        horizontal={false}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true}
        contentContainerStyle={styles.frameScrollViewContent}
      >

        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          requisitions.map((request: Requests) => (
            <HomeScheduleBox {...request} key={request._id}/>
          ))
        )}

      </ScrollView>
      <BottomTab />
    </View>
  );
};

const styles = StyleSheet.create({
  viewAllBtn: {
    color: "black",
    fontSize: 12,
    fontFamily: Font["poppins-regular"],
  },
  frameScrollViewContent: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  frameFlexBox: {
    flexDirection: "row",
    position: "absolute",
    alignItems: "center",
    overflow: "hidden",
  },
  taskTypo: {
    textAlign: "left",
    color: 'black',
    fontFamily: Font["poppins-semiBold"],
    fontWeight: "600",
    fontSize: FontSize.size_5xl,
    height: 32,
  },
  frameLayout1: {
    height: 100,
    width: 326,
    flexDirection: "row",
    left: 0,
    position: "absolute",
    alignItems: "center",
    overflow: "hidden",
  },
  parentLayout1: {
    paddingVertical: Padding.p_base,
    width: 98,
    borderRadius: Border.br_5xs,
    paddingHorizontal: Padding.p_xs,
    height: 100,
  },
  textTypo: {
    fontFamily: Font["poppins-bold"],
    fontWeight: "700",
    color: Color.white,
    textAlign: "left",
  },
  parentLayout: {
    width: 155,
    paddingVertical: Padding.p_base,
    paddingHorizontal: Padding.p_xs,
    borderRadius: Border.br_5xs,
    height: 100,
  },
  wrapperLayout: {
    paddingVertical: Padding.p_11xs,
    height: 20,
    width: 108,
    borderRadius: Border.br_10xs,
    position: "absolute",
  },
  altriumRoom01Typo: {
    height: 20,
    width: 83,
    fontSize: FontSize.size_3xs,
    fontFamily: Font["poppins-regular"],
    fontWeight: "500",
    textAlign: "left",
  },
  frameLayout: {
    height: 114,
    width: 322,
    backgroundColor: Color.ghostwhite,
    borderRadius: Border.br_mini,
  },
  todayTask: {
    width: 240,
  },
  viewAll: {
    marginLeft: 119,
  },
  frame: {
    top: 100,
    width: 400,
    height: 32,
    flexDirection: "row",
    left: 0,
  },
  personal: {
    color: Color.white,
    fontFamily: Font["poppins-regular"],
    fontSize: FontSize.size_sm,
    textAlign: "left",
  },
  text: {
    fontSize: FontSize.size_xl,
    marginTop: 5,
  },
  personalParent: {
    backgroundColor: "#4cd97b",
  },
  workParent: {
    backgroundColor: "#4db5ff",
    marginLeft: 16,
  },
  educationParent: {
    backgroundColor: "#9059ff",
    marginLeft: 16,
  },
  frame1: {
    top: 258,
  },
  text3: {
    marginTop: 4,
    fontSize: FontSize.size_5xl,
    fontFamily: Font["poppins-bold"],
    fontWeight: "700",
  },
  tasksForDayParent: {
    backgroundColor: "#ffb259",
  },
  totalSheduledTimeParent: {
    backgroundColor: "#ff5959",
    marginLeft: 16,
  },
  frame2: {
    top: 142,
  },
  myTask: {
    top: 95,
    width: 100,
    left: 0,
    position: "absolute",
    color: "black",
    fontFamily: Font["poppins-semiBold"],
    fontWeight: "600",
  },
  frameParent: {
    width: 327,
    height: 132,
  },
  seProjectGroup: {
    color: "#8f99eb",
  },
  seProjectGroupWrapper: {
    top: 73,
    left: 35,
    backgroundColor: "rgba(143, 153, 235, 0.2)",
    paddingHorizontal: Padding.p_xs,
    height: 20,
    width: 108,
    borderRadius: Border.br_10xs,
  },
  frameChild: {
    borderStyle: "solid",
    borderColor: "#8f99eb",
    borderRightWidth: 2,
    width: 2,
    height: 37,
  },
  projectProgressMeeting: {
    fontSize: FontSize.size_sm,
    color: Color.darkslateblue,
    fontFamily: Font["poppins-regular"],
    fontWeight: "500",
    textAlign: "left",
  },
  text4: {
    color: Color.lightsteelblue,
    fontFamily: Font["poppins-regular"],
    fontSize: FontSize.size_sm,
    textAlign: "left",
  },
  projectProgressMeetingParent: {
    width: 175,
    marginLeft: 16,
  },
  frame4: {
    top: 15,
    left: 19,
    width: 192,
    height: 49,
  },
  altriumRoom01: {
    color: Color.lightcoral_100,
  },
  altriumRoom01Wrapper: {
    top: 75,
    left: 36,
    backgroundColor: Color.lightcoral_200,
    paddingHorizontal: Padding.p_6xs,
    alignItems: "flex-end",
  },
  frameContainer: {
    marginTop: 18,
  },
  frame3: {
    flex: 1,
    minHeight: 200,
  },
  home: {
    backgroundColor: Color.white,
    top:20,
    width: "100%",
    height: 812,
    paddingHorizontal: 0,
    paddingVertical: 37,
    alignItems: "center",
    overflow: "hidden",
    flex: 1,
  },
});

export default Home;
