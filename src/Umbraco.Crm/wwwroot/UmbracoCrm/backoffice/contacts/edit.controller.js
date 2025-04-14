angular.module("umbraco").controller("Umbraco.Crm.Leads.CreateController", function ($scope, $http, notificationsService) {
  var vm = this;

  vm.model = $scope.model.data;

  function fetchCompaniesList() {
    $http.get('http://foo.localhost:8000/account/names').then(function (response) {
      vm.companiesList = response.data;

      // Normalize vm.model.companies to match vm.companiesList structure
      vm.model.companies = vm.model.companies.map(company => {
        const matchedCompany = vm.companiesList.find(listCompany => listCompany.id === company.id);
        return matchedCompany || { id: company.id, name: company.name }; // Fallback if no match
      });
    });
  }
  fetchCompaniesList();

  vm.submit = submit;
  vm.close = close;

  function submit() {
    console.log('SUBMITTING', vm.model);
    $http.post('http://foo.localhost:8000/contact/' + vm.model.id, {
      ...vm.model,
      _method: 'PUT'
    }).then(function (response) {
      notificationsService.success("Success", "Contact has been updated successfully");
      vm.submitState = "success";
      if ($scope.model.submit) {
        $scope.model.submit(response.data);
      }
    }, function (error) {
      notificationsService.error("Error", "Failed to update lead");
      vm.submitState = "error";
    });
  }

  function close() {
    if ($scope.model.close) {
      $scope.model.close();
    }
  }
});
