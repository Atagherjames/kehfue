// StoreFormStepReview.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { useRecoilValue } from 'recoil';
import { storeFormState } from '../../recoil/StoreForm';

const StoreFormStepReview = ({ onPrevious, onSubmit }) => {
  const store = useRecoilValue(storeFormState);

  // Helper function to render a single document item
  const renderDocumentItem = (doc) => {
    if (doc?.name) {
      return (
        <View style={styles.documentItem}>
          <Feather name="file-text" size={20} color={Colors.primary} />
          <Text style={styles.documentText}>{doc.name}</Text>
          <Feather name="check-circle" size={16} color="green" />
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollViewContainer}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onPrevious} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={Colors.lightGrey} />
          </TouchableOpacity>
          
          {store.businessBanner?.uri && (
            <Image 
              source={{ uri: store.businessBanner.uri }} 
              style={styles.banner} 
            />
          )}
          
          {store.businessLogo?.uri && (
            <Image 
              source={{ uri: store.businessLogo.uri }} 
              style={styles.logo} 
            />
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.storeName}>{store.storeName}</Text>
          </View>
          
          <Text style={styles.description}>{store.description}</Text>
          
          {store.websiteURL && (
            <TouchableOpacity onPress={() => Linking.openURL(store.websiteURL)}>
              <Text style={styles.websiteLink}>{store.websiteURL}</Text>
            </TouchableOpacity>
          )}

          {/* General Information */}
          <Text style={styles.sectionTitle}>General Information</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>Category: {store.category}</Text>
            <Text style={styles.infoText}>Business Type: {store.businessRegistrationType}</Text>
            <Text style={styles.infoText}>Store Type: {store.storeType}</Text>
          </View>

          {/* Location Details */}
          <Text style={styles.sectionTitle}>Address</Text>
          <Text style={styles.addressText}>
           {store.city}, {store.state}, {store.country}
          </Text>

          {/* Compliance Documents */}
          <Text style={styles.sectionTitle}>Compliance Documents</Text>
          <View style={styles.infoCard}>
            {renderDocumentItem(store.CAC_StatusReport)}
            {renderDocumentItem(store.CertificateOfIncorporation)}
            {renderDocumentItem(store.ProofOfBusinessAddress)}
            {renderDocumentItem(store.TaxIdentificationDocument)}
            {(!store.CAC_StatusReport && !store.CertificateOfIncorporation && !store.ProofOfBusinessAddress && !store.TaxIdentificationDocument) && (
              <Text style={styles.infoText}>No compliance documents uploaded.</Text>
            )}
          </View>

        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  scrollViewContainer: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
    ...Platform.select({
      ios: {
        top: 0,
      },
    }),
  },
  banner: {
    width: '100%',
    height: 150,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#F5F6FA',
    marginTop: -50,
  },
  content: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  storeName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#364A63',
    textAlign: 'center',
    marginRight: 10,
  },
  description: {
    fontSize: 16,
    color: '#526484',
    textAlign: 'center',
    marginBottom: 15,
  },
  websiteLink: {
    fontSize: 14,
    color: '#6576FF',
    textAlign: 'center',
    marginBottom: 20,
    textDecorationLine: 'underline',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#364A63',
    marginTop: 20,
    marginBottom: 10,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  infoText: {
    fontSize: 14,
    color: '#526484',
    marginBottom: 5,
  },
  addressText: {
    fontSize: 14,
    color: '#526484',
    lineHeight: 20,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  documentText: {
    flex: 1,
    fontSize: 14,
    color: '#364A63',
    marginLeft: 10,
  },
  buttonContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E9F2',
  },
  createButton: {
    backgroundColor: '#6576FF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default StoreFormStepReview;