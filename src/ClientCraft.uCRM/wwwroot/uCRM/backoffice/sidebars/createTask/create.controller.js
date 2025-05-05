angular.module("umbraco").controller("ClientCraft.uCRM.Sidebars.CreateTaskController", function ($scope, $http, notificationsService) {
    var vm = this;
    console.log('teste');

    vm.model = angular.copy($scope.model.data);
    vm.model.task = {
      title: "",
      description: "",
      due_date: new Date(),
      user_id: null,
      task_type_id: null,
    };

    // Initialize date picker configuration
    vm.datePickerConfig = {
      locale: 'en', // Specify the locale (e.g., 'en' for English)
      format: 'YYYY-MM-DD', // Specify the date format
      allowInvalid: true, // Allow invalid dates during input
      minDate: new Date(), // Optional: set a minimum date
      // Add other options as needed by umb-date-time-picker
    };

    function fetchUserList() {
      $http.get('http://foo.localhost:8000/user?include=photo').then(function (response) {
        vm.userNames = response.data.data;
      });
    }
    fetchUserList();

    function fetchTaskTypes() {
      $http.get('http://foo.localhost:8000/task/type').then(function (response) {
        vm.taskTypes = response.data.data;
      });
    }
    fetchTaskTypes();

    vm.submit = submit;
    vm.close = close;

    function submit() {
      vm.submitState = 'busy';
      $http.post(`http://foo.localhost:8000/contact/${vm.model.id}/task`, {
        ...vm.model.task,
      }).then(function (response) {
        notificationsService.success("Success", "Task has been created successfully");
        vm.submitState = "success";
        if ($scope.model.submit) {
          $scope.model.submit(response.data);
        }
      }, function (error) {
        notificationsService.error("Error", "Failed to create task");
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
