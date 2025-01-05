import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, RefreshControl, Modal, ActivityIndicator, Image } from "react-native";
import { myCompetitions } from "../../actions/ApiActions";
import { BASE_URL } from "../../actions/APIs";


const MyCompetitions = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [competitions, setCompetitions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCompetitions = async()=>{
    setLoading(true);
    setRefreshing(true);
    const result = await myCompetitions();
    if (result[0] === 200){
      setCompetitions(result[1]);
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(()=>{
    fetchCompetitions();
  }, []);

  const viewCompetition = (comp) => {
    navigation.navigate('ViewComp', { compId: comp.id, compType: comp.competition_type });
  };

  const renderCompetitions = ({ item: comp }) => (
    <TouchableOpacity
      onPress={() => (!comp.is_close ? viewCompetition(comp) : null)} // Disable press for inactive competitions
      style={[styles.competitions, !comp.is_active && styles.inactiveCompetition]} // Add inactive style
      activeOpacity={comp.is_active ? 0.7 : 1} // Change opacity based on active status
    >
      {/* {comp.file_uri && ( */}
        <View>
          <Image
            source={{ uri: comp?.banner_image && comp?.banner_image?.includes('media') ? BASE_URL + comp?.banner_image : comp?.file_uri }}
            style={[
              styles.competitionImage,
              !comp.is_active && styles.inactiveCompetitionImage, // Dimmed image for inactive
            ]}
          />
          <View style={styles.overlayDetails}>
            <Text style={styles.competitionsNameText}>{comp.name}</Text>
            <View style={styles.detailRow}>
              <Text style={styles.overlayDetailText}>
                Registration Start: {comp.registration_start_date}
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
            {comp.is_close && (
              <View style={styles.inactiveOverlay}>
                <Text style={styles.inactiveText}>Closed</Text>
              </View>
            )}
          </View>
        </View>
      {/* )} */}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <Text style={styles.headingText}>My Competitions</Text>
      </View>
      <FlatList
        data={competitions}
        renderItem={renderCompetitions}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
              refreshing={refreshing}
              onRefresh={fetchCompetitions}
              colors={['#9Bd35A', '#689F38']}
          />
        }
      />
      <Modal transparent={true} animationType="fade" visible={loading}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color='#B94EA0' />
        </View>
      </Modal>
    </View>
  );
};

export default MyCompetitions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  inactiveCompetition: {
    opacity: 0.5, // Dim the entire competition card
  },
  inactiveCompetitionImage: {
    opacity: 0.5, // Dim the image specifically
  },
  inactiveOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark overlay
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactiveText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headingContainer: {
    padding: 15,
    backgroundColor: "#B94EA0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  headingText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  listContainer: {
    padding: 10,
  },
  competitions: {
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
  competitionImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  overlayDetails: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
  },
  competitionsNameText: {
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});
