function runLeaderboard($scope) {

  angular.forEach($scope.leaders, function(value) {
    if (value.cashout_amount < $scope.bank_roll_actual) {
      if (value.rank < $scope.available_leaderboard_position) {
        $scope.available_leaderboard_position = value.rank
      } else {
      }
    } else {
      $scope.available_leaderboard_position = 11
    }
  })

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
    }).
    error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
}

function messageLeaderboard($scope) {
  if ($scope.available_leaderboard_position != 11) {
    $scope.player_game_calls.push({call_actual: "Cashout now and rank " + $scope.available_leaderboard_position + " on the Leaderboard"})
  }
}

function dummyLeaderboard($scope) {
  if ($scope.available_leaderboard_position != 11 ) {
    $scope.distance_to_first = "Earn " + ($scope.leaders[0].cashout_amount - $scope.bank_roll_actual + 1) + " more coins to rank Number 1."
    $scope.available_leaderboard_position_message = "Cashout now to be ranked " + $scope.available_leaderboard_position + " on the leaderboard. "
    $scope.cashout_amount_message = "Cashout with " + ($scope.bank_roll_actual) + " Coins"
    if ($scope.available_leaderboard_position == 1) {
      $scope.distance_to_first = ""
    }
  } else {
    $scope.last_one_on_leaderboard = $scope.leaders[$scope.leaders.length - 1]
    $scope.available_leaderboard_position_message = "You Need " + ($scope.last_one_on_leaderboard.cashout_amount - $scope.bank_roll_actual + 1) + " More Coins to make the Leaderboard. "
    $scope.distance_to_first = ""
    $scope.cashout_amount_message = "Need " + (last_one_on_leaderboard.cashout_amount - $scope.bank_roll_actual + 1) + " Coins to Cashout"
  }
}
