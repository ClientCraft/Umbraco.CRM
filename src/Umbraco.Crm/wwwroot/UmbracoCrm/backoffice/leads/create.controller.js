angular
  .module("umbraco")
  .controller(
    "Umbraco.Crm.Leads.CreateController",
    function ($scope, $http, editorService, notificationsService) {
      var vm = this;

      vm.leadStatuses = [
        { id: 1, name: "New" },
        { id: 2, name: "Contacted" },
        { id: 3, name: "Qualified" },
        { id: 4, name: "Closed" },
      ];

      vm.model = {
        name: "",
        company: "",
        role: "",
        phone: "",
        email: "",
        lead_status_id: null,
        facebook_url: "",
        instagram_url: "",
        linkedin_url: "",
        _method: "PUT",
      };

      vm.submit = submit;
      vm.close = close;

      function submit() {
        $http
          .post("https://foo.client-craft.com/lead", {
            ...vm.model,
            _method: "POST",
          })
          .then(function (response) {
            notificationsService.success(
              "Success",
              "Lead has been created successfully"
            );
            vm.submitState = "success";
            if ($scope.model.submit) {
              $scope.model.submit(response.data);
            }
            vm.model = {}
          })
          .catch(function (error) {
            notificationsService.error("Error", "Failed to create lead");
            vm.submitState = "error";
          });
      }

      function close() {
        if ($scope.model.close) {
          $scope.model.close();
        }
        editorService.close();
      }
    }
  );
