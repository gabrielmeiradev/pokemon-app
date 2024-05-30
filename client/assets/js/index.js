const fetchMiddleware = () => {
    self.addEventListener('fetch', function(event) {
        event.respondWith(
            (async function() {
                const tokenAqui = await dbGet('token');  
                const headers = new Headers(event.request.headers);
               headers.append('Authorization', `Bearer ${tokenAqui.token}`);
                
    
                // altera a requisição para incluir o token
                const requisicaoModificada= new Request(event.request, {
                    method: event.request.method,
                    headers: headers,
                    body: event.request.body
                });
    
                // busca os recursos do cache
                const requisicaoCache= await caches.match(requisicaoModificada);
                if (requisicaoCache) {
                    return requisicaoCache;
                }
    
                 // busca os recursos da rede
                const requisicaoRede= await fetch(requisicaoModificada);
                const cache = await caches.open(CACHE_NAME);
    
               // atualiza os recursos no cache
                cache.put(event.request, requisicaoRede.clone());  
                return requisicaoRede;
            })()
        );
    });
}

export const loadDependencies = () => {
    fetchMiddleware();
}