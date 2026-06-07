
const motifs = {
  ei: { label: 'E/I imbalance', param: 'E/I ratio', min: 0.5, max: 1.8, step: 0.1, val: 1.2 },
  noise: { label: 'Altered sensory noise', param: 'Noise SD', min: 0, max: 0.8, step: 0.05, val: 0.25 },
  gain: { label: 'Hyperactivity / gain', param: 'Gain multiplier', min: 0.5, max: 2.5, step: 0.1, val: 1.4 },
  feedback: { label: 'Feedback circuit difference', param: 'Feedback strength', min: 0, max: 1, step: 0.05, val: 0.55 },
  priors: { label: 'Altered priors / generalization', param: 'Tuning width', min: 0.5, max: 2.5, step: 0.1, val: 1.3 }
};
function updateParams(){
  const box = document.getElementById('params'); if(!box) return;
  box.innerHTML = '';
  document.querySelectorAll('[data-hyp]:checked').forEach(ch => {
    const key = ch.dataset.hyp, m = motifs[key];
    const wrap = document.createElement('div'); wrap.className='control-box'; wrap.style.marginTop='.75rem';
    wrap.innerHTML = `<h3>${m.label}</h3><label for="${key}Range">${m.param}: <span id="${key}Val">${m.val}</span></label><input id="${key}Range" data-range="${key}" type="range" min="${m.min}" max="${m.max}" step="${m.step}" value="${m.val}">`;
    box.appendChild(wrap);
  });
  document.querySelectorAll('[data-range]').forEach(r => r.addEventListener('input', e => { document.getElementById(e.target.dataset.range+'Val').textContent = e.target.value; }));
}
document.querySelectorAll('[data-hyp]').forEach(ch => ch.addEventListener('change', updateParams));
function runSandbox(){
  const out = document.getElementById('sandboxOutput'); if(!out) return;
  const selected = [...document.querySelectorAll('[data-hyp]:checked')].map(x=>x.dataset.hyp);
  if(!selected.length){ out.innerHTML = '<p>Please select at least one mechanistic motif before generating a prediction.</p>'; return; }
  const model = document.getElementById('baseModel').value;
  const vals = selected.map(k => ({key:k, ...motifs[k], value: parseFloat((document.getElementById(k+'Range')||{}).value || motifs[k].val)}));
  let complexity = Math.min(96, 42 + vals.length*10 + vals.reduce((s,v)=>s+Math.abs(v.value-v.val)*12,0));
  let fit = Math.max(12, Math.min(92, 76 - vals.length*4 + (selected.includes('feedback')?6:0) - (selected.includes('noise')?5:0)));
  let translation = Math.max(18, Math.min(88, 35 + selected.length*9 + (selected.includes('priors')?8:0)));
  localStorage.setItem('roadmapSandbox', JSON.stringify({model, vals, complexity, fit, translation}));
  out.innerHTML = `<h3>${model}</h3><p class="note">Transparent placeholder simulation for interface demonstration.</p>${metric('Model divergence from base', complexity)}${metric('Benchmark fit estimate', fit)}${metric('Translation readiness estimate', translation)}<h3>Selected motifs</h3><ul>${vals.map(v=>`<li><strong>${v.label}</strong>: ${v.param} = ${v.value}</li>`).join('')}</ul><p><strong>Suggested next experiment:</strong> compare the model's error pattern against held-out human behavior and neural reliability data, then test whether the same motif predicts cross-species measurements.</p><div class="actions"><a class="button primary" href="benchmark.html">Send to benchmark dashboard</a><a class="button secondary" href="submissions.html#job">Request benchmark job</a></div>`;
}
function resetSandbox(){ document.querySelectorAll('[data-hyp]').forEach(x=>x.checked=false); updateParams(); const out=document.getElementById('sandboxOutput'); if(out) out.innerHTML='<p class="note">Select one or more hypotheses, set parameters, then generate a simulated prediction. This demo uses transparent placeholder scoring to show the intended interface.</p>'; }
function metric(label, value){ return `<div class="metric"><strong>${label}</strong><span>${Math.round(value)}%</span></div><div class="bar"><div class="fill" style="width:${Math.round(value)}%"></div></div>`; }
const benchmarks = [
  ['Social reciprocity tasks','Behavioral measures of social approach, response timing, affect sharing, and interaction structure.'],
  ['Sensory reliability','Noise sensitivity, threshold stability, and trial-to-trial response variability.'],
  ['Audio-visual integration','Congruent and incongruent cross-modal stimuli across humans and animal models.'],
  ['Visual object recognition','Image-level behavior, neural responses, and ANN representational comparisons.'],
  ['Learning and generalization','Training, transfer to new exemplars, and category-level robustness.'],
  ['Community feedback','Structured acceptability, relevance, and lived-experience interpretation.']
];
function renderBenchmarks(){ const host=document.getElementById('benchmarkCards'); if(!host) return; host.innerHTML=benchmarks.map((b,i)=>`<label class="card check"><input type="checkbox" name="benchmarks" value="${b[0]}"><span><h3>${b[0]}</h3><p>${b[1]}</p></span></label>`).join(''); }
function submitBenchmarks(){ const selected=[...document.querySelectorAll('input[name="benchmarks"]:checked')].map(x=>x.value); if(!selected.length){ alert('Please select at least one benchmark family.'); return; } localStorage.setItem('selectedBenchmarks', JSON.stringify(selected)); window.location.href='benchmark.html'; }
function analyzeData(){ const type=document.getElementById('dataType').value, domain=document.getElementById('taskDomain').value, file=document.getElementById('uploadData').files[0], notes=document.getElementById('notes').value; const target=document.getElementById('experimentResult'); target.innerHTML = `<h3>Evidence card draft</h3><div class="metric"><strong>Dataset type</strong><span>${type}</span></div><div class="metric"><strong>Task domain</strong><span>${domain}</span></div><div class="metric"><strong>File</strong><span>${file ? file.name : 'No file attached'}</span></div><p><strong>Notes:</strong> ${notes ? notes.replace(/[<>]/g,'') : 'No notes added.'}</p><p class="note">Next platform step: validate metadata, permissions, task schema, and benchmark compatibility.</p>`; }
function renderDashboard(){
  const met=document.getElementById('dashboardMetrics'); if(met){ const saved=JSON.parse(localStorage.getItem('roadmapSandbox')||'null'); if(saved){ met.innerHTML=`<h3>${saved.model}</h3>${metric('Model divergence from base', saved.complexity)}${metric('Benchmark fit estimate', saved.fit)}${metric('Translation readiness estimate', saved.translation)}<p class="note">Generated from the sandbox prototype.</p>`; } else { met.innerHTML=`${metric('Model divergence from base', 54)}${metric('Benchmark fit estimate', 68)}${metric('Translation readiness estimate', 47)}<p class="note">Example values shown. Use the sandbox to generate a custom report.</p>`; }}
  const sb=document.getElementById('selectedBenchmarks'); if(sb){ const selected=JSON.parse(localStorage.getItem('selectedBenchmarks')||'[]'); if(selected.length) sb.innerHTML='<ul>'+selected.map(x=>`<li>${x}</li>`).join('')+'</ul><p class="note">These selections are stored locally in this browser for the prototype.</p>'; }
}
renderBenchmarks(); renderDashboard(); updateParams();


// ROADMAP submission center interactivity
function setSubmissionTab(type){
  const hidden = document.getElementById('submissionType');
  if(!hidden) return;
  hidden.value = type;
  document.querySelectorAll('[data-submit-tab]').forEach(btn => btn.classList.toggle('active', btn.dataset.submitTab === type));
  document.querySelectorAll('[data-form-section]').forEach(sec => { sec.hidden = sec.dataset.formSection !== type; });
  previewSubmission();
}
document.querySelectorAll('[data-submit-tab]').forEach(btn => btn.addEventListener('click', () => setSubmissionTab(btn.dataset.submitTab)));
function submissionData(){
  const type = (document.getElementById('submissionType')||{}).value || 'model';
  const active = document.querySelector(`[data-form-section="${type}"]`);
  const form = document.getElementById('roadmapSubmissionForm');
  const data = { submission_type: type, status: 'draft', created_in: 'ROADMAP static prototype' };
  const collect = el => {
    const key = el.dataset.json; if(!key) return;
    if(el.type === 'file') data[key] = el.files && el.files[0] ? { name: el.files[0].name, size_bytes: el.files[0].size } : null;
    else data[key] = el.value || null;
  };
  if(active) active.querySelectorAll('[data-json]').forEach(collect);
  if(form) form.querySelectorAll(':scope > .form-grid [data-json]').forEach(collect);
  data.next_backend_action = type === 'job' ? 'validate_and_create_slurm_or_brainscore_manifest' : type === 'data' ? 'validate_metadata_and_access_level' : 'validate_neural_hypothesis_registry_entry';
  data.preview_job_id = 'RM-' + Math.floor(100000 + Math.random()*899999);
  return data;
}
function previewSubmission(){
  const pre = document.getElementById('submissionPreview');
  if(!pre) return;
  pre.textContent = JSON.stringify(submissionData(), null, 2);
}
function downloadSubmissionJSON(){
  const data = submissionData();
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `roadmap_${data.submission_type}_submission.json`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
function fakeSubmitRoadmap(){
  const data = submissionData();
  data.status = data.submission_type === 'job' ? 'queued_for_validation' : 'submitted_for_review';
  localStorage.setItem('roadmapLastSubmission', JSON.stringify(data));
  const pre = document.getElementById('submissionPreview');
  if(pre) pre.textContent = JSON.stringify(data, null, 2);
  alert('Mock submission saved in this browser. In production this would be sent to the ROADMAP API.');
}
document.querySelectorAll('#roadmapSubmissionForm input, #roadmapSubmissionForm select, #roadmapSubmissionForm textarea').forEach(el => {
  el.addEventListener('input', previewSubmission);
  el.addEventListener('change', previewSubmission);
});
if(location.hash === '#data') setSubmissionTab('data');
if(location.hash === '#job') setSubmissionTab('job');
if(location.hash === '#model') setSubmissionTab('model');
previewSubmission();


// ROADMAP community assistant prototype (static front-end demo)
function roadmapAssistantReply(text){
  const q = (text || '').toLowerCase();
  if(q.includes('what does roadmap') || q.includes('roadmap do')) return 'ROADMAP organizes autism research evidence so datasets, neural hypotheses, model simulations, clinical questions, and community feedback can be compared in one shared record.';
  if(q.includes('plain') || q.includes('explain')) return 'Yes. A core ROADMAP function is to turn technical research claims into plain-language explanations while preserving uncertainty and limits.';
  if(q.includes('feedback') || q.includes('community')) return 'Community questions help identify unclear claims, missing context, harmful wording, and research priorities that should be reflected in evidence summaries.';
  if(q.includes('benchmark') || q.includes('dashboard')) return 'The benchmark dashboard tracks submitted datasets, neural hypotheses, simulation jobs, and evidence cards. It is designed to show what has been tested and what remains uncertain.';
  if(q.includes('brain') || q.includes('score')) return 'Neurotypical model simulation can be routed through the Brain-Score collaboration workflow. ROADMAP then links those results to autism-relevant hypotheses and datasets.';
  return 'Thanks — in the production platform this question would be routed to the ROADMAP knowledge base or review team. For now, this static prototype can help classify the question and show the intended community-facing experience.';
}
function appendRoadmapChat(role, text){
  const log = document.getElementById('roadmapChatLog'); if(!log) return;
  const div = document.createElement('div');
  div.className = 'chat-message ' + role;
  div.textContent = text;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}
function sendRoadmapChat(){
  const input = document.getElementById('roadmapChatInput'); if(!input) return;
  const text = input.value.trim(); if(!text) return;
  appendRoadmapChat('user', text);
  input.value = '';
  setTimeout(() => appendRoadmapChat('bot', roadmapAssistantReply(text)), 120);
}
function seedRoadmapChat(text){
  const input = document.getElementById('roadmapChatInput'); if(input){ input.value = text; sendRoadmapChat(); }
}
document.addEventListener('keydown', function(e){
  if(e.key === 'Enter' && e.target && e.target.id === 'roadmapChatInput') sendRoadmapChat();
});


// ROADMAP benchmark playground: source-linked benchmark registry
const roadmapBenchmarkRegistry = [
  {
    id: 'face-expression',
    title: 'Face expression difficulty',
    family: 'Visual discrimination',
    modality: 'Behavior + neural',
    source: 'Human/macaque behavior and IT neural recordings',
    paper: 'source record / DOI placeholder',
    url: 'https://doi.org/10.1101/2024.01.01.000000',
    status: 'Benchmark-ready',
    coverage: { animal: 92, human: 86, neural: 88, brainScore: 74, community: 48 }
  },
  {
    id: 'av-category-learning',
    title: 'Audio-visual object category learning',
    family: 'Learning and transfer',
    modality: 'Behavior + fMRI',
    source: 'Macaque audio-to-visual mapping and human AV fMRI',
    paper: 'source record / DOI placeholder',
    url: 'https://doi.org/10.1101/2024.01.01.000001',
    status: 'Under review',
    coverage: { animal: 82, human: 72, neural: 55, brainScore: 42, community: 35 }
  },
  {
    id: 'visual-search-variability',
    title: 'Visual search / category variability',
    family: 'Visual discrimination',
    modality: 'Behavior',
    source: 'Human visual search and category-variability tasks',
    paper: 'example paper link',
    url: 'https://www.sciencedirect.com/science/article/abs/pii/S0028393217301045',
    status: 'Paper linked',
    coverage: { animal: 28, human: 78, neural: 22, brainScore: 38, community: 30 }
  },
  {
    id: 'odd-one-out-rdm',
    title: 'Odd-one-out representational geometry',
    family: 'Odd-one-out / similarity',
    modality: 'Behavior + model RDM',
    source: 'Triplet judgments and representational similarity matrices',
    paper: 'source record / DOI placeholder',
    url: 'https://doi.org/10.1101/2024.01.01.000003',
    status: 'Draft metadata',
    coverage: { animal: 35, human: 70, neural: 45, brainScore: 58, community: 25 }
  },
  {
    id: 'sensory-reliability',
    title: 'Sensory reliability assay',
    family: 'Neural alignment',
    modality: 'Animal assay + neural variability',
    source: 'Trial-to-trial variability, sensory reliability, and gain measures',
    paper: 'source record / DOI placeholder',
    url: 'https://doi.org/10.1101/2024.01.01.000002',
    status: 'Draft',
    coverage: { animal: 80, human: 38, neural: 52, brainScore: 35, community: 20 }
  },
  {
    id: 'community-language-review',
    title: 'Community relevance and language review',
    family: 'Community review',
    modality: 'Structured feedback',
    source: 'Community questions, wording review, and priority feedback',
    paper: 'ROADMAP feedback record',
    url: 'community.html#feedback-form',
    status: 'Active',
    coverage: { animal: 0, human: 45, neural: 0, brainScore: 0, community: 90 }
  }
];

function renderBenchmarkPlayground(){
  const host = document.getElementById('benchmarkGallery');
  if(!host) return;
  const families = [...new Set(roadmapBenchmarkRegistry.map(b => b.family))];
  host.innerHTML = families.map(family => {
    const items = roadmapBenchmarkRegistry.filter(b => b.family === family).map(b => `
      <label class="benchmark-card-pro">
        <input type="checkbox" name="roadmapBenchmark" value="${b.id}">
        <span class="benchmark-card-main">
          <span class="benchmark-status">${b.status}</span>
          <strong>${b.title}</strong>
          <span>${b.source}</span>
          <span class="benchmark-meta">${b.modality}</span>
          <a href="${b.url}" target="_blank" rel="noopener" onclick="event.stopPropagation();">Original paper / source</a>
        </span>
      </label>
    `).join('');
    return `<div class="benchmark-family-section"><h3>${family}</h3><div class="benchmark-card-grid">${items}</div></div>`;
  }).join('');
}

function selectedRoadmapBenchmarks(){
  return [...document.querySelectorAll('input[name="roadmapBenchmark"]:checked')]
    .map(x => roadmapBenchmarkRegistry.find(b => b.id === x.value))
    .filter(Boolean);
}

function renderBenchmarkPlaygroundResults(){
  const selected = selectedRoadmapBenchmarks();
  const summary = document.getElementById('selectedBenchmarkSummary');
  if(!summary) return;
  if(!selected.length){
    summary.innerHTML = '<p class="note">Select one or more benchmarks above and click preview.</p>';
    const chart = document.getElementById('benchmarkCoverageChart');
    if(chart) chart.innerHTML = '';
    return;
  }
  localStorage.setItem('roadmapSelectedBenchmarks', JSON.stringify(selected.map(x => x.id)));
  summary.innerHTML = `<ul class="selected-benchmark-list">${selected.map(b => `<li><strong>${b.title}</strong><span>${b.family} · ${b.status}</span><a href="${b.url}" target="_blank" rel="noopener">source</a></li>`).join('')}</ul>`;
  const avg = key => Math.round(selected.reduce((s,b)=>s+(b.coverage[key]||0),0)/selected.length);
  const categories = ['Animal-model evidence','Human behavior/data','Human neural data','Brain-Score lane','Community review'];
  const values = [avg('animal'), avg('human'), avg('neural'), avg('brainScore'), avg('community')];
  if(window.Plotly && document.getElementById('benchmarkCoverageChart')){
    Plotly.newPlot('benchmarkCoverageChart', [{
      x: categories,
      y: values,
      type: 'bar',
      marker: { color: '#315f72' }
    }], {
      margin: {t: 20, r: 12, b: 70, l: 42},
      yaxis: {title: 'Coverage %', range: [0,100]},
      xaxis: {tickangle: -20}
    }, {displayModeBar:false, responsive:true});
  }
}

function clearBenchmarkPlaygroundSelection(){
  document.querySelectorAll('input[name="roadmapBenchmark"]').forEach(x => x.checked = false);
  renderBenchmarkPlaygroundResults();
}

renderBenchmarkPlayground();
