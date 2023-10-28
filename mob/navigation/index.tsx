import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import Colors from "../constants/Colors";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import Welcome from "../screens/WelcomeScreen";
import Home from "../screens/HomeScreen";
import BottomTab from "./BottomTab";

import { RootStackParamList } from "../types";
import AddTask from "../screens/AddReq";
import Notifications from "../screens/Notifications";
import ContainerFrame from "../components/ContainerFrame";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.background,
  },
};

export default function Navigation() {
  return (
    <NavigationContainer theme={theme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="BottomTab" component={BottomTab} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="NewRequisition" component={AddTask} />
      <Stack.Screen name="HomeCont" component={ContainerFrame} />
    </Stack.Navigator>
  );
}
