
var crapsGame = angular.module('crapsGame', ['ngAnimate']);

crapsGame.service('diceService', function() {
  this.change_denomination = function(a) {
    if (a == 1) {
        return 5
    } else if (a == 5) {
        return 25
    } else {
        return 1
    }
  }
 
});

crapsGame.controller('crapsGameplay', ['$scope', '$timeout', 'diceService', '$http', function($scope, $timeout, diceService, $http) {
  getLeaderboard($scope, $http)
  OpeningBetValues($scope)

  $scope.enterLeaderboard = function(){
    $scope.formData.cashout_amount = $scope.bank_roll_actual
    $http({method: 'POST', url: 'http://lando2319-craps_buzz_leaderboard_2.nodejitsu.com/api/users/create', data:$scope.formData }).
//    $http({method: 'POST', url: 'http://192.168.8.103:3000/api/users/create', data:$scope.formData }).
      success(function(data, status, headers, config) {
        // empty the form
        $scope.formData = {};
        window.location.reload()
      }).
      error(function(data, status, headers, config) {
        alert('error on the server')
      });

  }

  $scope.increase_decrease_button = function() { $scope.increase_decrease == "+" ? $scope.increase_decrease = "-" : $scope.increase_decrease = "+" }
  $scope.bet_denomination_button = function() {
    $scope.bet_denomination = diceService.change_denomination($scope.bet_denomination)
  }

  function BankRollChecker(value) {
      if ($scope.increase_decrease == "+") {
          if ($scope.bank_roll_actual - $scope.bet_denomination < 0) {
              $scope.no_bet_not_enough_funds = "NO BET! Not Enough Funds."
          } else {
              $scope[value] += $scope.bet_denomination
              $scope.no_bet_not_enough_funds = ""
          }
      } else {
          if ($scope[value] - $scope.bet_denomination < 0) {
              $scope.no_bet_not_enough_funds = "To Add to a Bet Click on \"-\" to change -/+"
          } else {
              $scope[value] -= $scope.bet_denomination
              $scope.no_bet_not_enough_funds = ""
          }
      }
  }

  var pointNumVars = ['4','5','6','8','9','10'];
  var writtenWord = {'4':'Four', '5':'Five', '6':'Six', '8':'Eight', '9':'Nine', '10':'Ten'};
  var placeBetOdds = {'4':1.8, '5':1.4, '6':1.2, '8':1.2, '9':1.4, '10':1.8};
  var namedPlaceBetOdds = {'4':'(5 pays 9)', '5':'(5 pays 7)', '6':'(6 pays 7)', '8':'(6 pays 7)', '9':'(5 pays 7)', '10':'(5 pays 9)'};

  angular.forEach(pointNumVars, function(value) {
        $scope['place_bet_on_'+value+'_button'] = function() {
            BankRollChecker('place_bet_on_the_'+value)
            if ($scope['place_bet_on_the_'+value] > 0) {
                var game_helper_modal_headline = "Place Bet on "+writtenWord[value]
                var game_helper_modal_win_lose = "WINS ON "+writtenWord[value]+". LOSES ON Seven. Your bet of "+$scope['place_bet_on_the_'+value]+" Coins pays "+($scope['place_bet_on_the_'+value]*placeBetOdds[value])+" Coins "+namedPlaceBetOdds[value]+". Place bets are off on the Come Out Roll. Override by checking box in the  \"Adv\" Section."
                var game_helper_modal_id = "#place_bet_on_"+value+"_modal"
                var game_helper_modal_message = "You Bet a " + game_helper_modal_headline+ " for " + $scope['place_bet_on_the_'+value]+" Coins"
                PlayerGameCalls($scope, "INFO", game_helper_modal_id, game_helper_modal_message, game_helper_modal_headline, game_helper_modal_win_lose)
            }
        }
        $scope['come_bet_odds_on_'+value+'_button'] = function() {
            BankRollChecker('come_bet_odds_on_'+value)
            if ($scope['come_bet_odds_on_'+value] > 0) {
                var game_helper_modal_headline = "Odds On Your Come Bet on "+writtenWord[value]
                var game_helper_modal_win_lose = "WINS ON "+writtenWord[value]+". LOSES ON Seven. "
                var game_helper_modal_id = "#come_bet_odds_on_"+value+"_modal"
                var game_helper_modal_message = "You Placed " + game_helper_modal_headline+ " for " + $scope['come_bet_odds_on_'+value]+" Coins"
                PlayerGameCalls($scope, "INFO", game_helper_modal_id, game_helper_modal_message, game_helper_modal_headline, game_helper_modal_win_lose)
            }
        }
        $scope['dont_come_bet_lay_on_'+value+'_button'] = function() {
            BankRollChecker('dont_come_bet_lay_on_'+value)
            if ($scope['dont_come_bet_lay_on_'+value] > 0) {
                var game_helper_modal_headline = "Lay On Your Don't Come Bet on "+writtenWord[value]
                var game_helper_modal_win_lose = "Loses ON "+writtenWord[value]+". WINS ON Seven. "
                var game_helper_modal_id = "#dont_come_bet_lay_on_"+value+"_modal"
                var game_helper_modal_message = "You Placed " + game_helper_modal_headline+ " for " + $scope['dont_come_bet_lay_on_'+value]+" Coins"
                PlayerGameCalls($scope, "INFO", game_helper_modal_id, game_helper_modal_message, game_helper_modal_headline, game_helper_modal_win_lose)
            }
        }
  })

  var gameButtonsMisc = ['place_come_bet', 'line_bet', 'odds_behind_the_line', 'dont_pass_line_bet', 'odds_behind_the_dont_pass_line', 'prop_bet_red', 
      'prop_bet_craps', 'prop_bet_hard_6', 'prop_bet_hard_8', 'prop_bet_hard_4', 'prop_bet_hard_10', 'prop_bet_on_1_1', 'prop_bet_on_2_1', 
      'prop_bet_on_6_6', 'prop_bet_on_6_5','prop_bet_on_6_1', 'prop_bet_on_5_2', 'prop_bet_on_4_3', 'prop_bet_on_3_1', 'prop_bet_on_2_2', 'prop_bet_on_3_2', 
      'prop_bet_on_4_1', 'prop_bet_on_5_1', 'prop_bet_on_4_2', 'prop_bet_on_3_3', 'prop_bet_on_6_2', 'prop_bet_on_5_3', 'prop_bet_on_4_4', 'prop_bet_on_6_3', 
      'prop_bet_on_5_4', 'prop_bet_on_6_4', 'prop_bet_on_5_5','field_bet','place_dont_come_bet']

  angular.forEach(gameButtonsMisc, function(value) {
      $scope[value + "_button"] = function() {
          BankRollChecker(value)
          if ($scope[value] > 0 && value == "place_come_bet") {
              var game_helper_modal_headline = "Come Bet"
              var game_helper_modal_win_lose = "WINS ON 7 and 11. LOSES ON 2,3, or 12. Any other number and the Come Bet will Travel to that number, a which point the bet will win by rolling that number again or lose by rolling a 7, which ever come first."
              var game_helper_modal_id = "#"+value+"_modal"
              var game_helper_modal_message = "You Placed " + game_helper_modal_headline+ " for " + $scope[value]+" Coins"
              PlayerGameCalls($scope, "INFO", game_helper_modal_id, game_helper_modal_message, game_helper_modal_headline, game_helper_modal_win_lose)
          }
          if ($scope[value] > 0 && value == "place_dont_come_bet") {
              var game_helper_modal_headline = "Don't Come Bet"
              var game_helper_modal_win_lose = "WINS ON 2, 3 or 12. LOSES ON 7 or 11. Any other number and the Don't Come Bet will Travel to that number, a which point the bet will lose by rolling that number again or win by rolling a 7, which ever come first."
              var game_helper_modal_id = "#"+value+"_modal"
              var game_helper_modal_message = "You Placed " + game_helper_modal_headline+ " for " + $scope[value]+ " Coins"
              PlayerGameCalls($scope, "INFO", game_helper_modal_id, game_helper_modal_message, game_helper_modal_headline, game_helper_modal_win_lose)
          }
          if ($scope[value] > 0 && value == "odds_behind_the_line") {
              var game_helper_modal_headline = "Odds behind the Pass Line"
              var game_helper_modal_win_lose = "WINS ON "+writtenWord[$scope.point_is]+". LOSES ON Seven. Once a point has been established you have the option of adding Odds to your Line Bet, like the pass line bet, only two numbers will affect the Odds behind the line, Rolling the Point will win and Rolling a Seven will lose."
              var game_helper_modal_id = "#"+value+"_modal"
              var game_helper_modal_message = "You Placed " + game_helper_modal_headline+ " for " + $scope[value]+ " Coins"
              PlayerGameCalls($scope, "INFO", game_helper_modal_id, game_helper_modal_message, game_helper_modal_headline, game_helper_modal_win_lose)
          }
          if ($scope[value] > 0 && value == "odds_behind_the_dont_pass_line") {
              var game_helper_modal_headline = "Odds behind the Don't Pass Line"
              var game_helper_modal_win_lose = "WINS ON Seven. LOSES ON "+writtenWord[$scope.point_is]+". Once a point has been established you have the option of adding a Lay to your Don't Pass Line Bet, like the don't pass line bet, only two numbers will affect the Odds behind the line, Rolling the Point will lose and Rolling a Seven will win."
              var game_helper_modal_id = "#"+value+"_modal"
              var game_helper_modal_message = "You Placed " + game_helper_modal_headline+ " for " + $scope[value]+" Coins"
              PlayerGameCalls($scope, "INFO", game_helper_modal_id, game_helper_modal_message, game_helper_modal_headline, game_helper_modal_win_lose)
          }
          if ($scope[value] > 0 && value == "dont_pass_line_bet") {
              var game_helper_modal_headline = "Don't Pass Line Bet"
              var game_helper_modal_win_lose = "The Don't Pass Line during the \"Come Out Roll\" will win on 2 and 3, 12 is a push and lose on 7 and 11. Any other number becomes the point. Once the point has been established, only two numbers will affect the Don't Pass Line, Rolling the Point will lose and Rolling a Seven will win."
              var game_helper_modal_id = "#"+value+"_modal"
              var game_helper_modal_message = "You Placed a " + game_helper_modal_headline+ " for " + $scope[value]+" Coins"
              PlayerGameCalls($scope, "INFO", game_helper_modal_id, game_helper_modal_message, game_helper_modal_headline, game_helper_modal_win_lose)
          }
          if ($scope[value] > 0 && value == "line_bet") {
              var game_helper_modal_headline = "Pass Line Bet"
              var game_helper_modal_win_lose = "The Pass Line during the \"Come Out Roll\" will win on 7 and 11, and lose on 2,3, and 12. Any other number becomes the point. Once the point has been established, only two numbers will affect the Pass Line, Rolling the Point will win and Rolling a Seven will lose."
              var game_helper_modal_id = "#"+value+"_modal"
              var game_helper_modal_message = "You Placed a " + game_helper_modal_headline+ " for " + $scope[value]+" Coins"
              PlayerGameCalls($scope, "INFO", game_helper_modal_id, game_helper_modal_message, game_helper_modal_headline, game_helper_modal_win_lose)
          }
          if ($scope[value] > 0 && value == "field_bet") {
              var game_helper_modal_headline = "Field Bet"
              var game_helper_modal_win_lose = "The Field is a One Roll Bet. It wins on any of the following numbers 2,3,4,9,10,11,12. Field Pays Even Money (2 pays double and 12 pays triple)"
              var game_helper_modal_id = "#"+value+"_modal"
              var game_helper_modal_message = "You Placed a " + game_helper_modal_headline+ " for " + $scope[value]+" Coins"
              PlayerGameCalls($scope, "INFO", game_helper_modal_id, game_helper_modal_message, game_helper_modal_headline, game_helper_modal_win_lose)
          }
          if ($scope[value] > 0 && value.match("prop_bet_on_")) {
              var hop_1 = value.slice(-3).slice(0,1)
              var hop_2 = value.slice(-3).slice(-1)
              if (hop_1 == 1 && hop_2 == 1) {
                  var game_helper_modal_headline = "Prop Bet on Aces"
                  var game_helper_modal_win_lose = "Aces is a One Roll Bet. The dice must come 1-1 in order to win. Pays 31 for 1"
              } else if ((hop_1 == 5 && hop_2 == 6) || (hop_1 == 6 && hop_2 == 5)) {
                  var game_helper_modal_headline = "Prop Bet on Yo"
                  var game_helper_modal_win_lose = "Ace Deuce is a One Roll Bet. The dice must come 6-5 or 5-6 in order to win. Pays 16 for 1"
              } else if ((hop_1 == 1 && hop_2 == 2) || (hop_1 == 2 && hop_2 == 1)) {
                  var game_helper_modal_headline = "Prop Bet on Ace Deuce"
                  var game_helper_modal_win_lose = "Ace Deuce is a One Roll Bet. The dice must come 2-1 or 1-2 in order to win. Pays 16 for 1"
              } else if (hop_1 == 6 && hop_2 == 6) {
                  var game_helper_modal_headline = "Prop Bet on Twelve"
                  var game_helper_modal_win_lose = "Twelve is a One Roll Bet. The dice must come 6-6 in order to win. Pays 31 for 1"
              } else {
                  var highside_lowside = (hop_1 == hop_2 ? " 31 for 1" : " 16 for 1")
                  var game_helper_modal_headline = "Prop Bet on "+hop_1+"-"+hop_2+" Hopping"
                  var highside_lowside_wording = (hop_1 == hop_2 ? (hop_1+"-"+hop_2) : (hop_1+"-"+hop_2+" or "+hop_2+"-"+hop_1))
                  var game_helper_modal_win_lose = hop_1+"-"+hop_2+" Hopping is a One Roll Bet. The dice must come "+highside_lowside_wording+" in order to win. Pays "+highside_lowside
              }
              var game_helper_modal_id = "#"+value+"_modal"
              var game_helper_modal_message = "You Placed a " + game_helper_modal_headline+ " for " + $scope[value]+" Coins"
              PlayerGameCalls($scope, "INFO", game_helper_modal_id, game_helper_modal_message, game_helper_modal_headline, game_helper_modal_win_lose)
          }
          if ($scope[value] > 0 && value == "prop_bet_red") {
              var game_helper_modal_headline = "Prop Bet on Any Seven"
              var game_helper_modal_win_lose = "Any Seven is a One Roll Bet. The dice must roll Seven in order to win. Pays 5 for 1"
              var game_helper_modal_id = "#"+value+"_modal"
              var game_helper_modal_message = "You Placed a " + game_helper_modal_headline+ " for " + $scope[value]+" Coins"
              PlayerGameCalls($scope, "INFO", game_helper_modal_id, game_helper_modal_message, game_helper_modal_headline, game_helper_modal_win_lose)
          }
          if ($scope[value] > 0 && value == "prop_bet_craps") {
              var game_helper_modal_headline = "Prop Bet on Any Craps"
              var game_helper_modal_win_lose = "Any Craps is a One Roll Bet. The dice must roll Craps (2,3, or 12) in order to win. Pays 8 for 1"
              var game_helper_modal_id = "#"+value+"_modal"
              var game_helper_modal_message = "You Placed a " + game_helper_modal_headline+ " for " + $scope[value]+" Coins"
              PlayerGameCalls($scope, "INFO", game_helper_modal_id, game_helper_modal_message, game_helper_modal_headline, game_helper_modal_win_lose)
          }
          if ($scope[value] > 0 && value.match("prop_bet_hard_")) {
              if (value == "prop_bet_hard_4") {
                  var game_helper_modal_headline = "Prop Bet on Hard Four"
                  var game_helper_modal_win_lose = "Hard Four is a bet that the dice will come \"Hard\" (2-2). WINS on 2-2, LOSES on 7 or easy Four (3-1). Pays 7 for 1."
              } else if (value == "prop_bet_hard_6") {
                  var game_helper_modal_headline = "Prop Bet on Hard Six"
                  var game_helper_modal_win_lose = "Hard Six is a bet that the dice will come \"Hard\" (3-3). WINS on 3-3, LOSES on 7 or easy Six (4-2 or 5-1). Pays 9 for 1."
              } else if (value == "prop_bet_hard_8") {
                  var game_helper_modal_headline = "Prop Bet on Hard Eight"
                  var game_helper_modal_win_lose = "Hard Eight is a bet that the dice will come \"Hard\" (4-4). WINS on 4-4, LOSES on 7 or easy Eight (6-2 or 5-3). Pays 9 for 1."
              } else {
                  var game_helper_modal_headline = "Prop Bet on Hard Ten"
                  var game_helper_modal_win_lose = "Hard Ten is a bet that the dice will come \"Hard\" (5-5). WINS on 5-5, LOSES on 7 or easy Ten (6-4). Pays 7 for 1."
              }
              var game_helper_modal_id = "#"+value+"_modal"
              var game_helper_modal_message = "You Placed a " + game_helper_modal_headline+ " for " + $scope[value]+" Coins"
              PlayerGameCalls($scope, "INFO", game_helper_modal_id, game_helper_modal_message, game_helper_modal_headline, game_helper_modal_win_lose)
          }
      }
  })

  $scope.roll = function() {
      $scope.dice_in_box = true
      $scope.player_game_calls = []
      $scope.hide_dice = !$scope.hide_dice
      var current_roll_dice_2= new Array(1,2,3,4,5,6);
      var random_2 = current_roll_dice_2[Math.floor(Math.random() * current_roll_dice_2.length)];
      // random_2 = 2;
      $scope.die_one = random_2;
      var current_roll_dice_1= new Array(1,2,3,4,5,6);
      var random_1 = current_roll_dice_1[Math.floor(Math.random() * current_roll_dice_1.length)];
      // random_1 = 1;
      $scope.die_two = random_1;
      var total_of_dice = random_1 + random_2;

      $timeout(function() {
          $scope.dice_in_box = false
      }, 500)

      $timeout(function() {
          EvaluateTheField($scope, total_of_dice)
          PropBets($scope, random_1, random_2)

          if (total_of_dice == 2 || total_of_dice == 3 || total_of_dice == 12) {
              if ($scope.game_status == "Come Out Roll" ) {
                  LineAway($scope, total_of_dice)
              }
              else if ($scope.game_status == "Point is ") {
                  ComeAway($scope, total_of_dice)
              }
          }
          if (total_of_dice == 4 || total_of_dice == 5 || total_of_dice == 6 || total_of_dice == 8 || total_of_dice == 9 || total_of_dice == 10 ) {
              if ($scope.game_status == "Come Out Roll") {
                  SetsThePoint($scope, total_of_dice)
                  PayPlaceBets($scope, total_of_dice)
                  ComesGoToThe($scope, total_of_dice)
                  $scope.odds_on_come_bets_are_off = false
                  $scope.place_bets_are_off = false 
                  $scope.hardways_are_off = false 
              }
              else if ($scope.game_status == "Point is " && ($scope.point_is == total_of_dice)) {
                  FrontLineWinner($scope, total_of_dice)
                  ComesGoToThe($scope, total_of_dice)
                  $scope.point_is = ""
                  $scope.point_is_word = ""
                  $scope.game_status = "Come Out Roll"
                  $scope.place_bets_are_off = true 
                  $scope.odds_on_come_bets_are_off = true 
                  $scope.hardways_are_off = true 
              }
              else if ($scope.game_status == "Point is " && ($scope.point_is != total_of_dice)) {
                  $scope.the_call_is = total_of_dice
                  PayPlaceBets($scope, total_of_dice)
                  ComesGoToThe($scope, total_of_dice)
              }
          }
          if (total_of_dice == 7) {
              if ($scope.game_status == "Come Out Roll" ) {
                  FrontLineWinner($scope, total_of_dice)
                  GiveBackTheOdds($scope, total_of_dice)
              }
              else if ($scope.game_status == "Point is ") {
                  SevenOut($scope, total_of_dice)
              }
          }
          if (total_of_dice == 11) {
              if ($scope.game_status == "Come Out Roll" ) {
                  FrontLineWinner($scope, total_of_dice)
              }
              else if ($scope.game_status == "Point is ") {
                  PayTheLastCome($scope, total_of_dice)
              }
          }
          $scope.no_bet_not_enough_funds = ""
          if ($scope.player_game_calls.length == 0) {
              $scope.player_game_calls.push({call_actual: "None of your bets were affected, Dice are Ready"})
          }
        runLeaderboard($scope)
        messageLeaderboard($scope)
        if ($scope.available_leaderboard_position != 11) {
          $scope.player_game_calls.push({call_actual: "Cashout now and rank " + $scope.available_leaderboard_position + " on the Leaderboard"})
        }
      }, 250)
  };

  // connecting each place to bet with bank_roll_actual
  var places_to_watch =
    ['line_bet', 'odds_behind_the_line', 'place_come_bet', 'field_bet', 'come_bet_odds_on_4', 'come_bet_odds_on_5',
      'come_bet_odds_on_6', 'come_bet_odds_on_8', 'come_bet_odds_on_9', 'come_bet_odds_on_10', 'come_bet_flat_on_4',
      'come_bet_flat_on_5', 'come_bet_flat_on_6', 'come_bet_flat_on_8', 'come_bet_flat_on_9', 'come_bet_flat_on_10',
      'place_bet_on_the_4', 'place_bet_on_the_5', 'place_bet_on_the_6', 'place_bet_on_the_8', 'place_bet_on_the_9',
      'place_bet_on_the_10', 'prop_bet_on_1_1', 'prop_bet_on_2_1', 'prop_bet_on_6_6', 'prop_bet_on_6_5', 'prop_bet_on_6_1',
      'prop_bet_on_5_2', 'prop_bet_on_4_3', 'prop_bet_on_3_1', 'prop_bet_on_2_2', 'prop_bet_on_3_2', 'prop_bet_on_4_1', 'prop_bet_on_5_1',
      'prop_bet_on_4_2', 'prop_bet_on_3_3', 'prop_bet_on_6_2', 'prop_bet_on_5_3', 'prop_bet_on_4_4', 'prop_bet_on_6_3', 'prop_bet_on_5_4',
      'prop_bet_on_6_4', 'prop_bet_on_5_5', 'dont_pass_line_bet', 'odds_behind_the_dont_pass_line', 'place_dont_come_bet', 'dont_come_bet_lay_on_4', 'dont_come_bet_lay_on_5',
      'dont_come_bet_lay_on_6', 'dont_come_bet_lay_on_8', 'dont_come_bet_lay_on_9', 'dont_come_bet_flat_on_10', 'dont_come_bet_flat_on_4',
      'dont_come_bet_flat_on_5', 'dont_come_bet_flat_on_6', 'dont_come_bet_flat_on_8', 'dont_come_bet_flat_on_9', 'dont_come_bet_flat_on_10',
      'prop_bet_hard_4', 'prop_bet_hard_6', 'prop_bet_hard_8', 'prop_bet_hard_10', 'prop_bet_red', 'prop_bet_craps']


  angular.forEach(places_to_watch, function(value) {
    $scope.$watch(value, function(newVal, oldVal) {
        AdjustBankRoll($scope, newVal, oldVal)
    });
  })

  function AdjustBankRoll($scope, newVal, oldVal) {
      the_difference = newVal - oldVal
      $scope.bank_roll_actual -= the_difference
      $timeout(function() {
        runLeaderboard($scope)
        messageLeaderboard($scope)
      }, 250)
  }
}]);

// creates the dice fade effect
crapsGame.directive("diceRollActual", function($animate) {
    return function(scope, element, attrs) {
        scope.$watch(attrs.diceRollActual, function(newVal) {
            if (newVal) {
                $animate.addClass(element, "text-animated-two");
                $animate.removeClass(element, "text-animated-one");
            } else {
                $animate.removeClass(element, "text-animated-two");
                $animate.addClass(element, "text-animated-one");
            }
        })
    }
});

// win/lose announcement
function PlayerGameCalls($scope, win_or_lose, game_helper_modal_id, game_helper_modal_message, game_helper_modal_headline, game_helper_modal_win_lose, starting_bet, ending_bet) {
    if (win_or_lose == "WON") {
        var bet_winning_var = "You " + win_or_lose + " " + ending_bet + " Coins for your " + starting_bet + " Coins on " + game_helper_modal_headline
        $scope.player_game_calls.push({call_actual: bet_winning_var, game_helper_modal_id: game_helper_modal_id, game_helper_modal_message: game_helper_modal_message, game_helper_modal_headline: game_helper_modal_headline, game_helper_modal_win_lose: game_helper_modal_win_lose, winning_bet: true})
    }
    else if (win_or_lose == "LOST") {
        var bet_losing_var = "You " + win_or_lose + " your " + game_helper_modal_headline

        $scope.player_game_calls.push({call_actual: bet_losing_var, game_helper_modal_id: game_helper_modal_id, game_helper_modal_message: game_helper_modal_message, game_helper_modal_headline: game_helper_modal_headline, game_helper_modal_win_lose: game_helper_modal_win_lose, losing_bet: true})


    }
    else if (win_or_lose == "INFO") {
        angular.forEach($scope.player_game_calls, function(value) {
            if (game_helper_modal_id == value.game_helper_modal_id) {
                value.done_here = true
            }
        })
        $scope.player_game_calls.push({call_actual: game_helper_modal_message, game_helper_modal_id: game_helper_modal_id, game_helper_modal_message: game_helper_modal_message, game_helper_modal_headline: game_helper_modal_headline, game_helper_modal_win_lose: game_helper_modal_win_lose})
    }
    else if (win_or_lose == "PLAYER_RESCUE") {
        var player_rescue_var = game_helper_modal_message
        $scope.player_game_calls.push({call_actual: player_rescue_var, game_helper_modal_id: game_helper_modal_id, game_helper_modal_message: game_helper_modal_message, game_helper_modal_headline: game_helper_modal_headline, game_helper_modal_win_lose: game_helper_modal_win_lose, player_rescue: true})
    }
}


