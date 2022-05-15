// Описан в документации
import SimpleLightbox from 'simplelightbox';
// Дополнительный импорт стилей
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector(".search-form");
const gallery = document.querySelector(".gallery");
const button = document.querySelector(".load-more");

form.addEventListener("submit", onSubmit);
button.addEventListener("click", onLoadMore);

const lightBox = new SimpleLightbox(".gallery a", { loop: true, enableKeyboard: true, docClose: true, });
const URL = 'https://pixabay.com/api/';
const KEY = '27405917-f8453a95813591a24f9d89c32';
// let inp = '';
// let page = 1;
const value = { input: '', page: 1, };

const searchParams = new URLSearchParams({
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: `${value.page}`,
    per_page: 40,
});

console.log(searchParams);

function onSubmit(e) {
    e.preventDefault();
    value.page = 1;
    onClear();
    value.input = e.currentTarget.elements.searchQuery.value;
    onFetch(value.input);
};

function onFetch(inp) {
    return fetch(`${URL}?key=${KEY}&q=${inp}&${searchParams}`)
        .then(r => r.json())
        .then(data => data.hits)
        .then(renderMarkUp)
        .then(onRender);
};

function renderMarkUp(markup) {
    return markup.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `<a class="gallery__item" href="${largeImageURL}">
        <div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
            <p class="info-item">
            <b>Likes</b>${likes}
            </p>
            <p class="info-item">
            <b>Views</b>${views}
            </p>
            <p class="info-item">
            <b>Comments</b>${comments}
            </p>
            <p class="info-item">
            <b>Downloads</b>${downloads}
            </p>
            </div>
            </div>
            </a>`
    }).join("");
};

function onRender(cart) {
    gallery.insertAdjacentHTML('beforeend', cart);
    lightBox.refresh();
};

function onClear() {
    gallery.innerHTML = '';
};

function onLoadMore() {
    incrementPage();
    onFetch(value.input);
};

function incrementPage() {
    value.page += 1;
}