$(document).ready(function () {
    $("#myform").validate({
      rules: {
        name: "required",
        lname: "required",
        username:{
          required:true,
          minlength:5,
        },
        email: {
          required: true,
          email: true // Validates that the input is an email address
        },
        password: {
          required: true,
          minlength: 8,
        },
        Cpassword:{
          required: true,
          minlength:8,
          equalTo: "#password",
        }
      },
      messages: {
        name: "Please enter your first name.",
        lname: "Please enter your last name.",
        username: {
          required: "Please enter a username.",
          minlength: "Enter a username with at least 5 characters."
        },
        email: {
          required: "Please enter your email address.",
          email: " Enter a valid email address."
        },
        password: {
          required: "Please enter your password.",
          minlength: "Enter a password with at least 8 characters."
        },
        Cpassword:{
          required: "Confirm your password.",
          minlength: "Password is not matching.",
          equalTo:"Password is not matching.",
        },
      }
    });
  });
  const togglePassword = document.querySelector('#togglePassword');
  const password = document.querySelector('#password');

  togglePassword.addEventListener('click', function (e) {
    // toggle the type attribute
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    // toggle the eye slash icon
    this.classList.toggle('fa-eye-slash');
});

$(document).ready(function() {
  $("#myform").submit(function(event) {
         event.preventDefault();     
  });
});
