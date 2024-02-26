$(function(){
    $("#loaddata").click(sendrequest);
})

function sendrequest(){
    console.log("request sending ");
    $.get("student.txt",handleresponse);
}
function handleresponse(response){
    console.log("reesponse received");
    $(".result").empty();
    $(".result").append(response);
   

}