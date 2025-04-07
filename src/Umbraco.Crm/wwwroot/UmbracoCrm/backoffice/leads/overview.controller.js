angular
  .module("umbraco")
  .controller("Umbraco.Crm.Leads.OverviewController", function ($scope) {
    $scope.title = "Leads";
    $scope.buttons = [{
      label: "Create Lead",
      icon: "icon-plus",
      action: function () {
        alert("Create Lead clicked");
      },
      isDisabled: false
    },
    {
      label: "Import from file",
      icon: "icon-cloud-upload",
      action: function () {
        alert("Import Leads clicked");
      },
      isDisabled: false
    }, {
      label: "Export to file",
      icon: "icon-cloud-download",
      action: function () {
        alert("Export Leads clicked");
      },
      isDisabled: false
    }
  ]
  });
