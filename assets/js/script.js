const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'fbf54e1fafmsh5891b6dfc646e7bp12d715jsn345a8e06d44e',
		'X-RapidAPI-Host': 'tasty.p.rapidapi.com'
	}
};
function getDescription(dishname){
    fetch("https://tasty.p.rapidapi.com/recipes/auto-complete?prefix="+dishname, options).then(response =>response.json())
    .then(response=> console.log(response))
}   
getDescription("chicken pasta")