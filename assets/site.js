
(()=>{
'use strict';

const folder='https://drive.google.com/drive/u/0/folders/1qil5g_WY9h1rTQLF33h1i-ivef0ojkyH';
const $=s=>document.querySelector(s);
let projects=[],filter='all';

$('#year').textContent=new Date().getFullYear();

const safeUrl=s=>{
  try{
    const u=new URL(s);
    return ['https:','http:'].includes(u.protocol)?u.href:null;
  }catch{return null}
};

function videoInfo(link){
  let u;
  try{u=new URL(link)}catch{return null}

  if(!['https:','http:'].includes(u.protocol))return null;
  const host=u.hostname.replace(/^www\./,'').toLowerCase();

  if(host==='youtu.be'||host==='youtube.com'||host==='m.youtube.com'||host==='youtube-nocookie.com'){
    const id=host==='youtu.be'
      ?u.pathname.slice(1)
      :u.searchParams.get('v')||u.pathname.split('/embed/')[1]||u.pathname.split('/shorts/')[1];

    return /^[\w-]{11}$/.test(id||'')
      ?{
        type:'iframe',
        src:'https://www.youtube-nocookie.com/embed/'+id,
        thumb:'https://img.youtube.com/vi/'+id+'/hqdefault.jpg'
      }
      :null;
  }

  if(host==='vimeo.com'||host==='player.vimeo.com'){
    const id=u.pathname.match(/\d+/)?.[0];
    return id?{type:'iframe',src:'https://player.vimeo.com/video/'+id}:null;
  }

  if(host==='drive.google.com'){
    const id=u.pathname.match(/\/file\/d\/([\w-]+)/)?.[1]||u.searchParams.get('id');
    return id?{type:'iframe',src:'https://drive.google.com/file/d/'+id+'/preview'}:null;
  }

  // Supports direct HTTPS MP4 videos, including Cloudinary.
  if(u.protocol==='https:'&&/\.mp4$/i.test(u.pathname)){
    return {type:'video',src:u.href};
  }

  return null;
}

function openVideo(url,title){
  const v=videoInfo(url);

  if(!v){
    alert('Unsupported video link. Use YouTube, Vimeo, Google Drive FILE, or a direct HTTPS MP4 URL.');
    return;
  }

  $('#modalTitle').textContent=title;

  let player;

  if(v.type==='video'){
    player=document.createElement('video');
    player.src=v.src;
    player.controls=true;
    player.autoplay=true;
    player.playsInline=true;
    player.controlsList='nodownload';
    player.disablePictureInPicture=true;
    player.addEventListener('contextmenu', e => e.preventDefault());
    player.preload='metadata';
    player.style.width='100%';
    player.style.height='100%';
    player.style.maxHeight='70vh';
    player.style.background='#000';
    player.style.objectFit='contain';
    player.setAttribute('aria-label',title);
  }else{
    player=document.createElement('iframe');
    player.style.width='100%';
    player.style.height='100%';
    player.style.border='0';
    player.style.display='block';
    player.src=v.src;
    player.title=title;
    player.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    player.allowFullscreen=true;
    player.referrerPolicy='strict-origin-when-cross-origin';
  }

  $('#player').replaceChildren(player);
  $('#modal').classList.add('open');
}

function closeVideo(){
  $('#modal').classList.remove('open');
  const video=$('#player video');
  if(video)video.pause();
  $('#player').replaceChildren();
}

$('#close').onclick=closeVideo;

$('#modal').addEventListener('click',e=>{
  if(e.target.id==='modal')closeVideo();
});

document.addEventListener('keydown',e=>{
  if(e.key==='Escape')closeVideo();
});

function render(){
  const g=$('#gallery');
  g.replaceChildren();

  const items=projects.filter(p=>filter==='all'||p.category===filter);

  if(!items.length){
    const n=document.createElement('div');
    n.className='gallery-empty';
    n.textContent=projects.length
      ?'No videos in this category yet.'
      :'Videos coming soon. Browse my current collection using the Google Drive link below.';
    g.append(n);
    return;
  }

  items.forEach(p=>{
    const card=document.createElement('article');
    card.className='project';

    const thumb=document.createElement('div');
    thumb.className='thumb';

    const video=videoInfo(p.url||'');
    const img=safeUrl(p.thumbnail||'')||video?.thumb;

    if(img){
      thumb.style.backgroundImage=`url("${img.replaceAll('"','%22')}")`;
    }

    const play=document.createElement('span');
    play.className='play';
    play.textContent='▶';
    thumb.append(play);

    const body=document.createElement('div');
    body.className='project-body';

    const tag=document.createElement('div');
    tag.className='tag';
    tag.textContent=({
      ai:'AI VIDEO',
      commercial:'COMMERCIAL',
      youtube:'YOUTUBE',
      reels:'REELS & SHORTS',
      motion:'MOTION GRAPHICS',
      wedding:'WEDDING & EVENT VIDEOS'
    })[p.category]||'VIDEO EDITING';

    const title=document.createElement('strong');
    title.textContent=p.title||'Untitled project';

    const desc=document.createElement('p');
    desc.textContent=p.description||'';

    body.append(tag,title,desc);
    card.append(thumb,body);

    card.tabIndex=0;
    card.setAttribute('role','button');

    card.addEventListener('click',()=>{
      openVideo(p.url||folder,p.title||'Project');
    });

    card.addEventListener('keydown',e=>{
      if(e.key==='Enter')card.click();
    });

    g.append(card);
  });
}

document.querySelectorAll('[data-filter]').forEach(b=>{
  b.addEventListener('click',()=>{
    filter=b.dataset.filter;

    document.querySelectorAll('[data-filter]').forEach(x=>{
      x.classList.toggle('active',x===b);
    });

    render();
  });
});

fetch('./content/portfolio.json',{cache:'no-store'})
.then(r=>{
  if(!r.ok)throw Error('Missing portfolio content');
  return r.json();
})
.then(data=>{
  projects=Array.isArray(data.projects)?data.projects:[];

  const show=safeUrl(data.showreel_url||'');

  if(show){
    const a=$('#showreelLink');
    a.href=show;
    a.removeAttribute('target');

    a.querySelector('strong').textContent='WATCH MY SHOWREEL';
    a.querySelector('small').textContent='Play showreel ▶';

    a.addEventListener('click',e=>{
      e.preventDefault();
      openVideo(show,'Mohamed Abdullah Showreel');
    });
  }

  if(data.email&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)){
    $('#emailLink').href='mailto:'+encodeURIComponent(data.email)+'?subject=Video%20Editing%20Project%20Inquiry';
    $('#contactNote').textContent=data.email;
  }else{
    $('#emailLink').style.display='none';
  }

  render();
})
.catch(e=>{
  console.warn(e);
  render();
});

})();
