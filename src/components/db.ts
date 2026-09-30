const DB_NAME="yourChoiceDB";
const DB_VERSION=3;
const STORE_NAMES={
    movie:"movieRecords",
    comic:"comicRecords",
} as const;

type NewDatas={
    title:string;
    tags:string[];
    modelNumber:string;
    url:string;
    imgFile:File;
}
type SavedDatas=NewDatas & {
    id:number;
}
export async function handleAddRecord<T>(datas:T,recordName:string):Promise<IDBValidKey>{
    
    const db=await opneDB();
    return addRecord(datas,recordName,db);
}

function opneDB():Promise<IDBDatabase>{
    return new Promise((resolve,reject)=>{
        const request=indexedDB.open(DB_NAME,DB_VERSION);
        
        request.onupgradeneeded=()=>{
            const db=request.result;
            if(!db.objectStoreNames.contains(STORE_NAMES.movie)){
                db.createObjectStore(STORE_NAMES.movie,{
                    keyPath:"id",
                    autoIncrement:true,
                })
            }
            if(!db.objectStoreNames.contains(STORE_NAMES.comic)){
                db.createObjectStore(STORE_NAMES.comic,{
                    keyPath:"id",
                    autoIncrement:true,
                })
            }
        };
        request.onsuccess=()=>{
            resolve(request.result);
        };
        request.onerror=()=>{
            reject(request.error);
        };
    })
}
function addRecord<T>(datas:T,recordName:string,db:IDBDatabase):Promise<IDBValidKey>{
    return new Promise((resolve,reject)=>{
        const transaction=db.transaction(recordName,"readwrite");
        const store=transaction.objectStore(recordName);
        const getRequest=store.add(datas);

        getRequest.onsuccess=()=>{
            resolve(getRequest.result)
        }
        getRequest.onerror=()=>{
            reject(getRequest.error);
        }
    });

}
export async function handleGetRecords<T>(recordName:string):Promise<T[]>{
    const db=await opneDB();
    return getRecords<T>(recordName,db);
}
function getRecords<T>(recordName:string,db:IDBDatabase):Promise<T[]>{
    return new Promise((resolve,reject)=>{
        const transaction=db.transaction(recordName, "readonly");
        const store=transaction.objectStore(recordName);
        const getRequest=store.getAll();

        getRequest.onsuccess=()=>{
            resolve(getRequest.result);
        }
        getRequest.onerror=()=>{
            reject(getRequest.error);
        }
    })
}
export async function deleteRecord(recordName:string,id:number){
    const db=await opneDB();
    return new Promise((resolve,reject)=>{
        const transaction=db.transaction(recordName,"readwrite");
        const store=transaction.objectStore(recordName);
        const getRequest=store.delete(id);
        
        getRequest.onsuccess=()=>{
            resolve(getRequest.result);
        }
        getRequest.onerror=()=>{
            reject(getRequest.error);
        }
    })
}
export async function updateRecord(datas:NewDatas,id:number,recordName:string){
    const data:SavedDatas={...datas,id:id}
    const db=await opneDB();
    return new Promise((resolve,reject)=>{
        const transaction=db.transaction(recordName,"readwrite");
        const store=transaction.objectStore(recordName);
        const getRequest=store.put(data)
        
        getRequest.onsuccess=()=>{
            resolve(getRequest.result);
        }
        getRequest.onerror=()=>{
            reject(getRequest.error);
        }
    })
}