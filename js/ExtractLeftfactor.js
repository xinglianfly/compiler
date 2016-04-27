// /**
//  * Created by xiner on 16/4/25.
//  */
(function () {
    "use strict";


    angular
        .module('compiler', [])
        .controller('HomeController', avoidLeftArith)
        .directive('fileDropzone', fileDropzone)
        .directive('fileChange', fileChange)
    ;
})();