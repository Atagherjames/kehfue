import React, {useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '../../constants/colors'
import AppHeader from '../../components/AppHeader'
import { View, Text, StyleSheet } from 'react-native'
import { Calendar } from 'react-native-calendars';
import BackButton from '../../components/BackButton'
import AppButton from '../../components/AppButton'

const SelectDate = ({
    navigation
}) => {
    const [selectedDate, setSelectedDate] = useState('');
    const currentDate = new Date()

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  return (
    <SafeAreaView
        style={{
            flex: 1,
            backgroundColor: Colors.white,
        }}
    >
        <AppHeader
            navigation={navigation}
        />

        <View
            style={{
                flex: 1,
                gap: 20,
                padding: 20
            }}
        >
            <BackButton
                navigation={navigation}
            />
            <Calendar
                onDayPress={onDayPress}
                markedDates={{
                [selectedDate]: { selected: true, marked: true, selectedColor: Colors.primary },

                }}
                minDate={currentDate}
                hideExtraDays={true}
                headerStyle={{
                    fontFamily: "Bold",
                }}
                enableSwipeMonths={true}
            />
            {/* <Text style={styles.selectedDateText}>Selected Date: {selectedDate}</Text> */}

            <AppButton
                btnText={"Confirm"}
            />
        </View>
    </SafeAreaView>
  )
}

export default SelectDate

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
    },
    selectedDateText: {
      marginTop: 20,
      fontSize: 18,
    },
  });