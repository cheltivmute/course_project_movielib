import { makeAutoObservable } from 'mobx';

export default class MovieLib {
    constructor() {
        this._genres = []
        this._countries = []
        this._movies = []
        this._reviews = []
        this._folders = []
        this._movieFolders = []
        this._users = []
        this._selectedGenre = {}
        this._selectedCountry = {}
        this._page = 1
        this._totalCount = 0
        this._limit = 5
        this._searchTitle = null

        makeAutoObservable(this)
    }

    setGenres(genres) {
        this._genres = genres 
    }
    setCountries(countries) {
        this._countries = countries
    }
    setMovies(movies) {
        this._movies = movies
    }
    setSelectedGenre(genre) {
        this.setPage(1)
        this._selectedGenre = genre
    }
    setSelectedCountry(country) {
        this.setPage(1)
        this._selectedCountry = country
    }
    setPage(page) {
        this._page = page
    }
    setTotalCount(count) {
        this._totalCount = count
    }
    setSearchTitle(title) {
        this.setPage(1)
        this._searchTitle = title
    }
    setReviews(reviews) {
        this._reviews = reviews
    }    
    setFolders(folders) {
        this._folders = folders
    }
    setMovieFolders(movieFolders) {
        this._movieFolders = movieFolders
    }
    setUsers(users) {
        this._users = users
    }

    get genres() {
        return this._genres
    }
    get countries() {
        return this._countries
    }
    get movies() {
        return this._movies
    }
    get selectedGenre() {
        return this._selectedGenre
    }
    get selectedCountry() {
        return this._selectedCountry
    }
    get totalCount() {
        return this._totalCount
    }
    get page() {
        return this._page
    }
    get limit() {
        return this._limit
    }
    get searchTitle() {
        return this._searchTitle
    }
    get reviews() {
        return this._reviews
    }
    get folders() {
        return this._folders
    }
    get movieFolders() {
        return this._movieFolders
    }
    get users() {
        return this._users
    }
}
