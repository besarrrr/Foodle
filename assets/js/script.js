var foodInputEl = document.querySelector('#foodinput');
var userFormEl = document.querySelector('#user-form');
let btnBack = document.querySelector("#btnBack");
let btnNext = document.querySelector("#btnNext");
var offset = 0;
var pageSize = 20;
var searchText;
// User Input Call

// Search for Recipe
var formSubmitHandler = function (event) {
	event.preventDefault();
	searchText = foodInputEl.value.trim();
	offset = 0;

	if (searchText) {
		showLoadingMessage();
		getSearchResults(searchText).then((data) => {
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
	getRecipeDetails(id).then(details => {
		displayRecipeDetails(details)
		console.log(details)
	});
});

// Save Recipe to favorites
$('body').on('click', '.recipe-save', function(e){
	/**
	 * Get the index from button data
	 * check if already saved, delete from saved list
	 * otherwise save data to localStorage
	 */
});

// Save data to localStorage
function saveToLocalStorage(recipe) {
	// TODO
}

// Unsave from localStorage
function deleteFromLocalStorage(recipe) {
	// TODO
}

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
		'X-RapidAPI-Key': 'fbf54e1fafmsh5891b6dfc646e7bp12d715jsn345a8e06d44e',
		'X-RapidAPI-Host': 'tasty.p.rapidapi.com'
	}
};

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
// user submit event listener 
userFormEl.addEventListener("submit", formSubmitHandler);



// Display Result
function displayResults(data) {
	$("button").prop("disabled", false);
	var htmlResult = [];
	if (!data || !data.results.length) {
		// display error results
		return;
	}
	for (let i = 0; i < data.results.length; i++) {
		let result = data.results[i];
		let html = `
		<div class="box">
		<img class="recipe-image" id="img_${i}" data-id="${result.id}" height="100" width="100" alt="${result.thumbnail_alt_text}" src="${result.thumbnail_url}">
		<span>${result.name}</span>
		<p>${result.description || ''}</p>
		<button class=" button is-primary is-rounded" data-index="${i}"> Save </button>
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

function displayRecipeDetails(data){
	
	const instructionsHtml = [];
	for (let i=0; i<data.instructions.length;i++){
		let instruction = data.instructions[i];
		instructionsHtml.push(`<li>${instruction.display_text}</li>`)
	}	
	const html = `
	<div id="picture" class="box">
		<img alt="${data.thumbnail_alt_text}" src="${data.thumbnail_url}">
	</div>
	<div id="description">
		${data.description}
	</div>
	<div>
		<ol>
			${instructionsHtml.join('')}
		</ol>
	</div>`;
	$("#recipe-details").html(html);
	
}

// Show loading message
function showLoadingMessage() {
	$("#recipes").html("loading...");
	$("button").prop("disabled", true);
}