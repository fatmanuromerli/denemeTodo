const inputBox = document.getElementById("todogir"); // Task girişi alınan input
const listUl = document.getElementById("ul1"); // UL öğesi
const addButton = document.getElementById("todoAddButton"); // Ekle butonu
const inputAra = document.getElementById("todoara"); // Arama kutusu

// Sayfa yüklendiğinde görevleri çekmek için
window.onload = function () {
    fetchAllTodos();
};

// Tüm görevleri çekmek için
async function fetchAllTodos() {
    try {
        const response = await fetch('http://localhost/fatodo/fatodo.php', {
            method: 'GET', // Verileri almak için GET isteği
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (!response.ok) {
            throw new Error('Ağ hatası: ' + response.status);
        }

        const todos = await response.json(); // JSON verisini al
        displayTodos(todos); // Görevleri görüntüle
        return todos; // Burada todos'u döndür
        
    } catch (error) {
        console.error('Bir hata oluştu:', error);
        return []; // Hata durumunda boş bir dizi döndür
    }
}


// Görev ekleme fonksiyonu
async function addTask() {
    const gorevAdi = inputBox.value.trim(); // Input değerini al
    if (!gorevAdi) {
        alert("Lütfen bir görev girin."); // Boşsa uyarı göster
        return; // İşlemi durdur
    }

    try {
        const response = await fetch('http://localhost/fatodo/fatodo.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                gorevAdi: gorevAdi,
                checked: 0 // Varsayılan olarak unchecked
            })
        });

        if (!response.ok) {
            throw new Error('Ağ hatası: ' + response.status);
        }

        const todos = await response.json(); // Yeni görevleri al
        displayTodos(todos); // Görevleri görüntüle
        inputBox.value = ''; // Input kutusunu temizle
    } catch (error) {
        console.error('Görev eklenirken hata oluştu:', error);
    }
}

// Görevleri HTML'de listelemek için
function displayTodos(todos) {
    const todoList = document.getElementById('ul1');
    todoList.innerHTML = ''; // Önceki listeyi temizle

    todos.forEach(todo => {
        createTodoUI(todo);
    });
}

// createTodoUI fonksiyonu
function createTodoUI(inputBoxvalue) {
    let li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between";
    li.textContent = inputBoxvalue.gorevAdi; // gorevAdi'yi al
    li.id = `task-${inputBoxvalue.id}`; // Her görev için benzersiz bir ID ayarlayın

    // Eğer görev checked durumundaysa, üzerini çizin
    if (inputBoxvalue.checked === 1) {
        li.style.textDecoration = "line-through"; // Üstü çizili yap
    }

    const todoList = document.getElementById('ul1');
    todoList.appendChild(li);

    const div6 = document.createElement("div");
    div6.className = "div6";
    li.appendChild(div6);

    const tikbuton = document.createElement("button");
    tikbuton.className = "btn mr-2 custom-button";
    tikbuton.id = `tikButon-${inputBoxvalue.id}`; // Her butona benzersiz bir ID veriyoruz
    div6.appendChild(tikbuton);

    const itik = document.createElement("i");
    itik.className = "fa-solid fa-square-check";
    itik.id = "tik";
    tikbuton.appendChild(itik);

    const silbuton = document.createElement("button");
    silbuton.className = "btn mr-2 custom-button";
    silbuton.id = `silButon-${inputBoxvalue.id}`; // Her butona benzersiz bir ID veriyoruz
    div6.appendChild(silbuton);

    const isil = document.createElement("i");
    isil.className = "fas fa-trash-alt";
    isil.id = "sil";
    silbuton.appendChild(isil);

    // Sil butonuna tıklama olayı ekleme
    silbuton.addEventListener("click", async () => {
        await deleteTask(inputBoxvalue.id); // Görev ID'sini silme fonksiyonuna gönder
    });

    // Tik butonuna tıklama olayı ekleme
    tikbuton.addEventListener("click", async () => {
        const newChecked = inputBoxvalue.checked === 1 ? 0 : 1; // Eğer şu an checked 1 ise, 0 yap, aksi takdirde 1 yap
        await toggleChecked(inputBoxvalue.id, newChecked); // Görev ID'sini güncelleme fonksiyonuna gönder

        // Burada DOM'u doğrudan güncelleyelim
        li.style.textDecoration = newChecked === 1 ? "line-through" : "none"; // Üstü çizili yap veya kaldır
        inputBoxvalue.checked = newChecked; // inputBoxvalue'yi güncelle
    });
}


// Görev checked durumunu güncelleme fonksiyonu
async function toggleChecked(id, newChecked) {
    try {
        const response = await fetch('http://localhost/fatodo/fatodo.php', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                id: id, // İlgili görev ID'sini ekleyin
                operation: 'check_item',
                checked: newChecked
            })
        });

        if (!response.ok) {
            throw new Error('Ağ hatası: ' + response.status);
        }

        const result = await response.json();
        console.log(result);
    } catch (error) {
        console.error('Görev durumunu güncellerken hata oluştu:', error);
    }
}


// Görev silme fonksiyonu
async function deleteTask(id) {
    try {
        const response = await fetch('http://localhost/fatodo/fatodo.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({ 
                id: id,
                operation: 'delete_onetask' 
            })
        });

        if (!response.ok) {
            throw new Error('Ağ hatası: ' + response.status);
        }

        // Görev elemanını arayüzden kaldır
        const taskElement = document.getElementById(`task-${id}`); // ID'yi burada güncelledik
        // console.log("silinen : ", taskElement);
        if (taskElement) {
            taskElement.remove(); // Görev elemanını arayüzden kaldır
        }
    } catch (error) {
        console.error('Görev silinirken hata oluştu:', error);
    }
}




// Arama fonksiyonu
inputAra.addEventListener("input", async function() {
    const aramaKelimesi = inputAra.value; // Arama kelimesini al
    try {
        const response = await fetch(`http://localhost/fatodo/fatodo.php?searchTerm=${encodeURIComponent(aramaKelimesi)}`, {
            method: 'GET', // Verileri almak için GET isteği
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (!response.ok) {
            throw new Error('Ağ hatası: ' + response.status);
        }

        const todos = await response.json(); // JSON verisini al
        displayTodos(todos); // Görevleri görüntüle
    } catch (error) {
        console.error('Bir hata oluştu:', error);
    }
});


// Tüm görevleri silme fonksiyonu
// Tüm görevleri silme fonksiyonu
async function removeAll() {
    if (confirm("Tüm görevleri silmek istediğinize emin misiniz?")) { // Kullanıcı onayı
        try {
            const response = await fetch('http://localhost/fatodo/fatodo.php', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    operation: 'delete_all',
                })
            });

            if (!response.ok) {
                throw new Error('Ağ hatası: ' + response.status);
            }

            const result = await response.json(); // Sonucu kontrol et
            console.log('Silme sonucu:', result); // Sonucu kontrol etmek için log ekleyin

            if (result.success) {
                displayTodos([]); // Arayüzde görevleri temizle
            } else {
                console.error('Hata:', result.error); // Hata mesajını görüntüle
            }
        } catch (error) {
            console.error('Tüm görevler silinirken hata oluştu:', error);
        }
    }
}




// Tüm görevleri "yapıldı" olarak işaretleme fonksiyonu
async function checkedAll() {
    try {
        // Veritabanındaki tüm görevlerin checked değerlerini 1 yap
        const response = await fetch('http://localhost/fatodo/fatodo.php', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                checked: 1 // Tüm görevleri yapıldı olarak işaretle
            })
        });

        if (!response.ok) {
            throw new Error('Ağ hatası: ' + response.status);
        }

        const todos = await response.json(); // Güncellenmiş görevleri al
        displayTodos(todos); // Görevleri görüntüle
    } catch (error) {
        console.error('Tüm görevler işaretlenirken hata oluştu:', error);
    }
}

// Sadece üstü çizili görevleri sil fonksiyonu
async function removeSelected() {
    try {
        const response = await fetch('http://localhost/fatodo/fatodo.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                operation: 'check_delete' // operation değerini burada gönderiyoruz
            })
        });

        if (!response.ok) {
            throw new Error('Ağ hatası: ' + response.status);
        }

        const result = await response.json();
        if (result.success) {
            console.log('Görevler başarıyla silindi.');

            // Tüm görevleri tekrar çek
            const todos = await fetchAllTodos(); // Tüm görevleri tekrar çek
            console.log('Todos:', todos); // Todos değerini kontrol et

            if (todos && Array.isArray(todos)) { // Eğer todos tanımlıysa ve bir dizi ise
                // Sadece checked değeri 0 olan görevleri filtrele
                const filteredTodos = todos.filter(todo => todo.checked === 0);
                displayTodos(filteredTodos); // Arayüzde güncelle
            } else {
                console.error('Görevler alınamadı veya geçersiz format:', todos);
            }
        } else {
            console.error(result.error); // Hata mesajı
        }
    } catch (error) {
        console.error('Görevler silinirken hata oluştu:', error);
    }
}







