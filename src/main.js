//Data

const api = axios.create({
    baseURL: `https://api.themoviedb.org/3`,
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    params: {
        'api_key': API_KEY,
        'language': navigator.language || 'es-MX',
    }
});

function likedMovieList(){
    const item = JSON.parse(localStorage.getItem('liked_movies'));
    let movies;

    if(item) {
        movies = item; 
    } else {
        movies = {};
    }
    return movies;
}

function likeMovie(movie){

    const likedMovies = likedMovieList();
    if(likedMovies[movie.id]) {
        likedMovies[movie.id] =undefined;
    } else {
        likedMovies[movie.id] = movie;
    }
    localStorage.setItem('liked_movies',JSON.stringify(likedMovies));
    console.log(JSON.parse(localStorage.getItem('liked_movies')));
}
// Utils

function scroll(element) {
    element.addEventListener('wheel', (event) => {
        event.preventDefault();
       
        element.scrollBy({
          left: event.deltaY < 0 ? -200 : 200, //es un operador condicionl(ternario)- condition ? val1 : val2
          
        });
      });
}
scroll(trendingMoviesPreviewList);
scroll(likedList);
nextPage.onclick = () => {
    page = Number(sumPage(1));
    getPageTrendingMovies();
}
const lazyLoader = new IntersectionObserver((entries)=>{
    entries.forEach((entry)=> {
        // console.log(entry.target.setAttribute);
        if(entry.isIntersecting) {
            const url = entry.target.getAttribute('data-img');
            entry.target.setAttribute('src', url);
            }

    });
});
function renderMovies(
    father, 
    movies, 
    { 
        lazyLoad = false, 
        clean = true 
    }={}) {
    if (clean){
        father.innerHTML = '';
    }
    const likedMovie = likedMovieList();
    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.className = 'movie-container';
        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movie.poster_path 
            ? movieImg.setAttribute(
                lazyLoad ? 'data-img' : 'src',
                'https://image.tmdb.org/t/p/w300/' + movie.poster_path            
                )
                : movieImg.setAttribute('src', '../images/419f2f4e9f692869a91cab3bf87506a0.jpg')
        movieImg.addEventListener('error', ()=> {
            movieImg.setAttribute(
                'src',
                '../images/419f2f4e9f692869a91cab3bf87506a0.jpg'
            )
        });
        movieImg.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id;
        });
        const movieBtn = document.createElement('button');
        
        if (likedMovie[movie.id]){
            movieBtn.classList.add('movie-btn--liked');
        }
        movieBtn.classList.add('movie-btn');
        if(localStorage)
        movieBtn.addEventListener('click', ()=>{
            movieBtn.classList.toggle('movie-btn--liked');
            likeMovie(movie);
            getLikedMovies();
        });


        if (lazyLoad) {
            lazyLoader.observe(movieImg);
        }
        movieContainer.appendChild(movieImg);
        movieContainer.appendChild(movieBtn);
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
        categoryContainer.style.background = ('none');
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

async function getTrendingMoviesPreview() {
    const { data }= await api(`/trending/movie/day?&page=${page}&`);
    const movies = data.results;
    // console.log(movies);
    console.log(data);
    renderMovies(trendingMoviesPreviewList, movies, {lazyLoad: true});
    const rightArrow = document.createElement('button');
    const leftArrow = document.createElement('button');
    rightArrow.className = 'right-arrow';
    leftArrow.className = 'left-arrow';
    const imgArrowL = document.createElement('img');
    const imgArrowR = document.createElement('img');
    imgArrowL.src = "images/flecha-correcta.png";
    imgArrowR.src = "images/flecha-correcta.png";

    rightArrow.appendChild(imgArrowR);
    leftArrow.appendChild(imgArrowL);
    trendingPreviewSection.appendChild(rightArrow);
    trendingPreviewSection.appendChild(leftArrow);

    
    rightArrow.addEventListener('click', () => {
        trendingMoviesPreviewList.scrollLeft-= 150;
        // trendingMoviesPreviewList.style.transition = 'scroll 10s linear';
        // trendingMoviesPreviewList.scrollLeft -= 150;
    });
    leftArrow.addEventListener('click', () => {
        trendingMoviesPreviewList.scrollLeft += 150;
    });
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
    maxPage = data.total_pages;
    // console.log(movies);
    // console.log(data);
    renderMovies(genericSection, movies, {lazyLoad: true, clean: true});

}
function getPageMoviesByCategories(id) {
    return async function () {
        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 5);
        const pageIsNotMax = page < maxPage;
    
        if (scrollIsBottom && pageIsNotMax) {
            page = Number(sumPage(1));
            // console.log(page);
            const { data }= await api('discover/movie', {
                params: {
                    with_genres: id,
                    page,
                },
            });
            const movies = data.results;
            // console.log(movies);
            // console.log(data);
            renderMovies(genericSection, movies, {lazyLoad: true, clean: false});
        }
    }
    

}
async function getMoviesBySearch(query) {
    const { data }= await api('/search/movie', {
        params: {
            query,
            page,
        },
    });
    console.log(data);
    const movies = data.results;
    maxPage = data.total_pages;
    console.log(maxPage);
    // console.log(" getMovies inicial: ",movies);
    renderMovies(genericSection, movies, {lazyLoad: true, clean: true});
    if (movies.length === 0 ) {
        const error = document.createElement('span');
        error.textContent = 'Lo sentimos no pudimos encontrar ningun resultado, intenta con otro nombre...';
        error.style.fontSize = '30px';
        error.style.textAlign = 'center';
        genericSection.appendChild(error);
        genericSection.style.height = '67.7vh';
    }
}
function getPageMoviesBySearch(query) {
    return async function () {
        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 5);
        const pageIsNotMax = page < maxPage;
    
        if (scrollIsBottom && pageIsNotMax) {
            page = Number(sumPage(1));
            // console.log(page);
            const { data }= await api('/search/movie', {
                params: {
                    query,
                    page,
                },
            });
            const movies = data.results;
            console.log(" getMovies scroll: ",movies);
        // console.log(data);
            renderMovies(genericSection, movies, {lazyLoad: true, clean: false});
        }
    }
    
    
}
async function getTrendingMovies() {  
    const { data }= await api(`/trending/movie/day?&page=${page}&`);
    const movies = data.results;

    // console.log(movies);
    maxPage =  data.total_pages;
    renderMovies(genericSection, movies, {lazyLoad:true, clean:true});    
}
async function getPageTrendingMovies() {  

    const {
        scrollTop,
        scrollHeight,
        clientHeight
    } = document.documentElement;
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
    const pageIsNotMax = page < maxPage;

    if (scrollIsBottom && pageIsNotMax) {
        page = Number(sumPage(1));
        const { data }= await api(`/trending/movie/day?&page=${page}&`);
        const movies = data.results;
        renderMovies(genericSection, movies, {lazyLoad:true, clean:false});
    }
        
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
    const imgCenter = document.querySelector('.movie-poster-center');
    imgCenter.src = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
    movieDetailTitle.textContent = movie.title;
    movieDetailTitle.style.color = '#000000';
    movieDetailTitle.style.background = 'none';
    movieDetailDescription.textContent = movie.overview;
    movieDetailDescription.style.color = '#000000';
    movieDetailDescription.style.background = 'none';
    movieDetailScore.textContent = movie.vote_average;
    movieDetailScore.style.color = '#000000';
    movieDetailScore.style.background = 'none';
    renderCategories(movieDetailCategoriesList, movie.genres);

    getRelatedMoviesById(movie.id);
    
}
async function getRelatedMoviesById(id) {
    const { data}= await api(`/movie/${id}/recommendations`);
    const relatedMovies = data.results;
    renderMovies(relatedMoviesContainer, relatedMovies);
}

function getLikedMovies() {
    const likedMovie = likedMovieList();
    moviesArray = Object.values(likedMovie);
    
    renderMovies(likedList, moviesArray, {lazyLoad: true, clean:true});
    const rightArrow = document.createElement('button');
    const leftArrow = document.createElement('button');
    rightArrow.className = 'right-arrow';
    leftArrow.className = 'left-arrow';
    const imgArrowL = document.createElement('img');
    const imgArrowR = document.createElement('img');
    imgArrowL.src = "images/flecha-correcta.png";
    imgArrowR.src = "images/flecha-correcta.png";

    rightArrow.appendChild(imgArrowR);
    leftArrow.appendChild(imgArrowL);
    likedMoviesSection.appendChild(rightArrow);
    likedMoviesSection.appendChild(leftArrow);
    rightArrow.addEventListener('click', () => {
        likedList.scrollLeft-= 150;
        // trendingMoviesPreviewList.style.transition = 'scroll 10s linear';
        // trendingMoviesPreviewList.scrollLeft -= 150;
    });
    leftArrow.addEventListener('click', () => {
        likedList.scrollLeft += 150;
    });
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


