import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';

const MyContests = ({ navigation }) => {
  const contestsData = [
    { id: '1', name: 'Photography Contest', start_date: '2024-12-01', end_date: '2024-12-10' },
    { id: '2', name: 'Cooking Challenge', start_date: '2024-11-15', end_date: '2024-11-22' },
    { id: '3', name: 'Art Competition', start_date: '2024-11-01', end_date: '2024-11-05' },
  ];

  const renderContestItem = ({ item }) => (
    <View style={styles.contestItem}>
      <Text style={styles.contestName}>{item.name}</Text>
      <Text style={styles.dateText}>Start Date: {item.start_date}</Text>
      <Text style={styles.dateText}>End Date: {item.end_date}</Text>
      <TouchableOpacity style={styles.viewButton} onPress={() => null}>
        <Text style={styles.viewButtonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>My Contests</Text>
      </View>

      <FlatList
        data={contestsData}
        renderItem={renderContestItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  header: {
    backgroundColor: '#B94EA0',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 10,
    top: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  listContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: 10,
  },
  contestItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  contestName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  viewButton: {
    marginTop: 10,
    backgroundColor: '#B94EA0',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MyContests;
