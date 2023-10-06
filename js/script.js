const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
        alert("Buku berhasil ditambahkan!")
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

function addBook() {
    const textTitle = document.getElementById('title').value;
    const textAuthor = document.getElementById('author').value;
    const numberYear = document.getElementById('year').value;

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, textTitle, textAuthor, numberYear, false);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

    document.getElementById('title').value = "";
    document.getElementById('author').value = "";
    document.getElementById('year').value = "";
}

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    }
}

document.addEventListener(RENDER_EVENT, function () {

    const uncompletedBookList = document.getElementById('books');
    uncompletedBookList.innerHTML = '';

    const completedBookList = document.getElementById('completed-books');
    completedBookList.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isComplete) {

            uncompletedBookList.append(bookElement);
        } else {
            completedBookList.append(bookElement);
        }
    }
});

function makeBook(bookObject) {
    const textTitle = document.createElement('h2');
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = bookObject.author;

    const numberYear = document.createElement('p');
    numberYear.innerText = bookObject.year;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textAuthor, numberYear);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `book-${bookObject.id}`);

    if (bookObject.isComplete) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');

        undoButton.addEventListener('click', function () {
            undoBookFromCompleted(bookObject.id);
        });

        const editButton = document.createElement('button');
        editButton.classList.add('edit-button');

        editButton.addEventListener('click', function () {
            editBookFromCompleted(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');

        trashButton.addEventListener('click', function () {
            let text = "Apakah anda yakin ingin menghapus data ini?";
            if (confirm(text) == true) {
                removeBookFromCompleted(bookObject.id);
                alert("Buku berhasil dihapus!");
            }
        });

        container.append(undoButton, editButton, trashButton);

        undoButton.addEventListener('click', function () {
            undoBookFromCompleted(bookObject.id);
        })
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');

        checkButton.addEventListener('click', function () {
            addBookToCompleted(bookObject.id);
        });

        const editButton = document.createElement('button');
        editButton.classList.add('edit-button');

        editButton.addEventListener('click', function () {
            editBookFromUncomplete(bookObject.id);

        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');

        trashButton.addEventListener('click', function () {
            let text = "Apakah anda yakin ingin menghapus data ini?";
            if (confirm(text) == true) {
                removeBookFromUncomplete(bookObject.id);
                alert("Buku berhasil dihapus!");
            }
        });

        container.append(checkButton, editButton, trashButton);
    }

    return container;
}

function addBookToCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }

    return null;
}

function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

}

function removeBookFromUncomplete(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function editBookFromUncomplete(bookId) {
    const bookTarget = findBookIndex(bookId);
    const bookItem = findBook(bookId);

    if (bookTarget === -1) return;

    const textTitle = prompt("Masukkan judul buku:", bookItem.title);
    const textAuthor = prompt("Masukkan nama penulis:", bookItem.author);
    const numberYear = prompt("Masukkan tahun terbit:", bookItem.year);
    if (textTitle != null || textTitle != "") {
        if (textTitle != null) {
            bookItem.title = textTitle;
        }
    }
    if (textAuthor != null || textAuthor != "") {
        if (textAuthor != null) {
            bookItem.author = textAuthor;
        }
    }
    if (numberYear != null || numberYear != "") {
        if (numberYear != null) {
            bookItem.year = numberYear;
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    alert("Data berhasil diubah!");

}

function editBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);
    const bookItem = findBook(bookId);

    if (bookTarget === -1) return;

    const textTitle = prompt("Masukkan judul buku:", bookItem.title);
    const textAuthor = prompt("Masukkan nama penulis:", bookItem.author);
    const numberYear = prompt("Masukkan tahun terbit:", bookItem.year);
    if (textTitle != null || textTitle != "") {
        if (textTitle != null) {
            bookItem.title = textTitle;
        }
    }
    if (textAuthor != null || textAuthor != "") {
        if (textAuthor != null) {
            bookItem.author = textAuthor;
        }
    }
    if (numberYear != null || numberYear != "") {
        if (numberYear != null) {
            bookItem.year = numberYear;
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    alert("Data berhasil diubah!");

}

function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }


    return -1;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}