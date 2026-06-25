export type Language = 'en' | 'te' | 'hi';

export interface TranslationSet {
  appName: string;
  appSubtitle: string;
  depotShop: string;
  emergencyHotline: string;
  registerDeadline: string;
  crisisSaveStreak: string;
  consecutiveSaves: string;
  totalDeadlinesSaved: string;
  earnPointsPerSave: string;
  failedOverdue: string;
  missedTargets: string;
  systemPanicIndex: string;
  highDisasterDanger: string;
  workloadOverflow: string;
  underControl: string;
  allClear: string;
  noCommitmentsMatch: string;
  registerFirstDeadlineDesc: string;
  registerFirstDeadlineBtn: string;
  timeRemaining: string;
  saved: string;
  immediateActionRequired: string;
  procrastinationZone: string;
  easyPace: string;
  onTimeSaveSuccess: string;
  deadlineMissed: string;
  aiSaveMeCreatePlan: string;
  viewRescueActionBlueprint: string;
  tacticalPlanningInProgress: string;
  
  // Modals & Forms
  addDeadlineTitle: string;
  editDeadlineTitle: string;
  taskNameLabel: string;
  deadlineLabel: string;
  categoryLabel: string;
  impactLabel: string;
  workloadLabel: string;
  hoursLabel: string;
  workloadHelpText: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  cancelBtn: string;
  addRadarBtn: string;
  updateTaskBtn: string;
  
  // Filter bar
  pendingTab: string;
  savedTab: string;
  missedTab: string;
  allTab: string;
  allCategories: string;
  searchPlaceholder: string;
  
  // Depot Shop
  rewardsDepotTitle: string;
  balanceLabel: string;
  streakInsuranceTitle: string;
  streakInsuranceDesc: string;
  streakInsuranceActive: string;
  streakInsuranceBtn: string;
  missedTaskBuyBackTitle: string;
  missedTaskBuyBackDesc: string;
  missedTaskBuyBackBtn: string;
  checklistBoosterTitle: string;
  checklistBoosterDesc: string;
  checklistBoosterBtn: string;
  
  // Rescue Plan Tabs & Core
  rescueMissionProgress: string;
  hoursPlanned: string;
  aiCoachTitle: string;
  aiCoachHelpText: string;
  coreBlueprints: string;
  hourlyBreakdowns: string;
  atomicChecklist: string;
  antiProcrastinationHacks: string;
  proactiveDrafts: string;
  highUtilityOverride: string;
  freezeModeBreaker: string;
  dropZoneOrganizer: string;
  calendarHijacker: string;
  hijackedStatus: string;
  
  // Hourly Schedule
  tacticalTimeAllocation: string;
  tacticalTimeAllocationDesc: string;
  deliverableLabel: string;
  
  // Atomic Checklist
  atomicChecklistDesc: string;
  
  // Hacks
  hacksDesc: string;
  focusHackLabel: string;
  
  // Drafts
  blankPageAssistant: string;
  blankPageAssistantDesc: string;
  instantOutline: string;
  instantOutlineDesc: string;
  starterDraft: string;
  starterDraftDesc: string;
  extensionRequest: string;
  extensionRequestDesc: string;
  generatedLabel: string;
  copyBtn: string;
  copiedBtn: string;
  draftingInProgress: string;
  
  // Freeze Mode
  freezeModeTitle: string;
  freezeModeDesc: string;
  ambientFocusDrone: string;
  activeFocusCommandment: string;
  freezeModeActionDesc: string;
  advanceBtn: string;
  allStepsChecked: string;
  conqueredFreezeLoop: string;
  coDraftTitle: string;
  coDraftDesc: string;
  rawBrainDumpLabel: string;
  rawBrainDumpPlaceholder: string;
  elevateThoughtsBtn: string;
  elevatingThoughtsProgress: string;
  polishedProseLabel: string;
  polishedProsePlaceholder: string;
  
  // Drop Zone
  dropZoneTitle: string;
  dropZoneDesc: string;
  pasteContextLabel: string;
  pasteContextPlaceholder: string;
  organizingChaosBtn: string;
  organizingChaosProgress: string;
  aiOrganizedCheatSheet: string;
  
  // Calendar Hijacker
  calendarHijackerTitle: string;
  calendarHijackerDesc: string;
  timelineReroutingProgress: string;
  calendarHijackedSuccess: string;
  hijackCalendarBtn: string;
}

export const translations: Record<Language, TranslationSet> = {
  en: {
    appName: "The Last-Minute Life Saver",
    appSubtitle: "Emergency AI Productivity Companion",
    depotShop: "Depot Shop",
    emergencyHotline: "Emergency Hotline",
    registerDeadline: "Register Deadline",
    crisisSaveStreak: "Crisis Save Streak",
    consecutiveSaves: "Consecutive saves!",
    totalDeadlinesSaved: "Total Deadlines Saved",
    earnPointsPerSave: "Earn +15 CP per save!",
    failedOverdue: "Failed / Overdue",
    missedTargets: "Missed targets",
    systemPanicIndex: "System Panic Index",
    highDisasterDanger: "🔥 High Disaster Danger",
    workloadOverflow: "⚠️ Workload Overflow",
    underControl: "✨ Under Control",
    allClear: "✨ ALL CLEAR",
    noCommitmentsMatch: "No commitments match the filters",
    registerFirstDeadlineDesc: "Keep adding your upcoming deadlines, school work, meetings, or bills to ensure you stay in control.",
    registerFirstDeadlineBtn: "Register Your First Deadline",
    timeRemaining: "Time Remaining:",
    saved: "Saved",
    immediateActionRequired: "🚨 Immediate action required: work exceeds remaining window!",
    procrastinationZone: "⚠️ Procrastination zone. Build momentum now.",
    easyPace: "💡 Easy pace. Stick to schedule to finish comfortably.",
    onTimeSaveSuccess: "On-Time Save Successful!",
    deadlineMissed: "Deadline Missed",
    aiSaveMeCreatePlan: "AI Save Me (Create Plan)",
    viewRescueActionBlueprint: "View Rescue Action Blueprint",
    tacticalPlanningInProgress: "Tactical Planning...",
    
    // Modals & Forms
    addDeadlineTitle: "Register New Deadline",
    editDeadlineTitle: "Edit Impending Deadline",
    taskNameLabel: "Task or Commitment Name *",
    deadlineLabel: "Impending Deadline (Date & Time) *",
    categoryLabel: "Category",
    impactLabel: "Impact / Priority",
    workloadLabel: "Est. Focused Workload (Hours) *",
    hoursLabel: "Hours",
    workloadHelpText: "The AI uses this to calculate your Panic Index based on remaining time.",
    descriptionLabel: "Description & Context",
    descriptionPlaceholder: "Provide prompt details, resources, grading rubric, or account details to help the AI generate tailored blueprints...",
    cancelBtn: "Cancel",
    addRadarBtn: "Add to Hotline Radar",
    updateTaskBtn: "Update Task",
    
    // Filter bar
    pendingTab: "Pending",
    savedTab: "Saved",
    missedTab: "Missed",
    allTab: "All",
    allCategories: "All Categories",
    searchPlaceholder: "Search commitments...",
    
    // Depot Shop
    rewardsDepotTitle: "Crisis Point Rewards & Insurance Depot",
    balanceLabel: "Your Balance:",
    streakInsuranceTitle: "Streak Insurance",
    streakInsuranceDesc: "Shields your active Save Streak from breaking on your next missed deadline. Forgives one overdue task.",
    streakInsuranceActive: "Insurance Active",
    streakInsuranceBtn: "Activate Insurance",
    missedTaskBuyBackTitle: "Missed Task Buy-Back",
    missedTaskBuyBackDesc: "Restores your first failed/missed task back to active state, extends its deadline by 24 hours, and bumps your streak!",
    missedTaskBuyBackBtn: "Buy Back & Extend (24h)",
    checklistBoosterTitle: "AI Checklist Booster",
    checklistBoosterDesc: "Instantly unlocks a pre-configured, 5-step freeze-breaker checklist for any pending task to kickstart work.",
    checklistBoosterBtn: "Unlock AI Booster",
    
    // Rescue Plan Tabs & Core
    rescueMissionProgress: "Rescue Mission Progress",
    hoursPlanned: "Hrs Planned",
    aiCoachTitle: "AI Coach Tactical Strategy",
    aiCoachHelpText: "Sergeant advice: Procrastination is a freeze state. Turn off your router/phone block, commit 5 minutes.",
    coreBlueprints: "Core Blueprints",
    hourlyBreakdowns: "Hourly Breakdowns",
    atomicChecklist: "Atomic Checklist",
    antiProcrastinationHacks: "Anti-Procrastination Hacks",
    proactiveDrafts: "Proactive Drafts",
    highUtilityOverride: "High-Utility Override",
    freezeModeBreaker: "Freeze-Mode Breaker",
    dropZoneOrganizer: "Drop Zone Note Organizer",
    calendarHijacker: "Calendar Hijacker",
    hijackedStatus: "HIJACKED",
    
    // Hourly Schedule
    tacticalTimeAllocation: "Tactical Time Allocation",
    tacticalTimeAllocationDesc: "A streamlined chronological sequence of intense focus blocks designed to get this done in your remaining window.",
    deliverableLabel: "Deliverable:",
    
    // Atomic Checklist
    atomicChecklistDesc: "Procrastination thrives on big, scary titles. Check off these microscopic, highly defined micro-tasks one by one to build momentum.",
    
    // Hacks
    hacksDesc: "Psychological triggers specifically suited for your category of task to trick your brain into taking immediate action.",
    focusHackLabel: "Focus Hack",
    
    // Drafts
    blankPageAssistant: "Proactive Blank-Page Assistant",
    blankPageAssistantDesc: "Stuck on how to start? Use AI to generate a structural outline, write an introductory launch paragraph, or draft a polite extension email right now.",
    instantOutline: "1. Instant Outline",
    instantOutlineDesc: "Section headers and structure",
    starterDraft: "2. Starter Draft",
    starterDraftDesc: "First paragraph generation",
    extensionRequest: "3. Extension Request",
    extensionRequestDesc: "Professional request email",
    generatedLabel: "Generated",
    copyBtn: "Copy to Clipboard",
    copiedBtn: "Copied!",
    draftingInProgress: "Drafting emergency materials...",
    
    // Freeze Mode
    freezeModeTitle: "Psychological Freeze-Mode Breaker",
    freezeModeDesc: "Everything else is hidden. Focus on exactly ONE micro-step and clear your blank page blocker.",
    ambientFocusDrone: "Ambient Focus Drone",
    activeFocusCommandment: "Active Single-Focus Commandment",
    freezeModeActionDesc: "Block out all secondary ideas. Dedicate just 3 minutes right now.",
    advanceBtn: "Step Completed, Advance Me!",
    allStepsChecked: "All Atomic Steps Checked!",
    conqueredFreezeLoop: "You conquered the freeze loop for this task!",
    coDraftTitle: "Interactive Co-Drafting (Unblock the page)",
    coDraftDesc: "Type your chaotic, raw, unorganized thoughts. AI will elevate it into clean, structured paragraphs instantly.",
    rawBrainDumpLabel: "1. Raw Brain Dump",
    rawBrainDumpPlaceholder: "e.g. chemistry crystallization is when molecules line up into grids. copper sulfate starts blue. explain this but sound professional...",
    elevateThoughtsBtn: "Convert to Professional Prose",
    elevatingThoughtsProgress: "Elevating thoughts...",
    polishedProseLabel: "2. Polished Masterpiece",
    polishedProsePlaceholder: "Formatted paragraph will appear here...",
    
    // Drop Zone
    dropZoneTitle: "\"Drop Zone\" Context Ingestion",
    dropZoneDesc: "Have chaotic notes, textbook screenshots, or random research copied from the web? Dump them here. Our AI will clean the noise and construct a master Cheat Sheet.",
    pasteContextLabel: "Paste Context / Chaotic Notes",
    pasteContextPlaceholder: "Blindly dump links, random textbook paragraphs, syllabus requirements, or meeting transcripts here...",
    organizingChaosBtn: "De-clutter Notes & Create Cheat Sheet",
    organizingChaosProgress: "Organizing Chaos...",
    aiOrganizedCheatSheet: "AI Organized Cheat Sheet",
    
    // Calendar Hijacker
    calendarHijackerTitle: "Autonomous Calendar Hijacker (Time Block)",
    calendarHijackerDesc: "Procrastination is often caused by a lack of strict time boundaries. Scan your day's low-priority distraction events and hard-block them into official, uninterrupted Focus Rescue Slots.",
    timelineReroutingProgress: "Rerouting timeline blocks & notifying clients...",
    calendarHijackedSuccess: "Emergency Focus Slots Hard-Blocked on Calendar!",
    hijackCalendarBtn: "Hijack Calendar Distractions & Lock Time"
  },
  te: {
    appName: "చివరి నిమిషం ప్రాణరక్షకుడు",
    appSubtitle: "అత్యవసర AI ఉత్పాదకత సహచరుడు",
    depotShop: "డిపో షాప్",
    emergencyHotline: "అత్యవసర హాట్‌లైన్",
    registerDeadline: "గడువు నమోదు చేయండి",
    crisisSaveStreak: "సంక్షోభ సేవ్ స్ట్రీక్",
    consecutiveSaves: "వరుస రక్షణలు!",
    totalDeadlinesSaved: "మొత్తం గడువులు సేవ్ చేయబడ్డాయి",
    earnPointsPerSave: "ప్రతి సేవ్‌కు +15 CP పొందండి!",
    failedOverdue: "విఫలమైనవి / గడువు ముగిసినవి",
    missedTargets: "తప్పిన లక్ష్యాలు",
    systemPanicIndex: "సిస్టమ్ భయాందోళన సూచిక",
    highDisasterDanger: "🔥 తీవ్ర విపత్తు ప్రమాదం",
    workloadOverflow: "⚠️ విపరీతమైన పని భారం",
    underControl: "✨ అంతా అదుపులో ఉంది",
    allClear: "✨ అంతా శుభం",
    noCommitmentsMatch: "ఫిల్టర్‌లకు సరిపోయే పనులు లేవు",
    registerFirstDeadlineDesc: "మీరు నియంత్రణలో ఉండేలా చూసుకోవడానికి మీ రాబోయే గడువులు, పాఠశాల పనులు, సమావేశాలు లేదా బిల్లులను జోడిస్తూ ఉండండి.",
    registerFirstDeadlineBtn: "మీ మొదటి గడువును నమోదు చేయండి",
    timeRemaining: "మిగిలి ఉన్న సమయం:",
    saved: "సురక్షితం",
    immediateActionRequired: "🚨 తక్షణ చర్య అవసరం: పని మిగిలిన సమయం కంటే ఎక్కువ ఉంది!",
    procrastinationZone: "⚠️ ఆలస్య జోన్. ఇప్పుడే పని ప్రారంభించండి.",
    easyPace: "💡 సులభమైన వేగం. హాయిగా పూర్తి చేయడానికి షెడ్యూల్‌ను అనుసరించండి.",
    onTimeSaveSuccess: "సమయానికి సురక్షితంగా పూర్తయింది!",
    deadlineMissed: "గడువు ముగిసింది",
    aiSaveMeCreatePlan: "AI నన్ను రక్షించు (ప్రణాళిక చేయి)",
    viewRescueActionBlueprint: "రెస్క్యూ యాక్షన్ బ్లూప్రింట్ చూడండి",
    tacticalPlanningInProgress: "వ్యూహాత్మక ప్రణాళిక...",
    
    // Modals & Forms
    addDeadlineTitle: "కొత్త గడువును నమోదు చేయండి",
    editDeadlineTitle: "గడువును సవరించండి",
    taskNameLabel: "పని లేదా నిబద్ధత పేరు *",
    deadlineLabel: "రాబోయే గడువు (తేదీ & సమయం) *",
    categoryLabel: "వర్గం",
    impactLabel: "ప్రభావం / ప్రాధాన్యత",
    workloadLabel: "అంచనా వేసిన పని గంటలు *",
    hoursLabel: "గంటలు",
    workloadHelpText: "మిగిలి ఉన్న సమయం ఆధారంగా మీ భయాందోళన సూచికను లెక్కించడానికి AI దీనిని ఉపయోగిస్తుంది.",
    descriptionLabel: "వివరణ & సందర్భం",
    descriptionPlaceholder: "AI అనుకూలీకరించిన ప్రణాళికను రూపొందించడంలో సహాయపడటానికి వివరాలు, వనరులు లేదా సమాచారాన్ని అందించండి...",
    cancelBtn: "రద్దు చేయి",
    addRadarBtn: "హాట్‌లైన్ రాడార్‌కు జోడించు",
    updateTaskBtn: "పనిని నవీకరించు",
    
    // Filter bar
    pendingTab: "పెండింగ్",
    savedTab: "పూర్తయినవి",
    missedTab: "తప్పినవి",
    allTab: "అన్నీ",
    allCategories: "అన్ని వర్గాలు",
    searchPlaceholder: "పనులను వెతకండి...",
    
    // Depot Shop
    rewardsDepotTitle: "సంక్షోభ పాయింట్లు & బీమా డిపో",
    balanceLabel: "మీ బ్యాలెన్స్:",
    streakInsuranceTitle: "స్ట్రీక్ భీమా",
    streakInsuranceDesc: "మీ తదుపరి గడువు తప్పిపోయినా మీ సేవ్ స్ట్రీక్ విరిగిపోకుండా రక్షిస్తుంది. ఒక గడువు ముగిసిన పనిని క్షమిస్తుంది.",
    streakInsuranceActive: "భీమా యాక్టివ్‌గా ఉంది",
    streakInsuranceBtn: "బీమాను సక్రియం చేయి",
    missedTaskBuyBackTitle: "తప్పిన పని పునరుద్ధరణ",
    missedTaskBuyBackDesc: "మీ మొదటి విఫలమైన పనిని తిరిగి పెండింగ్ లోకి తెస్తుంది, గడువును 24 గంటలు పొడిగిస్తుంది మరియు స్ట్రీక్‌ను పెంచుతుంది!",
    missedTaskBuyBackBtn: "తిరిగి కొనుగోలు చేయి & పొడిగించు (24గం)",
    checklistBoosterTitle: "AI చెక్‌లిస్ట్ బూస్టర్",
    checklistBoosterDesc: "పనిని త్వరగా ప్రారంభించడానికి ఏదైనా పెండింగ్ పని కోసం 5-దశల ఫ్రీజ్-బ్రేకర్ చెక్‌లిస్ట్‌ను వెంటనే అన్‌లాక్ చేస్తుంది.",
    checklistBoosterBtn: "AI బూస్టర్‌ను అన్‌లాక్ చేయి",
    
    // Rescue Plan Tabs & Core
    rescueMissionProgress: "రెస్క్యూ మిషన్ పురోగతి",
    hoursPlanned: "గంటలు ప్రణాళిక చేయబడ్డాయి",
    aiCoachTitle: "AI కోచ్ వ్యూహాత్మక ప్రణాళిక",
    aiCoachHelpText: "సార్జెంట్ సలహా: ఆలస్యం చేయడం అనేది భయాందోళనల వల్ల వచ్చే స్తబ్దత. మీ వైఫై లేదా ఫోన్‌ను కాసేపు పక్కన పెట్టి, 5 నిమిషాలు కేటాయించండి.",
    coreBlueprints: "ప్రధాన ప్రణాళికలు",
    hourlyBreakdowns: "గంటవారీ విభజన",
    atomicChecklist: "అణు చెక్‌లిస్ట్",
    antiProcrastinationHacks: "ఆలస్య వ్యతిరేక చిట్కాలు",
    proactiveDrafts: "సహాయక ముసాయిదాలు",
    highUtilityOverride: "అత్యవసర నియంత్రణ",
    freezeModeBreaker: "స్తబ్దత నివారణి (ఫ్రీజ్-బ్రేకర్)",
    dropZoneOrganizer: "నోట్స్ ఆర్గనైజర్",
    calendarHijacker: "క్యాలెండర్ హైజాకర్",
    hijackedStatus: "హైజాక్ చేయబడింది",
    
    // Hourly Schedule
    tacticalTimeAllocation: "వ్యూహాత్మక సమయ కేటాయింపు",
    tacticalTimeAllocationDesc: "మిగిలి ఉన్న సమయంలో పనిని పూర్తి చేయడానికి రూపొందించిన వరుస సమయ కేటాయింపులు.",
    deliverableLabel: "ఫలితం:",
    
    // Atomic Checklist
    atomicChecklistDesc: "పెద్ద పనులు భయాన్ని కలిగిస్తాయి. వేగాన్ని పెంచడానికి ఈ చిన్న సూక్ష్మ-పనులను ఒక్కొక్కటిగా పూర్తి చేయండి.",
    
    // Hacks
    hacksDesc: "మీ మెదడును వెంటనే పని చేసేలా చేయడానికి మీ పని వర్గానికి సరిపోయే మానసిక చిట్కాలు.",
    focusHackLabel: "ఏకాగ్రత చిట్కా",
    
    // Drafts
    blankPageAssistant: "ప్రోయాక్టివ్ ముసాయిదా సహాయకుడు",
    blankPageAssistantDesc: "ఎలా ప్రారంభించాలో తెలియడం లేదా? ఒక రూపురేఖలను రూపొందించడానికి, పరిచయ వ్యాసాన్ని వ్రాయడానికి లేదా గడువు పొడిగింపు ఇమెయిల్‌ను సిద్ధం చేయడానికి AI ని ఉపయోగించండి.",
    instantOutline: "1. తక్షణ రూపురేఖలు",
    instantOutlineDesc: "విభాగాలు మరియు నిర్మాణం",
    starterDraft: "2. ప్రారంభ ముసాయిదా",
    starterDraftDesc: "మొదటి పేరా రూపకల్పన",
    extensionRequest: "3. పొడిగింపు అభ్యర్థన",
    extensionRequestDesc: "మర్యాదపూర్వక అభ్యర్థన ఇమెయిల్",
    generatedLabel: "రూపొందించబడింది",
    copyBtn: "క్లిప్‌బోర్డ్‌కు కాపీ చేయి",
    copiedBtn: "కాపీ చేయబడింది!",
    draftingInProgress: "అత్యవసర ముసాయిదాలను తయారు చేస్తున్నాము...",
    
    // Freeze Mode
    freezeModeTitle: "మానసిక స్తబ్దత నివారణి",
    freezeModeDesc: "మిగతావన్నీ దాచబడ్డాయి. సరిగ్గా ఒక చిన్న అడుగుపై దృష్టి పెట్టండి మరియు మీ ఖాళీ పేజీ భయాన్ని పోగొట్టుకోండి.",
    ambientFocusDrone: "ఏకాగ్రత ధ్వని",
    activeFocusCommandment: "ప్రస్తుత ఏకైక దృష్టి లక్ష్యం",
    freezeModeActionDesc: "మిగతా ఆలోచనలన్నీ పక్కన పెట్టండి. కేవలం 3 నిమిషాలు కేటాయించండి.",
    advanceBtn: "ఈ దశ పూర్తయింది, నన్ను ముందుకు తీసుకెళ్ళు!",
    allStepsChecked: "అన్ని దశలు పూర్తయ్యాయి!",
    conqueredFreezeLoop: "మీరు ఈ పని కోసం స్తబ్దతను విజయవంతంగా అధిగమించారు!",
    coDraftTitle: "ఇంటరాక్టివ్ కో-డ్రాఫ్టింగ్",
    coDraftDesc: "మీ అస్తవ్యస్తమైన, ముడి ఆలోచనలను ఇక్కడ టైప్ చేయండి. AI వాటిని తక్షణమే శుభ్రమైన, చక్కటి పేరాలుగా మారుస్తుంది.",
    rawBrainDumpLabel: "1. ముడి ఆలోచనలు",
    rawBrainDumpPlaceholder: "ఉదా: రసాయన శాస్త్రం స్పటికీకరణ గురించి కొన్ని ముడి ఆలోచనలు...",
    elevateThoughtsBtn: "వృత్తిపరమైన పేరాగా మార్చు",
    elevatingThoughtsProgress: "ఆలోచనలను మెరుగుపరుస్తున్నాము...",
    polishedProseLabel: "2. మెరుగైన ఫలితం",
    polishedProsePlaceholder: "రూపొందించబడిన పేరా ఇక్కడ కనిపిస్తుంది...",
    
    // Drop Zone
    dropZoneTitle: "సందర్భ సంగ్రహణ మండలం",
    dropZoneDesc: "అస్తవ్యస్తమైన నోట్స్ లేదా ఇంటర్నెట్ నుండి కాపీ చేసిన సమాచారం ఉందా? ఇక్కడ వేయండి. మా AI వాటిని శుభ్రం చేసి ఒక చక్కని చీట్ షీట్‌ను తయారు చేస్తుంది.",
    pasteContextLabel: "సమాచారాన్ని ఇక్కడ అతికించండి",
    pasteContextPlaceholder: "లింకులు, పాఠ్యపుస్తక పేరాలు లేదా సమావేశ వివరాలను ఇక్కడ వేయండి...",
    organizingChaosBtn: "చీట్ షీట్ సృష్టించు",
    organizingChaosProgress: "అస్తవ్యస్తతను క్రమబద్ధీకరిస్తున్నాము...",
    aiOrganizedCheatSheet: "AI క్రమబద్ధీకరించిన చీట్ షీట్",
    
    // Calendar Hijacker
    calendarHijackerTitle: "స్వయంప్రతిపత్తి గల క్యాలెండర్ హైజాకర్",
    calendarHijackerDesc: "ఖచ్చితమైన సమయ పరిమితులు లేకపోవడం ఆలస్యానికి దారితీస్తుంది. మీ రోజువారీ పరధ్యాన సమయాలను స్కాన్ చేసి, వాటిని రెస్క్యూ స్లాట్‌లుగా మార్చండి.",
    timelineReroutingProgress: "సమయాలను మార్చి క్లయింట్‌లకు తెలియజేస్తున్నాము...",
    calendarHijackedSuccess: "అత్యవసర ఏకాగ్రత సమయాలు క్యాలెండర్‌లో లాక్ చేయబడ్డాయి!",
    hijackCalendarBtn: "క్యాలెండర్ పరధ్యానాలను రద్దు చేసి సమయాన్ని లాక్ చేయి"
  },
  hi: {
    appName: "अंतिम क्षण जीवन रक्षक",
    appSubtitle: "आपातकालीन एआई उत्पादकता साथी",
    depotShop: "डिपो शॉप",
    emergencyHotline: "आपातकालीन हॉटलाइन",
    registerDeadline: "समय सीमा दर्ज करें",
    crisisSaveStreak: "संकट बचाव स्ट्रीक",
    consecutiveSaves: "लगातार बचाव!",
    totalDeadlinesSaved: "कुल समय सीमा बचाई गई",
    earnPointsPerSave: "हर बचाव पर +15 CP कमाएं!",
    failedOverdue: "विफल / अतिदेय",
    missedTargets: "छूटे हुए लक्ष्य",
    systemPanicIndex: "सिस्टम पैनिक इंडेक्स",
    highDisasterDanger: "🔥 गंभीर संकट का खतरा",
    workloadOverflow: "⚠️ अत्यधिक कार्यभार",
    underControl: "✨ सब नियंत्रण में है",
    allClear: "✨ सब साफ है",
    noCommitmentsMatch: "फ़िल्टर से मेल खाने वाला कोई काम नहीं है",
    registerFirstDeadlineDesc: "नियंत्रण में रहने के लिए अपनी आगामी समय सीमा, गृहकार्य, बैठकें या बिल जोड़ते रहें।",
    registerFirstDeadlineBtn: "अपनी पहली समय सीमा दर्ज करें",
    timeRemaining: "शेष समय:",
    saved: "सुरक्षित",
    immediateActionRequired: "🚨 तत्काल कार्रवाई आवश्यक: काम शेष समय से अधिक है!",
    procrastinationZone: "⚠️ टालमटोल क्षेत्र। अभी शुरुआत करें।",
    easyPace: "💡 आसान गति। आराम से पूरा करने के लिए अनुसूची का पालन करें।",
    onTimeSaveSuccess: "समय पर सुरक्षित रूप से पूर्ण!",
    deadlineMissed: "समय सीमा छूट गई",
    aiSaveMeCreatePlan: "एआई मुझे बचाओ (योजना बनाएं)",
    viewRescueActionBlueprint: "बचाव कार्य योजना देखें",
    tacticalPlanningInProgress: "सामरिक योजना...",
    
    // Modals & Forms
    addDeadlineTitle: "नई समय सीमा दर्ज करें",
    editDeadlineTitle: "समय सीमा संपादित करें",
    taskNameLabel: "कार्य या प्रतिबद्धता का नाम *",
    deadlineLabel: "आगामी समय सीमा (दिनांक और समय) *",
    categoryLabel: "श्रेणी",
    impactLabel: "प्रभाव / प्राथमिकता",
    workloadLabel: "अनुमानित कार्यभार (घंटे) *",
    hoursLabel: "घंटे",
    workloadHelpText: "शेष समय के आधार पर आपके पैनिक इंडेक्स की गणना करने के लिए एआई इसका उपयोग करता है।",
    descriptionLabel: "विवरण और संदर्भ",
    descriptionPlaceholder: "एआई अनुकूलित योजना बनाने में मदद करने के लिए विवरण, संसाधन या संदर्भ प्रदान करें...",
    cancelBtn: "रद्द करें",
    addRadarBtn: "हॉटलाइन रडार में जोड़ें",
    updateTaskBtn: "कार्य अपडेट करें",
    
    // Filter bar
    pendingTab: "लंबित",
    savedTab: "सुरक्षित",
    missedTab: "छूटे हुए",
    allTab: "सभी",
    allCategories: "सभी श्रेणियां",
    searchPlaceholder: "खोजें...",
    
    // Depot Shop
    rewardsDepotTitle: "संकट अंक और बीमा डिपो",
    balanceLabel: "आपका बैलेंस:",
    streakInsuranceTitle: "स्ट्रीक बीमा",
    streakInsuranceDesc: "आपकी अगली समय सीमा छूटने पर भी आपकी सेव स्ट्रीक को टूटने से बचाता है। एक अतिदेय कार्य को माफ करता है।",
    streakInsuranceActive: "बीमा सक्रिय है",
    streakInsuranceBtn: "बीमा सक्रिय करें",
    missedTaskBuyBackTitle: "छूटे कार्य की वापसी",
    missedTaskBuyBackDesc: "आपके पहले विफल/छूटे हुए कार्य को वापस लंबित में बदलता है, उसकी समय सीमा 24 घंटे बढ़ाता है, और स्ट्रीक को बहाल करता है!",
    missedTaskBuyBackBtn: "वापस खरीदें और बढ़ाएं (24 घंटे)",
    checklistBoosterTitle: "एआई चेकलिस्ट बूस्टर",
    checklistBoosterDesc: "काम को तुरंत शुरू करने के लिए किसी भी लंबित कार्य के लिए 5-चरण की फ्रीज-ब्रेकर चेकलिस्ट को तुरंत अनलॉक करता है।",
    checklistBoosterBtn: "एआई बूस्टर अनलॉक करें",
    
    // Rescue Plan Tabs & Core
    rescueMissionProgress: "बचाव मिशन प्रगति",
    hoursPlanned: "घंटे नियोजित",
    aiCoachTitle: "एआई कोच सामरिक रणनीति",
    aiCoachHelpText: "सार्जेंट की सलाह: टालमटोल केवल चिंता की वजह से आई जड़ता है। अपने फोन या वाईफाई को दूर रखें और केवल 5 मिनट का समय दें।",
    coreBlueprints: "मुख्य योजनाएं",
    hourlyBreakdowns: "प्रति घंटा विश्लेषण",
    atomicChecklist: "परमाणु चेकलिस्ट",
    antiProcrastinationHacks: "टालमटोल विरोधी ट्रिक्स",
    proactiveDrafts: "सक्रिय ड्राफ्ट",
    highUtilityOverride: "आपातकालीन ओवरराइड",
    freezeModeBreaker: "जड़ता निवारक (फ्रीज-ब्रेकर)",
    dropZoneOrganizer: "नोट्स आयोजक",
    calendarHijacker: "केंडर हाइजैकर",
    hijackedStatus: "अपहृत",
    
    // Hourly Schedule
    tacticalTimeAllocation: "सामरिक समय आवंटन",
    tacticalTimeAllocationDesc: "शेष समय में काम पूरा करने के लिए तैयार किया गया समयबद्ध अनुक्रम।",
    deliverableLabel: "परिणाम:",
    
    // Atomic Checklist
    atomicChecklistDesc: "बड़ी चीजें डर पैदा करती हैं। गति बढ़ाने के लिए इन बेहद छोटे कार्यों को एक-एक करके पूरा करें।",
    
    // Hacks
    hacksDesc: "आपके मस्तिष्क को तुरंत काम शुरू करने के लिए प्रेरित करने वाले आपके कार्य श्रेणी के अनुकूल मनोवैज्ञानिक ट्रिक्स।",
    focusHackLabel: "ध्यान केंद्रित करने की ट्रिक",
    
    // Drafts
    blankPageAssistant: "प्रोएक्टिव ड्राफ्ट सहायक",
    blankPageAssistantDesc: "शुरुआत कैसे करें समझ नहीं आ रहा? रूपरेखा तैयार करने, पहला पैराग्राफ लिखने या विस्तार अनुरोध ईमेल का मसौदा तैयार करने के लिए एआई का उपयोग करें।",
    instantOutline: "1. त्वरित रूपरेखा",
    instantOutlineDesc: "अनुभाग और संरचना",
    starterDraft: "2. प्रारंभिक ड्राफ्ट",
    starterDraftDesc: "पहले पैराग्राफ का निर्माण",
    extensionRequest: "3. विस्तार अनुरोध",
    extensionRequestDesc: "मर्यादापूर्ण अनुरोध ईमेल",
    generatedLabel: "तैयार किया गया",
    copyBtn: "क्लिपबोर्ड पर कॉपी करें",
    copiedBtn: "कॉपी हो गया!",
    draftingInProgress: "आपातकालीन ड्राफ्ट तैयार किए जा रहे हैं...",
    
    // Freeze Mode
    freezeModeTitle: "मनोवैज्ञानिक जड़ता निवारक",
    freezeModeDesc: "बाकी सब कुछ छिपा हुआ है। बिल्कुल एक छोटे कदम पर ध्यान केंद्रित करें और अपने खाली पन्ने के डर को दूर करें।",
    ambientFocusDrone: "ध्यान केंद्रित करने की ध्वनि",
    activeFocusCommandment: "सक्रिय एकल-ध्यान लक्ष्य",
    freezeModeActionDesc: "अन्य सभी विचारों को किनारे रखें। केवल 3 मिनट समर्पित करें।",
    advanceBtn: "यह चरण पूरा हुआ, मुझे आगे बढ़ाएं!",
    allStepsChecked: "सभी चरण पूरे हुए!",
    conqueredFreezeLoop: "आपने इस कार्य के लिए टालमटोल की जड़ता को सफलतापूर्वक पार कर लिया!",
    coDraftTitle: "इंटरएक्टिव सह-लेखन",
    coDraftDesc: "अपने अस्त-व्यस्त, कच्चे विचारों को यहाँ टाइप करें। एआई उन्हें तुरंत स्वच्छ, व्यवस्थित पैराग्राफ में बदल देगा।",
    rawBrainDumpLabel: "1. कच्चे विचार",
    rawBrainDumpPlaceholder: "उदा: रसायन विज्ञान क्रिस्टलीकरण के बारे में विचार...",
    elevateThoughtsBtn: "व्यावसायिक पैराग्राफ में बदलें",
    elevatingThoughtsProgress: "विचारों को बेहतर बना रहे हैं...",
    polishedProseLabel: "2. बेहतर परिणाम",
    polishedProsePlaceholder: "तैयार किया गया पैराग्राफ यहाँ दिखाई देगा...",
    
    // Drop Zone
    dropZoneTitle: "सदर्भ ग्रहण क्षेत्र",
    dropZoneDesc: "अव्यवस्थित नोट्स या इंटरनेट से कॉपी की गई जानकारी है? यहाँ डालें। हमारी एआई उन्हें व्यवस्थित करके एक बेहतरीन चीट शीट बनाएगी।",
    pasteContextLabel: "जानकारी यहाँ पेस्ट करें",
    pasteContextPlaceholder: "लिंक, पाठ्यपुस्तक के पैराग्राफ या बैठक के विवरण यहाँ डालें...",
    organizingChaosBtn: "चीट शीट बनाएं",
    organizingChaosProgress: "अव्यवस्थितता को व्यवस्थित कर रहे हैं...",
    aiOrganizedCheatSheet: "एआई व्यवस्थित चीट शीट",
    
    // Calendar Hijacker
    calendarHijackerTitle: "स्वचालित कैलेंडर हाइजैकर",
    calendarHijackerDesc: "सटीक समय सीमा न होने से टालमटोल होता है। अपने दिन के कम-प्राथमिकता वाले विकर्षणों को स्कैन करें और उन्हें ध्यान केंद्रित करने के आपातकालीन स्लॉट में बदलें।",
    timelineReroutingProgress: "समय स्लॉट को रीरूट कर रहे हैं और सूचित कर रहे हैं...",
    calendarHijackedSuccess: "आपातकालीन स्लॉट कैलेंडर पर लॉक कर दिए गए हैं!",
    hijackCalendarBtn: "कैलेंडर विकर्षणों को हटाएं और समय लॉक करें"
  }
};
