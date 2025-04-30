angular
  .module("umbraco")
  .controller(
    "Umbraco.Crm.Accounts.OverviewController",
    function ($scope, $http, editorService, $location, overlayService) {
      var vm = this;
      const baseUrl = "https://foo.client-craft.com/account";
      const includes =
        "?include=contacts%2Cdeals%2Cowner%2Cdeputies%2Cnotes%2Cphoto%2Ctags&page=1&filter%5Binclude_contact_deals%5D=true";      
      
        // Initial Setup
      vm.title = "Accounts";
      vm.allowSelectAll = true;
      vm.buttons = [
        {
          label: "Create Account",
          icon: "icon-plus",
          action: function () {
            vm.openCreateAccountDrawer();
          },
          isDisabled: false,
        },
        {
          label: "Import from file",
          icon: "icon-cloud-upload",
          action: function () {
            alert("Import Accounts clicked");
          },
          isDisabled: false,
        },
        {
          label: "Export to file",
          icon: "icon-cloud-download",
          action: function () {
            alert("Export Accounts clicked");
          },
          isDisabled: false,
        },
      ];
      vm.items = []
      vm.links = []
      vm.meta = {}
      vm.isLoading = true;

      // Table Event Handlers
      vm.selectItem = function (item, $index, $event) {
        //alert("Selected: " + item.name);
      };

      vm.clickItem = function (item) {};

      vm.selectAll = function ($event) {
        //alert("Select All toggled");
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

      // Crud Operations
      vm.openCreateAccountDrawer = function () {
        editorService.open({
          title: "Create Lead Drawer",
          view: "/App_Plugins/UmbracoCrm/backoffice/accounts/create.html",
          size: "small", // Options: small, medium, large
          submit: function (model) {
            vm.upDateList(vm.meta.current_page);
          },
        });
      };

      vm.openEditDealDrawer = function (item) {
        editorService.open({
          title: "Edit Lead Drawer",
          view: "/App_Plugins/UmbracoCrm/backoffice/deals/edit.html",
          size: "small", // Options: small, medium, large,
          data: { ...item },
          submit: function (model) {
            vm.items = vm.items.map((lead) => {
              if (lead.id === model.id) {
                return { ...lead, ...model };
              }
              return lead;
            });
          },
        });
      };

      vm.openDeletDealDialog = function (item) {
        overlayService.confirmDelete({
          title: "Warning",
          content:
            "Are you sure you want to delete this deal? This action cannot be undone.",
          size: "small",
          hideCloseButton: false,
          submitButtonLabel: "Yes",
          closeButtonLabel: "Cancel",
          submit: function () {
            $http.delete(baseUrl + item.id).then(() => {
              if (vm.items.length <= 1) {
                vm.upDateList(vm.meta.current_page - 1);
              } else {
                vm.upDateList(vm.meta.current_page);
              }

              notificationsService.success(
                "Success",
                "Lead has been deleted successfully"
              );
            });
            overlayService.close();
          },
          close: function () {
            overlayService.close();
          },
        });
      };

      vm.openViewDeal = function (item) {
        $location.path("/Umbraco.Crm/deals/view/" + item.id);
      };

      // Pagination Handlers
      vm.onPaginationHandler = function (link) {
        vm.fetchData(link);
      };

      // utility functions
      vm.fetchData = function (address) {
        $http
          .get(address)
          .then(function (response) {
            console.log(response.data.data.headers);
            vm.items = response.data.data.items;
            vm.options = {
              includeProperties: response.data.data.headers.map((x) => ({
                alias: x.field,
                header: x.name,
                sortable: x.sortable,
              })),
            };
            vm.links = response.data.links;
            vm.meta = response.data.meta;
            vm.isLoading = false;
          })
          .catch(function (error) {
            console.error("Error fetching account:", error);
          });
      };

      vm.nameToAcronym = function (name) {
        if (!name) return "";
        return name
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase())
          .join("");
      };

      vm.upDateList = (page) => {
        vm.fetchData(baseUrl + `&page=${page}`);
      };

      // Initial Data Fetch
      vm.fetchData(baseUrl + includes + `&page=1`);
    }
  );
