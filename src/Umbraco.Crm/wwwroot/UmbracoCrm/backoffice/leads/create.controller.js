angular.module("umbraco").controller("Umbraco.Crm.Leads.CreateController", function ($scope, $http, editorService) {
  var vm = this;

  vm.leadStatuses = [
    { id: 1, name: "New" },
    { id: 2, name: "Contacted" },
    { id: 3, name: "Qualified" },
    { id: 4, name: "Closed" }
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
    _method: "PUT"
  };

  vm.submit = submit;
  vm.close = close;

  function submit() {
    if($scope.model.submit) {
      $scope.model.submit($scope.model);
    }
  }

  function close() {
    if($scope.model.close) {
      $scope.model.close();
    }
  }
});
