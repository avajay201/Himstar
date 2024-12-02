import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const LeaderBoard = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.backgroundContainer}>
          <Image
            source={require('../../assets/images/Rectangle89.png')}
            style={styles.backgroundImage}
          />
        </View>

        <View style={styles.row}>
          <Image
            source={require('../../assets/images/Group16.png')}
            style={styles.image}
          />
          <Image
            source={require('../../assets/images/Group18.png')}
            style={styles.image}
          />
        </View>

        <View style={styles.row}>
          <Image
            source={require('../../assets/images/Group17.png')}
            style={styles.image}
          />
          <Image
            source={require('../../assets/images/Group19.png')}
            style={styles.image}
          />
          <Image
            source={require('../../assets/images/Group20.png')}
            style={styles.image}
          />
        </View>

        <View style={styles.profileCard}>
          <View style={styles.cardHeading}>
            <Text style={styles.cardHeadingText}>Winning Zone</Text>
            <Text style={styles.cardHeadingText}>Votes</Text>
            <Text style={styles.cardHeadingText}>Ranking</Text>
          </View>

          <View style={styles.profileContent}>
            <Image
              source={require('../../assets/images/Group22.png')}
              style={styles.cardIcon}
            />

            <Image
              source={require('../../assets/images/Ellipse6.png')}
              style={styles.profileImage}
            />
            <View style={styles.profileStatsRow}>
              <Text style={styles.profileStatValue}>10</Text>
              <Text style={styles.profileStatValue}>100</Text>
            </View>
          </View>
        </View>

        <Text style={styles.profileName2}>Riya Mehan</Text>
        <Text style={styles.profileDesignation}>Professional Dancer</Text>
        <View style={styles.separationLine} />
      </ScrollView>

      <View style={styles.secondBackgroundContainer}>
        <Image
          source={require('../../assets/images/Rectangle92.png')}
          style={styles.secondBackgroundImage}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    zIndex: -1,
  },
  backgroundImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  contentContainer: {
    flex: 1,
    marginTop: 0,
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  secondBackgroundContainer: {
    position: 'absolute',
    top: 300,
    left: 0,
    right: 0,
    zIndex: -2,
  },
  secondBackgroundImage: {
    width: '100%',
    height: 500,
    resizeMode: 'cover',
  },
  profileCard: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  cardHeadingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileName: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  profileDesignation: {
    fontSize: 14,
    color: '#777',
    textAlign: 'left',
    marginTop: 5, // Reduced the gap
    marginLeft: 50,
  },
  profileStatsRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  profileStatValue: {
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 5,
    marginLeft: '30',
  },
  profileName2: {
    marginLeft: 50,
    fontWeight: 'bold',
    marginTop: -20, // Reduced the gap from the top
  },
  separationLine: {
    height: 1,
    backgroundColor: '#ddd', // Light gray color
    marginVertical: 15, // Space above and below the line
  },

});

export default LeaderBoard;
