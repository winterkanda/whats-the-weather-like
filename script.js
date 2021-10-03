$(document).ready(function () {
  var query = "";
  var currentURL = "";
  var pastSearches = $("#pastSearches");
  var currentDate = $("#currentDate");
  var results = $("#results");

  var cities = [];
  var city = "";
  var url = "";
  var APIkey = "";

  var todaysForecast = $("#todaysForecast");
  var showCity = $("#showCity");
  var fiveDayForecast = $("#fiveDayForecast");

  //empty arrays
  clickList();
  loadCities();

  //pulls saved cities from local storage and fills array
  function loadCities() {
    let savedCities = JSON.parse(localStorage.getItem("cities"));

    if (savedCities !== null) {
      cities = savedCities;
    }

    renderSearches();
  }

  //stores cities in localStorage
  function savedCities() {
    localStorage.setItem("cities", JSON.stringify(cities));
  }

  //search buttons
  function renderSearches() {
    //empty container
    $(pastSearches).html("");

    //creates buttons from the stored data
    if (cities == null) {
      return;
    }
    let uniqueCities = [...new Set(cities)];
    for (let i = 0; i < uniqueCities.length; i++) {
      var cityName = uniqueCities[i];

      var buttonEl = $("<button>");
      $(buttonEl).text(cityName);
      $(buttonEl).addClass("cityBtn");

      $(pastSearches).append(buttonEl);
      clickList();
    }
  }

  //these search history buttons can pull up search data from the past
  function clickList() {
    $(".cityBtn").on("click", function (event) {
      event.preventDefault();
      console.log("Text...");
      city = $(this).text().trim();
      callAPI();
    });
  }

  //API calls for current weather data and for five-day forecast
  function callAPI() {
    console.log(city)

    //unhide content divs
    $(todaysForecast).removeClass("hidden");
    $(fiveDayForecast).removeClass("hidden");

    url = "https://api.openweathermap.org/data/2.5/forecast?q=";
    currentURL = "https://api.openweathermap.org/data/2.5/weather?q=";
    APIkey = "&appid=119963be56e4b54eb8cc1b36349a2d7c";
    
    var units = "&units=imperial";

    query = url + city + APIkey + units;
    currentWeatherUrl = currentURL + city + APIkey + units;

    $(showCity).text("Today's Weather In " + city );
    $.ajax({
      url: query,
      method: "GET",
    }).then(function (response) {
        console.log("forecast",response)
      let dayNum = 0;

      for (let i = 0; i < response.list.length; i++) {
        if (response.list[i].dt_txt.split(" ")[1] == "15:00:00") {
          var day = response.list[i].dt_txt.split("-")[2].split(" ")[0];
          var month = response.list[i].dt_txt.split("-")[1];
          var year = response.list[i].dt_txt.split("-")[0];

          $("#" + dayNum + "date").text(month + "/" + day + "/" + year);

          var temp = Math.round(response.list[i].main.temp);

          $("#" + dayNum + "fiveDayHumidity").text(
            "Humidity: " + response.list[i].main.humidity
          );
          $("#" + dayNum + "fiveDayTemp").text(
            "Temperature: " + temp + String.fromCharCode(176) + "F"
          );
          $("#" + dayNum + "fiveDayImage").attr(
            "src",
            "http://openweathermap.org/img/w/" +
              response.list[i].weather[0].icon +
              ".png"
          );

          dayNum++;
        }
      }
    });

    //Appending data to the page
    $.ajax({
      url: currentWeatherUrl,
      method: "GET",
    }).then(function (current_data) {
      console.log(current_data);
      var temp = Math.round(current_data.main.temp);
      console.log("Current Temperature in " + city + " is: " + temp);
      $("#humidity").html("<span class='font-weight-bold'>Humidity:</span> " + current_data.main.humidity);
      $("#temp").html("<span class='font-weight-bold'>Temperature:</span> " + temp + String.fromCharCode(176) + "F");
      $("#windSpeed").html("<span class='font-weight-bold'>Wind Speed:</span> " + current_data.wind.speed);

      $("#todayImage").attr({
        src:
          "http://openweathermap.org/img/w/" +
          current_data.weather[0].icon +
          ".png",
        height: "100px",
        width: "100px",
      });

      var lat = current_data.coord.lat
      var lon = current_data.coord.lon

    //   $.ajax({
    //       url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${APIkey}`,
    //       method: "GET"
    //   })
    //   .then(function (uv_data) {
    //       console.log("uv_data", uv_data)
    //   })

    });
  }

  //clear function
  $("#trash").on("click", function () {
    //clear localStorage
    if (localStorage.length > 0) {
      localStorage.clear();
    }

    //to clear all buttons
    $(pastSearches).html("");
  });

  //listener for the search bar
  $("#searchButton").on("click", function (event) {
    event.preventDefault();
    console.log("clicked")

    city = $("#searchTerm").val().trim();

    cities.push(city);

    if (cities.length > 6) {
      cities.shift();
    }

    if (city == "") {
        return;
    }

    callAPI();
    savedCities();
    renderSearches();
  });
});
