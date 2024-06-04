const fetchMiddleware = () => {
    self.addEventListener('fetch', function(event) {
        event.respondWith(
            (async function() {
                const tokenAqui = await dbGet('token');  
                const headers = new Headers(event.request.headers);
               headers.append('Authorization', `Bearer ${tokenAqui.token}`);
                
                const requisicaoModificada= new Request(event.request, {
                    method: event.request.method,
                    headers: headers,
                    body: event.request.body
                });
    
                const requisicaoCache= await caches.match(requisicaoModificada);
                if (requisicaoCache) {
                    return requisicaoCache;
                }
    
                const requisicaoRede= await fetch(requisicaoModificada);
                const cache = await caches.open(CACHE_NAME);
    
                cache.put(event.request, requisicaoRede.clone());  
                return requisicaoRede;
            })()
        );
    });
}

export const middlewares = {
    private: {
        fetch: fetchMiddleware
    }
}