import { useState } from "react";
import {
  Home,
  Palette,
  ImageIcon,
  ArrowLeft,
  MoreHorizontal,
  Search,
  Send,
  Share2,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Link as LinkIcon,
  ExternalLink,
  Check,
  X,
} from "lucide-react";

// ─── TYPES ───────────────────────────────────────────────────────────────────

type PostType = "Avancement" | "Question" | "Découverte" | "Résultat" | "Sondage";

interface Atelier { id:number; emoji:string; name:string; members:number; tags:string[]; last?:string; time?:string; unread?:number; about?:string; description?:string; }

interface Post {
  id: number;
  av: string;
  avColor: string;
  author: string;
  role: string | null;
  time: string;
  type: string;
  typeKey: string;
  title?: string;
  body: string;
  img?: string;
  replies: number;
  pinned: boolean;
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const ATELIERS: Atelier[] = [
  {
    id: 1,
    emoji: "🏺",
    name: "Céramique raku",
    members: 23,
    tags: ["Argile", "Raku", "Japonais"],
    last: "Marie D. a partagé une photo",
    time: "2 h",
    unread: 3,
    about:
      "La communauté dédiée à la céramique raku. Partagez vos réalisations, vos essais de cuisson, vos recettes d'émaux et vos ressources. Débutants et confirmés bienvenus.",
  },
  {
    id: 2,
    emoji: "📷",
    name: "Photographie argentique",
    members: 18,
    tags: ["Argentique", "Chambre noire"],
    last: "Thomas R. a posé une question",
    time: "5 h",
    unread: 1,
    about:
      "Tout sur la photographie argentique : techniques, développement, scans et partage de tirages.",
  },
  {
    id: 3,
    emoji: "📚",
    name: "Reliure d'art",
    members: 11,
    tags: ["Reliure", "Papier"],
    last: "Nouveau document partagé",
    time: "3 j",
    unread: 0,
    about:
      "Atelier consacré à la reliure artisanale et d'art. Partagez vos projets, techniques et ressources.",
  },
  {
    id: 4,
    emoji: "🧵",
    name: "Broderie contemporaine",
    members: 31,
    tags: ["Broderie", "Textile"],
    last: "Leïla K. a publié un message",
    time: "1 sem",
    unread: 0,
    about:
      "Exploration de la broderie comme médium artistique contemporain.",
  },
];

const DISCOVER: Atelier[] = [
  {
    id: 5,
    emoji: "🧴",
    name: "Poterie traditionnelle",
    members: 42,
    tags: ["Poterie", "Tour"],
    description: "Un espace pour partager essaisen poterie, techniques et inspirations autour de la poterie traditionnelle.",
  },
  {
    id: 6,
    emoji: "🎸",
    name: "Lutherie",
    members: 15,
    tags: ["Bois", "Guitare"],
   description: "Un espace pour ceux qui aiment la musique et qui ont décidé de fabriquer eux-mêmes leur propre outil d'expression !",
  },
  {
    id: 7,
    emoji: "🖨️",
    name: "Sérigraphie",
    members: 27,
    tags: ["Impression", "Encre"],
   description: "Un espace pour partager essais, techniques et inspirations autour de la poterie traditionnelle.",
  },
  {
    id: 8,
    emoji: "🔵",
    name: "Cyanotype",
    members: 19,
    tags: ["Photo", "Botanique"],
    description: "Un espace pour partager essais, techniques et inspirations autour de la poterie traditionnelle.",
  },
];

const POSTS: Post[] = [
  {
    id: 1,
    av: "MD",
    avColor: "#C6784F",
    author: "Marie D.",
    role: "Référente",
    time: "il y a 2 h",
    type: "Résultat",
    typeKey: "resultat",
    title: "Sortie de four ce matin",
    body: "Voici ma dernière pièce sortie du four ce matin. La couleur de l'émail a très bien pris — je suis contente du résultat !",
    img: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=900&auto=format&fit=crop",
    replies: 4,
    pinned: false,
  },
  {
    id: 2,
    av: "LM",
    avColor: "#78917F",
    author: "Lucie M.",
    role: null,
    time: "il y a 3 jours",
    type: "Ressource",
    typeKey: "ressource",
    title: "Guide des températures raku — mis à jour",
    body: "Le guide collaboratif a été enrichi avec 8 nouvelles contributions. Retrouvez-le dans l'onglet Ressources.",
    replies: 4,
    pinned: true,
  },
  {
    id: 3,
    av: "TR",
    avColor: "#5C7A6F",
    author: "Thomas R.",
    role: null,
    time: "il y a 5 jours",
    type: "Question",
    typeKey: "question",
    title: "Problème d'émail qui craquelle",
    body: "Mon émail blanc mat craquelle systématiquement après refroidissement. Quelqu'un a déjà eu ce problème ?",
    replies: 2,
    pinned: false,
  },
];

const POST_TYPES: PostType[] = ["Avancement", "Question", "Découverte", "Résultat", "Sondage"];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const typeClass = (t: PostType) =>
  t === "Avancement" ? "avancement"
  : t === "Question" ? "question"
  : t === "Découverte" ? "decouverte"
  : t === "Résultat" ? "resultat"
  : "sondage";

// ─── STYLES ───────────────────────────────────────────────────────────────────

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #1d1b19;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 100vh;
    padding: 20px;
    font-family: 'DM Sans', system-ui, sans-serif;
  }

  .phone {
    width: 375px;
    height: 820px;
    background: #FAF8F4;
    border-radius: 44px;
    overflow: hidden;
    color: #2C2623;
    display: flex;
    flex-direction: column;
    position: relative;
    border: 1px solid #2a2826;
  }

  .screen { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-height: 0; }

  /* STATUS */
  .status { height: 32px; padding: 10px 20px 0; display: flex; justify-content: space-between; align-items: center; font-size: 12px; font-weight: 600; flex-shrink: 0; }

  /* NAV */
  .nav { height: 74px; background: #FAF8F4; border-top: 1px solid #E6DDD2; display: grid; grid-template-columns: repeat(3, 1fr); align-items: center; flex-shrink: 0; }
  .nav-item { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; color: #8C857E; font-size: 11px; cursor: pointer; border: none; background: none; font-family: 'DM Sans', sans-serif; }
  .nav-item.active { color: #C6784F; }

  /* HEADER */
  .header { padding: 18px 22px 12px; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
  .logo { font-size: 26px; font-weight: 700; letter-spacing: -0.04em; font-family: 'Fraunces', serif; }
  .avatar { width: 36px; height: 36px; border-radius: 50%; background: #E2D1BC; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; }
  .header-right { display: flex; align-items: center; gap: 14px; }
  .icon-btn { background: transparent; border: none; color: #6F6862; cursor: pointer; display: flex; align-items: center; padding: 0; }

  /* TABS */
  .tabs { display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid #E6DDD2; flex-shrink: 0; }
  .tab { position: relative; padding: 13px 0 11px; text-align: center; font-size: 14px; font-weight: 500; color: #8B837B; cursor: pointer; border: none; background: none; font-family: 'DM Sans', sans-serif; }
  .tab.active { color: #2C2623; font-weight: 700; }
  .tab.active::after { content: ""; position: absolute; left: 30px; right: 30px; bottom: 0; height: 2px; background: #5C3F2A; }

  /* CONTENT */
  .content { flex: 1; background: #E8DED1; padding: 14px 12px 12px; overflow-y: auto; scrollbar-width: none; -ms-overflow-style: none; min-height: 0; }
  .content::-webkit-scrollbar { display: none; }
  .content-white { flex: 1; background: #FAF8F4; padding: 14px 16px; overflow-y: auto; scrollbar-width: none; min-height: 0; }
  .content-white::-webkit-scrollbar { display: none; }

  /* SEARCH */
  .search { height: 40px; border-radius: 14px; background: #FAF8F4; color: #B6ADA4; display: flex; align-items: center; gap: 8px; padding: 0 13px; margin-bottom: 14px; font-size: 13px; flex-shrink: 0; }
.search-input { border:none; outline:none; background:transparent; flex:1; font-family:'Inter', system-ui, sans-serif; font-size:13px; color:#2C2623; }
.search-input::placeholder { color:#B6ADA4; }

  /* CARDS */
  .card { background: #FAF8F4; border-radius: 18px; padding: 12px 14px; margin-bottom: 10px; cursor: pointer; }
  .card-top { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 6px; }
  .icon { width: 42px; height: 42px; border-radius: 14px; background: #F6EBDD; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
  .card-info { flex: 1; min-width: 0;  text-align: left; }
  .title-row { display: flex; justify-content: space-between; align-items: flex-start;  text-align: left; }
  .atelier-name { font-family: 'Fraunces', serif; font-size: 16px; line-height: 21px; font-weight: 500; color: #2C2623; }
  .members { text-align: left; margin-top: px; font-size: 12px; color: #7F7770; line-height: 18px; }
  .new-badge { display: inline-flex; align-items: center; border-radius: 999px; background: #7EA38A; color: #FFF; font-size: 9px; font-weight: 700; padding: 3px 8px; height: 18px; white-space: nowrap; margin-top: 4px; }
  .tags { display: flex; flex-wrap: wrap; gap: 6px; margin: 4px 0 6px; }
  .tag {
  padding: 0;
  height: auto;
  border: none;
  background: transparent;
  font-size: 10px;
  color: #8A837B;
}
  .card-footer { display: flex; justify-content: space-between; align-items: center; border-top: none; padding-top: 2px; text-align: left; }
  .last-text { font-size: 12px; color: #6F6862; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; text-align: left; }
  .time { text-align: right; font-size: 11px; color: #B4A79C; flex-shrink: 0; margin-left: 12px; }
  .discover-description { width:100%; max-width:none; margin:2px 0 0 0; padding:0; font-size:12px; line-height:17px; color:#6F6862; text-align:left; }
  .discover-description.full { margin-left:0; padding-left:0; text-align:left; }
.card > .discover-description { display:block; width:100%; max-width:100%; }
  /* FILTERS */
  .filters { display: flex; gap: 7px; overflow-x: auto; padding-bottom: 12px; margin-bottom: 4px; scrollbar-width: none; }
  .filters::-webkit-scrollbar { display: none; }
  .filter { height:28px; padding:0 12px; border-radius:999px; border:none; background:#FAF8F4; color:#7A7169; font-size:12px; font-weight:600; display:inline-flex; align-items:center; justify-content:center; }
.filter.active { background:#2C2623; color:#FFF; font-weight:600; }
  .filter-panel { background:#FAF8F4; border-radius:16px; padding:12px; margin:0 0 12px 0; display:flex; flex-direction:column; gap:10px; }
.filter-row { display:flex; flex-wrap:wrap; gap:6px; align-items:center; }
.filter-row span { width:100%; font-size:11px; font-weight:700; color:#7A7169; text-transform:uppercase; letter-spacing:.08em; }
.filter-choice { border:none; border-radius:999px; background:#EFE7DC; color:#6F6862; font-size:11px; padding:5px 9px; cursor:pointer; }

.filter-choice.active { background:#6D9577; color:#FFFFFF; font-weight:700; }
  .join-btn { display:inline-flex; align-items:center; justify-content:center; border:none; border-radius:999px; background:#6F4E37; color:#fff; font-size:11px; font-weight:700; padding:5px 10px; cursor:pointer; }

  /* TOPBAR */
  .topbar { padding: 16px 20px 12px; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
  .topbar-left { display: flex; align-items: center; gap: 10px; }
  .topbar-title { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 500; color: #2C2623; }

  /* WORKSHOP HEADER */
  .ws-header { padding: 0 20px 14px; background: #FAF8F4; flex-shrink: 0; }
  .ws-main { display: flex; gap: 12px; align-items: center; }
  .ws-icon { width: 48px; height: 48px; border-radius: 14px; background: #F6EBDD; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
  .ws-name { font-family: 'Fraunces', serif; font-size: 19px; line-height: 23px; font-weight: 500; color: #2C2623; }

  /* ABOUT */
  .about { padding: 0 20px; height: 42px; border-top: 1px solid #E6DDD2; border-bottom: 1px solid #E6DDD2; display: flex; align-items: center; justify-content: space-between; color: #7F7770; font-size: 13px; background: #FAF8F4; cursor: pointer; flex-shrink: 0; }
  .about-open { padding: 14px 20px 16px; border-top: 1px solid #E6DDD2; border-bottom: 1px solid #E6DDD2; background: #FAF8F4; flex-shrink: 0; }
  .about-title-row { display: flex; align-items: center; justify-content: space-between; color: #2C2623; font-size: 13px; font-weight: 700; margin-bottom: 8px; cursor: pointer; }
  .about-text { font-size: 13px; line-height: 19px; color: #5F5A54; }

  /* INNER TABS */
  .inner-tabs { display: grid; grid-template-columns: repeat(3, 1fr); height: 46px; background: #FAF8F4; border-bottom: 1px solid #E6DDD2; flex-shrink: 0; }
  .inner-tab { position: relative; display: flex; align-items: center; justify-content: center; font-size: 13px; color: #8B837B; font-weight: 500; cursor: pointer; border: none; background: none; font-family: 'DM Sans', sans-serif; }
  .inner-tab.active { color: #C6784F; font-weight: 700; }
  .inner-tab.active::after { content: ""; position: absolute; left: 20px; right: 20px; bottom: 0; height: 2px; background: #C6784F; }

  /* COMPOSER */
  .composer-bar { height: 40px; border-radius: 999px; background: #FAF8F4; display: flex; align-items: center; gap: 10px; padding: 0 12px; margin-bottom: 12px; color: #B6ADA4; font-size: 13px; cursor: pointer; }
  .av-small { width: 26px; height: 26px; border-radius: 50%; background: #F6EBDD; color: #C6784F; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
  .composer-open { background: #FAF8F4; border-radius: 18px; padding: 14px 16px; margin-bottom: 12px; }
  .type-row { display: flex; gap: 7px; overflow-x: auto; margin-bottom: 14px; scrollbar-width: none; }
  .type-row::-webkit-scrollbar { display: none; }
  .type-chip { border: none; border-radius: 999px; padding: 5px 10px; font-size: 10px; font-weight: 600; white-space: nowrap; cursor: pointer; font-family: 'DM Sans', sans-serif; }
  .type-chip.avancement { background: #E9E4DC; color: #6F6862; }
  .type-chip.question { background: #E6F0EA; color: #4D6A59; }
  .type-chip.decouverte { background: #E6F0EF; color: #4F6D69; }
  .type-chip.resultat { background: #F6EBDD; color: #A76437; }
  .type-chip.sondage { background: #F4E9D8; color: #8A6B3F; }
  .type-chip.active { box-shadow: inset 0 0 0 1.5px currentColor; font-weight: 700; }
  .comp-input, .comp-textarea { width: 100%; border: 1px solid #E6DDD2; background: #FDFBF8; border-radius: 12px; padding: 10px 12px; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #2C2623; outline: none; margin-bottom: 10px; }
  .comp-input { height: 42px; }
  .comp-textarea { height: 64px; resize: none; line-height: 1Fpx; }
  .comp-input::placeholder, .comp-textarea::placeholder { color: #B6ADA4; }
  .photo-line { display: flex; align-items: center; justify-content: space-between; color: #7F7770; font-size: 12px; margin-bottom: 12px; }
  .photo-btn { border: none; border-radius: 999px; background: #EFEAE3; color: #5E5750; padding: 6px 12px; font-size: 12px; font-weight: 600; font-family: 'DM Sans', sans-serif; cursor: pointer; }
  .comp-actions { display: flex; justify-content: space-between; align-items: center; }
  .cancel-btn { border: none; background: transparent; color: #7F7770; font-size: 13px; font-weight: 500; font-family: 'DM Sans', sans-serif; cursor: pointer; }
  .publish-btn { border: none; border-radius: 999px; background: #3F5248; color: #FFF; font-size: 13px; font-weight: 700; padding: 9px 16px; font-family: 'DM Sans', sans-serif; cursor: pointer; }
  .poll-opts { background: #F4EFE8; border-radius: 12px; padding: 10px; margin-bottom: 12px; }
  .poll-opt { background: #FDFBF8; border: 1px solid #E6DDD2; border-radius: 10px; padding: 8px 11px; color: #B6ADA4; font-size: 12px; margin-bottom: 7px; }
  .poll-add { color: #78917F; font-size: 12px; font-weight: 700; cursor: pointer; }

  /* POSTS */
  .post { background: #FAF8F4; border-radius: 18px; padding: 14px 16px; margin-bottom: 10px; cursor: pointer; }
  .post.pinned { border-left: 3px solid #78917F; }
  .pin-label { font-size: 11px; color: #78917F; font-weight: 700; margin-bottom: 8px; text-align: left; display:block; width:100%; }
  .post-head { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 10px; }
  .post-meta { text-align:left; }
  .av { width: 34px; height: 34px; border-radius: 50%; color: #FFF; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }
  .post-author { font-size:14px; font-weight:700; color:#2C2623; margin-bottom:0; line-height:16px; }
.post-time { font-size:12px; color:#8B837B; margin-top:-1px; line-height:13px; }
  .role { display: inline-flex; margin-left: 6px; padding: 2px 6px; border-radius: 999px; background: #EFEAE3; color: #78917F; font-size: 10px; font-weight: 700; vertical-align: middle; }
  .post-type-badge { margin-left: auto; padding: 3px 9px; border-radius: 999px; background: #F6EBDD; color: #A76437; font-size: 10px; font-weight: 700; flex-shrink: 0; }
  .post-type-badge.question { background: #E6F0EA; color: #4D6A59; }
  .post-type-badge.ressource { background: #EFEAE3; color: #5E5750; }
 .post-title { font-family:'Fraunces', serif; font-size:16px; line-height:21px; font-weight:500; color:#2C2623; margin-bottom:6px; text-align:left; }
.post-body { font-size:13px; line-height:19px; color:#4F4842; margin-bottom:10px; text-align:left; }
  .post-img { width: 100%; height: 160px; border-radius: 14px; object-fit: cover; display: block; margin-bottom: 8px; }
  .post-actions { display: flex; align-items: center; gap: 14px; color: #7F7770; font-size: 12px; }
  .post-action { display: flex; align-items: center; gap: 5px; }
  .share-ml { margin-left: auto; color: #8B837B; }

  /* SECTION */
  .sect { font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: #8A8A84; margin-bottom: 10px; font-weight: 700; text-align: left; padding-left: 4px; }

  /* RESOURCES */
  .res-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px 0; border-bottom: 1px solid #E6DDD2; cursor: pointer; }
  .res-icon { width: 34px; height: 34px; border-radius: 10px; background: #F6EBDD; color: #C6784F; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .res-title { font-size: 14px; font-weight: 600; color: #2C2623; line-height: 18px; }
  .res-meta { font-size: 12px; color: #7F7770; margin-top: 2px; }
  .gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; margin-bottom: 20px; }
  .gal-img { width: 100%; height: 80px; border-radius: 8px; object-fit: cover; display: block; cursor: pointer; }
  .section-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .section-link { font-size: 12px; color: #C6784F; font-weight: 500; cursor: pointer; border: none; background: none; font-family: 'DM Sans', sans-serif; }

  /* MEMBERS */
  .member-card { background: #FAF8F4; border-radius: 16px; padding: 12px 14px; margin-bottom: 10px; display: flex; align-items: center; gap: 12px; }
  .mem-av { width: 40px; height: 40px; border-radius: 50%; background: #F6EBDD; color: #5C3F2A; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; flex-shrink: 0; }
  .mem-av.green { background: #E5EFE8; color: #3F5248; }
  .mem-name { font-size: 14px; font-weight: 700; color: #2C2623; line-height: 18px; }
  .mem-sub { font-size: 12px; color: #7F7770; margin-top: 2px; }
  .role-badge { border-radius: 999px; border: 1px solid #DCCCB8; padding: 3px 10px; font-size: 11px; color: #7F7770; }
  .role-badge.ref { border-color: #78917F; color: #3F5248; background: #E5EFE8; font-weight: 700; }
  .more-members { text-align: center; color: #7F7770; font-size: 13px; margin-top: 16px; }

  /* THREAD */
  .comment-card { background: #FAF8F4; border-radius: 18px; padding: 14px 16px; margin-bottom: 10px; }
 .comment-head { display:flex; gap:9px; align-items:flex-start; margin-bottom:0px; }
  .c-av { width: 30px; height: 30px; border-radius: 50%; background: #F6EBDD; color: #5C3F2A; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
  .comment-name { font-size:13px; font-weight:700; color:#2C2623; }
.comment-time { font-size:11px; color:#8B837B; }
.comment-content { flex:1; text-align:left; }
.comment-text { font-size:13px; line-height:18px; color:#4E4842; margin:4px 0 0 0; text-align:left; }
.comment-actions { margin-top:7px; display:flex; align-items:center; gap:12px; font-size:12px; font-weight:600; color:#78917F; }
  .toggle-btn { border: none; background: transparent; padding: 0; color: #9A938C; font-size: 12px; font-weight: 500; display: inline-flex; align-items: center; gap: 3px; cursor: pointer; font-family: 'DM Sans', sans-serif; }
  .nested { margin-left: 14px; margin-top: 10px; padding-left: 12px; border-left: 1px solid #D8CBBE; }
  .nested .comment-text, .nested .comment-actions { margin-left:0; }
  .reply-bar { height: 64px; background: #FAF8F4; border-top: 1px solid #E6DDD2; display: flex; align-items: center; gap: 10px; padding: 0 14px; flex-shrink: 0; }
  .reply-input { flex: 1; height: 40px; border-radius: 999px; border: 1px solid #E6DDD2; background: #FDFBF8; padding: 0 14px; color: #8B837B; font-size: 13px; display: flex; align-items: center; }
  .send-btn { width: 38px; height: 38px; border-radius: 50%; border: none; background: #3F5248; color: #FFF; display: flex; align-items: center; justify-content: center; flex-shrink: 0; cursor: pointer; }
.comment-meta { display:flex; align-items:center; gap:5px; line-height:15px; margin-bottom:2px; }
.comment-dot { font-size:11px; color:#8B837B; }

  /* GALLERY */
  .masonry { column-count: 2; column-gap: 8px; }
  .m-photo { width: 100%; display: block; border-radius: 14px; margin-bottom: 8px; object-fit: cover; break-inside: avoid; cursor: pointer; }

  /* OVERLAY */
  .overlay { position: absolute; inset: 0; background: rgba(44,38,35,.5); z-index: 20; display: flex; flex-direction: column; justify-content: flex-end; border-radius: 44px; overflow: hidden; }
  .detail-sheet { background: #FAF8F4; border-radius: 28px 28px 0 0; padding: 12px 14px 18px; max-height: 88%; overflow-y: auto; scrollbar-width: none; }
  .detail-sheet::-webkit-scrollbar { display: none; }
  .close-row { display: flex; justify-content: flex-end; margin-bottom: 8px; }
  .close-btn { width: 30px; height: 30px; border-radius: 50%; border: none; background: #EFEAE3; color: #5E5750; display: flex; align-items: center; justify-content: center; cursor: pointer; }
  .detail-img { width: 100%; height: 240px; object-fit: cover; border-radius: 18px; display: block; margin-bottom: 12px; }
  .detail-title { font-family: 'Fraunces', serif; font-size: 19px; line-height: 24px; font-weight: 500; margin-bottom: 4px; }
  .detail-meta { font-size: 12px; color: #7F7770; margin-bottom: 10px; }
  .detail-text { font-size: 13px; line-height: 19px; color: #4E4842; margin-bottom: 12px; }
  .detail-actions { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #E6DDD2; }
  .reply-count { display: flex; align-items: center; gap: 5px; color: #78917F; font-size: 13px; font-weight: 700; }
  .share-btn-sm { border: none; border-radius: 999px; background: #EFEAE3; color: #5E5750; padding: 6px 12px; font-size: 12px; font-weight: 600; font-family: 'DM Sans', sans-serif; display: inline-flex; align-items: center; gap: 5px; cursor: pointer; }

  /* ADD RESOURCE */
  .add-res-content { flex: 1; background: linear-gradient(180deg, #DCCCB8 0%, #D3C1AB 100%); padding: 16px 14px 20px; overflow-y: auto; scrollbar-width: none; }
  .add-res-content::-webkit-scrollbar { display: none; }
  .form-card { background: #FAF8F4; border-radius: 20px; padding: 16px; }
  .form-intro { font-size: 13px; line-height: 19px; color: #6F6862; margin-bottom: 16px; }
  .field { margin-bottom: 16px; }
  .label { display: block; font-size: 12px; font-weight: 700; color: #2C2623; margin-bottom: 7px; }
  .select-look { height: 42px; border-radius: 12px; background: #F4EFE8; border: 1px solid #E6DDD2; display: flex; align-items: center; justify-content: space-between; padding: 0 12px; color: #2C2623; font-size: 14px; }
  .f-input, .f-textarea { width: 100%; border: 1px solid #E6DDD2; background: #FDFBF8; border-radius: 12px; padding: 10px 12px; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #2C2623; outline: none; }
  .f-input { height: 42px; }
  .f-textarea { height: 80px; resize: none; line-height: 19px; }
  .f-input::placeholder, .f-textarea::placeholder { color: #B6ADA4; }
  .helper { font-size: 11px; color: #8B837B; margin-top: 5px; line-height: 15px; }
  .announce { margin-top: 4px; border-radius: 14px; background: #F4EFE8; padding: 12px 13px; display: flex; gap: 10px; align-items: flex-start; }
  .checkbox { width: 20px; height: 20px; border-radius: 6px; background: #78917F; color: #FFF; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
  .announce-title { font-size: 13px; font-weight: 700; color: #2C2623; }
  .announce-sub { font-size: 12px; line-height: 17px; color: #6F6862; margin-top: 2px; }
  .form-actions { height: 64px; background: #FAF8F4; border-top: 1px solid #E6DDD2; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; flex-shrink: 0; }
  .cancel-lnk { border: none; background: transparent; color: #7F7770; font-size: 14px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; }
  .submit-btn { border: none; border-radius: 999px; background: #3F5248; color: #FFF; font-size: 14px; font-weight: 700; padding: 10px 18px; cursor: pointer; font-family: 'DM Sans', sans-serif; }

  @media (display-mode: standalone), (max-width: 480px) {
    body {
      align-items: stretch;
      min-height: 100dvh;
      padding: 0;
      background: #FAF8F4;
    }

    .phone {
      width: 100vw;
      height: 100dvh;
      min-height: 100vh;
      border: 0;
      border-radius: 0;
    }

    .header,
    .topbar {
      padding-top: max(18px, env(safe-area-inset-top));
    }

    .nav,
    .form-actions,
    .reply-bar {
      padding-bottom: env(safe-area-inset-bottom);
      height: calc(74px + env(safe-area-inset-bottom));
    }

    .form-actions,
    .reply-bar {
      height: calc(64px + env(safe-area-inset-bottom));
    }
  }
`;

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function NavBar({ tab, setTab }: { tab: string; setTab: (t: string) => void }) {
  return (
    <div className="nav">
      <button className={`nav-item ${tab === "feed" ? "active" : ""}`} onClick={() => setTab("feed")}>
        <Home size={22} strokeWidth={1.8} />
        <span>Fil</span>
      </button>
      <button className={`nav-item ${tab === "ateliers" ? "active" : ""}`} onClick={() => setTab("ateliers")}>
        <Palette size={22} strokeWidth={1.8} />
        <span>Ateliers</span>
      </button>
      <button className={`nav-item ${tab === "galerie" ? "active" : ""}`} onClick={() => setTab("galerie")}>
        <ImageIcon size={22} strokeWidth={1.8} />
        <span>Galerie</span>
      </button>
    </div>
  );
}

// ─── SCREEN: ATELIERS LIST ────────────────────────────────────────────────────

function AteliersList({ onOpen }: { onOpen: (a: Atelier) => void }) {
  const [tab, setTab] = useState<"mes" | "discover">("mes");
const [, setFilter] = useState("Tous");
const [showFilters, setShowFilters] = useState(false);
const [search, setSearch] = useState("");
const [activeFilterTab, setActiveFilterTab] = useState<"all" | "filters">("all");
const [activeFilters, setActiveFilters] = useState<string[]>([]);
const visibleAteliers = ATELIERS.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()));
const visibleDiscover = DISCOVER.filter((a) => (a.name.toLowerCase().includes(search.toLowerCase()) || a.tags.join(" ").toLowerCase().includes(search.toLowerCase())) && (activeFilters.length === 0 || activeFilters.some((f) => a.tags.includes(f))));
  
  return (
    <div className="screen">
            <div className="header">
        <div className="logo">MAKRZ</div>
        <div className="header-right">
          <button className="icon-btn"><Search size={20} strokeWidth={1.8} /></button>
          <div className="avatar">ML</div>
        </div>
      </div>
      <div className="tabs">
        <button className={`tab ${tab === "mes" ? "active" : ""}`} onClick={() => setTab("mes")}>Mes ateliers</button>
        <button className={`tab ${tab === "discover" ? "active" : ""}`} onClick={() => setTab("discover")}>Découvrir</button>
      </div>
      <div className="content">
        <div className="search"><Search size={14} color="#B6ADA4" /><input className="search-input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un atelier..." /></div>
        {tab === "mes" ? (
          <>
            <div className="sect">Actifs récemment</div>
            {visibleAteliers.map((a) => (
              <div className="card" key={a.id} onClick={() => onOpen(a)}>
                <div className="card-top">
                  <div className="icon">{a.emoji}</div>
                  <div className="card-info">
                    <div className="title-row">
                      <div>
                        <div className="atelier-name">{a.name}</div>
<div className="members"> {a.members} membres </div>
                      </div>
                      {(a.unread ?? 0) > 0 && (
                        <div className="new-badge">
                          {a.unread === 1 ? "1 nouveau" : `${a.unread} nouveaux`}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                               <div className="card-footer">
                  <div className="last-text">{a.last}</div>
                  <div className="time">{a.time}</div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="filters">
              <button className={`filter ${activeFilterTab === "all" ? "active" : ""}`} onClick={() => { setActiveFilterTab("all"); setShowFilters(false); setFilter("Tous"); }}>Tous</button>
              <button className={`filter ${activeFilterTab === "filters" ? "active" : ""}`} onClick={() => { setActiveFilterTab("filters"); setShowFilters(true); }}>Filtres</button></div>
           {showFilters && <div className="filter-panel"><div className="filter-row"><span>Matière</span><button className={`filter-choice ${activeFilters.includes("Bois") ? "active" : ""}`} onClick={() => setActiveFilters((fs) => fs.includes("Bois") ? fs.filter((f) => f !== "Bois") : [...fs, "Bois"])}>Bois</button><button className={`filter-choice ${activeFilters.includes("Céramique") ? "active" : ""}`} onClick={() => setActiveFilters((fs) => fs.includes("Céramique") ? fs.filter((f) => f !== "Céramique") : [...fs, "Céramique"])}>Céramique</button><button className={`filter-choice ${activeFilters.includes("Textile") ? "active" : ""}`} onClick={() => setActiveFilters((fs) => fs.includes("Textile") ? fs.filter((f) => f !== "Textile") : [...fs, "Textile"])}>Textile</button></div><div className="filter-row"><span>Technique</span><button className={`filter-choice ${activeFilters.includes("Tour") ? "active" : ""}`} onClick={() => setActiveFilters((fs) => fs.includes("Tour") ? fs.filter((f) => f !== "Tour") : [...fs, "Tour"])}>Tour</button><button className={`filter-choice ${activeFilters.includes("Sérigraphie") ? "active" : ""}`} onClick={() => setActiveFilters((fs) => fs.includes("Sérigraphie") ? fs.filter((f) => f !== "Sérigraphie") : [...fs, "Sérigraphie"])}>Sérigraphie</button><button className={`filter-choice ${activeFilters.includes("Broderie") ? "active" : ""}`} onClick={() => setActiveFilters((fs) => fs.includes("Broderie") ? fs.filter((f) => f !== "Broderie") : [...fs, "Broderie"])}>Broderie</button></div><div className="filter-row"><span>Niveau</span><button className={`filter-choice ${activeFilters.includes("Débutant") ? "active" : ""}`} onClick={() => setActiveFilters((fs) => fs.includes("Débutant") ? fs.filter((f) => f !== "Débutant") : [...fs, "Débutant"])}>Débutant</button><button className={`filter-choice ${activeFilters.includes("Confirmé") ? "active" : ""}`} onClick={() => setActiveFilters((fs) => fs.includes("Confirmé") ? fs.filter((f) => f !== "Confirmé") : [...fs, "Confirmé"])}>Confirmé</button></div></div>}
           {visibleDiscover.map((a) => (
              <div className="card" key={a.id} onClick={() => onOpen(a)}>
                <div className="card-top">
                  <div className="icon">{a.emoji}</div>
                  <div className="card-info">
                    <div className="title-row">
                      <div>
                        <div className="atelier-name">{a.name}</div>
                        <div className="members">{a.members} membres</div>
                      </div>
                                         </div>
                  </div>
                </div>
               <div className="discover-description full">{a.description}</div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// ─── SCREEN: ATELIER DETAIL ───────────────────────────────────────────────────

function AtelierDetail({
  atelier, onBack, onPost, onGalerie, onAddRes,
}: {
  atelier: Atelier;
  onBack: () => void;
  onPost: (p: Post) => void;
  onGalerie: () => void;
  onAddRes: () => void;
}) {
  const [innerTab, setInnerTab] = useState<"fil" | "res" | "mem">("fil");
  const [aboutOpen, setAboutOpen] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const [postType, setPostType] = useState<PostType>("Question");

  const galleryIds = [
    "photo-1565193566173-7a0ee3dbe261",
    "photo-1578749556568-bc2c40e68b61",
    "photo-1610701596007-11502861dcfa",
    "photo-1493106819501-66d381c466f1",
    "photo-1605721911519-3dfeb3be25e7",
    "photo-1579820010410-c10411aaaa88",
  ];

  return (
    <div className="screen">
           <div className="topbar">
             <div className="topbar-left">
          <button className="icon-btn" onClick={onBack}><ArrowLeft size={22} strokeWidth={1.8} /></button>
        </div>
        <button className="icon-btn"><MoreHorizontal size={22} strokeWidth={1.8} /></button>
      </div>

      <div className="ws-header">
        <div className="ws-main">
          <div className="ws-icon">{atelier.emoji}</div>
          <div>
            <div className="ws-name">{atelier.name}</div>
            <div className="members">{atelier.members} membres</div>
          </div>
        </div>
        <div className="tags" style={{ marginTop: 10 }}>
          {atelier.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
        </div>
      </div>

      {aboutOpen ? (
        <div className="about-open">
          <div className="about-title-row" onClick={() => setAboutOpen(false)}>
            <span>À propos de l'atelier</span><span>⌃</span>
          </div>
          <p className="about-text">{atelier.about}</p>
        </div>
      ) : (
        <div className="about" onClick={() => setAboutOpen(true)}>
          <span>À propos de l'atelier</span><span>⌄</span>
        </div>
      )}

      <div className="inner-tabs">
        <button className={`inner-tab ${innerTab === "fil" ? "active" : ""}`} onClick={() => setInnerTab("fil")}>Fil</button>
        <button className={`inner-tab ${innerTab === "res" ? "active" : ""}`} onClick={() => setInnerTab("res")}>Ressources</button>
        <button className={`inner-tab ${innerTab === "mem" ? "active" : ""}`} onClick={() => setInnerTab("mem")}>Membres</button>
      </div>

      {/* FIL */}
      {innerTab === "fil" && (
        <div className="content">
          {!composerOpen ? (
            <div className="composer-bar" onClick={() => setComposerOpen(true)}>
              <div className="av-small">V</div>
              <span>Publier dans l'atelier...</span>
            </div>
          ) : (
            <div className="composer-open">
              <div className="type-row">
                {POST_TYPES.map((t) => (
                  <button
                    key={t}
                    className={`type-chip ${typeClass(t)} ${postType === t ? "active" : ""}`}
                    onClick={() => setPostType(t)}
                  >{t}</button>
                ))}
              </div>
              <input className="comp-input" placeholder="Titre de la publication *" />
              <textarea className="comp-textarea" placeholder={
                postType === "Question" ? "Décrivez votre question ou le problème rencontré..."
                  : postType === "Découverte" ? "Partagez une technique, un outil ou une inspiration..."
                  : postType === "Résultat" ? "Présentez votre création terminée..."
                  : postType === "Sondage" ? "Présentez rapidement le sujet du sondage..."
                  : "Partagez l'évolution de votre projet..."
              } />
              <div className="photo-line">
                <button className="photo-btn">+ Photos</button>
                <span>0 / 7</span>
              </div>
              {postType === "Sondage" && (
                <div className="poll-opts">
                  <div className="poll-opt">Option 1</div>
                  <div className="poll-opt">Option 2</div>
                  <div className="poll-add">+ Ajouter un choix</div>
                </div>
              )}
              <div className="comp-actions">
                <button className="cancel-btn" onClick={() => setComposerOpen(false)}>Annuler</button>
                <button className="publish-btn" onClick={() => setComposerOpen(false)}>Publier</button>
              </div>
            </div>
          )}
          {POSTS.map((p) => (
            <div className={`post ${p.pinned ? "pinned" : ""}`} key={p.id} onClick={() => onPost(p)}>
              {p.pinned && <div className="pin-label">📌 Épinglé par la référente</div>}
              <div className="post-head">
  <div className="av" style={{ background: p.avColor }}>{p.av}</div>

  <div className="post-meta">
    <div className="post-author">{p.author}{p.role && <span className="role">{p.role}</span>}</div>
    <div className="post-time">{p.time}</div>
  </div>

  <div className={`post-type-badge ${p.typeKey}`}>{p.type}</div>
</div>
              {p.title && <div className="post-title">{p.title}</div>}
              <div className="post-body">{p.body}</div>
              {p.img && <img className="post-img" src={p.img} alt="" />}
              <div className="post-actions">
                <div className="post-action"><MessageCircle size={14} strokeWidth={1.8} /> {p.replies}</div>
                <div className="share-ml"><Share2 size={15} strokeWidth={1.8} /></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RESSOURCES */}
      {innerTab === "res" && (
        <div className="content-white">
          <div className="section-row">
            <div style={{ fontSize: 15, fontWeight: 700, color: "#2C2623" }}>Galerie de l'atelier</div>
            <button className="section-link" onClick={onGalerie}>Voir tout</button>
          </div>
          <div className="gallery-grid">
            {galleryIds.map((id, i) => (
              <img key={i} className="gal-img" onClick={onGalerie}
                src={`https://images.unsplash.com/${id}?q=80&w=400&auto=format&fit=crop`} alt="" />
            ))}
          </div>
          <div className="section-row">
            <div style={{ fontSize: 15, fontWeight: 700, color: "#2C2623" }}>Documents et liens</div>
            <button className="section-link" onClick={onAddRes}>+ Ajouter</button>
          </div>
          {[
            { icon: <FileText size={17} strokeWidth={1.8} />, title: "Introduction au raku", meta: "Marie D. · 12 jan." },
            { icon: <LinkIcon size={17} strokeWidth={1.8} />, title: "Fournisseur d'émaux — Solargil", meta: "Thomas R. · 8 jan." },
            { icon: <FileText size={17} strokeWidth={1.8} />, title: "Guide des températures raku", meta: "Lucie M. · 3 jan." },
          ].map((r, i) => (
            <div className="res-item" key={i}>
              <div className="res-icon">{r.icon}</div>
              <div style={{ flex: 1 }}>
                <div className="res-title">{r.title}</div>
                <div className="res-meta">{r.meta}</div>
              </div>
              <div style={{ color: "#B6ADA4" }}><ExternalLink size={15} strokeWidth={1.8} /></div>
            </div>
          ))}
        </div>
      )}

      {/* MEMBRES */}
      {innerTab === "mem" && (
        <div className="content">
          <div className="sect">Référente</div>
          <div className="member-card">
            <div className="mem-av green">LM</div>
            <div style={{ flex: 1 }}>
              <div className="mem-name">Lucie M.</div>
              <div className="mem-sub">Céramiste · Paris</div>
            </div>
            <div className="role-badge ref">Référente</div>
          </div>
          <div className="sect" style={{ marginTop: 16 }}>Membres actifs</div>
          {[
            { av: "MD", name: "Marie D.", sub: "Céramiste · Lille" },
            { av: "TR", name: "Théo R.", sub: "Potier · Lyon" },
            { av: "NB", name: "Nora B.", sub: "Céramiste · Bordeaux" },
            { av: "VL", name: "Victor L.", sub: "Sculpteur · Paris" },
          ].map((m) => (
            <div className="member-card" key={m.av}>
              <div className="mem-av">{m.av}</div>
              <div style={{ flex: 1 }}>
                <div className="mem-name">{m.name}</div>
                <div className="mem-sub">{m.sub}</div>
              </div>
              <div className="role-badge">Membre</div>
            </div>
          ))}
          <div className="more-members">Voir tous les {atelier.members} membres</div>
        </div>
      )}
    </div>
  );
}

// ─── SCREEN: POST DETAIL ──────────────────────────────────────────────────────

function PostDetail({ post, onBack }: { post: Post; onBack: () => void }) {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  return (
    <div className="screen">
            <div className="topbar" style={{ borderBottom: "1px solid #E6DDD2" }}>
        <div className="topbar-left">
          <button className="icon-btn" onClick={onBack}><ArrowLeft size={22} strokeWidth={1.8} /></button>
          <span className="topbar-title">Fil</span>
        </div>
      </div>
      <div className="content">
        <div className="post" style={{ cursor: "default" }}>
          <div className="post-head">
            <div className="av" style={{ background: post.avColor }}>{post.av}</div>
            <div>
              <div className="post-author">{post.author}{post.role && <span className="role">{post.role}</span>}</div>
              <div className="post-time">{post.time}</div>
            </div>
            <div className={`post-type-badge ${post.typeKey}`}>{post.type}</div>
          </div>
          {post.title && <div className="post-title">{post.title}</div>}
          <div className="post-body">{post.body}</div>
          {post.img && <img className="post-img" style={{ height: 200 }} src={post.img} alt="" />}
        </div>

        <div className="sect">{post.replies} Réponses</div>

        <div className="comment-card">
          <div className="comment-head">
            <div className="c-av">LM</div>
            <div className="comment-content">
              <div className="comment-meta">
                <span className="comment-name">Lucie M.</span>
                <span className="comment-dot">·</span>
                <span className="comment-time">il y a 1 h</span></div>
              <div className="comment-text">Magnifique résultat !</div>
              <div className="comment-actions"><span>Répondre</span>
                <button className="toggle-btn" onClick={() => setOpen1(!open1)}>{open1 ? <><span>Masquer</span><ChevronUp size={13} /></> : <><span>Voir 1 réponse</span><ChevronDown size={13} /></>}</button>
              </div>
            </div>
          </div>
         {open1 && (
  <div className="nested">
    <div className="comment-head">
      <div className="c-av">TR</div>

      <div className="comment-content">
        <div className="comment-meta">
          <span className="comment-name">Théo R.</span>
          <span className="comment-dot">·</span>
          <span className="comment-time">il y a 45 min</span>
        </div>

        <div className="comment-text">
          La texture est superbe.
        </div>

        <div className="comment-actions">
          <span>Répondre</span>
        </div>
      </div>

    </div>
  </div>
)}
        </div>

        <div className="comment-card">
          <div className="comment-head">
            <div className="c-av">TR</div>
            <div className="comment-meta"><span className="comment-name">Thomas R.</span><span className="comment-dot">·</span><span className="comment-time">il y a 30 min</span></div>
            </div>
          <div className="comment-text">Tu as utilisé quel émail ?</div>
          <div className="comment-actions">
            <span>Répondre</span>
            <button className="toggle-btn" onClick={() => setOpen2(!open2)}>
              {open2 ? <><span>Masquer</span><ChevronUp size={13} /></> : <><span>Voir 1 réponse</span><ChevronDown size={13} /></>}
            </button>
          </div>
          {open2 && (
            <div className="nested">
              <div className="comment-head"><div className="c-av">MD</div>
                <div>
                  <div className="comment-meta"><span className="comment-name">Marie D.</span><span className="comment-dot">·</span><span className="comment-time">il y a 20 min</span></div>          
                </div>
              </div>
              <div className="comment-text">Émail blanc mat Solargil.</div>
              <div className="comment-actions"><span>Répondre</span></div>
            </div>
          )}
        </div>
      </div>
      <div className="reply-bar">
        <div className="reply-input">Répondre à la publication...</div>
        <button className="send-btn"><Send size={17} strokeWidth={2} /></button>
      </div>
    </div>
  );
}

// ─── SCREEN: GALERIE ──────────────────────────────────────────────────────────

function GalerieAtelier({ atelier, onBack }: { atelier: Atelier | null; onBack: () => void }) {
  const [filter, setFilter] = useState("Toutes");
  const [openPhoto, setOpenPhoto] = useState(false);
  const [openReplies, setOpenReplies] = useState(false);

  const photos = [
    { src: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=700&auto=format&fit=crop", h: 230 },
    { src: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=700&auto=format&fit=crop", h: 170 },
    { src: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=700&auto=format&fit=crop", h: 170 },
    { src: "https://images.unsplash.com/photo-1493106819501-66d381c466f1?q=80&w=700&auto=format&fit=crop", h: 230 },
    { src: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?q=80&w=700&auto=format&fit=crop", h: 130 },
    { src: "https://images.unsplash.com/photo-1579820010410-c10411aaaa88?q=80&w=700&auto=format&fit=crop", h: 130 },
  ];

  return (
    <div className="screen" style={{ position: "relative" }}>
            <div className="topbar" style={{ borderBottom: "1px solid #E6DDD2" }}>
        <div className="topbar-left">
          <button className="icon-btn" onClick={onBack}><ArrowLeft size={22} strokeWidth={1.8} /></button>
          <span className="topbar-title">Galerie · {atelier?.name ?? "MAKRZ"}</span>
        </div>
      </div>
      <div className="content">
        <div className="filters" style={{ marginBottom: 10 }}>
          {["Toutes", "Résultats", "Avancement", "Techniques"].map((f) => (
            <button key={f} className={`filter ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        <div className="masonry">
          {photos.map((p, i) => (
            <img key={i} className="m-photo" style={{ height: p.h }} src={p.src} alt="" onClick={() => setOpenPhoto(true)} />
          ))}
        </div>
      </div>

      {openPhoto && (
        <div className="overlay">
          <div className="detail-sheet">
            <div className="close-row">
              <button className="close-btn" onClick={() => setOpenPhoto(false)}><X size={16} strokeWidth={2} /></button>
            </div>
            <img className="detail-img"
              src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=900&auto=format&fit=crop" alt="" />
            <div className="detail-title">Sortie de four ce matin</div>
            <div className="detail-meta">Marie D. · Céramique raku · il y a 2 h</div>
            <div className="detail-text">Voici ma dernière pièce sortie du four ce matin. La couleur de l'émail a très bien pris — je suis contente du résultat !</div>
            <div className="detail-actions">
              <div className="reply-count"><MessageCircle size={15} strokeWidth={1.8} /> 4</div>
              <button className="share-btn-sm"><Share2 size={14} strokeWidth={1.8} /> Partager</button>
            </div>
            <div className="comment-head" style={{ marginTop: 8 }}>
              <div className="c-av">LM</div>
              <div><div className="comment-name">Lucie M.</div><div className="comment-time">il y a 1 h</div></div>
            </div>
            <div className="comment-text">Magnifique résultat !</div>
            <div className="comment-actions">
              <span>Répondre</span>
              <button className="toggle-btn" onClick={() => setOpenReplies(!openReplies)}>
                {openReplies ? <><span>Masquer</span><ChevronUp size={13} /></> : <><span>Voir 1 réponse</span><ChevronDown size={13} /></>}
              </button>
            </div>
            {openReplies && (
              <div className="nested">
                <div className="comment-head"><div className="c-av">TR</div><div><div className="comment-name">Théo R.</div><div className="comment-time">il y a 45 min</div></div></div>
                <div className="comment-text">La texture est superbe.</div>
                <div className="comment-actions"><span>Répondre</span></div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SCREEN: ADD RESOURCE ─────────────────────────────────────────────────────

function AddResource({ atelier, onBack }: { atelier: Atelier | null; onBack: () => void }) {
  return (
    <div className="screen">
       <div className="topbar" style={{ borderBottom: "1px solid #E6DDD2" }}>
        <div className="topbar-left">
          <button className="icon-btn" onClick={onBack}><ArrowLeft size={22} strokeWidth={1.8} /></button>
          <span className="topbar-title">Nouvelle ressource</span>
        </div>
      </div>
      <div className="add-res-content">
        <div className="form-card">
          <div className="form-intro">
            Ajoutez un document, un lien ou une référence utile à l'atelier {atelier?.name ?? "Céramique raku"}.
          </div>
          <div className="field">
            <label className="label">Type de ressource</label>
            <div className="select-look">
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <LinkIcon size={16} strokeWidth={1.8} color="#C6784F" /> Lien
              </span>
              <ChevronDown size={17} strokeWidth={1.8} />
            </div>
          </div>
          <div className="field">
            <label className="label">Titre</label>
            <input className="f-input" placeholder="Ex. Fournisseur d'émaux — Solargil" />
          </div>
          <div className="field">
            <label className="label">Description</label>
            <textarea className="f-textarea" placeholder="Pourquoi cette ressource est utile pour l'atelier ?" />
          </div>
          <div className="field">
            <label className="label">Lien ou fichier</label>
            <input className="f-input" placeholder="Coller un lien ou ajouter un fichier" />
            <div className="helper">PDF, article, vidéo, fournisseur, événement ou fiche technique.</div>
          </div>
          <div className="announce">
            <div className="checkbox"><Check size={13} strokeWidth={2.5} /></div>
            <div>
              <div className="announce-title">Annoncer dans le fil de l'atelier</div>
              <div className="announce-sub">Une publication sera créée automatiquement pour prévenir les membres.</div>
            </div>
          </div>
        </div>
      </div>
      <div className="form-actions">
        <button className="cancel-lnk" onClick={onBack}>Annuler</button>
        <button className="submit-btn" onClick={onBack}>Ajouter</button>
      </div>
    </div>
  );
}

// ─── SCREEN: FEED GLOBAL ──────────────────────────────────────────────────────

function FeedScreen() {
  return (
    <div className="screen">
          <div className="header">
        <div className="logo">MAKRZ</div>
        <div className="header-right">
          <button className="icon-btn"><Search size={20} strokeWidth={1.8} /></button>
          <div className="avatar">ML</div>
        </div>
      </div>
      <div className="content">
        <div className="sect">Fil global</div>
        {POSTS.map((p) => (
          <div className="post" key={p.id} style={{ cursor: "default" }}>
            <div className="post-head">
              <div className="av" style={{ background: p.avColor }}>{p.av}</div>
              <div>
                <div className="post-author">{p.author}{p.role && <span className="role">{p.role}</span>}</div>
                <div className="post-time">{p.time} · Céramique raku</div>
              </div>
              <div className={`post-type-badge ${p.typeKey}`}>{p.type}</div>
            </div>
            {p.title && <div className="post-title">{p.title}</div>}
            <div className="post-body">{p.body}</div>
            {p.img && <img className="post-img" src={p.img} alt="" />}
            <div className="post-actions">
              <div className="post-action"><MessageCircle size={14} strokeWidth={1.8} /> {p.replies}</div>
              <div className="share-ml"><Share2 size={15} strokeWidth={1.8} /></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────

type ScreenKey = "atelier" | "post" | "galerie" | "addres" | null;

export default function App() {
  const [navTab, setNavTab] = useState("ateliers");
  const [screen, setScreen] = useState<ScreenKey>(null);
  const [selectedAtelier, setSelectedAtelier] = useState<Atelier | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const handleNavTab = (t: string) => {
    setScreen(null);
    setNavTab(t);
  };

  const showNav = screen === null || screen === "atelier";

  const renderScreen = () => {
    if (screen === "atelier" && selectedAtelier) {
      return (
        <AtelierDetail
          atelier={selectedAtelier}
          onBack={() => setScreen(null)}
          onPost={(p) => { setSelectedPost(p); setScreen("post"); }}
          onGalerie={() => setScreen("galerie")}
          onAddRes={() => setScreen("addres")}
        />
      );
    }
    if (screen === "post" && selectedPost) {
      return <PostDetail post={selectedPost} onBack={() => setScreen("atelier")} />;
    }
    if (screen === "galerie") {
      return <GalerieAtelier atelier={selectedAtelier} onBack={() => setScreen("atelier")} />;
    }
    if (screen === "addres") {
      return <AddResource atelier={selectedAtelier} onBack={() => setScreen("atelier")} />;
    }
    if (navTab === "feed") return <FeedScreen />;
    if (navTab === "galerie") return <GalerieAtelier atelier={null} onBack={() => handleNavTab("ateliers")} />;
    return (
      <AteliersList onOpen={(a) => { setSelectedAtelier(a); setScreen("atelier"); }} />
    );
  };

  return (
    <>
      <style>{css}</style>
      <div className="phone">
        {renderScreen()}
        {showNav && <NavBar tab={navTab} setTab={handleNavTab} />}
      </div>
    </>
  );
}
