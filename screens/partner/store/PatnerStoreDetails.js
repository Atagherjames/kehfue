import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import moment from 'moment';
import { Colors } from '../../../constants/colors';

const StoreDetailsScreen = ({ route }) => {
  const { store } = route.params;
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollViewContainer}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={Colors.lightGrey} />
          </TouchableOpacity>
          <Image 
            source={{ uri: store.businessBanner?.downloadUrl }} 
            style={styles.banner} 
          />
          <Image 
            source={{ uri: store.businessLogo?.downloadUrl }} 
            style={styles.logo} 
          />
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
            {store.timeZoneSetup && (
              <Text style={styles.infoText}>Time Zone: {store.timeZoneSetup.timeZone}</Text>
            )}
          </View>

          {/* Location Details */}
          <Text style={styles.sectionTitle}>Address</Text>
          <Text style={styles.addressText}>
            {store.streetAddress}, {store.city}, {store.state}, {store.country}
          </Text>
          
          {/* Compliance Documents */}
          <Text style={styles.sectionTitle}>Compliance Documents</Text>
          <View style={styles.documentList}>
            {store.storeCompliance && Object.keys(store.storeCompliance).map((key) => {
              const document = store.storeCompliance[key];
              if (!document || !document.downloadUrl) return null;

              const readableKey = key.replace(/([A-Z])/g, ' $1').trim();

              return (
                <TouchableOpacity
                  key={key}
                  style={styles.documentItem}
                  onPress={() => Linking.openURL(document.downloadUrl)}
                >
                  <Text style={styles.documentName}>{readableKey}</Text>
                  <Text style={styles.downloadLink}>Download</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Store History */}
          <Text style={styles.sectionTitle}>Store History</Text>
          <Text style={styles.historyText}>
            Created on: {moment(store.createdAt).format('LLLL')}
          </Text>
          <Text style={styles.historyText}>
            Last updated: {moment(store.updatedAt).format('LLLL')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
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
  documentList: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  documentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E9F2',
  },
  documentName: {
    fontSize: 14,
    color: '#364A63',
    fontWeight: '500',
  },
  downloadLink: {
    fontSize: 14,
    color: '#6576FF',
  },
  historyText: {
    fontSize: 12,
    color: '#8091A7',
    marginBottom: 5,
  },
});

export default StoreDetailsScreen;