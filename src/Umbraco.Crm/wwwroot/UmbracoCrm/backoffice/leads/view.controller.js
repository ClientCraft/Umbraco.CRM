angular.module("umbraco")
  .controller("Umbraco.Crm.Leads.ViewController", function ($scope, $window, $location, $route, $routeParams, $http, editorService) {
    var vm = this;

    vm.leadId = $routeParams.id;

    // Fetch lead data
    $http
      .get("http://foo.localhost:8000/lead/" + vm.leadId + "?include=status,notes,owner,owner.photo,photo,deputies,deputies.photo,tags,tasks")
      .then(function (response) {
        vm.lead = response.data;
        vm.ancestors = [
          { name: 'Leads', id: null, link: '/Umbraco.Crm/leads/overview' },
          { name: vm.lead.name, id: vm.leadId }
        ];

        // Progress bar data (based on lead status)
        vm.stages = [
          { id: 1, order: 1, label: 'New Lead' },
          { id: 2, order: 2, label: 'Contacted' },
          { id: 3, order: 3, label: 'Qualified' },
          { id: 4, order: 4, label: 'Converted' }
        ];
        vm.currentStage = vm.stages.find(stage => stage.id === vm.lead.status.id) || vm.stages[0];
        vm.title = 'Lead Progress';

        console.log(vm.lead);
      })
      .catch(function (error) {
        console.error("Error fetching lead:", error);
      });

    // Breadcrumb navigation
    $scope.clickBreadcrumb = function(ancestor) {
      if (!ancestor?.link) return;
      $location.path(ancestor.link);
    };

    //// HELPERS
    vm.nameToAcronym = function(name) {
      if (!name) return '';
      return name.split(" ").map(word => word.charAt(0).toUpperCase()).join("");
    };

    //// TABS
    vm.changeTab = changeTab;
    vm.tabs = [
      { alias: "emails", label: "Emails", active: true },
      { alias: "tasks", label: "Tasks" },
    ];

    function changeTab(selectedTab) {
      vm.tabs.forEach(function(tab) {
        tab.active = false;
      });
      selectedTab.active = true;
    }

    //// PROGRESS BAR
    vm.emitClickEvent = function(stage) {
      $scope.$emit('stage-clicked', { stage: stage });
      console.log('Stage clicked:', stage);
    };

    vm.getStageStatus = function(stage) {
      if (stage.id === vm.currentStage.id) {
        return 'current';
      }
      if (vm.currentStage.order && stage.order < vm.currentStage.order) {
        return 'complete';
      }
      return '';
    };

    vm.openEditLeadDrawer = function () {
      editorService.open({
        title: "Create Lead Drawer",
        view: "/App_Plugins/UmbracoCrm/backoffice/leads/edit.html",
        size: "small", // Options: small, medium, large
        data: vm.lead,
        submit: function(model) {
          editorService.close();
        },
        close: function() {
          editorService.close();
        }
      });
    };
  });
