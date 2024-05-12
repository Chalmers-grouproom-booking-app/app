import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Button  } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SearchBar } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import useDebounce from './useDebounce';
import useRoomSearch from './useRoomSearch';
import { useLocalSearchParams } from 'expo-router';
import SearchNotFoundSVG from './SearchNotFound';
import StartSearchSVG from './StartSearch';
import ReservationComponent from '../ReservationComponent';
import useReservations from '../ReservationComponent/useReservations';
import { Drawer } from 'react-native-drawer-layout';
import FilterPanel from '../FilterComponent';
import useFilter  from '../FilterComponent/useFilter';
import RoomItem from './RoomItem';
import { FlatList } from 'react-native';

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
  const ITEMS_PER_PAGE = 13;  // Set items per page
  const { building } = useLocalSearchParams() as { building: string };
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();
  const { searchResult, error, loading, setLoading, searchRooms } = useRoomSearch();
  const { showModal, selectedRoom, openModal, closeModal} = useReservations();
  const debouncedSearch = useDebounce(searchText, 300);

  const [currentPage, setCurrentPage] = useState(1);
  const totalPageCount = Math.ceil(searchResult?.length / ITEMS_PER_PAGE);

  const paginate = (pageNumber) => {
    setCurrentPage(Math.max(1, Math.min(pageNumber, totalPageCount)));
  };

 useEffect(() => {
  console.log(filterData);
 }, [filterData]); 

  useEffect(() => {
    if (building) {
      setSearchText(building);
    }
  }, [building]);

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
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const renderPaginationControls = () => (
    <View style={styles.paginationContainer}>
      <Button title="Prev" onPress={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
      <Text>{`${currentPage} of ${totalPageCount}`}</Text>
      <Button title="Next" onPress={() => paginate(currentPage + 1)} disabled={currentPage === totalPageCount} />
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
    } else if (searchText && searchResult?.length > 0) {
      return (
        <FlatList
          data={searchResult.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item, index }) => <RoomItem key={index} item={item} openModal={openModal} />}
          contentContainerStyle={styles.resultContainer}
          ListFooterComponent={renderPaginationControls}
        />
      );
    } else if (!loading && searchText && !searchResult?.length) {
      return <View style={styles.noResultsContainer}>
        <SearchNotFoundSVG width={64} height={64} />
        <Text style={styles.noResultsText}>No rooms found.</Text>
      </View>;
    } else if (!searchText) {
      return <View style={styles.noResultsContainer}>
        <StartSearchSVG width={64} height={64} />
        <Text style={styles.noResultsText}>Search for rooms by name, building, or campus.</Text>
      </View>;
    }
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
        {!!error && <Text style={styles.errorText}>{error}</Text>}
        {renderContent()}
        {showModal && <ReservationComponent room_info={selectedRoom} showModal={showModal} closeModal={closeModal} />}
      </View>
    </>
  );
};

export default SearchDrawer;
