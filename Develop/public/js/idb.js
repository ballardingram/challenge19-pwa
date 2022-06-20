// VARIABLE > CREATE AND HOLD DB CONNECTION
// DATABASE NAME > USING BUDGET_TRACKER
let db;
const request = indexedDB.open('budget_tracker', 1);

// FUNCTION > UPDATE IF NEEDED ONCE ONLINE FROM OFFLINE
request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('new_transaction', { autoIncrement: true });
};

// FUNCTION > MOVE SUCCESSFUL UPGRADE TO GLOBAL VARIABLE
// FUNCTION > IF APP IS ONLINE, RUN DATABASECHECK AND SEND ALL LOCAL DB DATA TO API
request.onsuccess = function(event) {
    db = event.target.result;
    if(navigator.onLine) {
        uploadTransaction();
    }
};

// FUNCTION > LOG ERRORS
request.onerror = function(event) {
    console.log(event.target.errorCode);
};

// FUNCTION > SAVE TRANSACTION
function saveRecord(record) {
    const transaction = db.transaction(['new_transaction'], 'readwrite');
    const budgetObjectStore = transaction.objectStore('new_transaction');
    budgetObjectStore.add(record);
}

// FUNCTION > CREATE VARIABLE FROM PENDING TRANSACTIONS
function uploadTransaction() {
    const transaction = db.transaction(['new_transaction'], 'readwrite');
    const budgetObjectStore = transaction.objectStore('new_transaction');
    const getAll = budgetObjectStore.getAll();

    getAll.onsuccess = function() {
        if(getAll.result.length > 0) {
            fetch('api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse);
                }

                const transaction = db.transaction(['new_transaction'], 'readwrite');
                const budgetObjectStore = transaction.objectStore('new_transaction');
                budgetObjectStore.clear();
            })
            .catch(err => {
                console.log(err);
            });
        }
    };
}

// FUNCTION > LISTEN FOR APP COMING BACK ONLINE
window.addEventListener('online', uploadTransaction);