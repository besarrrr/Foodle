var foodInputEl = document.querySelector('#foodinput');
var userFormEl = document.querySelector('#user-form');

 // User Input Call

 var formSubmitHandler = function(event) {
    	event.preventDefault();
     var dishname = foodInputEl.value.trim();
   
    if (dishname) {
       getDescription(dishname)
        foodInputEl.value = "";

    } else {
        alert("Please enter a valid food item/category")
    }

 };

 //API Call
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'fbf54e1fafmsh5891b6dfc646e7bp12d715jsn345a8e06d44e',
		'X-RapidAPI-Host': 'tasty.p.rapidapi.com'
	}
};
function getDescription(dishname){
    fetch('https://tasty.p.rapidapi.com/recipes/list?from=0&size=20&q=' + dishname, options)
	.then(response => response.json())
	.then(response => console.log(response))
	.catch(err => console.error(err));
}   


// user submit event listener 
userFormEl.addEventListener("submit", formSubmitHandler);