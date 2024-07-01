import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MovieItem from '../components/movies/MovieItem';
import type { Movie } from '../types/app';
import { useIsFocused } from '@react-navigation/native';
import tw from 'twrnc'

export default function Favorite(): JSX.Element {
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const { width } = Dimensions.get('window')
  const isFocused = useIsFocused()

  useEffect(() => {
    if (isFocused) {
      fetchFavoriteMovies();
    }
  }, [isFocused]);

  const fetchFavoriteMovies = async (): Promise<void> => {
    try {
      const favoriteMoviesData: string | null = await AsyncStorage.getItem('@FavoriteList');
      if (favoriteMoviesData) {
        const favoriteMoviesList: Movie[] = JSON.parse(favoriteMoviesData);
        setFavoriteMovies(favoriteMoviesList);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const renderSeparator = (): JSX.Element => {
    return <View />;
  }

  return (
    <View style={{
      flex: 1,
      backgroundColor: '#f1f1f1',
      minWidth: Dimensions.get('window').width,
    }}>
      <Text style={tw`text-black font-bold py-3 text-xl text-center `}>My Favorite Movies</Text>
      <FlatList
        data={favoriteMovies}
        renderItem={({ item }) => (
          <TouchableOpacity>
            <MovieItem
              movie={item}
              size={{ width: width / 2 - 32, height: (width / 2 - 32) * 1.5 }} // Sesuaikan dengan proporsi yang diinginkan
              coverType="poster"
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        ItemSeparatorComponent={renderSeparator}
        contentContainerStyle={{ paddingLeft: 28, paddingTop: 16, paddingBottom: 16 }}
      />
    </View>
  )
}