const getDetailMovie = async (id: any, API_ACCESS_TOKEN: any, setDetailMovie: any) => {
    const url = `https://api.themoviedb.org/3/movie/${id}`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
    };
  
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setDetailMovie(data);
    } catch (error) {
      console.log('Error fetching movie details:', error);
    }
};
  
const getMovieList = async (path: any, API_ACCESS_TOKEN: any, setMovies: any) => {
    const url = `https://api.themoviedb.org/3/${path}`
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
    }
  
    fetch(url, options)
      .then(async (response) => await response.json())
      .then((response) => {
        setMovies(response.results)
      })
      .catch((errorResponse) => {
        console.log(errorResponse)
      })
}
  
export { getMovieList, getDetailMovie };