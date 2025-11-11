import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Header from '../../components/Header';

const BookingSuccessScreen = ({ route, navigation }) => {
  const { bookingRef } = route.params;

  const handleGoToHistory = () => {
    // Navigate to the BookingHistoryScreen
    // You will need to have a 'BookingHistory' screen defined in your navigator
    navigation.navigate('Travel'); 
  };

  return (
    <ScreenWrapper>
    <View style={styles.container}>
      <Header title="Booking Confirmed"/>
      <View style={styles.content}>
        <MaterialIcons name="check-circle" size={100} color="#4CAF50" style={styles.icon} />
        <Text style={styles.title}>Booking Successful!</Text>
        <Text style={styles.message}>
          Your hotel booking has been successfully confirmed.
        </Text>
        <Text style={styles.bookingRef}>
          Booking Reference: <Text style={styles.bookingRefValue}>{bookingRef}</Text>
        </Text>
        
        <TouchableOpacity style={styles.historyButton} onPress={handleGoToHistory}>
          <Text style={styles.historyButtonText}>View My Bookings</Text>
        </TouchableOpacity>
      </View>
    </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#28005B',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  bookingRef: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
    marginBottom: 40,
  },
  bookingRefValue: {
    fontWeight: 'bold',
    color: '#28005B',
  },
  historyButton: {
    backgroundColor: '#28005B',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  historyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingSuccessScreen;