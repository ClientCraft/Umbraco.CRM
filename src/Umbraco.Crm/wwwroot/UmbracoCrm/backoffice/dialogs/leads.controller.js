angular
  .module("umbraco")
  .controller(
    "Umbraco.Crm.Dialogs.LeadsController",
    function ($scope, $http, overlayService) {
      var vm = this;

      vm.submit = submit;
      vm.close = close;
      
      vm.deleteLead = function (leadId) {
        alert("NOT IMPLEMENTED YET");
      };

      function submit() {}

      function close() {
        overlayService.close();
      }
    }
  );
