(function () {
  const STORAGE_KEY = 'state618_language';
  const MODES = ['bi', 'zh', 'en', 'ja', 'ko', 'es', 'pt', 'fr', 'de'];
  const LABELS = {
    bi: '雙語',
    zh: '繁中',
    en: 'EN',
    ja: '日本語',
    ko: '한국어',
    es: 'Español',
    pt: 'Português',
    fr: 'Français',
    de: 'Deutsch'
  };
  const HTML_LANG = {
    bi: 'zh-Hant',
    zh: 'zh-Hant',
    en: 'en',
    ja: 'ja',
    ko: 'ko',
    es: 'es',
    pt: 'pt',
    fr: 'fr',
    de: 'de'
  };

  const T = {
    ja: {
      'Alliance Management':'同盟管理','ALLIANCE MANAGEMENT':'同盟管理','Migration Review Console':'移民申請審査管理',
      'Alliance managers can review applicants assigned to their alliance and shared candidates who have not chosen an alliance yet.':'同盟管理者は、自同盟を指定した申請者と、まだ同盟を決めていない共有候補者を確認できます。',
      'Alliance-scoped access':'同盟別アクセス','Alliance-specific applications remain private. Only No preference / Not sure yet applications enter the shared candidate pool.':'同盟を指定した申請は各同盟内でのみ表示されます。「希望なし／未定」の申請だけが共有候補者プールに入ります。',
      'MANAGER ACCESS':'管理者ログイン','Alliance':'同盟','Select alliance':'同盟を選択','Management Access Key':'管理者アクセスキー','Enter access key':'アクセスキーを入力',
      'Open Dashboard':'管理画面を開く','Authorized managers only.':'許可された同盟管理者のみ利用できます。','ALLIANCE DASHBOARD':'同盟審査ダッシュボード',
      'Migration application review queue':'移民申請審査キュー','← Back to Login':'← ログインへ戻る','What do I do here?':'このページで何をしますか？',
      'Use these four steps for each application.':'各申請を次の4ステップで処理します。','Select an applicant on the left':'左側で申請者を選択',
      'Review the details on the right':'右側の詳細を確認','Assign reviewer and update status':'担当者を入力してステータスを更新','Add notes and save the review':'内部メモを追加して保存',
      'Under Review':'審査中','Approved':'承認済み','Waitlist':'待機リスト','Declined':'不承認','APPLICATION QUEUE':'申請一覧','Applications':'申請',
      'All Status':'すべてのステータス','Select an applicant below to view full details on the right.':'下の申請者を選択すると、右側に詳細が表示されます。',
      'APPLICATION DETAIL':'申請詳細','Next: review the application and make a decision':'次へ：申請内容を確認して審査結果を決定',
      'Required fields are validated before submission, so managers can review directly.':'必須項目は送信前に確認されるため、管理者はそのまま審査できます。',
      'Current State':'現在の州','Current Alliance':'現在の同盟','Total Power':'総戦力','Kills':'撃破数','Main Troop':'主力兵種','Main Troop Type':'主力兵種',
      'Warrior':'歩兵','Rider':'騎兵','Shooter':'射手','Watchtower':'監視塔','Watchtower Level':'監視塔レベル','Interest':'移民意向','Group Size':'同行人数',
      'Group Code':'グループ招待コード','Activity':'活動度','Management':'管理経験','Active Time':'活動時間','Group Application':'グループ申請',
      'Group members should submit their own applications using this invite code.':'同行メンバーはこの招待コードを使って各自で申請してください。',
      'Shared Candidate':'共有候補者','Send Offer':'受け入れオファー','Responsible Alliance':'担当同盟','Operator Name (Required)':'操作者名（必須）',
      'Enter your in-game name':'ゲーム内名を入力','Operator name is required.':'操作者名を入力してください。','Status':'申請状況','Internal Notes':'内部メモ',
      'Visible to alliance management only':'同盟管理者のみ閲覧可能','Save Review':'審査を保存','AUDIT TRAIL':'操作履歴','Activity History':'編集履歴','Read only':'読み取り専用',
      'No activity yet.':'まだ編集履歴はありません。','Group Invite Code (Optional)':'グループ招待コード（任意）','If you are joining a group, enter the invite code from the group organizer. Otherwise, leave this blank.':'グループ参加者は主催者の招待コードを入力してください。それ以外は空欄で構いません。',
      'If you select a group size, a group invite code will be generated after submission.':'複数人を選ぶと、送信後にグループ招待コードが発行されます。',
      'Group invite code detected':'グループ招待コードを使用中','Group size is taken from the organizer\'s application, so you do not need to select it again.':'同行人数は主催者の申請を使用するため、再選択は不要です。',
      'Preferred Alliance':'希望同盟','No preference':'希望なし','Not sure yet':'未定','Expected Group Size':'同行予定人数','Usual Active Hours (Server Time)':'通常の活動時間（サーバー時間）',
      'Alliance & State Event Participation':'同盟／州イベント参加度','Alliance Management Experience':'同盟管理経験','Definitely interested':'ぜひ移民したい',
      'Strongly considering':'前向きに検討','Want to learn more':'まず詳しく知りたい','Highly active (join every event)':'非常に活発（毎回参加）','Moderate':'普通','Occasionally':'時々','Rarely':'ほとんど参加しない',
      'Basic Information':'基本情報','Account Overview':'戦力概要','Migration Interest':'移民意向','What would you like to know about State 618?':'STATE 618について知りたいことは？',
      'NAP & State Rules':'NAP／州ルール','Alliance Profiles':'同盟紹介','Other':'その他','Additional Notes':'追加メモ','Submit Application':'申請を送信',
      'Status Checker · Live':'申請状況確認','Check Status':'進捗を確認','Application Status':'申請進捗','Applicant Message':'申請者メッセージ','Questions':'知りたい内容'
    },
    ko: {
      'Alliance Management':'연맹 관리','ALLIANCE MANAGEMENT':'연맹 관리','Migration Review Console':'이민 신청 심사 관리',
      'MANAGER ACCESS':'관리자 로그인','Alliance':'연맹','Select alliance':'연맹 선택','Management Access Key':'관리자 접근 코드','Enter access key':'접근 코드 입력',
      'Open Dashboard':'관리 화면 열기','Authorized managers only.':'승인된 연맹 관리자만 사용할 수 있습니다.','ALLIANCE DASHBOARD':'연맹 심사 대시보드',
      'Migration application review queue':'이민 신청 심사 대기열','← Back to Login':'← 로그인으로','What do I do here?':'이 페이지에서 무엇을 하나요?',
      'Use these four steps for each application.':'각 신청을 다음 4단계로 처리하세요.','Select an applicant on the left':'왼쪽에서 신청자 선택','Review the details on the right':'오른쪽 상세 정보 확인',
      'Assign reviewer and update status':'담당자 입력 및 상태 변경','Add notes and save the review':'내부 메모 작성 후 저장','Under Review':'심사 중','Approved':'승인됨','Waitlist':'대기 명단','Declined':'거절됨',
      'APPLICATION QUEUE':'신청 목록','Applications':'신청','All Status':'전체 상태','APPLICATION DETAIL':'신청 상세','Current State':'현재 주','Current Alliance':'현재 연맹','Total Power':'총 전투력',
      'Kills':'처치 수','Main Troop':'주력 병종','Main Troop Type':'주력 병종','Warrior':'보병','Rider':'기병','Shooter':'사수','Watchtower':'감시탑','Watchtower Level':'감시탑 레벨',
      'Interest':'이민 의향','Group Size':'동행 인원','Group Code':'그룹 초대 코드','Activity':'활동도','Management':'관리 경험','Active Time':'활동 시간','Group Application':'그룹 신청',
      'Shared Candidate':'공유 후보자','Send Offer':'수락 제안','Responsible Alliance':'담당 연맹','Operator Name (Required)':'작업자 이름 (필수)','Enter your in-game name':'게임 내 이름 입력',
      'Status':'신청 상태','Internal Notes':'내부 메모','Save Review':'심사 저장','AUDIT TRAIL':'작업 기록','Activity History':'편집 기록','Read only':'읽기 전용','No activity yet.':'아직 기록이 없습니다.',
      'Group Invite Code (Optional)':'그룹 초대 코드 (선택)','Preferred Alliance':'희망 연맹','No preference':'상관없음','Not sure yet':'아직 미정','Expected Group Size':'예상 동행 인원',
      'Usual Active Hours (Server Time)':'평소 활동 시간 (서버 시간)','Alliance & State Event Participation':'연맹/주 이벤트 참여도','Alliance Management Experience':'연맹 관리 경험',
      'Definitely interested':'확실히 이민하고 싶음','Strongly considering':'적극 고려 중','Want to learn more':'먼저 더 알고 싶음','Highly active (join every event)':'매우 활발함 (매번 참여)','Moderate':'보통','Occasionally':'가끔','Rarely':'거의 없음',
      'Basic Information':'기본 정보','Account Overview':'전투력 개요','Migration Interest':'이민 의향','NAP & State Rules':'NAP / 주 규칙','Alliance Profiles':'연맹 특징','Other':'기타','Additional Notes':'추가 메모',
      'Submit Application':'신청 제출','Status Checker · Live':'신청 상태 조회','Check Status':'진행 상황 조회','Application Status':'신청 진행 상황','Applicant Message':'신청자 메시지','Questions':'궁금한 내용'
    },
    es: {
      'Alliance Management':'Gestión de alianza','ALLIANCE MANAGEMENT':'GESTIÓN DE ALIANZA','Migration Review Console':'Panel de revisión migratoria','MANAGER ACCESS':'ACCESO DE GESTOR',
      'Alliance':'Alianza','Select alliance':'Seleccionar alianza','Management Access Key':'Clave de acceso de gestión','Enter access key':'Introduce la clave','Open Dashboard':'Abrir panel',
      'Authorized managers only.':'Solo para gestores autorizados.','ALLIANCE DASHBOARD':'PANEL DE ALIANZA','Migration application review queue':'Cola de revisión de solicitudes',
      '← Back to Login':'← Volver al inicio','What do I do here?':'¿Qué hago aquí?','Use these four steps for each application.':'Usa estos cuatro pasos para cada solicitud.',
      'Select an applicant on the left':'Selecciona un solicitante a la izquierda','Review the details on the right':'Revisa los datos a la derecha','Assign reviewer and update status':'Asigna responsable y actualiza el estado',
      'Add notes and save the review':'Añade notas y guarda la revisión','Under Review':'En revisión','Approved':'Aprobado','Waitlist':'Lista de espera','Declined':'Rechazado','APPLICATION QUEUE':'COLA DE SOLICITUDES',
      'Applications':'Solicitudes','All Status':'Todos los estados','APPLICATION DETAIL':'DETALLE DE SOLICITUD','Current State':'Estado actual','Current Alliance':'Alianza actual','Total Power':'Poder total','Kills':'Bajas',
      'Main Troop':'Tropa principal','Main Troop Type':'Tipo de tropa principal','Warrior':'Infantería','Rider':'Caballería','Shooter':'Tirador','Watchtower':'Atalaya','Watchtower Level':'Nivel de atalaya',
      'Interest':'Interés','Group Size':'Tamaño del grupo','Group Code':'Código de grupo','Activity':'Actividad','Management':'Experiencia de gestión','Active Time':'Horario activo','Group Application':'Solicitud grupal',
      'Shared Candidate':'Candidato compartido','Send Offer':'Enviar oferta','Responsible Alliance':'Alianza responsable','Operator Name (Required)':'Nombre del operador (obligatorio)','Enter your in-game name':'Introduce tu nombre del juego',
      'Status':'Estado','Internal Notes':'Notas internas','Save Review':'Guardar revisión','AUDIT TRAIL':'REGISTRO DE AUDITORÍA','Activity History':'Historial de actividad','Read only':'Solo lectura','No activity yet.':'Aún no hay actividad.',
      'Group Invite Code (Optional)':'Código de invitación de grupo (opcional)','Preferred Alliance':'Alianza preferida','No preference':'Sin preferencia','Not sure yet':'Aún no lo sé','Expected Group Size':'Tamaño previsto del grupo',
      'Usual Active Hours (Server Time)':'Horario habitual (hora del servidor)','Alliance & State Event Participation':'Participación en eventos de alianza/estado','Alliance Management Experience':'Experiencia gestionando alianza',
      'Definitely interested':'Definitivamente interesado','Strongly considering':'Muy interesado','Want to learn more':'Quiero saber más','Highly active (join every event)':'Muy activo (participo en todos)','Moderate':'Normal','Occasionally':'Ocasional','Rarely':'Casi nunca',
      'Basic Information':'Información básica','Account Overview':'Resumen de cuenta','Migration Interest':'Interés en migrar','NAP & State Rules':'NAP y reglas del estado','Alliance Profiles':'Perfiles de alianzas','Other':'Otro','Additional Notes':'Notas adicionales',
      'Submit Application':'Enviar solicitud','Status Checker · Live':'Consulta de estado','Check Status':'Consultar estado','Application Status':'Estado de solicitud','Applicant Message':'Mensaje del solicitante','Questions':'Preguntas'
    },
    pt: {
      'Alliance Management':'Gestão da aliança','ALLIANCE MANAGEMENT':'GESTÃO DA ALIANÇA','Migration Review Console':'Painel de análise de migração','MANAGER ACCESS':'ACESSO DE GESTOR',
      'Alliance':'Aliança','Select alliance':'Selecionar aliança','Management Access Key':'Chave de acesso da gestão','Enter access key':'Digite a chave','Open Dashboard':'Abrir painel',
      'Authorized managers only.':'Apenas gestores autorizados.','ALLIANCE DASHBOARD':'PAINEL DA ALIANÇA','Migration application review queue':'Fila de análise de solicitações',
      '← Back to Login':'← Voltar ao login','What do I do here?':'O que faço aqui?','Use these four steps for each application.':'Use estas quatro etapas para cada solicitação.',
      'Under Review':'Em análise','Approved':'Aprovado','Waitlist':'Lista de espera','Declined':'Recusado','APPLICATION QUEUE':'FILA DE SOLICITAÇÕES','Applications':'Solicitações','All Status':'Todos os status',
      'APPLICATION DETAIL':'DETALHES DA SOLICITAÇÃO','Current State':'Estado atual','Current Alliance':'Aliança atual','Total Power':'Poder total','Kills':'Abates','Main Troop':'Tropa principal','Main Troop Type':'Tipo de tropa principal',
      'Warrior':'Infantaria','Rider':'Cavalaria','Shooter':'Atirador','Watchtower':'Torre de vigia','Watchtower Level':'Nível da torre de vigia','Interest':'Interesse','Group Size':'Tamanho do grupo','Group Code':'Código do grupo',
      'Activity':'Atividade','Management':'Experiência de gestão','Active Time':'Horário ativo','Group Application':'Solicitação em grupo','Shared Candidate':'Candidato compartilhado','Send Offer':'Enviar oferta',
      'Responsible Alliance':'Aliança responsável','Operator Name (Required)':'Nome do operador (obrigatório)','Enter your in-game name':'Digite seu nome no jogo','Status':'Status','Internal Notes':'Notas internas',
      'Save Review':'Salvar análise','AUDIT TRAIL':'REGISTRO DE AUDITORIA','Activity History':'Histórico de atividades','Read only':'Somente leitura','No activity yet.':'Ainda não há atividade.',
      'Group Invite Code (Optional)':'Código de convite do grupo (opcional)','Preferred Alliance':'Aliança preferida','No preference':'Sem preferência','Not sure yet':'Ainda não tenho certeza',
      'Expected Group Size':'Tamanho previsto do grupo','Usual Active Hours (Server Time)':'Horário habitual (hora do servidor)','Alliance & State Event Participation':'Participação em eventos da aliança/estado',
      'Alliance Management Experience':'Experiência de gestão de aliança','Definitely interested':'Definitivamente interessado','Strongly considering':'Considerando seriamente','Want to learn more':'Quero saber mais',
      'Highly active (join every event)':'Muito ativo (participo de todos)','Moderate':'Moderado','Occasionally':'Às vezes','Rarely':'Raramente','Basic Information':'Informações básicas','Account Overview':'Resumo da conta',
      'Migration Interest':'Interesse em migrar','NAP & State Rules':'NAP e regras do estado','Alliance Profiles':'Perfis das alianças','Other':'Outro','Additional Notes':'Notas adicionais','Submit Application':'Enviar solicitação',
      'Status Checker · Live':'Consulta de status','Check Status':'Consultar status','Application Status':'Status da solicitação','Applicant Message':'Mensagem do candidato','Questions':'Perguntas'
    },
    fr: {
      'Alliance Management':'Gestion d’alliance','ALLIANCE MANAGEMENT':'GESTION D’ALLIANCE','Migration Review Console':'Console d’examen des migrations','MANAGER ACCESS':'ACCÈS GESTIONNAIRE',
      'Alliance':'Alliance','Select alliance':'Choisir une alliance','Management Access Key':'Clé d’accès gestionnaire','Enter access key':'Saisir la clé','Open Dashboard':'Ouvrir le tableau de bord',
      'Authorized managers only.':'Réservé aux gestionnaires autorisés.','ALLIANCE DASHBOARD':'TABLEAU DE BORD ALLIANCE','Migration application review queue':'File d’examen des candidatures',
      '← Back to Login':'← Retour à la connexion','What do I do here?':'Que dois-je faire ici ?','Use these four steps for each application.':'Suivez ces quatre étapes pour chaque candidature.',
      'Under Review':'En cours d’examen','Approved':'Approuvé','Waitlist':'Liste d’attente','Declined':'Refusé','APPLICATION QUEUE':'FILE DES CANDIDATURES','Applications':'Candidatures','All Status':'Tous les statuts',
      'APPLICATION DETAIL':'DÉTAIL DE LA CANDIDATURE','Current State':'État actuel','Current Alliance':'Alliance actuelle','Total Power':'Puissance totale','Kills':'Éliminations','Main Troop':'Troupe principale',
      'Main Troop Type':'Type de troupe principale','Warrior':'Infanterie','Rider':'Cavalerie','Shooter':'Tireur','Watchtower':'Tour de guet','Watchtower Level':'Niveau de la tour de guet','Interest':'Intérêt',
      'Group Size':'Taille du groupe','Group Code':'Code de groupe','Activity':'Activité','Management':'Expérience de gestion','Active Time':'Heures actives','Group Application':'Candidature de groupe',
      'Shared Candidate':'Candidat partagé','Send Offer':'Envoyer une offre','Responsible Alliance':'Alliance responsable','Operator Name (Required)':'Nom de l’opérateur (obligatoire)','Enter your in-game name':'Saisissez votre nom en jeu',
      'Status':'Statut','Internal Notes':'Notes internes','Save Review':'Enregistrer l’examen','AUDIT TRAIL':'JOURNAL D’AUDIT','Activity History':'Historique des actions','Read only':'Lecture seule','No activity yet.':'Aucune activité pour le moment.',
      'Group Invite Code (Optional)':'Code d’invitation de groupe (facultatif)','Preferred Alliance':'Alliance préférée','No preference':'Aucune préférence','Not sure yet':'Pas encore décidé',
      'Expected Group Size':'Taille prévue du groupe','Usual Active Hours (Server Time)':'Heures habituelles (heure serveur)','Alliance & State Event Participation':'Participation aux événements alliance/état',
      'Alliance Management Experience':'Expérience de gestion d’alliance','Definitely interested':'Très intéressé','Strongly considering':'Envisage sérieusement','Want to learn more':'Souhaite en savoir plus',
      'Highly active (join every event)':'Très actif (tous les événements)','Moderate':'Modéré','Occasionally':'Occasionnellement','Rarely':'Rarement','Basic Information':'Informations de base','Account Overview':'Aperçu du compte',
      'Migration Interest':'Intérêt pour la migration','NAP & State Rules':'NAP et règles de l’État','Alliance Profiles':'Profils des alliances','Other':'Autre','Additional Notes':'Notes supplémentaires','Submit Application':'Envoyer la candidature',
      'Status Checker · Live':'Suivi de candidature','Check Status':'Vérifier le statut','Application Status':'Statut de la candidature','Applicant Message':'Message du candidat','Questions':'Questions'
    },
    de: {
      'Alliance Management':'Allianzverwaltung','ALLIANCE MANAGEMENT':'ALLIANZVERWALTUNG','Migration Review Console':'Prüfkonsole für Migration','MANAGER ACCESS':'MANAGER-ZUGANG',
      'Alliance':'Allianz','Select alliance':'Allianz auswählen','Management Access Key':'Manager-Zugangscode','Enter access key':'Zugangscode eingeben','Open Dashboard':'Dashboard öffnen',
      'Authorized managers only.':'Nur für autorisierte Manager.','ALLIANCE DASHBOARD':'ALLIANZ-DASHBOARD','Migration application review queue':'Prüfliste der Migrationsanträge',
      '← Back to Login':'← Zurück zur Anmeldung','What do I do here?':'Was mache ich hier?','Use these four steps for each application.':'Bearbeite jeden Antrag in diesen vier Schritten.',
      'Under Review':'In Prüfung','Approved':'Genehmigt','Waitlist':'Warteliste','Declined':'Abgelehnt','APPLICATION QUEUE':'ANTRAGSLISTE','Applications':'Anträge','All Status':'Alle Status',
      'APPLICATION DETAIL':'ANTRAGSDETAILS','Current State':'Aktueller Staat','Current Alliance':'Aktuelle Allianz','Total Power':'Gesamtstärke','Kills':'Kills','Main Troop':'Haupttruppe','Main Troop Type':'Haupttruppentyp',
      'Warrior':'Infanterie','Rider':'Kavallerie','Shooter':'Schütze','Watchtower':'Wachturm','Watchtower Level':'Wachturm-Level','Interest':'Interesse','Group Size':'Gruppengröße','Group Code':'Gruppencode',
      'Activity':'Aktivität','Management':'Management-Erfahrung','Active Time':'Aktive Zeit','Group Application':'Gruppenantrag','Shared Candidate':'Geteilter Kandidat','Send Offer':'Angebot senden',
      'Responsible Alliance':'Zuständige Allianz','Operator Name (Required)':'Bearbeitername (Pflicht)','Enter your in-game name':'Spielnamen eingeben','Status':'Status','Internal Notes':'Interne Notizen',
      'Save Review':'Prüfung speichern','AUDIT TRAIL':'ÄNDERUNGSPROTOKOLL','Activity History':'Aktivitätsverlauf','Read only':'Nur lesen','No activity yet.':'Noch keine Aktivität.',
      'Group Invite Code (Optional)':'Gruppen-Einladungscode (optional)','Preferred Alliance':'Bevorzugte Allianz','No preference':'Keine Präferenz','Not sure yet':'Noch unentschieden',
      'Expected Group Size':'Erwartete Gruppengröße','Usual Active Hours (Server Time)':'Übliche Aktivzeit (Serverzeit)','Alliance & State Event Participation':'Teilnahme an Allianz-/Staatsevents',
      'Alliance Management Experience':'Erfahrung in der Allianzverwaltung','Definitely interested':'Definitiv interessiert','Strongly considering':'Stark interessiert','Want to learn more':'Möchte mehr erfahren',
      'Highly active (join every event)':'Sehr aktiv (bei jedem Event)','Moderate':'Normal','Occasionally':'Gelegentlich','Rarely':'Selten','Basic Information':'Grunddaten','Account Overview':'Kontoübersicht',
      'Migration Interest':'Migrationsinteresse','NAP & State Rules':'NAP & Staatsregeln','Alliance Profiles':'Allianzprofile','Other':'Sonstiges','Additional Notes':'Zusätzliche Hinweise','Submit Application':'Antrag senden',
      'Status Checker · Live':'Statusabfrage','Check Status':'Status prüfen','Application Status':'Antragsstatus','Applicant Message':'Nachricht des Antragstellers','Questions':'Fragen'
    }
  };

  const PAGE_T = {
    ja: {
      'HOW IT WORKS':'申請の流れ',
      'What happens next':'申請後の流れ',
      'Submit your application, wait for review, and check your progress anytime with your Player ID.':'申請を送信した後は審査を待ち、Player IDでいつでも進捗を確認できます。',
      'Submit your application':'申請を送信',
      'Complete your migration interest and basic information, then submit your application.':'移民意向と基本情報を入力して、618への移民申請を送信してください。',
      'Review & interview':'審査と面談',
      'State 618 staff will review your application; if you selected an alliance, its management team will contact you for an interview.':'State 618の管理チームが申請を審査します。希望同盟を選択した場合は、その同盟の管理者が連絡し、面談を調整します。',
      'Check your status':'進捗を確認',
      'Use your Player ID to check your status anytime and wait for further contact.':'Player IDを使っていつでも申請状況を確認し、次の連絡をお待ちください。',
      'Please be patient while your application is being reviewed. If you selected a preferred alliance, the appropriate alliance representative will contact you when necessary.':'申請の審査中はしばらくお待ちください。希望同盟を選択した場合、必要に応じて該当同盟の担当者から連絡します。'
    },
    ko: {
      'HOW IT WORKS':'신청 절차',
      'What happens next':'신청 후 절차',
      'Submit your application, wait for review, and check your progress anytime with your Player ID.':'신청서를 제출한 뒤 심사를 기다리고, Player ID로 언제든 진행 상황을 확인할 수 있습니다.',
      'Submit your application':'신청서 제출',
      'Complete your migration interest and basic information, then submit your application.':'이민 의향과 기본 정보를 작성한 후 618 이민 신청서를 제출하세요.',
      'Review & interview':'심사 및 인터뷰',
      'State 618 staff will review your application; if you selected an alliance, its management team will contact you for an interview.':'State 618 운영진이 신청서를 검토합니다. 희망 연맹을 선택했다면 해당 연맹 관리진이 연락하여 인터뷰를 진행합니다.',
      'Check your status':'진행 상황 확인',
      'Use your Player ID to check your status anytime and wait for further contact.':'Player ID로 언제든 신청 진행 상황을 확인하고 후속 연락을 기다려 주세요.',
      'Please be patient while your application is being reviewed. If you selected a preferred alliance, the appropriate alliance representative will contact you when necessary.':'신청 심사 중에는 잠시 기다려 주세요. 희망 연맹을 선택했다면 필요할 때 해당 연맹 담당자가 연락드립니다.'
    },
    es: {
      'HOW IT WORKS':'CÓMO FUNCIONA',
      'What happens next':'Qué sucede después',
      'Submit your application, wait for review, and check your progress anytime with your Player ID.':'Envía tu solicitud, espera la revisión y consulta tu progreso en cualquier momento con tu Player ID.',
      'Submit your application':'Envía tu solicitud',
      'Complete your migration interest and basic information, then submit your application.':'Completa tu interés de migración y tus datos básicos, y después envía tu solicitud para el Estado 618.',
      'Review & interview':'Revisión y entrevista',
      'State 618 staff will review your application; if you selected an alliance, its management team will contact you for an interview.':'El equipo del Estado 618 revisará tu solicitud. Si elegiste una alianza, su equipo de gestión se pondrá en contacto contigo para una entrevista.',
      'Check your status':'Consulta tu estado',
      'Use your Player ID to check your status anytime and wait for further contact.':'Usa tu Player ID para consultar el estado de tu solicitud en cualquier momento y espera el próximo contacto.',
      'Please be patient while your application is being reviewed. If you selected a preferred alliance, the appropriate alliance representative will contact you when necessary.':'Ten paciencia mientras revisamos tu solicitud. Si elegiste una alianza preferida, su representante se pondrá en contacto contigo cuando sea necesario.'
    },
    pt: {
      'HOW IT WORKS':'COMO FUNCIONA',
      'What happens next':'O que acontece depois',
      'Submit your application, wait for review, and check your progress anytime with your Player ID.':'Envie sua solicitação, aguarde a análise e acompanhe o progresso a qualquer momento com seu Player ID.',
      'Submit your application':'Envie sua solicitação',
      'Complete your migration interest and basic information, then submit your application.':'Preencha seu interesse em migrar e as informações básicas e, em seguida, envie sua solicitação para o Estado 618.',
      'Review & interview':'Análise e entrevista',
      'State 618 staff will review your application; if you selected an alliance, its management team will contact you for an interview.':'A equipe do Estado 618 analisará sua solicitação. Se você escolheu uma aliança, a gestão dessa aliança entrará em contato para uma entrevista.',
      'Check your status':'Consulte seu status',
      'Use your Player ID to check your status anytime and wait for further contact.':'Use seu Player ID para consultar o status da solicitação a qualquer momento e aguarde o próximo contato.',
      'Please be patient while your application is being reviewed. If you selected a preferred alliance, the appropriate alliance representative will contact you when necessary.':'Aguarde enquanto sua solicitação é analisada. Se você escolheu uma aliança preferida, o representante correspondente entrará em contato quando necessário.'
    },
    fr: {
      'HOW IT WORKS':'COMMENT ÇA MARCHE',
      'What happens next':'Que se passe-t-il ensuite ?',
      'Submit your application, wait for review, and check your progress anytime with your Player ID.':'Envoyez votre candidature, attendez son examen et suivez son avancement à tout moment avec votre Player ID.',
      'Submit your application':'Envoyez votre candidature',
      'Complete your migration interest and basic information, then submit your application.':'Indiquez votre intérêt pour la migration et vos informations de base, puis envoyez votre candidature pour l’État 618.',
      'Review & interview':'Examen et entretien',
      'State 618 staff will review your application; if you selected an alliance, its management team will contact you for an interview.':'L’équipe de l’État 618 examinera votre candidature. Si vous avez choisi une alliance, son équipe de gestion vous contactera pour un entretien.',
      'Check your status':'Consultez votre statut',
      'Use your Player ID to check your status anytime and wait for further contact.':'Utilisez votre Player ID pour consulter votre statut à tout moment et attendez la suite des échanges.',
      'Please be patient while your application is being reviewed. If you selected a preferred alliance, the appropriate alliance representative will contact you when necessary.':'Merci de patienter pendant l’examen de votre candidature. Si vous avez choisi une alliance préférée, son représentant vous contactera si nécessaire.'
    },
    de: {
      'HOW IT WORKS':'SO FUNKTIONIERT ES',
      'What happens next':'Wie geht es weiter?',
      'Submit your application, wait for review, and check your progress anytime with your Player ID.':'Sende deinen Antrag ab, warte auf die Prüfung und überprüfe deinen Fortschritt jederzeit mit deiner Player ID.',
      'Submit your application':'Antrag absenden',
      'Complete your migration interest and basic information, then submit your application.':'Fülle dein Migrationsinteresse und deine Basisdaten aus und sende anschließend deinen Antrag für State 618 ab.',
      'Review & interview':'Prüfung und Gespräch',
      'State 618 staff will review your application; if you selected an alliance, its management team will contact you for an interview.':'Das Team von State 618 prüft deinen Antrag. Wenn du eine Allianz ausgewählt hast, wird deren Management dich für ein Gespräch kontaktieren.',
      'Check your status':'Status prüfen',
      'Use your Player ID to check your status anytime and wait for further contact.':'Mit deiner Player ID kannst du deinen Status jederzeit prüfen und auf die weitere Kontaktaufnahme warten.',
      'Please be patient while your application is being reviewed. If you selected a preferred alliance, the appropriate alliance representative will contact you when necessary.':'Bitte habe etwas Geduld, während dein Antrag geprüft wird. Wenn du eine bevorzugte Allianz gewählt hast, meldet sich deren zuständige Person bei Bedarf.'
    }
  };
  Object.keys(PAGE_T).forEach((lang) => Object.assign(T[lang], PAGE_T[lang]));

  const han = /[\u3400-\u9fff]/;
  const splitNodes = [];
  const languageOnly = [];

  function translate(en, zh, mode) {
    const current = mode || document.documentElement.dataset.language || 'bi';
    if (current === 'zh') return zh || en || '';
    if (current === 'en') return en || zh || '';
    if (current === 'bi') return (zh && en) ? zh + ' / ' + en : (zh || en || '');
    const table = T[current] || {};
    return table[en] || en || zh || '';
  }

  function explicitText(mode) {
    document.querySelectorAll('[data-i18n-zh][data-i18n-en]').forEach((el) => {
      const zh = el.dataset.i18nZh || '';
      const en = el.dataset.i18nEn || '';
      el.textContent = translate(en, zh, mode);
    });

    document.querySelectorAll('[data-placeholder-zh][data-placeholder-en]').forEach((el) => {
      const zh = el.dataset.placeholderZh || '';
      const en = el.dataset.placeholderEn || '';
      el.placeholder = translate(en, zh, mode);
    });
  }

  function detectPair(text) {
    const trimmed = text.trim();
    for (const sep of [' / ']) {
      const parts = trimmed.split(sep);
      if (parts.length !== 2) continue;
      const leftHan = han.test(parts[0]);
      const rightHan = han.test(parts[1]);
      if (leftHan === rightHan) continue;
      return {
        zh: leftHan ? parts[0] : parts[1],
        en: leftHan ? parts[1] : parts[0]
      };
    }
    return null;
  }

  function scanFallbackPairs() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const parent = node.parentElement;
      if (!parent || ['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'OPTION'].includes(parent.tagName)) continue;
      if (parent.closest('[data-i18n-zh]')) continue;
      const pair = detectPair(node.nodeValue || '');
      if (!pair) continue;
      splitNodes.push({ node, original: node.nodeValue, zh: pair.zh, en: pair.en });
    }
  }

  function scanLanguageOnly() {
    document.querySelectorAll('.zh, .en').forEach((el) => {
      languageOnly.push({ el, lang: el.classList.contains('zh') ? 'zh' : 'en' });
    });
  }

  function applyFallbackPairs(mode) {
    splitNodes.forEach((item) => {
      const leading = item.original.match(/^\s*/)?.[0] || '';
      const trailing = item.original.match(/\s*$/)?.[0] || '';
      item.node.nodeValue = leading + translate(item.en, item.zh, mode) + trailing;
    });
  }

  function setMode(mode) {
    if (!MODES.includes(mode)) mode = 'bi';
    document.documentElement.dataset.language = mode;
    document.documentElement.lang = HTML_LANG[mode] || 'en';
    localStorage.setItem(STORAGE_KEY, mode);

    explicitText(mode);
    applyFallbackPairs(mode);

    languageOnly.forEach(({ el, lang }) => {
      if (mode === 'bi') el.hidden = false;
      else if (mode === 'zh') el.hidden = lang !== 'zh';
      else el.hidden = lang !== 'en';
    });

    document.querySelectorAll('.language-option').forEach((button) => {
      button.classList.toggle('active', button.dataset.language === mode);
    });

    const label = document.querySelector('.language-current');
    if (label) label.textContent = LABELS[mode] || 'LANG';

    window.dispatchEvent(new CustomEvent('state618:languagechange', { detail: { language: mode } }));
  }

  function buildControl() {
    const details = document.createElement('details');
    details.className = 'language-switcher';
    details.innerHTML = `
      <summary aria-label="Language selector">
        <span>LANG</span>
        <strong class="language-current">雙語</strong>
      </summary>
      <div class="language-menu">
        <button type="button" class="language-option" data-language="bi">雙語 / Bilingual</button>
        <button type="button" class="language-option" data-language="zh">繁體中文</button>
        <button type="button" class="language-option" data-language="en">English</button>
        <button type="button" class="language-option" data-language="ja">日本語</button>
        <button type="button" class="language-option" data-language="ko">한국어</button>
        <button type="button" class="language-option" data-language="es">Español</button>
        <button type="button" class="language-option" data-language="pt">Português</button>
        <button type="button" class="language-option" data-language="fr">Français</button>
        <button type="button" class="language-option" data-language="de">Deutsch</button>
      </div>
    `;
    document.body.appendChild(details);

    details.querySelectorAll('.language-option').forEach((button) => {
      button.addEventListener('click', () => {
        setMode(button.dataset.language);
        details.open = false;
      });
    });
  }

  window.STATE618_I18N = {
    translate: (en, zh) => translate(en, zh),
    getLanguage: () => document.documentElement.dataset.language || 'bi',
    setLanguage: setMode,
    modes: MODES.slice()
  };

  buildControl();
  scanFallbackPairs();
  scanLanguageOnly();
  setMode(localStorage.getItem(STORAGE_KEY) || 'bi');
})();