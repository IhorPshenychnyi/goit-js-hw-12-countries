import fetchCountries from './js/fetchCountries';
import countryCardTpl from './templates/country-card.hbs';
import countriesListTpl from './templates/countries-list.hbs';
import './sass/main.scss'

const debounce = require('lodash.debounce');

import { error } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';
import "@pnotify/core/dist/PNotify.css";

const refs = {
    cardContainer: document.querySelector('.js-card-container'),
    searchForm: document.querySelector('.input-js'),
    listBox: document.querySelector('.container-list')
}

refs.searchForm.addEventListener('input', debounce(onInputChange, 500));

function onInputChange(evt) {
    const searchQuery = evt.target.value.trim();

    if (searchQuery === '') {
        refs.listBox.innerHTML = '';
        return
    };

    fetchCountries(searchQuery)
        .then(renderCountriesMarkup)
        .catch(error => console.log(error))
  
}

function renderCountriesMarkup(countriesArray) {
    if (countriesArray.length === 1) {
        renderCountryCard(countriesArray);
    } else if (countriesArray.length <= 10) {
        renderCountriesList(countriesArray);
    } else {
        errorMessage();
    }
}

function renderCountryCard(country) {
    const markup = countryCardTpl(country);
    refs.cardContainer.innerHTML = markup;
    refs.listBox.innerHTML = '';
    refs.searchForm.value = '';
}

function renderCountriesList(country) {
    const markupList = countriesListTpl(country);
    refs.listBox.innerHTML = markupList;
    refs.cardContainer.innerHTML = '';
}

function errorMessage() {
    error({
        text: "Too many matches found. Please enter a more specific query.",
        delay: 3000
    });
    refs.listBox.innerHTML = '';
    refs.cardContainer.innerHTML = '';
}


refs.listBox.addEventListener('click', onClick)

function onClick(e) {
    const text = e.target.textContent;
    
    fetchCountries(text)
        .then(renderCountryCard)
        .catch(error => console.log(error))
    
    refs.listBox.innerHTML = '';
}

window.addEventListener('keydown', onEnterKeyPress);

function onEnterKeyPress(e) {
    if (e.code === 'Enter') {
        const text = e.target.textContent.trim();
        
        fetchCountries(text)
        .then(renderCountryCard)
        .catch(error => console.log(error))
    
    refs.listBox.innerHTML = '';
    }
}

window.addEventListener('keydown', onEscKeyPress);

function onEscKeyPress(e) {
    if (e.code === 'Escape') {
        refs.listBox.innerHTML = '';
        refs.cardContainer.innerHTML = '';
        refs.searchForm.value = '';
    }
}