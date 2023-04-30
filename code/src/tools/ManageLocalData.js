export function storeLocalData(key,value){
    localStorage.setItem(key,value);
}

export function getLocalData(key){
    return localStorage.getItem(key);
}
