import { SearchBar, Button } from '@rneui/base';
import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

export default function App() {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState('');

  const handleSearch = async (search) => {
    console.log( ` Search for ${search} `)
    setSearchResult( `Search for ${search}`)
    try {
      const response = await fetch(`https://strawhats.info/api/v1/search/${encodeURIComponent(search)}`,{
        headers:{
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      console.log( ` Response ${response} `)
      if (!response.ok) {
        setSearchResult('No results found');
        return;
      }
      const json = await response.json();
      setSearchResult(JSON.stringify(json, null, 2)); // Convert and save the response in state
    } catch (error) {
      console.error(error);
      setSearchResult('An error occurred');      
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Text>Search for a room</Text>
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
        <Text style={styles.resultText}>{searchResult}</Text>
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
