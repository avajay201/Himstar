import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ToastAndroid, Modal, ActivityIndicator, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getLeaderBoard } from '../../actions/ApiActions';

const LeaderBoard = ({ route, navigation }) => {
  const { compId } = route.params;
  const [leaderBoardData, setLeaderBoardData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const data = [
    { id: 1, username: 'Riya Mehan', profile_picture: require('../../assets/images/logo.png'), likes: 350 },
    { id: 2, username: 'Arjun Kapoor', profile_picture: require('../../assets/images/logo.png'), likes: 320 },
    { id: 3, username: 'Sneha Gupta', profile_picture: require('../../assets/images/logo.png'), likes: 300 },
    { id: 4, username: 'Rahul Sharma', profile_picture: require('../../assets/images/logo.png'), likes: 280 },
    { id: 5, username: 'Priya Singh', profile_picture: require('../../assets/images/logo.png'), likes: 260 },
    { id: 6, username: 'Aman Verma', profile_picture: require('../../assets/images/logo.png'), likes: 240 },
    { id: 7, username: 'Meera Jain', profile_picture: require('../../assets/images/logo.png'), likes: 220 },
    { id: 8, username: 'Kabir Rathore', profile_picture: require('../../assets/images/logo.png'), likes: 200 },
    { id: 9, username: 'Ananya Rao', profile_picture: require('../../assets/images/logo.png'), likes: 180 },
    { id: 10, username: 'Rohan Malik', profile_picture: require('../../assets/images/logo.png'), likes: 160 },
    { id: 11, username: 'Simran Kaur', profile_picture: require('../../assets/images/logo.png'), likes: 140 },
    { id: 12, username: 'Aditya Tiwari', profile_picture: require('../../assets/images/logo.png'), likes: 120 },
    { id: 13, username: 'Isha Patel', profile_picture: require('../../assets/images/logo.png'), likes: 100 },
    { id: 14, username: 'Kunal Thakur', profile_picture: require('../../assets/images/logo.png'), likes: 90 },
    { id: 15, username: 'Nisha Pandey', profile_picture: require('../../assets/images/logo.png'), likes: 85 },
    { id: 16, username: 'Aryan Joshi', profile_picture: require('../../assets/images/logo.png'), likes: 80 },
    { id: 17, username: 'Tanya Shah', profile_picture: require('../../assets/images/logo.png'), likes: 75 },
    { id: 18, username: 'Vikram Sethi', profile_picture: require('../../assets/images/logo.png'), likes: 70 },
    { id: 19, username: 'Nidhi Desai', profile_picture: require('../../assets/images/logo.png'), likes: 65 },
    { id: 20, username: 'Akash Mehta', profile_picture: require('../../assets/images/logo.png'), likes: 60 },
    { id: 21, username: 'Pooja Bansal', profile_picture: require('../../assets/images/logo.png'), likes: 55 },
    { id: 22, username: 'Rajesh Iyer', profile_picture: require('../../assets/images/logo.png'), likes: 50 },
    { id: 23, username: 'Krishna Chawla', profile_picture: require('../../assets/images/logo.png'), likes: 45 },
    { id: 24, username: 'Manisha Roy', profile_picture: require('../../assets/images/logo.png'), likes: 40 },
    { id: 25, username: 'Gaurav Saxena', profile_picture: require('../../assets/images/logo.png'), likes: 35 }
];

  

  useEffect(() => {
    console.log(compId, 'LeaderBoard Data:', leaderBoardData);
  }, [leaderBoardData]);

  const fetchLeaderBoard = async () => {
    const result = await getLeaderBoard(navigation, compId);
    if (result[0] === 200) {
      setLeaderBoardData(result[1]);
    } else {
      ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
      navigation.goBack();
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaderBoard();
  }, []);

  const renderTopUser = ({ item, index }) => (
    <View style={[styles.topUserCard, index === 0 ? styles.firstPlace : {}]}>
      <Text style={styles.topUserId}>{item.id}</Text>
      <Image source={item.profile_picture} style={styles.topUserImage} />
      <Text style={styles.topUserName}>{item.username}</Text>
      <Text style={styles.topUserVotes}>{item.likes} Votes</Text>
    </View>
  );

  const renderUser = ({ item }) => (
    <View style={styles.userCard}>
      <Text style={styles.userIndex}>{item.id}.</Text>
      <Image source={item.profile_picture} style={styles.userImage} />
      <Text style={styles.userName}>{item.username}</Text>
      <Text style={styles.userVotes}>{item.likes} Votes</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.heading}>LeaderBoard</Text>

        <FlatList
          data={data.slice(0, 5)}
          renderItem={renderTopUser}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          contentContainerStyle={styles.topUsersList}
        />

        <FlatList
          data={data.slice(5, data.length)}
          renderItem={renderUser}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.leaderboardList}
        />
      </ScrollView>

      <Modal transparent={true} animationType="fade" visible={loading}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#B94EA0" />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButtonContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
  },
  backButton: {
    padding: 10,
  },
  contentContainer: {
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  topUsersList: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  topUserCard: {
    alignItems: 'center',
    marginHorizontal: 10,
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  firstPlace: {
    backgroundColor: '#ffd700',
  },
  topUserId: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    position: 'absolute',
    zIndex: 1,
    left: 10,
  },
  topUserImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  topUserName: {
    marginTop: 5,
    fontWeight: 'bold',
  },
  topUserVotes: {
    fontSize: 12,
    color: '#555',
  },
  leaderboardList: {
    marginTop: 20,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
    borderRadius: 8,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  userIndex: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    color: '#333',
  },
  userName: {
    flex: 1,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  userVotes: {
    fontSize: 14,
    color: '#777',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});

export default LeaderBoard;
