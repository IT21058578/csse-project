import * as react from "react";
import { View , Image , Text ,Pressable } from "react-native";
import { StyleSheet } from "react-native";
import Font from "../constants/Font";
import Colors from "../constants/Colors";
import FontSize from "../constants/FontSize";

const Profile = () => {

    return(
        <View>
            <Image
                style={styles.roomManagmentProfileSettiChild}
                source={require("../assets/images/icon.png")}
            />
            <Image
                style={[styles.icon, styles.iconLayout]}
                source={require("../assets/images/icon.png")}
            />
            <Text style={styles.tharinduGunasekara}>Tharindu Gunasekara</Text>
            <Text style={[styles.roomsManageBy, styles.roomsTypo]}>
                Rooms Manage By You
            </Text>
            <Text style={styles.tharindugmailcom}>tharindu@gmail.com</Text>
            <Pressable
                style={styles.roomManagmentProfileSettiInner}
                onPress={() => {}}
            >
                <View style={[styles.groupChild, styles.icon1Layout]} />
            </Pressable>
            <Pressable style={styles.wrapper} onPress={() => {}}>
                <Image
                style={[styles.icon1, styles.icon1Layout]}
                source={require("../assets/images/icon.png")}
                />
            </Pressable>
            <Text style={styles.createRoom}>Create Room</Text>
            <Image
                style={[styles.iconlycurvedhome, styles.iconLayout]}
                source={require("../assets/images/icon.png")}
            />
        </View>
    );

}

export default Profile;

const styles = StyleSheet.create ({

      roomManagmentProfileSettiChild: {
        top: 28,
        left: 127,
        width: 112,
        height: 112,
        borderRadius: FontSize.small,
        position: "absolute",
      },
      icon: {
        height: "9.61%",
        width: "21.07%",
        top: "5.05%",
        right: "40.27%",
        bottom: "85.34%",
        left: "38.67%",
        position: "absolute",
      },
      iconLayout: {
        maxHeight: "100%",
        maxWidth: "100%",
        overflow: "hidden",
      },
      tharinduGunasekara: {
        top: 132,
        left: 101,
        fontSize: 20,
        textAlign: "left",
        color: Colors.primary,
        fontFamily: Font["poppins-bold"],
        fontWeight: "600",
        position: "absolute",
      },
      roomsManageBy: {
        top: 229,
        left: 42,
        position: "absolute",
      },
      roomsTypo: {
        fontSize: FontSize.medium,
        textAlign: "left",
        color: Colors.primary,
        fontFamily: Font['poppins-bold'],
        fontWeight: "600",
      },
      tharindugmailcom: {
        top: 176,
        left: 121,
        lineHeight: 17,
        fontFamily: Font["poppins-regular"],
        fontSize: FontSize.small,
        textAlign: "left",
        color: Colors.primary,
        position: "absolute",
      },
      roomManagmentProfileSettiInner: {
        height: "3.82%",
        width: "24.8%",
        top: "28.08%",
        right: "12%",
        bottom: "68.1%",
        left: "63.2%",
        position: "absolute",
      },
      groupChild: {
        top: "0%",
        right: "0%",
        bottom: "0%",
        left: "0%",
        backgroundColor: Colors.primary,
        borderRadius: FontSize.small,
        position: "absolute",
      },
      icon1Layout: {
        height: "100%",
        width: "100%",
      },
      icon1: {
        maxHeight: "100%",
        maxWidth: "100%",
        overflow: "hidden",
      },
      wrapper: {
        left: "75.73%",
        top: "4.92%",
        right: "4.53%",
        bottom: "85.95%",
        width: "19.73%",
        height: "9.12%",
        position: "absolute",
      },
      createRoom: {
        top: 236,
        left: 256,
        lineHeight: 15,
        color: "#f1f7ff",
        textAlign: "center",
        width: 71,
        height: 15,
        fontFamily: Font["poppins-regular"],
        fontWeight: "500",
        fontSize: FontSize.small,
        position: "absolute",
      },
      iconlycurvedhome: {
        height: "1.85%",
        width: "4%",
        top: "29.06%",
        right: "31.73%",
        bottom: "69.09%",
        left: "64.27%",
        position: "absolute",
      },
})