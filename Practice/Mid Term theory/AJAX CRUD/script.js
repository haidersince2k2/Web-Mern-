$(function (){
    sendrequest();
    $(".recipe").on("click", ".btn-danger", handledelete);
    $("#adddata").click(adddata);
})
function sendrequest(){
    $.ajax({
    url:"https://usman-fake-api.herokuapp.com/api/recipes",
    method:"GET",
    success: function(response){
        var recipes=$(".recipe");
        // recipes.empty();

        for( var i=0; i<response.length; i++){
            var current=response[i];
        recipes.append(`<div class=recipie1 data-id=${current._id}> 
        <table>
        <tbody>
                <tr >
                    <td scope="row"></td>
                    <td>${current.title}</td>
                    <td class="rows">${current.body}</td>
                </tr>
        <table>
         <button type="button" class="btn btn-warning float-right btn-sm"> Edit </button>
        <button type="button" class="btn btn-danger float-right btn-sm"> Delete </button>  </div>`)
        }
    }
    });
}
function handledelete(){
    var btn=$(this);
    var parentdiv=btn.closest(".recipie1");
    let id=parentdiv.attr("data-id");
    $.ajax({
        url:"https://usman-fake-api.herokuapp.com/api/recipes/"+ id,
        method:"DELETE",
        success: function(){
            sendrequest();
        }
    })
}
function adddata(){
    var title=$("#title").val();
    var data=$("#recipe").val();
   
    $.ajax({
        url:"https://usman-fake-api.herokuapp.com/api/recipes",
        method:"POST",
        data:{title:title,body:data},
        success:function(){
            sendrequest();
        }
    })

}