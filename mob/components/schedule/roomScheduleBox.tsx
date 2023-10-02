import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import Font from "../../constants/Font";
import { scheduleTypes } from "../../types";
import { Color,FontSize, Padding, Border } from "../../Styles/GlobalStyles";

const RoomScheduleBox = (props : scheduleTypes) => {
    return(
      <View style={[styles.frameContainer, styles.frameLayout]}>
        <View style={[styles.frame4, styles.frameFlexBox]}>
          <View style={styles.frameChild} />
          <View style={styles.projectProgressMeetingParent}>
            <Text style={styles.projectProgressMeeting}>
              {props.title}
            </Text>
            <Text style={styles.text4}>{props.startTime} - {props.endTime}</Text>
          </View>
        </View>
      </View>

    );
}

const styles = StyleSheet.create ({
    altriumRoom01Wrapper: {
        top: 75,
        left: 36,
        backgroundColor: Color.lightcoral_200,
        paddingHorizontal: Padding.p_6xs,
        alignItems: "flex-end",
      },
    wrapperLayout: {
        paddingVertical: Padding.p_11xs,
        height: 20,
        width: 108,
        borderRadius: Border.br_10xs,
        position: "absolute",
      },
    altriumRoom01: {
        color: Color.lightcoral_100,
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
    altriumRoom01Typo: {
        height: 20,
        width: 83,
        fontSize: FontSize.size_3xs,
        fontFamily: Font["poppins-regular"],
        fontWeight: "500",
        textAlign: "left",
      },
    frame4: {
        top: 15,
        left: 19,
        width: 192,
        height: 49,
      },
    frameLayout: {
        height: 80,
        width: 322,
        backgroundColor: Color.ghostwhite,
        borderRadius: Border.br_mini,
      },
    frameFlexBox: {
        flexDirection: "row",
        position: "absolute",
        alignItems: "center",
        overflow: "hidden",
      },
    frameContainer: {
        marginTop: 5,
      },
    frameChild: {
        borderStyle: "solid",
        borderColor: "#8f99eb",
        borderRightWidth: 2,
        width: 2,
        height: 37,
      },
})

export default RoomScheduleBox;