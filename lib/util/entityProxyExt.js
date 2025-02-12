const THREAD_ID = "threadId"
module.exports = class EntityProxyExt { 
    static getProxy(obj, callback) {
        const proxy = new Proxy(obj, {
            get(target, name, receiver) {
                if (name == THREAD_ID) {
                    return this.threadId;
                }        
                return Reflect.get(...arguments);
            },
            set(target, name, value) {
                if(name == THREAD_ID){
                    this.threadId = value;
                    return true;
                }
                return Reflect.set(...arguments);
            }
        });
        
        return proxy;
    }
}
