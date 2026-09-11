(() => {
"use strict";
const LR={lng:-1.1511,lat:46.1603};
const state={
 mapReady:false,framePending:false,addMode:false,pendingPlace:null,pendingWeight:2,capturedHomeId:null,captureThresholdKm:.34,
 filters:{maxRent:750,minArea:15,types:new Set(["Studio","T1","T2"]),furnished:new Set(["yes","no"]),amenities:new Set(["parking","balcony","laundry","wifi"])},
 homeStatus:new Map(),
 life:[
  {id:"school",name:"Lycée hôtelier",lat:46.1439,lng:-1.1673,weight:3,active:true,targetKm:2.4,custom:false},
  {id:"work",name:"Travail / stage",lat:46.1539,lng:-1.1392,weight:3,active:true,targetKm:2.2,custom:false},
  {id:"cinema",name:"Cinéma",lat:46.1635,lng:-1.1524,weight:2,active:true,targetKm:2.0,custom:false},
  {id:"station",name:"Gare",lat:46.1528,lng:-1.1457,weight:2,active:true,targetKm:2.1,custom:false},
  {id:"centre",name:"Vieux-Port",lat:46.1583,lng:-1.1524,weight:2,active:true,targetKm:1.8,custom:false},
  {id:"market",name:"Courses",lat:46.1671,lng:-1.1530,weight:2,active:true,targetKm:1.7,custom:false},
  {id:"sport",name:"Sport",lat:46.1510,lng:-1.1635,weight:1,active:true,targetKm:2.1,custom:false},
  {id:"beach",name:"Plage",lat:46.1395,lng:-1.1724,weight:1,active:true,targetKm:2.7,custom:false}
 ],
 homes:[
  {id:1,title:"Studio — Les Minimes",area:"Les Minimes",lat:46.1452,lng:-1.1677,price:520,sqm:19,type:"Studio",furnished:true,amenities:["wifi","laundry"],owner:"Mme R."},
  {id:2,title:"T1 — Tasdon",area:"Tasdon",lat:46.1468,lng:-1.1430,price:555,sqm:23,type:"T1",furnished:true,amenities:["parking","wifi"],owner:"M. D."},
  {id:3,title:"Studio — Saint-Nicolas",area:"Saint-Nicolas",lat:46.1570,lng:-1.1488,price:590,sqm:20,type:"Studio",furnished:false,amenities:["balcony","laundry"],owner:"Mme C."},
  {id:4,title:"T1 — La Genette",area:"La Genette",lat:46.1638,lng:-1.1715,price:610,sqm:25,type:"T1",furnished:true,amenities:["parking","balcony","wifi"],owner:"M. P."},
  {id:5,title:"Studio — Vieux-Port",area:"Centre",lat:46.1594,lng:-1.1548,price:625,sqm:18,type:"Studio",furnished:true,amenities:["wifi"],owner:"Mme B."},
  {id:6,title:"T1 — Fétilly",area:"Fétilly",lat:46.1722,lng:-1.1575,price:545,sqm:24,type:"T1",furnished:false,amenities:["parking","laundry"],owner:"M. G."},
  {id:7,title:"Studio — Villeneuve",area:"Villeneuve-les-Salines",lat:46.1503,lng:-1.1255,price:480,sqm:21,type:"Studio",furnished:true,amenities:["parking","wifi"],owner:"Mme L."},
  {id:8,title:"T1 — Port-Neuf",area:"Port-Neuf",lat:46.1661,lng:-1.1880,price:535,sqm:24,type:"T1",furnished:false,amenities:["balcony"],owner:"M. A."},
  {id:9,title:"Studio — Bongraine",area:"Bongraine",lat:46.1378,lng:-1.1556,price:500,sqm:18,type:"Studio",furnished:true,amenities:["wifi","laundry"],owner:"Mme V."},
  {id:10,title:"T1 — Centre",area:"Centre",lat:46.1628,lng:-1.1450,price:640,sqm:27,type:"T1",furnished:false,amenities:["balcony","laundry"],owner:"M. F."},
  {id:11,title:"Studio — Ville-en-Bois",area:"La Ville-en-Bois",lat:46.1526,lng:-1.1607,price:565,sqm:20,type:"Studio",furnished:true,amenities:["parking","wifi"],owner:"Mme N."},
  {id:12,title:"T1 — Rompsay",area:"Rompsay",lat:46.1667,lng:-1.1315,price:515,sqm:24,type:"T1",furnished:false,amenities:["parking"],owner:"M. S."},
  {id:13,title:"T2 — Minimes",area:"Les Minimes",lat:46.1408,lng:-1.1738,price:720,sqm:32,type:"T2",furnished:true,amenities:["parking","balcony","wifi","laundry"],owner:"Mme E."},
  {id:14,title:"T2 — Centre",area:"Marché",lat:46.1660,lng:-1.1501,price:790,sqm:35,type:"T2",furnished:false,amenities:["balcony","laundry"],owner:"M. T."},
  {id:15,title:"T1 — Mireuil",area:"Mireuil",lat:46.1745,lng:-1.1771,price:495,sqm:22,type:"T1",furnished:true,amenities:["parking","wifi"],owner:"Mme J."},
  {id:16,title:"Studio — Porte Royale",area:"Porte Royale",lat:46.1660,lng:-1.1390,price:575,sqm:17,type:"Studio",furnished:true,amenities:["wifi"],owner:"M. H."}
 ]};
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const E={scoreValue:$("#scoreValue"),scoreText:$("#scoreText"),scorePill:$("#scorePill"),maxRent:$("#maxRent"),maxRentValue:$("#maxRentValue"),minArea:$("#minArea"),minAreaValue:$("#minAreaValue"),typeFilters:$("#typeFilters"),furnishedFilters:$("#furnishedFilters"),amenityFilters:$("#amenityFilters"),lifeFilters:$("#lifeFilters"),addPlaceBtn:$("#addPlaceBtn"),visibleHomeCount:$("#visibleHomeCount"),captureCard:$("#captureCard"),captureDistance:$("#captureDistance"),captureTitle:$("#captureTitle"),captureArea:$("#captureArea"),captureMatch:$("#captureMatch"),captureRent:$("#captureRent"),captureSqm:$("#captureSqm"),captureType:$("#captureType"),captureFurnished:$("#captureFurnished"),captureAmenities:$("#captureAmenities"),ignoreBtn:$("#ignoreBtn"),interestedBtn:$("#interestedBtn"),applyBtn:$("#applyBtn"),captureNote:$("#captureNote"),interestedCount:$("#interestedCount"),appliedCount:$("#appliedCount"),crosshair:$("#crosshair"),locateBtn:$("#locateBtn"),toast:$("#toast"),filterPanel:$("#filterPanel"),filterBackdrop:$("#filterBackdrop"),mobileFiltersBtn:$("#mobileFiltersBtn"),closeFiltersBtn:$("#closeFiltersBtn"),placeModeBanner:$("#placeModeBanner"),cancelPlaceMode:$("#cancelPlaceMode"),placeModal:$("#placeModal"),placeForm:$("#placeForm"),placeNameInput:$("#placeNameInput"),importanceGrid:$("#importanceGrid"),cancelPlaceModal:$("#cancelPlaceModal")};
const poiMarkers=new Map(),homeMarkers=new Map();
const map=new maplibregl.Map({container:"map",style:"https://tiles.openfreemap.org/styles/positron",center:[LR.lng,LR.lat],zoom:13.25,minZoom:11.2,maxZoom:18.5,attributionControl:true,dragRotate:false,pitchWithRotate:false});
map.touchZoomRotate.disableRotation();

function esc(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function dist(a,b){const R=6371,dLat=(b.lat-a.lat)*Math.PI/180,dLng=(b.lng-a.lng)*Math.PI/180,lat1=a.lat*Math.PI/180,lat2=b.lat*Math.PI/180,h=Math.sin(dLat/2)**2+Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLng/2)**2;return 2*R*Math.asin(Math.sqrt(h))}
function pointScore(pt,p){const x=dist(pt,p)/p.targetKm;return 100/(1+Math.pow(x,1.45))}
function compat(pt){const active=state.life.filter(p=>p.active);if(!active.length)return 0;let s=0,t=0;active.forEach(p=>{s+=pointScore(pt,p)*p.weight;t+=p.weight});return Math.round(s/t)}
function scoreText(s){return s>=84?"excellent":s>=70?"très adapté":s>=55?"bon compromis":s>=40?"à considérer":"peu adapté"}
function passes(h){if(state.homeStatus.get(h.id)==="ignored")return false;if(h.price>state.filters.maxRent||h.sqm<state.filters.minArea)return false;if(!state.filters.types.has(h.type))return false;if(!state.filters.furnished.has(h.furnished?"yes":"no"))return false;if(h.amenities.length&&!h.amenities.some(a=>state.filters.amenities.has(a)))return false;return true}
function homes(){return state.homes.filter(passes)}
function nearest(center){return homes().map(h=>({...h,distance:dist(center,h),match:compat(h)})).sort((a,b)=>a.distance-b.distance)[0]||null}
function weightLabel(w){return["","Secondaire","Important","Indispensable"][w]}
function branchData(c){return{type:"FeatureCollection",features:state.life.filter(p=>p.active).map(p=>({type:"Feature",properties:{width:{1:1.2,2:2.3,3:3.8}[p.weight],opacity:{1:.25,2:.5,3:.82}[p.weight]},geometry:{type:"LineString",coordinates:[[c.lng,c.lat],[p.lng,p.lat]]}}))}}

function renderLife(){E.lifeFilters.innerHTML=state.life.map(p=>`<article class="life-item ${p.active?"":"off"}" data-id="${p.id}"><button class="life-toggle" data-action="toggle"></button><div class="life-main"><div class="life-name">${esc(p.name)}</div><div class="life-weight">${weightLabel(p.weight)}</div></div><div class="life-actions"><button class="weight-btn" data-action="weight">${"●".repeat(p.weight)}${"○".repeat(3-p.weight)}</button>${p.custom?'<button class="delete-btn" data-action="delete">×</button>':""}</div></article>`).join("");syncPoi();update()}
E.lifeFilters.addEventListener("click",e=>{const item=e.target.closest(".life-item"),btn=e.target.closest("button[data-action]");if(!item||!btn)return;const p=state.life.find(x=>x.id===item.dataset.id);if(!p)return;if(btn.dataset.action==="toggle")p.active=!p.active;if(btn.dataset.action==="weight")p.weight=p.weight===3?1:p.weight+1;if(btn.dataset.action==="delete"&&p.custom){state.life=state.life.filter(x=>x.id!==p.id);poiMarkers.get(p.id)?.remove();poiMarkers.delete(p.id)}renderLife()})
function chips(container,set){container.addEventListener("click",e=>{const b=e.target.closest("button[data-value]");if(!b)return;const v=b.dataset.value;if(set.has(v)){if(set.size===1)return;set.delete(v);b.classList.remove("active")}else{set.add(v);b.classList.add("active")}update()})}
chips(E.typeFilters,state.filters.types);chips(E.furnishedFilters,state.filters.furnished);chips(E.amenityFilters,state.filters.amenities);
E.maxRent.addEventListener("input",()=>{state.filters.maxRent=+E.maxRent.value;E.maxRentValue.textContent=state.filters.maxRent;update()});E.minArea.addEventListener("input",()=>{state.filters.minArea=+E.minArea.value;E.minAreaValue.textContent=state.filters.minArea;update()});
$$(".section-toggle").forEach(b=>b.addEventListener("click",()=>b.closest(".filter-section").classList.toggle("collapsed")));

function syncPoi(){if(!state.mapReady)return;state.life.forEach(p=>{if(!poiMarkers.has(p.id)){const el=document.createElement("div");el.className="poi-marker";el.innerHTML=`<span class="poi-dot"></span><span class="poi-label">${esc(p.name)}</span>`;poiMarkers.set(p.id,new maplibregl.Marker({element:el,anchor:"left"}).setLngLat([p.lng,p.lat]).addTo(map))}const m=poiMarkers.get(p.id),n=m.getElement();n.classList.toggle("off",!p.active);const lab=n.querySelector(".poi-label");if(lab)lab.textContent=p.name});[...poiMarkers.keys()].forEach(id=>{if(!state.life.some(p=>p.id===id)){poiMarkers.get(id)?.remove();poiMarkers.delete(id)}})}
function syncHomes(center){if(!state.mapReady)return;const hs=homes(),ids=new Set(hs.map(h=>h.id));E.visibleHomeCount.textContent=hs.length;hs.forEach(h=>{if(!homeMarkers.has(h.id)){const el=document.createElement("div");el.className="home-marker";el.title=h.title;el.addEventListener("click",ev=>{ev.stopPropagation();map.easeTo({center:[h.lng,h.lat],zoom:Math.max(map.getZoom(),14.4),duration:620})});homeMarkers.set(h.id,new maplibregl.Marker({element:el,anchor:"center"}).setLngLat([h.lng,h.lat]).addTo(map))}const n=homeMarkers.get(h.id).getElement(),d=dist(center,h);n.classList.toggle("strong",d<1.1);n.classList.toggle("captured",state.capturedHomeId===h.id)});[...homeMarkers.keys()].forEach(id=>{if(!ids.has(id)){homeMarkers.get(id)?.remove();homeMarkers.delete(id)}})}

function update(){if(!state.mapReady)return;const c=map.getCenter(),center={lng:c.lng,lat:c.lat},s=compat(center);E.scoreValue.textContent=s;E.scoreText.textContent=scoreText(s);E.scorePill.classList.add("pulse");clearTimeout(update.t);update.t=setTimeout(()=>E.scorePill.classList.remove("pulse"),100);map.getSource("branches")?.setData(branchData(center));const n=nearest(center);if(n&&n.distance<=state.captureThresholdKm){state.capturedHomeId=n.id;E.crosshair.classList.add("capturing");renderCapture(n)}else{state.capturedHomeId=null;E.crosshair.classList.remove("capturing");E.captureCard.hidden=true}syncHomes(center);refreshCounts()}
function renderCapture(h){E.captureCard.hidden=false;E.captureDistance.textContent=h.distance<.08?"Sous le repère":`${fmt(h.distance)} du repère`;E.captureTitle.textContent=h.title;E.captureArea.textContent=h.area;E.captureMatch.textContent=h.match;E.captureRent.textContent=`${h.price} €`;E.captureSqm.textContent=h.sqm;E.captureType.textContent=h.type;E.captureFurnished.textContent=h.furnished?"Meublé":"Non meublé";E.captureAmenities.innerHTML=h.amenities.map(a=>`<span class="amenity-tag">${({parking:"Parking",balcony:"Balcon",laundry:"Lave-linge",wifi:"Wifi"})[a]}</span>`).join("");const st=state.homeStatus.get(h.id)||"";E.interestedBtn.classList.toggle("active",st==="interested");E.applyBtn.classList.toggle("active",st==="applied");E.captureNote.textContent=st==="interested"?"Ajouté à tes visites potentielles. Le propriétaire n’est pas encore prévenu.":st==="applied"?`Candidature envoyée : ${h.owner} a été notifié automatiquement.`:"“Intéressé” l’ajoute à tes visites potentielles. “Je candidate” prévient le propriétaire."}
function current(){return state.homes.find(h=>h.id===state.capturedHomeId)||null}
E.ignoreBtn.addEventListener("click",()=>{const h=current();if(!h)return;state.homeStatus.set(h.id,"ignored");toast(`${h.title} ignoré.`);state.capturedHomeId=null;E.captureCard.hidden=true;update()})
E.interestedBtn.addEventListener("click",()=>{const h=current();if(!h)return;state.homeStatus.get(h.id)==="interested"?state.homeStatus.delete(h.id):state.homeStatus.set(h.id,"interested");toast(state.homeStatus.get(h.id)==="interested"?"Ajouté aux visites potentielles.":"Retiré des visites potentielles.");update()})
E.applyBtn.addEventListener("click",()=>{const h=current();if(!h)return;state.homeStatus.set(h.id,"applied");toast(`Candidature envoyée — ${h.owner} est notifié.`);update()})
function refreshCounts(){let i=0,a=0;state.homeStatus.forEach(s=>{if(s==="interested")i++;if(s==="applied")a++});E.interestedCount.textContent=i;E.appliedCount.textContent=a}
function fmt(km){return km<1?`${Math.round(km*1000)} m`:`${km.toFixed(1).replace(".",",")} km`}
function toast(m){E.toast.textContent=m;E.toast.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>E.toast.hidden=true,2200)}
function schedule(){if(state.framePending)return;state.framePending=true;requestAnimationFrame(()=>{state.framePending=false;update()})}
E.locateBtn.addEventListener("click",()=>{if(!navigator.geolocation)return toast("Géolocalisation indisponible.");navigator.geolocation.getCurrentPosition(p=>map.easeTo({center:[p.coords.longitude,p.coords.latitude],zoom:14.2,duration:720}),()=>toast("Position indisponible."),{enableHighAccuracy:true,timeout:8000,maximumAge:30000})})

function openFilters(){E.filterPanel.classList.add("open");E.filterBackdrop.hidden=false}function closeFilters(){E.filterPanel.classList.remove("open");E.filterBackdrop.hidden=true}E.mobileFiltersBtn?.addEventListener("click",openFilters);E.closeFiltersBtn?.addEventListener("click",closeFilters);E.filterBackdrop.addEventListener("click",closeFilters)
E.addPlaceBtn.addEventListener("click",()=>{state.addMode=true;E.placeModeBanner.hidden=false;closeFilters()});E.cancelPlaceMode.addEventListener("click",()=>{state.addMode=false;state.pendingPlace=null;E.placeModeBanner.hidden=true})
function openPlace(ll){state.pendingPlace=ll;state.pendingWeight=2;E.placeNameInput.value="";$$("#importanceGrid button").forEach(b=>b.classList.toggle("active",+b.dataset.weight===2));E.placeModal.hidden=false;setTimeout(()=>E.placeNameInput.focus(),30)}
function closePlace(){E.placeModal.hidden=true;state.addMode=false;state.pendingPlace=null;E.placeModeBanner.hidden=true}
E.importanceGrid.addEventListener("click",e=>{const b=e.target.closest("button[data-weight]");if(!b)return;state.pendingWeight=+b.dataset.weight;$$("#importanceGrid button").forEach(x=>x.classList.toggle("active",x===b))})
E.placeForm.addEventListener("submit",e=>{e.preventDefault();const name=E.placeNameInput.value.trim();if(!name||!state.pendingPlace)return;state.life.push({id:`custom-${Date.now()}`,name,lat:state.pendingPlace.lat,lng:state.pendingPlace.lng,weight:state.pendingWeight,active:true,targetKm:state.pendingWeight===3?1.6:state.pendingWeight===2?2:2.5,custom:true});closePlace();renderLife();toast(`${name} ajouté.`)})
E.cancelPlaceModal.addEventListener("click",closePlace);E.placeModal.addEventListener("click",e=>{if(e.target===E.placeModal)closePlace()})

map.on("load",()=>{state.mapReady=true;map.addSource("branches",{type:"geojson",data:{type:"FeatureCollection",features:[]}});map.addLayer({id:"branches",type:"line",source:"branches",layout:{"line-cap":"round","line-join":"round"},paint:{"line-color":"#111317","line-width":["get","width"],"line-opacity":["get","opacity"]}});(map.getStyle().layers||[]).forEach(l=>{try{const id=(l.id||"").toLowerCase();if(l.type==="symbol"&&(id.includes("poi")||id.includes("transit")||id.includes("airport")))map.setLayoutProperty(l.id,"visibility","none")}catch(_){}});renderLife();syncPoi();update()})
map.on("move",schedule);map.on("zoom",schedule);map.on("moveend",update);map.on("click",e=>{if(state.addMode)openPlace(e.lngLat)})
if("serviceWorker"in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
})();