import React from 'react';
import { View, Text, StyleSheet, FlatList ,ScrollView } from 'react-native';
import RoomScheduleBox from './schedule/roomScheduleBox';
import Colors from '../constants/Colors';
import Font from '../constants/Font';

// Sample schedule data (replace with your own data)
const scheduleData = [
  { id: '1', startTime: '09:00 AM', endTime: '10:00 AM', title: 'Meeting 1' },
  { id: '6', startTime: '09:30 AM', endTime: '10:30 AM', title: 'Meeting 2' },
  { id: '2', startTime: '10:30 AM', endTime: '11:30 AM', title: 'Meeting 3' },
  { id: '3', startTime: '09:30 AM', endTime: '10:30 AM', title: 'Lunch' },
  { id: '4', startTime: '02:00 PM', endTime: '03:00 PM', title: 'Meeting 4' },
  { id: '5', startTime: '02:01 PM', endTime: '05:00 PM', title: 'Meeting 5' },
];

// Function to convert time to a sortable value
function convertTimeToSortableValue(time: string): number {
  const [hourMinute, ampm] = time.split(' ');
  const [hours, minutes] = hourMinute.split(':').map((str) => parseInt(str));
  return ampm === 'PM' ? (hours % 12 + 12) * 60 + minutes : hours * 60 + minutes;
}

// Group the schedules by start time
const groupedSchedules: { [key: string]: any[] } = {};

scheduleData.forEach((schedule) => {
//   const key = schedule.startTime.split(':')[0]; // Extract the hour from the start time
  const key = schedule.startTime // Extract the  the start time
  if (!groupedSchedules[key]) {
    groupedSchedules[key] = [];
  }
  groupedSchedules[key].push(schedule);
});


const ScheduleScreen = () => {
  // Sort the keys (start times) in ascending order considering AM and PM
  const sortedKeys = Object.keys(groupedSchedules).sort(
    (a, b) =>
      convertTimeToSortableValue(a) - convertTimeToSortableValue(b)
  );

  return (
    <View style={styles.container}>

      <View style={styles.Box}>
        <Text style={[styles.today, styles.todayPosition]}>Day Plan</Text>
        <Text style={[styles.h45Min, styles.h45MinTypo]}>09 h 45 min</Text>
      </View>

      <FlatList
        data={sortedKeys.map((key) => [key, groupedSchedules[key]]) as (string | any[])[]}
        keyExtractor={(item) => item[0]}
        renderItem={({ item }) => (
          <View style={styles.timeSlotContainer}>
            <Text style={styles.timeSlot}>{item[0]}</Text>
            {item[1].map((schedule: any) => (
            //   <View key={schedule.id} style={styles.scheduleItem}>
            //     <Text>{schedule.title}</Text>
            //     <Text>{schedule.startTime} - {schedule.endTime}</Text>
            //   </View>
                <RoomScheduleBox {...schedule} key={schedule.id}/>
            ))}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 25,
  },
  Box: {
    width: 100,
    height: 30,
    marginBottom: 30,
  },
  timeSlotContainer: {
    marginBottom: 16,
  },
  timeSlot: {
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft:5,
    marginBottom: 8,
    color:Colors.primary,
  },
  scheduleItem: {
    padding: 10,
    backgroundColor: '#e5e5e5',
    marginBottom: 8,
  },
  todayPosition: {
    textAlign: "left",
    color: Colors.darkText,
    left: "auto",
    position: "absolute",
  },
  h45MinTypo: {
    fontFamily: Font["poppins-regular"],
    textAlign: "left",
  },
  today: {
    fontSize: 20,
    width: "auto",
    height: 26,
    fontFamily: Font["poppins-regular"],
    fontWeight: "500",
    textAlign: "left",
    color: Colors.darkText,
  },
  h45Min: {
    left: 260,
    color: "#000",
    width: 69,
    height: 19,
    fontSize: 14,
    fontFamily: Font["poppins-regular"],
    position: "absolute",
  },
});

export default ScheduleScreen;
