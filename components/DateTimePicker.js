import React, { useState } from 'react';
import { View, Button, Text, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DateTimePickerComp = () => {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date'); // Mode can be 'date' or 'time'
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios'); // For iOS, keep the picker open after selection
    setDate(currentDate); // Update the selected date/time
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode); // Show either 'date' or 'time' picker
  };

  const showDatePicker = () => {
    showMode('date'); // Show date picker
  };

  const showTimePicker = () => {
    showMode('time'); // Show time picker
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ marginBottom: 20 }}>
        <Button onPress={showDatePicker} title="Select Date" />
      </View>
      <View style={{ marginBottom: 20 }}>
        <Button onPress={showTimePicker} title="Select Time" />
      </View>
      <Text>Selected Date: {date.toDateString()}</Text>
      <Text>Selected Time: {date.toLocaleTimeString()}</Text>
      
      {show && (
        <DateTimePicker
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
}

export default DateTimePickerComp