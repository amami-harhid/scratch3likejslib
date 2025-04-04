module.exports = class EntityProxyExt { 
    static THREAD_ID = "threadId"
    static THREAD_COUNTER = "threadCounter"
    static IS_PROXY_TEST = "isProxyTest"
    static getProxy(obj, callback) {
        const proxy = new Proxy(obj, {
            get(target, name, receiver) {
                if (name == EntityProxyExt.THREAD_ID) {
                    return this.threadId;
                }        
                if(name == EntityProxyExt.IS_PROXY_TEST){
                    return (_=>true);
                }
                if(name == EntityProxyExt.THREAD_COUNTER){
                    return this.threadCounter;
                }
                return Reflect.get(...arguments);
            },
            set(target, name, value) {
                if(name == EntityProxyExt.THREAD_ID){
                    this.threadId = value;
                    return true;
                }
                if(name == EntityProxyExt.THREAD_COUNTER){
                    this.threadCounter = value;
                    return true;
                }
                return Reflect.set(...arguments);
            }
        });
        
        return proxy;
    }
}
