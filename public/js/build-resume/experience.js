'use strict';

$(document).ready(function(){
  // userId & resumeId are global vars defined in /js/build-resume/index.js
  const url = '/api/u/' + userId + '/r/' + resumeId + '/experience'; 
  
  //load section data
  $('#nav-work').on('click', function(){
    rebuildExperienceList(url)
  });
  
  $('#btn-experience-settings').on('click', function(){
    saveSettings(url, $("#experience-settings :input"));
  })
  
  $('#btn-add-experience').on('click', function($e){
    $e.preventDefault(); //prevents scroll to top of page
    addExperience($(".new-experience"), url);
  })
  
  $('#btn-add-new-responsibility').on('click', function($e){
    $e.preventDefault(); //prevents scroll to top of page
    addResponsibility($(".new-responsibility"), url);
  })
  
  $('.experience').on('click', '#company-del', function(){
    if(confirm('Are you sure you want to delete this work experience entry?')){
      removeExperience($(this).parent(), url);
    }
  });
  
  $('.experience').on('click', '#responsibility-del', function(){
    if(confirm('Are you sure you want to delete this responsibility?')){
      removeResponsibility($(this).parent(), url);
    }
  });
  
  $('.experience').on('click', '#responsibility-dn', function(){
    moveResponsibility($(this).parent(), url, 'down');
  });
  
  $('.experience').on('click', '#responsibility-up', function(){
    moveResponsibility($(this).parent(), url, 'up');
  });
});

function displayExperience(experience){
  experience.forEach(function(company, experienceArr){
    appendExperience(company, experienceArr)
  });
}

function appendExperience(company, experienceArr){
  const companyBtns = ` | <span id="company-del"><i class="fa fa-trash"></i></span> `; 

  var companyHTML = '<li data-companyid=' + company._id + '>' + company.companyName + ' (' + company.title + ', ' + company.city + ', ' + company.state + ')' + companyBtns;
  
  //append the company level element 
  $('.experience').append(companyHTML);
  
    
  const responsibilityBtns = ` | <span id="responsibility-del"><i class="fa fa-trash"></i> | </span> 
                            <span id="responsibility-dn"><i class="fa fa-chevron-down"></i> | </span>
                            <span id="responsibility-up"><i class="fa fa-chevron-up"></i></span> `; 
           
  var responsibilityHTML = ''
  
  company.responsibilities.forEach(function(responsibility, idx, arr){
    responsibilityHTML += (idx === 0 ? '<ul id="' + company._id + '">' : '') +  '<li data-companyid=' + company._id + ' data-responsibilityidx=' + idx + '>' + responsibility  + responsibilityBtns + '</li>' + (idx === arr.length-1 ? '</ul>' : '');
  });
  
  $('.experience').append(responsibilityHTML);
}

// add new work experience (company)
function addExperience(company, url){
  var newCompany = {
    companyName:    company[0].value,
    title:          company[1].value,
    city:           company[2].value,
    state:          company[3].value,
    startDate:      company[4].value,
    endDate:        company[5].value,
    url:            company[6].value, 
    logo:           company[7].value,
    hideOnPrint:    company[8].checked ? true : false
  }
  
  if(newCompany.companyName && newCompany.title && newCompany.city && newCompany.state && newCompany.startDate){
    $.post(url, { newCompany: newCompany })
    .then(function(addedCompany){
      // reset the form
      resetForm(company);
      // REFACTOR THIS SO IT DOESNT REBUILD THE ENTIRE LIST EVERY TIME
      // append new company to list 
      // appendExperience(addedCompany, addedCompany);
      rebuildExperienceList(url); 
      
      // append to company to dropdown
      $('#company-dd').append('<option>' + addedCompany.companyName + '</option>')
    })
    .catch(function(err){
        throwErr(err);
    });
  }
}

// add new responsibility
function addResponsibility(responsibility, url){
  var updateUrl = url + '/r'
  var newResponsibility = {
    company: responsibility[0].value,
    responsibility: responsibility[1].value
  };
  
  console.log(newResponsibility)
  
  if(newResponsibility.company && newResponsibility.responsibility){
    // AJAX call to add responsibility  
    $.ajax({
      method: 'PUT',
      url:  updateUrl, 
      data: { newResponsibility: newResponsibility }
    })
    .then(function(addedResponsibility){
      // REFACTOR THIS SO IT DOESNT REBUILD THE ENTIRE LIST EVERY TIME
      //append responsibility to ul
      // $("#"+addedResponsibility._id).append(addedResponsibility.responsibilities[addedResponsibility.responsibilities.length-1] + ' (REFRESH PAGE)'); 
      rebuildExperienceList(url); 
      
      // reset the form
      resetForm($('#responsibility')); 
    })
    .catch(function(err){
      throwErr(err);
    });    
  }
}

function removeExperience(company, url){
  var deleteUrl = url + '/c/' + company.data('companyid');

  // AJAX Call to remove array element from db
  $.ajax({
    method: 'DELETE',
    url:  deleteUrl
  })
  .then(function(data){
    // REFACTOR THIS SO IT DOESNT REBUILD THE ENTIRE LIST EVERY TIME
    //remove the element from the list 
    // company.remove();
    
    // remove the item from the dropdown
    // $('#company-dd').remove(company)
    
    rebuildExperienceList(url); 
    
  })
  .catch(function(err){
    throwErr(err);
  });
}

function removeResponsibility(responsibility, url){
  var deleteUrl = url + '/c/' + responsibility.data('companyid') + '/r/' + responsibility.data('responsibilityidx');
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
    rebuildExperienceList(url); 
  })
  .catch(function(err){
    throwErr(err);
  });
  
}

function moveResponsibility(responsibility, url, direction){
  var updateUrl = url + '/c/' + responsibility.data('companyid') + '/r/' + responsibility.data('responsibilityidx') + '/' + direction;
  console.log(updateUrl); 
  $.ajax({
    method: 'PUT',
    url:  updateUrl
  })
  .then(function(){
    rebuildExperienceList(url); 
  })
  .catch(function(err){
    throwErr(err);
  });
}

function rebuildExperienceList(url){
  //remove the skills list
  $('.experience').empty();
  //rebuild the skills list
  $.getJSON(url)
  .then(displayExperience)
  .catch(function(err){
      throwErr(err);
  });
}
