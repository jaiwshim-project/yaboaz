(function () {
  "use strict";
  var DB_NAME = "k-fde-files-v1";
  var STORE = "evidenceFiles";

  function open() {
    return new Promise(function (resolve, reject) {
      var request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = function () {
        var db = request.result;
        if (!db.objectStoreNames.contains(STORE)) {
          var store = db.createObjectStore(STORE, { keyPath: "id" });
          store.createIndex("evidenceId", "evidenceId", { unique: false });
          store.createIndex("createdAt", "createdAt", { unique: false });
        }
      };
      request.onsuccess = function () { resolve(request.result); };
      request.onerror = function () { reject(request.error); };
    });
  }
  function transact(mode, work) {
    return open().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE, mode);
        var store = tx.objectStore(STORE);
        var result = work(store);
        tx.oncomplete = function () { db.close(); resolve(result); };
        tx.onerror = function () { db.close(); reject(tx.error); };
      });
    });
  }
  function putFiles(evidenceId, files) {
    return transact("readwrite", function (store) {
      Array.from(files || []).forEach(function (file) {
        store.put({ id: evidenceId + "-" + crypto.randomUUID(), evidenceId: evidenceId, name: file.name, type: file.type || "application/octet-stream", size: file.size, createdAt: new Date().toISOString(), blob: file });
      });
    });
  }
  function listFiles(evidenceId) {
    return open().then(function (db) {
      return new Promise(function (resolve, reject) {
        var req = db.transaction(STORE).objectStore(STORE).index("evidenceId").getAll(evidenceId);
        req.onsuccess = function () { db.close(); resolve(req.result || []); };
        req.onerror = function () { db.close(); reject(req.error); };
      });
    });
  }
  function allFiles() {
    return open().then(function (db) {
      return new Promise(function (resolve, reject) {
        var req = db.transaction(STORE).objectStore(STORE).getAll();
        req.onsuccess = function () { db.close(); resolve(req.result || []); };
        req.onerror = function () { db.close(); reject(req.error); };
      });
    });
  }
  function download(record) {
    var url = URL.createObjectURL(record.blob);
    var anchor = document.createElement("a");
    anchor.href = url; anchor.download = record.name; anchor.click();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }
  function removeFile(id) {
    return transact("readwrite", function (store) { store.delete(id); });
  }
  function clearFiles() {
    return transact("readwrite", function (store) { store.clear(); });
  }
  function restoreFiles(records) {
    return transact("readwrite", function (store) {
      store.clear();
      Array.from(records || []).forEach(function (record) { store.put(record); });
    });
  }
  window.KFDE_DB = { putFiles: putFiles, listFiles: listFiles, allFiles: allFiles, download: download, removeFile: removeFile, clearFiles: clearFiles, restoreFiles: restoreFiles };
})();
