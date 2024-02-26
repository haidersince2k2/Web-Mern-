$(function()
{
  $("#mybtn").click(handleadd);
  $("#mybtn").click(loaddata);
})
function handleadd(){
    var input=$("#mytodo");
    var value=input.val();
    var output=$(".mylist");
    output.append(`<li> ${value} </li>`);
}

function loaddata(){
    var output=$(".recipies");
    $.ajax({
        url:"https://usman-fake-api.herokuapp.com/api/recipes",
        method:"GET",
        success:function(response){
        output.empty();
         for(var i=0; i<response.length; i++){
            var current=response[i];
            output.append(`<h3>${current.title}</h3> <p>${current.body} </p>`)
         }
        }

    })
}