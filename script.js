const inputBox = document.getElementById("input-text");
const listContainer = document.getElementById("list-container");
let tasks = [];

// window.onload ile sayfa yüklendiğinde kayıtlı görevleri göster
window.onload = function() {
    showTasks();
};


function addTask() {
    isInboxSame=true;
    tasks.forEach(kontrol=>{
        if(kontrol.task==inputBox.value.trim()){
            alert("öyle bir görev var")
            isInboxSame=false;
        }
        
    })
    

       
    if (inputBox.value.trim() === '') {
        alert("Herhangi bir şey yazmadınız!");
    } else if(isInboxSame) {
        // Yeni görev nesnesi oluştur
        const newTask = {
            task: inputBox.value,
            checked: false
        };

        // Yeni görevi dizimize ekle
        tasks.push(newTask);

        // localStorage'a güncellenmiş görev listesini kaydet
        saveData();

        // Yeni görevi UI'ya ekle
        UIcreate(newTask);

        // Input kutusunu temizle
        inputBox.value = '';
    }
}    

 inputBox.addEventListener('keydown',function (event) {
     if (event.key==='Enter'){addTask()} 
 });


function UIcreate(taskObj) {
    let li = document.createElement("li");
    li.textContent = taskObj.task;
    listContainer.appendChild(li);

    let span = document.createElement("span");
    span.textContent = "\u00d7";
    li.appendChild(span);

    // Görevi işaretleme veya silme olaylarını dinle
    li.addEventListener("click", function (e) {
        if (e.target.tagName === "LI") {
            toggleChecked(taskObj, li);
        } else if (e.target.tagName === "SPAN") {
            removeTask(taskObj, li);
        }
    });
}

function toggleChecked(taskObj, liElement) {
    taskObj.checked = !taskObj.checked;
    liElement.classList.toggle("checked"); //bu metod sayesinde checked yoksa eklenır varsa silinir
    saveData();
}
//parametre olarak taskObj alırız aşağıda bunu...
function removeTask(taskObj, liElement) {
    //...burada item adında bir listeye taskObj hariç geri kalan içerikleri dizi olarak yollarız
    // bu sayede bizim çarpıya tıkladığımız taskObj hariç geri kalan içerikler item adlı
    //diziye kaydedilir. biz de bunu en sonunda tasks olarak yeni dizimiz varsayıyoruz ve
    //save data ile de bunu kaydettik 
    tasks = tasks.filter(item => item !== taskObj);
    liElement.remove();
    saveData();
}
function removeAll() {
    tasks = [];
    localStorage.clear();
    listContainer.innerHTML = '';
    RemoveCheckedVisibility();
}

function checkedAll() {
    const listItems = document.querySelectorAll("#list-container li");
    console.log("fatoooooooooooooo", listItems)

    listItems.forEach(item => {
        item.classList.add("checked"); // Önyüzde görevi checked yap

        // tasks dizisindeki görevin checked durumunu güncelle
        tasks.forEach(task => {
                task.checked = true;
        });
    });

    // localStorage'a güncellenmiş tasks dizisini kaydet
    saveData();
}

function removeSelected() {
    const listItems = document.querySelectorAll("#list-container li");

    tasks.forEach(kontrol=>{ //remove tasktaki sistem gibi çalışıyor
       if(kontrol.checked) {
            tasks = tasks.filter(item => item !== kontrol);
        }   
    })


    listItems.forEach(item => {
        if (item.classList.contains("checked")) {
            tasks = tasks.filter(task => task.task !== item.textContent.trim());
            item.remove();
        }
    });

    saveData();
    RemoveCheckedVisibility();
}

function saveData() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    RemoveCheckedVisibility();
}

function showTasks() {
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.forEach(task => {
        UIcreate(task);
        if (task.checked) {
            const li = listContainer.lastElementChild;
            li.classList.add("checked");
        }
    });

    RemoveCheckedVisibility();
}

function RemoveCheckedVisibility() {

    const listItems = document.querySelectorAll("#list-container li");
    let isAnyChecked = false;

    listItems.forEach(item => {
        if (item.classList.contains("checked")) {
            isAnyChecked = true;
        }
    });

    const button4 = document.getElementById("button4");
    button4.style.display = isAnyChecked ? "block" : "none";
}

