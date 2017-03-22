angular.module('conFusion.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};
    $scope.reservation = {};    

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
    })
    .then(function(modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
          $scope.closeLogin();
        }, 1000);
    };
    
  // Create the reserve modal that we will use later
  $ionicModal.fromTemplateUrl('templates/reserve.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.reserveform = modal;
  });

  // Triggered in the reserve modal to close it
  $scope.closeReserve = function() {
    $scope.reserveform.hide();
  };

  // Open the reserve modal
  $scope.reserve = function() {
    $scope.reserveform.show();
  };

  // Perform the reserve action when the user submits the reserve form
  $scope.doReserve = function() {
    console.log('Doing reservation', $scope.reservation);

    // Simulate a reservation delay. Remove this and replace with your reservation
    // code if using a server system
    $timeout(function() {
      $scope.closeReserve();
    }, 1000);
  }; 
    
})

   .controller('MenuController', ['$scope', 'menuFactory', 'baseURL', function($scope, menuFactory, baseURL) {

        $scope.tab = 1;
        $scope.filtText = '';
        $scope.showDetails = false;
        
        $scope.showMenu = false;
        $scope.message = "Loading...";
       
       $scope.baseURL = baseURL;
        
        $scope.dishes = menuFactory.getDishes().query(
            function(response) {
                $scope.dishes = response;
                $scope.showMenu = true;
            },
            function(response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );
            
        $scope.select = function(setTab) {
            $scope.tab = setTab;

            if (setTab === 2) {
                $scope.filtText = "appetizer";
            }
            else if (setTab === 3) {
                $scope.filtText = "mains";
            }
            else if (setTab === 4) {
                $scope.filtText = "dessert";
            }
            else {
                $scope.filtText = '';
            }
        };

        $scope.isSelected = function(tabNumber) {
            return ($scope.tab === tabNumber);
        };
        
        $scope.toggleDetails = function() {
            $scope.showDetails = !$scope.showDetails;
        };

    }])
    
    .controller('ContactController', ['$scope', function($scope) {
        
        $scope.feedback = {
                            mychannel:"",
                            firstName:"",
                            lastName:"",
                            agree:false,
                            email:""                              
                        };
        
        $scope.channels = [{value:"tel", label:"Tel."},
                       {value:"Email", label:"Email"}];
        
        
        $scope.invalidChannelSelection = false;
        
    }])

    .controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope, feedbackFactory) {
        
        $scope.sendFeedback = function() {            
                
            if ($scope.feedback.agree && ($scope.feedback.mychannel === "")) {
                
                $scope.invalidChannelSelection = true;
                console.log('incorrect');
                
            } else {
                
                $scope.invalidChannelSelection = false;
                            
                feedbackFactory.getFeedback().save($scope.feedback);
                            
                $scope.feedback = {
                    mychannel:"",
                    firstName:"",
                    lastName:"",
                    agree:false,
                    email:""                              
                };
                
                $scope.feedback.mychannel = "";
                $scope.feedbackForm.$setPristine();
            }        
        };
        
    }])

    .controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', 'baseURL', function($scope, $stateParams, menuFactory, baseURL) {            
        
            $scope.dish = {};
            $scope.showDish = false;
            $scope.message = "Loading...";
        
            $scope.baseURL = baseURL;
        
            $scope.dish = menuFactory.getDishes().get({id:parseInt($stateParams.id,10)})
                .$promise.then(
                    function(response) {
                        $scope.dish = response;
                        $scope.showDish = true;
                    },
                    function(response) {
                        $scope.message = "Error: " + response.status + " " + response.statusText;
                    }
            );
    }])

    .controller('DishCommentController', ['$scope', 'menuFactory', function($scope, menuFactory) {
            
            //Step 1: Create a JavaScript object to hold the comment from the form
            $scope.userComment = {
                            author:"",
                            rating:5,
                            comment:"",
                            date:""
                        };
            
            $scope.submitComment = function () {
                    
                $scope.userComment.date = new Date().toISOString();    
                console.log($scope.userComment); 

                $scope.dish.comments.push($scope.userComment);
                
                menuFactory.getDishes().update({id: $scope.dish.id}, $scope.dish);

                $scope.commentForm.$setPristine();
                
                $scope.userComment = {
                            author:"",
                            rating:5,
                            comment:"",
                            date:""
                        };
            };
    }])

    .controller('IndexController', ['$scope', 'menuFactory', 'corporateFactory', 'baseURL', function($scope, menuFactory, corporateFactory, baseURL) {
        
            $scope.showDish = false;
            $scope.message = "Loading...";
            
            $scope.showPromotion = false;
            $scope.promotionMessage = "Loading...";
        
            $scope.showChef = false;
            $scope.chefMessage = "Loading...";
        
            $scope.baseURL = baseURL;
        
            $scope.dish = menuFactory.getDishes().get({id:0})
                .$promise.then(
                    function(response) {
                        $scope.dish = response;
                        $scope.showDish = true;
                    },
                    function(response) {
                        $scope.message = "Error: " + response.status + " " + response.statusText;
                    }
            );
        
            $scope.promotion = menuFactory.getPromotions().get({id:0})
                .$promise.then(
                    function(response) {
                        $scope.promotion = response;
                        $scope.showPromotion = true;
                    },
                    function(response) {
                        $scope.promotionMessage = "Error: " + response.status + " " + response.statusText;
                    }
            );
        
            $scope.leader = corporateFactory.getLeaders().get({id:0})
                .$promise.then(
                    function(response) {
                        $scope.leader = response;
                        $scope.showChef = true;
                    },
                    function(response) {
                        $scope.chefMessage = "Error: " + response.status + " " + response.statusText;
                    }
            );
        
    }])

    .controller('AboutController', ['$scope', 'corporateFactory', 'baseURL', function($scope, corporateFactory, baseURL) {
        
            $scope.showLeaders = false;
            $scope.message = "Loading...";
        
            $scope.baseURL = baseURL;
            
            $scope.leaders = corporateFactory.getLeaders().query(
                function(response) {
                    $scope.leaders = response;
                    $scope.showLeaders = true;
                },
                function(response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            );       
    }])

;
