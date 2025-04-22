angular.module("umbraco").component("clientCraftlayout", {
  templateUrl: "/App_Plugins/UmbracoCrm/backoffice/layout.template.html",
  controller: function () {
    var vm = this;
    vm.componentInView = "leadsList";

    vm.setComponentInView = function (component) {
      vm.componentInView = component;
    };
  },
});
