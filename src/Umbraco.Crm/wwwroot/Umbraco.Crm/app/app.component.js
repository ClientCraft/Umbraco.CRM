angular.module("umbraco").component("clientCraftApp", {
  templateUrl: "/App_Plugins/Umbraco.Crm/app/app.template.html",
  controller: function(){
    var vm = this;
    vm.componentInView = "leadsList";

    vm.setComponentInView = function(component) {
      vm.componentInView = component;
    }
  }
});
