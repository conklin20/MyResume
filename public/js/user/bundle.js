// shared js file housing commonly shared functions
'use strict';

$(document).ready(function(){
  const url = '/api/u/'+userId+'/b'

  //load section data
  $('#nav-bundles').on('click', function(){
    rebuildBundleList(url);
  });
  
  $('.bundles').on('click', '#btn-delete-bundle', function(){
    if(confirm('Are you sure you want to delete this bundle? This action cannot be undone.')){
      removeBundle($(this), url);
    }
  });
});

function displayBundles(bundles) {
  console.log(bundles.data); 
}

function rebuildBundleList(url){
  //remove the cl's from list
  $('.bundles').empty();
  
  //rebuild the cl list
  $.getJSON(url)
  .then(displayBundles)
  .catch(function(err){
      throwErr(err);
  });
}