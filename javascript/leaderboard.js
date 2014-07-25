function runLeaderboard($scope) {
  angular.forEach($scope.leaders, function(value) {
    if (value.cashout_amount < $scope.bank_roll_actual) {
      $scope.available_leaderboard_position = value.rank
    } else {
      $scope.available_leaderboard_position = 0
    }
  })

  var distance_to_first = "Earn " + ($scope.leaders[0].cashout_amount - $scope.bank_roll_actual + 1) + " more coins and you'll be able to rank Number 1"

  if ($scope.available_leaderboard_position > 0 ) {
    $scope.available_leaderboard_position_message = "Cashout now to grab the number " + $scope.available_leaderboard_position + " slot on the leaderboard. " + distance_to_first
    $scope.player_game_calls.push({call_actual: "Cashout now to rank " + $scope.available_leaderboard_position})
  } else {
    $scope.available_leaderboard_position_message = "Earn " + ($scope.leaders[9].cashout_amount - $scope.bank_roll_actual + 1) + " more coins to grab a slot on the leaderboard. " + distance_to_first
  }
}

function getLeaderboard($scope, $http)
{
  $http({method: 'GET', url: 'http://localhost:3000/api/users'}).
  //$http({method: 'GET', url: 'http://lando2319-craps_buzz_leaderboard.nodejitsu.com/api/users'}).
    success(function(data, status, headers, config) {
      // this callback will be called asynchronously
      // when the response is available
      angular.forEach(data, function(value, key) {
        $scope.leaders.push({rank: key + 1, name: value.name, cashout_amount: value.cashout_amount})
      })
      runLeaderboard($scope)

    }).
    error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
}
