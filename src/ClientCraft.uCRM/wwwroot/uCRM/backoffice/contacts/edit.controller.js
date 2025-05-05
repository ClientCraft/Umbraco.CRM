angular.module("umbraco").controller("ClientCraft.uCRM.Contacts.EditController", function ($scope, $http, notificationsService) {
    var vm = this;

    vm.model = angular.copy($scope.model.data);
    vm.model.user_id = vm.model.owner?.id ?? null;

    function fetchCompaniesList() {
      $http
        .get("http://foo.localhost:8000/account/names")
        .then(function (response) {
          vm.companiesList = response.data;

          // Normalize vm.model.companies
          vm.model.companies = vm.model.companies.map(company => {
            const matchedCompany = vm.companiesList.find(listCompany => listCompany.id === company.id);
            return matchedCompany || {id: company.id, name: company.name};
          });
        });
    }

    function fetchUserList() {
      $http.get('http://foo.localhost:8000/user?include=photo').then(function (response) {
        vm.userNames = response.data.data;
        updateFilteredLists();
      });
    }

    function updateFilteredLists() {
      // Update filtered lists without using computed properties
      vm.userNamesWithoutOwner = vm.userNames?.filter(user =>
        !vm.model.user_id || user.id !== vm.model.user_id
      );

      vm.userNamesWithoutDeputies = vm.userNames?.filter(user =>
        !vm.model.deputies || !vm.model.deputies.some(deputy => deputy.id === user.id)
      );
    }

    // Watch for changes in owner and deputies
    $scope.$watch('vm.model.user_id', updateFilteredLists);
    $scope.$watch('vm.model.deputies', updateFilteredLists, true);

    fetchCompaniesList();
    fetchUserList();

    vm.submit = submit;
    vm.close = close;

    function submit() {
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
        notificationsService.error("Error", "Failed to update contact");
        vm.submitState = "error";
      });
    }

    function close() {
      if ($scope.model.close) {
        $scope.model.close();
      }
    }
  }
);
