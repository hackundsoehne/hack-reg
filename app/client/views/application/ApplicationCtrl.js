const angular = require("angular");
const swal = require("sweetalert");

var path = require('path');

angular.module('reg')
  .controller('ApplicationCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    '$http',
    'currentUser',
    'settings',
    'Session',
    'UserService',
    function($scope, $rootScope, $state, $http, currentUser, settings, Session, UserService) {

      // Set up the user
      $scope.user = currentUser.data;

      // Is the student from MIT?
      // $scope.isMitStudent = $scope.user.email.split('@')[1] == 'mit.edu';

      // If so, default them to adult: true
      // if ($scope.isMitStudent){
      //   $scope.user.profile.adult = true;
      // }

      // Populate the school dropdown
      // populateSchools();
      _setupForm();

      $scope.regIsClosed = Date.now() > settings.data.timeClose;


      /**
       * TODO: JANK WARNING
       */
      // function populateSchools(){
      //   $http
      //     .get('/assets/schools.json')
      //     .then(function(res){
      //       var schools = res.data;
      //       var email = $scope.user.email.split('@')[1];

      //       // if (schools[email]){
      //       //   $scope.user.profile.school = schools[email].school;
      //       //   $scope.autoFilledSchool = true;
      //       // }
      //     });

      //   $http
      //     .get('/assets/schools.csv')
      //     .then(function(res){
      //       $scope.schools = res.data.split('\n');
      //       $scope.schools.push('Other');

      //       var content = [];

      //       for(i = 0; i < $scope.schools.length; i++) {
      //         $scope.schools[i] = $scope.schools[i].trim();
      //         content.push({title: $scope.schools[i]})
      //       }

      //       $('#school.ui.search')
      //         .search({
      //           source: content,
      //           cache: true,
      //           onSelect: function(result, response) {
      //             $scope.user.profile.school = result.title.trim();
      //           }
      //         })
      //     });
      // }

      $scope.uploadFile = function() {
        var f = document.getElementById('file').files[0],
            r = new FileReader();
        
        r.onloadend = function(e) {
          // Only allow pdf uploads
          if (f.name.split(".").pop() != "pdf") {
            swal("Only PDFs are allowed", "Upload a .pdf file instead");
            return;
          }
          if(f.size > 10000000) {
            swal("File to large", "upload a smaller version of your pdf");
            return;
          }

          if($scope.user.profile.name == undefined) {
            swal("No Name set", "Please enter your name in the respective field above first.");
          }

          var data = e.target.result; 
          var body = {
            file : data,
            name : $scope.user.profile.name
          }
          // Put Http Request to new router endpoint here
          UserService.uploadFile(Session.getUserId(), body).then(response => {
            swal("Awesome!", "Your file has been uploaded", "success");
            
            var fileid = $scope.user.profile.name.replace(/\s/g, "").toLowerCase();
            var filePath = path.join(__dirname, "../../../..", '/uploads/' + fileid + '.pdf');
            $scope.user.profile.filepath = filePath;

          }, err => {
            swal("Something went wrong", err.data);
          });
        }
    
        r.readAsDataURL(f);
    }
    

      function _updateUser(e){
        UserService
          .updateProfile(Session.getUserId(), $scope.user.profile)
          .then(response => {
            swal("Awesome!", "Your application has been saved.", "success").then(value => {
              $state.go("app.dashboard");
            });
          }, response => {
            console.log($scope.user.profile);
            swal("Uh oh!", "Something went wrong.", "error");
          });
      }

      function isMinor() {
        return !$scope.user.profile.adult;
      }

      function minorsAreAllowed() {
        return settings.data.allowMinors;
      }

      function minorsValidation() {
        // Are minors allowed to register?
        if (isMinor() && !minorsAreAllowed()) {
          return false;
        }
        return true;
      }



      function _setupForm(){
        // Custom minors validation rule
        $.fn.form.settings.rules.allowMinors = function (value) {
          return minorsValidation();
        };

        // Semantic-UI form validation
        $('.ui.form').form({
          inline: true,
          fields: {
            name: {
              identifier: 'name',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter your name.'
                }
              ]
            },
            school: {
              identifier: 'school',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter your school name.'
                }
              ]
            },
            experience: {
              identifier: 'experience',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please specify how experienced you are.'
                }
              ]
            },
            gender: {
              identifier: 'gender',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please select a gender.'
                }
              ]
            },
            adult: {
              identifier: 'adult',
              rules: [
                {
                  type: 'allowMinors',
                  prompt: 'You must be an adult.'
                }
              ]
            }
          }
        });
      }

      $scope.submitForm = function(){
        if ($('.ui.form').form('is valid')){
          _updateUser();
        } else {
          swal("Uh oh!", "Please Fill The Required Fields", "error");
        }
      };
    }]);
