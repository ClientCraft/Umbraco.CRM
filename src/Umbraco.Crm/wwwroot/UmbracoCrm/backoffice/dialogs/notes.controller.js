angular.module("umbraco")
  .controller("Umbraco.Crm.Dialogs.NotesController", function ($scope, $http) {
    var vm = this;

    console.log($scope.model);

    vm.notes = [];
    vm.next = 'http://foo.localhost:8000/lead/1/note?page=1';

    vm.fetchNextNotes = function () {
      if (!vm.next) return;

      $http.get(vm.next).then(response => {
        vm.notes = [...vm.notes, ...response.data.data];
        return response.data.links.next; // Return the next page URL
      });
    };

    // Fetch all notes on initialization
    vm.fetchNextNotes();
  });
