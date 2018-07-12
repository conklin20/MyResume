'use strict';

$(document).ready(function(){
  // userId & resumeId are global vars defined in /js/build-resume/index.js
  const url = '/api/u/' + userId + '/r/' + resumeId + '/projects'; 
  
  //load section data
  $('#nav-projects').on('click', function(){
    rebuildProjectList(url); 
  })
  
  $('#btn-projects-settings').on('click', function(){
    saveSettings(url, $("#projects-settings :input"));
  })
  
  $('#btn-add-new-project').on('click', function($e){
    $e.preventDefault(); //prevents scroll to top of page
    addProject($(".new-project"), url);
  })
  
  $('.projects').on('click', '#project-del', function(){
    if(confirm('Are you sure you want to delete this project entry?')){
      removeProject($(this).parent(), url);
    }
  });
  
  $('#btn-add-new-project-bullet').on('click', function($e){
    $e.preventDefault(); //prevents scroll to top of page
    addProjectBullet($(".new-project-bullet"), url);
  })
  
  $('.projects').on('click', '#bullet-del', function(){
    if(confirm('Are you sure you want to delete this bullet item?')){
      removeProjectBullet($(this).parent(), url);
    }
  });
  
  $('.projects').on('click', '#bullet-dn', function(){
    moveProjectBullet($(this).parent(), url, 'down');
  });
  
  $('.projects').on('click', '#bullet-up', function(){
    moveProjectBullet($(this).parent(), url, 'up');
  });
});

function displayProjects(projects){
  projects.forEach(function(project, idx, projArr){
    appendProject(project, projArr);
  });
}

function appendProject(project, projArr){
  const projectBtns = ` | <span id="project-del"><i class="fa fa-trash"></i></span> `; 

  var projectHTML = '<li data-projectid=' + project._id + '>' + project.name + projectBtns;
  
  //append the project level element 
  $('.projects').append(projectHTML);
  
    
  const bulletBtns = ` | <span id="bullet-del"><i class="fa fa-trash"></i> | </span> 
                            <span id="bullet-dn"><i class="fa fa-chevron-down"></i> | </span>
                            <span id="bullet-up"><i class="fa fa-chevron-up"></i></span> `; 
           
  var bulletHTML = ''
  
  project.projectDetail.forEach(function(bullet, idx, arr){
    bulletHTML += (idx === 0 ? '<ul id="' + project._id + '">' : '') +  '<li data-projectid=' + project._id + ' data-bulletidx=' + idx + '>' + bullet  + bulletBtns + '</li>' + (idx === arr.length-1 ? '</ul>' : '');
  });
  
  $('.projects').append(bulletHTML);
}

function addProject(project, url){
  var newProject = {
    name:           project[0].value,
    description:    project[1].value,
    url:            project[2].value,
    logo:           project[3].value,
    startDate:      project[4].value,
    endDate:        project[5].value,
    hideOnPrint:    project[6].checked ? true : false
  }
  
  if(newProject.name && newProject.description && newProject.startDate){
    $.post(url, { newProject: newProject })
    .then(function(addedProject){
      // reset the form
      resetForm(project);
      // REFACTOR THIS SO IT DOESNT REBUILD THE ENTIRE LIST EVERY TIME
      // append new company to list 
      // appendExperience(addedCompany, addedCompany);
      rebuildProjectList(url); 
      
      // append to company to dropdown
      $('#project-dd').append('<option value=' + addedProject._id + '>' + addedProject.name + '</option>')
    })
    .catch(function(err){
        throwErr(err);
    });
  }
}

function addProjectBullet(bullet, url){
  var updateUrl = url + '/b';
  var newBullet = {
    id:     bullet[0].value,
    projectDetail: bullet[1].value
  };
  console.log(newBullet); 
  if(newBullet.id && newBullet.projectDetail){
    // AJAX call to add responsibility  
    $.ajax({
      method: 'PUT',
      url:  updateUrl, 
      data: { newBullet: newBullet }
    })
    .then(function(addedBullet){
      // REFACTOR THIS SO IT DOESNT REBUILD THE ENTIRE LIST EVERY TIME
      //append responsibility to ul
      // $("#"+addedResponsibility._id).append(addedResponsibility.responsibilities[addedResponsibility.responsibilities.length-1] + ' (REFRESH PAGE)'); 
      rebuildProjectList(url); 
      
      // reset the form
      resetForm($('#project-bullet')); 
    })
    .catch(function(err){
      throwErr(err);
    });    
  }
}

function removeProject(project, url){
  var deleteUrl = url + '/p/' + project.data('projectid');
  
  // AJAX Call to remove array element from db
  $.ajax({
    method: 'DELETE',
    url:  deleteUrl
  })
  .then(function(data){
    // REFACTOR THIS SO IT DOESNT REBUILD THE ENTIRE LIST EVERY TIME
    //remove the element from the list 
    // project.remove();
    
    // remove the item from the dropdown
    // $('#project-dd').remove('data-projectid=' + project.data('projectid') + '')
    
    rebuildProjectList(url); 
  })
  .catch(function(err){
    throwErr(err);
  });
}

function removeProjectBullet(bullet, url){
  var deleteUrl = url + '/p/' + bullet.data('projectid') + '/b/' + bullet.data('bulletidx');
  console.log(deleteUrl); 
  // AJAX Call to remove array element from db
  $.ajax({
    method: 'DELETE',
    url:  deleteUrl
  })
  .then(function(data){
    // REFACTOR THIS SO IT DOESNT REBUILD THE ENTIRE LIST EVERY TIME
    //remove the element from the list 
    // responsibility.remove();
    rebuildProjectList(url); 
  })
  .catch(function(err){
    throwErr(err);
  });
}

function moveProjectBullet(bullet, url, direction){
  var updateUrl = url + '/p/' + bullet.data('projectid') + '/b/' + bullet.data('bulletidx') + '/' + direction;

  $.ajax({
    method: 'PUT',
    url:  updateUrl
  })
  .then(function(){
    rebuildProjectList(url); 
  })
  .catch(function(err){
    throwErr(err);
  });
}

function rebuildProjectList(url){
  //empty list, and rebuild it 
  $('.projects').empty();
  
  $.getJSON(url)
  .then(displayProjects)
  .catch(function(err){
      throwErr(err);
  });
}