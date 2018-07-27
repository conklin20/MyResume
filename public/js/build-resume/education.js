'use strict';

$(document).ready(function(){
  // userId & resumeId are global vars defined in /js/build-resume/index.js
  const url = '/api/u/' + userId + '/r/' + resumeId + '/education'; 
  
  //load section data
  $('#nav-education').on('click', function(){
    rebuildEducationList(url);
  });
  
  $('#btn-education-settings').on('click', function(){
    saveSettings(url, $("#education-settings :input"));
  });
  
  $('#btn-add-education').on('click', function($e){
    $e.preventDefault(); //prevents scroll to top of page
    addEducation($(".new-education"), url);
  })
  
  $('#btn-add-new-achievement').on('click', function($e){
    $e.preventDefault(); //prevents scroll to top of page
    addAchievement($(".new-achievement"), url);
  })
  
  $('.education').on('click', '#school-del', function(){
    if(confirm('Are you sure you want to delete this education entry?')){
      removeEducation($(this).parent(), url);
    }
  });
  
  $('.education').on('click', '#achievement-del', function(){
    if(confirm('Are you sure you want to delete this achievement?')){
      removeAchievement($(this).parent(), url);
    }
  });
  
  $('.education').on('click', '#achievement-dn', function(){
    moveAchievement($(this).parent(), url, 'down');
  });
  
  $('.education').on('click', '#achievement-up', function(){
    moveAchievement($(this).parent(), url, 'up');
  });
  
});


function displayEducation(education){
  education.forEach(function(school, educationArr){
    appendEducation(school, educationArr);
  });
}

function appendEducation(school, educationArr){
  
  
  const schoolBtns = ` | <span id="school-del"><i class="fa fa-trash"></i></span> `; 

  var schoolHTML = '<li data-schoolid=' + school._id + '>' + school.instituteName + ' (' + school.city   + ', ' + school.state + ', ' + school.degree + ', ' + school.areaOfStudy  + ')' + schoolBtns;
  
  //append the school/institute level element 
  $('.education').append(schoolHTML);
  
    
  const achievementBtns = ` | <span id="achievement-del"><i class="fas fa-trash"></i> | </span> 
                              <span id="achievement-dn"><i  class="fas fa-chevron-down"></i> | </span>
                              <span id="achievement-up"><i  class="fas fa-chevron-up"></i></span> `; 
           
  var achievementHTML = ''
  
  school.achievements.forEach(function(achievement, idx, arr){
    achievementHTML += (idx === 0 ? '<ul id="' + school._id + '">' : '') +  '<li data-schoolid=' + school._id + ' data-achievementidx=' + idx + '>' + achievement  + achievementBtns + '</li>' + (idx === arr.length-1 ? '</ul>' : '');
  });
  
  $('.education').append(achievementHTML);
}

function addEducation(school, url){
  var newSchool = {
    instituteName:  school[0].value,
    city:           school[1].value,
    state:          school[2].value,
    startDate:      school[3].value,
    endDate:        school[4].value,
    degree:         school[5].value,
    areaOfStudy:    school[6].value, 
    graduated:      school[7].checked ? true : false,
    notes:          school[8].value,
    url:            school[9].value,
    logo:           school[10].value,
    hideOnPrint:    school[11].checked ? true : false,
  };
  
  // console.log(newSchool);
  
  if(newSchool.instituteName && newSchool.startDate && newSchool.areaOfStudy && newSchool.url && newSchool.logo){
    $.post(url, { newSchool: newSchool })
    .then(function(addedSchool){
      // reset the form
      resetForm(school);
      // REFACTOR THIS SO IT DOESNT REBUILD THE ENTIRE LIST EVERY TIME
      // append new school to list 
      rebuildEducationList(url); 
      
      // append to company to dropdown
      $('#school-dd').append('<option>' + addedSchool.instituteName + '</option>')
    })
    .catch(function(err){
        throwErr(err);
    });
  }
}

function addAchievement(achievement, url){
  var updateUrl = url + '/a'
  var newAchievement = {
    school:      achievement[0].value,
    achievement: achievement[1].value
  };
  
  console.log(updateUrl);
  
  if(newAchievement.school && newAchievement.achievement){
    // AJAX call to add responsibility  
    $.ajax({
      method: 'PUT',
      url:  updateUrl, 
      data: { newAchievement: newAchievement }
    })
    .then(function(addedAchievement){
      // REFACTOR THIS SO IT DOESNT REBUILD THE ENTIRE LIST EVERY TIME
      //append responsibility to ul
      rebuildEducationList(url); 
      
      // reset the form
      resetForm($('#achievement')); 
    })
    .catch(function(err){
      throwErr(err);
    });    
  }
}

function removeEducation(school, url){
  var deleteUrl = url + '/s/' + school.data('schoolid');

  // AJAX Call to remove array element from db
  $.ajax({
    method: 'DELETE',
    url:  deleteUrl
  })
  .then(function(data){
    // REFACTOR THIS SO IT DOESNT REBUILD THE ENTIRE LIST EVERY TIME
    //remove the element from the list 
    school.remove();
    rebuildEducationList(url); 
    
    // remove the item from the dropdown
    $('#school-dd').remove()
  })
  .catch(function(err){
    throwErr(err);
  });
}

function removeAchievement(achievement, url){
  var deleteUrl = url + '/s/' + achievement.data('schoolid') + '/a/' + achievement.data('achievementidx');
  console.log(deleteUrl);
  
  // AJAX Call to remove array element from db
  $.ajax({
    method: 'DELETE',
    url:  deleteUrl
  })
  .then(function(data){
    // REFACTOR THIS SO IT DOESNT REBUILD THE ENTIRE LIST EVERY TIME
    //remove the element from the list 
    rebuildEducationList(url); 
  })
  .catch(function(err){
    throwErr(err);
  });
  
}

function moveAchievement(achievement, url, direction){
  var updateUrl = url + '/s/' + achievement.data('schoolid') + '/a/' + achievement.data('achievementidx') + '/' + direction;
  console.log(updateUrl); 
  
  // AJAX Call to remove array element
  $.ajax({
    method: 'PUT',
    url:  updateUrl
  })
  .then(function(){
    rebuildEducationList(url); 
  })
  .catch(function(err){
    throwErr(err);
  });
}

function rebuildEducationList(url){
  //remove the skills list
  $('.education').empty();
  //rebuild the skills list
  $.getJSON(url)
  .then(displayEducation)
  .catch(function(err){
      throwErr(err);
  });
}
