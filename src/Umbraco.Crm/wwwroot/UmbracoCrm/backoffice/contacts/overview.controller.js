angular
  .module("umbraco")
  .controller(
    "Umbraco.Crm.Contacts.OverviewController",
    function ($scope, $http, editorService, $location, overlayService) {
      var vm = this;
      const baseUrl =
        "https://foo.client-craft.com/contact";
      const includes ="?include=companies%2Cdeals%2Cowner%2Cdeputies%2Caddress%2Cnotes%2Ctags%2Cphoto%2CemailThreads%2CemailMessages&filter%5Binclude_account_deals%5D=true"

      // Initial Setup
      vm.title = "Contacts";
      vm.allowSelectAll = true;
      vm.buttons = [
        {
          label: "Create Contact",
          icon: "icon-plus",
          action: function () {
            vm.openCreateContactDrawer();
          },
          isDisabled: false,
        },
        {
          label: "Import from file",
          icon: "icon-cloud-upload",
          action: function () {
            alert("Import contacts clicked");
          },
          isDisabled: false,
        },
        {
          label: "Export to file",
          icon: "icon-cloud-download",
          action: function () {
            alert("Export contacts clicked");
          },
          isDisabled: false,
        },
      ];
      vm.items = [];
      vm.links = [];
      vm.meta = {};
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
      vm.openCreateContactDrawer = function () {
        editorService.open({
          title: "Create Lead Drawer",
          view: "/App_Plugins/UmbracoCrm/backoffice/leads/create.html",
          size: "small", // Options: small, medium, large
          submit: function (model) {
            vm.upDateList(vm.meta.current_page);
          },
        });
      };

      vm.openEditContactDrawer = function (item) {
        editorService.open({
          title: "Edit Lead Drawer",
          view: "/App_Plugins/UmbracoCrm/backoffice/leads/edit.html",
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

      vm.openDeletContactDialog = function (item) {
        overlayService.confirmDelete({
          title: "Warning",
          content:
            "Are you sure you want to delete this contact? This action cannot be undone.",
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

      vm.openViewContact = function (item) {
        $location.path("/Umbraco.Crm/contacts/view/" + item.id);
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
            console.error("Error fetching leads:", error);
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
