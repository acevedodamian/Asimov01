/**
 * Backbone cachedStorage Adapter
 * forked from https://github.com/jeromegn/Backbone.localStorage
 *
 * Provides a synchronic behaviour for a localstorage cache to ajax Backbone.Sync
 *
 * Version 0.1 Retcon http://www.retcon.com.ar
 *
 */
define(['backbone','libtest/async'], function(Backbone,async){

(function (root, factory) {
  if (typeof exports === 'object' && typeof require === 'function') {
    module.exports = factory(require("backbone"));
  } else if (typeof define === "function" && define.amd) {
      // AMD. Register as an anonymous module.
      // Use global variables if the locals are undefined.
      return factory(Backbone || root.Backbone);

  } else {
    factory(Backbone);
  }
}(this, function(Backbone) {
// A simple module to replace `Backbone.sync` with *localStorage*-based
// persistence. Models are given GUIDS, and saved into a JSON object. Simple
// as that.

// Hold reference to Underscore.js and Backbone.js in the closure in order
// to make things work even if they are removed from the global namespace

// Generate four random hex digits.
function S4() {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
};

// Generate a pseudo-GUID by concatenating random hexadecimal.
function guid() {
   return ("new"+S4()+S4()+"-"+S4()+"-"+S4());
};

function isObject(item) {
  return item === Object(item);
}

function contains(array, item) {
  var i = array.length;
  while (i--) if (array[i] === item) return true;
  return false;
}

function extend(obj, props) {
  for (var key in props) obj[key] = props[key]
  return obj;
}

// Our Store is represented by a single JS object in *localStorage*. Create it
// with a meaningful name, like the name you'd give a table.
// window.Store is deprectated, use Backbone.LocalStorage instead
Backbone.LocalStorage = window.Store = function(name, serializer) {
  if( !this.localStorage ) {
    throw "Backbone.localStorage: Environment does not support localStorage."
  }
  this.name = name;
  this.serializer = serializer || {
    serialize: function(item) {
      return isObject(item) ? JSON.stringify(item) : item;
    },
    // fix for "illegal access" error on Android when JSON.parse is passed null
    deserialize: function (data) {
      return data && JSON.parse(data);
    }
  };
  var store = this.localStorage().getItem(this.name);
  this.records = (store && store.split(",")) || [];
};

extend(Backbone.LocalStorage.prototype, {

  // Save the current state of the **Store** to *localStorage*.
  save: function() {
    this.localStorage().setItem(this.name, this.records.join(","));
  },

  // Add a model, giving it a (hopefully)-unique GUID, if it doesn't already
  // have an id of it's own.
  create: function(model) {
    if (!model.id) {
      model.id = guid();
      model.set(model.idAttribute, model.id);
    }
    // Pisar lo que haya en el storage.
    this.localStorage().setItem(this._itemName(model.id), this.serializer.serialize(model));

    // Si ya existe en records no guardarlo en el indice.
    if(_.indexOf(this.records, model.id.toString()) == -1){
        this.records.push(model.id.toString());
        this.save();
    }

    return this.find(model) !== false;
  },

  // Update a model by replacing its copy in `this.data`.
  update: function(model) {
    this.localStorage().setItem(this._itemName(model.id), this.serializer.serialize(model));
    var modelId = model.id.toString();
    if (!contains(this.records, modelId)) {
      this.records.push(modelId);
      this.save();
    }
    return this.find(model) !== false;
  },

  // Retrieve a model from `this.data` by id.
  find: function(model) {
    return this.serializer.deserialize(
        this.localStorage().getItem(this._itemName(model.id))
    );
  },

   // Return the array of all models currently in storage.
  findAll: function() {
    var result = [];
    for (var i = 0, id, data; i < this.records.length; i++) {
      id = this.records[i];
      data = this.serializer.deserialize(this.localStorage().getItem(this._itemName(id)));
      if (data != null) result.push(data);
    }
    return result;
  },

  // Delete a model from `this.data`, returning it.
  destroy: function(model) {
    this.localStorage().removeItem(this._itemName(model.id));
    var modelId = model.id.toString();
    for (var i = 0, id; i < this.records.length; i++) {
      if (this.records[i] === modelId) {
        this.records.splice(i, 1);
      }
    }
    this.save();
    return model;
  },

  localStorage: function() {
    return localStorage;
  },

  // Clear localStorage for specific collection.
  _clear: function() {
    var local = this.localStorage(),
      itemRe = new RegExp("^" + this.name + "-");

    // Remove id-tracking item (e.g., "foo").
    local.removeItem(this.name);

    // Match all data items (e.g., "foo-ID") and remove.
    for (var k in local) {
      if (itemRe.test(k)) {
        local.removeItem(k);
      }
    }

    this.records.length = 0;
  },

  // Size of localStorage.
  _storageSize: function() {
    return this.localStorage().length;
  },

  _itemName: function(id) {
    return this.name+"-"+id;
  }

});

// localSync delegate to the model or collection's
// *localStorage* property, which should be an instance of `Store`.
// window.Store.sync and Backbone.localSync is deprecated, use Backbone.LocalStorage.sync instead
Backbone.LocalStorage.sync = window.Store.sync = Backbone.localSync = function(method, model, options) {
  var store = model.localStorage || model.collection.localStorage;

  var resp, errorMessage;
  //If $ is having Deferred - use it.
  var syncDfd = Backbone.$ ?
    (Backbone.$.Deferred && Backbone.$.Deferred()) :
    (Backbone.Deferred && Backbone.Deferred());

  try {

    switch (method) {
      case "read":
        resp = model.id != undefined ?
            store.find(model) :
            store.findAll();
        break;
      case "create":
        resp = store.create(model);
        break;
      case "update":
        resp = store.update(model);
        break;
      case "delete":
        resp = store.destroy(model);
        break;
    }

  } catch(error) {
    if (error.code === 22 && store._storageSize() === 0)
      errorMessage = "Private browsing is unsupported";
    else
      errorMessage = error.message;
  }

  if (resp) {
    if (options && options.success) {
        options.success(resp);
    }
    if (syncDfd) {
      syncDfd.resolve(resp);
    }

  } else {
/*
    errorMessage = errorMessage ?
                    errorMessage
                    : "Record Not Found";
*/
  errorMessage = errorMessage ?
            errorMessage
            : "";


    if (options && options.error){
        options.error(errorMessage);
    }

    if (syncDfd)
      syncDfd.reject(errorMessage);
  }

  // add compatibility with $.ajax
  // always execute callback for success and error
  if (options && options.complete) options.complete(resp);

  return syncDfd && syncDfd.promise();
};

//backup original backbone sync
Backbone.ajaxSync = Backbone.sync;

/*
Chequea si está online

// TODO: se puede implementar aquí un heartbeat a un rest y llamar a un callback, para tener precision de la conexion,
pero también produciría un retraso igual al timeout del heartbeat por cada pedido ajax
*/
Backbone.cachedStorageIsOnLine = function () {

    var ret = false;

    var isBrowser = function () {
        return window.location.href.indexOf('http:') > -1;
    };

    var isAndroid = function () {
        return navigator.userAgent.indexOf("Android") > 0;
    };

    //si esta la libreria de cordova para verificar el estado de la red
    if ((typeof navigator.connection !== 'undefined') && !isBrowser() && isAndroid()) {
        if (navigator.connection.type !== Connection.UNKNOWN && navigator.connection.type !== Connection.NONE) {
            ret = true;
        }
    } else {
            ret = navigator.onLine;
    }
    //console.log("cachedStorage IsOnLine: " + ret);
    return ret;
}


/*
    Implementación de sync de backbone

    Si la colección tiene localStorage configurado, agrega una acción posterior para guardar en cache.
    El encadenamiento de callbacks asegura que options.success y options.error sigan funcionando.

    en  model.localStorage.pendingMsgs  quedan los mensajes de salida del intento de envío de pendientes

    Notas , Supuestos , TODO:
        -TODO: Se debería re ordenar las llamadas a las funcionar usando async.js para orquestar , el orden de ejecucion del codigo es ilegible de atrás para adelante.
        -TODO: cambiar todos los Backbone.ajaxSync.apply por el método sync de model.localStorage
        -TODO: para las operaciones que no es read, ¿ tiene sentido encadenar todo para que el retorno sea sincrónico ?
*/
Backbone.cachedStorageSync = function(method, model, options) {
  var localStorage;
  var isModelCollection = false;

  //Si model es una coleccion
  if(model.localStorage){
     localStorage = model.localStorage;
     isModelCollection = true;
  }
  // si model es un model ...
  if (model.collection && model.collection.localStorage)
      localStorage = model.collection.localStorage;
/*
  var store = model.localStorage || model.collection.localStorage;

  var resp, errorMessage;

  //If $ is having Deferred - use it.
  var syncDfd = Backbone.$ ?
    (Backbone.$.Deferred && Backbone.$.Deferred()) :
    (Backbone.Deferred && Backbone.Deferred());

  try {
*/
      //backups callbacks originales
      var sourceBackboneSuccess = options.success;
      var sourceBackboneError = options.error;


      options.success = function( ){
          options = {};
          options.success = sourceBackboneSuccess;
          options.error = sourceBackboneError;

          //2) ejecuta metodos ajax de backbone. Si está offline llamá al callback de error para que se maneje por localstorage
          //3)llama al metodo correspondiente del localstorage para manejar errores por cache si los hubo.
          switch (method) {
              case "read":
                  if (isModelCollection)
                     model.reset();
                  Backbone.cachedStorageRead(method, model, options);
                  break;
              case "create":
                  Backbone.cachedStorageSaveCreate(method, model, options);
                  break;
              case "update":
                  Backbone.cachedStorageSaveUpdate(method, model, options);
                  break;
              case "delete":
                  console.log("Backbone.cachedStorage:" + localStorage.name + " destroy not supported yet");
                  break;
          }
          if ( Backbone.cachedStorageIsOnLine() ){
              Backbone.ajaxSync.apply(this, [method, model, options]);
          }else{
              console.log("Backbone.cachedStorage:" + localStorage.name + " skipping Backbone.ajaxSync, (network offline)");
              //se invoca al handler de error de las funciones del switch
              options.error("Backbone.cachedStorage:" + localStorage.name + " skipping Backbone.ajaxSync, (network offline)");
          }
      }

      //1) chequea en busca de cambios pendientes de enviar.
      if ( Backbone.cachedStorageIsOnLine() ){
          Backbone.cachedStorageSendDirtyChanges(method, model, options);
      }else{
          console.log("Backbone.cachedStorage:" + localStorage.name + " skipping Backbone.cachedStorageSendDirtyChanges, (network offline)");
          //se invoca al handler de success para continuar (3)
          options.success("Backbone.cachedStorage:" + localStorage.name + " skipping Backbone.cachedStorageSendDirtyChanges, (network offline)");
      }


/*
  } catch (error) {
      if (error.code === 22 && store._storageSize() === 0)
          errorMessage = "Private browsing is unsupported";
      else
          errorMessage = error.message;
  }

  if (resp) {
    if (options && options.success) {
        options.success(resp);
    }
    if (syncDfd) {
      syncDfd.resolve(resp);
    }

  } else {
    errorMessage = errorMessage ?
                    errorMessage
                    : "Record Not Found";

    if (options && options.error){
        options.error(errorMessage);
    }

    if (syncDfd)
      syncDfd.reject(errorMessage);
  }

  // add compatibility with $.ajax
  // always execute callback for success and error
  if (options && options.complete) options.complete(resp);

  return syncDfd && syncDfd.promise();
*/
};




/*
Se interpone entre el funcionamiento del fetch normal de backbone ( Backbone.ajaxSync ) en caso de que falle la llamada ajax obtiene los datos del localstorage, si existen datos de fetch realizados previamente , si no llama a options.error.  En el resto de los casos llama a options.success sin error.

Notas / Supuestos / TODOs:
    -Si el id del registro consultado con fetch que se va a insertar en el localstorage ya existe y está "dirty", no se inserta. Por lo tanto no se puede consultar algo que quedó pendiente de enviar modificaciones !. Se incrementa un contador de 'fetchRetry' en el registro para en el envío de pendientes implementar como resolverlo.
*
*/
Backbone.cachedStorageRead = function(method, model, options) {
  var localStorage;
  if (model.localStorage)
      localStorage = model.localStorage;

  if (model.collection && model.collection.localStorage)
      localStorage = model.collection.localStorage;

//backups original success callback, and replaces it
    var sourceBackboneSuccess = options.success;

    options.success = function(resp){

            var isNewRec = false;

            //after successful fetch
                console.log("cachedStorageRead:" + localStorage.name + " Caching fetch results...");

            //cache results
                var modelCopy = _.extend(model);
                modelCopy.push(resp);

                var localRecord;
                //Recorre lo que hay en el localstorage.
                var allRecs = localStorage.findAll();
                if (allRecs){
                    _.each( allRecs, function(mod) {
                        localRecord = localStorage.find(mod);
                        if (localRecord && localRecord.dirty){
                            isNewRec = ( mod.id && (new String(mod.id).indexOf("new")>=0) ) ? true: false;
                            if (isNewRec){
                                //agrega los registros nuevos y dirty al fetch que viene del servicio a la lista de retorno
                                modelCopy.push(mod);
                                console.log("cachedStorageRead:" + localStorage.name + " New dirty), id: " + localRecord.id + " fetchRetry: " + localRecord.fetchRetry );
                            }
                        }else{
                            //Si el registro no es dirty y no existe en lo que viene del fetch
                            //se elimina. ( se quitó o cambió en el servidor)
                            var modelsAtFetch = modelCopy.where({id: mod.id});
                        	if ( modelsAtFetch.length === 0   ){
                                console.log("cachedStorageRead:" + localStorage.name + " Deleting item at localStorage, ( not found in fetch query ) id: " + mod.id);
                                localStorage.destroy(localRecord);
                            }
                        }
                    } );
                }
                //Recorre lo que viene del fetch
                modelCopy.each( function(mod) {
                        localRecord = localStorage.find(mod);
                        if (localRecord && localRecord.dirty){
                            if(localRecord.fetchRetry){
                                localRecord.fetchRetry += 1;
                             }else{
                                localRecord.fetchRetry = 1;
                             }
                             localStorage.update(localRecord);
                            console.log("cachedStorageRead:" + localStorage.name + " Not creating item at localStorage (dirty), id: " + localRecord.id + " fetchRetry: " + localRecord.fetchRetry );
                        }else{
                            console.log("cachedStorageRead:" + localStorage.name + " Creating item at localStorage, id: " + mod.id);
                            localStorage.create(mod);
                        }
                } );


            //invoke original fetch success callback
                sourceBackboneSuccess(resp);
    }

//backups original error callback, and replaces it
    var sourceBackboneError = options.error;

    options.error = function(resp){
    //after error on fetch
    console.log("cachedStorageRead:" + localStorage.name + " Getting cached results ...");

    //cache results
        var modelCopy = _.extend(model);
        var optionsCopy = {};
        optionsCopy.success = optionsCopy.error = function(respSuccess){

            //if theres data cached invoke original fetch success callback
            if (respSuccess.length > 0){
                console.log("cachedStorageRead:" + localStorage.name + " localStorage read success .. " + respSuccess.length + " records found");
                if (resp.status === 0)
                    resp.status = 200; // 200 OK
                resp.statusText += " <--- LocalStorage fetched cache data";
                sourceBackboneSuccess(respSuccess);
             }else{
                console.log("cachedStorageRead:" + localStorage.name + " localStorage read no data found! ");
                if (resp.status === 0)
                    resp.status = 404; // 404 Not Found
                resp.statusText += " <--- LocalStorage read error, no data found";
                sourceBackboneError(resp);
            }
        }


        Backbone.localSync.apply(this, ['read', modelCopy, optionsCopy]);

    }


};

/*
Se interpone entre el funcionamiento del save normal de backbone ( Backbone.ajaxSync ) en caso de que falle la llamada ajax almancena el request enviado en el localstorage para enviar el cambio pendiente más tarde.

Supuestos / TODO:

  - TODO: No distingue tipos de error para almacenar, cualquier falla se almacena como dirty para reintentar.
  - En el caso de create, En el localstorage se genera un id temporal y se pone el flag dirty.
  - En el caso de update, si un registro con el id existe se actualiza.
  - Crea una cadena de llamadas que puede hacer más lenta la ejecución ya que se vuelve sincrónica el intento de envío / timeout o error -> callback de error -> almacenamiento en localStorage. Pero esto permite que los callbacks de success / error sean reales. Para reducir la demora se debe indicar timeouts de las llamadas ajax que hace Backbone.ajaxSync

*/
Backbone.cachedStorageSaveCreate = function(method, model, options){
  var localStorage;
  if (model.localStorage)
      localStorage = model.localStorage;

  if (model.collection && model.collection.localStorage)
      localStorage = model.collection.localStorage;

    //backups original error callback, and replaces it
    var sourceBackboneSuccess = options.success;
    var sourceBackboneError = options.error;

    options.error = function(resp){

    //after error on ajax save
    console.log("cachedStorageSaveCreate:" + localStorage.name + " caching save ... method: " + method);

    //cache results to localstorage
        var modelCopy = _.extend(model);
        var optionsCopy = _.extend(options);

        //set model as dirty
        modelCopy.set("dirty",true);

        //in case of succesful localStorage
        optionsCopy.success = function(respSuccess){
            console.log("cachedStorageSaveCreate:" + localStorage.name + " localStorage save success! ... method: " + method + " " + JSON.stringify(respSuccess));
            sourceBackboneSuccess(respSuccess);
        }
        optionsCopy.error = function(resp){
            console.error("cachedStorageSaveCreate:" + localStorage.name + " Error saving to local storage ... method: " + method + " " + JSON.stringify(resp));
            sourceBackboneError(resp);
        }

        Backbone.localSync.apply(this, [method, modelCopy, optionsCopy]);

    }
};

/*
Similar al create pero para update

Supuestos / TODO:
  - unificar con el codigo del create

*/
Backbone.cachedStorageSaveUpdate = function(method, model, options){
  var localStorage;
  if (model.localStorage)
      localStorage = model.localStorage;

  if (model.collection && model.collection.localStorage)
      localStorage = model.collection.localStorage;

  var sourceBackboneSuccess = options.success;
    //backups original error callback, and replaces it
    var sourceBackboneError = options.error;

    options.error = function(resp){

    //after error on ajax save
    console.log("cachedStorageUpdate:" + localStorage.name + " caching save ... method: " + method);

    //cache results to localstorage
        var modelCopy = _.extend(model);
        var optionsCopy = _.extend(options);

        //set model as dirty
        modelCopy.set("dirty",true);

        //in case of succesful localStorage
        optionsCopy.success = function(respSuccess){
            console.log("cachedStorageUpdate:" + localStorage.name + " localStorage save success! ... method: " + method + " " + JSON.stringify(respSuccess));
            sourceBackboneSuccess(respSuccess);
        }
        optionsCopy.error = function(resp){
            console.error("cachedStorageUpdate:" + localStorage.name + " Error saving to local storage ... method: " + method + " " + JSON.stringify(resp));
            sourceBackboneError(resp);

        }

        Backbone.localSync.apply(this, [method, modelCopy, optionsCopy]);

    }
};

Backbone.MAX_FETCH_RETRIES = 2;
Backbone.MAX_SEND_RETRIES_WARN = 6;

/*

Arma una cadena de ejecución sincrónica de los cambios pendientes de envío (registros dirty en el local storage) .

Supuestos, TODO y limitaciones de la version actual:
    -Para reducir la demora se debe indicar timeouts de las llamadas ajax que hace Backbone.ajaxSync
    -No hace fetch de los datos envíados para verificarlos ni para obtener la versión actualizada, los mismos se borran una vez enviados por lo tanto desps de llamarlo debería hacerse un fetch o consulta de los mismos para obtener la versión cambiada en caso de que fue exitoso.
    -Envía los cambios en el orden en que se encuentran en el local storage, no implementa ningún tipo de ordenamiento por updated_at, ni por cuando se cambiaron.
    -TODO: Dar la posibilidad a futuro de llamar en serie, las llamadas a Backbone.ajaxSync, esta impl con async.js así que es solo cambiar el tipo de funcion orquestadora y especificarlo de alguna forma.
    -No debería invocarse hasta que el callback de success sea invocado no implementa ningun tipo de bloqueo, ejecutarlo varias veces en paralelo podría llevar a resultados extraños.
    -Deja un mensaje con los resultados de la ejecución model.localStorage.pendingMsgs
    -Metodo destroy no implementado
    -TODO: sacar los max retrys a alguna configuración
    -Elimina los registros del localStorage que fueron reintentados de ser fetcheados más de N veces ( por lo tanto pisados )
    -Notifica los registros que tienen cierta cantidad de reintentos de ser enviados
    -TODO: findall() es lentísimo recorre todo el localstorage!!, crear un indice de los dirty y mantenerlo !!
*/
Backbone.cachedStorageSendDirtyChanges = function(method, model, options){

  var localStorage;
  var isModelCollection = false;

  //Si model es una coleccion
  if(model.localStorage){
     localStorage = model.localStorage;
     isModelCollection = true;
  }else if(model.collection && model.collection.localStorage)   //Simodel es un modelo
     localStorage = model.collection.localStorage;

  var sourceBackboneSuccess = options.success;
  var sourceBackboneError = options.error;
  localStorage.pendingMsgs = [];

  var localRecords = localStorage.findAll(); //TODO: lentísimo recorre todo el localstorage!!, crear un indice de los dirty y mantenerlo !!

    var functionsArray = [];
    var i=0;
    for (; i < localRecords.length;i++){

        if (localRecords[i].dirty && localRecords[i].dirty === true) {

          functionsArray.push(
              (function(i){
                  return function (callback) {  //genera una funcion dinamicamente en cada vuelta, el callback general es de async.js

                  var record = localRecords[i];
                  var isNewRec = false, continueRun = true;
                  var msg = "";
                  options = {};

                  isNewRec = (record.id && (new String(record.id).indexOf("new") >= 0)) ? true : false
                  //Chequea max retries
                  if (record.fetchRetry && record.fetchRetry >= Backbone.MAX_FETCH_RETRIES) {
                      msg = "cachedStorageSendDirtyChanges:" + localStorage.name + " " + new Date().toISOString() +  " found dirty record, fetchRetry over Backbone.MAX_FETCH_RETRIES: " + record.fetchRetry + ", deleting from localStorage record.id :" + record.id + ", record: " + JSON.stringify(record);
                      console.warn(msg);
                      localStorage.pendingMsgs.push(msg);
                      //llamada de borrado
                      localStorage.destroy(record);

                      sourceBackboneSuccess();
                      return;
                  }
                  if (record.sendRetry && record.sendRetry >= Backbone.MAX_SEND_RETRIES_WARN) {
                      msg = "cachedStorageSendDirtyChanges:" + localStorage.name + " " + new Date().toISOString() + " found dirty record, warning sendRetry over Backbone.MAX_SEND_RETRIES_WARN " + record.sendRetry + ", record.id :" + record.id + ", record: " + JSON.stringify(record);
                      localStorage.pendingMsgs.push(msg);
                      console.log(msg);
                  }

                  options.success = function (model, response, options) {
                      msg = "cachedStorageSendDirtyChanges:" + localStorage.name + " " + new Date().toISOString() + " retried succesfully dirty record.id: " + record.id + ": (isNew: " + isNewRec + ") ";
                      console.log(msg);
                      localStorage.pendingMsgs.push(msg);
                      //elimina el registro subido
                      localStorage.destroy(record);

                      callback(null, "success");

                  }

                  options.error = function (model, response, options) {
                      //Se incrementa contador de dirty
                      if (record.sendRetry) {
                          record.sendRetry += 1;
                      } else {
                          record.sendRetry = 1;
                      }
                      localStorage.update(record);

                      msg = "cachedStorageSendDirtyChanges:" + localStorage.name + " " + new Date().toISOString() + " Error retrying dirty record.id: " + record.id + ", sendRetry: " + record.sendRetry +  ", error: " + model.status + ", " + model.statusText + ", " + model.responseText;
                      localStorage.pendingMsgs.push(msg);
                      console.log(msg);

                      callback(null, "err");
                  }

                  var modelCopy = _.extend(model);
                  var methodCopy;

                   //si llego una coleccion y no un model al sync
                  if (isModelCollection) {

                      modelCopy.push(record);
                      modelCopy = modelCopy.models[modelCopy.models.length -1];

                  } else { // si llego un model
                      //crea de cero el modelo
                      modelCopy = new Backbone.Model();
                      modelCopy.url = model.url;

                      modelCopy.set(record);
                  }
                  if (isNewRec) {
                      methodCopy = 'create';
                      modelCopy.unset('id');
                  } else {
                      methodCopy = 'update';
                  }

                  //Invoca a ajaxSync para 'create' y 'update'
                  Backbone.ajaxSync.apply(this, [methodCopy, modelCopy, options]);


              }

              })(i)  );
        }
    }

    if (functionsArray && functionsArray.length > 0){

      //Se ejecutan todas las llamadas en paralelo y se invocan a un unico callback al finalizar
      async.parallel( functionsArray ,
          //async.js callback
          function (err, results) {

              console.log("cachedStorageRead:" + localStorage.name + " " + new Date().toISOString() + " SendDirtyChanges pendingMsgs: length: " + localStorage.pendingMsgs.length + ", " + localStorage.pendingMsgs );


              sourceBackboneSuccess();
          }
      );
    }else{
        console.log("cachedStorageRead:" + localStorage.name + " " + new Date().toISOString() + " SendDirtyChanges no pending changes found.");
        sourceBackboneSuccess();
    }

};


/*
  Si la colección tiene localStorage configurado, utiliza el sync de esta librería
*/
Backbone.cachedStorageSyncMethod = function(method, model, options) {

  if(model.localStorage || (model.collection && model.collection.localStorage)) {

      return Backbone.cachedStorageSync;

  }else{
    return Backbone.ajaxSync;
  }

};


// Override 'Backbone.sync' to default to localSync,
// the original 'Backbone.sync' is still available in 'Backbone.ajaxSync'
Backbone.sync = function(method, model, options) {
  return Backbone.cachedStorageSyncMethod(method, model, options).apply(this, [method, model, options]);
};

return Backbone.LocalStorage;
}));

});
