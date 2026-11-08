(function(){
const NS='http://www.w3.org/2000/svg';
const $=(s,r=document)=>r.querySelector(s);
function S(tag,attrs,parent){const e=document.createElementNS(NS,tag);if(attrs)for(const k in attrs)e.setAttribute(k,attrs[k]);if(parent)parent.appendChild(e);return e;}
function T(parent,x,y,txt,cls,extra){const t=S('text',Object.assign({x,y,class:cls||'s-muted'},extra||{}),parent);t.textContent=txt;return t;}
function clear(svg){while(svg.firstChild)svg.removeChild(svg.firstChild);}
function korNum(x){
  if(!isFinite(x))return '∞';
  if(x<10)return x.toFixed(x<1?2:1);
  if(x<1e4)return Math.round(x).toLocaleString('ko-KR');
  if(x>=1e24){const e=Math.floor(Math.log10(x));return (x/Math.pow(10,e)).toFixed(1)+' × 10<sup>'+e+'</sup>';}
  const u=[[1e20,'해'],[1e16,'경'],[1e12,'조'],[1e8,'억'],[1e4,'만']];
  for(const [v,n] of u){if(x>=v){const q=x/v;return (q>=100?Math.round(q).toLocaleString('ko-KR'):q.toFixed(q<10?1:0))+n;}}
}
function fmtMag(m){return (m>0?'+':'')+m.toFixed(m%1===0?0:2).replace(/\.?0+$/,m%1===0?'':'')}
function mag(m){const s=(Math.round(m*100)/100).toString();return (m>0?'+':'')+s;}

/* ---------- hero sky ---------- */
(function(){
  const svg=$('#heroSky');let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
  const counts=[4,9,18,34,62,110];
  const rad=[6,4.6,3.4,2.5,1.7,1.1];
  for(let c=5;c>=0;c--){for(let i=0;i<counts[c];i++){S('circle',{cx:(8+rnd()*464).toFixed(1),cy:(8+rnd()*230).toFixed(1),r:rad[c],class:'s-ink'},svg);}}
  const lg=S('g',{},svg);
  for(let c=0;c<6;c++){const x=30+c*76;S('circle',{cx:x,cy:272,r:rad[c],class:'s-ink'},lg);T(lg,x+10,277,(c+1)+'등성','s-muted',{'font-size':'13'});}
  S('line',{x1:0,x2:480,y1:250,y2:250,class:'s-line','stroke-width':1},svg);
})();

/* ---------- universe scale ---------- */
(function(){
  const rows=[
    {y:'150년경',w:'프톨레마이오스',d:'별 천구까지 (지구 반지름의 약 2만 배)',v:1.3e-5,l:'약 0.00001 광년 (0.000004 pc)'},
    {y:'1838',w:'베셀',d:'처음 거리를 잰 별, 백조자리 61',v:10.3,l:'약 10 광년 (3.2 pc)'},
    {y:'1918',w:'섀플리',d:'우리은하의 지름 추정',v:3e5,l:'약 30만 광년 (약 9만 pc)'},
    {y:'1925',w:'허블',d:'안드로메다는 다른 은하',v:9e5,l:'약 90만 광년 (약 28만 pc)'},
    {y:'1929',w:'허블',d:'거리를 잰 가장 먼 은하',v:6.5e6,l:'약 650만 광년 (약 200만 pc)'},
    {y:'현재',w:'관측 가능한 우주',d:'반지름',v:4.65e10,l:'약 465억 광년 (약 143억 pc)',now:true}
  ];
  const lo=-5,hi=11,box=$('#scaleBars');
  rows.forEach(r=>{
    const pct=((Math.log10(r.v)-lo)/(hi-lo)*100);
    const row=document.createElement('div');row.className='bar-row';
    row.innerHTML='<div class="who"><b>'+r.y+'</b>'+r.w+' · <span style="color:var(--muted)">'+r.d+'</span></div>'+
      '<div class="bar-track"><div class="bar-fill'+(r.now?' now':'')+'" style="width:'+pct.toFixed(1)+'%"></div>'+
      '<span class="bar-val mono" style="'+(pct>62?'right:'+(100-pct).toFixed(1)+'%;color:var(--on-accent)':'left:'+pct.toFixed(1)+'%')+'">'+r.l+'</span></div>';
    box.appendChild(row);
  });
  const tk=$('#scaleTicks');
  [[-5,'10⁻⁵'],[0,'1'],[5,'10⁵'],[10,'10¹⁰ 광년']].forEach(([e,l])=>{const s=document.createElement('span');s.style.left=((e-lo)/(hi-lo)*100)+'%';s.textContent=l;if(e===10)s.style.transform='translateX(-70%)';tk.appendChild(s);});
})();

/* ---------- events ---------- */
const EV=[
 {a:1,y:'BC 129경',n:'히파르코스',lf:'BC 190경–BC 120경',en:'Hipparchus',tg:['밝기','우주관'],h:'별을 밝기에 따라 여섯 무리로 나누다',t:'약 850개 별의 위치를 담은 별 목록을 만들었습니다. 가장 밝은 별을 1등급, 맨눈으로 겨우 보이는 별을 6등급으로 나눴다고 전해집니다. 지구 자전축이 천천히 도는 세차 운동도 발견했습니다.',c:'오늘날 쓰는 등급 체계의 출발점입니다.'},
 {a:1,y:'150경',n:'프톨레마이오스',lf:'100경–170경',en:'Ptolemy',tg:['우주관','밝기'],h:'『알마게스트』에 1,022개 별을 정리하다',t:'히파르코스의 등급을 이어받아 1,022개 별의 목록을 남겼습니다. 지구가 우주의 중심에 있고, 별들은 맨 바깥 천구에 붙어 있다는 지구 중심설을 체계적으로 정리했습니다.',c:'이 우주관은 약 1,400년 동안 표준이었습니다.'},
 {a:1,y:'1543',n:'코페르니쿠스',lf:'1473–1543',en:'Nicolaus Copernicus',tg:['우주관','거리'],h:'태양을 중심에 놓다',t:'『천구의 회전에 관하여』에서 지구가 태양 주위를 돈다고 주장했습니다. 그렇다면 지구가 움직일 때 가까운 별의 위치가 조금씩 달라 보여야 합니다(연주 시차). 아무도 이를 볼 수 없었으므로 별은 상상보다 훨씬 멀리 있어야 했습니다.',c:'연주 시차 찾기는 이후 약 300년 동안 천문학의 숙제가 됩니다.'},
 {a:1,y:'1572',n:'튀코 브라헤',lf:'1546–1601',en:'Tycho Brahe',tg:['도구','거리','우주관'],h:'맨눈 관측의 정밀도를 끝까지 끌어올리다',t:'커다란 사분의를 만들어 별의 위치를 각도 약 1′(1/60도) 수준까지 쟀습니다. 1572년 카시오페이아자리에 나타난 새 별(초신성)이 달보다 멀다는 것을 보여, 하늘은 변하지 않는다는 생각을 깼습니다. 연주 시차는 찾지 못해 지구가 멈춰 있다고 결론 내렸습니다.',c:'그의 관측 기록이 케플러 법칙의 바탕이 됩니다.'},
 {a:1,y:'1609',n:'케플러',lf:'1571–1630',en:'Johannes Kepler',tg:['우주관'],h:'행성은 타원을 그리며 돈다',t:'튀코의 화성 관측 자료를 분석해, 행성이 태양을 한 초점으로 하는 타원 궤도를 돈다는 행성 운동 법칙을 발표했습니다(1609, 1619).',c:'태양 중심설이 정확한 예측을 하게 되었습니다.'},

 {a:2,y:'1610',n:'갈릴레이',lf:'1564–1642',en:'Galileo Galilei',tg:['도구','밝기','우주관'],h:'망원경을 하늘로 향하다',t:'1609년 직접 만든 약 20배 굴절 망원경으로 하늘을 보고 이듬해 『별의 전령』을 냈습니다. 은하수가 수많은 별의 모임이고, 6등급보다 어두운 별이 셀 수 없이 많다는 것을 알았습니다. 목성의 위성 4개와 금성의 위상 변화도 발견했습니다.',c:'맨눈의 한계인 6등급을 처음 넘어섰습니다.'},
 {a:2,y:'1668',n:'뉴턴',lf:'1643–1727',en:'Isaac Newton',tg:['도구'],h:'렌즈 대신 거울로 빛을 모으다',t:'오목 거울을 쓰는 반사 망원경을 만들었습니다. 렌즈가 색마다 빛을 다르게 꺾어 생기는 색 번짐(색수차)이 없습니다. 1687년에는 만유인력 법칙을 발표했습니다.',c:'이후 대형 망원경은 대부분 반사 망원경이 됩니다.'},
 {a:2,y:'1774–1781',n:'샤를 메시에',lf:'1730–1817',en:'Charles Messier',tg:['우주관'],h:'혜성이 아닌 뿌연 천체 목록',t:'혜성을 찾던 메시에는 혜성과 헷갈리는 흐릿한 천체를 따로 기록했습니다. 1781년까지 103개를 정리했고 뒤에 추가되어 지금은 M1~M110입니다. 성운·성단 외에 은하가 40개 들어 있지만, 당시에는 모두 성운으로 여겼습니다.',c:'M31(안드로메다)처럼 지금도 메시에 번호로 부릅니다.'},
 {a:2,y:'1781',n:'윌리엄 허셜',lf:'1738–1822',en:'William Herschel',tg:['도구','우주관'],h:'직접 만든 망원경으로 우리은하의 모양을 그리다',t:'음악가였던 허셜은 반사 망원경 거울을 직접 갈아 만들었고 1781년 천왕성을 발견했습니다. 1785년에는 하늘 여러 방향의 별 수를 세어 우리은하가 납작한 원반 모양이라고 주장했습니다. 1789년 구경 1.2m의 "40피트 망원경"을 완성했고, 성운·성단 약 2,500개를 목록으로 남겼습니다.',c:'우리은하를 하나의 구조로 본 첫 시도입니다.'},
 {a:2,y:'1786',n:'캐롤라인 허셜',lf:'1750–1848',en:'Caroline Herschel',tg:['우주관'],h:'혜성 8개와 성운 목록',t:'오빠 윌리엄과 함께 관측하며 혜성 8개를 발견하고 여러 성운을 새로 찾았습니다. 허셜 남매의 성운 목록을 정리해 뒷날 NGC 목록의 바탕을 만들었습니다. 1828년 영국 왕립천문학회 금메달을 받은 첫 여성입니다.',c:'관측 자료를 정리하는 일도 과학의 핵심입니다.'},

 {a:3,y:'1800',n:'윌리엄 허셜',lf:'1738–1822',en:'William Herschel',tg:['온도','도구'],h:'빨간빛 너머의 보이지 않는 빛',t:'프리즘으로 햇빛을 나누고 색마다 온도계를 놓았더니, 빨간색 바깥 아무 색도 없는 곳의 온도가 가장 높았습니다. 눈에 보이지 않는 빛, 적외선의 발견입니다.',c:'적외선 천문학의 출발점입니다.'},
 {a:3,y:'1814',n:'프라운호퍼',lf:'1787–1826',en:'Joseph von Fraunhofer',tg:['온도','도구'],h:'햇빛 무지개 속 검은 선',t:'정밀한 분광기로 태양 스펙트럼에서 570여 개의 검은 선(흡수선)을 찾아 기록했습니다.',c:'별빛을 쪼개 읽는 분광학이 시작되었습니다.'},
 {a:3,y:'1838',n:'프리드리히 베셀',lf:'1784–1846',en:'Friedrich Bessel',tg:['거리'],h:'처음으로 별까지의 거리를 재다',t:'백조자리 61번 별의 연주 시차를 0.314″로 측정해 거리가 약 10광년이라고 발표했습니다(현재 값 0.286″, 약 11.4광년). 같은 시기 헨더슨(센타우루스자리 알파)과 스트루베(베가)도 시차를 측정했습니다.',c:'코페르니쿠스 이후 약 300년 만에 연주 시차가 확인되었습니다.'},
 {a:3,y:'1845',n:'로스 백작',lf:'1800–1867',en:'Lord Rosse',tg:['도구','우주관'],h:'성운 속의 소용돌이',t:'구경 1.8m의 반사 망원경 "리바이어선"을 세워 M51의 나선 구조를 처음 그렸습니다. 이런 천체를 "나선 성운"이라고 부르게 되었습니다.',c:'나선 성운의 정체는 75년 뒤 대논쟁의 주제가 됩니다.'},
 {a:3,y:'1856',n:'노먼 포그슨',lf:'1829–1891',en:'Norman Pogson',tg:['밝기'],h:'5등급 차이를 정확히 100배로',t:'1등급 별이 6등급 별보다 약 100배 밝다는 측정을 바탕으로 5등급 차이를 100배로 정했습니다. 한 등급 차이는 약 2.512배입니다. 이 규칙 덕분에 0등급, 음수 등급, 소수 등급도 쓰게 되었습니다.',c:'히파르코스의 등급이 계산할 수 있는 척도가 되었습니다.'},
 {a:3,y:'1859',n:'키르히호프<span class="life">(1824–1887)</span> · 분젠<span class="life">(1811–1899)</span>',en:'Kirchhoff & Bunsen',tg:['온도'],h:'스펙트럼 선은 원소의 지문',t:'원소마다 정해진 위치에 선을 만든다는 것을 실험으로 밝혔습니다. 태양 흡수선과 비교해 태양에 나트륨, 철 같은 원소가 있음을 알아냈습니다.',c:'가 볼 수 없는 별의 성분을 알 수 있게 되었습니다.'},
 {a:3,y:'1864',n:'윌리엄 허긴스',lf:'1824–1910',en:'William Huggins',tg:['우주관'],h:'어떤 성운은 가스, 어떤 성운은 별 무리처럼',t:'고양이눈 성운(NGC 6543)의 스펙트럼에는 밝은 선 몇 개만 보여, 이 성운이 뜨거운 가스임을 밝혔습니다. 반면 안드로메다 성운은 별처럼 연속 스펙트럼을 보였습니다.',c:'"성운"이 서로 다른 천체를 섞어 부르던 이름이라는 첫 단서입니다.'},
 {a:3,y:'1893',n:'빌헬름 빈',lf:'1864–1928',en:'Wilhelm Wien',tg:['온도'],h:'뜨거울수록 파란빛',t:'물체가 가장 강하게 내는 빛의 파장은 온도에 반비례한다는 빈의 변위 법칙을 찾았습니다. λ최대 = 2.898×10⁻³ m·K ÷ T.',c:'별의 색으로 표면 온도를 알 수 있게 되었습니다.'},
 {a:3,y:'1901',n:'애니 점프 캐넌',lf:'1863–1941',en:'Annie Jump Cannon',tg:['온도'],h:'O · B · A · F · G · K · M',t:'하버드 천문대에서 사진 건판에 찍힌 별의 스펙트럼을 분류해, 표면 온도 순서인 O·B·A·F·G·K·M 분류를 완성했습니다. 평생 약 35만 개의 별을 분류했습니다.',c:'지금도 쓰는 별의 분광형입니다.'},
 {a:3,y:'1912',n:'헨리에타 리비트',lf:'1868–1921',en:'Henrietta Swan Leavitt',tg:['거리','밝기'],h:'밝기가 변하는 주기로 거리를 재다',t:'소마젤란운의 세페이드 변광성을 조사해, 밝기 변화 주기가 길수록 실제로 더 밝다는 주기-광도 관계를 발견했습니다. 주기를 재면 실제 밝기를 알 수 있고, 겉보기 밝기와 비교해 거리를 구합니다.',c:'연주 시차로는 잴 수 없는 먼 거리를 재는 "표준 촛불"이 생겼습니다.'},
 {a:3,y:'1913',n:'헤르츠스프룽<span class="life">(1873–1967)</span> · 러셀<span class="life">(1877–1957)</span>',en:'Hertzsprung & Russell',tg:['밝기','온도'],h:'밝기와 온도를 한 그림에',t:'별의 절대 등급(실제 밝기)과 분광형(표면 온도)을 한 그래프에 나타내자 별들이 몇 무리로 모였습니다. 이것이 H-R도입니다.',c:'별의 일생을 연구하는 기본 도구가 되었습니다.'},

 {a:4,y:'1912–1917',n:'베스토 슬라이퍼',lf:'1875–1969',en:'Vesto Slipher',tg:['우주관'],h:'나선 성운은 빠르게 멀어진다',t:'나선 성운의 스펙트럼선이 빨간색 쪽으로 밀려 있는 적색 편이를 측정했습니다. 대부분 초속 수백 km 이상으로 우리에게서 멀어지고 있었습니다.',c:'허블 법칙의 속도 자료가 됩니다.'},
 {a:4,y:'1917',n:'후커 망원경',en:'Hooker Telescope',tg:['도구'],h:'구경 2.5m, 윌슨산 천문대',t:'당시 세계에서 가장 큰 망원경이었습니다. 허블은 이 망원경으로 안드로메다 성운 속 별 하나하나를 사진에 담았습니다.',c:''},
 {a:4,y:'1918',n:'할로 섀플리',lf:'1885–1972',en:'Harlow Shapley',tg:['거리','우주관'],h:'태양은 은하의 중심이 아니다',t:'구상성단들의 거리를 변광성으로 재어 보니 궁수자리 방향 한쪽에 몰려 있었습니다. 은하의 중심은 그쪽이고 태양은 중심에서 멀리 떨어져 있다고 결론 내렸습니다. 우리은하 지름을 약 30만 광년으로 추정했습니다(현재 약 10만 광년).',c:'지구에 이어 태양도 우주의 중심 자리에서 밀려났습니다.'},
 {a:4,y:'1920',debate:true,n:'천문학 대논쟁',en:'The Great Debate',tg:['우주관','거리'],h:'나선 성운은 우리은하 안에 있을까, 밖에 있을까?',t:'1920년 4월 미국 국립과학원에서 섀플리와 커티스가 우주의 크기를 두고 토론했습니다.'},
 {a:4,y:'1923–1925',n:'에드윈 허블',lf:'1889–1953',en:'Edwin Hubble',tg:['거리','우주관'],h:'안드로메다는 우리은하 밖에 있다',t:'후커 망원경으로 찍은 사진에서 안드로메다 성운 속 세페이드 변광성을 찾았습니다. 리비트의 주기-광도 관계로 계산한 거리는 약 90만 광년으로, 섀플리가 말한 우리은하보다도 멀었습니다(현재 값 약 250만 광년). 1926년에는 은하를 타원·나선·막대나선으로 분류했습니다.',c:'"안드로메다 성운"이 "안드로메다 은하"가 되었습니다.'},
 {a:4,y:'1927',n:'조르주 르메트르',lf:'1894–1966',en:'Georges Lemaître',tg:['우주관'],h:'우주가 팽창한다',t:'일반 상대성 이론을 풀어 우주가 팽창한다는 해를 얻고, 은하가 멀어지는 속도는 거리에 비례할 것이라고 발표했습니다. 1931년에는 우주가 아주 작은 "원시 원자"에서 시작했다는 생각을 내놓았습니다.',c:'대폭발 우주론의 씨앗입니다.'},
 {a:4,y:'1929',n:'에드윈 허블',lf:'1889–1953',en:'Edwin Hubble',tg:['거리','우주관'],h:'멀리 있는 은하일수록 빨리 멀어진다',t:'은하까지의 거리와 후퇴 속도를 그래프로 그리자 정비례 관계가 나타났습니다. v = H₀ × d. 지금은 허블-르메트르 법칙이라고 부릅니다(2018년 국제천문연맹 권고).',c:'우주가 팽창한다는 관측 증거입니다.'},

 {a:5,y:'1932',n:'칼 잰스키',lf:'1905–1950',en:'Karl Jansky',tg:['도구'],h:'은하 중심에서 오는 전파',t:'전화 회사에서 통신 잡음의 원인을 찾다가, 궁수자리 방향인 우리은하 중심에서 전파가 온다는 것을 발견했습니다.',c:'전파 천문학이 시작되었습니다.'},
 {a:5,y:'1937',n:'그로트 리버',lf:'1911–2002',en:'Grote Reber',tg:['도구'],h:'뒷마당의 접시 안테나',t:'집 마당에 지름 약 9.5m의 접시형 전파 망원경을 직접 세우고, 하늘의 전파 지도를 처음 만들었습니다.',c:'오늘날 전파 망원경의 기본 모양입니다.'},
 {a:5,y:'1948',n:'헤일 망원경',en:'Hale Telescope',tg:['도구'],h:'구경 5m, 팔로마산 천문대',t:'1990년대 켁 망원경이 나오기 전까지 대표적인 대형 광학 망원경이었습니다. 퀘이사 같은 아주 먼 천체 연구에 쓰였습니다.',c:''},
 {a:5,y:'1948',n:'가모프<span class="life">(1904–1968)</span> · 앨퍼<span class="life">(1921–2007)</span>',en:'Gamow & Alpher',tg:['우주관','온도'],h:'뜨거운 대폭발과 남은 열',t:'초기 우주가 매우 뜨겁고 빽빽했다면 가벼운 원소가 만들어지고, 그 열의 흔적이 지금 아주 차가운 복사로 남아 있을 것이라고 예측했습니다(앨퍼와 허먼은 약 5K로 예상).',c:'"빅뱅"이라는 이름은 1949년 이 이론에 반대한 프레드 호일이 붙였습니다.'},
 {a:5,y:'1951',n:'21cm 수소선 검출',en:'이웬<span class="life">(1922–2015)</span> · 퍼셀<span class="life">(1912–1997)</span>',tg:['도구','우주관'],h:'먼지를 뚫고 은하의 팔을 그리다',t:'차가운 수소 원자가 내는 파장 21cm의 전파를 처음 검출했습니다. 이 전파는 빛을 가리는 먼지를 통과하므로, 우리은하의 나선팔 지도를 그릴 수 있었습니다.',c:'우리은하가 나선 은하임이 확인되었습니다.'},
 {a:5,y:'1965',n:'펜지어스<span class="life">(1933–2024)</span> · 윌슨<span class="life">(1936–)</span>',en:'Penzias & Wilson',tg:['온도','우주관'],h:'하늘 모든 방향에서 오는 약 3K의 전파',t:'통신용 안테나에서 없어지지 않는 잡음이 하늘 모든 방향에서 똑같이 들어온다는 것을 발견했습니다. 대폭발 이론이 예측한 우주 배경 복사였습니다. 1978년 노벨 물리학상을 받았습니다.',c:'대폭발 우주론이 표준 이론이 되었습니다.'},
 {a:5,y:'1983',n:'IRAS',lf:'1983.1–1983.11',en:'Infrared Astronomical Satellite',tg:['도구','온도'],h:'첫 적외선 우주 망원경',t:'대기 속 수증기가 적외선을 흡수하므로 망원경을 우주로 올렸습니다. 하늘의 96%를 적외선으로 훑어 먼지 속에서 태어나는 별 등 약 35만 개의 천체를 찾았습니다.',c:''},
 {a:5,y:'1989',n:'히파르코스 위성<span class="life">(1989–1993)</span> · COBE<span class="life">(1989–1993)</span>',en:'Hipparcos & COBE',tg:['거리','온도'],h:'옛 천문학자의 이름을 단 위성',t:'유럽우주국의 히파르코스 위성은 약 12만 개 별의 연주 시차를 정밀하게 쟀습니다. 같은 해 발사된 NASA의 COBE는 우주 배경 복사가 약 2.725K의 흑체 복사이며 아주 작은 온도 얼룩이 있다는 것을 밝혔습니다.',c:'히파르코스의 별 목록이 약 2,100년 만에 우주에서 다시 만들어졌습니다.'},
 {a:5,y:'1990',n:'허블 우주 망원경',lf:'1990–',en:'Hubble Space Telescope',tg:['도구'],h:'대기 밖의 2.4m 거울',t:'대기의 흔들림이 없는 우주에서 선명한 상을 얻습니다. 1995년 "허블 딥 필드"는 텅 빈 듯한 하늘 한 조각에 은하 수천 개가 있음을 보여 주었습니다.',c:'허블 상수를 정밀하게 재는 데도 쓰였습니다.'},
 {a:5,y:'1993',n:'켁 망원경',en:'W. M. Keck Observatory',tg:['도구'],h:'조각 거울 36장으로 만든 10m',t:'육각형 거울 36장을 이어 붙여 하나의 10m 거울처럼 쓰는 방식을 처음 실현했습니다. 대기의 흔들림을 실시간으로 보정하는 적응 광학도 씁니다.',c:'초대형 지상 망원경 시대가 열렸습니다.'},
 {a:5,y:'1998',n:'펄머터<span class="life">(1959–)</span> · 슈밋<span class="life">(1967–)</span> · 리스<span class="life">(1969–)</span>',en:'Perlmutter, Schmidt & Riess',tg:['밝기','거리','우주관'],h:'우주의 팽창이 빨라지고 있다',t:'실제 밝기가 거의 일정한 Ia형 초신성을 표준 촛불로 써서 먼 은하의 거리를 쟀습니다. 먼 초신성이 예상보다 어두웠는데, 이는 우주 팽창이 빨라지고 있다는 뜻이었습니다. 원인으로 암흑 에너지가 제안되었고 2011년 노벨 물리학상을 받았습니다.',c:''},
 {a:5,y:'2013',n:'플랑크 위성<span class="life">(2009–2013)</span> · 가이아<span class="life">(2013–2025)</span>',en:'Planck & Gaia',tg:['우주관','거리','온도'],h:'우주의 나이 138억 년',t:'2009년 발사된 플랑크 위성은 우주 배경 복사를 정밀하게 측정했고, 2013년 발표한 결과에서 우주의 나이를 약 138억 년으로 계산했습니다. 같은 해 발사된 가이아는 약 18억 개 별의 위치와 거리를 재어 우리은하의 3차원 지도를 만들었습니다.',c:''},
 {a:5,y:'2019',n:'사건의 지평선 망원경',en:'Event Horizon Telescope',tg:['도구'],h:'지구 크기의 가상 망원경',t:'세계 곳곳의 전파 망원경을 연결해 지구 지름만 한 망원경처럼 썼습니다. M87 은하 중심 블랙홀의 그림자를 처음 촬영했습니다.',c:'메시에가 87번째로 기록한 "성운"의 중심에 블랙홀이 있었습니다.'},
 {a:5,y:'2021',n:'제임스 웹 우주 망원경',lf:'2021–',en:'James Webb Space Telescope',tg:['도구','우주관'],h:'6.5m 적외선의 눈',t:'지구에서 약 150만 km 떨어진 곳에서 적외선으로 관측합니다. 우주 팽창으로 빛이 적외선 쪽으로 늘어난 아주 먼 은하, 대폭발 뒤 수억 년 무렵의 은하를 찾고 있습니다.',c:''},
 {a:5,y:'건설 중',n:'ELT · GMT',en:'Extremely Large Telescope · Giant Magellan Telescope',tg:['도구'],h:'구경 25~39m의 차세대 망원경',t:'유럽의 ELT(39m)와 한국천문연구원이 참여하는 거대 마젤란 망원경 GMT(25.4m)가 칠레에 지어지고 있습니다.',c:''}
];
const DEBATE='<div class="debate"><div><h4>할로 섀플리 <span class="life">(1885–1972)</span></h4><ul><li>나선 성운은 우리은하 안에 있는 천체다.</li><li>우리은하는 지름 약 30만 광년으로 매우 크다.</li><li>나선 성운이 회전하는 모습이 사진에서 보인다는 관측(뒤에 잘못된 측정으로 밝혀짐)을 근거로 들었다.</li></ul></div><div><h4>히버 커티스 <span class="life">(1872–1942)</span></h4><ul><li>나선 성운은 우리은하 밖의 다른 은하, "섬 우주"다.</li><li>우리은하는 지름 약 3만 광년으로 작다.</li><li>나선 성운 속 신성이 매우 어둡게 보이므로 아주 멀리 있다.</li></ul></div><div class="verdict"><b>결과</b> · 우리은하의 크기와 태양의 위치는 섀플리가 더 가까웠고, 나선 성운의 정체는 커티스가 맞았습니다. 결론은 몇 년 뒤 허블의 관측이 냈습니다.</div></div>';
document.querySelectorAll('.events').forEach(ol=>{
  const a=+ol.dataset.act;
  EV.filter(e=>e.a===a).forEach(e=>{
    const li=document.createElement('li');li.className='ev';li.dataset.tags=e.tg.join(' ');
    li.innerHTML='<div class="yr">'+e.y+'</div><div><h3>'+e.n+(e.lf?' <span class="life">('+e.lf+')</span>':'')+'<small>'+e.en+'</small></h3><p class="hl">'+e.h+'</p><p class="tx">'+e.t+'</p>'+(e.debate?DEBATE:'')+(e.c?'<p class="ch">'+e.c+'</p>':'')+'</div>';
    ol.appendChild(li);
  });
});
/* ---------- stages & gates ---------- */
(function(){
  const IDS=['start','act1','act2','act3','act4','act5','quiz'];
  const NEXT=['1막 · 맨눈으로 하늘을 기록하다','2막 · 망원경, 6등급 너머를 보다','3막 · 빛을 쪼개고, 별까지 거리를 재다','4막 · 성운이 은하가 되다','5막 · 보이지 않는 빛으로 본 우주','확인 퀴즈'];
  const G=[
    {q:'히파르코스는 별을 밝기에 따라 몇 개의 등급으로 나눴나요?',o:['3개','5개','6개','10개'],a:2,h:'첫 화면의 별 지도 아래 범례를 보세요.'},
    {q:'−1등급 별은 4등급 별보다 약 몇 배 밝게 보일까요?',o:['5배','약 12배','100배','500배'],a:2,h:'두 별의 등급 차이를 먼저 구하고, 등급 실험실의 표에서 찾아보세요.'},
    {q:'망원경의 구경이 2배가 되면 빛을 모으는 능력(집광력)은 몇 배가 될까요?',o:['2배','4배','8배','변화 없음'],a:1,h:'집광력은 구경의 제곱에 비례합니다.'},
    {q:'연주 시차가 0.25″인 별까지의 거리는 얼마일까요?',o:['0.25 pc','4 pc','25 pc','40 pc'],a:1,h:'거리(pc) = 1 ÷ 연주 시차(″)'},
    {q:'1920년 대논쟁에서 "나선 성운은 우리은하 밖의 다른 은하"라고 주장한 사람은?',o:['할로 섀플리','히버 커티스','샤를 메시에','베스토 슬라이퍼'],a:1,h:'대논쟁 카드의 오른쪽 칸을 다시 읽어 보세요.'},
    {q:'대기에 흡수되어 지상에서는 볼 수 없어 우주 망원경이 필요한 빛은?',o:['전파','가시광선','X선','모두 지상에서 볼 수 있다'],a:2,h:'빛의 창 실험실에서 막대가 "도달 못 함"인 빛을 찾아보세요.'}
  ];
  const KEY='universe-progress-v1';
  let open=0;try{open=Math.min(IDS.length-1,Math.max(0,parseInt(localStorage.getItem(KEY)||'0',10)||0));}catch(e){}
  const save=()=>{try{localStorage.setItem(KEY,String(open));}catch(e){}};
  const stages=IDS.map(id=>document.getElementById(id));
  const links=[...document.querySelectorAll('.nav a')];
  let cur=0;
  function nav(){links.forEach((a,i)=>{const lock=i>open;a.classList.toggle('locked',lock);a.classList.toggle('on',i===cur);a.setAttribute('aria-disabled',lock?'true':'false');a.title=lock?'앞 단계의 확인 질문을 맞히면 열립니다':'';});}
  function show(i){cur=i;stages.forEach((s,j)=>{s.hidden=j!==i;});nav();window.scrollTo(0,0);}
  links.forEach((a,i)=>a.addEventListener('click',ev=>{ev.preventDefault();if(i<=open)show(i);}));
  function buildGate(i){
    const old=stages[i].querySelector('.gate');if(old)old.remove();
    const g=G[i],done=open>i;
    const box=document.createElement('div');box.className='gate';
    box.innerHTML='<p class="eyebrow">다음 단계로 가기 전 확인</p><p class="gq">'+g.q+'</p><div class="opts"></div><p class="gmsg" hidden></p><button class="btn gnext" type="button"'+(done?'':' hidden')+'>다음 단계: '+NEXT[i]+' →</button>';
    const ops=box.querySelector('.opts'),msg=box.querySelector('.gmsg'),nx=box.querySelector('.gnext');
    g.o.forEach((o,j)=>{const b=document.createElement('button');b.type='button';b.className='opt';b.textContent=o;
      if(done){b.disabled=true;if(j===g.a)b.classList.add('right');}
      b.onclick=()=>{
        if(j===g.a){ops.querySelectorAll('.opt').forEach(x=>x.disabled=true);b.classList.add('right');msg.innerHTML='<b>정답입니다.</b> 다음 단계가 열렸습니다.';msg.hidden=false;nx.hidden=false;if(open<i+1){open=i+1;save();nav();}nx.focus();}
        else{b.classList.add('wrong');b.disabled=true;msg.innerHTML='<b>다시 생각해 보세요.</b> 힌트: '+g.h;msg.hidden=false;}
      };ops.appendChild(b);});
    if(done){msg.innerHTML='<b>통과한 단계입니다.</b>';msg.hidden=false;}
    nx.onclick=()=>show(i+1);
    stages[i].appendChild(box);
  }
  G.forEach((g,i)=>buildGate(i));
  $('#resetProgress').onclick=()=>{open=0;save();G.forEach((g,i)=>buildGate(i));show(0);};
  show(0);
})();

/* ---------- LAB 1 magnitude ---------- */
(function(){
  const OBJ=[
    ['태양',-26.74],['보름달',-12.7],['금성 (가장 밝을 때)',-4.6],['시리우스',-1.46],['베가',0.03],
    ['북극성',1.98],['맨눈으로 보이는 한계',6],['명왕성',14.4],['허블 우주 망원경 한계',31]
  ];
  const A=$('#magA'),B=$('#magB'),svg=$('#magRuler');
  OBJ.forEach((o,i)=>{A.add(new Option(o[0]+' ('+mag(o[1])+')',i));B.add(new Option(o[0]+' ('+mag(o[1])+')',i));});
  A.value=3;B.value=5;
  const X=m=>40+(m+30)/63*690;
  function ruler(ia,ib){
    clear(svg);
    S('rect',{x:X(1),y:120,width:X(6)-X(1),height:40,class:'s-acc2',opacity:.18},svg);
    T(svg,(X(1)+X(6))/2,176,'히파르코스의 1~6등급','s-acc2',{'text-anchor':'middle','font-size':'12'});
    S('line',{x1:X(-30),x2:X(33),y1:140,y2:140,class:'s-stroke-muted','stroke-width':1.5},svg);
    for(let m=-30;m<=30;m+=5){S('line',{x1:X(m),x2:X(m),y1:134,y2:146,class:'s-stroke-muted'},svg);T(svg,X(m),200,(m>0?'+':'')+m,'s-muted mono',{'text-anchor':'middle','font-size':'12'});}
    T(svg,X(-30),196-0,'','s-muted');
    T(svg,X(-29),116,'← 더 밝다','s-muted',{'font-size':'12'});
    T(svg,X(32),116,'더 어둡다 →','s-muted',{'text-anchor':'end','font-size':'12'});
    const lv=[0,1,2,3];
    OBJ.forEach((o,i)=>{
      const x=X(o[1]),level=[0,0,1,2,3,0,1,0,0][i];const y=96-level*22;
      const sel=(i==ia||i==ib);
      S('line',{x1:x,x2:x,y1:y+4,y2:140,class:sel?'s-stroke-acc':'s-stroke-muted','stroke-width':sel?2:1,'stroke-dasharray':sel?'':'2 3'},svg);
      S('circle',{cx:x,cy:140,r:sel?6:4,class:sel?'s-acc':'s-ink'},svg);
      T(svg,x,y,o[0].replace(' (가장 밝을 때)',''),sel?'s-acc':'s-ink',{'text-anchor':'middle','font-size':'12','font-weight':sel?'600':'400'});
    });
  }
  function upd(){
    const a=OBJ[A.value],b=OBJ[B.value];
    const d=b[1]-a[1];const r=Math.pow(10,0.4*Math.abs(d));
    $('#magDiff').innerHTML=Math.abs(d).toFixed(2)+' <small>등급</small>';
    $('#magRatio').innerHTML=(d===0?'1':korNum(r))+' <small>배</small>';
    const br=d>0?a:b,dm=d>0?b:a;
    $('#magSentence').innerHTML=d===0?'두 천체의 겉보기 밝기가 같습니다.':'<b>'+br[0]+'</b>은(는) <b>'+dm[0]+'</b>보다 약 <b>'+korNum(r)+'배</b> 밝게 보입니다.';
    const sz=m=>Math.max(6,Math.min(150,70-3.2*m));
    [['#glowA','#glowAn',a],['#glowB','#glowBn',b]].forEach(([g,n,o])=>{const s=sz(o[1]);$(g).style.width=s+'px';$(g).style.height=s+'px';$(n).textContent=o[0];});
    ruler(+A.value,+B.value);
  }
  A.onchange=B.onchange=upd;upd();
})();

/* ---------- LAB 2 telescope ---------- */
(function(){
  const P=[['사람 눈 (동공)',0.007],['갈릴레이 망원경 · 1610',0.037],['허셜 40피트 · 1789',1.26],['로스 리바이어선 · 1845',1.83],['후커 · 1917',2.54],['허블 우주 망원경 · 1990',2.4],['헤일 · 1948',5.08],['제임스 웹 · 2021',6.5],['켁 · 1993',10],['ELT · 건설 중',39]];
  const R=$('#scopeR'),svg=$('#scopeSvg'),box=$('#scopePresets');
  const MIN=0.007,MAX=39;const toD=v=>MIN*Math.pow(MAX/MIN,v/1000),toV=d=>Math.log(d/MIN)/Math.log(MAX/MIN)*1000;
  P.forEach(p=>{const b=document.createElement('button');b.type='button';b.className='chip';b.textContent=p[0].split(' · ')[0];b.onclick=()=>{R.value=toV(p[1]);upd();};box.appendChild(b);});
  function fmtD(d){return d<1?(d*1000).toFixed(0)+' mm':d.toFixed(d<10?2:1)+' m';}
  function upd(){
    const D=toD(+R.value);
    let near=P.reduce((a,b)=>Math.abs(Math.log(b[1]/D))<Math.abs(Math.log(a[1]/D))?b:a);
    const exact=Math.abs(Math.log(near[1]/D))<0.03;
    $('#scopeLbl').textContent=fmtD(D);
    $('#scopeName').textContent=exact?near[0]:'구경 '+fmtD(D)+'인 망원경';
    $('#scopeGain').innerHTML=korNum(Math.pow(D/0.007,2))+' <small>배</small>';
    $('#scopeLim').innerHTML=(6+5*Math.log10(D/0.007)).toFixed(1)+' <small>등급</small>';
    const res=0.138/D;
    $('#scopeRes').innerHTML=(res>=1?res.toFixed(1):res.toFixed(3))+'″';
    box.querySelectorAll('.chip').forEach((b,i)=>b.setAttribute('aria-pressed',exact&&P[i]===near?'true':'false'));
    clear(svg);
    const ground=250,s=210/Math.max(D*1.05,1.9),r=Math.max(D*s/2,0.8);
    S('line',{x1:10,x2:590,y1:ground,y2:ground,class:'s-stroke-muted'},svg);
    const cx=Math.min(250,30+r);
    S('circle',{cx:cx,cy:ground-r,r:r,class:'s-acc2','fill-opacity':.28,stroke:'currentColor'},svg).classList.add('s-stroke-acc2');
    T(svg,cx,ground+20,'구경 '+fmtD(D),'s-ink mono',{'text-anchor':'middle','font-size':'14'});
    const h=1.7*s,px=Math.max(cx+r+50,470);
    const g=S('g',{},svg);
    const hr=h*0.07;
    S('circle',{cx:px,cy:ground-h+hr,r:hr,class:'s-ink'},g);
    S('rect',{x:px-h*0.09,y:ground-h+hr*2.2,width:h*0.18,height:h*0.5,rx:h*0.05,class:'s-ink'},g);
    S('rect',{x:px-h*0.085,y:ground-h*0.4,width:h*0.07,height:h*0.4,class:'s-ink'},g);
    S('rect',{x:px+h*0.015,y:ground-h*0.4,width:h*0.07,height:h*0.4,class:'s-ink'},g);
    T(svg,Math.min(px,560),ground+20,'사람 1.7 m','s-muted',{'text-anchor':'middle','font-size':'13'});
    if(r<4){S('circle',{cx:cx,cy:ground-r,r:10,fill:'none','stroke-dasharray':'2 2',class:'s-stroke-acc'},svg);T(svg,cx+16,ground-16,'← 아주 작아요','s-acc',{'font-size':'13'});}
  }
  R.oninput=upd;upd();
})();

/* ---------- LAB 3 parallax ---------- */
(function(){
  const svg=$('#parSvg'),R=$('#parR');const P=[['프록시마 센타우리',1.30],['시리우스',2.64],['백조자리 61',3.50],['베가',7.68]];
  const box=$('#parPresets');P.forEach(p=>{const b=document.createElement('button');b.type='button';b.className='chip';b.textContent=p[0];b.onclick=()=>{R.value=p[1];draw();};box.appendChild(b);});
  let seed=3;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
  const bg=[];for(let i=0;i<46;i++)bg.push([10+rnd()*580,22+rnd()*40,0.8+rnd()*1.8]);
  let th=Math.PI,playing=!matchMedia('(prefers-reduced-motion: reduce)').matches,last=0;
  const CX=300,CY=320,RX=110,RY=34,BGY=42;
  function starY(d){const q=250/(RX*d);const a=(CY-BGY)*q/(1+q);return BGY+a;}
  function proj(ex,ey,sy){return ex+(CX-ex)*(BGY-ey)/(sy-ey);}
  function draw(){
    const d=+R.value,sy=starY(d);clear(svg);
    S('rect',{x:0,y:16,width:600,height:52,class:'s-surface'},svg);
    T(svg,8,84,'아주 먼 배경 별들','s-muted',{'font-size':'12'});
    bg.forEach(b=>S('circle',{cx:b[0],cy:b[1],r:b[2],class:'s-muted'},svg));
    S('ellipse',{cx:CX,cy:CY,rx:RX,ry:RY,fill:'none',class:'s-stroke-muted','stroke-dasharray':'3 4'},svg);
    S('circle',{cx:CX,cy:CY,r:13,class:'s-acc'},svg);T(svg,CX,CY+34,'태양','s-muted',{'text-anchor':'middle','font-size':'12'});
    // extremes
    const xl=proj(CX-RX,CY,sy),xr=proj(CX+RX,CY,sy);
    [[CX-RX,xl],[CX+RX,xr]].forEach(([ex,px])=>{S('line',{x1:ex,y1:CY,x2:px,y2:BGY,class:'s-stroke-muted','stroke-width':1,'stroke-dasharray':'1 4'},svg);S('circle',{cx:px,cy:BGY,r:5,fill:'none',class:'s-stroke-acc','stroke-width':1.5},svg);});
    // triangle sun-earth-star
    S('line',{x1:CX,y1:CY,x2:CX,y2:sy,class:'s-stroke-acc2','stroke-width':1.5},svg);
    S('line',{x1:CX+RX,y1:CY,x2:CX,y2:sy,class:'s-stroke-acc2','stroke-width':1.5},svg);
    S('line',{x1:CX,y1:CY,x2:CX+RX,y2:CY,class:'s-stroke-acc2','stroke-width':1.5},svg);
    T(svg,CX+RX/2,CY-6,'1 AU','s-acc2 mono',{'text-anchor':'middle','font-size':'12'});
    T(svg,CX+9,sy+28,'p','s-acc2',{'font-size':'15','font-style':'italic','font-weight':'600'});
    // earth
    const ex=CX+RX*Math.cos(th),ey=CY+RY*Math.sin(th),px=proj(ex,ey,sy);
    S('line',{x1:ex,y1:ey,x2:px,y2:BGY,class:'s-stroke-ink','stroke-width':1.2,'stroke-dasharray':'5 4'},svg);
    S('circle',{cx:px,cy:BGY,r:5,class:'s-acc'},svg);
    S('circle',{cx:CX,cy:sy,r:6,class:'s-ink'},svg);T(svg,CX-12,sy+4,'가까운 별','s-ink',{'text-anchor':'end','font-size':'13'});
    S('circle',{cx:ex,cy:ey,r:8,class:'s-acc2'},svg);T(svg,ex,ey+(Math.sin(th)>0?24:-14),'지구','s-ink',{'text-anchor':'middle','font-size':'12'});
    T(svg,(xl+xr)/2,100,'6개월 동안 보이는 위치 변화','s-acc',{'text-anchor':'middle','font-size':'12'});
    S('line',{x1:Math.max(xl,6),x2:Math.min(xr,594),y1:90,y2:90,class:'s-stroke-acc','stroke-width':1},svg);
    const p=1/d,month=Math.round(((th%(2*Math.PI)+2*Math.PI)%(2*Math.PI))/(2*Math.PI)*12)%12+1;
    $('#parLbl').textContent=d.toFixed(2)+' pc';
    $('#parMonth').innerHTML=month+'월 <small>무렵 (그림 기준)</small>';
    $('#parP').innerHTML=p.toFixed(3)+'″ <small>(초)</small>';
    $('#parD').innerHTML=d.toFixed(2)+' pc <small>= '+(d*3.26).toFixed(1)+' 광년</small>';
    $('#parMoon').innerHTML='시차 '+p.toFixed(3)+'″는 보름달 지름(약 1,860″)의 약 <b>1/'+Math.round(1860/p).toLocaleString('ko-KR')+'</b>입니다. 베셀이 1838년에 잰 각도가 이만큼 작았습니다.';
    box.querySelectorAll('.chip').forEach((b,i)=>b.setAttribute('aria-pressed',Math.abs(P[i][1]-d)<0.01?'true':'false'));
  }
  function loop(t){if(playing){if(last)th+=Math.min(t-last,50)*0.0009;last=t;draw();}else last=0;requestAnimationFrame(loop);}
  R.oninput=draw;
  const pb=$('#parPlay');function lbl(){pb.textContent=playing?'지구 공전 멈추기':'지구 공전 시작';}
  pb.onclick=()=>{playing=!playing;lbl();};lbl();draw();requestAnimationFrame(loop);

  // absolute magnitude
  const AP=[['시리우스',-1.46,2.64],['태양',-26.74,4.848e-6],['베가',0.03,7.68],['북극성',1.98,133],['직접 입력',null,null]];
  const sel=$('#absPreset'),M=$('#absM'),Dr=$('#absD');
  AP.forEach((a,i)=>sel.add(new Option(a[0],i)));
  sel.onchange=()=>{const a=AP[sel.value];if(a[1]!==null){M.value=a[1];Dr.value=Math.log10(a[2]);}absUpd();};
  M.oninput=Dr.oninput=()=>{sel.value=AP.length-1;absUpd();};
  function fmtDist(d){if(d<0.001){return (d*206265).toFixed(2)+' AU';}return (d<10?d.toFixed(2):Math.round(d).toLocaleString('ko-KR'))+' pc ('+(d*3.26<10?(d*3.26).toFixed(1):Math.round(d*3.26).toLocaleString('ko-KR'))+' 광년)';}
  function absUpd(){
    const m=+M.value,d=Math.pow(10,+Dr.value),Mv=m-5*Math.log10(d/10);
    $('#absMl').textContent=mag(m);$('#absDl').textContent=fmtDist(d);
    $('#absOut').innerHTML=mag(Math.round(Mv*100)/100)+' <small>등급</small>';
    const r=Math.pow(10,0.4*(4.83-Mv));
    const name=AP[sel.value][1]!==null?AP[sel.value][0]:'이 별';
    let s=name+'을(를) 10 pc에 놓으면 '+mag(Math.round(Mv*10)/10)+'등급으로 보입니다. ';
    s+=Math.abs(Mv-4.83)<0.05?'태양의 절대 등급(+4.83)과 같습니다.':(r>1?'실제 밝기는 태양의 약 <b>'+korNum(r)+'배</b>입니다.':'실제 밝기는 태양의 약 <b>'+(1/r<10?(1/r).toFixed(1):korNum(1/r))+'분의 1</b>입니다.');
    if(Mv>6)s+=' 맨눈으로는 보이지 않을 만큼 어둡습니다.';
    $('#absSentence').innerHTML=s;
  }
  absUpd();
})();

/* ---------- LAB 4 temperature ---------- */
(function(){
  const svg=$('#tempSvg'),R=$('#tempR');const TMIN=2400,TMAX=40000;
  const toT=v=>TMIN*Math.pow(TMAX/TMIN,v/1000),toV=t=>Math.log(t/TMIN)/Math.log(TMAX/TMIN)*1000;
  const CL=[['O',30000,'나오스(고물자리 제타)',40000],['B',10000,'리겔',12100],['A',7500,'시리우스',9900],['F',6000,'프로키온',6500],['G',5200,'태양',5800],['K',3700,'아르크투르스',4300],['M',0,'베텔게우스',3600]];
  const box=$('#tempPresets');
  CL.slice().reverse().forEach(c=>{const b=document.createElement('button');b.type='button';b.className='chip';b.textContent=c[0]+'형 · '+c[2].split('(')[0];b.onclick=()=>{R.value=toV(c[3]);upd();};box.appendChild(b);});
  function rgb(K){const t=K/100;let r,g,b;
    if(t<=66){r=255;g=99.4708025861*Math.log(t)-161.1195681661;}else{r=329.698727446*Math.pow(t-60,-0.1332047592);g=288.1221695283*Math.pow(t-60,-0.0755148492);}
    if(t>=66)b=255;else if(t<=19)b=0;else b=138.5177312231*Math.log(t-10)-305.0447927307;
    const c=v=>Math.round(Math.max(0,Math.min(255,v)));return 'rgb('+c(r)+','+c(g)+','+c(b)+')';}
  const L0=Math.log10(60),L1=Math.log10(3000),x0=40,x1=580,yb=200,yt=20;
  const X=l=>x0+(Math.log10(l)-L0)/(L1-L0)*(x1-x0);
  function colorName(T){return T<3700?'붉은색':T<5200?'주황색':T<6000?'노란색':T<7500?'노란빛 흰색':T<10000?'흰색':T<30000?'청백색':'푸른색';}
  function upd(){
    const K=toT(+R.value);clear(svg);
    const defs=S('defs',{},svg);const lg=S('linearGradient',{id:'vis',gradientUnits:'userSpaceOnUse',x1:X(380),x2:X(750),y1:0,y2:0},defs);
    [[380,'#7a2bd6'],[440,'#2b4ce0'],[490,'#16b0d8'],[530,'#2fbf3a'],[575,'#e8d72a'],[600,'#f29a1c'],[650,'#e3301c'],[750,'#8c1208']].forEach(([w,c])=>S('stop',{offset:((X(w)-X(380))/(X(750)-X(380))).toFixed(3),'stop-color':c},lg));
    S('rect',{x:X(380),y:yb+6,width:X(750)-X(380),height:14,fill:'url(#vis)'},svg);
    T(svg,(X(60)+X(380))/2,yb+40,'자외선','s-muted',{'text-anchor':'middle','font-size':'12'});
    T(svg,(X(380)+X(750))/2,yb+40,'가시광선','s-muted',{'text-anchor':'middle','font-size':'12'});
    T(svg,(X(750)+X(3000))/2,yb+40,'적외선','s-muted',{'text-anchor':'middle','font-size':'12'});
    S('line',{x1:x0,x2:x1,y1:yb,y2:yb,class:'s-stroke-muted'},svg);
    [100,300,1000,3000].forEach(w=>{S('line',{x1:X(w),x2:X(w),y1:yb,y2:yb+4,class:'s-stroke-muted'},svg);T(svg,X(w),yb-6,w+' nm','s-muted mono',{'text-anchor':w===3000?'end':'middle','font-size':'11'});});
    const pts=[];let mx=0;for(let i=0;i<=180;i++){const l=Math.pow(10,L0+(L1-L0)*i/180);const B=Math.pow(l,-5)/(Math.exp(1.438777e7/(l*K))-1);pts.push([l,B]);if(B>mx)mx=B;}
    let d='M'+x0+' '+yb;pts.forEach(([l,B])=>{d+=' L'+X(l).toFixed(1)+' '+(yb-(B/mx)*(yb-yt)).toFixed(1);});d+=' L'+x1+' '+yb+' Z';
    const col=rgb(K);
    S('path',{d:d,fill:col,'fill-opacity':.35,stroke:col,'stroke-width':2},svg);
    const pk=2.898e6/K;const px=X(Math.max(60,Math.min(3000,pk)));
    S('line',{x1:px,x2:px,y1:yt-4,y2:yb,class:'s-stroke-ink','stroke-dasharray':'4 3'},svg);
    T(svg,px+(px>480?-6:6),yt+6,'λ최대 '+Math.round(pk)+' nm','s-ink mono',{'text-anchor':px>480?'end':'start','font-size':'12'});
    $('#tempLbl').textContent=Math.round(K).toLocaleString('ko-KR')+' K';
    $('#tempSwatch').style.background=col;$('#tempSwatch').style.boxShadow='0 0 28px 6px '+col;
    $('#tempColor').textContent=colorName(K);
    const c=CL.find(c=>K>=c[1]);
    $('#tempClass').innerHTML=c[0]+'형 <small>· '+c[2]+' (약 '+c[3].toLocaleString('ko-KR')+' K)</small>';
    $('#tempPeak').innerHTML=Math.round(pk).toLocaleString('ko-KR')+' nm <small>'+(pk<380?'자외선':pk<=750?'가시광선':'적외선')+'</small>';
    const pw=Math.pow(K/5778,4);$('#tempPow').innerHTML=(pw<10?pw.toFixed(2):korNum(pw))+' <small>배</small>';
    box.querySelectorAll('.chip').forEach((b,i)=>{const cc=CL.slice().reverse()[i];b.setAttribute('aria-pressed',Math.abs(cc[3]-K)/cc[3]<0.02?'true':'false');});
  }
  R.oninput=upd;upd();
})();

/* ---------- LAB 5 Hubble ---------- */
(function(){
  const svg=$('#hubSvg'),R=$('#hubR');
  const D=[12,22,35,47,58,71,84,97,112,126,141,158,172],E=[.08,-.06,.05,-.09,.03,.07,-.04,.02,-.07,.05,-.03,.04,-.05];
  const pts=D.map((d,i)=>[d,70*d*(1+E[i])]);
  const best=pts.reduce((s,p)=>s+p[0]*p[1],0)/pts.reduce((s,p)=>s+p[0]*p[0],0);
  const x0=64,x1=580,y0=330,y1=20,XM=180,YM=14000,X=d=>x0+d/XM*(x1-x0),Y=v=>y0-v/YM*(y0-y1);
  function upd(){
    const H=+R.value;clear(svg);
    for(let v=0;v<=YM;v+=2000){S('line',{x1:x0,x2:x1,y1:Y(v),y2:Y(v),class:'s-stroke-muted','stroke-opacity':v?0.25:1},svg);T(svg,x0-8,Y(v)+4,v.toLocaleString('ko-KR'),'s-muted mono',{'text-anchor':'end','font-size':'11'});}
    for(let d=0;d<=XM;d+=40){S('line',{x1:X(d),x2:X(d),y1:y0,y2:y0+5,class:'s-stroke-muted'},svg);T(svg,X(d),y0+20,d,'s-muted mono',{'text-anchor':'middle','font-size':'11'});}
    T(svg,(x0+x1)/2,y0+40,'은하까지의 거리 (Mpc)','s-muted',{'text-anchor':'middle','font-size':'13'});
    T(svg,14,(y0+y1)/2,'후퇴 속도 (km/s)','s-muted',{'text-anchor':'middle','font-size':'13',transform:'rotate(-90 14 '+(y0+y1)/2+')'});
    const xe=Math.min(XM,YM/H);
    S('line',{x1:X(0),y1:Y(0),x2:X(xe),y2:Y(H*xe),class:'s-stroke-acc','stroke-width':2.5},svg);
    pts.forEach(p=>{const pv=H*p[0];S('line',{x1:X(p[0]),x2:X(p[0]),y1:Y(p[1]),y2:Y(Math.min(pv,YM)),class:'s-stroke-acc','stroke-opacity':.35,'stroke-width':1},svg);S('circle',{cx:X(p[0]),cy:Y(p[1]),r:5.5,class:'s-acc2'},svg);});
    T(svg,X(xe)-6,Y(H*xe)+(xe<XM?16:-8),'v = '+H+' × d','s-acc mono',{'text-anchor':'end','font-size':'13'});
    const mean=pts.reduce((s,p)=>s+p[1],0)/pts.length;
    const rms=Math.sqrt(pts.reduce((s,p)=>s+Math.pow(p[1]-H*p[0],2),0)/pts.length);
    const pct=rms/mean*100;
    $('#hubLbl').textContent=H;$('#hubH').innerHTML=H+' <small>km/s/Mpc</small>';
    $('#hubErr').innerHTML=pct.toFixed(0)+'% <small>'+(pct<8?'잘 맞음':pct<25?'조금 어긋남':'많이 어긋남')+'</small>';
    const age=977.8/H;$('#hubAge').innerHTML=(age*10).toFixed(age<10?1:0)+'억 <small>년</small>';
    let msg;
    if(H>=450)msg='허블이 1929년에 얻은 값은 약 500이었습니다. 그러면 우주 나이가 약 20억 년이 되어, 지구 나이(약 46억 년)보다 젊다는 모순이 생깁니다. 1952년 바데가 세페이드 변광성의 종류를 바로잡자 은하까지의 거리가 크게 늘었고 H₀ 값은 작아졌습니다.';
    else if(pct<8)msg='오늘날 측정값은 약 67~73 km/s/Mpc입니다. 1 ÷ H₀로 어림한 우주 나이는 플랑크 위성이 계산한 약 138억 년과 비슷합니다.';
    else msg='직선이 점들을 고르게 지나도록 기울기를 바꿔 보세요. 멀리 있는 은하일수록 빨리 멀어진다는 것이 보이나요?';
    $('#hubMsg').textContent=msg;
  }
  R.oninput=upd;$('#hubFit').onclick=()=>{R.value=Math.round(best);upd();};$('#hub1929').onclick=()=>{R.value=500;upd();};upd();
})();

/* ---------- LAB 6 EM window ---------- */
(function(){
  const B=[
    {n:'감마선',w:'0.01 nm 이하',tr:0,place:'우주',see:'감마선 폭발, 블랙홀과 중성자별 주변의 격렬한 현상',tool:'페르미 감마선 우주 망원경(2008–)',why:'대기에 모두 흡수됩니다.'},
    {n:'X선',w:'0.01~10 nm',tr:0,place:'우주',see:'수백만 K의 뜨거운 가스, 초신성 잔해, 블랙홀로 빨려드는 물질',tool:'찬드라 X선 관측선(1999–)',why:'대기에 모두 흡수됩니다.'},
    {n:'자외선',w:'10~380 nm',tr:.06,place:'우주',see:'뜨겁고 젊은 O·B형 별, 별이 태어나는 지역',tool:'GALEX(2003–2013), 허블 우주 망원경 일부 장비',why:'오존층이 대부분 흡수합니다.'},
    {n:'가시광선',w:'380~750 nm',tr:.9,place:'지상 · 우주',see:'별, 성운, 은하. 사람 눈이 보는 빛',tool:'갈릴레이 망원경부터 켁(10m), 허블 우주 망원경까지',why:'대기를 잘 통과합니다. 다만 대기가 흔들려 상이 번집니다.'},
    {n:'적외선',w:'750 nm~1 mm',tr:.32,place:'높은 산 · 우주',see:'먼지 속에서 태어나는 별, 차가운 천체, 빛이 적외선으로 늘어난 아주 먼 은하',tool:'허셜의 발견(1800), IRAS(1983.1–1983.11), 스피처(2003–2020), 제임스 웹(2021–)',why:'대기 속 수증기가 많이 흡수해 일부 파장만 통과합니다.'},
    {n:'전파',w:'1 mm 이상',tr:.88,place:'지상',see:'차가운 수소 가스(21cm), 우주 배경 복사, 펄서, 블랙홀 제트',tool:'잰스키(1932), 리버(1937), FAST(500m), 사건의 지평선 망원경(2019)',why:'대기를 잘 통과하고 낮에도, 흐린 날에도 관측할 수 있습니다.'}
  ];
  const svg=$('#emSvg'),btns=$('#bandBtns'),info=$('#bandInfo');let cur=4;
  B.forEach((b,i)=>{const e=document.createElement('button');e.type='button';e.className='chip';e.textContent=b.n;e.onclick=()=>{cur=i;upd();};btns.appendChild(e);});
  function upd(){
    clear(svg);const w=96,gap=4,top=30,bot=170;
    T(svg,8,18,'파장이 짧다 ←','s-muted',{'font-size':'12'});T(svg,592,18,'→ 파장이 길다','s-muted',{'text-anchor':'end','font-size':'12'});
    B.forEach((b,i)=>{const x=6+i*(w+gap);const h=(bot-top)*b.tr;const on=i===cur;
      S('rect',{x:x,y:top,width:w,height:bot-top,class:'s-surface',stroke:'currentColor','stroke-width':on?2:1},svg).classList.add(on?'s-stroke-acc':'s-line');
      if(h>0)S('rect',{x:x+1,y:bot-h,width:w-2,height:h,class:on?'s-acc':'s-acc2','fill-opacity':on?.85:.55},svg);
      else T(svg,x+w/2,bot-8,'도달 못 함','s-muted',{'text-anchor':'middle','font-size':'11'});
      T(svg,x+w/2,bot+20,b.n,on?'s-acc':'s-ink',{'text-anchor':'middle','font-size':'14','font-weight':on?'600':'400'});
      T(svg,x+w/2,bot+38,b.place,'s-muted',{'text-anchor':'middle','font-size':'11'});
    });
    btns.querySelectorAll('.chip').forEach((e,i)=>e.setAttribute('aria-pressed',i===cur?'true':'false'));
    const b=B[cur];
    info.innerHTML='<h4>'+b.n+' <span class="mono note" style="font-size:13px">'+b.w+'</span></h4><dl><dt>대기</dt><dd>'+b.why+'</dd><dt>망원경 위치</dt><dd><b>'+b.place+'</b></dd><dt>무엇이 보이나</dt><dd>'+b.see+'</dd><dt>대표 관측</dt><dd>'+b.tool+'</dd></dl>';
  }
  upd();
})();

/* ---------- Quiz ---------- */
(function(){
  const Q=[
    {q:'히파르코스는 맨눈으로 겨우 보이는 가장 어두운 별을 몇 등급으로 정했나요?',o:['1등급','3등급','6등급','10등급'],a:2,e:'가장 밝은 별을 1등급, 가장 어두운 별을 6등급으로 나눴습니다. 숫자가 클수록 어둡습니다.'},
    {q:'1등급 별은 6등급 별보다 약 몇 배 밝을까요?',o:['5배','약 2.5배','100배','600배'],a:2,e:'포그슨의 규칙: 5등급 차이 = 100배. 한 등급 차이는 약 2.512배입니다.'},
    {q:'처음으로 별의 연주 시차를 측정해 별까지의 거리를 잰 사람은?',o:['갈릴레이','베셀','허셜','메시에'],a:1,e:'1838년 베셀이 백조자리 61번 별의 연주 시차를 측정했습니다.'},
    {q:'연주 시차가 0.5″인 별까지의 거리는?',o:['0.5 파섹','2 파섹','5 파섹','50 파섹'],a:1,e:'거리(pc) = 1 ÷ 연주 시차(″) = 1 ÷ 0.5 = 2 pc, 약 6.5 광년입니다.'},
    {q:'표면 온도가 가장 높은 별은 어떤 색으로 보일까요?',o:['붉은색','노란색','주황색','청백색'],a:3,e:'빈의 변위 법칙에 따라 온도가 높을수록 가장 강한 빛의 파장이 짧아져 푸르게 보입니다. O·B형 별이 청백색입니다.'},
    {q:'허블이 "안드로메다 성운"이 우리은하 밖에 있다는 것을 밝힌 방법은?',o:['연주 시차 측정','세페이드 변광성으로 거리 측정','성운의 색 비교','전파 관측'],a:1,e:'리비트가 찾은 주기-광도 관계를 이용해 세페이드 변광성까지의 거리를 계산했습니다.'},
    {q:'먼지에 가려진 갓 태어난 별을 관측하기에 가장 알맞은 것은?',o:['적외선 망원경','X선 망원경','자외선 망원경','맨눈'],a:0,e:'적외선은 파장이 길어 먼지를 잘 통과합니다. 제임스 웹 우주 망원경이 대표적입니다.'},
    {q:'멀리 있는 은하일수록 더 빨리 멀어진다는 관측 결과가 뜻하는 것은?',o:['우리은하가 우주의 중심이다','우주가 팽창하고 있다','은하들이 회전한다','별이 식어 간다'],a:1,e:'허블-르메트르 법칙(v = H₀ × d)은 우주 팽창의 증거입니다. 어느 은하에서 보아도 같은 모습이므로 우리은하가 중심이라는 뜻은 아닙니다.'}
  ];
  const box=$('#quizBox');let score=0;
  function render(){
    box.innerHTML='';score=0;$('#quizScore').textContent='0 / '+Q.length;
    Q.forEach((q,i)=>{
      const d=document.createElement('div');d.className='qz';
      d.innerHTML='<p class="qt">'+(i+1)+'. '+q.q+'</p><div class="opts"></div><p class="exp" hidden></p>';
      const ops=d.querySelector('.opts'),exp=d.querySelector('.exp');
      q.o.forEach((o,j)=>{const b=document.createElement('button');b.type='button';b.className='opt';b.textContent=o;
        b.onclick=()=>{ops.querySelectorAll('.opt').forEach((x,k)=>{x.disabled=true;if(k===q.a)x.classList.add('right');});
          if(j===q.a){score++;exp.innerHTML='<b>정답입니다.</b> '+q.e;}else{b.classList.add('wrong');exp.innerHTML='<b>정답은 "'+q.o[q.a]+'"입니다.</b> '+q.e;}
          exp.hidden=false;$('#quizScore').textContent=score+' / '+Q.length;};
        ops.appendChild(b);});
      box.appendChild(d);
    });
  }
  $('#quizReset').onclick=render;render();
})();
})();
