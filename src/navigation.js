let page = 1;
let maxPage;
let infiniteScroll;
document.querySelector('form').addEventListener('submit', (event)=> {
    event.preventDefault();
});
class Node {
    constructor(value){
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}
class MemoryBack  {
    constructor(value){
        this.head = {
            value: value,
            prev: null,
            next: null,
        }
        this.tail = this.head;
        this.length = 1;        
    }
    append(value) {
        const newNode = new Node(value);
        newNode.prev = this.tail;
        this.tail.next = newNode;
        this.tail = newNode;
        this.length++;
        return this;
    }
    prepend(value) {
        const newNode = new Node(value);
        newNode.next = this.head;
        this.head.prev = newNode;
        this.head = newNode;
        this.length++;
    }
}

const memoryBackBtn = new MemoryBack("#home");
console.log("initialbackbutton" , memoryBackBtn);
searchFormBtn.addEventListener('click', () => {
    location.hash = `#search=${searchFormInput.value}`;
});
trendingBtn.addEventListener('click', () => {
    location.hash = '#trends'
});
arrowBtn.addEventListener('click', () => {
    // history.back();
    if (memoryBackBtn.length === 2) {
        
        memoryBackBtn.head.next = null;
        memoryBackBtn.tail= memoryBackBtn.head
        memoryBackBtn.length = 1;
        location.hash = '#home';
        return;
    } else {
        location.hash = memoryBackBtn.tail.prev.value;
        memoryBackBtn.tail= memoryBackBtn.tail.prev;
        memoryBackBtn.tail.prev.next = null;
        memoryBackBtn.length -= 1;
    }
});


window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);
window.addEventListener('scroll', infiniteScroll, false);




function navigator() {

    console.log({ location });
    console.log("infiniteScroll: ",infiniteScroll);
    if (infiniteScroll) {
        window.removeEventListener('scroll', infiniteScroll, {passive : false});
        infiniteScroll = undefined;
    }
    if (location.hash.startsWith('#trends')){
        trendsPage();
        const sumPageTotal=  Number(sumPage(1));
        sumPage(-(sumPageTotal-1));
        memoryBackBtn.append(location.hash); 
        console.log(memoryBackBtn);   
    } else if (location.hash.startsWith('#search=')) {
        searchPage();
        const sumPageTotal=  Number(sumPage(1));
        sumPage(-(sumPageTotal-1));
    } else if (location.hash.startsWith('#movie=')) {
        
        movieDetailsPage();
        const sumPageTotal=  Number(sumPage(1));
        sumPage(-(sumPageTotal-1));
        memoryBackBtn.append(location.hash); 
        console.log(memoryBackBtn);
    } else if (location.hash.startsWith('#category=')) {
        categoriesPage();
        const sumPageTotal=  Number(sumPage(1));
        sumPage(-(sumPageTotal-1));
        memoryBackBtn.append(location.hash); 
        console.log(memoryBackBtn);
    } else {
        page = 1;
        homePage();

    }
    //ducument.body.scrollTop = 1;
    document.documentElement.scrollTop = 1;

    if (infiniteScroll) {
        window.addEventListener('scroll', infiniteScroll,  {passive : false});
    }
}
function homePage() {
    console.log('Home');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');
    nextPage.classList.add('inactive');

    trendingPreviewSection.classList.remove('inactive');
    likedList.classList.remove('inactive');
    likedHeader.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');
    imgCenter.classList.add('inactive');
    footer.classList.remove('inactive');

    getTrendingMoviesPreview();
    getCategoriesPreview();
    getLikedMovies();
}
function categoriesPage() {
    console.log('CATEGORY');
    // headerSection.scrollTop = 1;

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');
    nextPage.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    likedList.classList.add('inactive');
    likedHeader.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    imgCenter.classList.add('inactive');
    footer.classList.remove('inactive');

    const [_, categoryData] = location.hash.split ('=');
    const [categoryId, categoryName] = categoryData.split('-');
    // console.log(categoryId)
    // console.log(categoryName)
    headerCategoryTitle.innerHTML = categoryName.replace('%20', ' ');

    getMoviesByCategories(categoryId);
    infiniteScroll = getPageMoviesByCategories(categoryId);
}
function movieDetailsPage() {
    console.log('MOVIE');

    headerSection.classList.add('header-container--long');
    // headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');
    nextPage.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    likedList.classList.add('inactive');
    likedHeader.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');
    footer.classList.add('inactive');
    bodyRelative.style.position = 'relative';
    imgCenter.classList.remove('inactive');



    const [_, movieId] = location.hash.split ('=');
    getMovieById(movieId);
}
function searchPage() {
    console.log('SEARCH');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');
    nextPage.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    likedList.classList.add('inactive');
    likedHeader.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    footer.classList.remove('inactive');
    
    imgCenter.classList.add('inactive');

    const [_, query] = location.hash.split ('=');
    getMoviesBySearch(query);
    infiniteScroll = getPageMoviesBySearch(query);
    console.log("infiniteScroll", infiniteScroll);
    memoryBackBtn.append(location.hash); 
    console.log(memoryBackBtn);
}
function trendsPage() {
    console.log('TRENDS');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');
    nextPage.classList.remove('inactive');

    trendingPreviewSection.classList.add('inactive');
    likedList.classList.add('inactive');
    likedHeader.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    footer.classList.remove('inactive');
    
    imgCenter.classList.add('inactive');
    nextPage.innerHTML = "Sigueinte página";

    headerCategoryTitle.innerHTML = 'Tendencias';
    
    nextPage.innerHTML = "Sigueinte página";
    getTrendingMovies();
    infiniteScroll = getPageTrendingMovies;
}

