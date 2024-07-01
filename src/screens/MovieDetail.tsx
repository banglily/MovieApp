import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { API_ACCESS_TOKEN } from '@env';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { Movie, MovieListProps } from '../types/app';
import tw from 'twrnc';
import MovieList from '../components/movies/MovieList';
import formatRuntime from '../services/formatRuntime';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDetailMovie } from '../services/movies';

export default function MovieDetail({ route }: any): JSX.Element {
  const { id } = route.params;
  const [detailMovie, setDetailMovie] = useState<Movie | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    getDetailMovie(id, API_ACCESS_TOKEN, setDetailMovie);
    checkIsFavorite(id);
  }, [id]);

  const addFavorite = async (movie: Movie): Promise<void> => {
    try {
      const initialData: string | null = await AsyncStorage.getItem('@FavoriteList');
      let favMovieList: Movie[] = initialData ? JSON.parse(initialData) : [];
      favMovieList = [...favMovieList, movie];
      await AsyncStorage.setItem('@FavoriteList', JSON.stringify(favMovieList));
      setIsFavorite(true);
    } catch (error) {
      console.log(error);
    }
  };

  const removeFavorite = async (id: number): Promise<void> => {
    try {
      const initialData: string | null = await AsyncStorage.getItem('@FavoriteList');
      let favMovieList: Movie[] = initialData ? JSON.parse(initialData) : [];
      favMovieList = favMovieList.filter((movie) => movie.id !== id);
      await AsyncStorage.setItem('@FavoriteList', JSON.stringify(favMovieList));
      setIsFavorite(false);
    } catch (error) {
      console.log(error);
    }
  };

  const checkIsFavorite = async (id: number): Promise<void> => {
    try {
      const initialData: string | null = await AsyncStorage.getItem('@FavoriteList');
      const favMovieList: Movie[] = initialData ? JSON.parse(initialData) : [];
      const isFav = favMovieList.some((movie) => movie.id === id);
      setIsFavorite(isFav);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleFavorite = (): void => {
    if (detailMovie) {
      if (isFavorite) {
        removeFavorite(detailMovie.id);
      } else {
        addFavorite(detailMovie);
      }
    }
  };

  if (!detailMovie) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const recomendations: MovieListProps = {
    title: 'Recomendations',
    path: `/movie/${id}/recommendations`,
    coverType: 'poster',
  };

  return (
    <ScrollView style={styles.container}>
      {detailMovie.backdrop_path ? (
        <ImageBackground
          source={{ uri: `https://image.tmdb.org/t/p/w500${detailMovie.backdrop_path}` }}
          style={styles.backdrop}
        >
          <LinearGradient
            colors={['#00000000', 'hsla(0, 100%, 0%, 0.3)']}
            locations={[0.6, 0.8]}
            style={styles.gradientStyle}
          >
            <Text style={styles.movieTitle}>{detailMovie.title}</Text>
            <View style={styles.rowRatingFavoriteContainer}>
              <View style={styles.ratingContainer}>
                <FontAwesome name="star" size={14} color="yellow" />
                <Text style={styles.rating}>{detailMovie.vote_average.toFixed(1)}</Text>
              </View>
              <Text style={tw`font-bold text-white`}>
                {formatRuntime(detailMovie.runtime)}
              </Text>
              <TouchableOpacity onPress={toggleFavorite}>
                <FontAwesome name={isFavorite ? "heart" : "heart-o"} size={24} color="blue" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </ImageBackground>
      ) : (
        <View style={styles.noImage}>
          <Text style={styles.noImageText}>No Image Available</Text>
        </View>
      )}
      <View style={tw`p-4 bg-[#170C34]`}>
        <Text style={tw`font-semibold text-[#c9eded] pb-3`}>
          Release: {new Date(detailMovie.release_date).getFullYear()}
        </Text>
        <View style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', paddingBottom: 10, gap: 5 }}>
          {detailMovie.genres.map((genre: any) => (
            <View key={genre.id} style={tw`bg-blue-800 rounded-2xl px-3 py-1`}>
              <Text style={tw`text-white`}>{genre.name}</Text>
            </View>
          ))}
        </View>
        <Text style={tw`text-[#c9eded] pb-4`}>{detailMovie.overview}</Text>
        <View style={tw`flex flex-row justify-between mb-4`}>
          <View style={styles.infoColumn}>
            <Text style={styles.infoLabel}>Original Language</Text>
            <Text style={styles.infoValue}>{detailMovie.original_language}</Text>
          </View>
          <View style={styles.infoColumn}>
            <Text style={styles.infoLabel}>Popularity</Text>
            <Text style={styles.infoValue}>{detailMovie.popularity}</Text>
          </View>
        </View>
        <View style={tw`flex flex-row justify-between mb-8`}>
          <View style={styles.infoColumn}>
            <Text style={styles.infoLabel}>Release Date</Text>
            <Text style={styles.infoValue}>{new Date(detailMovie.release_date).toDateString()}</Text>
          </View>
          <View style={styles.infoColumn}>
            <Text style={styles.infoLabel}>Vote Count</Text>
            <Text style={styles.infoValue}>{detailMovie.vote_count}</Text>
          </View>
        </View>
        <MovieList
          title={recomendations.title}
          path={recomendations.path}
          coverType={recomendations.coverType}
          key={recomendations.title}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    width: '100%',
    height: 240,
  },
  noImage: {
    width: '100%',
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
  },
  noImageText: {
    color: '#888',
  },
  movieTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  rating: {
    color: 'yellow',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  gradientStyle: {
    padding: 8,
    height: 240,
    width: '100%',
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowRatingFavoriteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 8,
    marginBottom: 2,
  },
  detailsContainer: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  voteAverage: {
    fontSize: 14,
    color: '#FFD700',
    marginBottom: 10,
  },
  infoColumn: {
    flex: 1,
    paddingHorizontal: 5,
    color: '#fff',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  infoValue: {
    fontSize: 14,
    color: '#76b5c5',
  },
});