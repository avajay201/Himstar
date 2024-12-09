import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
import { View, Text, BackHandler, ToastAndroid, Animated, TouchableOpacity, StyleSheet, Image, ScrollView, ActivityIndicator, Modal, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import AppLogo from './../../assets/images/logo.png';
import Carousel from 'react-native-snap-carousel';
import { getCategories, getBanners, getCompetitions, getTournaments } from '../../actions/ApiActions';
import { MainContext } from '../../others/MyContext';


const Home = ({ navigation }) => {
  const [backPressedOnce, setBackPressedOnce] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const slideAnimation = useState(new Animated.Value(-300))[0];
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const carouselRef = useRef(null);
  const [upcomingCompetitions, setUpcomingCompetitions] = useState([]);
  const [liveCompetitions, setLiveCompetitions] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { homeReload, setHomeReload } = useContext(MainContext);

  useEffect(()=>{
    if (homeReload){
      fetchAllData();
      setHomeReload(false);
    }
  }, [homeReload]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (slideAnimation) {
          Animated.timing(slideAnimation, {
            toValue: -300,
            duration: 300,
            useNativeDriver: true,
          }).start();
          setMenuVisible(false);
        }
      };
    }, [])
  );

  const fetchCategories = async () => {
    setCategories([]);
    const result = await getCategories(navigation);
    if (result[0] === 200) {
      setCategories(result[1]);
    }
  };

  const fetchBanners = async (bannerId = null) => {
    setBanners([]);
    const result = await getBanners(navigation, bannerId);
    console.log('Banners Data:', result);
    if (result[0] === 200) {
      setBanners(result[1].banners);
    }
  };

  const fetchCompetitions = async (bannerId = '') => {
    setLiveCompetitions([]);
    setTournaments([]);
    const result = await getCompetitions(navigation, bannerId);
    console.log('Comps Data:', result);
    if (result[0] === 200) {
      const liveComps = result[1].filter(comp => comp.is_live === true);
      setLiveCompetitions(liveComps);
      const upComingComps = result[1].filter(comp => comp.is_live === false);
      setUpcomingCompetitions(upComingComps);
    }
  };

  const fetchTournaments = async (bannerId = '') => {
    setTournaments([]);
    const result = await getTournaments(navigation, bannerId);
    if (result[0] === 200) {
      setTournaments(result[1]);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    await fetchCategories();
    await fetchBanners();
    await fetchCompetitions();
    await fetchTournaments();
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
  };

  const filterApply = async (id) => {
    setLoading(true);
    const selectedCategory = categories.find((category) => category.id === id);
    await fetchBanners(selectedCategory.isActive ? null : id);
    await fetchCompetitions(selectedCategory.isActive ? '' : id);
    await fetchTournaments(selectedCategory.isActive ? '' : id);
    const categoryUpdate = categories.map((category) =>
      category.id === id
        ? { ...category, isActive: !category.isActive }
        : { ...category, isActive: false }
    );
    setCategories(categoryUpdate);
    setLoading(false);
  };

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
      {item?.file_uri && <Image source={{ uri: item?.file_uri }} style={{ width: '100%', height: 170, borderRadius: 10 }} />}
    </View>
  );

  const viewCompetition = (comp) => {
    navigation.navigate('ViewComp', { competition: comp });
  };

  const renderCompetition = (competition) => (
    <TouchableOpacity onPress={() => viewCompetition(competition)} key={competition.id} style={styles.upcomingCompetitionItem}>
      {competition?.file_uri && <Image source={{ uri: competition?.file_uri }} style={styles.upcomingCompetitionImage} />}
      <View style={styles.upcomingCompetitionDetails}>
        <Text style={styles.upcomingCompetitionSlots}>{competition.remaining_slots}/{competition.max_participants} slots</Text>
        <Text style={styles.upcomingCompetitionDate}>{competition.is_active ? competition.registration_close_date : competition.registration_open_date}</Text>
      </View>
    </TouchableOpacity>
  );

  const navigateMenuOption = (option) => {
    toggleMenu();
    navigation.navigate(option);
  };

  return (
    <View style={styles.container}>
      {menuVisible && (
        <View style={styles.overlay} />
      )}
      <View style={styles.menuProfile}>
        <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
          <Icon name={"menu"} size={40} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
          <Image source={AppLogo} style={styles.profilePicture} />
        </TouchableOpacity>
      </View>
      <Animated.View style={[styles.menu, { transform: [{ translateX: slideAnimation }] }]}>
        <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
          <Icon name={menuVisible ? "close" : "menu"} size={40} color="#fff" />
        </TouchableOpacity>
        <View style={styles.menuContainer}>
          <TouchableOpacity onPress={() => navigateMenuOption('Wallet')}>
            <Text style={styles.menuItem}>My Wallet</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateMenuOption('Leaderboard')}>
            <Text style={styles.menuItem}>Leaderboard</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateMenuOption('PaymentDetails')}>
            <Text style={styles.menuItem}>Payment Details</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateMenuOption('MyCompetitions')}>
            <Text style={styles.menuItem}>My Contests</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateMenuOption('MyVideos')}>
            <Text style={styles.menuItem}>My Videos</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateMenuOption('ContactUs')}>
            <Text style={styles.menuItem}>Contact Us</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      <ScrollView scrollEnabled={menuVisible ? false : true} refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#B94EA0']} />
      }>
        {categories && categories.length > 0 && <View style={styles.filtersWrapper}>
          <Text style={styles.dataHeading}>Filters</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroller}>
            {categories.map((tag, index) => (
              <TouchableOpacity onPress={() => filterApply(tag.id)} key={tag.id} style={[styles.filterTag, { backgroundColor: tag.isActive ? '#B94EA0' : 'white' }]}>
                <Text style={[styles.filterTagText, { color: tag.isActive ? 'white' : '#B94EA0' }]}>{tag.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>}

        {!loading && banners.length === 0 && liveCompetitions.length === 0 && upcomingCompetitions.length === 0 && tournaments.length === 0 &&
          <View style={[styles.noData, { marginTop: categories.length === 0 && 400 }]}>
            <Text style={styles.noDataText}>No data!</Text>
          </View>
        }

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

        {liveCompetitions.length > 0 && <View style={styles.upcomingCompetitionsWrapper}>
          <View style={styles.upcomingCompHead}>
            <Text style={styles.dataHeading}>Live Competitions</Text>
            {liveCompetitions.length > 10 && <Text onPress={() => navigation.navigate('LiveComps')} style={styles.upcomingMoreCompetition}>See more...</Text>}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.upcomingCompetitionScroller}>
            {liveCompetitions.slice(0, 10).map(renderCompetition)}
          </ScrollView>
        </View>}

        {upcomingCompetitions.length > 0 && <View style={[styles.upcomingCompetitionsWrapper, { marginTop: 10 }]}>
          <View style={styles.upcomingCompHead}>
            <Text style={styles.dataHeading}>Upcoming Competitions</Text>
            {liveCompetitions.length > 10 && <Text onPress={() => navigation.navigate('UpcomingComps')} style={styles.upcomingMoreCompetition}>See more...</Text>}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.upcomingCompetitionScroller}>
            {upcomingCompetitions.slice(0, 10).map(renderCompetition)}
          </ScrollView>
        </View>}

        {tournaments.length > 0 && <View style={styles.tournamentsWrapper}>
          <Text style={styles.dataHeading}>Tournaments</Text>

          {tournaments.slice(0, 10).map((comp, index) => (
            <TouchableOpacity
              onPress={() => viewCompetition(comp)}
              key={index}
              style={styles.tournaments}
            >
              {comp.file_uri && (
                <View>
                  <Image source={{ uri: comp.file_uri }} style={styles.tournamentImage} />
                  <View style={styles.overlayDetails}>
                    <Text style={styles.tournamentNameText}>{comp.name}</Text>
                    <View style={styles.detailRow}>
                      <Text style={styles.overlayDetailText}>
                        Registration Start: {comp.registration_open_date}
                      </Text>
                      <Text style={styles.overlayDetailText}>
                        Registration End: {comp.registration_close_date}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.overlayDetailText}>
                        Total Slots: {comp.max_participants}
                      </Text>
                      <Text style={styles.overlayDetailText}>
                        Remaining Slots: {comp.remaining_slots}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))}

          {tournaments.length > 10 && <TouchableOpacity onPress={() => { navigation.navigate('ActiveComps') }} style={styles.activeCompsSeeMoreButton}>
            <Text style={styles.activeCompsSeeMoreButtonText}>See more...</Text>
          </TouchableOpacity>}
        </View>}
      </ScrollView>
      <Modal transparent={true} animationType="fade" visible={loading}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color='#B94EA0' />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: 70,
    left: '50%',
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
    pointerEvents: 'auto',
  },
  noData: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  noDataText: {
    color: 'black',
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
    borderRadius: 10,
    height: 170,
    justifyContent: 'center',
    alignItems: 'center',
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
  tournamentsWrapper: {
    paddingHorizontal: 20,
    marginTop: 15,
    paddingLeft: 25,
    paddingRight: 25,
    marginBottom: 20,
  },
  dataHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    paddingBottom: 8,
    paddingTop: 5,
  },
  tournaments: {
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
  tournamentImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  overlayDetails: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    // padding: 10,
  },
  tournamentNameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  overlayDetailText: {
    fontSize: 13,
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 5,
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});

export default Home;
