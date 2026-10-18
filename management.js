(function(){
  const API_URL='https://script.google.com/macros/s/AKfycbwSZMVKwKpnsWP6gzwRaGSlGANhqId91BYd3kbo0gUqhIDCP-Lw5XrWVSZ1ZZWzrl3b/exec';

  const form=document.getElementById('manager-access-form');
  const login=document.getElementById('manager-login');
  const dashboard=document.getElementById('demo-dashboard');
  const allianceSelect=document.getElementById('manager-alliance');
  const keyInput=document.getElementById('manager-key');
  const accessMessage=document.getElementById('access-message');
  const exitButton=document.getElementById('exit-preview');
  const allianceTag=document.getElementById('demo-alliance-tag');
  const allianceName=document.getElementById('demo-alliance-name');
  const responsibleAlliance=document.getElementById('responsible-alliance');
  const applicationList=document.getElementById('application-list');
  const detail=document.getElementById('applicant-detail-panel');
  const filter=document.querySelector('.queue-filter');
  const operatorName=document.getElementById('operator-name');
  const operatorError=document.getElementById('operator-error');
  const saveButton=document.getElementById('save-review-button');
  const historyList=document.getElementById('activity-history-list');
  const sharedOfferPanel=document.getElementById('shared-offer-panel');
  const allianceOfferButton=document.getElementById('alliance-offer-button');
  const alliancePassButton=document.getElementById('alliance-pass-button');
  const reviewStatusField=document.getElementById('review-status-field');
  const internalNotesField=document.getElementById('internal-notes-field');
  const standardReviewActions=document.getElementById('standard-review-actions');
  const statusSelect=detail?detail.querySelector('#review-status-field select'):null;
  const notesField=detail?detail.querySelector('#internal-notes-field textarea'):null;

  const allianceNames={
    RZN:'Risen','3311':'青丘寨',RoD:'Reign of Dragons',RAW:'War Dominion',
    UNQ:'UNQUESTIONED',KNT:'Knights of Round',WofA:'Wolves of Anarchy',
    S_B:'Storm Bringers',RnB:'ReBoRN BiO',TCB:'VenomousSlayers'
  };
  const allianceTags={
    RZN:'RZN','3311':'3311',RoD:'RoD!',RAW:'RAW$',UNQ:'UNQ.',
    KNT:'KNT',WofA:'WofA',S_B:'S_B',RnB:'RnB',TCB:'TCB'
  };

  let currentAlliance='';
  let currentKey='';
  let applications=[];
  let selectedId='';

  function language(){
    return document.documentElement.dataset.language||'bi';
  }

  function escapeHtml(value){
    return String(value==null?'':value).replace(/[&<>"']/g,function(ch){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch];
    });
  }

  function statusZh(status){
    return {
      'Under Review':'審核中',
      'Approved':'已通過',
      'Waitlist':'候補',
      'Declined':'未通過'
    }[status]||status||'審核中';
  }

  function statusClass(status){
    return status==='Approved'?'approved':
      status==='Waitlist'?'waitlist':
      status==='Declined'?'declined':'reviewing';
  }

  function statusText(status){
    const zh=statusZh(status);
    const mode=language();
    return mode==='zh'?zh:mode==='en'?status:zh+' / '+status;
  }

  function compactNumber(value){
    const raw=String(value||'').replace(/,/g,'').trim();
    const n=Number(raw);
    if(!Number.isFinite(n))return raw||'—';
    if(Math.abs(n)>=1000000000)return (n/1000000000).toFixed(n%1000000000===0?0:1)+'B';
    if(Math.abs(n)>=1000000)return (n/1000000).toFixed(n%1000000===0?0:1)+'M';
    if(Math.abs(n)>=1000)return (n/1000).toFixed(n%1000===0?0:1)+'K';
    return String(n);
  }

  function isSolo(value){
    const v=String(value||'').trim().toLowerCase();
    return !v||v==='自己'||v==='solo';
  }

  function selectedApplication(){
    return applications.find(a=>String(a.rowNumber)===String(selectedId))||applications[0]||null;
  }

  function setLoading(text){
    if(applicationList)applicationList.innerHTML='<div class="history-empty">'+escapeHtml(text)+'</div>';
  }

  async function loadApplications(){
    setLoading('正在載入申請資料…');
    const url=new URL(API_URL);
    url.searchParams.set('action','managerList');
    url.searchParams.set('alliance',currentAlliance);
    url.searchParams.set('key',currentKey);
    url.searchParams.set('_',Date.now());

    const response=await fetch(url.toString(),{method:'GET',cache:'no-store'});
    if(!response.ok)throw new Error('HTTP '+response.status);
    const data=await response.json();
    if(!data.ok)throw new Error(data.message||'Access denied');

    applications=Array.isArray(data.applications)?data.applications:[];
    if(!applications.some(a=>String(a.rowNumber)===String(selectedId))){
      selectedId=applications[0]?String(applications[0].rowNumber):'';
    }
    renderAll();
  }

  function renderMetrics(){
    const values=['Under Review','Approved','Waitlist','Declined'].map(function(status){
      return applications.filter(a=>a.status===status).length;
    });
    document.querySelectorAll('.metric strong').forEach(function(el,index){
      if(values[index]!=null)el.textContent=values[index];
    });
  }

  function cardHtml(app){
    const active=String(app.rowNumber)===String(selectedId)?' active':'';
    const groupInfo=app.groupCode
      ? ((app.groupSize||'同行')+' · '+app.groupCode)
      : (app.groupSize||'單人');
    const shared=app.sharedCandidate&&!app.chosenAlliance?' shared-candidate':'';
    return '<button class="applicant-card'+active+shared+'" type="button" data-row="'+escapeHtml(app.rowNumber)+'">'+
      '<div class="applicant-top"><strong>'+escapeHtml(app.playerName||'—')+'</strong>'+
      '<span class="badge '+statusClass(app.status)+'">'+escapeHtml(statusText(app.status))+'</span></div>'+
      '<div class="applicant-meta">'+escapeHtml((app.currentState||'—')+'州 · '+(app.currentAlliance||'無聯盟')+' · 戰力 '+compactNumber(app.totalPower))+'</div>'+
      '<div class="applicant-bottom"><span>'+escapeHtml((app.watchtower||'—')+' · '+(app.mainTroop||'—'))+'</span>'+
      '<span>'+escapeHtml(groupInfo)+'</span></div></button>';
  }

  function renderQueue(){
    if(!applicationList)return;
    const wanted=filter?filter.value:'all';
    const visible=applications.filter(a=>wanted==='all'||a.status===wanted);
    if(!visible.length){
      applicationList.innerHTML='<div class="history-empty">目前沒有符合條件的申請。</div>';
      return;
    }
    applicationList.innerHTML=visible.map(cardHtml).join('');
    applicationList.querySelectorAll('.applicant-card').forEach(function(card){
      card.addEventListener('click',function(){
        selectedId=card.dataset.row;
        renderAll();
        if(window.innerWidth<900&&detail)detail.scrollIntoView({behavior:'smooth',block:'start'});
      });
    });
  }

  function renderHistory(app){
    if(!historyList)return;
    const history=Array.isArray(app&&app.history)?app.history:[];
    if(!history.length){
      historyList.innerHTML='<div class="history-empty">目前沒有編輯紀錄。</div>';
      return;
    }
    const mode=language();
    historyList.innerHTML=history.map(function(item){
      const action=mode==='en'?(item.actionEn||item.actionZh):
        mode==='zh'?(item.actionZh||item.actionEn):
        (item.actionZh||'')+(item.actionEn?' / '+item.actionEn:'');
      return '<div class="history-item"><div><strong>'+escapeHtml(item.operator||'—')+
        '</strong><span>'+escapeHtml(item.alliance||'')+'</span></div><p>'+escapeHtml(action)+
        '</p><time>'+escapeHtml(item.stamp||'')+'</time></div>';
    }).join('');
  }

  function renderDetail(){
    const app=selectedApplication();
    if(!detail)return;
    if(!app){
      detail.hidden=true;
      return;
    }
    detail.hidden=false;
    const nameEl=document.getElementById('detail-player-name');
    const badge=document.getElementById('detail-status-badge');
    if(nameEl)nameEl.textContent=app.playerName||'—';
    if(badge){
      badge.className='badge '+statusClass(app.status);
      badge.textContent=statusText(app.status);
    }

    const values=[
      app.playerIdMasked||'—',
      app.currentState||'—',
      app.currentAlliance||'—',
      compactNumber(app.totalPower),
      compactNumber(app.kills),
      app.mainTroop||'—',
      app.watchtower||'—',
      app.interest||'—',
      app.groupSize||'自己',
      app.groupCode||'—',
      app.activity||'—',
      app.management||'—',
      app.activeTime||'—'
    ];
    const valueEls=[...detail.querySelectorAll('.detail-grid > div strong')];
    values.forEach(function(value,index){
      if(valueEls[index])valueEls[index].textContent=value;
    });

    const warning=detail.querySelector('.group-warning');
    if(warning){
      warning.hidden=isSolo(app.groupSize);
      const title=warning.querySelector('strong');
      const body=warning.querySelector('span');
      if(title)title.textContent=app.groupCode?'團隊申請 · '+app.groupCode:'團隊申請';
      if(body)body.textContent=app.groupCode
        ?'同行成員請使用此團隊碼各自提交申請。'
        :'此申請標示有同行成員，但尚未建立團隊碼。';
    }

    const sharedOpen=Boolean(app.sharedCandidate&&!app.chosenAlliance);
    if(sharedOfferPanel)sharedOfferPanel.hidden=!sharedOpen;
    if(reviewStatusField)reviewStatusField.hidden=sharedOpen;
    if(internalNotesField)internalNotesField.hidden=sharedOpen;
    if(standardReviewActions)standardReviewActions.hidden=sharedOpen;
    if(responsibleAlliance)responsibleAlliance.textContent=sharedOpen?'共享候選池 / Shared Pool':(app.chosenAllianceLabel||allianceTags[currentAlliance]||currentAlliance);

    if(allianceOfferButton){
      allianceOfferButton.textContent=app.currentAllianceOffer?'撤回接收意願 / Withdraw Offer':'願意接收 / Send Offer';
      allianceOfferButton.classList.toggle('ghost-button',Boolean(app.currentAllianceOffer));
      allianceOfferButton.classList.toggle('save-button',!app.currentAllianceOffer);
      allianceOfferButton.disabled=Boolean(app.currentAlliancePass);
    }
    if(alliancePassButton){
      alliancePassButton.textContent=app.currentAlliancePass?'取消 PASS / Clear Pass':'PASS / 暫不接收';
      alliancePassButton.classList.toggle('pass-active',Boolean(app.currentAlliancePass));
      alliancePassButton.disabled=Boolean(app.currentAllianceOffer);
    }

    if(statusSelect)statusSelect.value=app.status||'Under Review';
    if(notesField)notesField.value=app.internalNotes||'';
    renderHistory(app);
  }

  function renderAll(){
    renderMetrics();
    renderQueue();
    renderDetail();
  }

  function requireOperator(){
    const value=operatorName?operatorName.value.trim():'';
    if(value){
      if(operatorError)operatorError.hidden=true;
      return value;
    }
    if(operatorError)operatorError.hidden=false;
    if(operatorName)operatorName.focus();
    return '';
  }

  async function updateApplication(action){
    const app=selectedApplication();
    const operator=requireOperator();
    if(!app||!operator)return;

    const params=new URLSearchParams();
    params.set('action','managerUpdate');
    params.set('managerAction',action);
    params.set('alliance',currentAlliance);
    params.set('key',currentKey);
    params.set('rowNumber',String(app.rowNumber));
    params.set('operator',operator);
    if(action==='save'){
      params.set('status',statusSelect?statusSelect.value:'Under Review');
      params.set('internalNotes',notesField?notesField.value:'');
    }

    const button=action==='save'?saveButton:
      (action==='pass'||action==='clearPass')?alliancePassButton:
      allianceOfferButton;
    const oldText=button?button.textContent:'';
    if(button){
      button.disabled=true;
      button.textContent='儲存中…';
    }

    try{
      const response=await fetch(API_URL,{method:'POST',body:params});
      if(!response.ok)throw new Error('HTTP '+response.status);
      const data=await response.json();
      if(!data.ok)throw new Error(data.message||'Update failed');
      const index=applications.findIndex(a=>String(a.rowNumber)===String(app.rowNumber));
      if(index>=0)applications[index]=data.application;
      renderAll();
    }catch(err){
      alert('儲存失敗：'+err.message);
    }finally{
      if(button){
        button.disabled=false;
        button.textContent=oldText;
      }
    }
  }

  if(form){
    form.addEventListener('submit',async function(event){
      event.preventDefault();
      const alliance=allianceSelect?allianceSelect.value:'';
      const key=keyInput?keyInput.value.trim():'';
      if(!alliance||!key){
        accessMessage.textContent='請選擇聯盟並輸入管理者存取碼。';
        accessMessage.className='access-message error';
        return;
      }

      currentAlliance=alliance;
      currentKey=key;
      accessMessage.textContent='正在驗證並載入資料…';
      accessMessage.className='access-message';

      try{
        await loadApplications();
        if(allianceTag)allianceTag.textContent=allianceTags[alliance]||alliance;
        if(allianceName)allianceName.textContent=allianceNames[alliance]||alliance;
        if(responsibleAlliance)responsibleAlliance.textContent=allianceTags[alliance]||alliance;
        login.hidden=true;
        dashboard.hidden=false;
        window.scrollTo({top:0,behavior:'smooth'});
      }catch(err){
        applications=[];
        accessMessage.textContent='登入失敗：存取碼錯誤或後端尚未連線。';
        accessMessage.className='access-message error';
      }
    });
  }

  if(exitButton){
    exitButton.addEventListener('click',function(){
      dashboard.hidden=true;
      login.hidden=false;
      currentAlliance='';
      currentKey='';
      applications=[];
      selectedId='';
      if(keyInput)keyInput.value='';
      accessMessage.textContent='僅限授權的聯盟管理者使用。';
      accessMessage.className='access-message';
    });
  }

  if(filter)filter.addEventListener('change',renderQueue);
  if(saveButton)saveButton.addEventListener('click',function(){updateApplication('save');});
  if(allianceOfferButton)allianceOfferButton.addEventListener('click',function(){
    const app=selectedApplication();
    if(!app)return;
    updateApplication(app.currentAllianceOffer?'withdrawOffer':'offer');
  });
  if(alliancePassButton)alliancePassButton.addEventListener('click',function(){
    const app=selectedApplication();
    if(!app)return;
    updateApplication(app.currentAlliancePass?'clearPass':'pass');
  });
  if(operatorName)operatorName.addEventListener('input',function(){
    if(operatorName.value.trim()&&operatorError)operatorError.hidden=true;
  });

  window.addEventListener('state618:languagechange',renderAll);
})();