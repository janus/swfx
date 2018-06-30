import idb from 'idb';

let openDatabase = () => {
  // If the browser doesn't support service worker,
  // we don't care about having a database
  if (!navigator.serviceWorker) {
    return Promise.resolve();
  }

  return idb.open('olfx', 2, upgradeDb => {
    let store = upgradeDb.createObjectStore('olfxs');
    //store.createIndex('CurrencyIndex', ['currency.from', 'currency.to']);
  });
}

export default class IndexController {
  constructor(){
      this._dbPromise = openDatabase();
      this._registerServiceWorker();
  }
    
  setDB(key, val){
    return this._dbPromise.then(db => {
        const tx = db.transaction('olfxs', 'readwrite');
        tx.objectStore('olfxs').put(val , key);
        let splits = key.split('-');
        let newKey = `${splits[1]}-${splits[0]}`;
        tx.objectStore('olfxs').put(val , newKey);
        return tx.complete; });
  }

  getDB(key){
      return this._dbPromise.then(db => {
          return db.transaction('olfxs').objectStore('olfxs').get(key);
      });
      
  }

 getDBKeys() {
    return this._dbPromise.then(db => {
      const tx = db.transaction('olfxs');
      const keys = [];
      const store = tx.objectStore('olfxs');

      // This would be store.getAllKeys(), but it isn't supported by Edge or Safari.
      // openKeyCursor isn't supported by Safari, so we fall back
      (store.iterateKeyCursor || store.iterateCursor).call(store, cursor => {
        if (!cursor) return;
        keys.push(cursor.key);
        cursor.continue();
      });

      return tx.complete.then(() => keys);
    });
  }
  _registerServiceWorker() {
      if (!navigator.serviceWorker) return;

      let indexController = this;

      navigator.serviceWorker.register('/sw.js').then((reg) => {
        if (!navigator.serviceWorker.controller) {
          return;
        }

        if (reg.waiting) {
          this._updateReady(reg.waiting);
          return;
        }

        if (reg.installing) {
          indexController._trackInstalling(reg.installing);
          return;
        }

        reg.addEventListener('updatefound', () => {
          indexController._trackInstalling(reg.installing);
        });
      });

      // Ensure refresh is only called once.
      // This works around a bug in "force update on reload".
      let refreshing;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        window.location.reload();
        refreshing = true;
      });
    }
    
  _updateReady(worker) {
    worker.postMessage({action: 'skipWaiting'});

  }
    
  _trackInstalling(worker) {
     var indexController = this;
     worker.addEventListener('statechange', ()=> {
    if (worker.state == 'installed') {
      indexController._updateReady(worker);
    }});
  }

}
