"use strict";(self.webpackChunkreact_test=self.webpackChunkreact_test||[]).push([[214],{5214:(e,t,o)=>{o.r(t),o.d(t,{default:()=>H});var i=o(2791),r=o(890),n=o(4554),a=o(6151),s=o(3239),c=o(1889),l=o(7689),d=o(7621),h=o(7462),u=o(3366),m=o(3733),p=o(4419),g=o(1402),f=o(6934),x=o(5878),Z=o(1217);function v(e){return(0,Z.Z)("MuiCardActionArea",e)}const y=(0,x.Z)("MuiCardActionArea",["root","focusVisible","focusHighlight"]);var j=o(533),C=o(184);const b=["children","className","focusVisibleClassName"],w=(0,f.ZP)(j.Z,{name:"MuiCardActionArea",slot:"Root",overridesResolver:(e,t)=>t.root})((e=>{let{theme:t}=e;return{display:"block",textAlign:"inherit",borderRadius:"inherit",width:"100%",["&:hover .".concat(y.focusHighlight)]:{opacity:(t.vars||t).palette.action.hoverOpacity,"@media (hover: none)":{opacity:0}},["&.".concat(y.focusVisible," .").concat(y.focusHighlight)]:{opacity:(t.vars||t).palette.action.focusOpacity}}})),M=(0,f.ZP)("span",{name:"MuiCardActionArea",slot:"FocusHighlight",overridesResolver:(e,t)=>t.focusHighlight})((e=>{let{theme:t}=e;return{overflow:"hidden",pointerEvents:"none",position:"absolute",top:0,right:0,bottom:0,left:0,borderRadius:"inherit",opacity:0,backgroundColor:"currentcolor",transition:t.transitions.create("opacity",{duration:t.transitions.duration.short})}})),k=i.forwardRef((function(e,t){const o=(0,g.Z)({props:e,name:"MuiCardActionArea"}),{children:i,className:r,focusVisibleClassName:n}=o,a=(0,u.Z)(o,b),s=o,c=(e=>{const{classes:t}=e;return(0,p.Z)({root:["root"],focusHighlight:["focusHighlight"]},v,t)})(s);return(0,C.jsxs)(w,(0,h.Z)({className:(0,m.Z)(c.root,r),focusVisibleClassName:(0,m.Z)(n,c.focusVisible),ref:t,ownerState:s},a,{children:[i,(0,C.jsx)(M,{className:c.focusHighlight,ownerState:s})]}))}));var A=o(2169),R=o(9504);const S=function(e){let{reflection:t}=e;const[o,a]=(0,i.useState)(!1);return(0,C.jsx)(d.Z,{elevation:3,sx:{height:"420px",display:"flex",flexDirection:"column",margin:3},children:(0,C.jsxs)(k,{style:{flex:1},children:[(0,C.jsxs)(n.Z,{sx:{height:"200px",display:"flex",alignItems:"start",justifyContent:"center",position:"relative"},children:[(0,C.jsx)(A.Z,{component:"img",alt:"Reflection Image",height:"200",image:t.image_url,title:t.title,sx:{objectFit:"contain",paddingLeft:"10px",paddingRight:"10px"},onLoad:()=>a(!0)}),!o&&(0,C.jsx)(s.Z,{size:24,sx:{position:"absolute",top:"50%",left:"50%",marginTop:"-12px",marginLeft:"-12px"}})]}),(0,C.jsx)(n.Z,{sx:{maxHeight:"200px",overflow:"auto"},children:(0,C.jsxs)(R.Z,{sx:{display:"flex",flexDirection:"column",justifyContent:"space-between",flexGrow:1},children:[(0,C.jsx)(r.Z,{gutterBottom:!0,variant:"subtitle2",children:t.title}),(0,C.jsx)(r.Z,{variant:"body2",color:"textSecondary",children:t.description})]})})]})})},H=()=>{const[e,t]=(0,i.useState)([]),[o,d]=(0,i.useState)(9),[h,u]=(0,i.useState)(!1),[m,p]=(0,i.useState)(null),g=(0,l.s0)();(0,i.useEffect)((()=>{u(!0),fetch("".concat("https://Raito.pythonanywhere.com/api/","reflection_list/")).then((e=>{if(!e.ok)throw new Error("Network response was not ok");return e.json()})).then((e=>{if(!Array.isArray(e))throw new Error("Data format mismatch");{const o=e.sort(((e,t)=>t.id-e.id));t(o)}})).catch((e=>{p(e.message)})).finally((()=>{u(!1)}))}),[]);return m?(0,C.jsx)(r.Z,{variant:"h6",color:"error",children:m}):(0,C.jsxs)(C.Fragment,{children:[(0,C.jsxs)(n.Z,{py:4,textAlign:"center",children:[(0,C.jsx)(r.Z,{variant:"h2",gutterBottom:!0,children:"Whispers of the Heart"}),(0,C.jsx)(r.Z,{variant:"h5",paragraph:!0,children:"A symphony of thoughts, dreams, and musings."}),(0,C.jsx)(a.Z,{variant:"outlined",color:"primary",onClick:()=>g("/about"),children:"Dive Into My Journey"})]}),h?(0,C.jsx)(n.Z,{sx:{display:"flex",justifyContent:"center"},children:(0,C.jsx)(s.Z,{})}):(0,C.jsx)(c.ZP,{container:!0,spacing:3,children:e.slice(0,o).map((e=>(0,C.jsx)(c.ZP,{item:!0,xs:12,sm:6,md:4,lg:4,xl:3,children:(0,C.jsx)(S,{reflection:e})},e.id)))}),!h&&o<e.length&&(0,C.jsx)(n.Z,{textAlign:"center",mt:4,children:(0,C.jsx)(a.Z,{variant:"contained",onClick:()=>{d((e=>e+9))},children:"Load More"})}),(0,C.jsxs)(n.Z,{py:5,textAlign:"center",children:[(0,C.jsx)(r.Z,{variant:"h3",gutterBottom:!0,children:"Share in the Echoes"}),(0,C.jsx)(r.Z,{variant:"h6",paragraph:!0,children:"Have stories of your own? Let's weave our tales together."}),(0,C.jsx)(a.Z,{variant:"contained",color:"primary",onClick:()=>g("/contact"),children:"Connect with Me"})]})]})}},2169:(e,t,o)=>{o.d(t,{Z:()=>Z});var i=o(3366),r=o(7462),n=o(2791),a=o(3733),s=o(4419),c=o(1402),l=o(6934),d=o(5878),h=o(1217);function u(e){return(0,h.Z)("MuiCardMedia",e)}(0,d.Z)("MuiCardMedia",["root","media","img"]);var m=o(184);const p=["children","className","component","image","src","style"],g=(0,l.ZP)("div",{name:"MuiCardMedia",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:o}=e,{isMediaComponent:i,isImageComponent:r}=o;return[t.root,i&&t.media,r&&t.img]}})((e=>{let{ownerState:t}=e;return(0,r.Z)({display:"block",backgroundSize:"cover",backgroundRepeat:"no-repeat",backgroundPosition:"center"},t.isMediaComponent&&{width:"100%"},t.isImageComponent&&{objectFit:"cover"})})),f=["video","audio","picture","iframe","img"],x=["picture","img"],Z=n.forwardRef((function(e,t){const o=(0,c.Z)({props:e,name:"MuiCardMedia"}),{children:n,className:l,component:d="div",image:h,src:Z,style:v}=o,y=(0,i.Z)(o,p),j=-1!==f.indexOf(d),C=!j&&h?(0,r.Z)({backgroundImage:'url("'.concat(h,'")')},v):v,b=(0,r.Z)({},o,{component:d,isMediaComponent:j,isImageComponent:-1!==x.indexOf(d)}),w=(e=>{const{classes:t,isMediaComponent:o,isImageComponent:i}=e,r={root:["root",o&&"media",i&&"img"]};return(0,s.Z)(r,u,t)})(b);return(0,m.jsx)(g,(0,r.Z)({className:(0,a.Z)(w.root,l),as:d,role:!j&&h?"img":void 0,ref:t,style:C,ownerState:b,src:j?h||Z:void 0},y,{children:n}))}))}}]);
//# sourceMappingURL=214.98cce4fb.chunk.js.map