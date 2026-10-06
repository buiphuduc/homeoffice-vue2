const fs=require('fs');
const path=require('path');
const crypto=require('crypto');
const {spawnSync}=require('child_process');
const axios=require('axios');
const Papa=require('papaparse');
const {chromium}=require('playwright');
const Service=require('@vue/cli-service');
const {createServer}=require('./seo-server');
const {generateSitemap}=require('./generate-sitemap');
const root=path.join(__dirname,'..');
const output=path.join(root,'dist');
function outputFile(route){
  const segments=route.split('/').filter(Boolean).map(decodeURIComponent);
  if(segments.some((segment)=>segment==='.'||segment==='..'||segment.includes('\\')||segment.includes('\0')))throw new Error('Unsupported route segment: '+route);
  return path.join(output,...segments,'index.html');
}
async function readCatalog(source){
  if(!source)throw new Error('Set VUE_APP_SHEET_CSV_URL in .env before building.');
  let csv;
  if(source.startsWith('https://')||source.startsWith('http://'))csv=(await axios.get(source,{timeout:60000,responseType:'text'})).data;
  else{const base=path.join(root,'public');const relative=source.startsWith('/')?source.slice(1):source;const local=path.resolve(base,relative);if(!local.startsWith(base+path.sep))throw new Error('CSV must be inside public/.');csv=fs.readFileSync(local,'utf8');}
  if(typeof csv!=='string')throw new Error('CSV source did not return text.');
  const parsed=Papa.parse(csv,{header:true,skipEmptyLines:true});
  if(parsed.errors.length||!['SKU','Name','Published'].every((field)=>(parsed.meta.fields||[]).includes(field)))throw new Error('Invalid product CSV: require SKU, Name, Published and valid CSV rows.');
  return csv;
}
function noindexShell(shell){return shell.replace('</head>','<meta name="robots" content="noindex, follow"></head>');}
async function main(){
  process.env.NODE_ENV='production';
  const service=new Service(root);
  service.loadEnv('production');service.loadEnv();
  const configuredUrl=process.env.VUE_APP_SITE_URL||'https://htmvn.com';
  const siteUrl=configuredUrl.endsWith('/')?configuredUrl.slice(0,-1):configuredUrl;
  const site=new URL(siteUrl);
  if(!['https:','http:'].includes(site.protocol)||site.pathname!=='/'||site.search||site.hash)throw new Error('VUE_APP_SITE_URL must be a domain root, e.g. https://example.com');
  const csv=await readCatalog(process.env.VUE_APP_SHEET_CSV_URL);
  const hash=crypto.createHash('sha256').update(csv).digest('hex').slice(0,12);
  const catalogPath='/data/seo-products-'+hash+'.csv';
  const build=spawnSync(process.execPath,[require.resolve('@vue/cli-service/bin/vue-cli-service'),'build'],{cwd:root,stdio:'inherit',env:{...process.env,VUE_APP_SHEET_CSV_URL:catalogPath,VUE_APP_SITE_URL:siteUrl}});
  if(build.status!==0)throw new Error('Vue build failed.');
  fs.mkdirSync(path.join(output,'data'),{recursive:true});fs.writeFileSync(path.join(output,catalogPath),csv);
  const shell=fs.readFileSync(path.join(output,'index.html'),'utf8');
  const server=createServer(output,{prerender:true});
  await new Promise((resolve)=>server.listen(0,'127.0.0.1',resolve));
  const origin='http://127.0.0.1:'+server.address().port;
  let browser;
  try{
    browser=await chromium.launch({headless:true,executablePath:process.env.SEO_CHROMIUM_PATH||undefined});
    const page=await browser.newPage({viewport:{width:1440,height:1000}});
    const errors=[];page.on('pageerror',(error)=>errors.push(error.message));
    await page.route('**/*',(route)=>{
      if(route.request().url().startsWith(origin))return route.continue();
      if(route.request().resourceType()==='stylesheet')return route.fulfill({contentType:'text/css',body:''});
      return route.abort();
    });
    await page.addInitScript(()=>{window.__SEO_PRERENDER__=true;});
    await page.goto(origin,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>window.__SEO_RENDER__,{timeout:60000});
    const paths=await page.evaluate(()=>window.__SEO_RENDER__.paths);
    for(let i=0;i<paths.length;i++){
      const route=paths[i];
      const actual=await page.evaluate((target)=>window.__SEO_RENDER__.navigate(target),route);
      if(actual!==route)throw new Error('Unexpected redirect: '+route+' -> '+actual);
      const html=await page.evaluate(()=>{
        const clone=document.documentElement.cloneNode(true);
        clone.querySelectorAll('.reveal-init').forEach((el)=>el.classList.remove('reveal-init','is-revealed'));
        clone.querySelectorAll('link[rel="prefetch"]').forEach((el)=>el.remove());
        return '<!DOCTYPE html>\n'+clone.outerHTML;
      });
      if(errors.length)throw new Error('Rendering '+route+': '+errors.join('; '));
      if(!html.includes('name="robots" content="index, follow"'))throw new Error('Indexable page became noindex: '+route);
      const file=outputFile(route);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,html);
      if((i+1)%50===0||i===paths.length-1)console.log('Prerender '+(i+1)+'/'+paths.length);
    }
    for(const route of ['/gio-hang','/thanh-toan','/dat-hang-thanh-cong','/yeu-thich','/tim-kiem']){
      const file=outputFile(route);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,noindexShell(shell));
    }
    fs.writeFileSync(path.join(output,'404.html'),noindexShell(shell));
    generateSitemap(output,siteUrl,paths);
    console.log('SEO build complete: '+paths.length+' HTML pages and matching sitemap.');
  }finally{if(browser)await browser.close();await new Promise((resolve)=>server.close(resolve));}
}
main().catch((error)=>{console.error(error);process.exitCode=1;});
