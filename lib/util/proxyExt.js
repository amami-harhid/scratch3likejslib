module.exports = class ProxyExt{
    
    static getProxy(obj, callback) {
        const proxy = new Proxy(obj, {
            get(target, name) {
                if (name in target) {
                    return target[name];
                }else{
                    if(name in this) {
                        return this[name];
                    }
                    callback(target, name);
                }        
            }
        });
        return proxy;
    }
}
