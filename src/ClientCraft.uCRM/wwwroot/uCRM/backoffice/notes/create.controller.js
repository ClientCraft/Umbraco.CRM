angular
  .module("umbraco")
  .controller(
    "ClientCraft.uCRM.Notes.CreateController",
    function ($scope, userService, usersResource, $http, notificationsService) {
      var vm = this;

      // Initialize the model
      vm.model = {
        content: "",
        user_reference: "",
        contact_id: null,
      };

      // Track submission state for the button
      vm.submitState = "init";

      // Get current user for the request
      userService.getCurrentUser().then(function (user) {
        usersResource.getUser(user.id).then(function (response) {
          vm.model.user_reference = response.key;
        });
      });

      vm.model.contact_id = $scope.model.data.id;

      // Setup methods
      vm.submit = submit;
      vm.close = close;

      function submit() {
        // Set button to loading state

        vm.submitState = "busy";
        // Validate content is not empty
        if (!vm.model.content) {
          notificationsService.error("Error", "Note content cannot be empty");
          vm.submitState = "error";
          return;
        }

        // Prepare API request payload
        var payload = {
          content: vm.model.content,
          user_reference: vm.model.user_reference,
        };

        // Make API call
        $http({
          method: "POST",
          url:
            "http://foo.localhost:8000/contact/" +
            vm.model.contact_id +
            "/note",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
          data: payload,
        }).then(
          function (response) {
            // Success
            notificationsService.success(
              "Success",
              "Note has been added successfully"
            );
            vm.submitState = "success";

            // Close or reset
            if ($scope.model && $scope.model.submit) {
              $scope.model.submit(response.data);
            }
          },
          function (error) {
            // Error
            notificationsService.error(
              "Error",
              "Failed to add note: " + (error.data?.message || "Unknown error")
            );
            vm.submitState = "error";
          }
        );
      }

      function close() {
        if ($scope.model && $scope.model.close) {
          $scope.model.close();
        }
      }
    }
  );
