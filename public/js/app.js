

var closeCoverLetterBtn = document.getElementById('closeCoverLetter'); 

closeCoverLetterBtn.addEventListener('click', function(){
    var coverLetter = document.getElementById("cover-letter");
    coverLetter.classList.add('cover-letter-fade-out');
    
    // coverLetter.style.display = "none"; 
});