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
  const responsibleAlliance=document.getElementById('responsible-alliance');

  const allianceNames={
    RZN:'Risen',
    '3311':'\u9752\u4e18\u5be8',
    RoD:'Reign of Dragons',
    RAW:'War Dominion',
    UNQ:'UNQUESTIONED',
    KNT:'Knights of Round',
    WofA:'Wolves of Anarchy',
    S_B:'Storm Bringers',
    RnB:'ReBoRN BiO',
    TCB:'VenomousSlayers'
  };
  const allianceTags={
    RZN:'RZN','3311':'3311',RoD:'RoD!',RAW:'RAW$',UNQ:'UNQ.',
    KNT:'KNT',WofA:'WofA',S_B:'S_B',RnB:'RnB',TCB:'TCB'
  };
  const demoKeys={'3311':'3311-DEMO-618'};

  if(form&&login&&dashboard){
    form.addEventListener('submit',function(event){
      event.preventDefault();
      if(!alliance.value||!key.value.trim()){
        message.textContent='\u8acb\u9078\u64c7\u806f\u76df\u4e26\u8f38\u5165\u7ba1\u7406\u8005\u5b58\u53d6\u78bc\u3002 / Select an alliance and enter an access key.';
        message.className='access-message error';
        return;
      }
      if(!demoKeys[alliance.value]){
        message.textContent='\u9019\u500b\u806f\u76df\u7684\u6e2c\u8a66\u5b58\u53d6\u78bc\u5c1a\u672a\u5efa\u7acb\u3002 / Demo access is not configured for this alliance yet.';
        message.className='access-message error';
        return;
      }
      if(key.value.trim()!==demoKeys[alliance.value]){
        message.textContent='\u5b58\u53d6\u78bc\u932f\u8aa4\u3002 / Invalid access key.';
        message.className='access-message error';
        return;
      }
      tag.textContent=allianceTags[alliance.value]||alliance.value;
      name.textContent=allianceNames[alliance.value]||alliance.value;
      if(responsibleAlliance)responsibleAlliance.textContent=allianceTags[alliance.value]||alliance.value;
      login.hidden=true;
      dashboard.hidden=false;
      window.scrollTo({top:0,behavior:'smooth'});
    });

    if(exit){
      exit.addEventListener('click',function(){
        dashboard.hidden=true;
        login.hidden=false;
        key.value='';
        message.textContent='\u50c5\u9650\u6388\u6b0a\u7684\u806f\u76df\u7ba1\u7406\u8005\u4f7f\u7528\u3002 / Authorized managers only.';
        message.className='access-message';
        window.scrollTo({top:0,behavior:'smooth'});
      });
    }
  }

  const cards=[...document.querySelectorAll('.applicant-card[data-applicant]')];
  const detail=document.getElementById('applicant-detail-panel');
  const filter=document.querySelector('.queue-filter');
  if(!cards.length||!detail)return;

  const profiles={
    sample:{
      name:'SamplePlayer',status:'Under Review',zh:'\u5be9\u6838\u4e2d',en:'Under Review',
      values:['1234567890','621','EXM','245M','3.2M',{zh:'\u52c7\u58eb',en:'Warrior'},{zh:'\u5de5\u696d2',en:'Industrial 2'},{zh:'\u78ba\u5b9a\u60f3\u4f86',en:'Definitely interested'},{zh:'2\u20135 \u4eba',en:'2\u20135 players'},{zh:'\u7a4d\u6975\u53c3\u8207',en:'Highly active'},'R4','05ST\u201309ST'],
      groupPending:true,
      notes:'',
      history:[]
    },
    night:{
      name:'NightScout',status:'Under Review',zh:'\u5be9\u6838\u4e2d',en:'Under Review',
      values:['9876543210','624','NXT','301M','4.8M',{zh:'\u5c04\u624b',en:'Shooter'},{zh:'\u5de5\u696d3',en:'Industrial 3'},{zh:'\u78ba\u5b9a\u60f3\u4f86',en:'Definitely interested'},{zh:'\u55ae\u4eba',en:'Solo'},{zh:'\u7a4d\u6975\u53c3\u8207',en:'Highly active'},'R4','10ST\u201315ST'],
      groupPending:false,
      notes:'',
      history:[]
    },
    leader:{
      name:'DemoLeader',status:'Under Review',zh:'\u5be9\u6838\u4e2d',en:'Under Review',
      values:['2468013579','620','DEM','278M','3.9M',{zh:'\u9a0e\u5175',en:'Rider'},{zh:'\u5de5\u696d2',en:'Industrial 2'},{zh:'\u9ad8\u5ea6\u8003\u616e',en:'Strongly considering'},{zh:'6\u201310 \u4eba',en:'6\u201310 players'},{zh:'\u6d3b\u8e8d',en:'Active'},'R5','00ST\u201306ST'],
      groupPending:true,
      notes:'',
      history:[]
    }
  };

  let selected='sample';
  function lang(){return document.documentElement.dataset.language||'bi';}
  function displayValue(v){
    if(typeof v==='string')return v;
    const mode=lang();
    return mode==='zh'?v.zh:mode==='en'?v.en:v.zh+' / '+v.en;
  }
  function render(k){
    const p=profiles[k];
    if(!p)return;
    selected=k;
    cards.forEach(card=>card.classList.toggle('active',card.dataset.applicant===k));
    const nameEl=detail.querySelector('#detail-player-name');
    if(nameEl)nameEl.textContent=p.name;
    const badge=detail.querySelector('#detail-status-badge');
    if(badge){
      badge.className='badge '+(p.status==='Approved'?'approved':p.status==='Waitlist'?'waitlist':p.status==='Declined'?'declined':'reviewing');
      badge.dataset.i18nZh=p.zh;
      badge.dataset.i18nEn=p.en;
      const mode=lang();
      badge.textContent=mode==='zh'?p.zh:mode==='en'?p.en:p.zh+' / '+p.en;
    }
    const valueEls=[...detail.querySelectorAll('.detail-grid > div strong')];
    p.values.forEach((v,i)=>{if(valueEls[i])valueEls[i].textContent=displayValue(v);});
    const warning=detail.querySelector('.group-warning');
    if(warning)warning.hidden=!p.groupPending;
    if(statusSelect)statusSelect.value=p.status;
    if(notesField)notesField.value=p.notes||'';
    renderHistory();
  }

  cards.forEach(card=>{
    card.addEventListener('click',function(){
      render(card.dataset.applicant);
      if(window.innerWidth<900)detail.scrollIntoView({behavior:'smooth',block:'start'});
    });
  });

  if(filter){
    filter.addEventListener('change',function(){
      const wanted=filter.value;
      cards.forEach(card=>{
        const p=profiles[card.dataset.applicant];
        card.hidden=wanted!=='all'&&p.status!==wanted;
      });
    });
  }

  const operatorName=document.getElementById('operator-name');
  const operatorError=document.getElementById('operator-error');
  const saveReview=document.getElementById('save-review-button');
  const requestInfo=document.getElementById('request-info-button');
  const historyList=document.getElementById('activity-history-list');
  const statusSelect=detail.querySelector('.manager-field select');
  const notesField=detail.querySelector('.manager-field textarea');

  function requireOperator(){
    if(operatorName&&operatorName.value.trim()) {
      if(operatorError)operatorError.hidden=true;
      return operatorName.value.trim();
    }
    if(operatorError)operatorError.hidden=false;
    if(operatorName)operatorName.focus();
    return '';
  }

  function escapeHtml(value){
    return String(value).replace(/[&<>"']/g,function(ch){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch];
    });
  }

  function renderHistory(){
    if(!historyList)return;
    const p=profiles[selected];
    if(!p||!p.history||!p.history.length){
      historyList.innerHTML='<div class="history-empty" data-i18n-zh="目前沒有編輯紀錄。" data-i18n-en="No activity yet.">目前沒有編輯紀錄。</div>';
      return;
    }
    const mode=lang();
    historyList.innerHTML=p.history.map(function(item){
      const action=mode==='zh'?item.actionZh:mode==='en'?item.actionEn:item.actionZh+' / '+item.actionEn;
      return '<div class="history-item"><div><strong>'+escapeHtml(item.operator)+'</strong><span>'+escapeHtml(item.alliance)+'</span></div><p>'+escapeHtml(action)+'</p><time>'+escapeHtml(item.stamp)+'</time></div>';
    }).join('');
  }

  function addDemoHistory(actionZh,actionEn){
    const operator=requireOperator();
    if(!operator||!historyList)return false;
    const p=profiles[selected];
    if(!p)return false;
    const now=new Date();
    p.history.unshift({
      operator:operator,
      alliance:responsibleAlliance?responsibleAlliance.textContent:'',
      actionZh:actionZh,
      actionEn:actionEn,
      stamp:now.toLocaleString('zh-TW',{hour12:false})
    });
    renderHistory();
    return true;
  }

  if(operatorName){
    operatorName.addEventListener('input',function(){
      if(operatorName.value.trim()&&operatorError)operatorError.hidden=true;
    });
  }
  if(saveReview){
    saveReview.addEventListener('click',function(){
      const operator=requireOperator();
      if(!operator)return;
      const p=profiles[selected];
      const changes=[];
      const newStatus=statusSelect?statusSelect.value:p.status;
      const newNotes=notesField?notesField.value.trim():p.notes;

      if(newStatus!==p.status){
        const statusZh={
          'Under Review':'審核中',
          'Approved':'已通過',
          'Waitlist':'候補',
          'Declined':'未通過'
        };
        changes.push({
          zh:'申請狀態：'+(statusZh[p.status]||p.status)+' → '+(statusZh[newStatus]||newStatus),
          en:'Status: '+p.status+' → '+newStatus
        });
        p.status=newStatus;
        p.zh=statusZh[newStatus]||newStatus;
        p.en=newStatus;
      }

      if(newNotes!==p.notes){
        changes.push({
          zh:'更新內部備註',
          en:'Updated internal notes'
        });
        p.notes=newNotes;
      }

      if(!changes.length){
        changes.push({
          zh:'儲存審核（無欄位變更）',
          en:'Saved review (no field changes)'
        });
      }

      changes.forEach(function(change){
        addDemoHistory(change.zh,change.en);
      });
      render(selected);
    });
  }
  if(requestInfo){
    requestInfo.addEventListener('click',function(){
      addDemoHistory('\u8981\u6c42\u7533\u8acb\u8005\u88dc\u5145\u8cc7\u6599','Requested more information');
    });
  }

  window.addEventListener('state618:languagechange',function(){render(selected);renderHistory();});
  render(selected);
})();