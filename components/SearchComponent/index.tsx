import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator  } from 'react-native';
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

const Search = ( { toggleFilter, filterDataHasActiveFilters, filterData }: { toggleFilter: () => void, filterDataHasActiveFilters: (filterData: any) => boolean, filterData: any }) => {
  const { building } = useLocalSearchParams() as { building: string };
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();
  const { searchResult, error, loading, setLoading, searchRooms } = useRoomSearch();
  const { showModal, selectedRoom, openModal, closeModal} = useReservations();
  const debouncedSearch = useDebounce(searchText, 300); 

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(ITEMS_PER_PAGE);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = searchResult ? searchResult.slice(indexOfFirstItem, indexOfLastItem) : [];


  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
    // Check if there is a debounced search term or any active filters
    if (debouncedSearch || filterDataHasActiveFilters(filterData)) {
      searchRooms(debouncedSearch, filterData);
    }
  }, [debouncedSearch, filterData, searchRooms]); // Still depend on both debouncedSearch and filterData

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

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
    } else if (searchResult?.length > 0) {
      return (
        <ScrollView style={styles.resultContainer}>
          {searchResult.map((item, index) => (
            <RoomItem key={`${item.room_name}_${index}`} item={item}  openModal={openModal} />
          ))}
        </ScrollView>
      );
    } else if (!loading && (searchText || filterDataHasActiveFilters(filterData))) {
      return (
        <View style={styles.noResultsContainer}>
          <SearchNotFoundSVG width={64} height={64} />
          <Text style={styles.noResultsText}>No rooms found.</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.noResultsContainer}>
          <StartSearchSVG width={64} height={64} />
          <Text style={styles.noResultsText}>Start your search with filters or by entering text.</Text>
        </View>
      );
    }
  };

  return (
    <>
      <View style={styles.container}></View>
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
      {showModal && (
          <ReservationComponent room_info={selectedRoom} showModal={showModal} closeModal={closeModal} />
        )
      }
    </>
  );
};


export default Search;
