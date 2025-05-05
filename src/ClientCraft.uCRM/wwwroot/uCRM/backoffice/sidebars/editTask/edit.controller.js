angular.module("umbraco").controller("ClientCraft.uCRM.Sidebars.EditTaskController", function ($scope, $http, notificationsService) {
  var vm = this;

  // Copy the model data
  vm.model = angular.copy($scope.model.data);

  // Initialize date picker configuration FIRST (before transforming the date)
  vm.datePickerConfig = {
    locale: 'en',
    format: 'YYYY-MM-DD', // Date-only format
    allowInvalid: true,
    minDate: null,
    pickDate: true,
    pickTime: false, // Disable time picking
  };

  // Transform due_date to a string in YYYY-MM-DD format (without time)
  if (vm.model.task.due_date) {
    const date = new Date(vm.model.task.due_date);
    // Get just the date portion in YYYY-MM-DD format
    vm.model.task.due_date = date.toISOString().split('T')[0];
    console.log("Transformed due_date:", vm.model.task.due_date);
  }

  // Set user_id and task_type_id with fallback
  vm.model.task.user_id = vm.model.task.user?.id ?? null;
  vm.model.task.task_type_id = vm.model.task.task_type?.id ?? null;

  vm.onDateChange = function(dateStr, filter) {
    console.log("Date picker changed - dateStr:", dateStr, "filter:", filter);
    if (dateStr) {
      vm.model.task.due_date = dateStr; // Update the model manually
      console.log("Manually updated due_date:", vm.model.task.due_date);
      $scope.$apply(); // Ensure AngularJS digest cycle picks up the change
    } else {
      console.log("dateStr is undefined or invalid");
    }
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
    console.log("Due Date before submit:", vm.model.task.due_date);
    const taskData = {
      ...vm.model.task,
      due_date: vm.model.task.due_date
        ? (vm.model.task.due_date instanceof Date
          ? vm.model.task.due_date.toISOString()
          : new Date(vm.model.task.due_date).toISOString())
        : null,
    };
    console.log("Task data to send:", taskData);

    vm.submitState = 'busy';
    $http.put(`http://foo.localhost:8000/contact/${vm.model.contactId}/task/${vm.model.task.id}`, taskData)
      .then(function (response) {
        notificationsService.success("Success", "Task has been updated successfully");
        vm.submitState = "success";
        if ($scope.model.submit) {
          $scope.model.submit(response.data);
        }
      }, function (error) {
        notificationsService.error("Error", error.data.message ?? "Failed to update task");
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
