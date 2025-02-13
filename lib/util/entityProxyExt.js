const THREAD_ID = "threadId"
const IS_PROXY_TEST = "isProxyTest"
module.exports = class EntityProxyExt { 
    static getProxy(obj, callback) {
        const proxy = new Proxy(obj, {
            get(target, name, receiver) {
                if (name == THREAD_ID) {
                    return this.threadId;
                }        
                if(name == IS_PROXY_TEST){
                    return (_=>true);
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
