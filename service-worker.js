/* service-worker.js */
const CACHE_NAME='space-quiz-v4';
const CORE_ASSETS=[
  './',
  './index.html',
  './neutral-expression.png',
  './happy-expression.png',
  './encouraging-expression.png',
  './Uncharted Worlds.mp3'
];
self.addEventListener('install',e=>{
 e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(CORE_ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
 e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k===CACHE_NAME?null:caches.delete(k)))) .then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
 const req=e.request;
 if(req.method!=='GET')return;
 const url=new URL(req.url);
 if(req.mode==='navigate'){
   e.respondWith(fetch(req).catch(()=>caches.match('./index.html')));
   return;
 }
 if(url.origin!==location.origin)return;
 e.respondWith(caches.match(req).then(cached=>{
   if(cached)return cached;
   return fetch(req).then(res=>{
     if(!res||res.status!==200||res.type!=='basic')return res;
     const clone=res.clone();
     caches.open(CACHE_NAME).then(c=>c.put(req,clone));
     return res;
   }).catch(()=>undefined);
 }));
});
