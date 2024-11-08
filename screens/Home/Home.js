import React, { useState, useRef } from 'react';
import { View, Text, BackHandler, ToastAndroid, Animated, TouchableOpacity, StyleSheet, Image, ScrollView, Button } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import AppLogo from './../../assets/images/logo.png';
import Carousel from 'react-native-snap-carousel';


const Home = ({ navigation }) => {
  const [backPressedOnce, setBackPressedOnce] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnimation = useState(new Animated.Value(-300))[0];
  const [filters, setFilters] = useState([
    { id: 1, name: 'Art', isActive: true },
    { id: 2, name: 'Music', isActive: false },
    { id: 3, name: 'Dance', isActive: true },
    { id: 4, name: 'Literature', isActive: false },
    { id: 5, name: 'Reading', isActive: true },
    { id: 6, name: 'Writing', isActive: false },
    { id: 7, name: 'Coding', isActive: true },
    { id: 8, name: 'Travelling', isActive: false },
  ]);
  const [banners, setBanners] = useState(["Banner 1", "Banner 2", "Banner 3"]);
  const carouselRef = useRef(null);
  const [competitions, setCompetitions] = useState([
    { id: 1, image: AppLogo, slots: 20, date: '02 Oct 2024' },
    { id: 2, image: AppLogo, slots: 15, date: '10 Nov 2024' },
    { id: 3, image: AppLogo, slots: 5, date: '04 Dec 2024' },
    { id: 4, image: AppLogo, slots: 25, date: '01 Jan 2025' },
    { id: 5, image: AppLogo, slots: 35, date: '10 Feb 2025' },
    { id: 6, image: AppLogo, slots: 100, date: '15 Oct 2024' },
    { id: 7, image: AppLogo, slots: 150, date: '20 Dec 2024' },
    { id: 8, image: AppLogo, slots: 10, date: '03 Dec 2024' },
    { id: 9, image: AppLogo, slots: 35, date: '25 Nov 2024' },
    { id: 10, image: AppLogo, slots: 40, date: '22 Oct 2024' },
  ]);
  const [activeCompetitions, setActiveCompetitions] = useState([
    { id: 1, name: 'Championship Clash', image: AppLogo, slots: 20, endDate: '02 Oct 2024', remainingSlots: 12 },
    { id: 2, name: 'Ultimate Showdown', image: AppLogo, slots: 15, endDate: '10 Nov 2024', remainingSlots: 10 },
    { id: 3, name: 'Rising Stars Contest', image: AppLogo, slots: 5, endDate: '04 Dec 2024', remainingSlots: 3 },
    { id: 4, name: 'Battle of Legends', image: AppLogo, slots: 25, endDate: '01 Jan 2025', remainingSlots: 20 },
    { id: 5, name: 'Elite Challenge', image: AppLogo, slots: 35, endDate: '10 Feb 2025', remainingSlots: 25 },
    { id: 6, name: 'Victory Quest', image: AppLogo, slots: 100, endDate: '15 Oct 2024', remainingSlots: 85 },
    { id: 7, name: 'Pro League Faceoff', image: AppLogo, slots: 150, endDate: '20 Dec 2024', remainingSlots: 20 },
    { id: 8, name: 'Skill Masters', image: AppLogo, slots: 10, endDate: '03 Dec 2024', remainingSlots: 7 },
    { id: 9, name: 'Champions Arena', image: AppLogo, slots: 35, endDate: '25 Nov 2024', remainingSlots: 2 },
    { id: 10, name: 'Legends Tournament', image: AppLogo, slots: 40, endDate: '22 Oct 2024', remainingSlots: 33 },
  ]);



  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        if (backPressedOnce) {
          BackHandler.exitApp();
          return true;
        }
        setBackPressedOnce(true);
        ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
        setTimeout(() => setBackPressedOnce(false), 2000);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );

      return () => backHandler.remove();
    }, [backPressedOnce])
  );

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    Animated.timing(slideAnimation, {
      toValue: menuVisible ? -300 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const renderBanner = ({ item }) => (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>{item}</Text>
    </View>
  );

  const filterApply = async (id) => {
    setFilters((prevFilters) =>
      prevFilters.map((filter) =>
        filter.id === id ? { ...filter, isActive: !filter.isActive } : filter
      )
    );
  };

  const renderCompetition = (competition) => (
    <View key={competition.id} style={styles.upcomingCompetitionItem}>
      <Image source={competition.image} style={styles.upcomingCompetitionImage} />
      <View style={styles.upcomingCompetitionDetails}>
        <Text style={styles.upcomingCompetitionSlots}>{competition.slots} slots</Text>
        <Text style={styles.upcomingCompetitionDate}>{competition.date}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.menuProfile}>
        <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
          <Icon name={menuVisible ? "close" : "menu"} size={40} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
          <Image source={AppLogo} style={styles.profilePicture} />
        </TouchableOpacity>
      </View>

      <ScrollView scrollEnabled={menuVisible ? false : true}>
        <Animated.View style={[styles.menu, { transform: [{ translateX: slideAnimation }] }]}>
          <View style={styles.menuContainer}>
            <Text style={styles.menuItem}>My Wallet</Text>
            <Text style={styles.menuItem}>LeaderBoard</Text>
            <Text style={styles.menuItem}>My Contests</Text>
            <Text style={styles.menuItem}>My Videos</Text>
            <Text style={styles.menuItem}>Contact Us</Text>
          </View>
        </Animated.View>

        <View style={styles.filtersWrapper}>
          <Text style={styles.filtersHeading}>Filters</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroller}>
            {filters.map((tag, index) => (
              <TouchableOpacity onPress={() => filterApply(tag.id)} key={tag.id} style={[styles.filterTag, { backgroundColor: tag.isActive ? '#B94EA0' : 'white' }]}>
                <Text style={[styles.filterTagText, { color: tag.isActive ? 'white' : '#B94EA0' }]}>{tag.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.crouselWrapper}>
          <Carousel
            layout={"default"}
            ref={carouselRef}
            data={banners}
            renderItem={renderBanner}
            sliderWidth={400}
            itemWidth={350}
            layoutCardOffset={18}
          />
        </View>

        <View style={styles.upcomingCompetitionsWrapper}>
          <View style={styles.upcomingCompHead}>
            <Text style={styles.upcomingCompetitionHeading}>Upcoming</Text>
            <Text onPress={() => navigation.navigate('UpcomingComps')} style={styles.upcomingMoreCompetition}>See more...</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.upcomingCompetitionScroller}>
            {competitions.map(renderCompetition)}
          </ScrollView>
        </View>

        <View style={styles.activeCompetitionWrapper}>
          <Text style={styles.activeCompetitionHeading}>Active Competitions</Text>

          {activeCompetitions.map((comp, index) => (
            <View key={index} style={styles.activeCompetitionItem}>
              <Image source={comp.image} style={styles.activeCompetitionImage} />
              <View style={styles.activeCompetitionName}>
                <Text style={styles.activeCompetitionNameText}>{comp.name}</Text>
              </View>
              <View style={styles.activeCompetitionDetails}>
                <View style={styles.activeCompetitionDetailsColumn}>
                  <View style={styles.activeCompetitionDetailsView}>
                    <Text style={styles.activeCompetitionDetailsLabel}>Slots:</Text>
                    <Text style={styles.activeCompetitionDetailsValue}>{comp.remainingSlots}/{comp.slots}</Text>
                  </View>
                  <View style={styles.activeCompetitionDetailsView}>
                    <Text style={styles.activeCompetitionDetailsLabel}>Ends on:</Text>
                    <Text style={styles.activeCompetitionDetailsValue}>{comp.endDate}</Text>
                  </View>
                </View>
                <View style={styles.activeCompetitionDetailsColumn}>
                  <View style={styles.activeCompetitionDetailsView}>
                    <Text style={styles.activeCompetitionDetailsLabel}>Slots:</Text>
                    <Text style={styles.activeCompetitionDetailsValue}>{comp.remainingSlots}/{comp.slots}</Text>
                  </View>
                  <View style={styles.activeCompetitionDetailsView}>
                    <Text style={styles.activeCompetitionDetailsLabel}>Ends on:</Text>
                    <Text style={styles.activeCompetitionDetailsValue}>{comp.endDate}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}

          <TouchableOpacity onPress={() => { navigation.navigate('ActiveComps') }} style={styles.activeCompsSeeMoreButton}>
            <Text style={styles.activeCompsSeeMoreButtonText}>See more...</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    position: 'relative',
  },
  menuProfile: {
    backgroundColor: '#B94EA0',
    zIndex: 1,
    width: '100%',
    height: 70,
    position: 'absolute'
  },
  menuButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  profileButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 75,
  },
  menu: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '50%',
    height: '100%',
    backgroundColor: '#B94EA0',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1,
  },
  menuContainer: {
    marginTop: 50,
  },
  menuItem: {
    color: '#fff',
    padding: 15,
    fontSize: 18,
  },
  filtersWrapper: {
    marginTop: 70,
    marginBottom: 30,
    paddingLeft: 25,
    paddingRight: 25,
  },
  filtersHeading: {
    fontSize: 18,
    padding: 8,
    color: '#000',
    fontWeight: 'bold',
  },
  filterScroller: {
    flexDirection: 'row',
  },
  filterTag: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 30,
    marginHorizontal: 5,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#B94EA0',
  },
  filterTagText: {
    fontSize: 16,
  },
  crouselWrapper: {
    marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  banner: {
    backgroundColor: '#B94EA0',
    borderRadius: 10,
    height: 170,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerText: {
    color: '#fff',
    fontSize: 18,
  },
  upcomingCompetitionsWrapper: {
    paddingLeft: 25,
    paddingRight: 25,
  },
  upcomingCompHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  upcomingCompetitionHeading: {
    fontSize: 18,
    padding: 8,
    color: '#000',
    fontWeight: 'bold',
  },
  upcomingMoreCompetition: {
    fontSize: 16,
    color: '#B94EA0',
  },
  upcomingCompetitionScroller: {
    flexDirection: 'row',
  },
  upcomingCompetitionItem: {
    width: 150,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  upcomingCompetitionImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  upcomingCompetitionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 5,
    paddingLeft: 3,
    paddingRight: 5,
  },
  upcomingCompetitionSlots: {
    fontSize: 12,
    color: '#B94EA0',
    fontWeight: 'bold',
  },
  upcomingCompetitionDate: {
    fontSize: 12,
    color: '#B94EA0',
  },
  activeCompetitionWrapper: {
    paddingHorizontal: 20,
    marginTop: 15,
    paddingLeft: 25,
    paddingRight: 25,
    marginBottom: 20,
  },
  activeCompetitionHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    padding: 8,
  },
  activeCompetitionItem: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  activeCompetitionImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  activeCompetitionName: {
    padding: 5,
    alignItems: 'center'
  },
  activeCompetitionNameText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  activeCompetitionDetails: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 50,
  },
  activeCompetitionDetailsColumn: {
    flex: 1,
    flexDirection: 'column',
  },
  activeCompetitionDetailsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  activeCompetitionDetailsLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    marginRight: 5,
  },
  activeCompetitionDetailsValue: {
    fontSize: 13,
    color: '#333',
  },
  activeCompsSeeMoreButton: {
    marginTop: 10,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#B94EA0',
    borderRadius: 5,
  },
  activeCompsSeeMoreButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Home;
