$(document).ready(function () {
    $(".orderformonly").submit(function (event) {
        if ($(this).valid()) {
            // The form is valid, submit it
            alert("Form is valid. Submitting...");
            // Uncomment the line below to actually submit the form
            // $(this).submit();
        } else {
            // The form is not valid, prevent submission
            alert("Form is not valid. Please check your inputs.");
            event.preventDefault();
        }
    });

    $("#orderformonly").validate({
        rules: {
            username: {
                required: true,
                minlength: 3,
            },
            email: {
                required: true,
                email: true,
            },
            address: {
                required: true,
                minlength: 6,
            },
            contact: {
                required: true,
                minlength: 11,
                maxlength: 11,
                digits: true,
            },
        },
        messages: {
            username: {
                required: "Please enter a username.",
                minlength: "Enter a username with at least 3 characters.",
            },
            email: {
                required: "Please enter your email address.",
                email: "Enter a valid email address.",
            },
            address: {
                required: "Please enter your address.",
                minlength: "Enter an address with at least 6 characters.",
            },
            contact: {
                required: "Please enter your contact number.",
                minlength: "Enter a contact number with at least 11 digits.",
                maxlength: "Enter a contact number with at most 11 digits.",
                digits: "Enter only digits for the contact number.",
            },
        },
    });
});
