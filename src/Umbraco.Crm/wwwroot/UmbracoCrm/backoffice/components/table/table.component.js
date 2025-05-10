angular.module("umbraco").directive("clcTable", () => {return {
  restrict: "E",
  templateUrl:
    "/App_Plugins/UmbracoCrm/backoffice/components/table/table.template.html",
  bindings: {
    items: "<",
    columns: "<",
    options: "<",
    links: "<",
    isSortDirection: "&",
    onSort: "&",
    onClickItem: "&",
    onSelectItem: "&",
    onPagination: "&",
    onEditItem: "&",
    onViewItem: "&",
    onDeleteItem: "&",
  },
  scope: {
    items: "<",
    columns: "<",
    options: "<",
    links: "<",
    isSortDirection: "&",
    onSort: "&",
    onClickItem: "&",
    onSelectItem: "&",
    onPagination: "&",
    onEditItem: "&",
    onViewItem: "&",
    onDeleteItem: "&",
  },
  controller: [
    "$scope",
    function ($scope) {
      $scope.selectedItems = [];
      $scope.sortDirection = {};


      $scope.selectAll = function (event) {
        $scope.items.forEach(function (item) {
          item.selected = event.target.checked;
        });
        if ($scope.onSelectAll) {
          $scope.onSelectAll({ isSelected: event.target.checked });
        }
      };

      $scope.isSelectedAll = function () {
        return $scope.items.every(function (item) {
          return item.selected;
        });
      };

      $scope.selectItem = function (item, $index, $event) {
        item.selected = !item.selected;
        if ($scope.onSelectItem) {
          $scope.onSelectItem({ item: item });
        }
      };

      $scope.sort = function (column, allowSorting, isSystem) {
        if (allowSorting) {
          $scope.sortDirection[column] =
            $scope.sortDirection[column] === "asc" ? "desc" : "asc";
          if ($scope.onSortColumn) {
            $scope.onSortColumn({
              column: column,
              direction: $scope.sortDirection[column],
            });
          }
        }
      };

      $scope.isSortDirection = function (column, direction) {
        return $scope.sortDirection[column] === direction;
      };

      $scope.onClickItemHandler = function (item) {
        if ($scope.onClickItem) {
          $scope.onClickItem({ item: item });
        }
      };

      $scope.openEditDrawer = function (item) {
        if ($scope.onEditItem) {
          console.log("chamou a função de editar lead");
          $scope.onEditItem({ item: item });
        }
      };

      $scope.openDeleteDialog = function (item) {
        if ($scope.onDeleteItem) {
          $scope.onDeleteItem({ item: item });
        }
      };

      $scope.openViewItem = function (item) {
        if ($scope.onViewItem) {
          $scope.onViewItem({ item: item });
        }
      };

      $scope.btPaginationOnClick = function (link) {
        if ($scope.onPagination && link) {
          $scope.onPagination({ link: link });
        }
      };

      $scope.getIcon = function (item) {
        return item.icon || "";
      };

      $scope.nameToAcronym = function (name) {
        if (!name) return "";
        var words = name.split(" ");
        return words
          .map(function (word) {
            return word.charAt(0).toUpperCase();
          })
          .slice(0, 2)
          .join("");
      };

      console.log("Table component initialized", $scope.items);
    },
  ],
};});