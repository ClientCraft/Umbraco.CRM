angular
  .module("umbraco")
  .controller(
    "Umbraco.Crm.Contacts.CreateController",
    function ($scope, $http, notificationsService, editorService) {
      var vm = this;

      vm.model = $scope.model.data;

      function fetchCompaniesList() {
        $http
          .get("https://foo.client-craft.com/account/names")
          .then(function (response) {
            vm.companiesList = response.data;

            // Normalize vm.model.companies
            vm.model.companies = vm.model.companies.map((company) => {
              const matchedCompany = vm.companiesList.find(
                (listCompany) => listCompany.id === company.id
              );
              return matchedCompany || { id: company.id, name: company.name };
            });
          });
      }

      function fetchUserList() {
        $http
          .get("https://foo.client-craft.com/user?include=photo")
          .then(function (response) {
            vm.userNames = response.data.data;
            updateFilteredLists();
          });
      }

      function updateFilteredLists() {
        // Update filtered lists without using computed properties
        vm.userNamesWithoutOwner = vm.userNames.filter(
          (user) => !vm.model.owner || user.id !== vm.model.owner.id
        );

        vm.userNamesWithoutDeputies = vm.userNames.filter(
          (user) =>
            !vm.model.deputies ||
            !vm.model.deputies.some((deputy) => deputy.id === user.id)
        );
      }

      // Watch for changes in owner and deputies
      $scope.$watch("model.data.owner", updateFilteredLists);
      $scope.$watch("model.data.deputies", updateFilteredLists, true);

      fetchCompaniesList();
      fetchUserList();

      vm.submit = submit;
      vm.close = close;

      function submit() {
        $http
          .post("https://foo.client-craft.com/contact/", {
            ...vm.model,
            _method: "POST",
          })
          .then(
            function (response) {
              notificationsService.success(
                "Success",
                "Contact has been updated successfully"
              );
              vm.submitState = "success";
              if ($scope.model.submit) {
                $scope.model.submit(response.data);
              }
            },
            function (error) {
              notificationsService.error("Error", "Failed to update contact");
              vm.submitState = "error";
            }
          );
      }

      function close() {
        if ($scope.model.close) {
          $scope.model.close();
        }
        editorService.close()
      }
    }
  );
