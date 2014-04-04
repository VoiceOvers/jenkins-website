angular.module('common-directives', [])
  .directive('scrollOnClick', function() {
    return {
      restrict: 'A',
      link: function(scope, $elm) {
        $elm.on('click', function() {
          $("body").animate({scrollTop: $elm.offset().top}, "slow");
        });
      }
    }
  })
  .directive('scrollTopOnClick', function() {
    return {
      restrict: 'A',
      link: function(scope, $elm) {
        $elm.on('click', function() {
          $("body").animate({scrollTop: 0}, "slow");
        });
      }
    }
  });