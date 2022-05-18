import axios from "axios";
const URL = 'https://pixabay.com/api/';
const KEY = '27405917-f8453a95813591a24f9d89c32';



export default class ApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
        this.per_page = 40;
    }
    
    onFetch() {
        return axios.get(URL, {
            params: {
                key: KEY,
                q: this.searchQuery,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: 'true',
                page: this.page,
                per_page: this.per_page,
            }
          })
            .then(response => {
                this.incrementPage();
                return response.data;
          })
    };
    
    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}

