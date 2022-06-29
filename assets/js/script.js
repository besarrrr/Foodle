const foodInputEl = document.querySelector('#foodinput');
const userFormEl = document.querySelector('#user-form');
const btnBack = document.querySelector("#btnBack");
const btnNext = document.querySelector("#btnNext");
const lnkFavorites = document.querySelector('#show-favorites');

let offset = 0;
const pageSize = 20;
let searchText;
let favorites = getSavedFavorites();
let currentResults;

// User Input Call

// Search for Recipe
let formSubmitHandler = function (event) {
	event.preventDefault();
	searchText = foodInputEl.value.trim();
	offset = 0;

	if (searchText) {
		showLoadingMessage();
		getSearchResults(searchText).then((data) => {
			currentResults = data.results;
			displayResults(data);
		});
		foodInputEl.value = "";

	} else {
		alert("Please enter a valid food item/category")
	}
};

// Recipe Image Click
$('body').on('click', '.recipe-image', function (e) {
	// TODO: Show loading message
	let id = $(this).data('id');
	let recipeName = $(this).data('recipeName');
	getRecipeDetails(id).then(details => {
		displayRecipeDetails(details);
	});
	getRelatedVideo(recipeName).then((videoData) => {
		displayRelatedVideo(videoData)
	})
});

// Save Recipe to favorites
$('body').on('click', '.recipe-save', function (e) {
	const clickedBtn = $(this);
	const index = clickedBtn.data('index');
	const recipe = currentResults[index];
	if (clickedBtn.text() === 'Save') {
		favorites[recipe.id] = recipe;
		clickedBtn.text('Unsave');
	} else {
		delete favorites[recipe.id];
		clickedBtn.text('Save');
	}
	saveFavorites();
});

lnkFavorites.addEventListener("click", function(){
	console.log('clicked!!!');
	displayFavorites();
});

// Next Btn Click
btnNext.addEventListener("click", function () {
	showLoadingMessage();
	offset = offset + pageSize;
	getSearchResults(searchText).then((data) => {
		displayResults(data);
	});
});

//Back Btn Click
btnBack.addEventListener("click", function () {
	showLoadingMessage();
	offset = offset - pageSize;
	getSearchResults(searchText).then((data) => {
		displayResults(data);
	});
});

//API Call
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '236b39056emsh08f3b62cbf76b32p1cf617jsnbd1f682203c0',
		'X-RapidAPI-Host': 'tasty.p.rapidapi.com'
	}
};

function saveFavorites() {
	localStorage.setItem('favorite-recipes', JSON.stringify(favorites));
}

function getSavedFavorites() {
	const favoritesString = localStorage.getItem('favorite-recipes');

	if (favoritesString) {
		return JSON.parse(favoritesString);
	}

	return {};
}

//Youtube Api Key
const googleApiKey = 'AIzaSyDHiwkvwoFglesNlXjFG7GUi8JU_Vp8x-g';

//Fetch Search Result
function getSearchResults(dishname) {
	return fetch('https://tasty.p.rapidapi.com/recipes/list?from=' + offset + '&size=' + pageSize + '&q=' + dishname, options)
		.then(response => response.json());
}

//Fetch Detail Data
function getRecipeDetails(id) {
	return fetch('https://tasty.p.rapidapi.com/recipes/get-more-info?id=' + id, options)
		.then(response => response.json());
}

//Fetch Video Display
function getRelatedVideo(recipeName) {
	return fetch(`https://www.googleapis.com/youtube/v3/search?key=${googleApiKey}&part=snippet&q=` + encodeURIComponent(recipeName))
		.then(response => response.json());
}
// user submit event listener 
userFormEl.addEventListener("submit", formSubmitHandler);


// Display Result
function displayResults(data) {
	$("button").prop("disabled", false);
	let htmlResult = [];
	if (!data || !data.results.length) {
		$("#recipes").html('nothing to show here');
		return;
	}
	for (let i = 0; i < data.results.length; i++) {
		let result = data.results[i];
		let saveText = (favorites[result.id]) ? 'Unsave' : 'Save';
		let html = `
		<div class="box">
		<div><img class="recipe-image" id="img_${i}" data-recipe-name="${result.name}" data-id="${result.id}" height="100" width="100" alt="${result.thumbnail_alt_text}" src="${result.thumbnail_url}"></div>
		<span>${result.name}</span>
		<p>${result.description || ''}</p>
		<button class="recipe-save button is-primary is-rounded" data-index="${i}">${saveText}</button>
		</div>
		`;
		htmlResult.push(html);
	}
	$("#recipes").html(htmlResult.join(""));

	// Hide/Show Previous and Next Btn
	if (offset >= pageSize) {
		// Show
		btnBack.classList.remove("hidden");

	} else {
		// Hide
		btnBack.classList.add("hidden");
	}
	if ((offset + pageSize) < data.count) {
		// Show
		btnNext.classList.remove("hidden");
	} else {
		// Hides
		btnNext.classList.add("hidden");

	}
}

function displayRecipeDetails(data) {
	const instructionsHtml = [];
	for (let i = 0; i < data.instructions.length; i++) {
		let instruction = data.instructions[i];
		instructionsHtml.push(`<li>${instruction.display_text}</li>`)
	}
	const html = `
	<div id="picture" class="box">
		<img alt="${data.thumbnail_alt_text}" src="${data.thumbnail_url}">
	</div>
	<div id="description">
		${data.description || " Description not available"}
	</div>
	<div>
		<div>
			${instructionsHtml.join('')}
		</div>
		<hr/>
	</div>`;
	$("#recipe-details").html(html);
}

function displayRelatedVideo(videoData) {

	let html = '';
	if (videoData.items.length > 0) {
		html = `
		<iframe width="560" height="315" 
			src="https://www.youtube.com/embed/${videoData.items[0].id.videoId}"
			title="YouTube video player" frameborder="0" 
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
	}
	$('#related-video').html(html);

}

function displayFavorites() {
	const favArray = Object.values(favorites);
	currentResults = favArray;
	displayResults({
		results: favArray,
		count: favArray.length
	})
}

// Show loading message
function showLoadingMessage() {
	$("#recipes").html("loading...");
	$("button").prop("disabled", true);
}