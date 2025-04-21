angular.module('umbraco')
  .component('avatarDisplay', {
    templateUrl: '/App_Plugins/UmbracoCrm/backoffice/components/avatar-display/avatar-display.html',
    controllerAs: '$ctrl',
    bindings: {
      object: '<', // One-way binding for the object (e.g., vm.contact.owner)
      allowEdit: '<', // Boolean to enable photo editing
      size: '@', // Size in pixels (e.g., "80")
      photoUploadUrl: '@', // URL for photo upload (e.g., 'http://foo.localhost:8000/contact/1/photo')
      onSuccess: '&' // Event emitter for successful upload response
    },
    controller: function($element, $scope, notificationsService) {
      var ctrl = this;

      ctrl.$onInit = function() {
        ctrl.size = ctrl.size || '30';
      };

      ctrl.nameToAcronym = function(name) {
        if (!name) return '';
        return name.split(" ").map(word => word.charAt(0).toUpperCase()).join("");
      };

      ctrl.triggerPhotoChange = function(event) {
        event.preventDefault();
        const fileInput = $element.find('input[type="file"]')[0];
        if (fileInput) {
          fileInput.click();
        }
      };

      ctrl.handlePhotoChange = function(fileInput) {
        const file = fileInput.files[0];
        if (!file) {
          return;
        }

        const formData = new FormData();
        formData.append('image', file);

        if (!ctrl.photoUploadUrl) {
          console.error('photoUploadUrl is not provided');
          notificationsService.error('Error', 'Photo upload URL is missing');
          return;
        }

        const xhr = new XMLHttpRequest();
        xhr.open('POST', ctrl.photoUploadUrl, true);
        xhr.setRequestHeader('accept', 'application/json');
        // Do NOT set Content-Type; browser will set multipart/form-data with boundary
        xhr.onload = function() {
          if (xhr.status === 200 || xhr.status === 201) {
            const response = JSON.parse(xhr.responseText);
            console.log('Photo upload response:', response);
            // Emit the response to the parent
            ctrl.onSuccess({
              photo: {
                file_path: response.file_path,
                file_name: file.name
              }
            });
            notificationsService.success('Success', 'Photo uploaded successfully');
            $scope.$apply();
          } else {
            console.error('Error uploading photo:', xhr.status, xhr.responseText);
            console.log('Response details:', xhr.responseText);
            notificationsService.error('Error', 'Failed to upload photo');
            $scope.$apply();
          }
        };
        xhr.onerror = function() {
          console.error('Request failed');
          notificationsService.error('Error', 'Failed to upload photo');
          $scope.$apply();
        };
        xhr.send(formData);

        // Reset input to allow re-selecting the same file
        fileInput.value = '';
      };
    }
  });
