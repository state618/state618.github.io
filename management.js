
(function(){
  const form=document.getElementById('manager-access-form');
  const login=document.getElementById('manager-login');
  const dashboard=document.getElementById('demo-dashboard');
  const alliance=document.getElementById('manager-alliance');
  const key=document.getElementById('manager-key');
  const message=document.getElementById('access-message');
  const exit=document.getElementById('exit-preview');
  const tag=document.getElementById('demo-alliance-tag');
  const name=document.getElementById('demo-alliance-name');
  if(!form||!login||!dashboard)return;

  const allianceNames={
    RZN:'Risen','3311':'??撖?,RoD:'Reign of Dragons',RAW:'War Dominion',
    UNQ:'UNQUESTIONED',KNT:'Knights of Round',WofA:'Wolves of Anarchy',
    S_B:'Storm Bringers',RnB:'ReBoRN BiO',TCB:'VenomousSlayers'
  };
  const allianceTags={
    RZN:'RZN','3311':'3311',RoD:'RoD!',RAW:'RAW$',UNQ:'UNQ.',
    KNT:'KNT',WofA:'WofA',S_B:'S_B',RnB:'RnB',TCB:'TCB'
  };

  const demoKeys={
    '3311':'3311-DEMO-618'
  };

  form.addEventListener('submit',function(event){
    event.preventDefault();

    if(!alliance.value||!key.value.trim()){
      message.textContent='隢??蒂頛詨蝞∠????Ⅳ??/ Select an alliance and enter an access key.';
      message.className='access-message error';
      return;
    }

    if(!demoKeys[alliance.value]){
      message.textContent='???皜祈岫摮?蝣澆??芸遣蝡?/ Demo access is not configured for this alliance yet.';
      message.className='access-message error';
      return;
    }

    if(key.value.trim()!==demoKeys[alliance.value]){
      message.textContent='摮?蝣潮隤扎?/ Invalid access key.';
      message.className='access-message error';
      return;
    }

    tag.textContent=allianceTags[alliance.value]||alliance.value;
    name.textContent=allianceNames[alliance.value]||alliance.value;
    login.hidden=true;
    dashboard.hidden=false;
    window.scrollTo({top:0,behavior:'smooth'});
  });

  exit.addEventListener('click',function(){
    dashboard.hidden=true;
    login.hidden=false;
    key.value='';
    message.textContent='??????恣?蝙?具?/ Authorized managers only.';
    message.className='access-message';
    window.scrollTo({top:0,behavior:'smooth'});
  });
})();


(function setupDemoApplicantSelection(){
  const cards=[...document.querySelectorAll('.applicant-card[data-applicant]')];
  const detail=document.getElementById('applicant-detail-panel');
  const filter=document.querySelector('.queue-filter');
  if(!cards.length||!detail)return;

  const profiles={
    sample:{
      name:'SamplePlayer',status:'Received',statusZh:'撌脫??,statusEn:'Received',
      values:[
        '1234567890','621','EXM','245M','3.2M',
        {zh:'?ㄚ',en:'Warrior'},
        {zh:'撌交平2',en:'Industrial 2'},
        {zh:'蝣箏??喃?',en:'Definitely interested'},
        {zh:'2?? 鈭?,en:'2?? players'},
        {zh:'蝛扔??',en:'Highly active'},
        'R4','05ST??9ST'
      ],
      groupPending:true
    },
    night:{
      name:'NightScout',status:'Awaiting Interview',statusZh:'蝑閰?,statusEn:'Awaiting Interview',
      values:[
        '9876543210','624','NXT','301M','4.8M',
        {zh:'撠?',en:'Shooter'},
        {zh:'撌交平3',en:'Industrial 3'},
        {zh:'蝣箏??喃?',en:'Definitely interested'},
        {zh:'?桐犖',en:'Solo'},
        {zh:'蝛扔??',en:'Highly active'},
        'R4','10ST??5ST'
      ],
      groupPending:false
    },
    leader:{
      name:'DemoLeader',status:'Under Review',statusZh:'撖拇銝?,statusEn:'Under Review',
      values:[
        '2468013579','620','DEM','278M','3.9M',
        {zh:'擉',en:'Rider'},
        {zh:'撌交平2',en:'Industrial 2'},
        {zh:'擃漲?',en:'Strongly considering'},
        {zh:'6??0 鈭?,en:'6??0 players'},
        {zh:'瘣餉?',en:'Active'},
        'R5','00ST??6ST'
      ],
      groupPending:true
    }
  };

  let selected='sample';

  function language(){
    return document.documentElement.dataset.language||'bi';
  }

  function displayValue(value){
    if(typeof value==='string')return value;
    const mode=language();
    if(mode==='zh')return value.zh;
    if(mode==='en')return value.en;
    return value.zh+' / '+value.en;
  }

  function render(key){
    const p=profiles[key];
    if(!p)return;
    selected=key;

    cards.forEach(card=>card.classList.toggle('active',card.dataset.applicant===key));

    const name=detail.querySelector('#detail-player-name');
    if(name)name.textContent=p.name;

    const badge=detail.querySelector('#detail-status-badge');
    if(badge){
      badge.className='badge '+(
        p.status==='Received'?'received':
        p.status==='Awaiting Interview'?'interview':
        p.status==='Under Review'?'reviewing':'received'
      );
      badge.dataset.i18nZh=p.statusZh;
      badge.dataset.i18nEn=p.statusEn;
      const mode=language();
      badge.textContent=mode==='zh'?p.statusZh:mode==='en'?p.statusEn:p.statusZh+' / '+p.statusEn;
    }

    const valueEls=[...detail.querySelectorAll('.detail-grid > div strong')];
    p.values.forEach((value,i)=>{
      if(valueEls[i])valueEls[i].textContent=displayValue(value);
    });

    const warning=detail.querySelector('.group-warning');
    if(warning)warning.hidden=!p.groupPending;
  }

  cards.forEach(card=>{
    card.addEventListener('click',()=>{
      render(card.dataset.applicant);
      if(window.innerWidth<900){
        detail.scrollIntoView({behavior:'smooth',block:'start'});
      }
    });
  });

  if(filter){
    filter.addEventListener('change',()=>{
      const wanted=filter.value;
      cards.forEach(card=>{
        const p=profiles[card.dataset.applicant];
        card.hidden=wanted!=='all' && p.status!==wanted;
      });
    });
  }

  window.addEventListener('state618:languagechange',()=>render(selected));
  render(selected);
})();

