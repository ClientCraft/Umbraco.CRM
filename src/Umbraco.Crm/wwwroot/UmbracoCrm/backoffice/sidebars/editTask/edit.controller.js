angular.module("umbraco").controller("Umbraco.Crm.Sidebars.EditTaskController", function ($scope, $http, notificationsService) {
    var vm = this;

    vm.model = angular.copy($scope.model.data);
    vm.model.task.user_id = vm.model.task.user.id ?? null;
    vm.model.task.task_type_id = vm.model.task.task_type?.id ?? null;
    console.log(vm.model.task.task_type?.id);

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
      $http.put(`http://foo.localhost:8000/contact/${vm.model.contactId}/task/${vm.model.task.id}`, {
        ...vm.model.task,
      }).then(function (response) {
        notificationsService.success("Success", "Task has been updated successfully");
        vm.submitState = "success";
        if ($scope.model.submit) {
          $scope.model.submit(response.data);
        }
      }, function (error) {
        notificationsService.error("Error", "Failed to update task");
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
