function Leaderboard($scope, $http)
{
  $http({method: 'GET', url: 'http://lando2319-craps_buzz_leaderboard.nodejitsu.com/api/users'}).
    success(function(data, status, headers, config) {
      // this callback will be called asynchronously
      // when the response is available
      console.log(data)
    }).
    error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
}
