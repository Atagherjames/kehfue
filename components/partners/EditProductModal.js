import React from 'react'
import AppBottomModal from '../AppBottomModal'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Colors } from '../../constants/colors'

const EditProductModal = ({
    visible, setVisible
}) => {
  return (
    <AppBottomModal
        visible={visible}
        onClose={() => {setVisible(false)}}
    >
        <View>
            <Text style={styles.headerText}>Edit Product</Text>
        </View>
    </AppBottomModal>
  )
}

export default EditProductModal

const styles = StyleSheet.create({
    headerText: {
        textAlign: "center",
        fontFamily: "SemiBold",
        color:Colors.labelColor,
        fontSize: 18
    }
})