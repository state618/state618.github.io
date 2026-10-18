const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwSZMVKwKpnsWP6gzwRaGSlGANhqId91BYd3kbo0gUqhIDCP-Lw5XrWVSZ1ZZWzrl3b/exec';

const backendReady = WEB_APP_URL.startsWith('https://script.google.com/macros/s/');

function setSubmitMessage(text, type = '') {
  const el = document.getElementById('submit-result');
  if (!el) return;
  el.textContent = text;
  el.className = 'submit-result ' + type;
}

function groupCodeCard(code, shareUrl = '') {
  const safeCode = escapeHtml(code);
  const safeUrl = escapeHtml(shareUrl);
  return '<div class="group-code-card">' +
    '<span class="group-code-eyebrow">團隊邀請碼 / Group Invite Code</span>' +
    '<strong class="group-code-value">' + safeCode + '</strong>' +
    '<p>請把這組邀請碼分享給同行成員，每位成員都要各自填寫申請。<br>' +
    'Share this code with your group members. Each member must submit their own application.</p>' +
    '<div class="group-code-actions">' +
      '<button type="button" class="group-copy-button" data-copy-value="' + safeCode + '">複製邀請碼 / Copy Code</button>' +
      (shareUrl ? '<button type="button" class="group-copy-button" data-copy-value="' + safeUrl + '">複製邀請連結 / Copy Link</button>' : '') +
    '</div>' +
    (shareUrl ? '<a class="group-share-link" href="' + safeUrl + '">' + safeUrl + '</a>' : '') +
  '</div>';
}

function wireCopyButtons(root) {
  if (!root) return;
  root.querySelectorAll('[data-copy-value]').forEach(button => {
    if (button.dataset.copyBound === '1') return;
    button.dataset.copyBound = '1';
    button.addEventListener('click', async () => {
      const value = button.dataset.copyValue || '';
      const original = button.textContent;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(value);
        } else {
          const temp = document.createElement('textarea');
          temp.value = value;
          temp.style.position = 'fixed';
          temp.style.opacity = '0';
          document.body.appendChild(temp);
          temp.select();
          document.execCommand('copy');
          temp.remove();
        }
        button.textContent = '已複製 / Copied';
        setTimeout(() => { button.textContent = original; }, 1200);
      } catch (error) {
        console.error('Copy failed:', error);
      }
    });
  });
}

(function setupApplicationForm() {
  const form = document.getElementById('survey-form');
  if (!form) return;

  const button = document.getElementById('submit-button');
  const frame = document.getElementById('submit-frame');
  let waitingForResponse = false;

  if (!backendReady) {
    button.disabled = true;
    button.textContent = '後台未連線 / Backend not connected';
    setSubmitMessage('資料後台尚未連線。 / Backend is not connected.', 'muted');
    return;
  }

  form.action = WEB_APP_URL;
  form.method = 'POST';
  form.target = 'submit-frame';

  let submittedPlayerId = '';

  form.addEventListener('submit', (event) => {
    submittedPlayerId = String(form.elements.player_id?.value || '').trim();
    waitingForResponse = true;
    button.disabled = true;
    button.textContent = '送出中... / Submitting...';
    setSubmitMessage('正在送出申請，請稍候… / Submitting your application, please wait…', 'muted');
  });

  frame.addEventListener('load', async () => {
    if (!waitingForResponse) return;
    waitingForResponse = false;
    button.disabled = false;
    button.textContent = '送出申請 / Submit Application';

    let successHtml = '已收到申請 / Application received. 請使用 Player ID 查詢進度，並耐心等候專人通知。';

    try {
      if (submittedPlayerId) {
        const response = await fetch(
          WEB_APP_URL + '?playerId=' + encodeURIComponent(submittedPlayerId) + '&_=' + Date.now(),
          { method: 'GET', cache: 'no-store' }
        );
        if (response.ok) {
          const data = await response.json();
          if (data && data.ok && data.groupCode) {
            const shareUrl = new URL('apply.html', window.location.href);
            shareUrl.searchParams.set('group', data.groupCode);
            successHtml =
              '<div class="submit-success-title">已收到申請 / Application received.</div>' +
              groupCodeCard(data.groupCode, shareUrl.href);
          }
        }
      }
    } catch (error) {
      console.error('Group code lookup failed:', error);
    }

    form.reset();
    const result = document.getElementById('submit-result');
    if (result) {
      result.innerHTML = successHtml;
      result.className = 'submit-result success';
      wireCopyButtons(result);
    }
    submittedPlayerId = '';
  });
})();

(function setupStatusLookup() {
  const button = document.getElementById('check-status-button');
  const input = document.getElementById('player-id');
  const result = document.getElementById('live-status-result');

  if (!button || !input || !result) return;

  if (!backendReady) {
    button.disabled = true;
    button.textContent = '後台未連線 / Backend not connected';
    return;
  }

  button.disabled = false;
  button.textContent = '查詢進度 / Check Status';

  button.addEventListener('click', async () => {
    const playerId = input.value.trim();
    if (!playerId) {
      renderStatusError('請先輸入 Player ID。 / Please enter your Player ID.');
      return;
    }

    button.disabled = true;
    button.textContent = '查詢中... / Checking...';

    try {
      const response = await fetch(
        WEB_APP_URL + '?playerId=' + encodeURIComponent(playerId) + '&_=' + Date.now(),
        { method: 'GET', cache: 'no-store' }
      );

      if (!response.ok) {
        throw new Error('HTTP ' + response.status);
      }

      const data = await response.json();
      renderStatus(data);
    } catch (error) {
      console.error('Status lookup failed:', error);
      renderStatusError('查詢連線失敗，請重新整理頁面後再試。 / Connection failed. Please refresh and try again.');
    } finally {
      button.disabled = false;
      button.textContent = '查詢進度 / Check Status';
    }
  });

  function renderStatus(data) {
    if (!data || !data.ok) {
      renderStatusError((data && data.message) || '找不到這筆申請。 / Application not found.');
      return;
    }

    result.hidden = false;
    result.innerHTML = [
      row('Player ID', escapeHtml(data.playerId)),
      row('玩家名稱 / Player', escapeHtml(data.playerName)),
      row('希望聯盟 / Preferred Alliance', escapeHtml(data.preferredAlliance || '—')),
      data.chosenAlliance ? row('已選擇聯盟 / Chosen Alliance', escapeHtml(data.chosenAlliance)) : '',
      data.groupCode ? groupCodeCard(data.groupCode) : '',
      data.infoRequest && data.infoRequest.pending ? infoRequestBlock(data.infoRequest) : '',
      offerChoiceBlock(data),
      row('狀態 / Status', '<span class="badge ' + statusClass(data.status) + '">' + escapeHtml(statusLabel(data.status)) + '</span>'),
      row('送出時間 / Submitted', escapeHtml(data.submittedAt || '—')),
      row('最後更新 / Last Updated', escapeHtml(data.lastUpdated || '—')),
      '<div class="status-note">' + escapeHtml(statusMessage(data.status)) + '</div>'
    ].join('');
    wireCopyButtons(result);
    wireAllianceChoiceButtons(result, data.playerId);
  }

  function offerChoiceBlock(data) {
    if (!data || data.chosenAlliance || !data.openPreference) return '';
    const offers = Array.isArray(data.allianceOffers) ? data.allianceOffers : [];
    if (!offers.length) {
      return '<div class="alliance-offer-box waiting"><b>聯盟接收意願 / Alliance Offers</b><span>目前還沒有聯盟送出接收意願，請稍後再查詢。</span></div>';
    }
    return '<div class="alliance-offer-box"><b>願意接收你的聯盟 / Alliances Ready to Accept You</b>' +
      '<span>你可以從下列聯盟中自行選擇。確認後將完成聯盟歸屬。</span>' +
      '<div class="alliance-offer-list">' +
      offers.map(function(offer){
        return '<button type="button" class="alliance-choice-button" data-alliance="' +
          escapeHtml(offer.alliance) + '">' + escapeHtml(offer.label) + '</button>';
      }).join('') +
      '</div></div>';
  }

  function wireAllianceChoiceButtons(root, playerId) {
    if (!root) return;
    root.querySelectorAll('.alliance-choice-button').forEach(function(choiceButton) {
      choiceButton.addEventListener('click', async function() {
        const alliance = choiceButton.dataset.alliance || '';
        if (!alliance) return;
        const label = choiceButton.textContent || alliance;
        if (!window.confirm('確認選擇 ' + label + '？\nConfirm this alliance?')) return;

        root.querySelectorAll('.alliance-choice-button').forEach(btn => { btn.disabled = true; });
        const oldText = choiceButton.textContent;
        choiceButton.textContent = '確認中… / Confirming…';

        try {
          const params = new URLSearchParams();
          params.set('action', 'applicantChooseAlliance');
          params.set('playerId', playerId);
          params.set('alliance', alliance);
          const response = await fetch(WEB_APP_URL, { method: 'POST', body: params });
          if (!response.ok) throw new Error('HTTP ' + response.status);
          const data = await response.json();
          if (!data.ok) throw new Error(data.message || 'Unable to choose alliance.');
          renderStatus(data);
        } catch (error) {
          console.error('Alliance choice failed:', error);
          alert('選擇聯盟失敗，請重新查詢後再試。 / Unable to confirm alliance.');
          root.querySelectorAll('.alliance-choice-button').forEach(btn => { btn.disabled = false; });
          choiceButton.textContent = oldText;
        }
      });
    });
  }

  function renderStatusError(message) {
    result.hidden = false;
    result.innerHTML = '<div class="status-error">' + escapeHtml(message) + '</div>';
  }

  function infoRequestBlock(request) {
    const details = [];
    if (request.categories) details.push('<strong>' + escapeHtml(request.categories) + '</strong>');
    if (request.message) details.push('<span>' + escapeHtml(request.message) + '</span>');
    return '<div class="applicant-info-request"><b>需要補充資料 / More Information Needed</b>' +
      (details.length ? details.join('') : '<span>請聯繫 618 管理人員確認需要補充的內容。</span>') +
      '<small>你的審核狀態不會因補件要求而改變。</small></div>';
  }

  function row(label, value) {
    return '<div class="result-row"><span>' + label + '</span><strong>' + value + '</strong></div>';
  }

  function statusClass(status) {
    const map = {
      'Received': 'received',
      'Awaiting Interview': 'interview',
      'Under Review': 'reviewing',
      'Approved': 'approved',
      'Waitlist': 'waitlist',
      'Declined': 'declined'
    };
    return map[status] || 'received';
  }

  function statusLabel(status) {
    const map = {
      'Received': 'Received · 已收到申請',
      'Awaiting Interview': 'Awaiting Interview · 等候面試',
      'Under Review': 'Under Review · 審核中',
      'Approved': 'Approved · 已通過',
      'Waitlist': 'Waitlist · 候補中',
      'Declined': 'Declined · 未通過'
    };
    return map[status] || status || 'Received';
  }

  function statusMessage(status) {
    const map = {
      'Received': '申請已收到，請耐心等候專人聯繫。',
      'Awaiting Interview': '目前正等待指定聯盟管理人員聯繫並安排面試，請耐心等候。',
      'Under Review': '申請正在審核中，請耐心等候專人通知。',
      'Approved': '申請已通過，請留意後續聯繫與移民安排。',
      'Waitlist': '目前列入候補名單，請耐心等候後續通知。',
      'Declined': '本次申請未通過；若有疑問，請聯繫 618 管理人員。'
    };
    return map[status] || '請耐心等候專人通知。';
  }
})();

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


(function setupBackgroundMusic() {
  const audio = document.getElementById('site-bgm');
  if (!audio) return;

  const STORAGE_KEY = 'state618_bgm_time';
  audio.volume = 0.28;
  audio.loop = true;

  const savedTime = Number(sessionStorage.getItem(STORAGE_KEY));
  if (Number.isFinite(savedTime) && savedTime > 0) {
    const restoreTime = () => {
      const duration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : null;
      audio.currentTime = duration ? savedTime % duration : savedTime;
    };
    if (audio.readyState >= 1) restoreTime();
    else audio.addEventListener('loadedmetadata', restoreTime, { once: true });
  }

  const saveTime = () => {
    if (Number.isFinite(audio.currentTime)) {
      sessionStorage.setItem(STORAGE_KEY, String(audio.currentTime));
    }
  };

  window.addEventListener('pagehide', saveTime);
  setInterval(saveTime, 1000);

  const tryPlay = () => {
    const promise = audio.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(() => {});
    }
  };

  tryPlay();

  const unlockAudio = () => {
    tryPlay();
    document.removeEventListener('pointerdown', unlockAudio, true);
    document.removeEventListener('keydown', unlockAudio, true);
    document.removeEventListener('touchstart', unlockAudio, true);
  };

  document.addEventListener('pointerdown', unlockAudio, true);
  document.addEventListener('keydown', unlockAudio, true);
  document.addEventListener('touchstart', unlockAudio, true);
})();


(function setupGroupInviteCode(){
  const input=document.getElementById('group-code');
  const groupSizeField=document.getElementById('group-size-field');
  const groupSize=document.getElementById('group-size');
  const memberNote=document.getElementById('group-member-note');
  if(!input)return;

  function syncGroupMode(){
    const hasCode=Boolean(input.value.trim());

    if(groupSizeField)groupSizeField.hidden=hasCode;
    if(memberNote)memberNote.hidden=!hasCode;

    if(groupSize){
      groupSize.disabled=hasCode;
      if(hasCode)groupSize.value='';
    }
  }

  const params=new URLSearchParams(window.location.search);
  const code=(params.get('group')||params.get('group_code')||'').trim();
  if(code)input.value=code;

  input.addEventListener('input',syncGroupMode);
  input.addEventListener('change',syncGroupMode);
  syncGroupMode();
})();