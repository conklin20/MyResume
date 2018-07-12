'use strict';

$(document).ready(function(){
  // userId & resumeId are global vars defined in /js/build-resume/index.js
  const url = '/api/u/' + userId + '/r/' + resumeId + '/skills'; 
  
  //load section data
  $('#nav-skills').on('click', function(){
    //empty list, and rebuild it 
    $('.skills').empty();
    
    $.getJSON(url)
    .then(displaySkills)
    .catch(function(err){
        throwErr(err);
    });
  })
  
  
  $('#btn-skills-settings').on('click', function(){
    saveSettings(url, $("#skills-settings :input"));
  })
  
  $('#btn-add-skill').on('click', function($e){
    $e.preventDefault(); //prevents scroll to top of page
    addSkill(url);
  });
  
  $('.skills').on('click', '#skill-cat-del', function(){
    if(confirm('Are you sure you want to delete this skill category and all skills?')){
      removeSkillCat($(this).parent(), url);
    }
  });
  
  $('.skills').on('click', '#skill-cat-dn', function(){
      moveSkillCat($(this).parent(), url, 'down');
  });
  
  $('.skills').on('click', '#skill-cat-up', function(){
      moveSkillCat($(this).parent(), url, 'up');
  });
  
  $('.skills').on('click', '#skill-del', function(){
    if(confirm('Are you sure you want to delete this skill?')){
      removeSkill($(this).parent(), url);
    }
  });
  
  $('.skills').on('click', '#skill-dn', function(){
      moveSkill($(this).parent(), url, 'down');
  });
  
  $('.skills').on('click', '#skill-up', function(){
      moveSkill($(this).parent(), url, 'up');
  });
  
  $('.dropdown-toggle').dropdown();
  $('#existing-skills li').on('click', function() {
    $('#skill-cat-dropdown').html($(this).find('a').html());
  });
});


function displaySkills(skills){
  //add skills to the page 
  const catBtns   = ` | <span id="skill-cat-del"><i class="fa fa-trash"></i> | </span> 
                        <span id="skill-cat-dn"><i class="fa fa-chevron-down"></i> | </span> 
                        <span id="skill-cat-up"><i class="fa fa-chevron-up"></i></span> `;
                        
  const skillBtns = ` | <span id="skill-del"><i class="fa fa-trash"></i> | </span> 
                        <span id="skill-dn"><i class="fa fa-chevron-down"></i> | </span>
                        <span id="skill-up"><i class="fa fa-chevron-up"></i></span> `;
  
  skills.forEach(function(skillCat, catIdx){
    var skillsListHTML = '<li data-catid=' + skillCat._id + '>' + skillCat.category + catBtns;

    skillCat.skill.forEach(function(skill, idx){
      if(idx === 0) { skillsListHTML += '<ul>' }
      
      skillsListHTML += '<li data-catid=' + skillCat._id + ' data-id=' + skill._id + '>' + skill.skillName + ' (' + skill.proficiency + ')' + skillBtns + '</li>';
      
      if(idx === skillCat.skill.length - 1) { skillsListHTML += '</ul>' }
    });
    
    skillsListHTML +=  '</li>';
    $('.skills').append(skillsListHTML);
  });
}

function addSkill(url){
  let newSkillCategory = $('#new-skill-category').val() ? true : false
  let selectedCategory = $('#skill-cat-dropdown').html($(this).find('a').html());

  var newSkill = {
    newSkillCategory:   newSkillCategory, 
    category:           newSkillCategory ? $('#new-skill-category').val() : selectedCategory[0].textContent,
    categoryIcon:       $('#new-skill-category').val() ? $('#new-skill-category-icon').val() : null,
    hideOnPrint:        $('#hideOnPrint').is(':checked'),
    skill:              $('#new-skill').val(),
    proficiency:        $('#proficiency').val()
  };
  
  if(newSkill.category && newSkill.skill){
    $.post(url, { newSkill: newSkill })
    .then(function(skill){
      rebuildSkillsList(url);
      resetForm([$('#new-skill-category'), $('#new-skill-category-icon'), $('#new-skill')]);   
      
      if(newSkillCategory){
        //if user added a new category, add it to the dropdown 
        $('#existing-skills').prepend('<li><a href="#">' + skill.category + '</a></li>');
        $('.dropdown-toggle').dropdown();
        $('#existing-skills li').on('click', function() {
          $('#skill-cat-dropdown').html($(this).find('a').html());
        });
      }
    })
    .catch(function(err){
        throwErr(err);
    });
  }
}

function removeSkillCat(skillCat, url){
  var deleteUrl = url + '/sc/' + skillCat.data('catid');

  // AJAX Call to remove array element from db
  $.ajax({
    method: 'DELETE',
    url:  deleteUrl
  })
  .then(function(data){
    //remove the element from the list 
    skillCat.remove();
    // remove the item from the dropdown
    
  })
  .catch(function(err){
    throwErr(err);
  });
}

function moveSkillCat(skillCat, url, direction){
    var updateUrl = url + '/sc/' + skillCat.data('catid') + '/' + direction;

    $.ajax({
      method: 'PUT',
      url:  updateUrl
    })
    .then(function(){
      rebuildSkillsList(url); 
    })
    .catch(function(err){
      throwErr(err);
    });
}

function removeSkill(skill, url){
  var deleteUrl = url + '/sc/' + skill.data('catid') + '/s/' + skill.data('id');
  
  $.ajax({
    method: 'DELETE',
    url:  deleteUrl
  })
  .then(function(data){
    skill.remove();
  })
  .catch(function(err){
    throwErr(err);
  });
}

function moveSkill(skill, url, direction){
    var updateUrl = url + '/sc/' + skill.data('catid') + '/s/' + skill.data('id') + '/' + direction;

    $.ajax({
      method: 'PUT',
      url:  updateUrl
    })
    .then(function(){
      rebuildSkillsList(url);
    })
    .catch(function(err){
      throwErr(err);
    });
}

function rebuildSkillsList(url){
  //remove the skills list
  $('.skills').empty();
  //rebuild the skills list
  $.getJSON(url)
  .then(displaySkills)
  .catch(function(err){
      throwErr(err);
  });
}
