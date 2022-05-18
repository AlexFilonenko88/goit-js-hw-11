// Описан в документации
import SimpleLightbox from 'simplelightbox';
// Дополнительный импорт стилей
import 'simplelightbox/dist/simple-lightbox.min.css';
import API from './fetchapi';
import '../css/styles.css';
import { Notify } from "notiflix/build/notiflix-notify-aio";

const form = document.querySelector(".search-form");
const gallery = document.querySelector(".gallery");
const button = document.querySelector(".load-more");
const dataJson = new API();


form.addEventListener("submit", onSubmit);
button.addEventListener("click", onLoadMore);

button.setAttribute("disabled", true);

const lightBox = new SimpleLightbox(".gallery a", { loop: true, enableKeyboard: true, docClose: true, });

async function getFetch() {
    const parseData = await dataJson.onFetch()
    const markUp = await renderMarkUp(parseData)
    const render = await onRender(markUp)
    return render;
};

function onSubmit(e) {
    e.preventDefault();
    button.removeAttribute("disabled");
    dataJson.query = e.currentTarget.elements.searchQuery.value.trim();
    if (dataJson.query === '') {
        button.setAttribute("disabled", true);
        return Notify.warning("Please enter your request");
    }

    onClear();
    dataJson.resetPage();
    try {
        dataJson.onFetch()
            .then((object) => {
                checkResponse(object);
                return renderMarkUp(object);
            })
        .then(onRender)
    } catch {
        onError();
    }
};

function checkEndOfResult(object) {
    if (object.hits.length < dataJson.per_page) {
        console.log(dataJson.per_page);
        button.setAttribute("disabled", true);
        return Notify.info('We`re sorry, but you`ve reached the end of search results.');
    }
}

function checkResponse (object) {
    if (object.total === 0) {
        button.setAttribute("disabled", true);
        return Notify.failure("Sorry, there are no images matching your search query. Please try again.")
    }
    button.removeAttribute("disabled");
    Notify.success(`Hooray! We found ${object.totalHits} images.`);
    checkEndOfResult(object);
}


function renderMarkUp(markup) {
    return markup.hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
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
        dataJson.onFetch()
            .then((object) => {
                checkEndOfResult(object);
                return renderMarkUp(object);
            })
        .then(onRender)
};

function onError() {
    button.setAttribute("disabled", true);
    return Notify.failure("Oops, that went wrong. Please try again later");
};