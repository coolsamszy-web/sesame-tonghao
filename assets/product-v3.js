/* 芝麻同好 V3：真人兴趣版资讯平台（静态交互原型） */
const v3Platforms=['小红书','B站','微博','官方资讯','豆瓣'];
let v3RankCategory=state.interests[0]||'动漫';
let v3IpDraft=[],v3IpQuery='',v3IpLetter='全部';
state.customIps=state.customIps&&typeof state.customIps==='object'?state.customIps:{};
const v3IpCatalog={
  '潮玩':[['A','A BATHING APE'],['B','BE@RBRICK'],['B','Bunny'],['C','CRYBABY'],['D','DIMOO'],['F','FARMER BOB'],['H','HIRONO小野'],['K','KAWS'],['L','LABUBU'],['L','Lilios'],['M','MOLLY'],['N','Nyota'],['P','PUCKY'],['S','SKULLPANDA'],['S','Sonny Angel'],['S','Sweet Bean'],['T','THE MONSTERS'],['T','TOKIDOKI'],['Z','ZIMOMO'],['Z','卓大王']],
  '游戏':[['A','艾尔登法环'],['B','崩坏：星穹铁道'],['C','刺客信条'],['D','动物森友会'],['F','风之旅人'],['G','怪物猎人'],['H','黑神话：悟空'],['J','绝区零'],['K','空洞骑士'],['M','Minecraft'],['N','逆水寒'],['P','帕鲁'],['S','塞尔达传说'],['S','赛博朋克2077'],['S','双人成行'],['W','王者荣耀'],['W','巫师3'],['Y','原神'],['Z','最终幻想'],['Z','只狼']],
  '动漫':[['A','ALICE与藏六'],['B','宝可梦'],['D','胆大党'],['F','葬送的芙莉莲'],['G','鬼灭之刃'],['H','海贼王'],['H','火影忍者'],['J','进击的巨人'],['J','间谍过家家'],['J','咒术回战'],['L','蓝色监狱'],['L','龙珠'],['M','名侦探柯南'],['Q','轻音少女'],['S','四月是你的谎言'],['W','我推的孩子'],['X','新世纪福音战士'],['Y','药屋少女的呢喃'],['Z','紫罗兰永恒花园'],['Z','灼眼的夏娜']],
  '漫画':[['A','阿衰'],['B','镖人'],['B','不安之书'],['D','电锯人'],['D','灌篮高手'],['F','非人哉'],['G','孤独摇滚'],['G','鬼灭之刃'],['H','海贼王'],['J','间谍过家家'],['J','进击的巨人'],['J','咒术回战'],['L','浪客行'],['L','蓝色时期'],['M','迷宫饭'],['N','女神降临'],['P','排球少年'],['S','深夜食堂'],['Y','一人之下'],['Z','昨日的美食']],
  '电影':[['A','爱乐之城'],['B','霸王别姬'],['D','盗梦空间'],['D','大话西游'],['F','飞屋环游记'],['H','花样年华'],['H','海上钢琴师'],['J','机器人总动员'],['J','寄生虫'],['L','绿皮书'],['M','末代皇帝'],['P','怦然心动'],['Q','千与千寻'],['R','让子弹飞'],['S','沙丘'],['T','泰坦尼克号'],['W','完美的日子'],['X','星际穿越'],['Y','宇宙探索编辑部'],['Z','这个杀手不太冷']],
  '电视剧':[['A','爱情公寓'],['C','沉默的真相'],['F','繁花'],['H','黑暗荣耀'],['H','后翼弃兵'],['K','狂飙'],['L','琅琊榜'],['M','漫长的季节'],['P','破产姐妹'],['Q','庆余年'],['Q','去有风的地方'],['R','人世间'],['S','山花烂漫时'],['W','我的阿勒泰'],['W','武林外传'],['X','想见你'],['Y','隐秘的角落'],['Y','鱿鱼游戏'],['Z','甄嬛传'],['Z','重启人生']],
  '书籍':[['A','埃隆·马斯克传'],['B','百年孤独'],['C','长安的荔枝'],['D','当下的力量'],['F','房思琪的初恋乐园'],['H','活着'],['J','局外人'],['K','克拉拉与太阳'],['M','蛤蟆先生去看心理医生'],['N','挪威的森林'],['P','平凡的世界'],['R','人类简史'],['S','三体'],['S','始于极限'],['W','我与地坛'],['X','悉达多'],['Y','也许你该找个人聊聊'],['Y','月亮与六便士'],['Z','置身事内'],['Z','追风筝的人']]
};

function v3IpItems(categoryName){
  const builtIn=(v3IpCatalog[categoryName]||[]).map(([initial,name])=>({initial,name,custom:false}));
  const custom=(state.customIps[categoryName]||[]).map(name=>({initial:'自定义',name,custom:true}));
  return [...builtIn,...custom];
}

function v3IpWall(){
  const all=v3IpItems(interestFocus),letters=['全部',...new Set(all.map(item=>item.initial))];
  const shown=all.filter(item=>(v3IpLetter==='全部'||item.initial===v3IpLetter)&&(!v3IpQuery||item.name.toLowerCase().includes(v3IpQuery.toLowerCase())));
  return `<section class="ip-wall"><div class="ip-wall-head"><div><span>${esc(interestFocus)} · IP 墙</span><strong>${all.length} 个 IP</strong></div><label>${icon('search')}<input id="ip-search" value="${esc(v3IpQuery)}" placeholder="搜索 ${esc(interestFocus)} IP"></label></div><div class="ip-letters">${letters.map(letter=>`<button class="${v3IpLetter===letter?'active':''}" data-ip-letter="${letter}">${letter}</button>`).join('')}</div><div class="ip-cloud">${shown.map(item=>`<button class="${v3IpDraft.includes(item.name)?'active':''}" data-ip="${esc(item.name)}"><span>${esc(item.name)}</span>${item.custom?'<small>自定义</small>':''}</button>`).join('')||'<p>没有找到，试试主动添加这个 IP。</p>'}</div><div class="ip-maintain"><input id="custom-ip" maxlength="30" placeholder="没有找到？添加一个 IP"><button data-action="add-custom-ip">+ 添加</button></div><small class="ip-note">IP 墙包含平台内置条目与你主动维护的条目；新增内容仅保存在当前设备。</small></section>`;
}

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
  return `${g===2?'附近同好正在关注':'同好人气上升'} · ${x.platform||'公开资讯'}`;
};

feedData=function(){
  return allContent().filter(x=>
    x.person!=='me'&&
    (category==='全部'||x.category===category)&&
    (!query||[x.title,x.object,x.body,person(x.person).name,x.category].join(' ').toLowerCase().includes(query.toLowerCase()))&&
    (page!=='following'||state.following.includes(x.person))&&
    (!nearby||page==='following'||geo(person(x.person))===2)&&
    (state.sourceFilter==='全部来源'||x.platform===state.sourceFilter)
  ).sort((a,b)=>score(b)-score(a));
};

card=function(x){
  const p=person(x.person);
  const sourceText=x.platform||'公开资讯';
  return `<article class="feed-card">
    <button class="content-open" data-detail="${x.id}" aria-label="查看${esc(x.title)}">
      ${cover(x)}
      <div class="feed-copy">
        <div class="ai-source-row"><span class="ai-badge">AI 搜到</span><span class="source-label">${esc(sourceText)}</span><span class="freshness">${esc(x.freshness||'最近更新')}</span></div>
        <h3>${esc(x.title)}</h3><p>${esc(x.body)}</p><span class="object-tag"># ${esc(x.object)}</span>
      </div>
    </button>
    <div class="community-author tag-origin"><button class="person-link row" data-person="${p.id}"><span class="avatar">${esc(p.letter)}</span><span><strong>来自 ${esc(p.name)} 的兴趣标签</strong><small>${esc(p.objects.slice(0,2).join(' · ')||p.category)} · ${geo(p)===2?'同街区':esc(p.place)}</small></span></button>${followBtn(p.id)}</div>
    <div class="distribution"><span>${reason(x)}</span><button data-why="${x.id}" aria-label="了解推荐理由">${icon('pin')}</button></div>
    <div class="feed-actions"><button data-like="${x.id}" class="${state.liked.includes(x.id)?'selected':''}" aria-label="认可这条内容">${icon('heart')} ${x.likes+(state.liked.includes(x.id)?1:0)}</button><button data-save="${x.id}" class="${state.saved.includes(x.id)?'selected':''}">${icon('save')} ${state.saved.includes(x.id)?'已收藏':'收藏'}</button><span>${reach(x)}</span></div>
  </article>`;
};

detail=function(id){
  const x=allContent().find(item=>item.id===id);if(!x)return;
  const p=person(x.person);
  const gallery=x.images?.length?`<div class="detail-gallery">${x.images.map((src,i)=>`<figure><img src="${src}" alt="${esc(x.object)}资料图片 ${i+1}" loading="eager"><figcaption>${esc(x.imageCredit||x.platform||'公开资料')} · ${i+1}/${x.images.length}</figcaption></figure>`).join('')}</div>`:cover(x);
  modal(x.title,`${gallery}<div class="ai-detail-label"><span class="ai-badge">AI 全网搜索</span><span>${esc(x.platform||'公开资讯')} · ${esc(x.freshness||'最近更新')}</span></div><p class="detail-body" style="margin-top:14px">${esc(x.body)}</p><p class="object-tag"># ${esc(x.object)} · ${esc(x.category)}</p><div class="service-detail"><h3>为什么找到这条</h3><p>${reason(x)}。AI 根据用户公开表达的兴趣标签检索并整理相关公开内容，这不是该用户发布的帖子。</p></div>${x.source?`<p class="photo-source">原始公开资料：<a href="${x.source}" target="_blank" rel="noreferrer">${esc(x.imageCredit||x.platform||'查看来源')}</a></p>`:''}<div class="detail-attribution"><button class="person-link row" data-person="${p.id}"><span class="avatar">${esc(p.letter)}</span><span><strong>此条内容来源于用户${esc(p.name)}的标签</strong><small>${esc(p.objects.slice(0,3).join(' · ')||p.category)}</small></span></button>${followBtn(p.id)}</div><div class="detail-actions-v3"><button data-like="${x.id}" class="${state.liked.includes(x.id)?'selected':''}">${icon('heart')}<span>${x.likes+(state.liked.includes(x.id)?1:0)} 人点赞</span></button><button data-save="${x.id}" data-detail-refresh="true" class="${state.saved.includes(x.id)?'selected':''}">${icon('save')}<span>${state.saved.includes(x.id)?'已收藏':'收藏内容'}</span></button></div><p class="model-note">原型演示：资讯、人物标签与推荐关系均为样例数据，评论暂不开放。</p>`);
};

function v3SourceFilters(){
  return `<div class="source-filters" aria-label="资讯来源筛选">${['全部来源',...v3Platforms].map(source=>`<button class="source-chip ${state.sourceFilter===source?'active':''}" data-source="${source}">${source}</button>`).join('')}</div>`;
}

function v3Rankings(){
  const nearbyItems=[...allContent()].filter(x=>x.person!=='me'&&geo(person(x.person))>0).sort((a,b)=>(b.likes+score(b))-(a.likes+score(a))).slice(0,5);
  if(!categories.includes(v3RankCategory))v3RankCategory=state.interests[0]||'动漫';
  const verticalItems=[...allContent()].filter(x=>x.person!=='me'&&x.category===v3RankCategory).sort((a,b)=>(b.likes+b.quality)-(a.likes+a.quality)).slice(0,5);
  const rankList=items=>`<div class="rank-list">${items.map((x,i)=>`<button class="rank-item" data-detail="${x.id}"><span class="rank-no">${i+1}</span><span><strong>${esc(x.title)}</strong><small>${esc(x.object)} · ${esc(x.platform||'同好动态')}</small></span><span class="rank-rise">${i<2?'热度上升':'NEW'}</span></button>`).join('')}</div>`;
  return `<section class="ranking-board" aria-label="兴趣榜单">
    <article class="rank-panel nearby-rank"><span class="rank-kicker">NEARBY NOW</span><h2>${esc(state.place)} · 附近热点榜</h2><p>看看附近的人正在关注什么，找到今天的线下谈资。</p>${rankList(nearbyItems)}</article>
    <article class="rank-panel"><span class="rank-kicker">SAME INTEREST</span><h2>垂类同好榜</h2><p>不追全网总热度，只看与你同频的领域。</p><div class="vertical-switch">${categories.map(c=>`<button class="${v3RankCategory===c?'active':''}" data-rank-category="${c}">${c}</button>`).join('')}</div>${rankList(verticalItems)}</article>
  </section>`;
}

profilePanel=function(){
  return `<div class="aside-card member"><div class="member-top">我的兴趣雷达</div><div class="member-mark">∞</div><h3>${state.profile?esc(state.profile.identity):'AI 正在替你盯全网'}</h3><p>兴趣越具体，聚合到的公开资讯越贴近你。</p><div class="interest-tags">${state.interests.map(t=>`<span>${esc(t)}</span>`).join('')}</div>${state.keywords.length?`<div class="keyword-tags">${state.keywords.map(t=>`<span># ${esc(t)}</span>`).join('')}</div>`:''}<button data-action="preferences">调整兴趣雷达 →</button><small class="model-note">原型演示 · 来源链接与抓取结果仅作产品效果展示</small></div>`;
};

nearbyPanel=function(){
  const ps=people.filter(p=>geo(p)>0).sort((a,b)=>geo(b)-geo(a));
  return `<div class="aside-card nearby-panel"><div class="between"><h3>附近兴趣脉冲</h3><button class="text-btn" data-action="map">看看谁在关注 ${icon('arrow')}</button></div><div class="mini-map" aria-label="附近兴趣热度示意图"><span class="map-area">${esc(state.place)} · 热度示意</span>${(ps.length?ps:people.slice(0,2)).slice(0,3).map((p,i)=>`<button style="left:${18+i*26}%;top:${42+(i%2)*24}%" data-person="${p.id}" aria-label="查看${p.name}"><span class="avatar">${p.letter}</span><small>${p.category}</small></button>`).join('')}</div><p class="muted" style="font-size:11px;margin-top:10px">从公开资讯的兴趣热度出发，再发现真实同好人。</p></div>`;
};

square=function(){
  return `<section class="home-brief-row"><div class="interest-dock"><div class="interest-dock-head"><span><i class="radar-dot"></i>我的兴趣标签</span><button data-action="preferences">+ 添加 / 调整</button></div><div class="interest-quick-tags">${state.interests.map(t=>`<button data-action="preferences">${esc(t)}</button>`).join('')}${state.keywords.slice(0,3).map(t=>`<button data-action="preferences"># ${esc(t)}</button>`).join('')}</div><small>AI 正按这些标签搜索公开内容</small></div><aside class="ai-mini-card"><span>AI 兴趣雷达</span><strong>全网资讯，<br>只推你真正关心的</strong><small>${state.place} · 运行中</small></aside></section>
  ${v3Rankings()}
  <div class="main-grid"><section><div class="between section-head feed-section-head"><h2>AI 为你找到的内容</h2><span class="feed-count">基于 ${state.interests.length+state.keywords.length} 个标签</span></div>${chips()}${v3SourceFilters()}<div class="feed-tools"><button class="near-toggle ${nearby?'active':''}" data-action="nearby" aria-pressed="${nearby}">${icon('pin')} ${nearby?'仅看本街区标签':'兴趣 × 地缘推荐'}</button></div><p class="sample-note"><span class="demo-dot"></span>每条内容均由 AI 根据某位用户的标签从公开来源搜索整理，并非该用户发布</p>${query?`<div class="search-result">搜索“${esc(query)}”<button data-action="clear-search">清除</button></div>`:''}<div class="feed-grid">${visibleFeed().map(card).join('')||empty('暂时没有匹配资讯','换一个来源、兴趣或关键词再试试。')}</div>${moreButton()}</section><aside>${profilePanel()}${nearbyPanel()}<div class="aside-card"><h3>兴趣相投的人</h3><p class="muted" style="margin:8px 0 12px">关注一个人的标签，持续看到 AI 围绕其兴趣找到的内容。</p>${peopleList(people.filter(p=>state.interests.includes(p.category)).slice(0,3))}</div></aside></div>`;
};

following=function(){
  return `<div class="page-title between"><div><h1>关注这些人，也关注他们的标签</h1><p>AI 持续围绕被关注用户的标签搜索公开内容。</p></div><button class="secondary" data-action="discover">发现同好人</button></div><div class="main-grid"><section><div class="following-strip">${state.following.length?state.following.map(id=>{const p=person(id);return `<button data-person="${id}"><span class="avatar">${p.letter}</span><span>${p.name}</span></button>`}).join(''):'<span class="muted">先从一位品味相投的人开始关注</span>'}</div>${chips()}${v3SourceFilters()}<p class="sample-note"><span class="demo-dot"></span>这里展示 AI 根据你关注用户的标签找到的公开内容，不是他们发布的帖子</p><div class="feed-grid">${visibleFeed().map(card).join('')||empty(state.following.length?'这个兴趣下暂时没有更新':'还没有关注同好人',state.following.length?'切换其他分类或资讯来源。':'关注后，AI 会围绕他的标签持续寻找内容。')}</div>${moreButton()}${!state.following.length?`<div class="aside-card" style="margin-top:18px"><h3>可以先认识这些同好人</h3>${peopleList(people.slice(0,9))}</div>`:''}</section><aside>${profilePanel()}${nearbyPanel()}</aside></div>`;
};

mine=function(){
  const p=person('me'),saved=allContent().filter(x=>x.person!=='me'&&state.saved.includes(x.id));
  return `<div class="page-title between"><div><h1>我的兴趣雷达</h1><p>管理标签、关键词、关注和收藏，让 AI 搜得越来越准。</p></div><button class="text-btn" data-action="preferences">调整兴趣 ${icon('arrow')}</button></div><div class="main-grid"><section><div class="profile-top"><div class="row"><span class="avatar">${p.letter}</span><span>${esc(p.name)}</span><span class="level">标签拥有者</span></div><h2>${esc(p.identity)}</h2><p>${esc(p.bio)||'你关注的作品、角色、系列和创作者，会共同组成你的资讯雷达。'}</p><div class="interest-tags">${state.interests.map(x=>`<span>${esc(x)}</span>`).join('')}</div>${state.keywords.length?`<div class="keyword-tags">${state.keywords.map(x=>`<span># ${esc(x)}</span>`).join('')}</div>`:''}<div class="profile-counts"><span><b>${state.interests.length+state.keywords.length}</b> 标签</span><span><b>${state.following.length}</b> 关注</span><span><b>${state.saved.length}</b> 收藏</span></div><button class="secondary" data-action="preferences">编辑标签与关键词</button></div><div class="between section-head"><h2>收藏的 AI 搜索结果</h2></div><div class="feed-grid">${saved.map(card).join('')||empty('还没有收藏','在广场收藏一条 AI 找到的内容，之后可以从这里继续看。')}</div></section><aside><div class="aside-card"><h3>兴趣称号</h3><div class="badges"><div class="badge">${icon('star')}<strong>兴趣探索者</strong><small>已点亮</small></div><div class="badge ${state.saved.length?'':'locked'}">${icon('book')}<strong>资讯收藏家</strong><small>${state.saved.length?'已点亮':'收藏 1 条'}</small></div><div class="badge ${state.following.length?'':'locked'}">${icon('crown')}<strong>同好发现者</strong><small>${state.following.length?'已点亮':'关注 1 人'}</small></div></div><p class="model-note">称号只记录兴趣参与，不代表专业或信用认证。</p></div>${nearbyPanel()}<div class="aside-card"><h3>内容说明</h3><p class="muted" style="margin-top:10px">页面内容均为 AI 根据用户标签搜索整理的公开内容，不是用户发布的帖子。评论暂不开放。</p></div></aside></div>`;
};

showPerson=function(id){
  if(id==='me'){$('#modal').close();go('profile');return;}
  const p=person(id);
  modal(p.name,`<div class="person-profile"><span class="avatar">${p.letter}</span><h3>${p.identity}</h3><p>${p.place} · 兴趣标签由本人表达</p><p>${p.bio}</p><span class="source-label">人物、街区与关系为原型演示</span></div><h3 style="margin:18px 0 10px">他的兴趣标签</h3><div class="object-list">${p.objects.map(t=>`<span>${t}</span>`).join('')}</div><h3 style="margin:18px 0 10px">关注后，你会看到</h3><p>AI 围绕他的标签持续从公开来源搜索、整理的相关内容。</p><div class="option-list">${content.filter(x=>x.person===id).slice(0,5).map(x=>`<button class="option" data-detail="${x.id}"><div><b>${x.title}</b><small>AI 根据其标签找到 · ${x.platform||'公开资讯'}</small></div>${icon('arrow')}</button>`).join('')}</div><div class="dialog-actions">${followBtn(id)}</div>`);
};

interestPreview=function(){
  const selected=interestDraft.includes(interestFocus),w=interestWorlds[interestFocus];
  return `<div class="interest-reveal"><span class="reveal-kicker">${selected?'继续选择具体 IP':'你是否也好奇'}</span><h3>${w.question}</h3><p>${w.detail}</p></div>${v3IpWall()}<div class="interest-selection" aria-live="polite"><span>${interestDraft.length?'已选择 '+interestDraft.length+' 个垂类':'先选择一个兴趣垂类'}</span><span>${v3IpDraft.length?'已选择 '+v3IpDraft.length+' 个 IP':'可多选 IP，推荐会更准确'}</span></div><button class="interest-enter" data-action="v3-apply-interests" ${interestDraft.length?'':'disabled'}>${interestDraft.length?'用这些标签开启 AI 雷达':'先选择一个兴趣'} ${icon('arrow')}</button><small class="interest-disclosure">基础浏览不设信用分门槛 · IP 可搜索、按首字母检索并主动维护</small>`;
};

preferences=function(onboard=false){
  interestOnboard=onboard;interestDraft=onboard?[]:[...state.interests];interestFocus=interestDraft[0]||'潮玩';v3IpDraft=onboard?[]:[...state.keywords];v3IpQuery='';v3IpLetter='全部';
  modal('开启你的 AI 兴趣雷达',`<div class="interest-heading"><span class="interest-overline">垂类标签 → 具体 IP</span><h2>先选领域，<br>再点亮你真正喜欢的 IP。</h2><p>每个垂类都有完整 IP 墙，也可以添加你没找到的条目。</p></div><div class="interest-constellation" role="group" aria-label="选择兴趣，可多选">${categories.map((t,i)=>`<button class="interest-orb orb-${i} ${interestDraft.includes(t)?'active':''}" data-interest="${t}" aria-pressed="${interestDraft.includes(t)}"><span class="orb-mark">${icon(interestWorlds[t].icon)}</span><strong>${t}</strong><span class="orb-hint">${interestWorlds[t].hint}</span><span class="orb-check">${icon('check')}</span></button>`).join('')}</div><label class="interest-place">${icon('pin')}<span>附近榜所在街区</span><select id="interest-place" aria-label="附近榜所在街区">${['杭州 · 滨江','杭州 · 西湖','上海 · 徐汇'].map(t=>`<option ${t===state.place?'selected':''}>${t}</option>`).join('')}</select></label><div id="interest-feedback">${interestPreview()}</div>`);
  $('#modal').classList.add('interest-modal');
};

function v3CuriosityIntro(){
  modal('你最想偷看附近的哪件事？',`<div class="curiosity-intro"><span class="interest-overline">先从一个好奇心开始</span><h2>如果现在能看见，<br>你最想知道哪一件？</h2><p>选一个问题，再告诉 AI 你具体喜欢什么。</p><div class="curiosity-grid"><button class="curiosity-card" data-curiosity="动漫">${icon('film')}<strong>附近的人最近都在追什么番？</strong><small>看看同街区的新番热度</small></button><button class="curiosity-card" data-curiosity="游戏">${icon('grid')}<strong>本街区谁也在玩同一款游戏？</strong><small>从作品找到同好人</small></button><button class="curiosity-card" data-curiosity="潮玩">${icon('star')}<strong>周围的人都在收什么新手办？</strong><small>发现附近收藏风向</small></button><button class="curiosity-card" data-curiosity="电影">${icon('heart')}<strong>同好刚把什么内容顶上榜？</strong><small>只看同频圈层的热度</small></button></div><div class="curiosity-foot">无需信用分 · 选择后可继续细化标签</div></div>`);
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
  if(data.interest){v3IpQuery='';v3IpLetter='全部';const host=$('#interest-feedback');if(host)host.innerHTML=interestPreview();return;}
  if(data.ipLetter){v3IpLetter=data.ipLetter;const host=$('#interest-feedback');if(host)host.innerHTML=interestPreview();return;}
  if(data.ip){v3IpDraft=v3IpDraft.includes(data.ip)?v3IpDraft.filter(ip=>ip!==data.ip):[...v3IpDraft,data.ip];const host=$('#interest-feedback');if(host)host.innerHTML=interestPreview();return;}
  if(data.action==='add-custom-ip'){
    const value=String($('#custom-ip')?.value||'').trim();if(!value){toast('先输入要添加的 IP 名称');return;}
    const list=state.customIps[interestFocus]||[];if(!list.includes(value)&&!v3IpItems(interestFocus).some(item=>item.name===value))state.customIps[interestFocus]=[...list,value];
    if(!v3IpDraft.includes(value))v3IpDraft.push(value);saveState();v3IpLetter='全部';v3IpQuery='';$('#interest-feedback').innerHTML=interestPreview();toast(`已添加「${value}」`);return;
  }
  if(data.like&&$('#modal').open){window.setTimeout(()=>detail(data.like),0);return;}
  if(data.action==='v3-apply-interests'){
    if(!interestDraft.length){toast('至少选择一个兴趣方向');return;}
    const keywords=[...new Set(v3IpDraft)].slice(0,30);
    state.interests=[...interestDraft];state.keywords=keywords;state.place=$('#interest-place')?.value||state.place;state.onboarded=true;state.productV3Onboarded=true;state.sourceFilter='全部来源';v3RankCategory=state.interests[0];saveState();feedLimit=20;v3AiScan();
  }
});

document.addEventListener('input',event=>{
  if(event.target?.id!=='ip-search')return;
  v3IpQuery=event.target.value;v3IpLetter='全部';
  const wall=event.target.closest('.ip-wall');if(!wall)return;
  const next=document.createElement('div');next.innerHTML=v3IpWall();wall.replaceWith(next.firstElementChild);
  const input=$('#ip-search');if(input){input.focus();input.setSelectionRange(input.value.length,input.value.length);}
});

render();
if(!state.productV3Onboarded)window.setTimeout(v3CuriosityIntro,160);
