import React, { useState, useRef } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Dimensions } from 'react-native'
import { Colors } from '../../constants/colors'
import AppHeader from '../../components/AppHeader'
import AppLoader from '../../components/AppLoader'
import ScreenWrapper from '../../components/ScreenWrapper'
import { useRecoilState } from 'recoil'
import { AccessToken, UserData } from '../../recoil/UserData'
import { usePinMutation } from '../../services/routes/userRoutes'
import { useToast } from 'react-native-toast-notifications'

const PIN_LENGTH = 4

const PinScreen = ({ navigation }) => {
  const [pinArray, setPinArray] = useState(Array(PIN_LENGTH).fill(''))
  const inputRefs = Array.from({ length: PIN_LENGTH }, () => useRef(null))
  const [userData] = useRecoilState(UserData)
  const [token] = useRecoilState(AccessToken)
  const [createPin, { isLoading }] = usePinMutation()
  const toast = useToast()

  // On digit change
  const handleDigitChange = (digit, index) => {
    const cleanDigit = digit.replace(/[^0-9]/g, '').slice(0, 1)
    const newPinArray = [...pinArray]
    newPinArray[index] = cleanDigit
    setPinArray(newPinArray)

    if (cleanDigit && index < PIN_LENGTH - 1) {
      inputRefs[index + 1].current.focus()
    }
    if (!cleanDigit && index > 0) {
      inputRefs[index - 1].current.focus()
    }
  }

  // On slot tap
  const focusInput = index => inputRefs[index].current.focus()

  const handleCreatePin = async () => {
    const pin = pinArray.join('')
    console.log('Creating PIN:', pin)
    try {
      await createPin({ token, pin }).unwrap()
      toast.show('PIN created successfully', { type: 'success' })
      navigation.goBack()
    } catch (err) {
        console.error('Error creating PIN:', err)
      toast.show('Failed to create PIN', { type: 'danger' })
    }
  }

  return (
    <ScreenWrapper>
      <AppHeader navigation={navigation} />
      {isLoading && <AppLoader message="Creating your PIN..." />}
      <View style={styles.container}>
        <Text style={styles.header}>Set Your PIN Code</Text>
        <Text style={styles.subHeader}>
          We use state-of-the-art security measures to protect your information at all times.
        </Text>
        <View style={styles.pinTouchArea}>
          <View style={styles.pinSlotsRow}>
            {[...Array(PIN_LENGTH)].map((_, i) => (
              <TouchableOpacity key={i} onPress={() => focusInput(i)} activeOpacity={0.8} style={styles.pinSlotContainer}>
                <TextInput
                  ref={inputRefs[i]}
                  style={styles.pinInputSlot}
                  value={pinArray[i]}
                  onChangeText={text => handleDigitChange(text, i)}
                  keyboardType="number-pad"
                  maxLength={1}
                  textAlign="center"
                  returnKeyType="done"
                  autoFocus={i === 0}
                  selectionColor={Colors.primary}
                  blurOnSubmit={false}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.createBtn,
            pinArray.every(d => d !== '') ? styles.createBtnActive : styles.createBtnDisabled,
          ]}
          disabled={!pinArray.every(d => d !== '')}
          onPress={handleCreatePin}
        >
          <Text style={styles.btnText}>Create A PIN</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  )
}

const PIN_SLOT_SIZE = 40

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 32, paddingHorizontal: 24, alignItems: 'center' },
  header: { fontSize: 22, fontFamily: 'Bold', color: '#241749', marginBottom: 8, alignSelf: 'flex-start' },
  subHeader: { fontSize: 13, color: '#888', marginBottom: 36, maxWidth: '90%', alignSelf: 'flex-start' },
  pinTouchArea: { width: '100%', alignItems: 'center', marginBottom: 36 },
  pinSlotsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 320,
  },
  pinSlotContainer: {
    flex: 1,
    alignItems: 'center',
  },
  pinInputSlot: {
    borderBottomWidth: 2,
    borderBottomColor: '#C1BADF',
    fontSize: 28,
    color: '#241749',
    fontFamily: 'SemiBold',
    height: PIN_SLOT_SIZE,
    width: PIN_SLOT_SIZE,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  createBtn: { width: '100%', height: 48, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  createBtnActive: { backgroundColor: Colors.primary, opacity: 1 },
  createBtnDisabled: { backgroundColor: Colors.primary, opacity: 0.3 },
  btnText: { fontSize: 15, color: '#fff', fontFamily: 'Bold' },
})

export default PinScreen
