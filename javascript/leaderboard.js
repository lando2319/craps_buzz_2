function runLeaderboard($scope) {
  $scope.available_leaderboard_position = 11
  angular.forEach($scope.reverse_leaders, function(value) {
    if (value.cashout_amount < $scope.bank_roll_actual) {
      $scope.available_leaderboard_position = value.rank
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
        $scope.reverse_leaders.push({rank: key + 1, name: value.name, cashout_amount: value.cashout_amount})
      })
      $scope.dummy_reverse_leaders = $scope.reverse_leaders.reverse()
    }).
    error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
}

function messageLeaderboard($scope) {
  if ($scope.available_leaderboard_position == 11) {
    $scope.distance_to_leaderboard_message = "You Need " + ($scope.leaders[$scope.leaders.length - 1].cashout_amount - $scope.bank_roll_actual + 1) + " Coins to make the leaderboard"
    $scope.distance_to_first_message = "You Need " + ($scope.leaders[0].cashout_amount - $scope.bank_roll_actual + 1) + " Coins to rank number 1"
    $scope.cashout_ranking_message = ""
  } 
  if ($scope.available_leaderboard_position < 11) {
    $scope.distance_to_first_message = "You Need " + ($scope.leaders[0].cashout_amount - $scope.bank_roll_actual + 1) + " Coins to rank number 1"
    $scope.distance_to_leaderboard_message = ""
    $scope.cashout_ranking_message = "Cashout Now and rank " + ($scope.available_leaderboard_position) + " on the Leaderboard"
  }
  if ($scope.available_leaderboard_position == 1) {
    $scope.distance_to_first_message = ""
    $scope.distance_to_leaderboard_message = ""
    $scope.cashout_ranking_message = "Cashout Now and rank " + ($scope.available_leaderboard_position) + " on the Leaderboard"
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
