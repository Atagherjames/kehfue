import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useRecoilState } from "recoil";
import { storeFormState } from "../../recoil/StoreForm";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; 

const StoreFormStepThree = ({ teamMembers, navigation }) => {
  const [form, setForm] = useRecoilState(storeFormState);
  const isSelected = (id: any) =>
    form.teamMembers?.some((member) => member.id === id);

  const toggleSelect = (member: any) => {
    const exists = isSelected(member.id);
    const updatedList = exists
      ? form.teamMembers.filter((m) => m.id !== member.id)
      : [...(form.teamMembers || []), member];

    setForm({ ...form, teamMembers: updatedList });
  };

  const renderAvatar = (member) => {
    if (member.avatar) {
      return <Image source={{ uri: member.avatar }} style={styles.avatar} />;
    }
    const initials = member.fullName
      .split(" ")
      .map((n: any) => n[0])
      .join("")
      .toUpperCase();
    return (
      <View style={styles.initialAvatar}>
        <Text style={styles.initials}>{initials}</Text>
      </View>
    );
  };

  const renderItem = (item) => {
    const selected = isSelected(item.id);
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.card}
        onPress={() => toggleSelect(item)}
      >
        <View style={styles.checkbox}>
          {selected ? (
            <Ionicons name="checkbox" size={20} color="#28005B" />
          ) : (
            <Ionicons name="square-outline" size={20} color="#C4C4C4" />
          )}
        </View>
        {renderAvatar(item)}
        <View style={styles.info}>
          <Text style={styles.name}>{item.fullName}</Text>
          <Text style={styles.role}>{item.role}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handleCreateMemberPress = () => {
    navigation.navigate("TeamMembers"); 
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.teamHeaderContainer}>
      <Text style={styles.sectionTitle}>Team Members</Text>
        <TouchableOpacity onPress={handleCreateMemberPress}>
              <Text style={styles.linkText}>Create a team member</Text>
            </TouchableOpacity>
            </View>
      <View>
        {teamMembers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              You don’t have any team members yet.
            </Text>
            <TouchableOpacity onPress={handleCreateMemberPress}>
              <Text style={styles.linkText}>Create a team member</Text>
            </TouchableOpacity>
          </View>
        ) : (
          teamMembers.map(renderItem)
        )}
      </View>
    </ScrollView>
  );
};

export default StoreFormStepThree;

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 0,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#364A63",
    marginBottom: 20,
  },
  teamHeaderContainer:{
display:'flex',
flexDirection:'row',
justifyContent:'space-between'
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 4,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DBDFEA",
    width: "100%",
  },
  checkbox: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  initialAvatar: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#E5E9F2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  initials: {
    fontWeight: "700",
    color: "#364A63",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: "700",
    color: "#364A63",
  },
  role: {
    fontSize: 12,
    fontWeight: "400",
    color: "#8091A7",
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 15,
  },
  emptyText: {
    fontSize: 14,
    color: "#8091A7",
    textAlign: "center",
    fontStyle: "italic",
  },
  linkText: {
    color: '#28005B',
    fontWeight: '600',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});