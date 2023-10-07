import {
  Dimensions,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import Spacing from "../constants/Spacing";
import FontSize from "../constants/FontSize";
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
const { height } = Dimensions.get("window");

type Props = NativeStackScreenProps<RootStackParamList, "Welcome">;

const WelcomeScreen: React.FC<Props> = ({ navigation: { navigate } }) => {
  return (
    <SafeAreaView>
      <View>
        <ImageBackground
          style={{
            height: height / 1.5,
          }}
          resizeMode="contain"
          source={require("../assets/images/welcome.png")}
        />

        <View
          style={{
            paddingHorizontal: Spacing * 2,
            paddingTop: Spacing * 2,
            flexDirection: "column",
          }}
        >
          <TouchableOpacity
            onPress={() => navigate("Login")}
            style={{
              backgroundColor: Colors.text,
              paddingVertical: Spacing * 1.5,
              // paddingHorizontal: Spacing * 2,
              // width: "100%",
              borderRadius: Spacing,
              shadowColor: Colors.primary,
              shadowOffset: {
                width: 0,
                height: Spacing,
              },
              shadowOpacity: 0.3,
              shadowRadius: Spacing,
            }}
          >
            <Text
              style={{
                fontFamily: Font["poppins-bold"],
                color: Colors.onPrimary,
                fontSize: FontSize.large,
                textAlign: "center",
              }}
            >
              Login
            </Text>
          </TouchableOpacity>

          <View
            style={{
              // paddingHorizontal: Spacing * 2,
              paddingTop: Spacing * 8,
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                fontSize: FontSize.small
              }}
            >
              Don't have an account?
            </Text>
            <TouchableOpacity
              // onPress={() => navigate("Register")}
              style={{
                // width: "0%",
              }}
            >
              <Text
                style={{
                  fontFamily: Font["poppins-bold"],
                  color: "red",
                  fontSize: FontSize.small,
                  textAlign: "center",
                  paddingLeft: 5,
                }}
              >
                Contact Administrator
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({});
