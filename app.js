var app = angular.module("superCrudApp", ["ngRoute","ngResource"]);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider)  {
  $routeProvider
    .when('/', {
      templateUrl: 'templates/books/index.html',
      controller: 'BooksIndexCtrl'
    })
    .when('/books/:id', {
      templateUrl: 'templates/books/show.html',
      controller: 'BooksShowCtrl'
    });
  $locationProvider
    .html5Mode({
      enabled: true,
      requireBase: false
    });
}]);

app.factory("Book", ["$resource", function($resource){
	return $resource("https://super-crud.herokuapp.com/books/:id",
		{id: "@id"} , {
			query: {
				isArray: true,
				transformResponse: function(data) {
					return angular.fromJson(data).books;
				}
			}	
		}
	);
}]);
app.controller('BooksIndexCtrl', ['$scope', 'Book', function ($scope, Book) {
  $scope.books = Book.query();
  $scope.addBook = function() {
  	if (!$scope.newBook.image) {
			$scope.newBook.image = "http://gujaratprachar.com/img/placeholder_noImage_bw.png";
		}
		addedBook = Book.save($scope.newBook);
		$scope.books.unshift(addedBook);
		$scope.newBook = {};
  };	
}]);

app.controller('BooksShowCtrl', ['$scope', '$routeParams', '$location', 'Book', function ($scope, $routeParams, $location, Book) {
  var bookId = $routeParams.id;
  book = Book.get({id: bookId},
  	function(result) {
  		$scope.book = result;
  	}, function(error) {
  		console.log(error.statusText);
  		$location.path("/");
  	});
}]);