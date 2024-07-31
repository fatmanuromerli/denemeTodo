//element seçimi (burada çok sıkıntı yaşıyorum)

// HENÜZ ÜSTÜ ÇİZME İŞLEMİ STORAGEYE EKLENMEDİ FATODOLİST-V.1.1

const form = document.getElementById("form");
// console.log(form);

const ul = document.querySelector("#ul1");
// console.log(ul);

const inputAra = document.getElementById("todoara");
// console.log(inputGir);

const inputGir = document.getElementById("todogir");
// console.log(inputGir);

const ekleButon = document.querySelector("#todoAddButton");
// console.log(ekleButon);

const silButon = document.getElementById("clearButton");
// console.log(silButon);

const div4 = document.getElementById("div4");
// console.log(silButon);

const div5 = document.getElementById("div5");
// console.log(div5);

// const div6 = document.getElementById("div6");
// console.log(div6);

let todolar = [];

eventlar();

function eventlar() {
    form.addEventListener("submit", todoEkle);
    document.addEventListener("DOMContentLoaded", storagedenUIaKalici);
    div5.addEventListener("click",arayuzdenTodoSil);
    silButon.addEventListener("click",tumTodolariSil);
    inputAra.addEventListener("keyup",filter);
    div5.addEventListener("click",tikArayuz);

}


function todoEkle(e) {
    const girilentodo = inputGir.value.trim();

    if (girilentodo == null || girilentodo == "") {
        uyariMesaji("boş todo eklenemez !!!!!!!!!!!!!!!!!!!!!","danger");
    }else {
        console.log("tetik2");
        arayuzetodoEkle(girilentodo);
        uyariMesaji("tebrikler todo eklendi *******************","success");
        storageaEklee(girilentodo);

    }
    e.preventDefault();
}

function storageBosMu()
{
    if(localStorage.getItem("todolar") === null){
        todolar=[];
    }else{
        todolar = JSON.parse(localStorage.getItem("todolar"));
    }
}

function storageaEklee(yenitodo)
{
    storageBosMu();
    todolar.push(yenitodo);
    localStorage.setItem("todolar",JSON.stringify(todolar));
}

function arayuzetodoEkle(yenitodo) 
{
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between";
    li.id ="herbirTodom";
    li.textContent = yenitodo;

    const div6 = document.createElement("div");
    div6.className = "div6";

    const tikbuton = document.createElement("button");
    tikbuton.className = "btn mr-2 custom-button";

    const itik = document.createElement("i");
    itik.className = "fa-solid fa-square-check";
    itik.id="tik";

    const silbuton = document.createElement("button");
    silbuton.className = "btn mr-2 custom-button";

    const isil = document.createElement("i");
    isil.className = "fas fa-trash-alt";
    isil.id="sil";

    tikbuton.appendChild(itik);
    silbuton.appendChild(isil);

    div6.appendChild(tikbuton);
    div6.appendChild(silbuton);

    li.appendChild(div6);
    ul.appendChild(li);

    inputGir.value = "";

}

function storagedenUIaKalici(){
    storageBosMu();
    console.log(todolar.length);
    for (let i = 0; i < todolar.length; i++) {
        arayuzetodoEkle(todolar[i]);
        // storagedeUstuCiz();
    }
    

}


function uyariMesaji(mesaj, renk)
{

    const div = document.createElement("div");
    div.className="alert alert-" + renk;  
    div.textContent = mesaj;
    // div.style.color = "white";
    div4.appendChild(div);
    setTimeout(function(){
        div.remove();
    },2500);
}

function arayuzdenTodoSil(e){
    //!niye böyle bakılacak
    if(e.target.id === "sil"){  //!! id lerde ve classlarda BİREBİR KOPYALAMADAN KENDİM YAZINCA ÇALIŞMIYOR ELEMENT SEÇMEDE DE AYNI SORUNU YAŞADIM NİYE ??
        //!! storagedenSil fonkunu ekleyince yukarıdan sil id sini tekrar kopyala yapıştır yapmadan çalışmadı NİYE KAFAYI YİCEM YORUM SATIRI EKLEYİNCE BİLE BOZULUYOR FONK YİNE KOPYALA YAPIŞTIR YAPMAM GEREKİYO
        // BAZNE İKİNCİ TIKLAMADA DÜZELİYO
        // console.log("çöp kutusu butona basıldı");
        // arayüzden sil
        const todom = e.target.parentElement.parentElement.parentElement;// li ye gidiyorum ve li yi siliyorum.
        todom.remove();

        // storage dan sil
        storagedenSil(todom.textContent);
        uyariMesaji("TODO SİLİNDİ","warning");
    }
 
}

function storagedenSil(silinecekTodo){
    storageBosMu();
    todolar.forEach(function(todo,index){
        if(silinecekTodo === todo){
            todolar.splice(index,1);
        }
    });
    localStorage.setItem("todolar",JSON.stringify(todolar));
}






// ÇALIŞMIYORDU KENDİ KENDİNE DÜZELDİ******************
function tumTodolariSil(){
    const todolarim = document.getElementsByClassName("list-group-item d-flex justify-content-between");
   
    // console.log(todolarim);
    
    if(todolarim.length > 0){
        
        for (let i = todolarim.length - 1; i >= 0; i--) {
           
            todolarim[i].remove();
            
        }//!! foreach halleri çalışmıyor niye bakılacak
    

        todolar=[];
        localStorage.setItem("todolar",JSON.stringify(todolar));
        uyariMesaji("TÜM TODOLAR SİLİNDİ", "warning");

    }else{
        uyariMesaji("EN AZ 1 TODO OLURSA SİLERSİNİZ", "warning");
    }
}


function filter(e) {
    const filterValue = e.target.value.toLowerCase().trim();
    console.log("filter--", filterValue);
    const todoLis = document.querySelectorAll("#herbirTodom");
    console.log("todoLis", todoLis);

    if(todoLis.length>0){
        todoLis.forEach(function(todo){
            if(todo.textContent.toLowerCase().trim().includes(filterValue)){
                    todo.setAttribute("style","display : block");
            }else{
                todo.setAttribute("style","display : none !important");
            }
        });
    }else{
        showAlert("warning","todo listesi boş");
    }
}





function tikArayuz(e){
    if(e.target.className === "fa-solid fa-square-check"){
        const cizilecekTodo = e.target.parentElement.parentElement.parentElement;
        // todo.style.textDecoration = todo.style.textDecoration === 'line-through' ? 'none' : 'line-through';
        cizilecekTodo.style.textDecoration = 'line-through';
        // console.log(todo.type);
        // console.log(todo);
        uyariMesaji( "TEBRİKLERRR todo tamamlandiii","success");
        
    }
 
}
function tikArayuz2(yenitodo){
    const li = document.getElementsByClassName("list-group-item d-flex justify-content-between")
        li.textContent = yenitodo;
        li.textDecoration = 'line-through';
}

//! çalışmıyor bakılacak
// function storagedeUstuCiz(cizilecekTodo){
//     storageBosMu();
//     const cizilecekTodo = e.target.parentElement.parentElement.parentElement;
//     todolar.forEach(function(todo){
//         if(cizilecekTodo === todo){
//             cizilecekTodo.textDecoration = 'line-through';
//         }
//     });
//     localStorage.setItem("todolar",JSON.stringify(todolar));
// }
    