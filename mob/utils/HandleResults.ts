import { useEffect } from "react";
import  Toast from 'react-native-toast-message';
import { useNavigation } from "@react-navigation/native";
import RoutePaths from "./RoutePaths";
import { useAppDispatch } from "../hooks/redux-hooks";
import { setUser } from "../Redux/slices/userSlice";
import { setItem } from "./Genarals";

export const HandleResult = ({ result }: { result: any }) => {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();

  useEffect(() => {
    if (result.isError) {
      // Handle error response
      Toast.show({
        type: 'error',
        text1: result.error.message || 'An error occurred.',
      });
      console.log("error")
    } else if (result.isSuccess) {
      // Handle success response
      const responseData = result.data;

      if (responseData?.tokens && responseData.user) {
          setItem(RoutePaths.token, responseData.tokens.accessToken);
          setItem("user", responseData.user);
          dispatch(setUser(responseData.user));

          Toast.show({
            type: 'success',
            text1: 'Sign In successful.',
          });

          navigation.navigate("BottomTab");

      } else {
        // Handle invalid response data
        Toast.show({
            type: 'error',
            text1: 'Invalid response data.',
          });
        console.log("error")
      }

      Toast.show({
        type: 'success',
        text1: 'Login successful.',
      });
      navigation.navigate("BottomTab");

    }
  }, [result]);

  return null;

};

