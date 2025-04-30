angular.module("umbraco")
  .controller("Umbraco.Crm.Contacts.ViewController", function ($scope, $window, notificationsService, $location, $route, $routeParams, $http, editorService, overlayService) {
    var vm = this;

    vm.contactId = $routeParams.id;

    Object.defineProperty(vm, "latestNotes", {
      get: function () {
        // Sort notes by created_at in descending order and take the first 3
        if (vm.contact && vm.contact.notes && vm.contact.notes.length) {
          return vm.contact.notes
            .slice() // Create a copy to avoid modifying the original array
            .sort(function (a, b) {
              return new Date(b.created_at) - new Date(a.created_at);
            })
            .slice(0, 3);
        }
        return []; // Return empty array if no notes exist
      },
    });

    Object.defineProperty(vm, 'contactCompanyNames', {
      get: function () {
        if (vm.contact && vm.contact.companies && vm.contact.companies.length) {
          return vm.contact.companies.map(company => company.name).join(", ");
        }
        return ""
      }
    });

    Object.defineProperty(vm, 'closestDeals', {
      get: function () {
        if (vm.contact && vm.contact.deals && vm.contact.deals.length) {
          return vm.contact.deals.sort((a, b) => new Date(a.close_date) - new Date(b.close_date)).slice(0, 3);
        }
        return [];
      }
    });

    vm.handlePhotoUploadSuccess = function (photo) {
      console.log('Photo upload success:', photo);
      vm.contact.photo = photo; // Update the photo
    };

    vm.handleTagsChanged = function (tags) {
      // Optional callback when tags change
      console.log('Tags updated:', tags);
    };

    vm.markAsDoneButtonLoading = null;
    vm.markAsDone = function (task) {
      vm.markAsDoneButtonLoading = task.id;

      $http.post(`http://foo.localhost:8000/contact/${vm.contact.id}/task/${task.id}/complete`)
        .then(async function (response) {
          if (response.data.success) {
            fetchContactTasks(true);
          }
        })
        .catch(function (error) {
          console.error("Error marking task as done:", error);
        });
    }

    vm.markAsIncompleteButtonLoading = null;
    vm.markAsIncomplete = function (task) {
      vm.markAsIncompleteButtonLoading = task.id;

      $http.post(`http://foo.localhost:8000/contact/${vm.contact.id}/task/${task.id}/uncomplete`)
        .then(async function (response) {
          if (response.data.success) {
            fetchContactTasks(true);
          }
        })
        .catch(function (error) {
          console.error("Error marking task as done:", error);
        });
    }

    vm.deleteTaskButtonLoading = null;
    vm.deleteTask = function (task) {
      vm.deleteTaskButtonLoading = task.id;

      alert('Deleting task: ' + JSON.stringify(task));
    }

    // Fetch contact data
    let fetchContact = function () {
      $http
        .get("http://foo.localhost:8000/contact/" + vm.contactId + "?include=companies,deals,deals.status,owner,deputies,tags,photo,address,emailThreads.messages.sender,emailThreads.messages.toRecipients&includeCompletedTasks=true")
        .then(function (response) {
          vm.contact = {...vm.contact, ...response.data};


          vm.ancestors = [
            {name: 'Contacts', id: null, link: '/Umbraco.Crm/contacts/overview'},
            {name: vm.contact.name, id: vm.contactId}
          ];

          vm.title = 'Lead Progress';

        })
        .catch(function (error) {
          console.error("Error fetching contact:", error);
        });
    }
    fetchContact();

    vm.showCompletedTasks = false;
    vm.toggleShowCompletedTasks = function () {
      delete vm.contact.tasks;
      vm.showCompletedTasks = !vm.showCompletedTasks;
      fetchContactTasks();
    }

    let resetTaskButtonLoading = function () {
      vm.markAsDoneButtonLoading = null;
      vm.markAsIncompleteButtonLoading = null;
      vm.editTaskButtonLoading = null;
      vm.deleteTaskButtonLoading = null;
    }
    let fetchContactTasks = function (noLoading = false) {
      if (!noLoading) {
        vm.isLoadingTasks = true;
      }

      $http
        .get(`http://foo.localhost:8000/contact/${vm.contactId}/task?include=user,taskType&includeCompletedTasks=${vm.showCompletedTasks}`)
        .then(function (response) {
          vm.contact = {...vm.contact, tasks: response.data.data};
          resetTaskButtonLoading();
        })
        .catch(function (error) {
          console.error("Error fetching contact tasks:", error);
        })
        .finally(function () {
          vm.isLoadingTasks = false;
        });
    }

    vm.openEditTaskDrawer = function (task) {
      editorService.open({
        title: "Edit Task Drawer",
        view: "/App_Plugins/UmbracoCrm/backoffice/sidebars/editTask/edit.html",
        size: "small",
        data: {
          contactId: vm.contact.id,
          task: task
        },
        submit: function () {
          fetchContactTasks(true);
          editorService.close();
        },
        close: function () {
          editorService.close();
        }
      });
    };

    let fetchLatestNotes = function () {
      $http
        .get(`http://foo.localhost:8000/contact/${vm.contactId}/note?page=1&per_page=3`)
        .then(function (response) {
          vm.contact = {...vm.contact, notes: response.data.data};
        })
        .catch(function (error) {
          console.error("Error fetching contact:", error);
        });
    }
    fetchLatestNotes();

    // Breadcrumb navigation
    $scope.clickBreadcrumb = function (ancestor) {
      if (!ancestor?.link) return;
      $location.path(ancestor.link);
    };

    //// HELPERS
    vm.nameToAcronym = function (name) {
      if (!name) return '';
      return name.split(" ").map(word => word.charAt(0).toUpperCase()).join("");
    };

    vm.handleSeeAllNotes = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();

      overlayService.open({
        view: '/App_Plugins/UmbracoCrm/backoffice/dialogs/seeAllNotes/seeAllNotes.html',
        title: 'See all Notes',
        description: 'A table to display all notes for an object',
        closeButtonLabel: 'Close',
        hideSubmitButton: true,
        submitButtonStyle: "primary",
        data: {type: 'contact', id: vm.contactId},
        submit: function (model) {
          vm.handleCreateNote();
        },
        close: function () {
          overlayService.close();
        }
      });

    }

    vm.handleSeeAllDeals = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();

      overlayService.open({
        view: '/App_Plugins/UmbracoCrm/backoffice/dialogs/seeAllDeals/seeAllDeals.html',
        title: 'See all Deals',
        description: 'A table to display all deals for an object',
        closeButtonLabel: 'Close',
        hideSubmitButton: true,
        data: {type: 'contact', id: vm.contactId},
        close: function () {
          overlayService.close();
        }
      });

    }

    vm.handleCreateNote = function ($event) {
      if ($event) {
        $event.preventDefault();
        $event.stopPropagation();
      }

      editorService.open({
        title: "Create Note Drawer",
        view: "/App_Plugins/UmbracoCrm/backoffice/notes/create.html",
        size: "small", // Options: small, medium, large
        data: vm.contact,
        submit: function (model) {
          fetchLatestNotes();
          editorService.close();
        },
        close: function () {
          editorService.close();
        }
      });
    }

    vm.handleCreateDeal = function ($event) {
      if ($event) {
        $event.preventDefault();
        $event.stopPropagation();
      }

      editorService.open({
        title: "Create Deal Drawer",
        view: "/App_Plugins/UmbracoCrm/backoffice/deals/create.html",
        size: "small", // Options: small, medium, large
        data: vm.contact,
        submit: function () {
          fetchContact();
          editorService.close();
        },
        close: function () {
          editorService.close();
        }
      });
    }

    //// TABS
    // TODO: Consolidate this inside a component?
    vm.changeTab = changeTab;
    vm.tabs = [
      {alias: "emails", label: "Emails", active: true},
      {alias: "tasks", label: "Tasks"},
    ];

    function changeTab(selectedTab) {
      if (selectedTab.alias === "tasks" && !vm.contact.tasks) {
        fetchContactTasks();
      }

      vm.tabs.forEach(function (tab) {
        tab.active = false;
      });
      selectedTab.active = true;
    }

    vm.openEditContactDrawer = function () {
      editorService.open({
        title: "Edit Contact Drawer",
        view: "/App_Plugins/UmbracoCrm/backoffice/contacts/edit.html",
        size: "small", // Options: small, medium, large
        data: vm.contact,
        submit: function (model) {
          vm.contact = {...vm.contact, ...model};
          editorService.close();
        },
        close: function () {
          editorService.close();
        }
      });
    };
  });
