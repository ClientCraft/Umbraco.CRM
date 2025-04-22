angular.module("umbraco").controller("Umbraco.Crm.Deals.CreateController", function ($scope, userService, usersResource, $http, notificationsService) {
  var vm = this;
  fetchUserList();
  // Initialize the model
  vm.model = {
    content: "",
    user_reference: "",
    contact_id: null,
    deal_type_id: null,
    deal_status_id: null,
    priority: null,
    owner_id: null,
    deputies: [],
  };

  // Track submission state for the button
  vm.submitState = "init";

  // // Get current user for the request
  // userService.getCurrentUser().then(function (user) {
  //   usersResource.getUser(user.id).then(function (response) {
  //     vm.model.user_reference = response.key;
  //   });
  // });

  vm.model.contact_id = $scope.model.data.id;
  vm.dealPriorities = [
    { id: 'low', name: 'Low' },
    { id: 'medium', name: 'Medium' },
    { id: 'high', name: 'High' }
  ];

  function fetchUserList() {
    $http.get('http://foo.localhost:8000/user?include=photo').then(function (response) {
      vm.userNames = response.data.data;
      updateFilteredLists();
    });
  }

  function updateFilteredLists() {
    // Update filtered lists without using computed properties
    vm.userNamesWithoutOwner = vm.userNames?.filter(user =>
      user.id !== vm.model.owner_id
    );

    vm.userNamesWithoutDeputies = vm.userNames?.filter(user =>
      !vm.model.deputies.some(deputy => deputy.id === user.id)
    );
  }

  // Watch for changes in owner and deputies
  $scope.$watch('vm.model.owner_id', updateFilteredLists);
  $scope.$watch('vm.model.deputies', updateFilteredLists, true);

  const getUserNames = function () {
    $http({
      method: 'GET',
      url: 'http://foo.localhost:8000/user/names',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
    }).then(function(response) {
      vm.users = response.data;
    });
  };
  getUserNames();

  const getDealStatuses = function() {
    $http({
      method: 'GET',
      url: 'http://foo.localhost:8000/deal/status',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
    }).then(function(response) {
      vm.dealStatuses = response.data;
    });
  };
  getDealStatuses();

  const getDealTypes = function() {
    $http({
      method: 'GET',
      url: 'http://foo.localhost:8000/deal/types',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
    }).then(function(response) {
      vm.dealTypes = response.data;
    });
  };
  getDealTypes();

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
      user_reference: vm.model.user_reference
    };

    // Make API call
    $http({
      method: 'POST',
      url: 'http://foo.localhost:8000/contact/' + vm.model.contact_id + '/note',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      data: payload
    }).then(function(response) {
      // Success
      notificationsService.success("Success", "Note has been added successfully");
      vm.submitState = "success";

      // Close or reset
      if ($scope.model && $scope.model.submit) {
        $scope.model.submit(response.data);
      }
    }, function(error) {
      // Error
      notificationsService.error("Error", "Failed to add note: " + (error.data?.message || "Unknown error"));
      vm.submitState = "error";
    });
  }

  function close() {
    if ($scope.model && $scope.model.close) {
      $scope.model.close();
    }
  }
});
