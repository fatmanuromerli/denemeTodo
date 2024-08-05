const inputBox = document.getElementById("todogir");// task girişi alınan input seçildi
const listUl = document.getElementById("ul1");// ul seçildi

let tasks = [];

// window.onload ile sayfa yüklendiğinde kayıtlı görevleri göster
window.onload = function () {
    showTasks();
};


function addTask() {

    let isInboxSame = true;
    tasks.forEach(control => {
        if (control.task == inputBox.value.trim()) {
            alert("ZATEN VAR OLAN BİR GÖREVİ EKLEYEMEZSİNİZ");
            isInboxSame = false;
        }
    })

    if (inputBox.value.trim() === '') {
        alert("BOŞ GÖREV EKLENEMEZ !!!!!");
    } else if (isInboxSame) {
        // Yeni görev nesnesi oluştur
        const newTask = {
            task: inputBox.value,
            checked: false
        };

        // Yeni görevi tasks dizisine ekle
        tasks.push(newTask);

        // localStorage'a güncellenmiş görev listesini kaydet
        saveData();

        // Yeni görevi UI'ya ekle
        createTodoUI(newTask);

        // Input kutusunu temizle
        inputBox.value = '';
    }
}


function createTodoUI(inputBoxvalue) {    // bu fonksiyon eklenen task oluşturma fonksiyonudur.
    let li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between";
    li.textContent = inputBoxvalue.task;
    // li.id = "li";
    listUl.appendChild(li);

    const div6 = document.createElement("div");
    div6.className = "div6";
    li.appendChild(div6);

    const tikbuton = document.createElement("button");
    tikbuton.className = "btn mr-2 custom-button";
    tikbuton.id = "tikButon";
    div6.appendChild(tikbuton);

    const itik = document.createElement("i");
    itik.className = "fa-solid fa-square-check";
    itik.id = "tik";
    tikbuton.appendChild(itik);

    const silbuton = document.createElement("button");
    silbuton.className = "btn mr-2 custom-button";
    silbuton.id = "silButon";
    div6.appendChild(silbuton);

    const isil = document.createElement("i");
    isil.className = "fas fa-trash-alt";
    isil.id = "sil";
    silbuton.appendChild(isil);


    li.addEventListener("click", function (e) {
        if (e.target.id === "tikButon") {
            toggleChecked(inputBoxvalue, tikbuton.parentElement.parentElement);
        } else if (e.target.id === "silButon") {
            removeTask(inputBoxvalue, silbuton.parentElement.parentElement);
        }
    });


}

function removeAll() {
    tasks = [];
    localStorage.clear();
    listUl.innerHTML = '';
    RemoveCheckedVisibility();
}

function checkedAll() {
    const listItems = document.querySelectorAll(".list-group-item");

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

function toggleChecked(taskObj, liElement) {

    taskObj.checked = !taskObj.checked;
    liElement.classList.toggle("checked");
    saveData();
}


function removeTask(taskObj, liElement) {
    //...burada item adında bir listeye taskObj hariç geri kalan içerikleri dizi olarak yollarız
    // bu sayede bizim çarpıya tıkladığımız taskObj hariç geri kalan içerikler item adlı
    //diziye kaydedilir. biz de bunu en sonunda tasks olarak yeni dizimiz varsayıyoruz ve
    //save data ile de bunu kaydettik 
    tasks = tasks.filter(item => item !== taskObj);
    liElement.remove();
    saveData();
}


function removeSelected() {
    const listItems = document.querySelectorAll(".list-group-item");

    tasks.forEach(kontrol => { //remove tasktaki sistem gibi çalışıyor
        if (kontrol.checked) {
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

// local storageye kaydediyor
function saveData() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    RemoveCheckedVisibility();
}


// bu fonksiyon yerel depolamadan görevleri alıp arayüzdeki listeyi günceller ve işaretlenmiş görevleri uygun şekilde işaretler.
function showTasks() {
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.forEach(task => {
        createTodoUI(task);
        if (task.checked) {
            const li = listUl.lastElementChild;
            li.classList.add("checked");
        }
    });
    RemoveCheckedVisibility();
}

function RemoveCheckedVisibility() {
    // console.log("check test")

    const listItems = document.querySelectorAll(".list-group-item");
    let isAnyChecked = false;

    listItems.forEach(item => {
        if (item.classList.contains("checked")) {
            isAnyChecked = true;
        }
    });

}

// FİLTRELEME İŞLEMİ
const inputAra = document.getElementById("todoara"); // arama butonu seçildi
inputAra.addEventListener('keyup', function (e) {
    const filterValue = e.target.value.toLowerCase().trim();

    const todoLis = document.querySelectorAll(".list-group-item");

    if (todoLis.length > 0) {
        todoLis.forEach(function (todo) {
            if (todo.textContent.toLowerCase().trim().includes(filterValue)) {
                todo.setAttribute("style", "display : block");
            } else {
                todo.setAttribute("style", "display : none !important");
            }
        });
    } else {
        alert("warning", "todo listesi boş");
    }
});
