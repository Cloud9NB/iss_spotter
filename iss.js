const request = require('request');

const fetchMyIP = (callback) => {
  const url = 'https://api.ipify.org/?format=json';
  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const data = JSON.parse(body);
    
    if (data) {
      callback(error, data);
    }
  });
};

const fetchCoordsByIP = (ip, callback) => {
  const url = 'https://api.freegeoip.app/json?apikey=a7f07480-a673-11ec-87a6-cb07e9ff9875';
  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const dataLa = JSON.parse(body).latitude;
    const data1 = JSON.parse(body).longitude;
    if (dataLa) {
      callback(error, {latitude: dataLa, longitude: data1});
    }
  });
};

const fetchISSFlyOverTimes = (coordinates, callback) => {
  const url = `https://iss-pass.herokuapp.com/json/?lat=${coordinates.latitude}&lon=${coordinates.longitude}`;

  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
      return;
    }

    const passes = JSON.parse(body).response;
    callback(null, passes);
  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };