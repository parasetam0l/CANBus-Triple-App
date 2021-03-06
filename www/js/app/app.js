'use strict';
/*
 *	CANBus Tripple App
 *	http://canb.us
 *
*/

// window.cbtAppDebug = true;

var remote = require('remote');
var app = remote.require('electron').app;
var autoUpdater = remote.require('auto-updater');


autoUpdater.on('update-downloaded', function(event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate){
  console.info(arguments);

  var myNotification = new Notification("An update is ready to install", {"body":"CANBus Triple "+releaseName+" is ready to install. Click here"});

  myNotification.onclick = function () {
    quitAndUpdate();
    console.log('Notification clicked')
  }
  // quitAndUpdate();
});


/*
*	Catch all errors
*/
window.onerror = function(message, url, lineNumber) {
  console.error(message, url, lineNumber);
  return false;
};


angular.module('cbt', ['ngAnimate', 'ionic', 'ngMaterial', 'LocalStorageModule'])

	// .run(function($ionicPlatform) {
	//
	//   $ionicPlatform.ready(function() {
	//     // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
	//     // for form inputs)
	//     if(window.cordova && window.cordova.plugins.Keyboard) {
	//       cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
	//     }
	//     if(window.StatusBar) {
	//       // org.apache.cordova.statusbar required
	//       StatusBar.styleDefault();
	//     }
	//   });
	//
	// })


	.run(function(SerialService){

		// Close serial on app close
		app.on('window-all-closed', function() {
			console.log("We're closing...");
			SerialService.close();
		});


	})

	// Initial load event
	.directive('initialisation',['$rootScope', function($rootScope) {
            return {
                restrict: 'A',
                link: function($scope) {
                    var to;
                    var listener = $scope.$watch(function() {
                        clearTimeout(to);
                        to = setTimeout(function () {
                            listener();
                            $rootScope.$broadcast('initialised');
                        }, 50);
                    });
                }
            };
        }])

	.constant('appVersion', app.getVersion()) // Set app version

	.config(function($stateProvider, $urlRouterProvider, localStorageServiceProvider) {

			// Ionic uses AngularUI Router which uses the concept of states
	    // Learn more here: https://github.com/angular-ui/ui-router
	    // Set up the various states which the app can be in.
	    // Each state's controller can be found in controllers.js
	    $stateProvider

				.state('home', {
					url: '/',
					controller: 'HomeController',
					templateUrl: 'templates/home.html'
				})

	      .state('hardware', {
					url: '/hardware',
					// abstract: true,
					controller: 'HWStatusController',
					templateUrl: 'templates/hardware/hardware.html',
		    })
				.state('hardware.status', {
          url: '/status',
					views: {
						'pane':{
							// controller: 'HWStatusController',
							templateUrl: 'templates/hardware/device.html'
						}
					}
        })
				.state('hardware.firmware', {
          url: '/firmware',
					views: {
						'pane':{
							controller: 'BuildsController',
		          templateUrl: 'templates/hardware/firmware.html',
						}
					}
        })

	      .state('connect', {
          url: '/connect',
          controller: 'ConnectionController',
          templateUrl: 'templates/hardware/connection.html'
	      })

	      .state('dashboard', {
	          url: '/dashboard',
	          controller: 'DashboardController',
	          templateUrl: 'templates/dashboard.html'
	      })

	      .state('logger', {
	          url: '/logger',
	          controller: 'LoggerController',
	          templateUrl: 'templates/logger.html'
	      })

				.state('diagnostics', {
	          url: '/diagnostics',
	          controller: 'DiagController',
	          templateUrl: 'templates/diagnostics.html'
	      })

				.state('services', {
	          url: '/services',
	          controller: 'ServicesController',
	          templateUrl: 'templates/services.html'
	      })

				.state('pipe', {
	          url: '/pipe',
	          controller: 'PipeController',
	          templateUrl: 'templates/pipe.html'
	      })

		    // .state('logger.view', {
				// 	url: "/view",
				// 	views: {
				// 	'home-tab': {
				// 		templateUrl: 'templates/pidfinder.view.html'
				// 		}
				// 	}
				// })

	      .state('settings', {
	          url: '/settings',
	          controller: 'SettingsController',
	          templateUrl: 'templates/settings.html'
	      })

	      .state('debug', {
	          url: '/debug',
	          controller: 'DebugController',
	          templateUrl: 'templates/debug.html'
	      });


	    // $urlRouterProvider.otherwise('/dashboard');
	    $urlRouterProvider.otherwise('/');

	    // Set local storage prefix
	    localStorageServiceProvider.setPrefix('CBTSettings');

	})

	.config(function($mdThemingProvider) {

		$mdThemingProvider.theme('default')
	    .primaryPalette('deep-orange')
	    .accentPalette('blue');

	});

	if( window.cbtAppDebug )
		angular.module('cbt')
			.config(['$provide', function ($provide) {
			  $provide.decorator('$rootScope', function ($delegate) {

			    var _emit = $delegate.$emit;
			    $delegate.$emit = function(){
			      console.log.apply(console, arguments);
			      _emit.apply(this, arguments);
			    };

					var origBroadcast = $delegate.$broadcast;
					$delegate.$broadcast = function() {
			      // console.log("$broadcast: ", JSON.stringify(arguments));
			      console.log("$broadcast: ", arguments);
			      return origBroadcast.apply(this, arguments);
			    };

			    return $delegate;

			  });
			}]);
