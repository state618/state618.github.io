
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
    RZN:'Risen','3311':'青丘寨',RoD:'Reign of Dragons',RAW:'War Dominion',
    UNQ:'UNQUESTIONED',KNT:'Knights of Round',WofA:'Wolves of Anarchy',
    S_B:'Storm Bringers',RnB:'ReBoRN BiO',TCB:'VenomousSlayers'
  };
  const allianceTags={
    RZN:'RZN','3311':'3311',RoD:'RoD!',RAW:'RAW$',UNQ:'UNQ.',
    KNT:'KNT',WofA:'WofA',S_B:'S_B',RnB:'RnB',TCB:'TCB'
  };

  form.addEventListener('submit',function(event){
    event.preventDefault();
    if(!alliance.value||!key.value.trim()){
      message.textContent='請選擇聯盟並輸入管理者存取碼。 / Select an alliance and enter an access key.';
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
    message.textContent='Only authorized alliance management accounts may enter.';
    message.className='access-message';
    window.scrollTo({top:0,behavior:'smooth'});
  });
})();
