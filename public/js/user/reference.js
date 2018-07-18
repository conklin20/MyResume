// shared js file housing commonly shared functions
'use strict';

$(document).ready(function(){
  const url = '/api/u/' + userId;
    
  //load section data
  $('#nav-references').on('click', function(){
    rebuildReferenceList(url);
  });
  
  $('.references').on('click', '#btn-delete-reference', function(){
    if(confirm('Are you sure you want to delete this reference? This action cannot be undone.')){
      removeReference($(this), url);
    }
  });
});

function displayReferences(references){
  // console.log(references.data);
  
  references.data.forEach(function(reference){
    var refHTML = '<li>' + 
                        '<a href="/u/'+userId+'/ref/'+reference._id+'/edit" title="Edit Reference">'+reference.name+' | </a>' +
                        '<a href="#" id="btn-delete-reference" title="Delete Reference" data-id='+reference._id+'><i class="fas fa-trash"></i></a>'
                     '</li>';

    $('.references').append(refHTML);
  });
}

function removeReference(reference, url){
  var deleteUrl = url + '/ref/' + reference.data('id');
 
  // AJAX Call to remove array element from db
  $.ajax({
    method: 'DELETE',
    url:  deleteUrl
  })
  .then(function(data){
    // REFACTOR THIS SO IT DOESNT REBUILD THE ENTIRE LIST EVERY TIME
    rebuildReferenceList(url); 
  })
  .catch(function(err){
    throwErr(err);
  });
}

function rebuildReferenceList(url){
  let getUrl = url + '/ref';
  
  //remove the ref's from list
  $('.references').empty();
  //rebuild the ref list
  $.getJSON(getUrl)
  .then(displayReferences)
  .catch(function(err){
      throwErr(err);
  });
}