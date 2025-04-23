angular
  .module("umbraco")
  .controller(
    "Umbraco.Crm.Leads.OverviewController",
    function ($scope, $http, editorService, $location, overlayService) {
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
          isDisabled: false,
        },
        {
          label: "Import from file",
          icon: "icon-cloud-upload",
          action: function () {
            alert("Import Leads clicked");
          },
          isDisabled: false,
        },
        {
          label: "Export to file",
          icon: "icon-cloud-download",
          action: function () {
            alert("Export Leads clicked");
          },
          isDisabled: false,
        },
      ];
      vm.items = []
      vm.links = []
      vm.meta = {}
      // Fetch Leads Data
      vm.fetchData = function(address){
        $http.get(address)
          .then(function (response) {
            vm.items = response.data.data.items;
            vm.options = {
              includeProperties: response.data.data.headers.map((x) => ({
                alias: x.field,
                header: x.name,
              })),
            };
            vm.links = response.data.links
            vm.meta = response.data.meta
          })
          .catch(function (error) {
            console.error("Error fetching leads:", error);
          });
      }

      // Table Event Handlers
      vm.selectItem = function (item, $index, $event) {
        alert("Selected: " + item.name);
      };

      vm.clickItem = function (item) {
        $location.path("/Umbraco.Crm/leads/view/" + item.id);
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
        editorService.open({
          title: "Create Lead Drawer",
          view: "/App_Plugins/UmbracoCrm/backoffice/leads/create.html",
          size: "small", // Options: small, medium, large
          submit: function (model) {
            console.log("Creating lead with data: " + JSON.stringify(model));
            vm.items = [...vm.items, model];
          },
        });
      };

      vm.openEditLeadDrawer = function (item) {
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

      vm.openDeletLeadDialog = function (item) {
        overlayService.open({
          title: "Warning",
          content:
            "Are you sure you want to delete this lead? This action cannot be undone.",
          size: "small",
          hideCloseButton: true,
          submitButtonLabel: "Yes",
          closeButtonLabel: "Cancel",
          submit: function(){
            $http.delete(`http://foo.localhost:8000/lead/${item.id}`).then(()=>{
              vm.items = vm.items.filter((lead)=>{lead.id !== item.id})
              notificationsService.success(
                "Success",
                "Lead has been deleted successfully"
              );
            });
            overlayService.close()
          },
          close: function(){
            overlayService.close()
          }
        });
      };
      vm.nameToAcronym = function (name) {
        if (!name) return "";
        return name
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase())
          .join("");
      };

      vm.btPaginationOnClick = function (link){
        vm.fetchData(link)
      }

      vm.fetchData(
        "http://foo.localhost:8000/lead?include=status,notes,owner,owner.photo,photo,deputies,deputies.photo,tags,tasks&includeConvertedLeads=false&includeCompletedTasks=false&page=1"
      );
    }
  );
