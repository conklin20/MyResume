// shared js file housing commonly shared functions
'use strict';

$(document).ready(function(){
  const url = '/api/u/' + userId;
    
  //load section data
  $('#nav-resumes').on('click', function(){
    rebuildResumeList(url);
  });
  
  $('.resumes').on('click', '#btn-delete-resume', function(){
    if(confirm('Are you sure you want to delete this resume? This action cannot be undone.')){
      removeResume($(this), url);
    }
  });
});

function displayResumes(resumes){
  // console.log(resumes.data);
  
  resumes.data.forEach(function(resume, resumeIdx){
    var resumesHTML = '<li>' + 
                        '<a href="/u/'+userId+'/r/'+resume._id+'/edit" title="Edit Resume">'+resume.alias+' | </a>' +
                        '<a href="/u/'+userId+'/r/'+resume._id+'/print" target="_blank" title="View Printable Version"><i class="fas fa-print"></i> | </a>' +
                        '<a href="/u/'+userId+'/r/'+resume._id+'/clone" title="Clone This Resume"><i class="fas fa-clone"></i> | </a>' +
                        '<a href="#" id="btn-delete-resume" title="Delete Resume" data-id='+resume._id+'><i class="fas fa-trash"></i></a>' +
                     '</li>';

    $('.resumes').append(resumesHTML);
  });
}

function removeResume(resume, url){
  var deleteUrl = url + '/r/' + resume.data('id');
  console.log(deleteUrl); 
  // AJAX Call to remove array element from db
  $.ajax({
    method: 'DELETE',
    url:  deleteUrl
  })
  .then(function(data){
    // REFACTOR THIS SO IT DOESNT REBUILD THE ENTIRE LIST EVERY TIME
    rebuildResumeList(url); 
  })
  .catch(function(err){
    throwErr(err);
  });
}

function rebuildResumeList(url){
  let getUrl = url + '/r';
  
  //remove the interests list
  $('.resumes').empty();
  //rebuild the interests list
  $.getJSON(getUrl)
  .then(displayResumes)
  .catch(function(err){
      throwErr(err);
  });
}