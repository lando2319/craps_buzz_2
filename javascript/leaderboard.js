function runLeaderboard($scope) {
  angular.forEach($scope.leaders, function(value) {
    console.log(value)
    console.log($scope.available_leaderboard_position)
    if (value.cashout_amount < $scope.bank_roll_actual) {
      if (value.rank < $scope.available_leaderboard_position) {
        $scope.available_leaderboard_position = value.rank
      } else {
      }
    } else {
      $scope.available_leaderboard_position = 11
    }
  })


  if ($scope.available_leaderboard_position != 11 ) {
    $scope.distance_to_first = "Earn " + ($scope.leaders[0].cashout_amount - $scope.bank_roll_actual + 1) + " more coins to rank Number 1."
    $scope.available_leaderboard_position_message = "Cashout now to be ranked " + $scope.available_leaderboard_position + " on the leaderboard. "
    $scope.player_game_calls.push({call_actual: "Cashout now and rank " + $scope.available_leaderboard_position + " on the Leaderboard"})
    if ($scope.available_leaderboard_position == 1) {
      $scope.distance_to_first = ""
    }
  } else {
    var last_one = $scope.leaders.pop()
//    console.log(last_one)
    $scope.available_leaderboard_position_message = "You Need " + (last_one.cashout_amount - $scope.bank_roll_actual + 1) + " More Coins to make the Leaderboard. "
    $scope.distance_to_first = ""
  }
}

function getLeaderboard($scope, $http)
{
  $http({method: 'GET', url: 'http://lando2319-craps_buzz_leaderboard.nodejitsu.com/api/users'}).
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
