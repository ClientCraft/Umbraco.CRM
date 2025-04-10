angular.module("umbraco").controller("Umbraco.Crm.Leads.OverviewController", function ($scope, $http, editorService, appState) {
  var vm = this;

  // Initial Setup
  vm.title = "Leads";
  vm.allowSelectAll = true;
  vm.buttons = [
    {
      label: "Create Lead",
      icon: "icon-plus",
      action: function () {
        vm.openCreateLeadDrawer();
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
    },
    {
      label: "Export to file",
      icon: "icon-cloud-download",
      action: function () {
        alert("Export Leads clicked");
      },
      isDisabled: false
    }
  ];

  // Fetch Leads Data
  $http
    .get("https://foo.client-craft.com/lead?include=status,notes,owner,owner.photo,photo,deputies,tags,tasks&includeConvertedLeads=false&includeCompletedTasks=false&page=1")
    .then(function (response) {
      vm.items = response.data.data.items;
      vm.options = {
        includeProperties: response.data.data.headers.map(x => ({
          alias: x.field,
          header: x.name
        }))
      };
    })
    .catch(function (error) {
      console.error("Error fetching leads:", error);
    });

  // Table Event Handlers
  vm.selectItem = function (item, $index, $event) {
    alert("Selected: " + item.name);
  };

  vm.clickItem = function (item) {
    alert("Clicked: " + item.name);
  };

  vm.selectAll = function ($event) {
    alert("Select All toggled");
  };

  vm.isSelectedAll = function () {
    return false; // Logic for checking if all items are selected
  };

  vm.isSortDirection = function (col, direction) {
    return "asc"; // Return sort direction (e.g., 'asc' or 'desc')
  };

  vm.sort = function (field, allow, isSystem) {
    alert("Sorting by " + field);
  };

  vm.openCreateLeadDrawer = function () {
    $scope.model = {
      view: "/App_Plugins/UmbracoCrm/backoffice/leads/create.html",
      animating: true,
    };
    editorService.open({
      title: "Create Lead Drawer",
      view: "/App_Plugins/UmbracoCrm/backoffice/leads/create.html",
      size: "small", // Options: small, medium, large
      submit: function(model) {
        editorService.close();
      },
      close: function() {
        editorService.close();
      }
    });
  };
});
