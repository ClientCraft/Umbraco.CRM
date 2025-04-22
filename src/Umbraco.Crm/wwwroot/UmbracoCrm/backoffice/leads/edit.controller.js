angular.module("umbraco").controller("Umbraco.Crm.Leads.EditController", function ($scope, $http, notificationsService, editorService) {
  var vm = this;

  vm.leadStatuses = [
    { id: 1, name: "New" },
    { id: 2, name: "Contacted" },
    { id: 3, name: "Qualified" },
    { id: 4, name: "Closed" }
  ];

  vm.model = $scope.model.data;

  vm.submit = submit;
  vm.close = close;

  function submit() {
    $http.post("https://foo.client-craft.com/lead/" + vm.model.id, {
      ...vm.model,
      _method: "PUT"
    }).then(function (response) {
      notificationsService.success("Success", "Lead has been updated successfully");
      vm.submitState = "success";
      if ($scope.model.submit) {
        $scope.model.submit(response.data);
      }
    }).catch(function (error) {
      notificationsService.error("Error", "Failed to update lead");
      vm.submitState = "error";
    });

    editorService.close();
  }

  function close() {
    if($scope.model.close) {
      $scope.model.close();
    }
    editorService.close();
  }
});
