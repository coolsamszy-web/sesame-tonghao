/* 芝麻同好 V3：真人兴趣版资讯平台（静态交互原型） */
const v3Platforms=['小红书','B站','微博','官方资讯','豆瓣'];
let v3RankCategory=state.interests[0]||'动漫';

communityCatalog.forEach((item,index)=>{
  const categoryOffset=Math.max(0,categories.indexOf(item.category));
  item.platform=v3Platforms[(index+categoryOffset)%v3Platforms.length];
  item.freshness=['刚刚','18分钟前','1小时前','今天','昨天'][index%5];
  item.kind=`AI 聚合 · ${item.platform}`;
});

nav=function(){
  const ns=[['square','grid','广场'],['following','heart','关注'],['profile','user','我的']];
  for(const selector of ['.side-nav','.mobile-nav']){
    $(selector).innerHTML=ns.map(([id,i,t])=>`<button class="${selector==='.side-nav'?'nav-item ':''}${page===id?'active':''}" data-page="${id}" ${page===id?'aria-current="page"':''}>${icon(i)}<span>${t}</span></button>`).join('');
  }
  document.querySelectorAll('.place').forEach(el=>el.textContent=state.place);
  $('#side-status').textContent='兴趣雷达已开启';
  applyTheme();
};

reason=function(x){
  const keyword=state.keywords.find(k=>[x.title,x.object,x.body].join(' ').toLowerCase().includes(k.toLowerCase()));
  if(keyword)return `命中关键词「${keyword}」 · ${x.platform||'公开资讯'}`;
  if(state.interests.includes(x.category))return `匹配你的「${x.category}」兴趣 · ${x.platform||'公开资讯'}`;
  const g=geo(person(x.person));
  return `${g===2?'附近同好正在关注':'同号人气上升'} · ${x.platform||'公开资讯'}`;
};

feedData=function(){
  return allContent().filter(x=>
    (category==='全部'||x.category===category)&&
    (!query||[x.title,x.object,x.body,person(x.person).name,x.category].join(' ').toLowerCase().includes(query.toLowerCase()))&&
    (page!=='following'||state.following.includes(x.person))&&
    (!nearby||page==='following'||geo(person(x.person))===2)&&
    (state.sourceFilter==='全部来源'||x.platform===state.sourceFilter)
  ).sort((a,b)=>score(b)-score(a));
};

card=function(x){
  const p=person(x.person);
  const sourceText=x.platform||(/^本人分享/.test(x.kind||'')?'同好动态':'公开资讯');
  return `<article class="feed-card">
    <button class="content-open" data-detail="${x.id}" aria-label="查看${esc(x.title)}">
      ${cover(x)}
      <div class="feed-copy">
        <div class="ai-source-row"><span class="ai-badge">${/^本人分享/.test(x.kind||'')?'真人动态':'AI 聚合'}</span><span class="source-label">${esc(sourceText)}</span><span class="freshness">${esc(x.freshness||'最近更新')}</span></div>
        <h3>${esc(x.title)}</h3><p>${esc(x.body)}</p><span class="object-tag"># ${esc(x.object)}</span>
      </div>
    </button>
    <div class="community-author"><button class="person-link row" data-person="${p.id}"><span class="avatar">${esc(p.letter)}</span><span><strong>${esc(p.name)}</strong><small>${esc(p.identity)} · ${geo(p)===2?'同街区':esc(p.place)}</small></span></button>${p.id==='me'?'':followBtn(p.id)}</div>
    <div class="distribution"><span>${reason(x)}</span><button data-why="${x.id}" aria-label="了解推荐理由">${icon('pin')}</button></div>
    <div class="feed-actions"><button data-like="${x.id}" class="${state.liked.includes(x.id)?'selected':''}" aria-label="认可这条内容">${icon('heart')} ${x.likes+(state.liked.includes(x.id)?1:0)}</button><button data-save="${x.id}" class="${state.saved.includes(x.id)?'selected':''}">${icon('save')} ${state.saved.includes(x.id)?'已收藏':'收藏'}</button><span>${reach(x)}</span></div>
  </article>`;
};

function v3SourceFilters(){
  return `<div class="source-filters" aria-label="资讯来源筛选">${['全部来源',...v3Platforms].map(source=>`<button class="source-chip ${state.sourceFilter===source?'active':''}" data-source="${source}">${source}</button>`).join('')}</div>`;
}

function v3Rankings(){
  const nearbyItems=[...allContent()].filter(x=>geo(person(x.person))>0).sort((a,b)=>(b.likes+score(b))-(a.likes+score(a))).slice(0,5);
  if(!categories.includes(v3RankCategory))v3RankCategory=state.interests[0]||'动漫';
  const verticalItems=[...allContent()].filter(x=>x.category===v3RankCategory).sort((a,b)=>(b.likes+b.quality)-(a.likes+a.quality)).slice(0,5);
  const rankList=items=>`<div class="rank-list">${items.map((x,i)=>`<button class="rank-item" data-detail="${x.id}"><span class="rank-no">${i+1}</span><span><strong>${esc(x.title)}</strong><small>${esc(x.object)} · ${esc(x.platform||'同好动态')}</small></span><span class="rank-rise">${i<2?'热度上升':'NEW'}</span></button>`).join('')}</div>`;
  return `<section class="ranking-board" aria-label="兴趣榜单">
    <article class="rank-panel nearby-rank"><span class="rank-kicker">NEARBY NOW</span><h2>${esc(state.place)} · 附近热点榜</h2><p>看看附近的人正在关注什么，找到今天的线下谈资。</p>${rankList(nearbyItems)}</article>
    <article class="rank-panel"><span class="rank-kicker">SAME INTEREST</span><h2>垂类同号榜</h2><p>不追全网总热度，只看与你同频的领域。</p><div class="vertical-switch">${categories.map(c=>`<button class="${v3RankCategory===c?'active':''}" data-rank-category="${c}">${c}</button>`).join('')}</div>${rankList(verticalItems)}</article>
  </section>`;
}

profilePanel=function(){
  return `<div class="aside-card member"><div class="member-top">我的兴趣雷达</div><div class="member-mark">∞</div><h3>${state.profile?esc(state.profile.identity):'AI 正在替你盯全网'}</h3><p>兴趣越具体，聚合到的公开资讯越贴近你。</p><div class="interest-tags">${state.interests.map(t=>`<span>${esc(t)}</span>`).join('')}</div>${state.keywords.length?`<div class="keyword-tags">${state.keywords.map(t=>`<span># ${esc(t)}</span>`).join('')}</div>`:''}<button data-action="preferences">调整兴趣雷达 →</button><small class="model-note">原型演示 · 来源链接与抓取结果仅作产品效果展示</small></div>`;
};

nearbyPanel=function(){
  const ps=people.filter(p=>geo(p)>0).sort((a,b)=>geo(b)-geo(a));
  return `<div class="aside-card nearby-panel"><div class="between"><h3>附近兴趣脉冲</h3><button class="text-btn" data-action="map">看看谁在关注 ${icon('arrow')}</button></div><div class="mini-map" aria-label="附近兴趣热度示意图"><span class="map-area">${esc(state.place)} · 热度示意</span>${(ps.length?ps:people.slice(0,2)).slice(0,3).map((p,i)=>`<button style="left:${18+i*26}%;top:${42+(i%2)*24}%" data-person="${p.id}" aria-label="查看${p.name}"><span class="avatar">${p.letter}</span><small>${p.category}</small></button>`).join('')}</div><p class="muted" style="font-size:11px;margin-top:10px">从公开资讯的兴趣热度出发，再发现真实同号人。</p></div>`;
};

square=function(){
  return `<div class="between intro"><div><h1>你的兴趣，AI 已经替你在全网盯着</h1><p>选择标签和关键词，聚合公开资讯，也看看附近的人正在关注什么。</p><span class="theme-intro-badge">真人兴趣版资讯平台 · ${state.theme==='pop'?'活泼二次元':'尊贵黑金'}</span></div><div class="date">AI 兴趣雷达</div><button class="mobile-location" data-action="location">${icon('pin')}<span>${state.place}</span></button></div>
  <section class="hero"><div class="hero-copy"><div class="eyebrow">先说你喜欢什么 · 再看附近的人关注什么</div><h2><span>全网资讯，</span><span>只推你真正关心的。</span></h2><p>动漫具体到角色，潮玩具体到系列，游戏具体到那张舍不得离开的地图。</p><div class="hero-bottom"><div class="stack"><span class="avatar">潮</span><span class="avatar">游</span><span class="avatar">番</span></div><small>${state.interests.join(' · ')}${state.keywords.length?' · '+state.keywords.slice(0,2).join(' · '):''}</small><button class="text-btn" style="color:#e2c69a;font-size:11px" data-action="preferences">调整兴趣 ${icon('arrow')}</button></div></div><div class="hero-emblem" aria-hidden="true"><div class="infinity">∞</div><p>AI 聚合 · 同好发现</p></div></section>
  <div class="radar-strip"><span class="radar-dot"></span><b>AI 兴趣雷达运行中</b><span>已按 ${state.interests.length} 个领域${state.keywords.length?'、'+state.keywords.length+' 个关键词':''}整理公开资讯</span><span>原型模拟</span></div>
  ${v3Rankings()}
  <div class="main-grid"><section><div class="between section-head"><h2>为你聚合</h2><button class="text-btn" data-action="preferences">管理兴趣与关键词 ${icon('arrow')}</button></div>${chips()}${v3SourceFilters()}<div class="feed-tools"><button class="near-toggle ${nearby?'active':''}" data-action="nearby" aria-pressed="${nearby}">${icon('pin')} ${nearby?'仅看本街区':'兴趣 × 地缘推荐'}</button><button class="text-btn" data-action="publish">+ 分享真人动态</button></div><p class="sample-note"><span class="demo-dot"></span>产品原型：模拟 AI 聚合公开来源；人物、热度和榜单数据均为演示</p>${query?`<div class="search-result">搜索“${esc(query)}”<button data-action="clear-search">清除</button></div>`:''}<div class="feed-grid">${visibleFeed().map(card).join('')||empty('暂时没有匹配资讯','换一个来源、兴趣或关键词再试试。')}</div>${moreButton()}</section><aside>${profilePanel()}${nearbyPanel()}<div class="aside-card"><h3>兴趣相投的人</h3><p class="muted" style="margin:8px 0 12px">先看他在关注什么，再决定要不要关注他。</p>${peopleList(people.filter(p=>state.interests.includes(p.category)).slice(0,3))}</div></aside></div>`;
};

following=function(){
  return `<div class="page-title between"><div><h1>关注的人，正在关注什么</h1><p>真人的兴趣选择，加上 AI 持续整理的公开资讯。</p></div><button class="secondary" data-action="discover">发现同号人</button></div><div class="main-grid"><section><div class="following-strip">${state.following.length?state.following.map(id=>{const p=person(id);return `<button data-person="${id}"><span class="avatar">${p.letter}</span><span>${p.name}</span></button>`}).join(''):'<span class="muted">先从一位品味相投的人开始关注</span>'}</div>${chips()}${v3SourceFilters()}<p class="sample-note"><span class="demo-dot"></span>关注页汇总真人动态及其兴趣相关的公开资讯；暂不开放评论</p><div class="feed-grid">${visibleFeed().map(card).join('')||empty(state.following.length?'这个兴趣下暂时没有更新':'还没有关注同号人',state.following.length?'切换其他分类或资讯来源。':'关注后，他的动态和相关兴趣资讯会出现在这里。')}</div>${moreButton()}${!state.following.length?`<div class="aside-card" style="margin-top:18px"><h3>可以先认识这些同号人</h3>${peopleList(people.slice(0,9))}</div>`:''}</section><aside>${profilePanel()}${nearbyPanel()}</aside></div>`;
};

mine=function(){
  const p=person('me'),saved=allContent().filter(x=>state.saved.includes(x.id));
  return `<div class="page-title between"><div><h1>我的兴趣雷达</h1><p>管理标签、关键词、关注和收藏，让推荐越来越像你。</p></div><button class="text-btn" data-action="preferences">调整兴趣 ${icon('arrow')}</button></div><div class="main-grid"><section><div class="profile-top"><div class="row"><span class="avatar">${p.letter}</span><span>${esc(p.name)}</span><span class="level">兴趣自述</span></div><h2>${esc(p.identity)}</h2><p>${esc(p.bio)||'你关注的作品、角色、系列和创作者，会共同组成你的资讯雷达。'}</p><div class="interest-tags">${state.interests.map(x=>`<span>${esc(x)}</span>`).join('')}</div>${state.keywords.length?`<div class="keyword-tags">${state.keywords.map(x=>`<span># ${esc(x)}</span>`).join('')}</div>`:''}<div class="profile-counts"><span><b>${state.following.length}</b> 关注</span><span><b>${state.saved.length}</b> 收藏</span><span><b>${state.posts.length}</b> 分享</span></div><button class="secondary" data-action="preferences">编辑标签与关键词</button></div><div class="between section-head"><h2>${profileView==='收藏'?'我的收藏':'我的分享'}</h2><div class="square-tabs"><button class="${profileView!=='收藏'?'active':''}" data-profile-view="主页">分享</button><button class="${profileView==='收藏'?'active':''}" data-profile-view="收藏">收藏</button></div></div><div class="feed-grid">${(profileView==='收藏'?saved:state.posts).map(card).join('')||empty(profileView==='收藏'?'还没有收藏':'还没有分享真人动态',profileView==='收藏'?'在广场收藏一条想继续看的资讯。':'分享一段真实感受，让同号人从内容认识你。')}</div><button class="primary" data-action="publish" style="margin-top:16px">+ 分享最近的喜欢</button></section><aside><div class="aside-card"><h3>兴趣称号</h3><div class="badges"><div class="badge">${icon('star')}<strong>兴趣探索者</strong><small>已点亮</small></div><div class="badge ${state.saved.length?'':'locked'}">${icon('book')}<strong>资讯收藏家</strong><small>${state.saved.length?'已点亮':'收藏 1 条'}</small></div><div class="badge ${state.posts.length?'':'locked'}">${icon('crown')}<strong>真人分享者</strong><small>${state.posts.length?'已点亮':'发布首条动态'}</small></div></div><p class="model-note">称号只记录兴趣参与，不代表专业或信用认证。</p></div>${nearbyPanel()}<div class="aside-card"><h3>第一阶段规则</h3><p class="muted" style="margin-top:10px">浏览资讯与使用基础功能不设信用分门槛。评论暂不开放，精准距离社交留待后续评估。</p></div></aside></div>`;
};

showPerson=function(id){
  if(id==='me'){$('#modal').close();go('profile');return;}
  const p=person(id);
  modal(p.name,`<div class="person-profile"><span class="avatar">${p.letter}</span><h3>${p.identity}</h3><p>${p.place} · 兴趣标签由本人表达</p><p>${p.bio}</p><span class="source-label">人物、街区与关系为原型演示</span></div><h3 style="margin:18px 0 10px">最近关注</h3><div class="object-list">${p.objects.map(t=>`<span>${t}</span>`).join('')}</div><h3 style="margin:18px 0 10px">关注后，你会看到</h3><p>他的真人动态，以及 AI 围绕这些兴趣整理的公开资讯。</p><div class="option-list">${content.filter(x=>x.person===id).slice(0,5).map(x=>`<button class="option" data-detail="${x.id}"><div><b>${x.title}</b><small>${x.kind}</small></div>${icon('arrow')}</button>`).join('')}</div><div class="dialog-actions">${followBtn(id)}</div>`);
};

interestPreview=function(){
  const selected=interestDraft.includes(interestFocus),w=interestWorlds[interestFocus];
  return `<div class="interest-reveal"><span class="reveal-kicker">${selected?'AI 将持续扫描':'你是否也好奇'}</span><h3>${w.question}</h3><p>${w.detail}</p></div><label class="keyword-field"><span>再具体一点，推荐会更懂你</span><input id="interest-keywords" maxlength="100" value="${esc(state.keywords.join('、'))}" placeholder="作品、角色、系列、游戏或创作者，例如：芙莉莲、LABUBU"></label><div class="interest-selection" aria-live="polite"><span>${interestDraft.length?'已选择 '+interestDraft.length+' 个方向':'先选择一个兴趣方向'}</span><span>${interestDraft.length?interestDraft.join(' · '):'可多选，随时能改'}</span></div><button class="interest-enter" data-action="v3-apply-interests" ${interestDraft.length?'':'disabled'}>${interestDraft.length?'开启 AI 兴趣雷达':'先选择一个兴趣'} ${icon('arrow')}</button><small class="interest-disclosure">基础浏览不设信用分门槛 · 原型模拟公开资讯聚合</small>`;
};

preferences=function(onboard=false){
  interestOnboard=onboard;interestDraft=onboard?[]:[...state.interests];interestFocus=interestDraft[0]||'潮玩';
  modal('开启你的 AI 兴趣雷达',`<div class="interest-heading"><span class="interest-overline">真人兴趣版资讯平台</span><h2>你说喜欢什么，<br>AI 就替你去全网寻找。</h2><p>选择领域，再补充具体作品、角色或创作者。</p></div><div class="interest-constellation" role="group" aria-label="选择兴趣，可多选">${categories.map((t,i)=>`<button class="interest-orb orb-${i} ${interestDraft.includes(t)?'active':''}" data-interest="${t}" aria-pressed="${interestDraft.includes(t)}"><span class="orb-mark">${icon(interestWorlds[t].icon)}</span><strong>${t}</strong><span class="orb-hint">${interestWorlds[t].hint}</span><span class="orb-check">${icon('check')}</span></button>`).join('')}</div><label class="interest-place">${icon('pin')}<span>附近榜所在街区</span><select id="interest-place" aria-label="附近榜所在街区">${['杭州 · 滨江','杭州 · 西湖','上海 · 徐汇'].map(t=>`<option ${t===state.place?'selected':''}>${t}</option>`).join('')}</select></label><div id="interest-feedback">${interestPreview()}</div>`);
  $('#modal').classList.add('interest-modal');
};

function v3CuriosityIntro(){
  modal('你最想偷看附近的哪件事？',`<div class="curiosity-intro"><span class="interest-overline">先从一个好奇心开始</span><h2>如果现在能看见，<br>你最想知道哪一件？</h2><p>选一个问题，再告诉 AI 你具体喜欢什么。</p><div class="curiosity-grid"><button class="curiosity-card" data-curiosity="动漫">${icon('film')}<strong>附近的人最近都在追什么番？</strong><small>看看同街区的新番热度</small></button><button class="curiosity-card" data-curiosity="游戏">${icon('grid')}<strong>本街区谁也在玩同一款游戏？</strong><small>从作品找到同号人</small></button><button class="curiosity-card" data-curiosity="潮玩">${icon('star')}<strong>周围的人都在收什么新手办？</strong><small>发现附近收藏风向</small></button><button class="curiosity-card" data-curiosity="电影">${icon('heart')}<strong>同好刚把什么内容顶上榜？</strong><small>只看同频圈层的热度</small></button></div><div class="curiosity-foot">无需信用分 · 选择后可继续细化标签</div></div>`);
}

function v3AiScan(){
  modal('AI 正在按你的兴趣整理',`<div class="ai-scan"><div class="scan-head"><span class="radar-dot"></span><strong>模拟扫描公开资讯来源</strong></div><div class="scan-line"></div><div class="scan-sources">${v3Platforms.map(s=>`<span>${s}</span>`).join('')}</div></div><p>正在合并相同话题，并结合「${state.interests.join('、')}」${state.keywords.length?'和关键词「'+state.keywords.join('、')+'」':''}整理你的首页。</p><p class="model-note">这是产品交互原型，不会在当前页面实际抓取或保存第三方平台数据。</p>`);
  window.setTimeout(()=>{$('#modal').close();render();toast('兴趣雷达已更新，双榜和资讯流已重新整理');},950);
}

document.addEventListener('click',event=>{
  const button=event.target.closest('button');
  if(!button)return;
  const data=button.dataset;
  if(data.curiosity){
    interestDraft=[data.curiosity];interestFocus=data.curiosity;$('#modal').close();preferences(true);return;
  }
  if(data.source){state.sourceFilter=data.source;saveState();feedLimit=20;render();return;}
  if(data.rankCategory){v3RankCategory=data.rankCategory;render();return;}
  if(data.action==='v3-apply-interests'){
    if(!interestDraft.length){toast('至少选择一个兴趣方向');return;}
    const input=$('#interest-keywords');
    const keywords=String(input?.value||'').split(/[,，、;；\n]+/).map(s=>s.trim()).filter(Boolean).slice(0,8);
    state.interests=[...interestDraft];state.keywords=keywords;state.place=$('#interest-place')?.value||state.place;state.onboarded=true;state.productV3Onboarded=true;state.sourceFilter='全部来源';v3RankCategory=state.interests[0];saveState();feedLimit=20;v3AiScan();
  }
});

render();
if(!state.productV3Onboarded)window.setTimeout(v3CuriosityIntro,160);
