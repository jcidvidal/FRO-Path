export const storage = {
    get: <T>(key: string): T | null =>{
        try{
            const raw = localStorage.getItem(key);
            if(raw === null) return null;
            return JSON.parse(raw) as T;
        }catch{
            return null;
        }
    },

    set: (key: string, value: unknown): void =>{
        try{
            localStorage.setItem(key, JSON.stringify(value));
        }catch(error){
        console.error('error al guardar en localStorage:', error);
        }
    },
    remove: (key: string): void =>{
        try{
            localStorage.removeItem(key);
        }catch(error){
            console.log('error al eliminar del localStorage: ', error);
        }
    }
}