angular
  .module("umbraco")
  .controller(
    "ClientCraft.uCRM.Dialogs.DealsController",
    function ($scope, $http, $window, $timeout) {
      var vm = this;
      vm.deals = undefined;
      vm.next = `http://foo.localhost:8000/${$scope.model.data.type}/${$scope.model.data.id}/deal?page=1&include=status`;
      vm.loading = false;

      vm.fetchNextDeals = function () {
        if (!vm.next || vm.loading) return;

        vm.loading = true;

        $http
          .get(vm.next)
          .then(function (response) {
            if (!vm.deals) {
              vm.deals = [];
            }
            vm.deals = [...vm.deals, ...response.data.data];
            vm.next = response.data.links.next;
            vm.loading = false;
          })
          .catch(function (error) {
            console.error("Error fetching deals:", error);
            vm.loading = false;
          });
      };

      vm.editDeal = function (deal) {
        alert("NOT IMPLEMENTED YET");
      };

      vm.deleteDeal = function (deal) {
        alert("NOT IMPLEMENTED YET");
      };

      // Initialize with first page of deals
      vm.fetchNextDeals();

      vm.scrollHandler = function () {
        var scrollPosition =
          vm.dealsContainer.scrollTop + vm.dealsContainer.clientHeight;
        var scrollHeight = vm.dealsContainer.scrollHeight;

        // If scrolled to within 200px of the bottom, load more deals
        if (scrollHeight - scrollPosition < 200 && !vm.loading && vm.next) {
          vm.fetchNextDeals();
          $scope.$apply();
        }
      };

      // Setup scroll event listener for infinite scrolling
      function setupScrollListener() {
        vm.dealsContainer = document.querySelector(".deals-container");

        if (!vm.dealsContainer) {
          $timeout(setupScrollListener, 100);
          return;
        }

        vm.dealsContainer.addEventListener("scroll", vm.scrollHandler);
      }

      // Set up the scroll listener after DOM is ready
      $timeout(setupScrollListener, 0);

      // Clean up event listener when scope is destroyed
      $scope.$on("$destroy", function () {
        if (vm.dealsContainer && vm.scrollHandler) {
          vm.dealsContainer.removeEventListener("scroll", vm.scrollHandler);
        }
      });
    }
  );
