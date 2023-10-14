import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import moment , {Moment} from 'moment';
import DateComponent from './Date';

interface CalendarProps {
  onSelectDate: (date:Moment) => void;
  selected: Moment | null;
}

const Calendar: React.FC<CalendarProps> = ({ onSelectDate, selected }) => {
  const [dates, setDates] = useState<moment.Moment[]>([]);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [currentMonth, setCurrentMonth] = useState<string | undefined>();

  // get the dates from today to 10 days from now, format them as strings and store them in state
  const getDates = () => {
    const _dates: moment.Moment[] = [];
    for (let i = 0; i < 10; i++) {
      const date = moment().add(i, 'days');
      _dates.push(date);
    }
    setDates(_dates);
  };

  useEffect(() => {
    getDates();
  }, []);

  /**
   * scrollPosition is the number of pixels the user has scrolled
   * we divide it by 60 because each date is 80 pixels wide and we want to get the number of dates
   * we add the number of dates to today to get the current month
   * we format it as a string and set it as the currentMonth
   */
  const getCurrentMonth = () => {
    const month = moment(dates[0]).add(scrollPosition / 60, 'days').format('MMMM');
    setCurrentMonth(month);
  };

  useEffect(() => {
    getCurrentMonth();
  }, [scrollPosition]);

  return (
    <>
      {/* <View style={styles.centered}>
        <Text style={styles.title}>{currentMonth}</Text>
      </View> */}
      <View style={styles.dateSection}>
        <View style={styles.scroll}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            // onScroll is a native event that returns the number of pixels the user has scrolled
            onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) =>
              setScrollPosition(e.nativeEvent.contentOffset.x)
            }
            scrollEventThrottle={16}
          >
            {dates.map((date, index) => (
              <DateComponent
                key={index}
                date={date}
                onSelectDate={onSelectDate}
                selected={selected}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    </>
  );
};

export default Calendar;

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  dateSection: {
    width: '100%',
    padding: 15,
  },
  scroll: {
    height:100,
  },
});
