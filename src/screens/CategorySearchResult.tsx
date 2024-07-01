import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { API_ACCESS_TOKEN } from '@env';
import MovieItem from '../components/movies/MovieItem';
import { Movie } from '../types/app';

export default function CategorySearchResult({ route }: { route: any }): JSX.Element {

  const { width } = Dimensions.get('window');
  const { selectedGenres } = route.params;
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);

  useEffect(() => {
    fetchCategoryMovies();
  }, [selectedGenres]);

  const fetchCategoryMovies = async () => {
    setLoading(true);
    setIsEmpty(false);

    const genreId = selectedGenres.join(',');
    const url = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
    };

    fetch(url, options)
      .then(async (response) => await response.json())
      .then((response) => {
        setSearchResults(response.results);
        setIsEmpty(response.results.length === 0);
        setLoading(false);
      })
      .catch((errorResponse) => {
        console.log(errorResponse);
        setLoading(false);
      });
  };

  const renderSeparator = (): JSX.Element => {
    return <View style={styles.separator} />;
  }

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isEmpty) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No movies found for the selected genres.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={searchResults}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.itemContainer}>
            <MovieItem
              movie={item}
              size={{ width: width / 2 - 32, height: (width / 2 - 32) * 1.5 }}
              coverType="poster"
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        numColumns={2}
        ItemSeparatorComponent={renderSeparator}
      />
    </View>
  )

}

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    flex: 1,
    backgroundColor: '#170C34',
    paddingHorizontal: 16,
    minHeight: 1200
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
  },
  movieList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  separator: {
    height: 8,
  },
  listContainer: {
    paddingBottom: 16,
    justifyContent: 'space-between',
  },
  itemContainer: {
    padding: 8,
  },
});