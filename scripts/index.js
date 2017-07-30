

var apiKey = "AIzaSyA8npgUCZkdREHcaa86iHfS8h3u2FOgK1E";

function findPostcodeFromResults(resultsObject) {

  var address_components = resultsObject.results[0].address_components;
  var postcode = "";

  // if we find a postcode use it, else use lat long to get it
  $.each(address_components, function (index, value) {
    if (value.types[0] == "postal_code") {
      postcode = value.long_name;
    }
  });

  return postcode;
}

function showPostcode(data) {
  if (data != null) {
    var resultsObject = JSON.parse(JSON.stringify(data));

    if (resultsObject.status == "ZERO_RESULTS") {
      lookupError();
      return false;
    } else {
      var postcode = findPostcodeFromResults(resultsObject);

      if (postcode == "") {
        var geoLocation = resultsObject.results[0].geometry.location;
        getPostcodeFromLatLong(geoLocation.lat, geoLocation.lng);
        return false;
      }

      var msg = tokenReplace(
        "%0% (%1%)" ,
        postcode, 
        resultsObject.results[0].formatted_address);

      $("#postcode").html(msg);

      $("#error").hide();
      $("#postcode").show();
    }
  }
}


function getPostcode(address) {
  var url = tokenReplace(
    "https://maps.googleapis.com/maps/api/geocode/json?&address=%0%&key=%1%",
    encodeURI(address),
    apiKey);

  $.ajax({
    method: "GET",
    url: url,
    success: showPostcode
  });

}

function getPostcodeFromLatLong(lat, lng) {
 
    var url = tokenReplace(
      "https://maps.googleapis.com/maps/api/geocode/json?latlng=%0%,%1%&key=%2%",
      lat,
      lng,
      apiKey);

  $.ajax({
    method: "GET",
    url: url,
    success: showPostcode
  });

}

function lookupError() {
  $("#error").html("This location could not be found");
  $("#postcode").hide();
  $("#error").show();
};

function submitClick() {
  var location = $("#location").val();
  getPostcode(location);

  // don't post (w ecould also have passed e and done .preventDefault)
  return false;
}

$("#submit").on("click", submitClick);