const api = axios.create({
    baseURL: `https://api.themoviedb.org/3`,
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    params: {
        'api_key': API_KEY,
    }
});


nextPage.onclick = () => {
    page = Number(sumPage(1));
    getTrendingMovies();
}
function renderMovies(father, movies) {
    father.innerHTML = '';
    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.className = 'movie-container';
        movieContainer.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id;
        });
        movieContainer.style.background = 'none'
        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute(
            'src',
            'https://image.tmdb.org/t/p/w300/' + movie.poster_path            
            );
            movieContainer.appendChild(movieImg);
            father.appendChild(movieContainer);
    });
    
}
function renderCategories(father, categories) {
    father.innerHTML = ''; 
    categories.forEach(category => {   
        const categoryContainer = document.createElement('div');
        categoryContainer.className = 'category-container';
        
        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.style.background = ('none');
        categoryTitle.setAttribute("id", 'id' + category.id);
        categoryTitle.addEventListener('click', () => {
            location.hash = `#category=${category.id}-${category.name}` 
        })
        const categoryTitleText = document.createTextNode(category.name);

        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        
        father.appendChild(categoryContainer);
    });
}
let page = 1;
async function getTrendingMoviesPreview() {
    const { data }= await api(`/trending/movie/day?&page=${page}&`);
    const movies = data.results;
    // console.log(movies);
    // console.log(data);
    renderMovies(trendingMoviesPreviewList, movies);
}

async function getCategoriesPreview() {
    const { data } = await api(`/genre/movie/list?`);
    const categories = data.genres;    
    renderCategories(categoriesPreviewList, categories);

}
async function getMoviesByCategories(id) {
    const { data }= await api('discover/movie', {
        params: {
            with_genres: id,
        },
    });
    const movies = data.results;
    // console.log(movies);
    // console.log(data);
    renderMovies(genericSection, movies);

}
async function getMoviesBySearch(query) {
    const { data }= await api('/search/movie', {
        params: {
            query,
        },
    });
    const movies = data.results;
    // console.log(movies);
    // console.log(data);
    renderMovies(genericSection, movies);

}
async function getTrendingMovies() {
    const { data }= await api(`/trending/movie/day?&page=${page}&`);
    const movies = data.results;
    // console.log(movies);
    // console.log(data);
    renderMovies(genericSection, movies);

    
}
async function getMovieById(movieId) {
    const { data: movie }= await api(`/movie/${movieId}`);

    const movieImgUrl = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
    headerSection.style.background = `linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.35) 19.27%,
        rgba(0, 0, 0, 0) 29.17%
      ),
      url(${movieImgUrl})`;
    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;
    renderCategories(movieDetailCategoriesList, movie.genres);

    getRelatedMoviesById(movie.id);
    
}
async function getRelatedMoviesById(id) {
    const { data}= await api(`/movie/${id}/recommendations`);
    const relatedMovies = data.results;
    renderMovies(relatedMoviesContainer, relatedMovies);
}
const pagesPP = () => {
    var savePage = 1;
    const pagesCounter = (page) => {
        savePage += page
        console.log(savePage);
        return savePage;
    }
    return pagesCounter;
}
let sumPage = pagesPP();


