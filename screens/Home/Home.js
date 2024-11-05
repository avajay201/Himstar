import React, { useState, useRef } from 'react';
import { View, Text, Dimensions, BackHandler, ToastAndroid, Animated, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import AppLogo from './../../assets/images/logo.png';
import Carousel from 'react-native-snap-carousel';


const Home = ({ navigation }) => {
  const [backPressedOnce, setBackPressedOnce] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnimation = useState(new Animated.Value(-300))[0];
  const [topics, setTopics] = useState(["Art", "Music", "Dance", "Literature", "Reading", "writing", "Coding", "travelling"]);
  const [banners, setBanners] = useState(["Banner 1", "Banner 2", "Banner 3"]);
  const carouselRef = useRef(null);

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

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
        <Icon name="menu" size={40} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
        <Image source={AppLogo} style={styles.profilePicture} />
      </TouchableOpacity>

      <Animated.View style={[styles.menu, { transform: [{ translateX: slideAnimation }] }]}>
        <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
          <Icon name={"close"} size={40} color="#000" />
        </TouchableOpacity>
        <View style={styles.menuContainer}>
          <Text style={styles.menuItem}>Option 1</Text>
          <Text style={styles.menuItem}>Option 2</Text>
          <Text style={styles.menuItem}>Option 3</Text>
          <Text style={styles.menuItem}>Option 4</Text>
        </View>
      </Animated.View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.topicsScroller}>
        {topics.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </ScrollView>

      <Carousel
        layout={"default"}
        ref={carouselRef}
        data={banners}
        renderItem={renderBanner}
        sliderWidth={400}
        itemWidth={350}
        layoutCardOffset={18}
        autoplay={true}
        autoplayInterval={1}
        loop={true}
      />

      <View style={styles.content}>
        <Text>Main Content Here</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    position: 'relative',
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
    backgroundColor: '#fff',
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
    padding: 15,
    fontSize: 18,
  },
  topicsScroller: {
    marginTop: 70,
    flexDirection: 'row',
  },
  tag: {
    backgroundColor: '#B94EA0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 30,
    marginHorizontal: 5,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagText: {
    color: '#fff',
    fontSize: 16,
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;
