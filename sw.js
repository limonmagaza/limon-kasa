// Limon Kasa - çevrimdışı açılış. Veri (Supabase) önbelleğe alınmaz.
var V='limon-kasa-v1', CDN='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(V).then(function(c){ return c.addAll(['./','./index.html']).catch(function(){}).then(function(){ return fetch(CDN).then(function(r){ return c.put(CDN,r); }).catch(function(){}); }); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(k){ return Promise.all(k.filter(function(x){ return x!==V; }).map(function(x){ return caches.delete(x); })); }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch',function(e){
  var r=e.request; if(r.method!=='GET') return;
  var u=new URL(r.url);
  var page=u.origin===location.origin, cdn=r.url===CDN;
  if(!page && !cdn) return;   // Supabase vb: hiç dokunma
  e.respondWith(
    fetch(r).then(function(res){ if(res&&res.ok){ var cp=res.clone(); caches.open(V).then(function(c){ c.put(r,cp); }); } return res; })
    .catch(function(){ return caches.match(r).then(function(m){ return m||caches.match('./index.html')||caches.match('./'); }); })
  );
});
