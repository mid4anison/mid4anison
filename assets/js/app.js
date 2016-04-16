console.clear();

var app = angular.module('MyYoutubeApp', ['angularUtils.directives.dirPagination'])
  .config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
      'self',
      'https://www.youtube.com/**'
    ]);
  });

app.controller('ListCtrl', ['$scope', '$http',
  function MyCtrl($scope, $http) {
    $http.get("https://script.google.com/macros/s/AKfycbxaKZerlXfcZYppYigw_Pk880lQsayiLieM6aEDqKT11iQYoZs/exec?id=1H7Zu42ApsJ-CQ58NyQ1aX4Toc69lIfh4geX-yl_6vNc")
      .then(function(response) {
      $scope.tracks = response.data.Song_List;

      $scope.getIframeSrc = function(tracks) {
        return 'https://www.youtube.com/embed/' + tracks;
      };

    });
    $scope.sort = function(keyname){
		$scope.sortKey = keyname;   //set the sortKey to the param passed
		$scope.reverse = !$scope.reverse; //if true make it false and vice versa
	};
  }
]);

app.controller('ModalCtrl', function($scope) {
  $scope.showModal = false;
  $scope.toggleModal = function() {
    $scope.showModal = !$scope.showModal;
  };
});

app.directive('modal', function() {
  return {
    template: '<div class="modal fade">' +
      '<div class="modal-dialog modal-lg">' +
      '<div class="modal-content">' +
      '<div class="modal-header">' +
      '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
      '<h4 class="modal-title"">{{ title }}</h4>' +
      '</div>' +
      '<div class="modal-body" ng-transclude></div>' +
      '</div>' +
      '</div>' +
      '</div>',
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: true,
    link: function postLink(scope, element, attrs) {
      scope.title = attrs.title;

      scope.$watch(attrs.visible, function(value) {
        if (value === true)
          $(element).modal('show');
        else
          $(element).modal('hide');
      });

      $(element).on('shown.bs.modal', function() {
        scope.$apply(function() {
          scope.$parent[attrs.visible] = true;
        });
      });

      $(element).on('hidden.bs.modal', function() {
        scope.$apply(function() {
          scope.$parent[attrs.visible] = false;
        });
      });
    }
  };
});


// Stops Youtube play when modal closes
$(function(){
  $("body").on('hidden.bs.modal', function (e) {
    var $iframes = $(e.target).find("iframe");
    $iframes.each(function(index, iframe){
      $(iframe).attr("src", $(iframe).attr("src"));
    });
  });
});
