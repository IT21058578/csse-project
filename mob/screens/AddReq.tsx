import React, { useState } from "react";
import { StyleSheet, View, Image, Text, ScrollView, Pressable } from "react-native";
import { NativeBaseProvider, Input ,TextArea, useNativeBase, Flex } from "native-base";
import DropDownPicker from 'react-native-dropdown-picker';
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import FontSize from "../constants/FontSize";
import { Checkbox, Button } from "native-base";
import { TimerPickerModal } from "react-native-timer-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useCreateitemrequestMutation } from "../Redux/API/ItemRequestApiSlice";
import { Requests } from "../types";
import Calendar from "../components/Calendar/calender";
import moment, { Moment } from 'moment';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useGetAllUsersQuery } from "../Redux/API/usersApiSlice";
import  Toast from 'react-native-toast-message';
import { useAppSelector } from "../hooks/redux-hooks";
import AddReqHead from "../components/AddReqHead";


const AddReq = () => {
    
    // const [newReq,ReqResult] = useCreateitemrequestMutation();
    const [newReq, ReqResult] = useCreateitemrequestMutation();
    const { data: userData, isLoading, isError } = useGetAllUsersQuery('api/users');   

    const navigation = useNavigation();

    const handleBackNav = () => {
        navigation.goBack();
    }

    const [selectedDate, setSelectedDate] = useState<Moment | null>(null);

    const handleDateSelect = (date: Moment) => {
      setSelectedDate(date);
    };

    const [details,setDetails] = useState('');
    const [quantity,setQuantity] = useState('');
    const [supplier,setSupplier] = useState('');
    const [deliveryInfo,setDeliveryInfo] = useState('');
    const [fundingSource,setFundingSource] = useState('');
    const [addNotes,setAddNotes] = useState('');

    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

    const [supplierList, setSupplierList] = useState([
        {label: 'Supplier 1', value: 'supplier1'},
        {label: 'Supplier 2', value: 'supplier2'},
        // ... Add more suppliers as needed
    ]);
    
    const [fundingSourceList, setFundingSourceList] = useState([
        {label: 'Funding Source 1', value: 'fundingSource1'},
        {label: 'Funding Source 2', value: 'fundingSource2'},
        // ... Add more funding sources as needed
    ]);

    const handleCreateReq = async () => {
        const ReqData = {
            details: details, 
            quantity: quantity, 
            supplier: supplier,
            deliveryInfo: deliveryInfo,
            deliveryDate: selectedDate,
            fundingSource: fundingSource,
            addNotes: addNotes,
        }
        

        try {
            const response = await newReq(ReqData).unwrap();

            if(response){
                Toast.show({
                    type: 'success',
                    text1: 'Request Adding successful.',
                });
        
                // navigation.navigate("CTasks");
            }
          } catch (error) {
                Toast.show({
                    type: 'error',
                    text1: 'Request Adding is unsuccessful.',
                });
                console.log("error")
        }
    }

    return (
       <View>
        <AddReqHead />
        <View style={styles.container0}>
            <View style={styles.box0}>
                {/* <Pressable style={styles.rectangle} onPress={handleBackNav}>
                    <Image style={styles.backImg} source={require('../assets/Arrow.png')} />
                </Pressable> */}
                <Text style={styles.typo1}>Purchase Requisition</Text>
            </View>
        </View>
            <ScrollView contentContainerStyle={styles.container} nestedScrollEnabled={true}>
            <View style={styles.box1}>
                <Text style={styles.typoBoddy}>Item Details</Text>
            </View>
            <View style={styles.box1}>
                <NativeBaseProvider>
                    <TextArea
                        h={20}
                        placeholder="Enter Item Details"
                        w="100%"
                        backgroundColor={Colors.colorGhostwhite}
                        maxW={400} 
                        autoCompleteType="off" 
                        onChangeText={setDetails}
                    />
                </NativeBaseProvider>
            </View>
            <View style={styles.box1}>
                <Text style={styles.typoBoddy}>Quantity</Text>
            </View>
            <View style={styles.box1}>
                <NativeBaseProvider>
                    <Input variant="underlined" placeholder="Enter quantity" onChangeText={setQuantity}/>
                </NativeBaseProvider>
            </View>
            <View style={styles.box1}>
                <Text style={styles.typoBoddy}>Supplier</Text>
            </View>
            <View style={styles.box2}>
                <NativeBaseProvider>
                    <DropDownPicker
                        items={supplierList}
                        defaultValue={supplier}
                        containerStyle={{height: 40}}
                        style={{backgroundColor: '#fafafa'}}
                        dropDownStyle={{backgroundColor: '#fafafa'}}
                        onChangeItem={item => setSupplier(item.value)}
                    />
                    {/* <Input variant="underlined" placeholder="Enter supplier" onChangeText={setSupplier}/> */}
                </NativeBaseProvider>
            </View>
            <View style={styles.box1}>
                <Text style={styles.typoBoddy}>Delivery Information</Text>
            </View>
            <View style={styles.box2}>
                <NativeBaseProvider>
                    <TextArea
                        h={20}
                        placeholder="Enter Delivery Information"
                        w="100%"
                        backgroundColor={Colors.colorGhostwhite}
                        maxW={400} 
                        autoCompleteType="off" 
                        onChangeText={setDeliveryInfo}
                    />
                </NativeBaseProvider>
            </View>
            <View style={styles.box1}>
                <Text style={styles.typoBoddy}>Delivery Date</Text>
            </View>
            <View style={styles.box2}>
                <Calendar onSelectDate={handleDateSelect} selected={selectedDate} />
            </View>
            <View style={styles.box1}>
                <Text style={styles.typoBoddy}>Funding Source</Text>
            </View>
            <View style={styles.box2}>
                <NativeBaseProvider>
                    <DropDownPicker
                        items={fundingSourceList}
                        defaultValue={fundingSource}
                        containerStyle={{height: 40}}
                        style={{backgroundColor: '#fafafa'}}
                        dropDownStyle={{backgroundColor: '#fafafa'}}
                        onChangeItem={item => setFundingSource(item.value)}
                    />
                    {/* <Input variant="underlined" placeholder="Enter Funding Source" onChangeText={setFundingSource}/> */}
                </NativeBaseProvider>
            </View>
            <View style={styles.box1}>
                <Text style={styles.typoBoddy}>Additional Notes</Text>
            </View>
            <View style={styles.box2}>
                <NativeBaseProvider>
                    <Input variant="underlined" placeholder="Enter Additional notes" onChangeText={setAddNotes}/>
                </NativeBaseProvider>
            </View>
            <View style={{...styles.box1, flexDirection: 'row'}}>
            <NativeBaseProvider>
                <Button size="lg" 
                    backgroundColor={Colors.text} 
                    borderRadius={10} 
                    width={'95%'}
                    onPress={handleBackNav}> Cancel 
                </Button>
            </NativeBaseProvider>
            <NativeBaseProvider>
                <Button size="lg" 
                    backgroundColor={Colors.text} 
                    borderRadius={10} 
                    width={'95%'}
                    onPress={() => handleCreateReq()}> Submit 
                </Button>
            </NativeBaseProvider>
            </View>
        </ScrollView>
        <Toast/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingVertical: 20,
        paddingHorizontal: 20,
        paddingBottom:150,
    },
    container0: {
        flexGrow: 1,
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    box0: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    box1: {
        marginBottom: 20,
    },
    box2: {
        marginBottom: 20,
        paddingRight: 0,
    },
    box3: {
        backgroundColor: Colors.colorGhostwhite,
        borderRadius:10,
        shadowColor: Colors.darkText,
        shadowOffset: {
            width: 0,
            height: 2,
          },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
        padding:10,
        marginBottom:50,
    },
    typo1: {
        marginLeft:40,
        marginTop:4,
        color: Colors.darkblue,
        fontFamily: Font['poppins-semiBold'],
        fontSize: FontSize.large,
    },
    typoBoddy: {
        color: Colors.darkblue,
        fontFamily: Font['poppins-regular'],
        fontSize: FontSize.medium,
    },
    rectangle:{
        width:40,
        height:40,
        backgroundColor: Colors.colorWhite,
        borderRadius:10,
        shadowColor: Colors.darkText,
        shadowOffset: {
            width: 0,
            height: 2,
          },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
        alignItems: "center",
        verticalAlign: "middle"
    },
    backImg: {
        marginTop: 8,
    },
    CheckboxSpace1:{
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    box4: {
        flex:1,
        flexDirection:'row',
        padding:10,
    },
});

export default AddReq;
