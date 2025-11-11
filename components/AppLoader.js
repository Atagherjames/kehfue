import React from 'react'
import { ActivityIndicator, Dimensions, View, StyleSheet, Text } from 'react-native'
import { Colors } from '../constants/colors'
import { MaterialIcons } from '@expo/vector-icons'

const { width, height } = Dimensions.get("window");

const AppLoader = ({message, error, children}) => {
  return (
    <View style={styles.overlay}>
      {!error ? (
        <ActivityIndicator
            color={Colors.primary}
            size="large"
        />
      ) : (
        <MaterialIcons name="error-outline" size={58} color="#E53935" style={{ marginBottom: 8 }} />
      )}
      {message && (
        <Text style={[styles.message, error && styles.error]}>
          {message}
        </Text>
      )}
      {error && children}
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999, 
    elevation: 9999, 
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  error: {
    color: "#E53935"
  }
});

export default AppLoader;
