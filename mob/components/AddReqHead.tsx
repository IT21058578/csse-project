import * as React from "react";
import { Text, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import Font from "../constants/Font";
import { FontSize, Color, Border } from "../Styles/GlobalStyles";
import Icon from 'react-native-vector-icons/FontAwesome';

const AddReqHead = () => {
  return (
    <View style={[styles.frame, styles.frameLayout]}>
      <View style={[styles.frame1, styles.frameLayout]}>
        <Text style={styles.dash}>PURCHASE REQUISITION</Text>
        <Text style={styles.letsMakeThis}>Just Oder Useful Things Only</Text>
      </View>
      <View style={{marginLeft:80, paddingTop:10}}>
        {/* <Icon name='bell' size={14} onPress={() => navigate("Notifications")}/> */}
      </View>
      <View style={styles.frame2}>
        <Image
          style={styles.personedSkinTonewhitePo}
          contentFit="cover"
          source={require("../assets/personed-skin-tonewhite-posture1-happy.png")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  frameLayout: {
    height: 56,
    overflow: "hidden",
  },
  dash: {
    fontSize: FontSize.size_9xl,
    lineHeight: 31,
    fontWeight: "bold",
    fontFamily: Font["poppins-regular"],
    color: "black",
    textAlign: "left",
  },
  letsMakeThis: {
    fontSize: FontSize.size_sm,
    lineHeight: 17,
    fontFamily: Font["poppins-regular"],
    color: Color.dimgray,
    marginTop: 8,
    textAlign: "left",
  },
  frame1: {
    width: 182,
    overflow: "hidden",
  },
  personedSkinTonewhitePo: {
    width: 37,
    height: 36,
  },
  frame2: {
    borderRadius: Border.br_sm,
    backgroundColor: Color.white,
    shadowColor: "#f1f7ff",
    shadowOffset: {
      width: -3,
      height: 7,
    },
    shadowRadius: 13,
    elevation: 13,
    shadowOpacity: 1,
    width: 39,
    height: 39,
    alignItems: "center",
    marginLeft: 10,
    overflow: "hidden",
  },
  frame: {
    position: "absolute",
    top: 70,
    left: 0,
    width: 327,
    flexDirection: "row",
    overflow: "hidden",
  },
});

export default AddReqHead;
