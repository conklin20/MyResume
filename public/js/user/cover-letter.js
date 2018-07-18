// shared js file housing commonly shared functions
'use strict';

$(document).ready(function(){
  const url = '/api/u/' + userId;
    
  //load section data
  $('#nav-cover-letters').on('click', function(){
    rebuildCoverLetterList(url);
  });
  
  $('.cover-letters').on('click', '#btn-delete-cover-letter', function(){
    if(confirm('Are you sure you want to delete this cover letter? This action cannot be undone.')){
      removeCoverLetter($(this), url);
    }
  });
});

function displayCoverLetters(coverLetters){
  
  coverLetters.data.forEach(function(coverLetter){
    var clsHTML = '<li>' + 
                        '<a href="/u/'+userId+'/cl/'+coverLetter._id+'/edit" title="Edit Cover Letter">'+coverLetter.title+' | </a>' +
                        '<a href="#" id="btn-delete-cover-letter" title="Delete Cover Letter" data-id='+coverLetter._id+'><i class="fas fa-trash"></i></a>'
                     '</li>';

    $('.cover-letters').append(clsHTML);
  });
}

function removeCoverLetter(coverLetter, url){
  var deleteUrl = url + '/cl/' + coverLetter.data('id');

  // AJAX Call to remove array element from db
  $.ajax({
    method: 'DELETE',
    url:  deleteUrl
  })
  .then(function(data){
    // REFACTOR THIS SO IT DOESNT REBUILD THE ENTIRE LIST EVERY TIME
    rebuildCoverLetterList(url); 
  })
  .catch(function(err){
    throwErr(err);
  });
}

function rebuildCoverLetterList(url){
  let getUrl = url + '/cl';
  
  //remove the cl's from list
  $('.cover-letters').empty();
  //rebuild the cl list
  $.getJSON(getUrl)
  .then(displayCoverLetters)
  .catch(function(err){
      throwErr(err);
  });
}