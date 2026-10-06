const http = require('http');
const fs = require('fs');
const path = require('path');
const types = { '.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.csv':'text/csv; charset=utf-8','.xml':'application/xml','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain' };
function createServer(directory, { prerender = false } = {}) {
  const root = path.resolve(directory);
  return http.createServer((req,res) => {
    let pathname;
    try { pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname); } catch (_) { res.writeHead(400);res.end();return; }
    let file=path.resolve(root,`.${pathname}`);
    if(file!==root&&!file.startsWith(`${root}${path.sep}`)){res.writeHead(403);res.end();return;}
    if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
    let status=200;
    if(!fs.existsSync(file)||!fs.statSync(file).isFile()){file=path.join(root,prerender?'index.html':'404.html');status=prerender?200:404;}
    if(!fs.existsSync(file)){res.writeHead(404);res.end();return;}
    res.writeHead(status,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});
    fs.createReadStream(file).pipe(res);
  });
}
module.exports={createServer};
if(require.main===module){const port=Number(process.env.PORT||4173);createServer(path.join(__dirname,'..','dist')).listen(port,'127.0.0.1',()=>console.log(`SEO preview: http://127.0.0.1:${port}`));}
