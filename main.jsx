import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {
  ArrowDownRight, ArrowUpRight, Menu, X, MapPin, MoveUpRight,
  Sprout, Users, House, Leaf, ShoppingBag, CalendarDays, Mail,
  Instagram, Facebook, ChevronRight
} from 'lucide-react'
import './styles.css'

const community = {
  name: 'บ้านทุ่งอรุณ',
  province: 'จังหวัดตัวอย่าง · ประเทศไทย',
  residents: '1,240',
  households: '385',
  groups: '08',
  places: '06'
}

const products = [
  { name: 'ผ้าทอมือสีธรรมชาติ', en: 'Naturally Dyed Textile', price: '฿450', category: 'งานหัตถกรรม', image: 'photo-1528459801416-a9e53bbf4e17' },
  { name: 'ข้าวอินทรีย์ฤดูกาลใหม่', en: 'Seasonal Organic Rice', price: '฿85', category: 'เกษตรอินทรีย์', image: 'photo-1586201375761-83865001e31c' },
  { name: 'น้ำผึ้งดอกไม้ป่า', en: 'Wildflower Honey', price: '฿160', category: 'อาหารท้องถิ่น', image: 'photo-1587049352851-8d4e89133924' },
]

const projects = [
  { no: '01', title: 'ตลาดชุมชนมีชีวิต', en: 'A Market for Everyone', budget: '฿120,000', progress: 65, text: 'ปรับปรุงพื้นที่ค้าขายให้เป็นศูนย์กลางเศรษฐกิจและพื้นที่พบปะของคนในชุมชน' },
  { no: '02', title: 'จัดการขยะอย่างเข้าใจ', en: 'Circular Community', budget: '฿45,000', progress: 40, text: 'ส่งเสริมการคัดแยก ลดขยะ และนำทรัพยากรกลับมาใช้ประโยชน์' },
  { no: '03', title: 'พื้นที่เรียนรู้ร่วมกัน', en: 'Shared Learning Space', budget: '฿80,000', progress: 85, text: 'สร้างพื้นที่แลกเปลี่ยนทักษะ ภูมิปัญญา และกิจกรรมสำหรับทุกวัย' },
]

function VillageScene({ activePlace, onSelect }) {
  const mountRef = useRef(null)
  const selectRef = useRef(onSelect)
  const activeRef = useRef(activePlace)
  useEffect(() => { selectRef.current = onSelect }, [onSelect])
  useEffect(() => { activeRef.current = activePlace }, [activePlace])

  useEffect(() => {
    const host = mountRef.current
    if (!host) return
    let renderer, raf, observer
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#e9e6dc')
    scene.fog = new THREE.Fog('#e9e6dc', 23, 42)
    const camera = new THREE.PerspectiveCamera(38, 1, .1, 100)
    const homePosition = new THREE.Vector3(12, 13, 15)
    camera.position.copy(homePosition)
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'low-power' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.12
    host.appendChild(renderer.domElement)

    scene.add(new THREE.HemisphereLight('#fff8e9', '#718276', 2.0))
    const sun = new THREE.DirectionalLight('#fff1d6', 2.6)
    sun.position.set(8, 15, 9)
    sun.castShadow = true
    sun.shadow.mapSize.set(1536, 1536)
    sun.shadow.camera.left = -12
    sun.shadow.camera.right = 12
    sun.shadow.camera.top = 12
    sun.shadow.camera.bottom = -12
    scene.add(sun)

    const mat = (color, roughness=.9) => new THREE.MeshStandardMaterial({ color, roughness })
    const ground = new THREE.Mesh(new THREE.BoxGeometry(17, .3, 14), mat('#d8d0ba'))
    ground.position.y = -.2
    ground.receiveShadow = true
    scene.add(ground)

    // Soft green spaces and planted fields
    const grass = mat('#a9b18a')
    const grass2 = mat('#c0bd91')
    ;[[-5,-4,3.2,2.4], [5,-4,3.4,2.2], [-5,4,3.2,2.2], [5,4,3.2,2.2]].forEach(([x,z,w,d],i)=>{
      const patch = new THREE.Mesh(new THREE.BoxGeometry(w,.035,d), i%2?grass:grass2)
      patch.position.set(x,-.025,z); patch.receiveShadow=true; scene.add(patch)
    })

    // Village roads with small shoulders
    const roadMat = mat('#b9ad96')
    const shoulder = mat('#d5c8ac')
    function road(w,d,x,z) {
      const edge = new THREE.Mesh(new THREE.BoxGeometry(w+.16,.035,d+.16), shoulder)
      edge.position.set(x,-.035,z); scene.add(edge)
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w,.045,d), roadMat)
      mesh.position.set(x,-.005,z); mesh.receiveShadow=true; scene.add(mesh)
    }
    road(1.15,13.6,0,0)
    road(16.4,1.05,0,1.15)
    road(1.0,6.0,-5.0,-3.6)
    road(1.0,5.6,5.0,4.0)

    // Buildings: Thai-inspired homes, market stalls and learning centre
    const wallMat = mat('#eee5d3')
    const darkWood = mat('#765b43')
    const roofMats = [mat('#a9684e'),mat('#8c7257'),mat('#9b5947')]
    function house(x,z,scale=1,roofIndex=0) {
      const g = new THREE.Group()
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.15*scale,.78*scale,.95*scale),wallMat)
      body.position.y=.43*scale; body.castShadow=true; body.receiveShadow=true; g.add(body)
      const roof = new THREE.Mesh(new THREE.ConeGeometry(.91*scale,.56*scale,4),roofMats[roofIndex])
      roof.rotation.y=Math.PI/4; roof.position.y=1.08*scale; roof.castShadow=true; g.add(roof)
      const door = new THREE.Mesh(new THREE.BoxGeometry(.19*scale,.38*scale,.035),darkWood)
      door.position.set(0,.2*scale,.49*scale); g.add(door)
      const windowMat=mat('#9eb5ae',.45)
      ;[-.34,.34].forEach(wx=>{const win=new THREE.Mesh(new THREE.BoxGeometry(.2*scale,.19*scale,.025),windowMat);win.position.set(wx,.56*scale,.49*scale);g.add(win)})
      g.position.set(x,0,z); scene.add(g)
    }
    house(-3.5,-3.1,.95,0); house(2.5,-3.5,.9,1); house(4.1,.1,.88,0)
    house(-4.2,3.0,.88,1); house(2.9,3.35,.85,2); house(-2.8,.1,.8,1)
    house(6.1,-1.5,.72,0); house(-6.1,1.3,.72,2)

    // Community centre
    const hall = new THREE.Group()
    const hallBody = new THREE.Mesh(new THREE.BoxGeometry(2.0,1.0,1.55),mat('#e2d4b8'))
    hallBody.position.y=.52; hallBody.castShadow=true; hall.add(hallBody)
    const hallRoof = new THREE.Mesh(new THREE.ConeGeometry(1.48,.7,4),mat('#657d62'))
    hallRoof.rotation.y=Math.PI/4; hallRoof.position.y=1.35; hallRoof.castShadow=true; hall.add(hallRoof)
    hall.position.set(4.5,0,-2.0); scene.add(hall)

    // Local market with individual awnings
    for(let i=0;i<3;i++){
      const stall=new THREE.Group()
      const counter=new THREE.Mesh(new THREE.BoxGeometry(.95,.48,.7),mat('#a9825f'))
      counter.position.y=.25; counter.castShadow=true; stall.add(counter)
      const canopy=new THREE.Mesh(new THREE.BoxGeometry(1.12,.08,.88),mat(i%2?'#c17d5e':'#e4c99d'))
      canopy.position.y=.95; canopy.castShadow=true; stall.add(canopy)
      ;[-.42,.42].forEach(x=>{const post=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,.9,8),darkWood);post.position.set(x,.48,0);stall.add(post)})
      stall.position.set(-3.8+i*1.25,0,4.25);scene.add(stall)
    }

    // Learning space and farm plots
    const learning = new THREE.Group()
    const learnBody=new THREE.Mesh(new THREE.BoxGeometry(1.75,.72,1.3),mat('#e9dfc9'))
    learnBody.position.y=.38;learnBody.castShadow=true;learning.add(learnBody)
    const learnRoof=new THREE.Mesh(new THREE.ConeGeometry(1.25,.55,4),mat('#9b7656'))
    learnRoof.rotation.y=Math.PI/4;learnRoof.position.y=1.0;learning.add(learnRoof)
    learning.position.set(-5.1,-.0,-2.3);scene.add(learning)
    const cropMat=[mat('#879a65'),mat('#9baa70'),mat('#b3b77d')]
    for(let r=0;r<4;r++) for(let c=0;c<5;c++){
      const crop=new THREE.Mesh(new THREE.BoxGeometry(.38,.18,.32),cropMat[(r+c)%3])
      crop.position.set(3.6+c*.48,.08+r*.015,3.1+r*.48)
      crop.castShadow=true;scene.add(crop)
    }
    // Pond with a natural bank
    const pondBank=new THREE.Mesh(new THREE.CircleGeometry(1.55,40),mat('#b4b18e'))
    pondBank.rotation.x=-Math.PI/2;pondBank.scale.set(1.3,.85,1);pondBank.position.set(-4.4,-.005,-1.1);scene.add(pondBank)
    const pond=new THREE.Mesh(new THREE.CircleGeometry(1.35,40),new THREE.MeshStandardMaterial({color:'#83a9a5',roughness:.25,metalness:.05}))
    pond.rotation.x=-Math.PI/2;pond.scale.set(1.3,.85,1);pond.position.set(-4.4,.008,-1.1);scene.add(pond)

    // Deterministic trees and shrubs
    const treeMats=['#718967','#849875','#627c60'].map(c=>mat(c))
    const trunkMat=mat('#80644b')
    const treePoints=[[-6,-5],[-5,-5.6],[-2,-5.5],[1,-5.7],[6,-5],[6.5,-3.5],[-6,0],[-6,4.8],[-2,5.8],[0,5.7],[1.5,5.8],[6,5.7],[6.5,2.5],[2,0]]
    treePoints.forEach(([x,z],i)=>{
      const scale=.65+(i%3)*.12
      const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.055*scale,.09*scale,.45*scale,7),trunkMat)
      trunk.position.set(x,.2*scale,z);trunk.castShadow=true;scene.add(trunk)
      const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(.38*scale,1),treeMats[i%3])
      crown.position.set(x,.52*scale,z);crown.castShadow=true;scene.add(crown)
    })

    const locations = [
      {name:'ศูนย์ชุมชน', position:[4.5,0,-2.0], description:'พื้นที่ประชุม แลกเปลี่ยนความคิดเห็น และจัดกิจกรรมของคนในชุมชน', type:'พื้นที่ส่วนกลาง'},
      {name:'ตลาดท้องถิ่น', position:[-2.55,0,4.25], description:'พื้นที่จำหน่ายสินค้า อาหาร และผลิตภัณฑ์จากภูมิปัญญาท้องถิ่น', type:'เศรษฐกิจชุมชน'},
      {name:'พื้นที่เกษตร', position:[4.65,0,4.0], description:'แปลงสาธิตการปลูกพืชและพื้นที่เรียนรู้ด้านเกษตร', type:'เกษตรและทรัพยากร'},
      {name:'แหล่งเรียนรู้', position:[-5.1,0,-2.3], description:'พื้นที่ถ่ายทอดความรู้ ทักษะ และภูมิปัญญาระหว่างคนต่างวัย', type:'การเรียนรู้'}
    ]
    const markerObjects=[]
    const markerMaterials={}
    function makeLabel(text){
      const canvas=document.createElement('canvas');canvas.width=512;canvas.height=128
      const ctx=canvas.getContext('2d')
      ctx.fillStyle='rgba(23,60,50,.92)'
      ctx.beginPath();ctx.roundRect(8,8,496,112,24);ctx.fill()
      ctx.fillStyle='#fffaf0';ctx.font='bold 38px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,256,64)
      const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace
      const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,depthTest:false}))
      sprite.scale.set(2.15,.54,1)
      return sprite
    }
    locations.forEach((loc)=>{
      const group=new THREE.Group()
      const pole=new THREE.Mesh(new THREE.CylinderGeometry(.025,.035,.48,8),mat('#f7f0df'))
      pole.position.y=.34;group.add(pole)
      const ring=new THREE.Mesh(new THREE.TorusGeometry(.23,.035,8,28),mat('#c17b5d'))
      ring.rotation.x=Math.PI/2;ring.position.y=.64;group.add(ring)
      const dot=new THREE.Mesh(new THREE.SphereGeometry(.14,18,14),mat('#173c32'))
      dot.position.y=.64;group.add(dot)
      const label=makeLabel(loc.name);label.position.y=1.28;group.add(label)
      group.position.set(...loc.position);group.userData.place=loc.name
      group.traverse(o=>{o.userData.place=loc.name})
      scene.add(group);markerObjects.push(group)
      markerMaterials[loc.name]={dot:ring.material,core:dot.material}
    })

    const controls = new OrbitControls(camera,renderer.domElement)
    controls.enableDamping=true;controls.dampingFactor=.06
    controls.enablePan=true;controls.panSpeed=.55
    controls.minDistance=8;controls.maxDistance=24
    controls.maxPolarAngle=Math.PI/2.08
    controls.target.set(0,0,0)
    const raycaster=new THREE.Raycaster()
    const pointer=new THREE.Vector2()
    const onPointer=(event)=>{
      const rect=renderer.domElement.getBoundingClientRect()
      pointer.x=((event.clientX-rect.left)/rect.width)*2-1
      pointer.y=-((event.clientY-rect.top)/rect.height)*2+1
      raycaster.setFromCamera(pointer,camera)
      const hits=raycaster.intersectObjects(markerObjects,true)
      if(hits.length){
        let obj=hits[0].object
        while(obj && !obj.userData.place) obj=obj.parent
        if(obj?.userData.place) selectRef.current?.(obj.userData.place)
      }
    }
    renderer.domElement.addEventListener('pointerdown',onPointer)
    const resetView=()=>{camera.position.copy(homePosition);controls.target.set(0,0,0);controls.update()}
    renderer.domElement.addEventListener('nera-reset',resetView)
    const resize=()=>{
      const w=host.clientWidth,h=host.clientHeight
      if(!w||!h)return
      camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h)
    }
    observer=new ResizeObserver(resize);observer.observe(host);resize()
    const animate=()=>{
      raf=requestAnimationFrame(animate)
      const active=activeRef.current
      markerObjects.forEach(group=>{
        const isActive=group.userData.place===active
        group.scale.setScalar(isActive?1.16:1)
        const materials=markerMaterials[group.userData.place]
        materials.core.color.set(isActive?'#c17b5d':'#173c32')
        materials.dot.color.set(isActive?'#e0a17e':'#c17b5d')
      })
      controls.update();renderer.render(scene,camera)
    }
    animate()
    return ()=>{
      cancelAnimationFrame(raf);observer?.disconnect()
      renderer.domElement.removeEventListener('pointerdown',onPointer)
      renderer.domElement.removeEventListener('nera-reset',resetView)
      controls.dispose();renderer.dispose()
      if(renderer.domElement.parentNode===host)host.removeChild(renderer.domElement)
      scene.traverse(o=>{
        o.geometry?.dispose()
        if(o.material){const ms=Array.isArray(o.material)?o.material:[o.material];ms.forEach(m=>{m.map?.dispose();m.dispose()})}
      })
    }
  },[])
  return <div className="village-canvas" ref={mountRef}>
    <span className="scene-hint">แตะหมุดเพื่อดูสถานที่ · ลากเพื่อหมุน · ซูมเพื่อสำรวจ</span>
    <button className="scene-reset" type="button" onClick={()=>{const canvas=mountRef.current?.querySelector('canvas');if(canvas)canvas.dispatchEvent(new Event('nera-reset'))}}>มุมมองเริ่มต้น ↺</button>
  </div>
}

function Header() {
  const [open,setOpen]=useState(false)
  const links=[['เรื่องราว','story'],['สำรวจชุมชน','explore'],['สินค้า','products'],['โครงการ','projects'],['ข่าวสาร','stories']]
  return <header className="header">
    <a className="brand" href="#top" aria-label="NÉRA home">NÉRA<span className="brand-dot">.</span></a>
    <nav className={open?'nav nav-open':'nav'}>
      {links.map(([label,id])=><a key={id} href={`#${id}`} onClick={()=>setOpen(false)}>{label}</a>)}
      <a className="nav-contact" href="#contact" onClick={()=>setOpen(false)}>ติดต่อเรา <ArrowUpRight size={15}/></a>
    </nav>
    <button className="menu-toggle" onClick={()=>setOpen(!open)} aria-label="Toggle menu">{open?<X/>:<Menu/>}</button>
  </header>
}

function SectionLabel({no,en}) { return <div className="section-label"><span>{no}</span><span>{en}</span></div> }

function App(){
  const [form,setForm]=useState({name:'',email:'',message:''})
  const [sent,setSent]=useState(false)
  const [selected,setSelected]=useState('ทั้งหมด')
  const [activePlace,setActivePlace]=useState('ศูนย์ชุมชน')
  const places=['ศูนย์ชุมชน','ตลาดท้องถิ่น','พื้นที่เกษตร','แหล่งเรียนรู้']
  const placeDetails={
    'ศูนย์ชุมชน':{type:'พื้นที่ส่วนกลาง',description:'พื้นที่ประชุม แลกเปลี่ยนความคิดเห็น และจัดกิจกรรมของคนในชุมชน'},
    'ตลาดท้องถิ่น':{type:'เศรษฐกิจชุมชน',description:'พื้นที่จำหน่ายสินค้า อาหาร และผลิตภัณฑ์จากภูมิปัญญาท้องถิ่น'},
    'พื้นที่เกษตร':{type:'เกษตรและทรัพยากร',description:'แปลงสาธิตการปลูกพืชและพื้นที่เรียนรู้ด้านเกษตร'},
    'แหล่งเรียนรู้':{type:'การเรียนรู้',description:'พื้นที่ถ่ายทอดความรู้ ทักษะ และภูมิปัญญาระหว่างคนต่างวัย'}
  }
  const submit=(e)=>{e.preventDefault();setSent(true)}
  return <div id="top">
    <Header/>
    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line"></span> COMMUNITY DEVELOPMENT PLATFORM</div>
          <h1>ชุมชนที่เข้มแข็ง<br/><em>เริ่มต้นจาก</em><br/>การเชื่อมโยง<span className="period">.</span></h1>
          <p className="hero-lead">เชื่อมโยงผู้คน ภูมิปัญญา ทรัพยากร และโอกาส เพื่อสร้างอนาคตที่ยั่งยืนให้กับชุมชน</p>
          <div className="hero-actions"><a className="button button-dark" href="#explore">สำรวจชุมชน <ArrowUpRight size={17}/></a><a className="text-link" href="#story">รู้จัก NÉRA <ArrowDownRight size={16}/></a></div>
          <div className="hero-index"><span>01 / 08</span><span>บ้านทุ่งอรุณ · ประเทศไทย</span></div>
        </div>
        <div className="hero-visual">
          <img className="hero-image" src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=85" alt="ทิวทัศน์พื้นที่เกษตรและชุมชน" />
          <div className="image-caption"><span>FIG. 01</span><span>LANDSCAPE & LIVING</span></div>
          <div className="hero-stamp"><span>LOCAL</span><span>ROOTS</span><span>GLOBAL</span><span>FUTURE</span></div>
        </div>
      </section>

      <section className="intro-section" id="story">
        <SectionLabel no="01" en="THE COMMUNITY STORY"/>
        <div className="intro-grid">
          <h2>ทุกชุมชน<br/>มีเรื่องราว<br/><span>ที่ควรถูกเล่า</span></h2>
          <div className="intro-text"><p className="serif-quote">“การพัฒนาที่แท้จริง เริ่มต้นจากการเข้าใจสิ่งที่ชุมชนมีอยู่”</p><p>NÉRA คือพื้นที่กลางที่รวบรวมเรื่องราว ผู้คน ภูมิปัญญา และโอกาสของชุมชนไว้ด้วยกัน เพื่อให้ทุกคุณค่าถูกมองเห็นและต่อยอดได้</p><a className="under-link" href="#explore">ค้นพบชุมชนของเรา <ArrowUpRight size={16}/></a></div>
        </div>
        <div className="stats-row">
          {[['1,240','ผู้อยู่อาศัย','RESIDENTS'],['385','ครัวเรือน','HOUSEHOLDS'],['08','กลุ่มอาชีพ','LOCAL GROUPS'],['06','สถานที่สำคัญ','KEY PLACES']].map(([n,t,e])=><div className="stat" key={e}><strong>{n}</strong><span>{t}</span><small>{e}</small></div>)}
        </div>
      </section>

      <section className="explore-section" id="explore">
        <SectionLabel no="02" en="EXPLORE THE VILLAGE"/>
        <div className="section-heading"><div><p className="kicker">A PLACE TO DISCOVER</p><h2>สำรวจพื้นที่<br/><em>ในมุมมองใหม่</em></h2></div><p className="heading-note">มองเห็นความเชื่อมโยงของสถานที่ ผู้คน และทรัพยากร ผ่านแผนที่ชุมชนสามมิติ</p></div>
        <div className="village-frame"><div className="village-topline"><span>COMMUNITY MAP / 001</span><span>INTERACTIVE 3D MODEL · DEMO DATA</span></div><VillageScene activePlace={activePlace} onSelect={setActivePlace}/><div className="village-bottom"><div className="selected-place"><span className="tiny-label">SELECTED LOCATION</span><strong>{activePlace}</strong><small>{placeDetails[activePlace].type}</small><p>{placeDetails[activePlace].description}</p></div><div className="place-pills">{places.map(p=><button className={activePlace===p?'active':''} onClick={()=>setActivePlace(p)} key={p}>{p}</button>)}</div></div></div>
      </section>

      <section className="identity-section" id="products">
        <SectionLabel no="03" en="LOCAL IDENTITY"/>
        <div className="section-heading"><div><p className="kicker">MADE WITH MEANING</p><h2>คุณค่าจากท้องถิ่น<br/><em>ส่งต่อถึงทุกคน</em></h2></div><a className="under-link" href="#contact">รู้จักสินค้าชุมชน <ArrowUpRight size={16}/></a></div>
        <div className="product-grid">{products.map((p,i)=><article className={`product product-${i+1}`} key={p.name}><div className="product-image-wrap"><img src={`https://images.unsplash.com/${p.image}?auto=format&fit=crop&w=900&q=80`} alt={p.name} loading="lazy" onError={e=>{e.currentTarget.style.display='none'}}/><span className="product-number">0{i+1}</span></div><div className="product-meta"><span>{p.category}</span><span>{p.price}</span></div><h3>{p.name}</h3><p>{p.en}</p></article>)}</div>
      </section>

      <section className="projects-section" id="projects">
        <SectionLabel no="04" en="DEVELOPMENT IN ACTION"/>
        <div className="section-heading"><div><p className="kicker">SMALL STEPS, SHARED FUTURE</p><h2>เปลี่ยนความตั้งใจ<br/><em>ให้เป็นการลงมือทำ</em></h2></div><p className="heading-note">ติดตามแนวคิดและความคืบหน้าของโครงการที่ช่วยยกระดับคุณภาพชีวิตในชุมชน</p></div>
        <div className="project-list">{projects.map(p=><article className="project-row" key={p.no}><span className="project-no">{p.no}</span><div className="project-title"><h3>{p.title}</h3><span>{p.en}</span><p>{p.text}</p></div><div className="project-budget"><small>งบประมาณตัวอย่าง</small><strong>{p.budget}</strong></div><div className="project-progress"><div className="progress-head"><span>ความคืบหน้า</span><strong>{p.progress}%</strong></div><div className="progress-track"><span style={{width:`${p.progress}%`}}/></div></div><ArrowUpRight className="project-arrow"/></article>)}</div>
      </section>

      <section className="stories-section" id="stories">
        <SectionLabel no="05" en="PLACES & STORIES"/>
        <div className="story-feature"><img src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1500&q=85" alt="สถาปัตยกรรมและพื้นที่ชุมชน"/><div className="story-overlay"><span className="kicker">FIELD NOTES / 001</span><h2>พื้นที่ธรรมดา<br/>ที่มีความหมาย</h2><p>เรื่องราวของสถานที่ ผู้คน และสิ่งเล็ก ๆ ที่ทำให้ชุมชนพิเศษ</p><a className="light-link" href="#contact">อ่านเรื่องราว <ArrowUpRight size={16}/></a></div></div>
      </section>

      <section className="contact-section" id="contact">
        <SectionLabel no="06" en="LET'S CONNECT"/>
        <div className="contact-grid"><div><p className="kicker">START A CONVERSATION</p><h2>เรื่องราวดี ๆ<br/><em>เริ่มจากการพูดคุย</em></h2><p className="contact-copy">มีแนวคิด อยากร่วมพัฒนา หรืออยากรู้จักชุมชนมากขึ้น ติดต่อเราได้ที่นี่</p><div className="contact-detail"><Mail size={17}/><span>hello@nera-community.example</span></div><div className="contact-detail"><MapPin size={17}/><span>บ้านทุ่งอรุณ · ประเทศไทย (ข้อมูลตัวอย่าง)</span></div></div>
          <form className="contact-form" onSubmit={submit}><label>ชื่อ / NAME<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="ชื่อของคุณ"/></label><label>อีเมล / EMAIL<input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com"/></label><label>ข้อความ / MESSAGE<textarea required rows="4" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="เล่าให้เราฟังว่าคุณสนใจเรื่องใด..."/></label><button className="button button-dark" type="submit">ส่งข้อความ <ArrowUpRight size={17}/></button>{sent&&<p className="form-success">ขอบคุณสำหรับข้อความนี้ — นี่คือแบบฟอร์มสาธิต ยังไม่มีการส่งข้อมูลไปยังเซิร์ฟเวอร์</p>}</form>
        </div>
      </section>
    </main>
    <footer className="footer"><div className="footer-main"><div><a className="footer-brand" href="#top">NÉRA<span>.</span></a><p>A community, connected.<br/>เชื่อมโยงคุณค่า สร้างอนาคตที่ยั่งยืน</p></div><div className="footer-links"><a href="#story">เรื่องราว</a><a href="#explore">สำรวจชุมชน</a><a href="#products">สินค้า</a><a href="#projects">โครงการ</a><a href="#contact">ติดต่อ</a></div><div className="footer-social"><a href="#contact" aria-label="Instagram"><Instagram/></a><a href="#contact" aria-label="Facebook"><Facebook/></a></div></div><div className="footer-bottom"><span>© 2026 NÉRA COMMUNITY CONNECT</span><span>DEMO PROJECT · ข้อมูลทั้งหมดเป็นข้อมูลสมมติ</span><a href="#top">BACK TO TOP ↑</a></div></footer>
  </div>
}

createRoot(document.getElementById('root')).render(<App/>)
