const form = document.querySelector('form') ;


form.addEventListener('submit', function(event){
    event.preventDefault() ;

    const name = document.getElementById('name').ValueMax.trim() ;
    const email = document.getElementById('email').ValueMax.trim() ;
    const message = document.getElementById('message').ValueMax.trim() ;

    if(name === '' || email === '' || message === ''){
        alert('Please fill in all fields!!')
    } else {

        alert('Form submitted successfully!!') ;
        form.reset() ;
    }

})