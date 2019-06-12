//=============================================================================
// IndexedDB simple wrapper
//=============================================================================
class idxDB {
    constructor(options) {
        this.db = null;
        this.name = options.name || '';
        this.stores = options.stores || [];
        this.recId = options.recId || 'recid';

        this.onOpen = () => {}
        this.onError = (event) => { console.log(event); }
    }

    openDB() {
        var request = indexedDB.open(this.name);

        console.log('In openDB()');

        request.onupgradeneeded = (event) => {
            this.db = event.target.result;
            for (var s of this.stores) {
                console.log('creando object store ' + s);
                this.db.createObjectStore(s, {keyPath: this.recId});
            }
        };

        request.onsuccess = (event) => {
            this.db = event.target.result;
            console.log('DB opened successfull');
            this.onOpen();
        };

        request.onerror = this.onError;
    }

    getStore(s) {
        return this.db.transaction(s, 'readwrite').objectStore(s);
    }

    // get all records from store. Returns a request
    getRecords(store) {
        return this.getStore(store).getAll();
    }

    addRecord(storeId, record) {
        console.log('Adding record: ' + JSON.stringify(record));
        let request = this.getStore(storeId).add(record);
        request.onsuccess = () => { console.log('Record added...'); };
        request.onerror = () => { console.log('Fail on add to db'); };
    }

    deleteRecord(storeId, record) {
        console.log('Deleting record: ' + JSON.stringify(record));
        let request = this.getStore(storeId).delete(record);
        request.onsuccess = () => { console.log('Record deleted...'); };
        request.onerror = () => { console.log('Failure deleting record...'); };
    }

    updateRecord(storeId, record) {
        console.log('Updating record: ' + JSON.stringify(record));
        let request = this.getStore(storeId).put(record);
        request.onsuccess = () => { console.log('Record updated...'); };
        request.onerror = () => { console.log('Failure updating record...'); };
    }

    deleteDB() { indexedDB.deleteDatabase(this.name); }
}
