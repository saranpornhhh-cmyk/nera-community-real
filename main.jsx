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
  { name: 'ผ้าทอมือสีธรรมชาติ', en: 'Naturally Dyed Textile', price: '฿450', category: 'งานหัตถกรรม', image: 'photo-1512436991641-6745cdb1723f' },
  { name: 'ข้าวอินทรีย์ฤดูกาลใหม่', en: 'Seasonal Organic Rice', price: '฿85', category: 'เกษตรอินทรีย์', image: 'photo-1586201375761-83865001e31c' },
  { name: 'น้ำผึ้งดอกไม้ป่า', en: 'Wildflower Honey', price: '฿160', category: 'อาหารท้องถิ่น', image: 'photo-1587049352851-8d4e89133924' },
]

const learningResources = [
  { id:'01', title:'เริ่มต้นพัฒนาชุมชนอย่างมีส่วนร่วม', category:'พื้นฐาน', level:'เริ่มต้น', summary:'เข้าใจบทบาทของคนในพื้นที่ ตั้งแต่ร่วมรับรู้ ร่วมคิด ตัดสินใจ วางแผน ลงมือทำ และติดตามผล', outcome:'นำกระบวนการมีส่วนร่วมไปออกแบบกิจกรรมชุมชนได้', source:'กรมการพัฒนาชุมชน', url:'https://plan.cdd.go.th/file/get/file/102.202506255dc01a6a46993708770d1f578e1434e7103557.pdf' },
  { id:'02', title:'สำรวจทุน ปัญหา และข้อมูลชุมชน', category:'พื้นฐาน', level:'ลงมือทำ', summary:'เรียนรู้การเก็บข้อมูลคน กลุ่มอาชีพ ทรัพยากร ภูมิปัญญา และปัญหา เพื่อใช้กำหนดเป้าหมายจากข้อมูลจริง', outcome:'จัดทำรายการทุนชุมชนและประเด็นที่ควรพัฒนาได้', source:'สภาพัฒน์ · ฐานข้อมูลชุมชน พอช.', url:'https://sdgs.nesdc.go.th/wp-content/uploads/2025/01/article_file_20230111130039.pdf' },
  { id:'03', title:'สร้างศูนย์เรียนรู้และถ่ายทอดภูมิปัญญา', category:'วัฒนธรรม', level:'ลงมือทำ', summary:'รวบรวมองค์ความรู้จากคนในพื้นที่ พัฒนาเป็นฐานเรียนรู้ด้านอาชีพ วัฒนธรรม เศรษฐกิจพอเพียง และสิ่งที่ชุมชนต้องการ', outcome:'ออกแบบฐานเรียนรู้ที่ชุมชนดูแลและจัดกิจกรรมได้ต่อเนื่อง', source:'กรมการพัฒนาชุมชน', url:'https://chumchon.cdd.go.th/th/file/get/file/114.202602200377231604a5bb899e140b9b95e55cdd103435.pdf' },
  { id:'04', title:'ชุมชนท้องถิ่นจัดการตนเอง', category:'การบริหาร', level:'วิดีโอเรียนรู้', summary:'เรียนรู้บทบาทสภาองค์กรชุมชน สวัสดิการชุมชน บ้านมั่นคง และการรวมพลังเพื่อแก้ปัญหาในพื้นที่', outcome:'มองเห็นกลไกและภาคีที่สามารถร่วมขับเคลื่อนชุมชน', source:'สถาบันพัฒนาองค์กรชุมชน (พอช.)', url:'https://web.codi.or.th/e-learning/' },
  { id:'05', title:'ออกแบบการพัฒนาที่ยั่งยืนด้วย SDGs', category:'ความยั่งยืน', level:'กรอบแนวคิด', summary:'เชื่อมโยงประเด็นชุมชนกับเป้าหมายการพัฒนาที่ยั่งยืน ทั้งด้านคน เศรษฐกิจ สิ่งแวดล้อม สันติภาพ และความร่วมมือ', outcome:'เลือกเป้าหมาย SDGs ที่สัมพันธ์กับปัญหาในพื้นที่ได้', source:'สำนักงานสภาพัฒนาการเศรษฐกิจและสังคมแห่งชาติ', url:'https://sdgs.nesdc.go.th/goals-and-indicators/' },
  { id:'06', title:'นำเป้าหมายโลกมาสู่การพัฒนาท้องถิ่น', category:'ความยั่งยืน', level:'กรณีศึกษา', summary:'ศึกษาการปรับเป้าหมาย SDGs ให้สอดคล้องกับบริบทพื้นที่และความร่วมมือของภาคส่วนต่าง ๆ ในประเทศไทย', outcome:'ตั้งโจทย์พัฒนาพื้นที่โดยไม่ทิ้งใครไว้ข้างหลัง', source:'สหประชาชาติในประเทศไทย', url:'https://thailand.un.org/th/sdgs' },
  { id:'07', title:'เสริมศักยภาพองค์กรและเครือข่ายชุมชน', category:'การบริหาร', level:'แนวทางปฏิบัติ', summary:'ศึกษาแนวทางเพิ่มขีดความสามารถขององค์กรชุมชน การประสานภาคี และการจัดการทรัพยากรเพื่อพึ่งพาตนเอง', outcome:'วางแนวทางความร่วมมือระหว่างชุมชนกับหน่วยงานสนับสนุน', source:'สถาบันพัฒนาองค์กรชุมชน (พอช.) · แนวทางปี 2569', url:'https://web.codi.or.th/wp-content/uploads/2025/10/PT01_%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A8_%E0%B9%81%E0%B8%99%E0%B8%A7%E0%B8%97%E0%B8%B2%E0%B8%87%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%AA%E0%B8%99%E0%B8%B1%E0%B8%9A%E0%B8%AA%E0%B8%99%E0%B8%B8%E0%B8%99%E0%B9%82%E0%B8%84%E0%B8%A3%E0%B8%87%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%AA%E0%B8%A3%E0%B8%B4%E0%B8%A1%E0%B8%AA%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%87%E0%B8%2569.pdf' }
]

const projects = [
  { no: '01', title: 'ตลาดชุมชนมีชีวิต', en: 'A Market for Everyone', budget: '฿120,000', progress: 65, text: 'ปรับปรุงพื้นที่ค้าขายให้เป็นศูนย์กลางเศรษฐกิจและพื้นที่พบปะของคนในชุมชน' },
  { no: '02', title: 'จัดการขยะอย่างเข้าใจ', en: 'Circular Community', budget: '฿45,000', progress: 40, text: 'ส่งเสริมการคัดแยก ลดขยะ และนำทรัพยากรกลับมาใช้ประโยชน์' },
  { no: '03', title: 'พื้นที่เรียนรู้ร่วมกัน', en: 'Shared Learning Space', budget: '฿80,000', progress: 85, text: 'สร้างพื้นที่แลกเปลี่ยนทักษะ ภูมิปัญญา และกิจกรรมสำหรับทุกวัย' },
]

function VillageScene({ activePlace, onSelectPlace }) {
  const mountRef = useRef(null)
  useEffect(() => {
    const host = mountRef.current
    if (!host) return
    let renderer, frame, observer
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#e9e6dc')
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100)
    camera.position.set(10, 11, 13)
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' })
    } catch (error) {
      const fallback = document.createElement('div')
      fallback.className = 'village-fallback'
      fallback.textContent = 'อุปกรณ์นี้ไม่รองรับการแสดงผล 3D · สามารถเลือกสถานที่จากปุ่มด้านล่างได้'
      host.appendChild(fallback)
      return () => { host.replaceChildren() }
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.12
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    host.appendChild(renderer.domElement)

    scene.add(new THREE.HemisphereLight('#fff8e9', '#718276', 2.1))
    const sun = new THREE.DirectionalLight('#fff1d6', 2.5)
    sun.position.set(7, 12, 6)
    sun.castShadow = true
    sun.shadow.mapSize.set(1024, 1024)
    scene.add(sun)

    const groundMat = new THREE.MeshStandardMaterial({ color: '#d7d1bd', roughness: 1 })
    const ground = new THREE.Mesh(new THREE.BoxGeometry(14, .25, 11), groundMat)
    ground.position.y = -.18
    ground.receiveShadow = true
    scene.add(ground)

    const roadMat = new THREE.MeshStandardMaterial({ color: '#b8ad98', roughness: 1 })
    const road = new THREE.Mesh(new THREE.BoxGeometry(1.1, .025, 10.8), roadMat)
    road.position.set(0, -.035, 0)
    scene.add(road)
    const crossRoad = new THREE.Mesh(new THREE.BoxGeometry(13.8, .03, .8), roadMat)
    crossRoad.position.set(0, -.025, 1.1)
    scene.add(crossRoad)

    const green = ['#758b68', '#879a76', '#607c60']
    const treeMat = green.map(c => new THREE.MeshStandardMaterial({ color: c, roughness: 1 }))
    const trunkMat = new THREE.MeshStandardMaterial({ color: '#80644b' })
    let randomSeed = 2026
    const random = () => { randomSeed = (randomSeed * 1664525 + 1013904223) % 4294967296; return randomSeed / 4294967296 }
    function tree(x, z, scale=1) {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(.07*scale,.1*scale,.55*scale,6), trunkMat)
      trunk.position.set(x,.18*scale,z); trunk.castShadow=true; scene.add(trunk)
      const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(.43*scale,1), treeMat[Math.floor(random()*treeMat.length)])
      crown.position.set(x,.65*scale,z); crown.castShadow=true; scene.add(crown)
    }
    function house(x,z,roof='#a96f55',scale=1) {
      const wall = new THREE.Mesh(new THREE.BoxGeometry(1.15*scale,.8*scale,.95*scale), new THREE.MeshStandardMaterial({color:'#eee5d3', roughness:.9}))
      wall.position.set(x,.42*scale,z); wall.castShadow=true; wall.receiveShadow=true; scene.add(wall)
      const top = new THREE.Mesh(new THREE.ConeGeometry(.92*scale,.58*scale,4), new THREE.MeshStandardMaterial({color:roof, roughness:.85}))
      top.rotation.y=Math.PI/4; top.position.set(x,.99*scale,z); top.castShadow=true; scene.add(top)
      const door = new THREE.Mesh(new THREE.BoxGeometry(.17*scale,.38*scale,.025), new THREE.MeshStandardMaterial({color:'#6a5948'}))
      door.position.set(x,.2*scale,z+.49*scale); scene.add(door)
    }
    house(-3.4,-3.1); house(2.6,-3.3,'#8c775e'); house(4.2,.1,'#a96f55',.9)
    house(-4.2,2.8,'#8b6d53',.9); house(2.7,3.3,'#a96f55',.85); house(-2.6,.1,'#8c775e',.8)
    // Community hall
    const hall = new THREE.Mesh(new THREE.BoxGeometry(1.8,.95,1.35), new THREE.MeshStandardMaterial({color:'#d8c7a7'}))
    hall.position.set(4.5,-.0,-2.1); hall.castShadow=true; scene.add(hall)
    const hallRoof = new THREE.Mesh(new THREE.ConeGeometry(1.35,.65,4), new THREE.MeshStandardMaterial({color:'#6c8065'}))
    hallRoof.rotation.y=Math.PI/4; hallRoof.position.set(4.5,.75,-2.1); hallRoof.castShadow=true; scene.add(hallRoof)
    // Pond
    const pond = new THREE.Mesh(new THREE.CircleGeometry(1.05,32), new THREE.MeshStandardMaterial({color:'#8eaaa3', roughness:.28, metalness:.08}))
    pond.rotation.x=-Math.PI/2; pond.scale.set(1.4,.72,1); pond.position.set(-4.4,.0,-1.2); scene.add(pond)
    for(let i=0;i<24;i++){
      const x=(random()-.5)*12, z=(random()-.5)*9
      if(Math.abs(x)<1.1 || (Math.abs(z-1.1)<.7 && Math.abs(x)<6.5)) continue
      tree(x,z,.65+random()*.45)
    }
    // Crop plots, a footpath and fencing give the village map more detail.
    const fieldMat = new THREE.MeshStandardMaterial({ color:'#b9b58a', roughness:1 })
    const field = new THREE.Mesh(new THREE.PlaneGeometry(4.2,3.0), fieldMat)
    field.rotation.x=-Math.PI/2; field.position.set(3.9,.006,3.35); field.receiveShadow=true; scene.add(field)
    const cropMat = new THREE.MeshStandardMaterial({ color:'#78875a', roughness:1 })
    for(let row=0;row<9;row++){
      const crop = new THREE.Mesh(new THREE.BoxGeometry(3.65,.07,.035), cropMat)
      crop.position.set(3.9,.055,2.2+row*.29); crop.castShadow=true; scene.add(crop)
    }
    const pathMat = new THREE.MeshStandardMaterial({ color:'#c7b89d', roughness:1 })
    const path = new THREE.Mesh(new THREE.BoxGeometry(.55,.035,4.2),pathMat)
    path.position.set(-1.9,-.02,3.15); scene.add(path)
    const fenceMat = new THREE.MeshStandardMaterial({color:'#8b7457',roughness:1})
    for(let i=0;i<8;i++){
      const post = new THREE.Mesh(new THREE.BoxGeometry(.07,.42,.07),fenceMat)
      post.position.set(-5.1+i*.42,.18,3.8); post.castShadow=true; scene.add(post)
    }
    const rail = new THREE.Mesh(new THREE.BoxGeometry(3.0,.06,.06),fenceMat)
    rail.position.set(-3.65,.27,3.8); scene.add(rail)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping=true; controls.enablePan=false
    controls.minDistance=10; controls.maxDistance=25
    controls.maxPolarAngle=Math.PI/2.05
    const placeFocus = {
      'ศูนย์ชุมชน': [4.5, 0, -2.1],
      'ตลาดท้องถิ่น': [-3.4, 0, -3.1],
      'พื้นที่เกษตร': [3.9, 0, 3.35],
      'แหล่งเรียนรู้': [-4.2, 0, 2.8]
    }
    const focus = placeFocus[activePlace] || [0,0,0]
    // Clearly labelled 3D location markers make the map easier to understand.
    const markerData = [
      ['ศูนย์ชุมชน', 4.5, -2.1], ['ตลาดท้องถิ่น', -3.4, -3.1],
      ['พื้นที่เกษตร', 3.9, 3.35], ['แหล่งเรียนรู้', -4.2, 2.8]
    ]
    const markerObjects = []
    markerData.forEach(([label, x, z]) => {
      const selected = label === activePlace
      const pin = new THREE.Group()
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(.025,.035,.62,8), new THREE.MeshStandardMaterial({ color: selected ? '#b8755a' : '#526d5d' }))
      stem.position.y = .62; pin.add(stem)
      const dot = new THREE.Mesh(new THREE.SphereGeometry(selected ? .14 : .1, 16, 12), new THREE.MeshStandardMaterial({ color: selected ? '#b8755a' : '#173c32', roughness: .4 }))
      dot.position.y = 1; pin.add(dot)
      const labelCanvas = document.createElement('canvas')
      labelCanvas.width = 512; labelCanvas.height = 128
      const ctx = labelCanvas.getContext('2d')
      ctx.fillStyle = selected ? '#173c32' : '#f5f3ec'
      ctx.fillRect(0, 0, 512, 128)
      ctx.fillStyle = selected ? '#ffffff' : '#173c32'
      ctx.font = 'bold 42px sans-serif'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(label, 256, 64)
      const texture = new THREE.CanvasTexture(labelCanvas)
      texture.colorSpace = THREE.SRGBColorSpace
      const tag = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false }))
      tag.scale.set(selected ? 2.25 : 1.85, selected ? .56 : .46, 1)
      tag.position.y = 1.55; pin.add(tag)
      pin.position.set(x, .08, z); pin.userData.place = label; scene.add(pin); markerObjects.push(pin)
    })
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    const selectMarker = (event) => {
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)
      const hit = raycaster.intersectObjects(markerObjects, true)[0]
      if (!hit) return
      let node = hit.object
      while (node && !node.userData.place) node = node.parent
      if (node?.userData.place) onSelectPlace?.(node.userData.place)
    }
    renderer.domElement.addEventListener('click', selectMarker)
    controls.target.set(focus[0], .25, focus[2])
    camera.position.set(focus[0]+8, 8.5, focus[2]+9)
    controls.update()
    const resize = () => {
      const w=host.clientWidth, h=host.clientHeight
      if(!w||!h) return
      camera.aspect=w/h; camera.updateProjectionMatrix(); renderer.setSize(w,h)
    }
    renderer.domElement.setAttribute('aria-label', 'แผนที่ชุมชนสามมิติ สามารถลากเพื่อหมุนและใช้สองนิ้วเพื่อซูม')
    renderer.domElement.setAttribute('role', 'img')
    renderer.domElement.style.touchAction = 'none'
    observer = new ResizeObserver(resize); observer.observe(host); resize()
    const animate=()=>{ frame=requestAnimationFrame(animate); controls.update(); renderer.render(scene,camera) }
    animate()
    return ()=>{ cancelAnimationFrame(frame); observer?.disconnect(); renderer.domElement.removeEventListener('click', selectMarker); controls.dispose(); renderer.dispose(); if(renderer.domElement.parentNode===host) host.removeChild(renderer.domElement); scene.traverse(o=>{o.geometry?.dispose(); if(o.material){const materials=Array.isArray(o.material)?o.material:[o.material]; materials.forEach(m=>{m.map?.dispose();m.dispose()})}}) }
  }, [activePlace])
  return <div className="village-canvas" ref={mountRef}><span className="scene-hint">DRAG TO EXPLORE · ลากเพื่อหมุนมุมมอง</span></div>
}

function Header() {
  const [open,setOpen]=useState(false)
  const links=[['เรื่องราว','story'],['สำรวจชุมชน','explore'],['แหล่งเรียนรู้','learning'],['สินค้า','products'],['โครงการ','projects'],['ข่าวสาร','stories']]
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
          <img className="hero-image" fetchPriority="high" onError={e=>{e.currentTarget.style.display='none';e.currentTarget.parentElement.classList.add('image-fallback')}} src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=85" alt="ทิวทัศน์พื้นที่เกษตรและชุมชน" />
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
        <div className="village-frame"><div className="village-topline"><span>COMMUNITY MAP / 001</span><span>INTERACTIVE 3D MODEL</span></div><VillageScene activePlace={activePlace} onSelectPlace={setActivePlace}/><div className="village-bottom"><div><span className="tiny-label">SELECTED LOCATION</span><strong>{activePlace}</strong></div><div className="place-pills">{places.map(p=><button className={activePlace===p?'active':''} onClick={()=>setActivePlace(p)} key={p}>{p}</button>)}</div></div></div>
      </section>

      <section className="identity-section" id="products">
        <SectionLabel no="03" en="LOCAL IDENTITY"/>
        <div className="section-heading"><div><p className="kicker">MADE WITH MEANING</p><h2>คุณค่าจากท้องถิ่น<br/><em>ส่งต่อถึงทุกคน</em></h2></div><a className="under-link" href="#contact">รู้จักสินค้าชุมชน <ArrowUpRight size={16}/></a></div>
        <div className="product-grid">{products.map((p,i)=><article className={`product product-${i+1}`} key={p.name}><div className="product-image-wrap"><img loading="lazy" onError={e=>{e.currentTarget.style.display="none";e.currentTarget.parentElement.classList.add("image-fallback")}} src={`https://images.unsplash.com/${p.image}?auto=format&fit=crop&w=900&q=80`} alt={p.name}/><span className="product-number">0{i+1}</span></div><div className="product-meta"><span>{p.category}</span><span>{p.price}</span></div><h3>{p.name}</h3><p>{p.en}</p></article>)}</div>
      </section>

      <section className="projects-section" id="projects">
        <SectionLabel no="04" en="DEVELOPMENT IN ACTION"/>
        <div className="section-heading"><div><p className="kicker">SMALL STEPS, SHARED FUTURE</p><h2>เปลี่ยนความตั้งใจ<br/><em>ให้เป็นการลงมือทำ</em></h2></div><p className="heading-note">ติดตามแนวคิดและความคืบหน้าของโครงการที่ช่วยยกระดับคุณภาพชีวิตในชุมชน</p></div>
        <div className="project-list">{projects.map(p=><article className="project-row" key={p.no}><span className="project-no">{p.no}</span><div className="project-title"><h3>{p.title}</h3><span>{p.en}</span><p>{p.text}</p></div><div className="project-budget"><small>งบประมาณตัวอย่าง</small><strong>{p.budget}</strong></div><div className="project-progress"><div className="progress-head"><span>ความคืบหน้า</span><strong>{p.progress}%</strong></div><div className="progress-track"><span style={{width:`${p.progress}%`}}/></div></div><ArrowUpRight className="project-arrow"/></article>)}</div>
      </section>

      <section className="stories-section" id="stories">
        <SectionLabel no="05" en="PLACES & STORIES"/>
        <div className="story-feature"><img loading="lazy" onError={e=>{e.currentTarget.style.display="none";e.currentTarget.parentElement.classList.add("image-fallback")}} src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1500&q=85" alt="สถาปัตยกรรมและพื้นที่ชุมชน"/><div className="story-overlay"><span className="kicker">FIELD NOTES / 001</span><h2>พื้นที่ธรรมดา<br/>ที่มีความหมาย</h2><p>เรื่องราวของสถานที่ ผู้คน และสิ่งเล็ก ๆ ที่ทำให้ชุมชนพิเศษ</p><a className="light-link" href="#contact">อ่านเรื่องราว <ArrowUpRight size={16}/></a></div></div>
      </section>

      <section className="learning-section" id="learning">
        <SectionLabel no="05" en="COMMUNITY LEARNING HUB"/>
        <div className="section-heading"><div><p className="kicker">KNOWLEDGE FOR LOCAL ACTION</p><h2>เรียนรู้เพื่อพัฒนา<br/><em>ชุมชนของเรา</em></h2></div><p className="heading-note">รวมคู่มือ บทเรียน และแหล่งข้อมูลจากหน่วยงานที่เชื่อถือได้ เพื่อเปลี่ยนความรู้ให้เป็นการลงมือทำ</p></div>
        <div className="learning-intro"><strong>เริ่มจากสิ่งที่ชุมชนมี แล้วค่อย ๆ พัฒนาสิ่งที่ชุมชนต้องการ</strong><p>เลือกหัวข้อที่สนใจ อ่านสรุปก่อน แล้วเปิดแหล่งข้อมูลต้นฉบับเพื่อศึกษาเพิ่มเติม เนื้อหาในหน้านี้เป็นบทนำและคัดสรรลิงก์จากหน่วยงานเจ้าของความรู้</p></div>
        <div className="learning-filters" role="group" aria-label="กรองหมวดหมู่แหล่งเรียนรู้">
          {['ทั้งหมด',...new Set(learningResources.map(item=>item.category))].map(category=><button type="button" key={category} className={selected===category?'active':''} aria-pressed={selected===category} onClick={()=>setSelected(category)}>{category}</button>)}
        </div>
        <div className="learning-grid">
          {learningResources.filter(item=>selected==='ทั้งหมด'||item.category===selected).map(item=><article className="learning-card" key={item.id}>
            <div className="learning-card-top"><span>{item.id} / LEARNING NOTE</span><span>{item.level}</span></div>
            <span className="learning-category">{item.category}</span>
            <h3>{item.title}</h3><p>{item.summary}</p>
            <div className="learning-outcome"><small>สิ่งที่ได้เรียนรู้</small><strong>{item.outcome}</strong></div>
            <div className="learning-source"><span>{item.source}</span><a href={item.url} target="_blank" rel="noopener noreferrer">เปิดแหล่งเรียนรู้ <ArrowUpRight size={15}/></a></div>
          </article>)}
        </div>
        <div className="learning-method">
          <div><p className="kicker">FROM LEARNING TO ACTION</p><h3>5 ขั้นตอนสู่แผนพัฒนาชุมชน</h3><p>ใช้เป็นแนวทางเริ่มต้นและปรับให้เหมาะกับบริบทของแต่ละพื้นที่</p></div>
          <ol><li><strong>รับฟัง</strong><span>เปิดพื้นที่ให้ทุกกลุ่มสะท้อนความต้องการ</span></li><li><strong>สำรวจ</strong><span>รวบรวมข้อมูล ปัญหา และทุนชุมชน</span></li><li><strong>จัดลำดับ</strong><span>เลือกประเด็นสำคัญร่วมกันอย่างโปร่งใส</span></li><li><strong>ลงมือทำ</strong><span>กำหนดผู้รับผิดชอบ ทรัพยากร และเวลา</span></li><li><strong>ติดตาม</strong><span>ประเมินผล เปิดเผยความคืบหน้า และปรับแผน</span></li></ol>
        </div>
        <p className="learning-disclaimer">หมายเหตุ: NÉRA เป็นผู้รวบรวมและสรุปบทนำ ลิงก์จะนำไปยังเว็บไซต์หรือเอกสารของหน่วยงานต้นทาง โปรดตรวจสอบปีที่เผยแพร่และฉบับล่าสุดจากเจ้าของเอกสารก่อนนำไปใช้อ้างอิง</p>
      </section>

      <section className="contact-section" id="contact">
        <SectionLabel no="06" en="LET'S CONNECT"/>
        <div className="contact-grid"><div><p className="kicker">START A CONVERSATION</p><h2>เรื่องราวดี ๆ<br/><em>เริ่มจากการพูดคุย</em></h2><p className="contact-copy">มีแนวคิด อยากร่วมพัฒนา หรืออยากรู้จักชุมชนมากขึ้น ติดต่อเราได้ที่นี่</p><div className="contact-detail"><Mail size={17}/><span>hello@nera-community.example</span></div><div className="contact-detail"><MapPin size={17}/><span>บ้านทุ่งอรุณ · ประเทศไทย (ข้อมูลตัวอย่าง)</span></div></div>
          <form className="contact-form" onSubmit={submit}><label>ชื่อ / NAME<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="ชื่อของคุณ"/></label><label>อีเมล / EMAIL<input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com"/></label><label>ข้อความ / MESSAGE<textarea required rows="4" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="เล่าให้เราฟังว่าคุณสนใจเรื่องใด..."/></label><button className="button button-dark" type="submit">ทดสอบแบบฟอร์ม <ArrowUpRight size={17}/></button>{sent&&<p className="form-success" role="status" aria-live="polite">ตรวจสอบข้อมูลเรียบร้อยแล้ว · แบบฟอร์มนี้ยังเป็นตัวอย่างและยังไม่ได้ส่งข้อมูลไปยังเซิร์ฟเวอร์</p>}</form>
        </div>
      </section>
    </main>
    <footer className="footer"><div className="footer-main"><div><a className="footer-brand" href="#top">NÉRA<span>.</span></a><p>A community, connected.<br/>เชื่อมโยงคุณค่า สร้างอนาคตที่ยั่งยืน</p></div><div className="footer-links"><a href="#story">เรื่องราว</a><a href="#explore">สำรวจชุมชน</a><a href="#products">สินค้า</a><a href="#projects">โครงการ</a><a href="#learning">แหล่งเรียนรู้</a><a href="#contact">ติดต่อ</a></div><div className="footer-social"><a href="#contact" aria-label="Instagram"><Instagram/></a><a href="#contact" aria-label="Facebook"><Facebook/></a></div></div><div className="footer-bottom"><span>© 2026 NÉRA COMMUNITY CONNECT</span><span>DEMO PROJECT · ข้อมูลทั้งหมดเป็นข้อมูลสมมติ</span><a href="#top">BACK TO TOP ↑</a></div></footer>
  </div>
}

createRoot(document.getElementById('root')).render(<App/>)
