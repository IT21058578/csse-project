import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, GestureResponderEvent } from 'react-native';
import moment, { Moment } from 'moment'; // Import Moment

interface DateProps {
  date: Moment;
  onSelectDate: (date: Moment) => void; // Update to accept Moment
  selected: Moment | null; // Update to accept Moment
}

const DateComponent: React.FC<DateProps> = ({ date, onSelectDate, selected }) => {
  /**
   * use moment to compare the date to today
   * if today, show 'Today'
   * if not today, show day of the week e.g 'Mon', 'Tue', 'Wed'
   */
  const isToday = moment(date).isSame(moment(), 'day');
  const day = isToday ? 'Today' : moment(date).format('ddd');

  // get the full date e.g 2021-01-01 - we'll use this to compare the date to the selected date
  const fullDate = moment(date).format('YYYY-MM-DD');

  const handleDateSelect = () => {
    onSelectDate(moment(date)); // Pass Moment object
  };

  return (
    <TouchableOpacity
      onPress={handleDateSelect}
      style={[
        styles.card,
        selected?.isSame(date, 'day') && { backgroundColor: "#6146c6" },
      ]}
    >
      <Text
        style={[styles.big, selected?.isSame(date, 'day') && { color: "#fff" }]}
      >
        {day}
      </Text>
      <View style={{ height: 10 }} />
      <Text
        style={[
          styles.medium,
          selected?.isSame(date, 'day') && { color: "#fff", fontWeight: 'bold', fontSize: 24 },
        ]}
      >
        {moment(date).format('D')}
      </Text>
    </TouchableOpacity>
  );
};

export default DateComponent;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#eee',
    borderRadius: 10,
    borderColor: '#ddd',
    padding: 10,
    marginVertical: 10,
    alignItems: 'center',
    height: 90,
    width: 80,
    marginHorizontal: 5,
  },
  big: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  medium: {
    fontSize: 16,
  },
});
