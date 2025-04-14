angular.module('umbraco')
  .component('tagInput', {
    templateUrl: '/App_Plugins/UmbracoCrm/backoffice/components/tag-input/tag-input.html',
    bindings: {
      tags: '=',
      entityType: '@',
      entityId: '<',
      onChange: '&?'
    },
    controller: function($scope, $http, $timeout, $element) {
      var ctrl = this;

      ctrl.isNewTag = function() {
        if (!ctrl.searchText || ctrl.searchText.length === 0) {
          return false;
        }
        return !ctrl.getFilteredTags().some(function(t) {
          return t.label.toLowerCase() === ctrl.searchText.toLowerCase();
        });
      };

      // Available tag colors
      ctrl.colors = [
        { id: 'blue', value: '#1a85ff' },
        { id: 'red', value: '#d41c1c' },
        { id: 'green', value: '#1e8e3e' },
        { id: 'pink', value: '#e83e8c' },
        { id: 'yellow', value: '#f9a825' },
        { id: 'gray', value: '#6c757d' },
        { id: 'purple', value: '#6f42c1' },
        { id: 'orange', value: '#fd7e14' }
      ];

      ctrl.$onInit = function() {
        ctrl.searchText = '';
        ctrl.isDropdownOpen = false;
        ctrl.globalTags = [];
        ctrl.newTagColor = ctrl.colors[0].value;
        ctrl.createButtonState = 'init';


        // Load global tags
        ctrl.loadGlobalTags();

        // Close dropdown when clicking outside
      };

      ctrl.loadGlobalTags = function() {
        $http.get(`http://foo.localhost:8000/${ctrl.entityType}/tag`)
          .then(function(response) {
            ctrl.globalTags = response.data || [];
            ctrl.selectedTags = ctrl.tags || [];
          })
          .catch(function(error) {
            console.error("Error loading tags:", error);
          });
      };

      ctrl.openDropdown = function() {
        ctrl.isDropdownOpen = true;
        ctrl.searchText = '';
        $timeout(function() {
          var searchInput = $element[0].querySelector('.tag-search-input');
          if (searchInput) {
            searchInput.focus();
          }
        }, 100);
      };

      ctrl.getFilteredTags = function() {
        if (!ctrl.searchText) {
          return ctrl.globalTags;
        }

        const searchLower = ctrl.searchText.toLowerCase();
        return ctrl.globalTags.filter(tag =>
          tag.label.toLowerCase().includes(searchLower));
      };

      ctrl.isTagSelected = function(tag) {
        return ctrl.selectedTags.some(t => t.id === tag.id);
      };

      ctrl.toggleTag = function(tag) {
        const tagIndex = ctrl.selectedTags.findIndex(t => t.id === tag.id);

        if (tagIndex > -1) {
          // Remove tag
          ctrl.selectedTags.splice(tagIndex, 1);
          $http.delete(`http://foo.localhost:8000/${ctrl.entityType}/${ctrl.entityId}/tag/${tag.id}/detach`)
            .catch(function(error) {
              console.error("Error removing tag:", error);
              // Restore tag on error
              ctrl.selectedTags.push(tag);
            });
        } else {
          // Add tag
          ctrl.selectedTags.push(tag);
          $http.post(`http://foo.localhost:8000/${ctrl.entityType}/${ctrl.entityId}/tag/${tag.id}/attach`)
            .catch(function(error) {
              console.error("Error adding tag:", error);
              // Remove tag on error
              const index = ctrl.selectedTags.findIndex(t => t.id === tag.id);
              if (index > -1) {
                ctrl.selectedTags.splice(index, 1);
              }
            });
        }

        // Update parent
        if (ctrl.onChange) {
          ctrl.onChange({ tags: ctrl.selectedTags });
        }
      };

      ctrl.createNewTag = function() {
        if (!ctrl.searchText) return;

        if (ctrl.createButtonState === 'busy') return;
        ctrl.createButtonState = 'busy';

        const newTag = {
          label: ctrl.searchText,
          color: ctrl.newTagColor
        };

        $scope.$applyAsync();

        $http.post(`http://foo.localhost:8000/${ctrl.entityType}/tag`, newTag)
          .then(function(response) {
            const createdTag = response.data;
            // Add to global tags
            ctrl.globalTags.push(createdTag);
            // Add to selected tags
            ctrl.selectedTags.push(createdTag);
            // Associate tag with entity
            ctrl.createButtonState = 'success';
            return $http.post(`http://foo.localhost:8000/${ctrl.entityType}/${ctrl.entityId}/tag/${createdTag.id}/attach`)
          })
          .then(function() {
            ctrl.searchText = '';
            // Update parent
            ctrl.createButtonState = 'error';

            if (ctrl.onChange) {
              ctrl.onChange({ tags: ctrl.selectedTags });
            }
          })
          .catch(function(error) {
            console.error("Error creating tag:", error);
          })
          .finally(function() {
            $scope.$applyAsync();
          })
      };

      ctrl.removeTag = function(tag, $event) {
        if ($event) {
          $event.stopPropagation();
        }

        const tagIndex = ctrl.selectedTags.findIndex(t => t.id === tag.id);
        if (tagIndex > -1) {
          ctrl.selectedTags.splice(tagIndex, 1);

          $http.delete(`http://foo.localhost:8000/${ctrl.entityType}/${ctrl.entityId}/tag/${tag.id}/detach`)
            .catch(function(error) {
              console.error("Error removing tag:", error);
              // Restore tag on error
              ctrl.selectedTags.push(tag);
            });

          // Update parent
          if (ctrl.onChange) {
            ctrl.onChange({ tags: ctrl.selectedTags });
          }
        }
      };

      ctrl.clearSearch = function() {
        ctrl.searchText = '';
      };
    }
  });
