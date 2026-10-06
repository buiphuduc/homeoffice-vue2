const assert=require('assert/strict');
const fs=require('fs');
const path=require('path');
const {chromium}=require('playwright');
const {createServer}=require('./seo-server');
const dist=path.join(__dirname,'..','dist');
const decodeXml=(s)=>s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&apos;/g,"'");
const meta=(html,name)=>(html.match(new RegExp('<meta name="'+name+'" content="([^"]*)"'))||[])[1];
async function main(){
  const xml=fs.readFileSync(path.join(dist,'sitemap.xml'),'utf8');
  const urls=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m)=>new URL(decodeXml(m[1])));
  assert(urls.length>0);assert.equal(new Set(urls.map((u)=>u.href)).size,urls.length);
  for(const url of urls){
    const html=fs.readFileSync(path.join(dist,decodeURIComponent(url.pathname),'index.html'),'utf8');
    assert.equal(meta(html,'robots'),'index, follow',url.pathname);
    assert(html.includes('<link rel="canonical" href="'+url.href+'">'),'canonical '+url.pathname);
    assert(meta(html,'description'),'description '+url.pathname);
    assert(html.includes('id="app"')&&!html.includes('<div id="app"></div>'),'empty '+url.pathname);
    if(url.pathname.startsWith('/san-pham/'))assert(/<h1[^>]*class="product-title"[^>]*>[^<]+<\/h1>/.test(html),'product '+url.pathname);
  }
  for(const route of ['gio-hang','thanh-toan','dat-hang-thanh-cong','yeu-thich','tim-kiem']){
    assert.equal(meta(fs.readFileSync(path.join(dist,route,'index.html'),'utf8'),'robots'),'noindex, follow');
    assert(!urls.some((u)=>u.pathname==='/'+route));
  }
  assert(!fs.readFileSync(path.join(dist,'robots.txt'),'utf8').includes('Disallow:'));
  const server=createServer(dist);await new Promise((r)=>server.listen(0,'127.0.0.1',r));
  const origin='http://127.0.0.1:'+server.address().port;let browser;
  try{
    assert.equal((await fetch(origin+'/does-not-exist')).status,404);
    const first=urls.find((u)=>u.pathname.startsWith('/san-pham/'));
    assert.equal((await fetch(origin+first.pathname)).status,200);
    browser=await chromium.launch({executablePath:process.env.SEO_CHROMIUM_PATH||undefined});
    const page=await browser.newPage();const errors=[];page.on('pageerror',(e)=>errors.push(e.message));
    await page.route('**/*',(r)=>r.request().url().startsWith(origin)?r.continue():r.request().resourceType()==='stylesheet'?r.fulfill({contentType:'text/css',body:''}):r.abort());
    const ready=()=>page.waitForFunction(()=>document.querySelector('#app')?.__vue__?.$store.state.products.loaded&&!document.querySelector('#app').__vue__.$store.state.products.loading);
    await page.goto(origin+'/danh-muc');await ready();
    const firstNames=await page.locator('.card .name').allTextContents();
    const page2=page.locator('.pagination a').filter({hasText:/^2$/});
    assert.equal(await page2.getAttribute('href'),'/danh-muc/trang/2');
    await page2.click();await page.waitForURL('**/danh-muc/trang/2');
    const secondNames=await page.locator('.card .name').allTextContents();assert.notDeepEqual(secondNames,firstNames);
    await page.reload();await ready();assert.deepEqual(await page.locator('.card .name').allTextContents(),secondNames);
    await page.goBack();await page.waitForURL('**/danh-muc');assert.deepEqual(await page.locator('.card .name').allTextContents(),firstNames);
    await page.goForward();await page.waitForURL('**/danh-muc/trang/2');
    const category=urls.find((u)=>u.pathname.startsWith('/danh-muc/nhom/')&&u.pathname.endsWith('/trang/2'));assert(category);
    await page.goto(origin+category.pathname);await ready();assert.equal(await page.locator('[aria-current="page"]').innerText(),'2');
    const cat=decodeURIComponent(category.pathname).replace('/danh-muc/nhom/','').replace('/trang/2','');
    await page.goto(origin+'/danh-muc?cat='+encodeURIComponent(cat)+'&page=2');await ready();await page.waitForURL('**'+category.pathname);
    await page.goto(origin+'/tim-kiem?q=ban');await ready();assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'),'noindex, follow');
    await page.locator('.filter-box input').last().check();await page.waitForURL('**/danh-muc');
    assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'),'index, follow');
    await page.goto(origin+first.pathname+'?utm_source=test&fbclid=example');await ready();assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),first.href);
    await page.goto(origin+'/danh-muc');await ready();
    for(const width of [1440,390]){
      await page.setViewportSize({width,height:900});
      const metrics=await page.evaluate(()=>{
        const link=document.querySelector('.pagination a'),previous=document.querySelector('.pagination button'),reference=previous.cloneNode(true);
        reference.disabled=false;previous.parentNode.append(reference);
        const keys=['width','height','borderRadius','fontFamily','fontSize','fontWeight'];
        const take=(e)=>Object.fromEntries(keys.map((k)=>[k,getComputedStyle(e)[k]]));
        const result={link:take(link),button:take(reference),overflow:document.documentElement.scrollWidth>innerWidth};reference.remove();return result;
      });
      for(const key of ['width','height','borderRadius','fontFamily','fontSize','fontWeight'])assert.equal(metrics.link[key],metrics.button[key],width+'px '+key);
      assert.equal(metrics.overflow,false);
    }
    assert.deepEqual(errors,[]);
    console.log('PASS: '+urls.length+' prerendered pages; sitemap, canonical, noindex, HTTP 404, pagination/reload/history, legacy URLs, tracking params, desktop/mobile styles.');
  }finally{if(browser)await browser.close();await new Promise((r)=>server.close(r));}
}
main().catch((e)=>{console.error(e);process.exitCode=1;});
