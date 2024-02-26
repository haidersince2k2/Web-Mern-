window.onload=function(){
    var btn=document.getElementById("mybtn");
    btn.onclick=function(){
        console.log("button clicked ")
        var newtodo=document.getElementById("nameid").value;
        var addtodos=document.getElementById("todos");
        var nodetext=document.createTextNode(newtodo);
        var newli=document.createElement('li');
        
        newli.innerHTML='<button class="mybtn" onclick="handledelete(event)">Delete</button>'
        newli.appendChild(nodetext);
        addtodos.appendChild(newli);
    };
}
function handledelete(e){
    var tag=e.target;
    var list=tag.parentNode;
    list.parentNode.removeChild(list);
}