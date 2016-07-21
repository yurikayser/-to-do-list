var app = angular.module("tdmodule", []);

app.controller("tdcontroller",function($scope, $element,$http){
	var id=0
	$scope.task={};
	$scope.editmode = false;
	$scope.createmode= true;
	$scope.tasks=[];
	getJson();

	// function that gets the data from the Json File and put it into the $scope.Tasks array
	function getJson(){
		$http.get('http://localhost:8081/getTasks')
		.success (function (data) {
	        $scope.tasks = data;
	       	if ($scope.tasks.length !=0){
	       		id = $scope.tasks[$scope.tasks.length - 1].id;
	       	}
	    })
        .error (function () {
          alert ("couldn't load data");
        });
	}
	//this function creates a new task
	$scope.createTask = function(){
		if(validate()){
			id++;
			$scope.task.id = id;
			$scope.tasks.push($scope.task);
			postJson();
			$scope.task={};	
		}
	};
	//this function makes the validation of the formulary fields.
	function validate(){
		var valid = true;
		if(!$scope.taskForm.title.$valid){
			alert("Invalid Title");
			valid=false;
		}else if(!$scope.taskForm.description.$valid){
			alert('Invalid Description');
			valid=false;
		}else if(!$scope.taskForm.status.$valid){
			alert('Invalid Status');
			valid=false;
		}else if (!$scope.taskForm.date.$valid){
			alert('Invalid Date');
			valid=false;
		}else if(!$scope.taskForm.hour.$valid){
			alert('Invalid hour');
			valid=false;
		}
		return valid;
	}
	//this function is called when the edit button is clicked and is responsible for put the information of the right task in the formulary
	$scope.editSelected=function(){
		var taskId = window.event.target.parentNode.parentNode.parentNode.parentNode.id;
		var index;
		$scope.editmode = true;
		$scope.createmode= false;

		//get the index of the element
		index = findElement(taskId);
		$scope.task.id = $scope.tasks[index].id;
		$scope.task.title = $scope.tasks[index].title;
		$scope.task.hour = $scope.tasks[index].hour;
		$scope.task.date = $scope.tasks[index].date;
		$scope.task.status = $scope.tasks[index].status;
		$scope.task.description = $scope.tasks[index].description;
	}
	// this function is called by the 'Save' button in the form. It updates the information of the edited task
	$scope.saveEdit=function(){
		var index;
		if(validate()){

			index = findElement($scope.task.id);
			$scope.tasks[index] = $scope.task;
			editJson();
			$scope.task = {};
			$scope.editmode = false;
			$scope.createmode= true;
		}
		
	}
	//this function updates the Json file with the edited task
	function editJson(){
		$http.post('http://localhost:8081/editTask', $scope.task);
	}


	//this function is called by the 'remove' button and is responsible for remove the right task from the array
	$scope.remove= function(){
		var taskId = window.event.target.parentNode.parentNode.parentNode.parentNode.id;
		var index;
		index = findElement(taskId);
		removeJson($scope.tasks[index]);
		$scope.tasks.splice(index,1);
	};

	//this function removes the task from de Json file
	function removeJson(element){
		$http.post('http://localhost:8081/removeTask', element);

	}

	//returns the index of the element searching by the Id of the task
	function findElement(id){
		var found = false;
		var i = 0;
		while(!found){
			if($scope.tasks[i].id == id){
				found=true;
			}else{
				i++;
			}	
		}
		return i;
	}

	// this function posts a new task in the json file.
	function postJson(){
		$http.post('http://localhost:8081/postTask', $scope.task);
	}
});
