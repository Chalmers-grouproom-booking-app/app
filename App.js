import { StatusBar } from 'expo-status-bar';
import { SearchBar, Button } from '@rneui/base';
import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity} from 'react-native';


export default function App() {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState('');

  const handleSearch = (search) => {
    console.log(search); // Debug: log the search variable to ensure it has the expected value
      fetch(`https://chalmers_grouproom.sacic.dev/api/v1/search/${encodeURIComponent(search)}`,{
          headers:{
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        }
      )
      .then((response) => response.json())
      .then((json) => {
        setSearchResult(JSON.stringify(json, null, 2)); // Convert and save the response in state
      })
      .catch((error) => {
        console.error(error);
        setSearchResult( error.toString() );
      }
      );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Type here"
          onChangeText={text => setSearch(text)}
          value={search}
        />
        <Button
          title="Search"
          onPress={() => handleSearch(search)}
        />
      </View>
      <ScrollView style={styles.resultContainer}>
        {/* Assuming searchResult is a JSON stringified response */}
        <TouchableOpacity onPress={() => handleItemClick(searchResult)}>
          <Text style={searchResult}>Click me</Text>
        </TouchableOpacity>
    </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  resultContainer: {
    flex: 1, // Important to make sure the ScrollView takes up the rest of the space
    paddingHorizontal: 20,
  },
  resultText: {
    fontFamily: 'monospace', // Helps in displaying JSON text (if supported)
  },
});
