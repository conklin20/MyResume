// shared js file housing commonly shared functions
'use strict';

const globalVars = $('#global')
const userId = globalVars.data('userid');

$(document).ready(function(){
  const url = '/api/u/' + userId; 
  
  getResumes(url);
  getCoverLetters(url);
  
});

function loadUserResumes(resumes){
    // console.log(resumes.data);
    
    let resumesHTML = ''; 
    
    resumes.data.forEach(function(resume){
        resumesHTML += '<option value='+resume._id+' >' + 
                            resume.alias + 
                       '</option>'
    });

    $('.resumes').append(resumesHTML);
}

function loadUserCoverLetters(coverLetters){
    // console.log(coverLetters.data);
    
    let clHTML = '<option value="" >None</option>'; 
    
    coverLetters.data.forEach(function(coverLetter){
        clHTML += '<option value='+coverLetter._id+' >' + 
                        coverLetter.title + 
                   '</option>'
    });

    $('.cover-letters').append(clHTML);
}

function getResumes(url){
  let getUrl = url + '/r';
  
  //remove the interests list
  $('.resumes').empty();
  //rebuild the interests list
  $.getJSON(getUrl)
  .then(loadUserResumes)
  .catch(function(err){
      throwErr(err);
  });
}

function getCoverLetters(url){
  let getUrl = url + '/cl';
  
  //remove the interests list
  $('.cover-letters').empty();
  //rebuild the interests list
  $.getJSON(getUrl)
  .then(loadUserCoverLetters)
  .catch(function(err){
      throwErr(err);
  });
}