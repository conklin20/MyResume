'use strict';

$(document).ready(function(){
  // userId & resumeId are global vars defined in /js/build-resume/index.js
  const url = '/api/u/' + userId + '/r/' + resumeId + '/other'; 
  
  //load section data
  $('#nav-other').on('click', function(){
    rebuildSectionList(url);
  });
  
  $('#btn-other-settings').on('click', function(){
    saveSettings(url, $("#other-settings :input"));
  });
  
  $('#btn-add-new-other-section').on('click', function($e){
    $e.preventDefault(); //prevents scroll to top of page
    addSection($(".new-other-section"), url);
  });
  
  $('#btn-add-new-other-section-bullet').on('click', function($e){
    $e.preventDefault(); //prevents scroll to top of page
    addSectionBullet($(".new-section-bullet"), url);
  });
  
  $('.other').on('click', '#section-del', function(){
    if(confirm('Are you sure you want to delete this section?')){
      removeSection($(this).parent(), url);
    }
  });
  
  $('.other').on('click', '#section-dn', function(){
    moveSection($(this).parent(), url, 'down');
  });
  
  $('.other').on('click', '#section-up', function(){
    moveSection($(this).parent(), url, 'up');
  });
  
  $('.other').on('click', '#section-bullet-del', function(){
    if(confirm('Are you sure you want to delete this bullet item?')){
      removeSectionBullet($(this).parent(), url);
    }
  });
  
  $('.other').on('click', '#section-bullet-dn', function(){
    moveSectionBullet($(this).parent(), url, 'down');
  });
  
  $('.other').on('click', '#section-bullet-up', function(){
    moveSectionBullet($(this).parent(), url, 'up');
  });
});


function displaySections(sections){
  sections.forEach(function(section, idx, sectionArr){
    appendSection(section, sectionArr);
  });
}

function appendSection(section, sectionArr){
  const sectiontBtns = ` | <span id="section-del"><i class="fa fa-trash"></i></span> 
                          <span id="section-dn"><i class="fa fa-chevron-down"></i> | </span>
                          <span id="section-up"><i class="fa fa-chevron-up"></i></span> `;  

  var sectionHTML = '<li data-sectionid=' + section._id + '>' + section.title + sectiontBtns;
  
  //append the project level element 
  $('.other').append(sectionHTML);
  
    
  const bulletBtns = ` | <span id="section-bullet-del"><i class="fa fa-trash"></i> | </span> 
                            <span id="section-bullet-dn"><i class="fa fa-chevron-down"></i> | </span>
                            <span id="section-bullet-up"><i class="fa fa-chevron-up"></i></span> `; 
           
  var bulletHTML = ''
  
  section.bulletItems.forEach(function(bullet, idx, arr){
    bulletHTML += (idx === 0 ? '<ul id="' + section._id + '">' : '') +  '<li data-sectionid=' + section._id + ' data-bulletidx=' + idx + '>' + bullet  + bulletBtns + '</li>' + (idx === arr.length-1 ? '</ul>' : '');
  });
  
  $('.other').append(bulletHTML);
}

function addSection(section, url){
  var newSection = {
    title:          section[0].value,
    summary:        section[1].value,
    hideOnPrint:    section[2].checked ? true : false
  };
  
  console.log(section); 
  
  if(newSection.title && newSection.summary){
    $.post(url, { newSection: newSection })
    .then(function(addedSection){
      // reset the form
      resetForm(section);
      // REFACTOR THIS SO IT DOESNT REBUILD THE ENTIRE LIST EVERY TIME
      // append new company to list 
      // appendExperience(addedCompany, addedCompany);
      rebuildSectionList(url); 
      console.log(addedSection)
      // append to company to dropdown
      $('#section-dd').append('<option value=' + addedSection._id + '>' + addedSection.title + '</option>')
    })
    .catch(function(err){
        throwErr(err);
    });
  }
}

function addSectionBullet(bullet, url){
  var updateUrl = url + '/b';
  var newBullet = {
    id:         bullet[0].value,
    bulletItem: bullet[1].value
  };
  console.log(newBullet); 
  
  if(newBullet.id && newBullet.bulletItem){
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
      rebuildSectionList(url); 
      
      // reset the form
      resetForm($('#other-bullet')); 
    })
    .catch(function(err){
      throwErr(err);
    });    
  }
}

function removeSection(section, url){
  var deleteUrl = url + '/s/' + section.data('sectionid');
  
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
    
    rebuildSectionList(url); 
  })
  .catch(function(err){
    throwErr(err);
  });
}

function removeSectionBullet(bullet, url){
  var deleteUrl = url + '/s/' + bullet.data('sectionid') + '/b/' + bullet.data('bulletidx');
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
    rebuildSectionList(url); 
  })
  .catch(function(err){
    throwErr(err);
  });
}

function moveSection(section, url, direction){
    var updateUrl = url + '/s/' + section.data('sectionid') + '/' + direction;

    $.ajax({
      method: 'PUT',
      url:  updateUrl
    })
    .then(function(){
      rebuildSectionList(url); 
    })
    .catch(function(err){
      throwErr(err);
    });
}

function moveSectionBullet(bullet, url, direction){
    var updateUrl = url + '/s/' + bullet.data('sectionid') + '/b/' + bullet.data('bulletidx') + '/' + direction;

    $.ajax({
      method: 'PUT',
      url:  updateUrl
    })
    .then(function(){
      rebuildSectionList(url);
    })
    .catch(function(err){
      throwErr(err);
    });
}

function rebuildSectionList(url){
  //empty list, and rebuild it 
  $('.other').empty();
  
  $.getJSON(url)
  .then(displaySections)
  .catch(function(err){
      throwErr(err);
  });
}