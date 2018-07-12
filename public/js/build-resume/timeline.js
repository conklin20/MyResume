'use strict';

$(document).ready(function(){
  // userId & resumeId are global vars defined in /js/build-resume/index.js
  const url = '/api/u/' + userId + '/r/' + resumeId + '/timeline'; 

  //load section data
  $('#nav-timeline').on('click', function(){
    rebuildTimelineEvents(url); 
  })

  
  $('#btn-timeline-settings').on('click', function(){
    saveSettings(url, $("#timeline-settings :input"));
  })
    
  $('#btn-add-timeline-event').on('click', function($e){
    $e.preventDefault(); //prevents scroll to top of page
    addTimelineEvent(url, $(".timeline-event"));
  })
  
  $('.timeline-summary').on('click', ' .delete-timeline-event', function(){
    if(confirm('Are you sure you want to delete this timeline event?')){
      removeTimelineEvent($(this).parent(), url)
    }
  })
  
});


function displayTimelineEvents(timelineEvents){
  timelineEvents.forEach(function(event, idx){
    appendTimelineEvent(event)
  });
}

function appendTimelineEvent(event){
    var eventHTML = $('<div class="event thumbnail">' +
                    '<span>'+ moment(event.date).format('MMMM YYYY') +'</span><br>' + 
                    '<img src=' + event.icon + '><br>' + 
                    '<a class="btn btn-sm btn-danger delete-timeline-event">Delete</a></div>');
    eventHTML.data('id', event._id);
    
    $('.timeline-summary').append(eventHTML);
}


function addTimelineEvent(url, event){
  var event = {
    date:     event[0].value,
    summary:  event[1].value, 
    detail:   event[2].value,
    icon:     event[3].value
  }
  
  if(event.date && event.summary && event.detail && event.icon){
    // AJAX Call to save summary values
    $.ajax({
      method: 'POST',
      url:  url, 
      data: event
    })
    .then(function(newEvent){
      //reset form
      resetForm($(".timeline-event"));
      //add the event to the page
      appendTimelineEvent(newEvent)
    })
    .catch(function(err){
      throwErr(err);
    });
  }
}

function removeTimelineEvent(event, url){
  var deleteUrl = url + '/' + event.data('id');
  
  // AJAX Call to remove array element from db
  $.ajax({
    method: 'DELETE',
    url:  deleteUrl
  })
  .then(function(data){
    //remove the element from the list 
    event.remove();
  })
  .catch(function(err){
    throwErr(err);
  });
}


function rebuildTimelineEvents(url){
  //empty list, and rebuild it 
  $('.timeline-summary').empty();
  
  $.getJSON(url)
  .then(displayTimelineEvents)
  .catch(function(err){
      throwErr(err);
  });
}