'use strict';

angular.module('conFusion.services', ['ngResource'])
        .constant('baseURL', 'http://10.25.8.111:3000/')

        .factory('$localStorage', ['$window', function($window) {
                return {
                    store: function(key, value) {
                        $window.localStorage[key] = value;
                    },
                    get: function(key, defaultValue) {
                        return $window.localStorage[key] || defaultValue;
                    },
                    storeObject: function(key, value) {
                        $window.localStorage[key] = JSON.stringify(value);
                    },
                    getObject: function(key, defaultValue) {
                        return JSON.parse($window.localStorage[key] || defaultValue);
                    }                    
                }            
        }])

        .factory('menuFactory', ['$resource', 'baseURL', function($resource, baseURL) {
    
                return $resource(baseURL+"dishes/:id", null, 
                                 {'update':{method:'PUT'}});
         
        }])

        .factory('promotionFactory', ['$resource', 'baseURL', function($resource, baseURL) {
            
                return $resource(baseURL + "promotions/:id");
        }])

        .factory('corporateFactory', ['$resource', 'baseURL', function($resource, baseURL) {
    
                var corpfac = {};
            
                corpfac.getLeaders = function() {
                    
                    return $resource(baseURL+"leadership/:id", null);
                };
                
                return corpfac;
        }])

        .factory('feedbackFactory', ['$resource', 'baseURL', function($resource, baseURL){
         
                var feedbackFac = {};
                
                feedbackFac.getFeedback = function() {
                    
                  return $resource(baseURL+"feedback/:id", null);
                    
                };
            
                return feedbackFac;
                
        }])

        .factory('favoriteFactory', ['$resource', 'baseURL', '$localStorage', function($resource, baseURL, $localStorage){
            
                var favFac = {};
                var favorites = $localStorage.getObject('favorites', '[]');
            
                favFac.addToFavorites = function(index) {
                    for (var i = 0; i < favorites.length; i++) {
                        if (favorites[i].id == index)
                        return;
                    }
                    favorites.push({id: index});
                    $localStorage.storeObject('favorites', favorites);
                };
            
                favFac.deleteFromFavorites = function(index) {
                    for (var i = 0; i < favorites.length; i++) {
                        if (favorites[i].id == index) {
                            favorites.splice(i, 1);
                        }
                    }
                    $localStorage.storeObject('favorites', favorites);
                };
            
                favFac.getFavorites = function() {
                    return favorites;    
                };
            
                return favFac;
        }])

;
