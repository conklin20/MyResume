// shared js file housing commonly shared functions
'use strict';

const globalVars = $('#global')
const userId = globalVars.data('userid');
const resumeId = globalVars.data('resumeid');

$(document).ready(function(){
  const url = '/api/u/' + userId + '/r/' + resumeId; 
  
  $('#btn-update-summary').on('click', function(){
    saveSummary(url + '/summary', $('.summary'));
  })
  
  // import momentjs
  $.getScript('https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js', function() {
  });
  
  //load section data
  $('#nav-order').on('click', function(){
    displaySectionOrder(url);
  })
  
  $('.order').on('click', '#order-btn-dn', function(){
    moveResumeSection($(this).parent(), url, 'down');
  })
  
  $('.order').on('click', '#order-btn-up', function(){
    moveResumeSection($(this).parent(), url, 'up');
  })
  
  $('#btn-reset-order').on('click', function(){
    resetOrder(url);
  })
  
});

function saveSummary(url, summary){
  // getting the entire html object once (being passed to fn), then grabbing 
  // values from the object (as opposed to how I am doing it in saveSetting()) 
  var summary = {
    alias: summary[0].value,
    introduction: summary[1].value,
    elevatorPitch: summary[2].value,
    objective: summary[3].value,
    careerSummary: summary[4].value,
    backgroundImg: summary[5].value,
    fontColor: summary[6].value
  };
  
  // AJAX Call to save summary values
  $.ajax({
    method: 'PUT',
    url:  url, 
    data: summary
  })
  .then(function(){
    alert('Summary saved successfully!')
  })
  .catch(function(err){
    throwErr(err);
  });
}

function saveSettings(url, settings){
  var settings = {
    title:            $(settings[0]).val(),
    backgroundImg:    $(settings[1]).val(),
    headerFontColor:  $(settings[2]).val(),
    fontColor:        $(settings[3]).val(),
    hideOnPrint:      $(settings[4]).is(":checked") ? true : false
  }
  // console.log(url)
  // AJAX Call to save section settings
  $.ajax({
    method: 'PUT',
    url:  url, 
    data: settings
  })
  .then(function(){
    alert('Settings saved successfully!')
  })
  .catch(function(err){
    throwErr(err);
  });
}

function throwErr(err){
  if (err.status >= 400){
    console.log(err); 
    alert('Error occurred: ' + err.statusText);
  }
}

function resetForm(fields){
  //passing in an array of fields, resetting the value
  for(var i = 0; i < fields.length; i++){
    $(fields[i]).val('');
  }
}

function displaySectionOrder(url){
  var getUrl = url + '/order';
  // AJAX Call to get order of sections
  $.getJSON(getUrl)
  .then(function(order){
    //empty the list
    $('.order').empty();
    //fill the list
    for(var i=0; i < order.length; i++){
      $('.order').append($('<li class="list-group-item order-section" style="order: ' + order[i].order + ' ">' +
                             '<span id="order-title">' + order[i].title + '</span>' + 
                             '<span id="order-btns" data-systitle=' + order[i].sysTitle + ' data-order=' + order[i].order + ' >' +
                               '<i id="order-btn-dn" class="fas fa-2x fa-arrow-alt-circle-down"></i>' +
                               '<i id="order-btn-up" class="fas fa-2x fa-arrow-alt-circle-up"></i>' + 
                             '</span>' + 
                           '</li>'));
    }
  })
  .catch(function(err){
      throwErr(err);
  });
}

function resetOrder(url){
  var updateUrl = url + '/order/reset';
  
    // AJAX Call to reset order to default
  $.ajax({
    method: 'PUT',
    url:  updateUrl
  })
  .then(function(){
    displaySectionOrder(url); 
  })
  .catch(function(err){
    throwErr(err);
  });
}

function moveResumeSection(section, url, direction){
  var updateUrl = url + '/order/' + direction;
  var data = {
    section: $(section).data('systitle'),
    order:   $(section).data('order')
  }
  
  // ajax call to move sections
  $.ajax({
    method: 'PUT',
    url:  updateUrl, 
    data: data
  })
  .then(function(data){
    if(data){
      displaySectionOrder(url);
    }
  })
  .catch(function(err){
    throwErr(err);
  });
}