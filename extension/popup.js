const DB_NAME = "vaultclip";
const DB_VERSION = 1;
const STORE = "handles";
const HANDLE_KEY = "vault";

const el = {
  pickVault: document.getElementById("pickVault"),
  vaultStatus: document.getElementById("vaultStatus"),
  subfolder: document.getElementById("subfolder"),
  summaryChars: document.getElementById("summaryChars"),
  embedPdf: document.getElementById("embedPdf"),
  saveBoth: document.getElementById("saveBoth"),
  status: document.getElementById("status"),
};

function setBusy(v) {
  el.pickVault.disabled = v;
  el.saveBoth.disabled = v;
}
function status(msg, err=false) {
  el.status.textContent = msg;
  el.status.style.color = err ? "#cf222e" : "#0969da";
}
function openDb() {
  return new Promise((resolve,reject)=>{
    const req=indexedDB.open(DB_NAME,DB_VERSION);
    req.onupgradeneeded=()=>{
      if(!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE);
    };
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error);
  });
}
async function dbPut(key,value){
  const db=await openDb();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(STORE,"readwrite");
    tx.objectStore(STORE).put(value,key);
    tx.oncomplete=resolve;
    tx.onerror=()=>reject(tx.error);
  });
}
async function dbGet(key){
  const db=await openDb();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(STORE,"readonly");
    const req=tx.objectStore(STORE).get(key);
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error);
  });
}
async function getVault({request=false}={}){
  const h=await dbGet(HANDLE_KEY);
  if(!h) return null;
  const opts={mode:"readwrite"};
  let p=await h.queryPermission(opts);
  if(p!=="granted" && request) p=await h.requestPermission(opts);
  return p==="granted" ? h : null;
}
async function refreshBadge(){
  try{
    const h=await getVault();
    if(h){
      el.vaultStatus.textContent=h.name;
      el.vaultStatus.classList.remove("bad");
      status(`Vault 연결됨: ${h.name}`);
    }else{
      const stored=await dbGet(HANDLE_KEY);
      el.vaultStatus.textContent=stored ? "권한 재확인" : "미선택";
      el.vaultStatus.classList.add("bad");
    }
  }catch(_){}
}

el.pickVault.addEventListener("click",async()=>{
  try{
    setBusy(true);
    if(!window.showDirectoryPicker) throw new Error("이 Chrome에서는 폴더 선택 API를 사용할 수 없습니다.");
    const h=await window.showDirectoryPicker({mode:"readwrite"});
    await dbPut(HANDLE_KEY,h);
    el.vaultStatus.textContent=h.name;
    el.vaultStatus.classList.remove("bad");
    status(`Vault 선택 완료: ${h.name}`);
  }catch(e){
    if(e?.name!=="AbortError") status("오류: "+(e?.message||e),true);
  }finally{setBusy(false)}
});

chrome.storage.local.get(["subfolder","summaryChars","embedPdf"],cfg=>{
  if(cfg.subfolder) el.subfolder.value=cfg.subfolder;
  if(cfg.summaryChars) el.summaryChars.value=String(cfg.summaryChars);
  if(typeof cfg.embedPdf==="boolean") el.embedPdf.checked=cfg.embedPdf;
});

function sanitizeSubfolder(s){
  return String(s||"WebClip").replace(/\\/g,"/").split("/")
    .map(x=>x.replace(/[<>:"|?*\x00-\x1F]/g,"_").trim()).filter(Boolean).join("/")||"WebClip";
}
function sanitizeFilename(s){
  return String(s||"webpage").replace(/[\\/:*?"<>|\x00-\x1F]/g,"_").replace(/\s+/g," ").trim().slice(0,140)||"webpage";
}
function stamp(d=new Date()){
  const p=n=>String(n).padStart(2,"0");
  return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}
function localTime(d=new Date()){
  const p=n=>String(n).padStart(2,"0");
  return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}
async function ensureDir(root,path){
  let cur=root;
  for(const part of String(path).split("/").filter(Boolean)){
    cur=await cur.getDirectoryHandle(part,{create:true});
  }
  return cur;
}
async function writeFile(dir,name,data){
  const fh=await dir.getFileHandle(name,{create:true});
  const wr=await fh.createWritable();
  await wr.write(data);
  await wr.close();
}
async function uniqueName(dir,base,ext){
  for(let i=0;i<1000;i++){
    const n=`${base}${i?`_${i}`:""}.${ext}`;
    try{await dir.getFileHandle(n,{create:false})}catch{return n}
  }
  throw new Error("고유 파일명을 만들지 못했습니다.");
}

async function extractSummary(tabId,maxChars){
  const [{result}]=await chrome.scripting.executeScript({
    target:{tabId},
    args:[maxChars],
    func:(maxChars)=>{
      const title=document.title||location.hostname;
      const meta=[
        'meta[name="description"]',
        'meta[property="og:description"]',
        'meta[name="twitter:description"]'
      ].map(s=>document.querySelector(s)?.content?.trim()).find(Boolean)||"";

      const root=document.querySelector("article")||document.querySelector("main")||document.body;
      const paras=Array.from(root.querySelectorAll("p"))
        .map(p=>(p.innerText||"").replace(/\s+/g," ").trim())
        .filter(t=>t.length>=45);

      const chunks=[];
      if(meta) chunks.push(meta);
      for(const p of paras){
        if(chunks.join("\n\n").length>=maxChars) break;
        if(!chunks.some(x=>x===p)) chunks.push(p);
      }
      let summary=chunks.join("\n\n").trim();
      if(!summary) summary=(root.innerText||"").replace(/\s+/g," ").trim();
      if(summary.length>maxChars){
        summary=summary.slice(0,maxChars).replace(/\s+\S*$/,"").trim()+"…";
      }
      return {title,summary};
    }
  });
  return result;
}

async function printToPdf(tabId){
  const target={tabId};
  let attached=false;
  try{
    await chrome.debugger.attach(target,"1.3");
    attached=true;
    await chrome.debugger.sendCommand(target,"Page.enable");
    const r=await chrome.debugger.sendCommand(target,"Page.printToPDF",{
      printBackground:true,
      preferCSSPageSize:true,
      displayHeaderFooter:false,
      marginTop:0.35,
      marginBottom:0.35,
      marginLeft:0.35,
      marginRight:0.35
    });
    if(!r?.data) throw new Error("PDF 생성에 실패했습니다.");
    return r.data;
  }finally{
    if(attached){try{await chrome.debugger.detach(target)}catch(_){}}
  }
}

el.saveBoth.addEventListener("click",async()=>{
  setBusy(true);
  try{
    const vault=await getVault({request:true});
    if(!vault) throw new Error("Vault 쓰기 권한을 허용해주세요.");

    const [tab]=await chrome.tabs.query({active:true,currentWindow:true});
    if(!tab?.id || !/^https?:/i.test(tab.url||"")) throw new Error("일반 웹페이지(http/https)에서 실행해주세요.");

    const subfolder=sanitizeSubfolder(el.subfolder.value);
    const summaryChars=Number(el.summaryChars.value)||900;
    const embedPdf=el.embedPdf.checked;
    await chrome.storage.local.set({subfolder,summaryChars,embedPdf});

    status("페이지 요약 추출 중...");
    const page=await extractSummary(tab.id,summaryChars);
    if(!page) throw new Error("페이지 정보를 읽지 못했습니다.");

    const now=new Date();
    const base=sanitizeFilename(page.title)+"__"+stamp(now);

    const clipDir=await ensureDir(vault,subfolder);
    const pdfDir=await ensureDir(clipDir,"_archive/pdf");

    status("PDF 생성 중...");
    const b64=await printToPdf(tab.id);
    const pdfName=await uniqueName(pdfDir,base,"pdf");
    const pdfBytes=Uint8Array.from(atob(b64),c=>c.charCodeAt(0));
    await writeFile(pdfDir,pdfName,pdfBytes);

    const pdfWikiPath=`${subfolder}/_archive/pdf/${pdfName}`;
    const mdName=await uniqueName(clipDir,base,"md");

    const md =
`# ${page.title}

- 저장 시간: ${localTime(now)}

## 요약

${page.summary || "요약을 추출하지 못했습니다."}

## PDF

${embedPdf ? `![[${pdfWikiPath}]]` : `[[${pdfWikiPath}]]`}
`;

    status("요약 노트 저장 중...");
    await writeFile(clipDir,mdName,md);

    status(`저장 완료
MD: ${subfolder}/${mdName}
PDF: ${pdfWikiPath}`);
  }catch(e){
    status("오류: "+(e?.message||String(e)),true);
  }finally{
    setBusy(false);
  }
});

refreshBadge();
