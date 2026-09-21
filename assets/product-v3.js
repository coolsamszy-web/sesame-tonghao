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

state.nearbyScope=['街道','区县','市','省'].includes(state.nearbyScope)?state.nearbyScope:'街道';
const v3BaseModal=modal;
modal=function(title,body){v3BaseModal(title,body);$('#modal').classList.remove('rank-sheet');};

function v3AreaNames(){
  const table={
    '杭州 · 滨江':{街道:'长河街道',区县:'滨江区',市:'杭州市',省:'浙江省'},
    '杭州 · 西湖':{街道:'古荡街道',区县:'西湖区',市:'杭州市',省:'浙江省'},
    '上海 · 徐汇':{街道:'徐家汇街道',区县:'徐汇区',市:'上海市',省:'上海市'}
  };
  return table[state.place]||{街道:'当前街道',区县:'当前区县',市:state.place.split(' · ')[0]+'市',省:'当前省份'};
}

function v3NearbyRankItems(scope=state.nearbyScope){
  const currentCity=state.place.split(' · ')[0];
  return [...allContent()].filter(x=>{
    if(x.person==='me')return false;const place=person(x.person).place||'';
    if(scope==='街道'||scope==='区县')return place===state.place;
    if(scope==='市')return place.split(' · ')[0]===currentCity;
    return true;
  }).sort((a,b)=>(b.likes+score(b))-(a.likes+score(a)));
}

function v3VerticalRankItems(categoryName=v3RankCategory){
  return [...allContent()].filter(x=>x.person!=='me'&&x.category===categoryName).sort((a,b)=>(b.likes+b.quality)-(a.likes+a.quality));
}

function v3SheetRows(items){
  return items.slice(0,20).map((x,index)=>`<button class="rank-sheet-item" data-detail="${x.id}"><span class="rank-sheet-no">${String(index+1).padStart(2,'0')}</span>${x.images?.[0]?`<img src="${x.images[0]}" alt="" loading="lazy">`:''}<span><strong>${esc(x.title)}</strong><small>${esc(x.object)} · ${esc(x.platform||'公开资讯')} · 来自${esc(person(x.person).name)}的标签</small></span>${icon('arrow')}</button>`).join('');
}

function v3OpenRankSheet(type){
  const nearby=type==='nearby',areas=v3AreaNames();
  const items=nearby?v3NearbyRankItems():v3VerticalRankItems();
  const controls=nearby?`<div class="rank-sheet-controls">${['街道','区县','市','省'].map(scope=>`<button class="${state.nearbyScope===scope?'active':''}" data-nearby-scope="${scope}">${scope}<small>${areas[scope]}</small></button>`).join('')}</div>`:`<div class="rank-sheet-controls category-controls">${categories.map(c=>`<button class="${v3RankCategory===c?'active':''}" data-sheet-category="${c}">${c}</button>`).join('')}</div>`;
  modal(nearby?'附近热点榜':'垂类同好榜',`<div class="rank-sheet-intro"><span>${nearby?esc(areas[state.nearbyScope]):esc(v3RankCategory)}</span><p>${nearby?'切换地理范围，查看不同距离内大家正在关注的内容。':'切换一级分类，查看该垂类当前热度最高的内容。'}</p></div>${controls}<div class="rank-sheet-scroll">${v3SheetRows(items)}</div><p class="model-note">榜单、位置及热度为产品原型演示；列表支持上下滑动。</p>`);
  $('#modal').classList.add('rank-sheet');
}

communityCatalog.forEach((item,index)=>{
  const categoryOffset=Math.max(0,categories.indexOf(item.category));
  item.platform=v3Platforms[(index+categoryOffset)%v3Platforms.length];
  item.freshness=['刚刚','18分钟前','1小时前','今天','昨天'][index%5];
  item.kind=`AI 聚合 · ${item.platform}`;
});

const v3DemoDynamics=people.slice(0,10).map((p,index)=>{
  const reference=communityCatalog.find(item=>item.person===p.id&&item.images?.length)||communityCatalog[index];
  const texts=[
    '下班路上顺手拍的，今天的光线刚好把它照得特别有故事感。',
    '本来只想看十分钟，结果又把这一段完整重温了一遍。',
    '最近反复喜欢的一个小细节，想看看有没有人也注意到了。',
    '周末整理收藏时翻出来的，隔了很久再看还是很喜欢。',
    '刚体验完，先不写长评，只想说这个瞬间真的很戳我。'
  ];
  return {id:`dynamic-${p.id}`,person:p.id,isUserPost:true,category:p.category||reference.category,text:texts[index%texts.length],title:texts[index%texts.length],body:texts[index%texts.length],object:p.objects?.[0]||reference.object,mediaType:'image',mediaUrl:reference.images?.[index%reference.images.length],likes:12+index*7,createdAt:Date.now()-index*3600000,kind:'用户动态'};
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

chips=function(){
  const selected=[...new Set(state.interests)].filter(c=>categories.includes(c));
  if(category!=='全部'&&!selected.includes(category))category='全部';
  return `<div class="filters categories selected-categories">${['全部',...selected].map(c=>`<button class="chip ${category===c?'active':''}" data-category="${c}" aria-pressed="${category===c}">${c}</button>`).join('')}</div>`;
};

reason=function(x){
  const keyword=state.keywords.find(k=>[x.title,x.object,x.body].join(' ').toLowerCase().includes(k.toLowerCase()));
  if(keyword)return `命中关键词「${keyword}」 · ${x.platform||'公开资讯'}`;
  if(state.interests.includes(x.category))return `匹配你的「${x.category}」兴趣 · ${x.platform||'公开资讯'}`;
  const g=geo(person(x.person));
  return `${g===2?'附近同好正在关注':'同好气上升'} · ${x.platform||'公开资讯'}`;
};

feedData=function(){
  const source=page==='following'?[...allContent(),...v3DemoDynamics]:allContent();
  return source.filter(x=>
    x.person!=='me'&&
    (category==='全部'||x.category===category)&&
    (!query||[x.title,x.object,x.body,person(x.person).name,x.category].join(' ').toLowerCase().includes(query.toLowerCase()))&&
    (page!=='following'||state.interests.includes(x.category)||state.keywords.some(tag=>[x.title,x.object,x.body].join(' ').includes(tag))||state.following.includes(x.person))&&
    (page!=='following'||!x.isUserPost||state.following.includes(x.person))&&
    (!nearby||page==='following'||geo(person(x.person))===2)&&
    (x.isUserPost||state.sourceFilter==='全部来源'||x.platform===state.sourceFilter)
  ).sort((a,b)=>(b.isUserPost?120:score(b))-(a.isUserPost?120:score(a))+(b.createdAt||0)-(a.createdAt||0));
};

card=function(x){
  if(x.isUserPost||x.person==='me')return v3DynamicCard(x);
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

function v3DynamicCard(x){
  const p=person(x.person),text=x.text||x.body||'',own=x.person==='me';
  const media=x.mediaUrl?(x.mediaType==='video'?`<video class="dynamic-media" src="${x.mediaUrl}" controls playsinline preload="metadata"></video>`:`<img class="dynamic-media" src="${x.mediaUrl}" alt="${esc(p.name)}发布的动态图片" loading="lazy">`):'';
  return `<article class="dynamic-card"><div class="dynamic-head"><button class="person-link row" data-person="${p.id}"><span class="avatar">${esc(p.letter)}</span><span><strong>${esc(p.name)}</strong><small>${own?'我的动态':esc(p.place)} · ${esc(x.freshness||'刚刚')}</small></span></button><span class="human-post-badge">本人动态</span></div>${media}<p>${esc(text)}</p>${x.object?`<span class="object-tag"># ${esc(x.object)}</span>`:''}<div class="dynamic-actions"><button data-like="${x.id}" class="${state.liked.includes(x.id)?'selected':''}">${icon('heart')} ${x.likes+(state.liked.includes(x.id)?1:0)}</button><button data-save="${x.id}" class="${state.saved.includes(x.id)?'selected':''}">${icon('save')} ${state.saved.includes(x.id)?'已收藏':'收藏'}</button></div></article>`;
}

function v3FeedCard(x){return x.isUserPost||x.person==='me'?v3DynamicCard(x):card(x);}

function v3PublishDynamic(){
  modal('发布一条简短动态',`<form id="v3-post-form" class="dynamic-composer"><label><span>说点什么</span><textarea name="text" maxlength="200" placeholder="一句感受、一个新发现，最多 200 字"></textarea></label><label class="media-picker"><span>添加图片或视频</span><input id="v3-media-input" name="media" type="file" accept="image/*,video/*"><small>支持单张图片或一段视频；大文件仅在当前会话预览。</small></label><div id="v3-media-preview" class="media-preview"></div><button class="primary" type="submit">发布到我的主页</button></form>`);
}

function v3ReadMedia(file){
  return new Promise(resolve=>{
    if(!file){resolve({mediaType:'',mediaUrl:''});return;}
    const mediaType=file.type.startsWith('video/')?'video':'image';
    if(file.size>1.5*1024*1024){resolve({mediaType,mediaUrl:URL.createObjectURL(file),mediaEphemeral:true});return;}
    const reader=new FileReader();reader.onload=()=>resolve({mediaType,mediaUrl:reader.result});reader.onerror=()=>resolve({mediaType:'',mediaUrl:''});reader.readAsDataURL(file);
  });
}

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
  const areas=v3AreaNames(),nearbyItems=v3NearbyRankItems().slice(0,5);
  if(!categories.includes(v3RankCategory))v3RankCategory=state.interests[0]||'动漫';
  const verticalItems=v3VerticalRankItems().slice(0,5);
  const rankList=items=>`<div class="rank-list">${items.map((x,i)=>`<button class="rank-item" data-detail="${x.id}"><span class="rank-no">${i+1}</span><span><strong>${esc(x.title)}</strong><small>${esc(x.object)} · ${esc(x.platform||'同好动态')}</small></span><span class="rank-rise">${i<2?'热度上升':'NEW'}</span></button>`).join('')}</div>`;
  return `<section class="ranking-board" aria-label="兴趣榜单">
    <article class="rank-panel nearby-rank"><div class="rank-panel-head"><div><span class="rank-kicker">NEARBY NOW</span><h2>${esc(areas[state.nearbyScope])} · 附近热点榜</h2></div><button class="rank-expand" data-rank-open="nearby">${state.nearbyScope} · 展开</button></div><p>可切换街道、区县、市、省，查看附近正在关注什么。</p>${rankList(nearbyItems)}</article>
    <article class="rank-panel"><div class="rank-panel-head"><div><span class="rank-kicker">SAME INTEREST</span><h2>${esc(v3RankCategory)} · 垂类同好榜</h2></div><button class="rank-expand" data-rank-open="vertical">更换分类 · 展开</button></div><p>进入完整榜单，可切换书籍、潮玩、游戏等一级分类。</p>${rankList(verticalItems)}</article>
  </section>`;
}

profilePanel=function(){
  return `<div class="aside-card member"><div class="member-top">我的兴趣雷达</div><div class="member-mark">∞</div><h3>${state.profile?esc(state.profile.identity):'AI 正在替你盯全网'}</h3><p>兴趣越具体，聚合到的公开资讯越贴近你。</p><div class="interest-tags">${state.interests.map(t=>`<span>${esc(t)}</span>`).join('')}</div>${state.keywords.length?`<div class="keyword-tags">${state.keywords.map(t=>`<span># ${esc(t)}</span>`).join('')}</div>`:''}<button data-action="preferences">调整兴趣雷达 →</button><small class="model-note">原型演示 · 来源链接与抓取结果仅作产品效果展示</small></div>`;
};

nearbyPanel=function(){
  const ps=people.filter(p=>geo(p)>0).sort((a,b)=>geo(b)-geo(a));
  return `<div class="aside-card nearby-panel"><div class="between"><h3>附近兴趣脉冲</h3><button class="text-btn" data-action="map">看看谁在关注 ${icon('arrow')}</button></div><div class="mini-map" aria-label="附近兴趣热度示意图"><span class="map-area">${esc(state.place)} · 热度示意</span>${(ps.length?ps:people.slice(0,2)).slice(0,3).map((p,i)=>`<button style="left:${18+i*26}%;top:${42+(i%2)*24}%" data-person="${p.id}" aria-label="查看${p.name}"><span class="avatar">${p.letter}</span><small>${p.category}</small></button>`).join('')}</div><p class="muted" style="font-size:11px;margin-top:10px">从公开资讯的兴趣热度出发，再发现真实同好。</p></div>`;
};

square=function(){
  return `<section class="home-brief-row"><div class="interest-dock"><div class="interest-dock-head"><span><i class="radar-dot"></i>我的兴趣标签</span><button data-action="preferences">+ 添加 / 调整</button></div><div class="interest-quick-tags">${state.interests.map(t=>`<button data-action="preferences">${esc(t)}</button>`).join('')}${state.keywords.map(t=>`<button data-action="preferences"># ${esc(t)}</button>`).join('')}</div><small>仅展示已选择标签 · AI 正按这些标签搜索公开内容</small></div><aside class="ai-mini-card"><span>AI 兴趣雷达</span><strong>全网资讯，<br>只推你真正关心的</strong><small>${state.place} · 运行中</small></aside></section>
  ${v3Rankings()}
  <div class="main-grid"><section><div class="between section-head feed-section-head"><h2>AI 为你找到的内容</h2><span class="feed-count">基于 ${state.interests.length+state.keywords.length} 个标签</span></div>${chips()}${v3SourceFilters()}<div class="feed-tools"><button class="near-toggle ${nearby?'active':''}" data-action="nearby" aria-pressed="${nearby}">${icon('pin')} ${nearby?'仅看本街区标签':'兴趣 × 地缘推荐'}</button></div><p class="sample-note"><span class="demo-dot"></span>每条内容均由 AI 根据某位用户的标签从公开来源搜索整理，并非该用户发布</p>${query?`<div class="search-result">搜索“${esc(query)}”<button data-action="clear-search">清除</button></div>`:''}<div class="feed-grid">${visibleFeed().map(card).join('')||empty('暂时没有匹配资讯','换一个来源、兴趣或关键词再试试。')}</div>${moreButton()}</section><aside>${profilePanel()}${nearbyPanel()}<div class="aside-card"><h3>兴趣相投的人</h3><p class="muted" style="margin:8px 0 12px">关注一个人的标签，持续看到 AI 围绕其兴趣找到的内容。</p>${peopleList(people.filter(p=>state.interests.includes(p.category)).slice(0,3))}</div></aside></div>`;
};

following=function(){
  const channelCount=state.interests.length+state.keywords.length+state.following.length;
  return `<div class="page-title between"><div><h1>关注流</h1><p>只汇总你关注的标签、关注之人的标签，以及他们亲自发布的动态。</p></div><button class="secondary" data-action="discover">发现同好</button></div><div class="following-sources"><span>我的标签 <b>${state.interests.length+state.keywords.length}</b></span><span>关注的人 <b>${state.following.length}</b></span><span>内容来源 <b>${channelCount}</b></span></div><div class="main-grid"><section><div class="following-strip">${state.following.length?state.following.map(id=>{const p=person(id);return `<button data-person="${id}"><span class="avatar">${p.letter}</span><span>${p.name}</span></button>`}).join(''):'<span class="muted">尚未关注用户，当前先展示你所选标签的内容</span>'}</div>${chips()}${v3SourceFilters()}<p class="sample-note"><span class="demo-dot"></span>“AI 搜到”是标签聚合内容，“本人动态”是关注用户亲自发布</p><div class="feed-grid">${visibleFeed().map(v3FeedCard).join('')||empty('关注流暂时没有更新','调整兴趣标签，或关注一位同好。')}</div>${moreButton()}${!state.following.length?`<div class="aside-card" style="margin-top:18px"><h3>可以先认识这些同好</h3>${peopleList(people.slice(0,9))}</div>`:''}</section><aside>${profilePanel()}${nearbyPanel()}</aside></div>`;
};

mine=function(){
  const p=person('me'),saved=[...allContent(),...v3DemoDynamics].filter(x=>x.person!=='me'&&state.saved.includes(x.id)),myDynamics=state.posts.filter(x=>x.person==='me');
  return `<div class="page-title between"><div><h1>我的兴趣主页</h1><p>管理兴趣标签，也记录当下想分享的简短动态。</p></div><button class="primary profile-publish" data-action="v3-publish">+ 发布动态</button></div><div class="main-grid"><section><div class="profile-top"><div class="row"><span class="avatar">${p.letter}</span><span>${esc(p.name)}</span><span class="level">标签拥有者</span></div><h2>${esc(p.identity)}</h2><p>${esc(p.bio)||'你关注的作品、角色、系列和创作者，会共同组成你的资讯雷达。'}</p><div class="interest-tags">${state.interests.map(x=>`<span>${esc(x)}</span>`).join('')}</div>${state.keywords.length?`<div class="keyword-tags">${state.keywords.map(x=>`<span># ${esc(x)}</span>`).join('')}</div>`:''}<div class="profile-counts"><span><b>${state.interests.length+state.keywords.length}</b> 标签</span><span><b>${state.following.length}</b> 关注</span><span><b>${myDynamics.length}</b> 动态</span></div><button class="secondary" data-action="preferences">编辑标签与关键词</button></div><div class="between section-head"><h2>我的动态</h2><button class="text-btn" data-action="v3-publish">发布文字 / 图片 / 视频 ${icon('arrow')}</button></div><div class="feed-grid dynamic-grid">${myDynamics.map(v3DynamicCard).join('')||empty('还没有发布动态','可以发布一句话、一张图片或一段视频。')}</div><div class="between section-head saved-head"><h2>收藏的内容</h2><span class="feed-count">${saved.length} 条</span></div><div class="feed-grid">${saved.map(card).join('')||empty('还没有收藏','在广场收藏一条 AI 找到的内容，之后可以从这里继续看。')}</div></section><aside><div class="aside-card"><h3>兴趣称号</h3><div class="badges"><div class="badge">${icon('star')}<strong>兴趣探索者</strong><small>已点亮</small></div><div class="badge ${myDynamics.length?'':'locked'}">${icon('book')}<strong>生活记录者</strong><small>${myDynamics.length?'已点亮':'发布 1 条'}</small></div><div class="badge ${state.following.length?'':'locked'}">${icon('crown')}<strong>同好发现者</strong><small>${state.following.length?'已点亮':'关注 1 人'}</small></div></div><p class="model-note">真人动态与 AI 搜索内容会使用不同标识。</p></div>${nearbyPanel()}<div class="aside-card"><h3>动态规则</h3><p class="muted" style="margin-top:10px">支持简短文字、单张图片或一段视频。评论暂不开放，可通过点赞和收藏表达共鸣。</p></div></aside></div>`;
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
  modal('你最想偷看附近的哪件事？',`<div class="curiosity-intro"><span class="interest-overline">先从一个好奇心开始</span><h2>如果现在能看见，<br>你最想知道哪一件？</h2><p>选一个问题，再告诉 AI 你具体喜欢什么。</p><div class="curiosity-grid"><button class="curiosity-card" data-curiosity="动漫">${icon('film')}<strong>附近的人最近都在追什么番？</strong><small>看看同街区的新番热度</small></button><button class="curiosity-card" data-curiosity="游戏">${icon('grid')}<strong>本街区谁也在玩同一款游戏？</strong><small>从作品找到同好</small></button><button class="curiosity-card" data-curiosity="潮玩">${icon('star')}<strong>周围的人都在收什么新手办？</strong><small>发现附近收藏风向</small></button><button class="curiosity-card" data-curiosity="电影">${icon('heart')}<strong>同好刚把什么内容顶上榜？</strong><small>只看同频圈层的热度</small></button></div><div class="curiosity-foot">无需信用分 · 选择后可继续细化标签</div></div>`);
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
  if(data.rankOpen){v3OpenRankSheet(data.rankOpen);return;}
  if(data.nearbyScope){state.nearbyScope=data.nearbyScope;saveState();render();v3OpenRankSheet('nearby');return;}
  if(data.sheetCategory){v3RankCategory=data.sheetCategory;render();v3OpenRankSheet('vertical');return;}
  if(data.action==='v3-publish'){v3PublishDynamic();return;}
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

document.addEventListener('change',event=>{
  if(event.target?.id!=='v3-media-input')return;
  const file=event.target.files?.[0],preview=$('#v3-media-preview');if(!preview)return;
  if(!file){preview.innerHTML='';return;}
  const url=URL.createObjectURL(file);
  preview.innerHTML=file.type.startsWith('video/')?`<video src="${url}" controls playsinline></video><small>${esc(file.name)} · 视频预览</small>`:`<img src="${url}" alt="待发布图片预览"><small>${esc(file.name)} · 图片预览</small>`;
});

document.addEventListener('submit',async event=>{
  if(event.target?.id!=='v3-post-form')return;
  event.preventDefault();
  const form=event.target,textValue=String(new FormData(form).get('text')||'').trim(),file=$('#v3-media-input')?.files?.[0];
  if(!textValue&&!file){toast('写一句话，或添加一张图片 / 视频');return;}
  const media=await v3ReadMedia(file);
  const mainTag=state.keywords[0]||state.interests[0]||'生活记录';
  state.posts.unshift({id:'dynamic-me-'+Date.now(),person:'me',isUserPost:true,category:state.interests[0]||'潮玩',text:textValue,title:textValue||`${file?.type.startsWith('video/')?'视频':'图片'}动态`,body:textValue,object:mainTag,likes:0,createdAt:Date.now(),freshness:'刚刚',kind:'用户动态',...media});
  saveState();$('#modal').close();page='profile';render();toast('动态已发布到个人主页');
});

render();
if(!state.productV3Onboarded)window.setTimeout(v3CuriosityIntro,160);
