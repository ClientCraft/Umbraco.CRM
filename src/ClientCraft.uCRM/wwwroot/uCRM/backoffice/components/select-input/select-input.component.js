angular.module('umbraco')
  .component('selectInput', {
    templateUrl: '/App_Plugins/uCRM/backoffice/components/select-input/select-input.html',
    controllerAs: '$ctrl',
    bindings: {
      label: '@',
      model: '=',
      options: '<',
      multiple: '@',
      required: '@',
      placeholder: '@',
      optionValue: '@?',
      optionLabel: '@?',
      returnObject: '@'
    },
    controller: function() {
      var ctrl = this;

      ctrl.$onInit = function() {
        // Set defaults

        ctrl.optionValue = ctrl.optionValue || 'id';
        ctrl.optionLabel = ctrl.optionLabel || 'label';
        ctrl.returnObject = ctrl.returnObject === 'true';
      };
    }
  });
