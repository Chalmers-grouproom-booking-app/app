import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { styles } from './styles';
import type { RoomInfo, TimeSlot } from '../../constants/types';
import Icon from 'react-native-vector-icons/Ionicons';
import MarkerButton from './MarkerButton';
import { router } from 'expo-router';


const RoomItem = ({ item , openModal }: { item: RoomInfo  , openModal: (room: RoomInfo) => void }) => {
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
  
    const fetchReservations = async (roomName) => {
      setLoadingReservations(true);
      try {
        const response = await fetch(`https://strawhats.info/api/v1/room/reservation?input=${encodeURIComponent(roomName)}`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        if( !response.ok ) {
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
    
    const renderReservations = () => {
        if (item.first_come_first_served === true) {
          return null;
        }
      
        if (loadingReservations) {
          return <ActivityIndicator size="small" color="#0000ff" />;
        }
      
        if (!reservationResult || reservationResult.length === 0) {
          return <Text style={styles.noReservationText}>No reservations found</Text>;
        }
      
        return (
          <>
            <Text style={styles.reservationTitle}>Reservations:</Text>
            {Object.entries(reservationResult.reduce((acc, res) => {
              const dateKey = convertStringToDate(res.start_date).toISOString().slice(0, 10);
              if (!acc[dateKey]) {
                acc[dateKey] = [];
              }
              acc[dateKey].push(res);
              return acc;
            }, {})).sort(([dateA], [dateB]) => {
              const dateATime = new Date(dateA).getTime();
              const dateBTime = new Date(dateB).getTime();
              return dateATime - dateBTime;
            }).map(([date, reservations]) => (
              <View key={date} style={styles.reservationItem}>
                <Text style={styles.reservationDate}>{getRelativeDate(date)}</Text>
                {(reservations as TimeSlot[])
                  .sort((a, b) => {
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
        );
      };
      
    return (
        <TouchableOpacity onPress={toggleExpand} style={styles.itemContainer} activeOpacity={1}>
        <View style={isExpanded ? styles.iteamHeaderExpanded : styles.itemHeader}>
          <Text style={isExpanded ? styles.resultTextExpanded : styles.resultText}>{item.room_name}</Text>
          {item.first_come_first_served && (
            <Text style={styles.fcfText}>First come first served</Text>
          )}
        </View>
        {isExpanded && (
          <View style={styles.roomDetails}>
            {/* Other details */}
            {renderReservations()}
            {/* Other buttons */}
          </View>
        )}
      </TouchableOpacity>
    );
  };
  

export default RoomItem;