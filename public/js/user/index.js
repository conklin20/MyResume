// shared js file housing commonly shared functions
'use strict';

const globalVars = $('#global')
const userId = globalVars.data('userid');

$(document).ready(function(){
  const url = '/api/u/' + userId; 
  
  $('#btn-delete-profile').on('click', function(){
    // if(confirm('Are you sure you want to delete your profile and all of its data? This action cannot be undone.')){
    if(confirm('This function is disabled for the time being')){
        //ajax call to actually delete the profile and redirect user to login page
    }
  });
});

function throwErr(err){
  if (err.status >= 400){
    console.log(err); 
    alert('Error occurred: ' + err.statusText);
  }
}
