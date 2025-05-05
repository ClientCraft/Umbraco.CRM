angular.module("umbraco").component("clientCraftApp", {
  templateUrl: "/App_Plugins/uCRM/app/app.template.html",
  controller: function(){
    var vm = this;
    vm.componentInView = "leadsList";

    vm.setComponentInView = function(component) {
      vm.componentInView = component;
    }
  }
});
