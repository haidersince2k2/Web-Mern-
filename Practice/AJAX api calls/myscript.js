function fetchdata() {
    console.log("fetching start");
    $.ajax({
        url: "https://usman-fake-api.herokuapp.com/api/products",
        success: responsearrived // Remove parentheses here
    });
    console.log("Request sent");
}

function responsearrived(response) {
    console.log("Response received");
    console.log(response);
    $("#fetch").empty();
    $("#results").empty();
    for (let index = 0; index < response.length; index++) {
        rec=response[index];
        $("#results").append(`<div> <h1>${rec.name} </h1> 
        <p> ${rec.description}</p>
        <button id="delbtn" del-id=${rec._id}>Delete</button>
        </div>`)
    }

}

$(function() {
    $("#fetch").on("click", fetchdata);
    $("#results").on("click", "#delbtn", function () {
    let id= $(this).attr("del-id");
    console.log(id);
    delrec(id)
        
    })
});
function delrec(id) {
    $.ajax({
        url:"https://usman-fake-api.herokuapp.com/api/products/"+ id ,
        method:"delete",
        success: fetchdata

    })
    
}