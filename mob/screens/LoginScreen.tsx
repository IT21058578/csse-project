import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import Spacing from "../constants/Spacing";
import FontSize from "../constants/FontSize";
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import AppTextInput from "../components/AppTextInput";
import { useLoginMutation } from "../Redux/API/AuthApiSlice";
import { HandleResult } from "../Utils/HandleResults";

const { height } = Dimensions.get("window");

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const LoginScreen: React.FC<Props> = ({ navigation: { navigate } }) => {

  const [sendUserInfo, result] = useLoginMutation();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (name: any, text: any) => {
    setData({ ...data, [name]: text });
  };

  const handleLogin = async () => {
    sendUserInfo(data);
  };

  return (
    <SafeAreaView>
      <View
        style={{
          padding: Spacing * 2,
        }}
      >
        <ImageBackground
          style={{
            width: "90%",
            height: height / 5,
            alignItems: "center",
            marginLeft: "10%",
          }}
          resizeMode="contain"
          source={require("../assets/images/welcomeText.png")}
        />
  
        <View
          style={{
            marginVertical: Spacing * 2,
          }}
        >
          <AppTextInput 
            placeholder="Email"
            onChangeText={(text) => handleChange("email", text)} />

          <AppTextInput 
            placeholder="Password" 
            onChangeText={(text) => handleChange("password", text)} />
        </View>

        <View>
          <Text
            style={{
              fontFamily: Font["poppins-semiBold"],
              fontSize: FontSize.small,
              color: Colors.text,
              alignSelf: "flex-end",
            }}
          >
            Forgot your password ?
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          style={{
            padding: Spacing * 2,
            backgroundColor: Colors.text,
            marginVertical: Spacing * 2,
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
              textAlign: "center",
              fontSize: FontSize.large,
            }}
          >
            Login
          </Text>
        </TouchableOpacity>

        <HandleResult result={result} />
        
        <ImageBackground
          style={{
            height: height / 5,
            alignItems: "center",
          }}
          resizeMode="contain"
          source={require("../assets/images/pointingUp.png")}
        />
        <View
            style={{
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
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
