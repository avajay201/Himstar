import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Leaderboard = ({ navigation }) => {
  const leaderboardData = [
    { id: '1', rank: 1, name: 'John Doe', score: 1000 },
    { id: '2', rank: 2, name: 'Jane Smith', score: 950 },
    { id: '3', rank: 3, name: 'Jack Johnson', score: 900 },
    { id: '4', rank: 4, name: 'Alice Brown', score: 850 },
    { id: '5', rank: 5, name: 'Bob Davis', score: 800 },
  ];

  const renderLeaderboardItem = ({ item }) => (
    <View style={styles.leaderboardItem}>
      <Text style={styles.rank}>{item.rank}</Text>
      <Text style={styles.playerName}>{item.name}</Text>
      <Text style={styles.playerScore}>Score: {item.score}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Leaderboard</Text>
      </View>

      <FlatList
        data={leaderboardData}
        renderItem={renderLeaderboardItem}
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
    paddingVertical: 20,
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
  leaderboardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    width: 40,
  },
  playerName: {
    fontSize: 16,
    color: '#555',
    flex: 1,
  },
  playerScore: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
});

export default Leaderboard;
