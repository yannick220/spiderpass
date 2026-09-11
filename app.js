(() => {
"use strict";

const LR={lng:-1.1511,lat:46.1603};
const ROUTER="https://valhalla1.openstreetmap.de/route";
const map=new maplibregl.Map({
  container:"map",
  style:"https://tiles.openfreemap.org/styles/positron",
  center:[LR.lng,LR.lat],
  zoom:13.25,
  minZoom:11.2,
  maxZoom:18.5,
  attributionControl:true,
  dragRotate:false,
  pitchWithRotate:false
});
map.touchZoomRotate.disableRotation();

const state={
  mapReady:false,framePending:false,lockedHomeId:null,lastCapturedId:null,captureThresholdKm:.25,
  addMode:false,pendingPlace:null,pendingWeight:2,pendingMode:"pedestrian",
  routeRequestToken:0,
  filters:{
    maxRent:750,minArea:15,
    types:new Set(["Studio","T1","T2"]),
    furnished:new Set(["yes","no"]),
    amenities:new Set(["parking","balcony","laundry","wifi"])
  },
  status:new Map(),
  life:[
    {id:"school",name:"Lycée hôtelier",lat:46.1439,lng:-1.1673,weight:3,active:true,targetMin:15,mode:"bicycle",custom:false},
    {id:"work",name:"Travail / stage",lat:46.1539,lng:-1.1392,weight:3,active:true,targetMin:20,mode:"auto",custom:false},
    {id:"cinema",name:"Cinéma",lat:46.1635,lng:-1.1524,weight:2,active:true,targetMin:15,mode:"pedestrian",custom:false},
    {id:"station",name:"Gare",lat:46.1528,lng:-1.1457,weight:2,active:true,targetMin:15,mode:"bicycle",custom:false},
    {id:"market",name:"Courses",lat:46.1671,lng:-1.1530,weight:2,active:true,targetMin:10,mode:"pedestrian",custom:false},
    {id:"sport",name:"Sport",lat:46.1510,lng:-1.1635,weight:1,active:true,targetMin:15,mode:"bicycle",custom:false}
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
    {id:11,title:"T2 — Minimes",area:"Les Minimes",lat:46.1408,lng:-1.1738,price:720,sqm:32,type:"T2",furnished:true,amenities:["parking","balcony","wifi","laundry"],owner:"Mme E."},
    {id:12,title:"T2 — Centre",area:"Marché",lat:46.1660,lng:-1.1501,price:790,sqm:35,type:"T2",furnished:false,amenities:["balcony","laundry"],owner:"M. T."}
  ]
};

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const el={
  scoreValue:$("#scoreValue"),scoreText:$("#scoreText"),rentRange:$("#rentRange"),rentValue:$("#rentValue"),
  areaRange:$("#areaRange"),areaValue:$("#areaValue"),typeFilters:$("#typeFilters"),furnishedFilters:$("#furnishedFilters"),
  amenityFilters:$("#amenityFilters"),lifeList:$("#lifeList"),visibleCount:$("#visibleCount"),lockState:$("#lockState"),
  target:$("#centerTarget"),homeCard:$("#homeCard"),homeDistanceLabel:$("#homeDistanceLabel"),homeTitle:$("#homeTitle"),
  homeArea:$("#homeArea"),homeScore:$("#homeScore"),homeRent:$("#homeRent"),homeSqm:$("#homeSqm"),homeType:$("#homeType"),
  homeFurnished:$("#homeFurnished"),homeAmenities:$("#homeAmenities"),homeNote:$("#homeNote"),ignoreBtn:$("#ignoreBtn"),
  interestBtn:$("#interestBtn"),applyBtn:$("#applyBtn"),interestedCount:$("#interestedCount"),appliedCount:$("#appliedCount"),
  routeInfo:$("#routeInfo"),routeInfoMode:$("#routeInfoMode"),routeInfoTitle:$("#routeInfoTitle"),routeInfoTime:$("#routeInfoTime"),
  routeInfoDistance:$("#routeInfoDistance"),toast:$("#toast"),flash:$("#flash"),locateBtn:$("#locateBtn"),
  filterPanel:$("#filterPanel"),filterBackdrop:$("#filterBackdrop"),mobileFiltersBtn:$("#mobileFiltersBtn"),
  closeFiltersBtn:$("#closeFiltersBtn"),addPlaceBtn:$("#addPlaceBtn"),placeMode:$("#placeMode"),
  cancelPlaceMode:$("#cancelPlaceMode"),placeModal:$("#placeModal"),placeForm:$("#placeForm"),placeName:$("#placeName"),
  importancePicker:$("#importancePicker"),modePicker:$("#modePicker"),cancelPlaceModal:$("#cancelPlaceModal")
};
const poiMarkers=new Map();
let audioCtx=null;

function esc(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function distanceKm(a,b){
  const R=6371,dLat=(b.lat-a.lat)*Math.PI/180,dLng=(b.lng-a.lng)*Math.PI/180,la1=a.lat*Math.PI/180,la2=b.lat*Math.PI/180;
  const h=Math.sin(dLat/2)**2+Math.cos(la1)*Math.cos(la2)*Math.sin(dLng/2)**2;
  return 2*R*Math.asin(Math.sqrt(h));
}
function modeLabel(m){return m==="pedestrian"?"À pied":m==="bicycle"?"Vélo":"Voiture"}
function amenityLabel(a){return ({parking:"Parking",balcony:"Balcon",laundry:"Lave-linge",wifi:"Wifi"})[a]||a}
function weightLabel(w){return ["","Secondaire","Important","Indispensable"][w]}
function straightMinutes(km,mode){const speed=mode==="pedestrian"?4.7:mode==="bicycle"?15:32;return Math.max(1,Math.round(km/speed*60))}
function pointCompatibility(point){
  const active=state.life.filter(p=>p.active);if(!active.length)return 0;
  let sum=0,w=0;
  active.forEach(p=>{
    const km=distanceKm(point,p),min=straightMinutes(km,p.mode),ratio=min/p.targetMin,score=100/(1+Math.pow(ratio,1.55));
    sum+=score*p.weight;w+=p.weight;
  });
  return Math.round(sum/w);
}
function scoreText(v){return v>=84?"Excellent équilibre":v>=70?"Très bien placé":v>=55?"Bon compromis":v>=40?"À considérer":"Peu adapté"}
function passes(home){
  if(state.status.get(home.id)==="ignored")return false;
  if(home.price>state.filters.maxRent||home.sqm<state.filters.minArea)return false;
  if(!state.filters.types.has(home.type))return false;
  if(!state.filters.furnished.has(home.furnished?"yes":"no"))return false;
  if(home.amenities.length&&!home.amenities.some(a=>state.filters.amenities.has(a)))return false;
  return true;
}
function filteredHomes(){return state.homes.filter(passes)}
function homeGeoJSON(){
  return {type:"FeatureCollection",features:filteredHomes().map(h=>({type:"Feature",properties:{id:h.id,match:pointCompatibility(h)},geometry:{type:"Point",coordinates:[h.lng,h.lat]}}))}
}
function nearestHome(center){
  return filteredHomes().map(h=>({...h,distance:distanceKm(center,h),match:pointCompatibility(h)})).sort((a,b)=>a.distance-b.distance)[0]||null;
}
function currentHome(){return state.homes.find(h=>h.id===state.lockedHomeId)||null}
function lineWidth(w){return ({1:1.1,2:2.1,3:3.5})[w]||2}
function lineOpacity(w){return ({1:.24,2:.48,3:.78})[w]||.5}
function straightRoutes(center){
  return {type:"FeatureCollection",features:state.life.filter(p=>p.active).map(p=>({
    type:"Feature",
    properties:{id:p.id,name:p.name,mode:p.mode,width:lineWidth(p.weight),opacity:lineOpacity(p.weight),minutes:straightMinutes(distanceKm(center,p),p.mode),distance:distanceKm(center,p)},
    geometry:{type:"LineString",coordinates:[[center.lng,center.lat],[p.lng,p.lat]]}
  }))}
}
function renderLife(){
  el.lifeList.innerHTML=state.life.map(p=>`
    <article class="life-item ${p.active?"on":""}" data-id="${p.id}">
      <div class="life-main">
        <button class="life-toggle" data-action="toggle" aria-label="${p.active?"Désactiver":"Activer"}"></button>
        <div class="life-copy"><strong>${esc(p.name)}</strong><small>${weightLabel(p.weight)} · ${modeLabel(p.mode)}</small></div>
        <div class="life-actions">
          <button data-action="weight">${"●".repeat(p.weight)}${"○".repeat(3-p.weight)}</button>
          ${p.custom?'<button data-action="delete" class="delete">×</button>':""}
        </div>
      </div>
      <div class="mode-switch">
        <button data-action="mode" data-mode="pedestrian" class="${p.mode==="pedestrian"?"active":""}">À pied</button>
        <button data-action="mode" data-mode="bicycle" class="${p.mode==="bicycle"?"active":""}">Vélo</button>
        <button data-action="mode" data-mode="auto" class="${p.mode==="auto"?"active":""}">Voiture</button>
      </div>
    </article>`).join("");
  syncPoiMarkers();updateScene(false);
}
el.lifeList.addEventListener("click",e=>{
  const item=e.target.closest(".life-item"),btn=e.target.closest("button[data-action]");if(!item||!btn)return;
  const p=state.life.find(x=>x.id===item.dataset.id);if(!p)return;
  if(btn.dataset.action==="toggle")p.active=!p.active;
  if(btn.dataset.action==="weight")p.weight=p.weight===3?1:p.weight+1;
  if(btn.dataset.action==="mode")p.mode=btn.dataset.mode;
  if(btn.dataset.action==="delete"&&p.custom){state.life=state.life.filter(x=>x.id!==p.id);poiMarkers.get(p.id)?.remove();poiMarkers.delete(p.id)}
  renderLife();
});
function bindSet(container,set){
  container.addEventListener("click",e=>{
    const b=e.target.closest("button[data-value]");if(!b)return;const v=b.dataset.value;
    if(set.has(v)){if(set.size===1)return;set.delete(v);b.classList.remove("active")}else{set.add(v);b.classList.add("active")}
    updateScene(false);
  });
}
bindSet(el.typeFilters,state.filters.types);bindSet(el.furnishedFilters,state.filters.furnished);bindSet(el.amenityFilters,state.filters.amenities);
el.rentRange.addEventListener("input",()=>{state.filters.maxRent=+el.rentRange.value;el.rentValue.textContent=state.filters.maxRent;updateScene(false)});
el.areaRange.addEventListener("input",()=>{state.filters.minArea=+el.areaRange.value;el.areaValue.textContent=state.filters.minArea;updateScene(false)});

function syncPoiMarkers(){
  if(!state.mapReady)return;
  state.life.forEach(p=>{
    if(!poiMarkers.has(p.id)){
      const node=document.createElement("div");node.className="poi-marker";node.innerHTML=`<span class="poi-dot"></span><span class="poi-label">${esc(p.name)}</span>`;
      poiMarkers.set(p.id,new maplibregl.Marker({element:node,anchor:"left"}).setLngLat([p.lng,p.lat]).addTo(map));
    }
    poiMarkers.get(p.id).getElement().classList.toggle("off",!p.active);
  });
}
function setHomeSource(){
  const s=map.getSource("homes");if(s)s.setData(homeGeoJSON());
  el.visibleCount.textContent=filteredHomes().length;
}
function updateScene(fetchRoutes){
  if(!state.mapReady)return;
  const c=map.getCenter(),center={lng:c.lng,lat:c.lat},score=pointCompatibility(center);
  el.scoreValue.textContent=score;el.scoreText.textContent=scoreText(score);
  const ghost=map.getSource("ghost-routes");if(ghost)ghost.setData(straightRoutes(center));
  setHomeSource();
  updateCapture(center);
  updateCounters();
  if(fetchRoutes)fetchRealRoutes(center);
}
function updateCapture(center){
  if(state.lockedHomeId){
    const h=currentHome();if(h){renderHome({...h,distance:0,match:pointCompatibility(h)},true);return}
  }
  const n=nearestHome(center);
  if(n&&n.distance<=state.captureThresholdKm){
    if(state.lastCapturedId!==n.id){state.lastCapturedId=n.id;captureEffect()}
    renderHome(n,false);
  }else{
    state.lastCapturedId=null;el.homeCard.hidden=true;el.target.classList.remove("locked");
  }
}
function renderHome(h,locked){
  el.homeCard.hidden=false;el.homeDistanceLabel.textContent=locked?"Verrouillé au centre":h.distance<.05?"Sous le repère":`${Math.round(h.distance*1000)} m du repère`;
  el.homeTitle.textContent=h.title;el.homeArea.textContent=h.area;el.homeScore.textContent=h.match;el.homeRent.textContent=`${h.price} €`;el.homeSqm.textContent=h.sqm;el.homeType.textContent=h.type;el.homeFurnished.textContent=h.furnished?"Meublé":"Non meublé";
  el.homeAmenities.innerHTML=h.amenities.map(a=>`<span class="amenity-tag">${amenityLabel(a)}</span>`).join("");
  el.target.classList.toggle("locked",locked);el.lockState.textContent=locked?"Appartement verrouillé":"Exploration libre";
  const st=state.status.get(h.id);
  el.homeNote.textContent=st==="interested"?"Ajouté à tes visites potentielles. Le propriétaire n’est pas prévenu.":st==="applied"?`${h.owner} a été notifié automatiquement.`:"“Intéressé” garde le logement sans prévenir le propriétaire. “Je candidate” l’avertit immédiatement.";
}
function selectHomeById(id){
  const h=state.homes.find(x=>x.id===id);if(!h)return;
  state.lockedHomeId=id;state.lastCapturedId=id;
  const z=map.getZoom();
  map.easeTo({center:[h.lng,h.lat],zoom:z,duration:520});
  captureEffect();
  setTimeout(()=>{map.setCenter([h.lng,h.lat]);updateScene(true)},540);
}
function unlockHome(){
  if(state.lockedHomeId){state.lockedHomeId=null;el.target.classList.remove("locked");el.lockState.textContent="Exploration libre"}
}
function updateCounters(){
  let i=0,a=0;state.status.forEach(v=>{if(v==="interested")i++;if(v==="applied")a++});el.interestedCount.textContent=i;el.appliedCount.textContent=a;
}
el.ignoreBtn.addEventListener("click",()=>{const h=currentHome()||nearestHome(map.getCenter());if(!h)return;state.status.set(h.id,"ignored");if(state.lockedHomeId===h.id)unlockHome();el.homeCard.hidden=true;toast(`${h.title} ignoré.`);updateScene(false)});
el.interestBtn.addEventListener("click",()=>{const h=currentHome()||nearestHome(map.getCenter());if(!h)return;state.status.set(h.id,state.status.get(h.id)==="interested"?null:"interested");toast("Liste des visites potentielles mise à jour.");updateScene(false)});
el.applyBtn.addEventListener("click",()=>{const h=currentHome()||nearestHome(map.getCenter());if(!h)return;state.status.set(h.id,"applied");toast(`Candidature envoyée — ${h.owner} est notifié.`);updateScene(false)});

function captureEffect(){
  el.flash.classList.remove("fire");void el.flash.offsetWidth;el.flash.classList.add("fire");shutter();
  if(navigator.vibrate)navigator.vibrate(18);
}
function shutter(){
  try{
    audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();
    const t=audioCtx.currentTime,o=audioCtx.createOscillator(),g=audioCtx.createGain();
    o.type="square";o.frequency.setValueAtTime(1450,t);o.frequency.exponentialRampToValueAtTime(180,t+.055);
    g.gain.setValueAtTime(.055,t);g.gain.exponentialRampToValueAtTime(.0001,t+.065);
    o.connect(g);g.connect(audioCtx.destination);o.start(t);o.stop(t+.07);
  }catch(_){}
}
function toast(msg){el.toast.textContent=msg;el.toast.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>el.toast.hidden=true,2000)}
function locate(){
  navigator.geolocation?.getCurrentPosition(p=>{unlockHome();map.easeTo({center:[p.coords.longitude,p.coords.latitude],zoom:14.2,duration:700})},()=>toast("Position indisponible."),{enableHighAccuracy:true,timeout:8000});
}
el.locateBtn.addEventListener("click",locate);

async function fetchRealRoutes(center){
  const token=++state.routeRequestToken;
  const active=state.life.filter(p=>p.active).sort((a,b)=>b.weight-a.weight).slice(0,6);
  const feats=[];
  await Promise.all(active.map(async p=>{
    try{
      const body={locations:[{lat:center.lat,lon:center.lng},{lat:p.lat,lon:p.lng}],costing:p.mode,units:"kilometers",shape_format:"polyline6"};
      const r=await fetch(ROUTER,{method:"POST",headers:{"Content-Type":"application/json","X-Client-Id":"pass-prototype"},body:JSON.stringify(body)});
      if(!r.ok)throw new Error("route");
      const data=await r.json();if(token!==state.routeRequestToken)return;
      const leg=data.trip?.legs?.[0],sum=data.trip?.summary;if(!leg||!sum)return;
      feats.push({type:"Feature",properties:{id:p.id,name:p.name,mode:p.mode,minutes:Math.max(1,Math.round(sum.time/60)),distance:+sum.length.toFixed(1),width:lineWidth(p.weight),opacity:lineOpacity(p.weight)},geometry:{type:"LineString",coordinates:decodePolyline6(leg.shape)}});
    }catch(_){}
  }));
  if(token!==state.routeRequestToken)return;
  const src=map.getSource("real-routes");
  if(src)src.setData({type:"FeatureCollection",features:feats});
}
function decodePolyline6(str){
  let idx=0,lat=0,lng=0,coords=[];
  while(idx<str.length){
    let b,shift=0,result=0;
    do{b=str.charCodeAt(idx++)-63;result|=(b&0x1f)<<shift;shift+=5}while(b>=0x20);
    const dlat=(result&1)?~(result>>1):(result>>1);lat+=dlat;
    shift=0;result=0;
    do{b=str.charCodeAt(idx++)-63;result|=(b&0x1f)<<shift;shift+=5}while(b>=0x20);
    const dlng=(result&1)?~(result>>1):(result>>1);lng+=dlng;
    coords.push([lng/1e6,lat/1e6]);
  }
  return coords;
}
function showRouteInfo(feature){
  const p=feature.properties;el.routeInfoMode.textContent=modeLabel(p.mode);el.routeInfoTitle.textContent=p.name;el.routeInfoTime.textContent=`${p.minutes} min`;el.routeInfoDistance.textContent=`${Number(p.distance).toFixed(1).replace(".",",")} km`;el.routeInfo.hidden=false;
}
function schedule(){if(state.framePending)return;state.framePending=true;requestAnimationFrame(()=>{state.framePending=false;updateScene(false)})}

el.mobileFiltersBtn?.addEventListener("click",()=>{el.filterPanel.classList.add("open");el.filterBackdrop.hidden=false});
function closeFilters(){el.filterPanel.classList.remove("open");el.filterBackdrop.hidden=true}
el.closeFiltersBtn?.addEventListener("click",closeFilters);el.filterBackdrop.addEventListener("click",closeFilters);

el.addPlaceBtn.addEventListener("click",()=>{state.addMode=true;el.placeMode.hidden=false;closeFilters()});
el.cancelPlaceMode.addEventListener("click",()=>{state.addMode=false;el.placeMode.hidden=true});
el.importancePicker.addEventListener("click",e=>{const b=e.target.closest("button[data-weight]");if(!b)return;state.pendingWeight=+b.dataset.weight;$$('#importancePicker button').forEach(x=>x.classList.toggle("active",x===b))});
el.modePicker.addEventListener("click",e=>{const b=e.target.closest("button[data-mode]");if(!b)return;state.pendingMode=b.dataset.mode;$$('#modePicker button').forEach(x=>x.classList.toggle("active",x===b))});
function closePlaceModal(){el.placeModal.hidden=true;state.addMode=false;el.placeMode.hidden=true;state.pendingPlace=null}
el.cancelPlaceModal.addEventListener("click",closePlaceModal);el.placeModal.addEventListener("click",e=>{if(e.target===el.placeModal)closePlaceModal()});
el.placeForm.addEventListener("submit",e=>{
  e.preventDefault();const name=el.placeName.value.trim();if(!name||!state.pendingPlace)return;
  state.life.push({id:`custom-${Date.now()}`,name,lat:state.pendingPlace.lat,lng:state.pendingPlace.lng,weight:state.pendingWeight,active:true,targetMin:15,mode:state.pendingMode,custom:true});
  closePlaceModal();renderLife();toast(`${name} ajouté.`);
});

map.on("load",()=>{
  state.mapReady=true;
  map.addSource("ghost-routes",{type:"geojson",data:{type:"FeatureCollection",features:[]}});
  map.addLayer({id:"ghost-routes",type:"line",source:"ghost-routes",layout:{"line-cap":"round","line-join":"round"},paint:{"line-color":"#111317","line-width":["get","width"],"line-opacity":["*",["get","opacity"],.34],"line-dasharray":[2,2]}});
  map.addSource("real-routes",{type:"geojson",data:{type:"FeatureCollection",features:[]}});
  map.addLayer({id:"real-routes",type:"line",source:"real-routes",layout:{"line-cap":"round","line-join":"round"},paint:{"line-color":"#111317","line-width":["get","width"],"line-opacity":["get","opacity"]}});
  map.addSource("homes",{type:"geojson",data:homeGeoJSON()});
  map.addLayer({id:"homes",type:"circle",source:"homes",paint:{
    "circle-radius":["case",["==",["get","id"],["literal",-1]],8,6],
    "circle-color":"#ffffff","circle-stroke-color":"#2563eb","circle-stroke-width":2,
    "circle-opacity":.96
  }});

  // Reduce map noise.
  (map.getStyle().layers||[]).forEach(l=>{try{const id=(l.id||"").toLowerCase();if(l.type==="symbol"&&(id.includes("poi")||id.includes("airport")||id.includes("transit")))map.setLayoutProperty(l.id,"visibility","none")}catch(_){}});

  syncPoiMarkers();renderLife();updateScene(true);
});
map.on("move",()=>{
  if(state.lockedHomeId){
    const h=currentHome();if(h)map.setCenter([h.lng,h.lat]);
  }
  schedule();
});
map.on("zoom",()=>{
  if(state.lockedHomeId){
    const h=currentHome();if(h)map.setCenter([h.lng,h.lat]);
  }
  schedule();
});
map.on("moveend",()=>updateScene(true));
map.on("dragstart",()=>unlockHome());
map.on("click","homes",e=>{const f=e.features?.[0];if(f)selectHomeById(Number(f.properties.id))});
map.on("mouseenter","homes",()=>map.getCanvas().style.cursor="pointer");map.on("mouseleave","homes",()=>map.getCanvas().style.cursor="");
map.on("click","real-routes",e=>{if(e.features?.[0])showRouteInfo(e.features[0])});
map.on("mouseenter","real-routes",()=>map.getCanvas().style.cursor="pointer");map.on("mouseleave","real-routes",()=>map.getCanvas().style.cursor="");
map.on("click",e=>{
  if(state.addMode&&!e.defaultPrevented){
    state.pendingPlace=e.lngLat;el.placeName.value="";el.placeModal.hidden=false;setTimeout(()=>el.placeName.focus(),20);
  }
});
document.addEventListener("pointerdown",e=>{if(!el.routeInfo.contains(e.target)&&!e.target.closest(".maplibregl-canvas"))el.routeInfo.hidden=true});

if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
})();