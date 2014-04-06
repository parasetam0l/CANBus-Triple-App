'use strict';
/*
 *	CANBus Tripple App
 *	http://canb.us
 *
*/


angular.module('cbt', ['ionic', 'LocalStorageModule'])
	.config(function($stateProvider, $urlRouterProvider, localStorageServiceProvider) {
	
			// Ionic uses AngularUI Router which uses the concept of states
	    // Learn more here: https://github.com/angular-ui/ui-router
	    // Set up the various states which the app can be in.
	    // Each state's controller can be found in controllers.js
	    $stateProvider
	
	        .state('connection', {
	            url: '/connection',
	            controller: 'ConnectionController',
	            templateUrl: 'templates/connection.html'
	        })
	        .state('dashboard', {
	            url: '/dashboard',
	            controller: 'DashboardController',
	            templateUrl: 'templates/dashboard.html'
	        })
	        .state('debug', {
	            url: '/debug',
	            controller: 'DebugController',
	            templateUrl: 'templates/debug.html'
	        });
			
	    // $urlRouterProvider.otherwise('/dashboard');
	    $urlRouterProvider.otherwise('/connection');
	    
	    // Set local storage prefix
	    localStorageServiceProvider.setPrefix('newPrefix');
	    
	});
