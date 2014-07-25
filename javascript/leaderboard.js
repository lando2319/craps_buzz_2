function getLeaderboard($scope, $http)
{
  $http({method: 'GET', url: 'http://localhost:3000/api/users'}).
  //$http({method: 'GET', url: 'http://lando2319-craps_buzz_leaderboard.nodejitsu.com/api/users'}).
    success(function(data, status, headers, config) {
      // this callback will be called asynchronously
      // when the response is available
//      console.log(data)
      angular.forEach(data, function(value, key) {
       // console.log(value)
        console.log(key)
        $scope.leaders.push({rank: key + 1, name: value.name, cashout_amount: value.cashout_amount})
      })

    }).
    error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
}
function runLeaderboard($scope) {
  
}
