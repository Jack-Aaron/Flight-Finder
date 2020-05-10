$(document).ready(function () {
	// we'll need two variables, one for each city on each end of the flight
	var departure;
	var destination;
	var price = 0;

	var selectAirports = $("<form>");
	var airports = $("<figure>");
	var displayAirportsOptions = $("#displayAirportOptions");


	// submit button is attached the div with ID: currency-picker
	$("#currency-picker").on('change', function () {
		fetch(`https://currency-exchange.p.rapidapi.com/exchange?q=1.0&from=USD&to=${this.value}`, {
			"method": "GET",
			"headers": {
				"x-rapidapi-host": "currency-exchange.p.rapidapi.com",
				"x-rapidapi-key": "ee974abcfbmsh2bbdc194e450a08p14b169jsnf711e272c365"
			}
		})
			.then(response => response.json())
			.then(response => {
				var conversionRate = response;
				var convertedPrice = conversionRate * price;
				var convertedPriceFloat2 = convertedPrice.toFixed(2);
				function numberWithCommas(x) {
					return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				}
				var finalPrice = numberWithCommas(convertedPriceFloat2);
				$("#displayConversion").text(finalPrice + " " + `${this.value}`);

			})
			.catch(err => {
				console.log(err);
			});
	})


	// submit button is attached the div with ID: AirportSelectionButton
	$(".container").on('change', "#SelectAirports", function (event) {
		event.preventDefault();
		var departureAirport = $("#DepartureAirports").val();
		var destinationAirport = $("#DestinationAirports").val();
		console.log(departureAirport);
		console.log(destinationAirport);

		fetch(`https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/${departureAirport}/${destinationAirport}/2020-05-12?inboundpartialdate=2020-08-01`, {
			"method": "GET",
			"headers": {
				"x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
				"x-rapidapi-key": "ee974abcfbmsh2bbdc194e450a08p14b169jsnf711e272c365"
			}
		})
			.then(response => {
				return response.json();
			})
			.then(response => {
				console.log(response);
				price = response.Quotes[0].MinPrice;
				console.log(price);

				$("#displayUSDPrice").text("$" + price + ".00");
			})
			.catch(err => {
				console.log(err);
			});


	});


	// submit button is attached the div with ID: flightform
	$("#search").on('click', function (event) {
		event.preventDefault();
		// empty out the section for the new incoming stuff
		airports.empty();
		// get user inputs of cities
		var departure = $("#departure").val();
		var destination = $("#destination").val();
		// run the api call functions for once for each city
		if (departure !== "" && destination !== "") {
			citySearch(departure, "Departure"); // (2nd parameters are for future ID names)
			citySearch(destination, "Destination"); // ^^
		}
	})

	async function citySearch(city, type) {
		city.toUpperCase;
		airports.attr("id", "AirportsContainer");
		airports.attr("class", "container");
		airports.attr("style", "text-align:center");
		
		displayAirportsOptions.append(airports);
		// call API for the ${city} query
		fetch(`https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/?query=${city}`, {
			"method": "GET",
			"headers": {
				"x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
				"x-rapidapi-key": "ee974abcfbmsh2bbdc194e450a08p14b169jsnf711e272c365"
			}
		})
			.then(response => {
				return response.json();
			})
			.then(response => {
				console.log(response)

				// we will be making a dropdown menu for user to select the airport of the city
				selectAirports.attr("id", "SelectAirports");
				selectAirports.attr("class", "form");
				airports.append(selectAirports);


				// creating a select element
				var chooseAirport = $("<select>")
				// give the airport selection menu an ID named after city
				chooseAirport.attr("id", `${type}Airports`)
				// appending it to the "airports" area of page
				selectAirports.prepend(chooseAirport);
				//this selection is for user to know what they are selecting
				chooseAirport.append(`<option value="none">Select ${type} City's Airport</option>`)
				// for each place (airport)
				response.Places.forEach(place => {
					
					// value for each selection is the Place ID, name shown is PlaceName
					chooseAirport.append(`<option value="${place.PlaceId}">${place.PlaceName}</option>`)
				});
			})
			.catch(err => {
				console.log(err);
			});
	}
})