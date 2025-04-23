angular
  .module("umbraco")
  .controller(
    "Umbraco.Crm.Dialogs.NotesController",
    function ($scope, $http, $window, $timeout) {
      var vm = this;

      vm.notes = undefined;
      vm.next = `http://foo.localhost:8000/${$scope.model.data.type}/${$scope.model.data.id}/note?page=1`;
      vm.loading = false;

      vm.fetchNextNotes = function () {
        if (!vm.next || vm.loading) return;

        vm.loading = true;

        $http
          .get(vm.next)
          .then(function (response) {
            if (!vm.notes) {
              vm.notes = [];
            }
            vm.notes = [...vm.notes, ...response.data.data];
            vm.next = response.data.links.next;
            vm.loading = false;
          })
          .catch(function (error) {
            console.error("Error fetching notes:", error);
            vm.loading = false;
          });
      };

      vm.editNote = function (note) {
        alert("NOT IMPLEMENTED YET");
      };

      vm.deleteNote = function (note) {
        alert("NOT IMPLEMENTED YET");
      };

      // Initialize with first page of notes
      vm.fetchNextNotes();

      vm.scrollHandler = function () {
        var scrollPosition =
          vm.notesContainer.scrollTop + vm.notesContainer.clientHeight;
        var scrollHeight = vm.notesContainer.scrollHeight;

        // If scrolled to within 200px of the bottom, load more notes
        if (scrollHeight - scrollPosition < 200 && !vm.loading && vm.next) {
          vm.fetchNextNotes();
          $scope.$apply();
        }
      };

      // Setup scroll event listener for infinite scrolling
      function setupScrollListener() {
        vm.notesContainer = document.querySelector(".notes-container");

        if (!vm.notesContainer) {
          $timeout(setupScrollListener, 100);
          return;
        }

        vm.notesContainer.addEventListener("scroll", vm.scrollHandler);
      }

      // Set up the scroll listener after DOM is ready
      $timeout(setupScrollListener, 0);

      // Clean up event listener when scope is destroyed
      $scope.$on("$destroy", function () {
        if (vm.notesContainer && vm.scrollHandler) {
          vm.notesContainer.removeEventListener("scroll", vm.scrollHandler);
        }
      });
    }
  );
