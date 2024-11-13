import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import AppLogo from './../../assets/images/logo.png';


const MyVideos = ({ navigation }) => {
  const videosData = [
    { id: '1', title: 'Photography Contest Video', thumbnail: AppLogo, contest: 'Photography Contest' },
    { id: '2', title: 'Cooking Challenge Video', thumbnail: AppLogo, contest: 'Cooking Challenge' },
    { id: '3', title: 'Art Competition Video', thumbnail: AppLogo, contest: 'Art Competition' },
  ];

  const renderVideoItem = ({ item }) => (
    <View style={styles.videoItem}>
      <Image source={item.thumbnail} style={styles.thumbnail} />
      <View style={styles.videoDetails}>
        <Text style={styles.videoTitle}>{item.title}</Text>
        <Text style={styles.contestName}>Contest: {item.contest}</Text>
        <TouchableOpacity style={styles.viewButton} onPress={() => null}>
          <Text style={styles.viewButtonText}>View Video</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>My Videos</Text>
      </View>

      <FlatList
        data={videosData}
        renderItem={renderVideoItem}
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
  videoItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 20,
  },
  videoDetails: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  contestName: {
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

export default MyVideos;
