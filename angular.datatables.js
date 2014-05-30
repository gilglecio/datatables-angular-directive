angular.module('datatablesDirectives', []).directive('datatable', function($http) {
    return {
        restrict: 'A',

        link: function($scope, $elem, attrs) {

            var options = {};

            if (typeof $scope.dtOptions !== 'undefined') {
                angular.extend(options, $scope.dtOptions);
            }

            if (attrs['dtoptions'] === undefined) {

                for (property in attrs) {
                    switch (property) {
                        case 'sajaxsource':
                            options['sAjaxSource'] = attrs[property];
                            break;

                        case 'sajaxdataprop':
                            options['sAjaxDataProp'] = attrs[property];
                            break;
                    }
                }
            } else {

                angular.extend(options, $scope[attrs['dtoptions']]);
            }

            if (typeof options['sAjaxSource'] === 'undefined') {
                throw "Ajax Source not defined! Use sajaxsource='/api/v1/blabla'";
            }

            if (typeof options['fnServerData'] === 'undefined') {
                options['fnServerData'] = function(sSource, aoData, resultCb) {
                    $http.get(sSource, aoData).then(function(result) {
                        resultCb(result.data);
                    });
                };
            }

            options.aoColumns = [];

            $elem.find('thead th').each(function() {

                var colattr = angular.element(this).data();

                if (colattr.mdata.indexOf("()") > 1) {

                    var fn = $scope[colattr.mdata.substring(0, colattr.mdata.length - 2)];

                    if (typeof fn === 'function') {

                        options.aoColumns.push({
                            mData: fn,
                            sClass: colattr.sclass,
                            bVisible: colattr.bvisible
                        });

                    } else {
                        throw "mData function does not exist in $scope.";
                    }
                } else {
                    options.aoColumns.push({
                        mData: colattr.mdata,
                        sClass: colattr.sclass,
                        bVisible: colattr.bvisible
                    });
                }
            });

            $elem.dataTable(options);
        }
    }
});