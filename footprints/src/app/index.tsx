import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TripCard } from '@/components/TripCard';
import { useTripStore } from '@/store/tripStore';

export default function HomeScreen() {
  const trips = useTripStore((state) => state.trips);
  const removeTrip = useTripStore((state) => state.removeTrip);

  const handleAddTrip = () => {
    console.log('Add trip pressed');
  };

  const handleDeleteTrip = (id: string, name: string) => {
    Alert.alert(
      'Delete Trip',
      `Are you sure you want to delete "${name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => removeTrip(id),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Trips</Text>

          <Pressable
            style={styles.addButton}
            onPress={handleAddTrip}
          >
            <Text style={styles.addButtonText}>+</Text>
          </Pressable>
        </View>

        {/* Trip List */}
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TripCard
              trip={item}
              onPress={() => {
                console.log('Open trip:', item.id);
              }}
              onEdit={() => {
                console.log('Edit trip:', item.id);
              }}
              onDelete={() => {
                handleDeleteTrip(item.id, item.name);
              }}
            />
          )}
        />

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 36,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
  },

  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },

  addButtonText: {
    color: 'white',
    fontSize: 30,
    lineHeight: 32,
    fontWeight: '300',
  },

  list: {
    gap: 14,
    paddingBottom: 20,
  },
});