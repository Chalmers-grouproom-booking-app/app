import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Animated, Button, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SearchBar } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import useDebounce from './useDebounce';
import useRoomSearch from './useRoomSearch';
import type { RoomInfo, RoomInfoV2, TimeSlot } from '../../constants/types';
import { useLocalSearchParams, router } from 'expo-router';
import SearchNotFoundSVG from './SearchNotFound';
import StartSearchSVG from './StartSearch';
import Icon from 'react-native-vector-icons/Ionicons';
import MarkerButton from './MarkerButton';
import ReservationComponent from '../ReservationComponent';
import { Badge } from '@rneui/themed';
import { Drawer } from 'react-native-drawer-layout';
import FilterPanel from '../FilterComponent';
import useFilter from '../FilterComponent/useFilter';

const ITEMS_PER_PAGE = 15;

const SearchDrawer = () => {
  const [visible, setVisible] = useState(false);
  const { filterData, setFilterData, filterDataHasActiveFilters } = useFilter();

  return (
      <Drawer
        open={visible}
        onOpen={() => setVisible(true)}
        onClose={ () => setVisible(false)}
        renderDrawerContent={() => {
          return (
            <FilterPanel handleFilterData={setFilterData} filterData={filterData} />
          );
        }}
        drawerPosition='right'
        drawerType='front'
        drawerStyle={{ width : '73%'}}
        overlayStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      >
      <Search toggleFilter={() => setVisible(!visible)} filterDataHasActiveFilters={filterDataHasActiveFilters}  filterData={filterData} />
    </Drawer>
  );

};

const Search = ({ toggleFilter, filterDataHasActiveFilters, filterData }) => {
  const { building } = useLocalSearchParams() as { building: string };
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();
  const { searchResult, error, loading, setLoading, searchRooms } = useRoomSearch();
  const debouncedSearch = useDebounce(searchText, 300); 

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(ITEMS_PER_PAGE);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = searchResult ? searchResult.slice(indexOfFirstItem, indexOfLastItem) : [];
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomInfo | null>(null);
  const [forceCollapse, setForceCollapse] = useState(false);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    setForceCollapse(true);
  }

  useEffect(() => {
    if (forceCollapse) {
      // Reset forceCollapse after it has been propagated to children
      setForceCollapse(false);
    }
  }, [forceCollapse]);
  
  // if building is passed in params, search for rooms in that building
  useEffect(() => {
    if (building) {
      // clear  searchText and result before searching
      setSearchText('');
      setSearchText(building);
    }
  }, [building]);

  // Search room whenever debouncedSearch changes
  useEffect(() => {
    if (debouncedSearch || filterDataHasActiveFilters(filterData)) {
      searchRooms(debouncedSearch, filterData);
    }
  }, [debouncedSearch, filterData]);

  const handleSearchChange = (text) => {
    setLoading(true);
    if (text.length === 0 && searchText.length > 0) {
      setLoading(false);
    }
    setSearchText(text);
    paginate(1);
  };

  const handleBack = () => {
    navigation.goBack();
  };


  return (
    <>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TouchableOpacity onPress={handleBack} style={styles.button}>
            <Ionicons name="arrow-back" size={26} color="gray" />
          </TouchableOpacity>
          <SearchBar
            placeholder="Search..."
            value={searchText}
            onChangeText={handleSearchChange}
            round
            lightTheme
            containerStyle={styles.searchBarContainer}
            inputContainerStyle={styles.searchInputContainer}
          />
          <TouchableOpacity onPress={toggleFilter} style={styles.button}>
            <Ionicons name="filter" size={26} color="gray" />
          </TouchableOpacity>
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
        {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 50 }} />
        ) : (searchText || filterDataHasActiveFilters(filterData)) && searchResult?.length > 0 ? (
          <>
            <ScrollView style={styles.resultContainer}>
              {currentItems.map((item, index) => (
                <RoomItem
                  key={index}
                  item={item}
                  openModal={(room) => { setSelectedRoom(room); setShowModal(true) }}
                  forceCollapse={forceCollapse}
                />
              ))}
            </ScrollView>
            <View style={styles.paginationContainer}>
              <Pressable onPress={() => paginate(currentPage - 1)} disabled={currentPage === 1} style={styles.button}>
                <Ionicons name="arrow-back-outline" size={18} color={currentPage === 1 ? 'gray' : 'black'}  style={{ marginRight: 5 }} />
                <Text style={{ color: currentPage === 1 ? 'gray' : 'black' }}>Prev</Text>
              </Pressable>
              <Text>{currentPage}</Text>

              <Pressable onPress={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(searchResult.length / itemsPerPage)} style={styles.button}>
                <Text style={{ color: currentPage === Math.ceil(searchResult.length / itemsPerPage) ? 'gray' : 'black' }}>Next</Text>
                <Ionicons name="arrow-forward-outline" size={18} color={currentPage === Math.ceil(searchResult.length / itemsPerPage) ? 'gray' : 'black'} style={{ marginLeft: 5 }} />
              </Pressable>
            </View>
          </>
        ) : null}
        {searchText && !searchResult?.length && !loading && (
          <View>
            <View style={styles.noResultsContainer}>
              <SearchNotFoundSVG width={64} height={64} />
              <Text style={styles.noResultsText}>No rooms found.</Text>
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
            {loading ? (
              <ActivityIndicator size="large" style={{ marginTop: 50 }} color="#007bff" />
            ) : searchText && searchResult?.length > 0 ? (
              <ScrollView style={styles.resultContainer}>
                {searchResult.map((item, index) => (
                  <RoomItem key={index} item={item} openModal={(room) => { setSelectedRoom(room); setShowModal(true) }} forceCollapse={forceCollapse} />
                ))}
              </ScrollView>
            ) : null}
          </View>
        )}

        {searchText && !searchResult?.length && !loading && (
          <View style={styles.noResultsContainer}>
            <SearchNotFoundSVG width={64} height={64} />
            <Text style={styles.noResultsText}>No rooms found.</Text>
          </View>
        )}

        {!searchText && (
          <View style={styles.noResultsContainer}>
            <StartSearchSVG width={64} height={64} />
            <Text style={styles.noResultsText}>Search for rooms by name, building, or campus.</Text>
          </View>
        )}
      </View>
      <ReservationComponent room_info={selectedRoom} openModal={showModal} closeCallback={() => setShowModal(false)} />
    </>
  );
};

const RoomItem = ({ item, openModal, forceCollapse }: { item: RoomInfoV2  , openModal: (room: RoomInfoV2) => void, forceCollapse: boolean}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [reservationResult, setReservationResult] = useState<TimeSlot[] | null>(null);
  const [loadingReservations, setLoadingReservations] = useState(false);
  const scaleAnimation = useRef(new Animated.Value(1)).current;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded && !reservationResult) { // Fetch reservations only if not already fetched
      fetchReservations(item.room_name);
    }
  };

  useEffect(() => {
    if (forceCollapse) {
      setIsExpanded(false);
    }
  }, [forceCollapse]);

  const fetchReservations = async (roomName) => {
    setLoadingReservations(true);
    try {
      const response = await fetch(`https://strawhats.info/api/v1/room/reservation?input=${encodeURIComponent(roomName)}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      if (!response.ok) {
        setReservationResult([]);
        return;
      }

      const json = await response.json();
      setReservationResult(json as TimeSlot[]);
    } catch (error) {
      console.error('Failed to fetch reservations:', error);
      setReservationResult([]); // Handle error by setting empty result
    }
    finally {
      setLoadingReservations(false);
    }
  };


  const convertStringToDate = (dateString: string) => {
    const [year, month, day] = dateString.split('/').map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  }
  const getRelativeDate = (dateString: string) => {
    const stockholmOffset = 60; // Stockholm is UTC+1, or +60 minutes
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    today.setMinutes(today.getMinutes() + stockholmOffset); // Adjust for Stockholm time zone

    const reservationDate = new Date(dateString);
    const reservationStart = new Date(reservationDate.getFullYear(), reservationDate.getMonth(), reservationDate.getDate());
    reservationStart.setMinutes(reservationStart.getMinutes() + stockholmOffset); // Adjust for Stockholm time zone

    const timeDiff = Number(reservationStart) - Number(today);
    const dayDiff = Math.round(timeDiff / (1000 * 3600 * 24)); // Round to handle edge cases around midnight

    if (dayDiff === 0) {
      return 'Today';
    } else if (dayDiff === 1) {
      return 'Tomorrow';
    } else if (dayDiff > -1 && dayDiff < 6) {
      // Use the original date object to get the weekday in local language settings
      return reservationDate.toLocaleDateString('en-US', { weekday: 'long' });
    } else {
      // Use the original date object for formatting date in local language settings
      return reservationDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };



  const animatePressIn = () => {
    Animated.spring(scaleAnimation, {
      toValue: 0.95,  // Slightly scale down to 0.95
      useNativeDriver: true
    }).start();
  };

  const animatePressOut = () => {
    Animated.spring(scaleAnimation, {
      toValue: 1,  // Scale back to original size
      friction: 3,  // Controls "bounciness"/overshoot
      tension: 60,  // Controls speed
      useNativeDriver: true
    }).start();
  };

  const navigateToMap = (latitude, longitude, room_name) => {
    router.replace({
      pathname: "map",
      params: {
        room_name,
        latitude,
        longitude
      }
    });
  };

  return (
    <TouchableOpacity onPress={toggleExpand} style={styles.itemContainer} activeOpacity={1}>
      <View style={isExpanded ? styles.iteamHeaderExpanded : styles.itemHeader}>
        <View style={styles.itemHeaderLeft}>
          <Text style={isExpanded ? styles.resultTextExpanded : styles.resultText}>{item.room_name}</Text>
          <Badge 
            status={item.status === 'available' ? 'success' : item.status === 'occupied' ? 'error' : 'warning'} 
            value={item.status === 'available' ? 'Available' : item.status === 'occupied' ? 'Occupied' : 'Occupied Soon'}
            badgeStyle={styles.badgeStyle}
           />
        </View>
        {
          item.first_come_first_served && (
            <Text style={styles.fcfText}>First come first served</Text>
          )
        }
      </View>
      {isExpanded && (
        <View style={styles.roomDetails}>
          <Text style={styles.detailText}>Size: {item.room_size} seats</Text>
          {(item.equipment && item.equipment.length > 0 && item.equipment[0] !== '-') && (
            <Text style={styles.detailText}>Equipment: {item.equipment}</Text>
          )}
          <Text style={styles.detailText}>Floor: {item.floor_level}</Text>
          <Text style={styles.detailText}>Building: {item.building}</Text>
          <Text style={styles.detailText}>Campus: {item.campus}</Text>
          {
            item.first_come_first_served !== true && (
              <View style={styles.reservationContainer}>
                {loadingReservations ? (
                  <ActivityIndicator size="small" color="#0000ff" />
                ) : reservationResult?.length > 0 ? (
                  <>
                    <Text style={styles.reservationTitle}>Reservations:</Text>
                    {Object.entries(reservationResult.reduce((acc, res) => {
                      const dateKey = convertStringToDate(res.start_date).toISOString().slice(0, 10); // Create a unique key per date
                      if (!acc[dateKey]) {
                        acc[dateKey] = [];
                      }
                      acc[dateKey].push(res);
                      return acc;
                    }, {})).sort(([dateA], [dateB]) => {
                      // Convert date strings to Date objects and then to Unix time for comparison
                      const dateATime = new Date(dateA).getTime();
                      const dateBTime = new Date(dateB).getTime();
                      return dateATime - dateBTime; // Sort by closest date first
                    }).map(([date, reservations]) => (
                      <View key={date} style={styles.reservationItem}>
                        <Text style={styles.reservationDate}>{getRelativeDate(date)}</Text>
                        {(reservations as TimeSlot[])
                          .sort((a, b) => {
                            // Sort reservations within each date group by start time
                            if (a.start_time < b.start_time) return -1;
                            if (a.start_time > b.start_time) return 1;
                            return 0;
                          })
                          .map((res, idx) => (
                            <Text key={idx} style={styles.reservationText}>
                              {res.start_time} - {res.end_time}
                            </Text>
                          ))}
                      </View>
                    ))}
                  </>
                ) : (
                  <Text style={styles.noReservationText}>No reservations found</Text>
                )}
              </View>
            )
          }
          {
            !item.first_come_first_served && (
              <>
                <MarkerButton
                  scaleAnimation={scaleAnimation}
                  onPress={() => navigateToMap(item.latitude, item.longitude, item.room_name)}
                  onPressIn={animatePressIn}
                  onPressOut={animatePressOut}
                  custom_style={styles.iconContainer}
                >
                  <Icon name="location-sharp" size={26} color="#007bff" accessibilityLabel="Marker Button" />
                </MarkerButton>
                <MarkerButton
                  scaleAnimation={scaleAnimation}
                  onPress={() => openModal(item)}
                  onPressIn={animatePressIn}
                  onPressOut={animatePressOut}
                  custom_style={styles.makeReservationButton}
                >
                  <Icon name="calendar-sharp" size={26} color="#007bff" accessibilityLabel="Make Reservation Button" />
                </MarkerButton>
              </>
            )
          }
        </View>
      )
      }
    </TouchableOpacity >
  );
};


export default SearchDrawer;