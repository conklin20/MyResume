'use strict';

$(document).ready(function(){
  //if cover letter is being shown, add an event listener to close it
  if($('#close-cover-letter').length){
    var closeCoverLetterBtn = document.getElementById('close-cover-letter'); 
    closeCoverLetterBtn.addEventListener('click', function(){
        // var coverLetter = document.getElementById("cover-letter");
        // coverLetter.classList.add('cover-letter-fade-out');
        $('#cover-letter').fadeOut(1500, function() {
          // Animation complete. Remove element from page
          $('#cover-letter').empty();
        });
    });
  }
  
  $('.ui.sticky')
  .sticky({
    context: '#context'
  });
});
