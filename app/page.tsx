'use client';

import { type CSSProperties, FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type Category = 'Šampūnai' | 'Kondicionieriai' | 'Aliejukai' | 'Priedai' | 'Rinkiniai';
type Shape = 'pump' | 'tube' | 'dropper' | 'jar' | 'brush' | 'set';

type Product = {
  id: number;
  name: string;
  category: Category;
  note: string;
  price: number;
  shape: Shape;
  tone: 'bronze' | 'sand' | 'olive' | 'smoke' | 'amber';
  image?: string;
  variants?: string[];
};

const categories: { name: Category; index: string; shape: Shape; note: string }[] = [
  { name: 'Šampūnai', index: '01', shape: 'pump', note: 'Švelniam, tikslingam valymui' },
  { name: 'Kondicionieriai', index: '02', shape: 'tube', note: 'Glotnumui ir elastingumui' },
  { name: 'Aliejukai', index: '03', shape: 'dropper', note: 'Žvilgesiui be apsunkinimo' },
  { name: 'Priedai', index: '04', shape: 'brush', note: 'Kasdienio ritualo detalės' },
  { name: 'Rinkiniai', index: '05', shape: 'set', note: 'Suderinta priežiūra ir dovanos' },
];

const searchShelves: { category: Category; label: string; number: string }[] = [
  { category: 'Šampūnai', label: 'Šampūnai', number: '01' },
  { category: 'Kondicionieriai', label: 'Kondicionieriai', number: '02' },
  { category: 'Aliejukai', label: 'Aliejukai', number: '03' },
  { category: 'Priedai', label: 'Priedai', number: '04' },
];

const products: Product[] = [
  { id: 1, name: 'Keune Style Refresh', category: 'Šampūnai', note: 'Sausas šampūnas · 200 ml', price: 24, shape: 'pump', tone: 'smoke', image: '/keune-style-refresh-dry-shampoo-cutout.webp', variants: ['200 ml'] },
  { id: 2, name: 'milk_shake Colour Care', category: 'Šampūnai', note: 'Spalvą tausojantis šampūnas · 300 ml', price: 23, shape: 'pump', tone: 'amber', image: '/milk-shake-colour-care-shampoo-cutout.webp', variants: ['300 ml'] },
  { id: 3, name: 'Smooth Veil', category: 'Kondicionieriai', note: 'Glotninantis kondicionierius · 200 ml', price: 28, shape: 'tube', tone: 'sand' },
  { id: 4, name: 'Repair Crème', category: 'Kondicionieriai', note: 'Atkuriamoji kaukė · 180 ml', price: 32, shape: 'jar', tone: 'bronze' },
  { id: 5, name: 'No. 03', category: 'Aliejukai', note: 'Lengvas plaukų aliejus · 50 ml', price: 34, shape: 'dropper', tone: 'amber' },
  { id: 6, name: 'Glow Drops', category: 'Aliejukai', note: 'Žvilgesio serumas · 30 ml', price: 31, shape: 'dropper', tone: 'olive' },
  { id: 7, name: 'Scalp Ritual', category: 'Priedai', note: 'Galvos odos masažuoklis', price: 18, shape: 'brush', tone: 'sand' },
  { id: 8, name: 'Silk Loop', category: 'Priedai', note: 'Šilkinė plaukų gumytė', price: 12, shape: 'jar', tone: 'smoke' },
  { id: 9, name: 'Daily Ritual', category: 'Rinkiniai', note: 'Šampūnas, kondicionierius, aliejus', price: 68, shape: 'set', tone: 'bronze' },
  { id: 10, name: 'Restore Duo', category: 'Rinkiniai', note: 'Atkuriamasis šampūnas ir kaukė', price: 54, shape: 'set', tone: 'olive' },
  { id: 11, name: 'milk_shake Integrity', category: 'Šampūnai', note: 'Maitinamasis šampūnas · 1000 ml', price: 39, shape: 'pump', tone: 'sand', image: '/milk-shake-integrity-shampoo-cutout.webp', variants: ['1000 ml'] },
  { id: 12, name: 'Hydrate Melt', category: 'Kondicionieriai', note: 'Intensyviai drėkinantis · 200 ml', price: 30, shape: 'tube', tone: 'olive' },
  { id: 13, name: 'Satin Mist', category: 'Aliejukai', note: 'Lengva apsauginė dulksna · 50 ml', price: 33, shape: 'dropper', tone: 'smoke' },
  { id: 14, name: 'Wide Tooth', category: 'Priedai', note: 'Plačių dantukų ritualo šukos', price: 16, shape: 'brush', tone: 'bronze' },
  { id: 15, name: 'Night Repair', category: 'Rinkiniai', note: 'Naktinis atkuriamasis trejetas', price: 72, shape: 'set', tone: 'smoke' },
  { id: 16, name: 'Kérastase Chronologiste', category: 'Šampūnai', note: 'Atgaivinantis šampūnas · 500 ml', price: 46, shape: 'pump', tone: 'smoke', image: '/kerastase-chronologiste-shampoo-cutout.webp', variants: ['500 ml'] },
  { id: 17, name: 'Kérastase Discipline', category: 'Šampūnai', note: 'Glotninantis šampūnas · 250 ml', price: 34, shape: 'tube', tone: 'bronze', image: '/kerastase-discipline-shampoo-cutout.webp', variants: ['250 ml'] },
  { id: 18, name: 'Schwarzkopf Fibre Clinix Fortify', category: 'Šampūnai', note: 'Pažeistiems plaukams · 300 ml', price: 29, shape: 'pump', tone: 'bronze', image: '/schwarzkopf-fibre-clinix-shampoo-cutout.webp', variants: ['300 ml'] },
  { id: 19, name: 'Olaplex No.4P Blonde Enhancer', category: 'Šampūnai', note: 'Tonuojantis šampūnas šviesiems plaukams · 250 ml', price: 32, shape: 'pump', tone: 'smoke', image: '/olaplex-no4p-shampoo-cutout.webp', variants: ['250 ml'] },
  { id: 20, name: 'Wella Ultimate Smooth', category: 'Šampūnai', note: 'Glotninantis ir maitinantis šampūnas · 250 ml', price: 28, shape: 'pump', tone: 'amber', image: '/wella-ultimate-smooth-shampoo-cutout.webp', variants: ['250 ml'] },
  { id: 21, name: 'Kevin.Murphy Plumping.Wash', category: 'Šampūnai', note: 'Tankinantis šampūnas ploniems plaukams · 250 ml', price: 35, shape: 'tube', tone: 'sand', image: '/kevin-murphy-plumping-wash-cutout.webp', variants: ['250 ml'] },
];

const money = new Intl.NumberFormat('lt-LT', { style: 'currency', currency: 'EUR' });

const productStories: Record<number, { description: string; benefits: [string, string, string] }> = {
  1: { description: 'Lengva sauso šampūno dulksna sugeria riebalų perteklių, atgaivina šaknis ir suteikia plaukams natūralios apimties tarp plovimų.', benefits: ['Greitai atgaivina', 'Suteikia apimties', 'Nepalieka sunkumo'] },
  2: { description: 'Švelni drėkinamoji formulė padeda apsaugoti dažytų plaukų spalvą, išlaikyti jos sodrumą ir sustiprinti natūralų žvilgesį.', benefits: ['Drėkinanti formulė', 'Saugo plaukų spalvą', 'Sustiprina žvilgesį'] },
  11: { description: 'Maitinamasis šampūnas sukuria švelnią, sodrią putą ir padeda sausiems ar pažeistiems plaukams susigrąžinti minkštumą bei elastingumą.', benefits: ['Intensyviai maitina', 'Atkuria minkštumą', 'Tinka visų tipų plaukams'] },
  16: { description: 'Prabangi atgaivinanti formulė valo galvos odą ir plaukus, suteikia glotnumo bei padeda išlaikyti gyvybingą, jaunatvišką išvaizdą.', benefits: ['Atgaivina plaukus', 'Suteikia glotnumo', 'Puoselėja galvos odą'] },
  17: { description: 'Glotninantis šampūnas drausmina nepaklusnius plaukus, mažina pūtimąsi ir padeda išlaikyti lengvą, natūralų plaukų judėjimą.', benefits: ['Mažina pūtimąsi', 'Lengvina formavimą', 'Išlaiko plaukų judėjimą'] },
  18: { description: 'Atkuriamoji formulė skirta pažeistiems plaukams: švelniai valo, padeda stiprinti plauko struktūrą ir saugo nuo lūžinėjimo.', benefits: ['Stiprina struktūrą', 'Mažina lūžinėjimą', 'Skirta pažeistiems plaukams'] },
  19: { description: 'Violetinių pigmentų šampūnas neutralizuoja nepageidaujamus gelsvus tonus, drėkina ir padeda išlaikyti šviesių plaukų skaidrumą.', benefits: ['Neutralizuoja geltonumą', 'Drėkina šviesius plaukus', 'Palaiko šaltą atspalvį'] },
  20: { description: 'Švelniai valanti formulė su skvalanu ir omega-9 maitina sausus, besipučiančius plaukus ir suteikia jiems glotnaus žvilgesio.', benefits: ['Glotnina plaukus', 'Maitina ir minkština', 'Suteikia žvilgesio'] },
  21: { description: 'Tankinantis šampūnas švelniai valo plonus plaukus, suteikia jiems vizualaus pilnumo ir padeda išlaikyti lengvą apimtį.', benefits: ['Suteikia pilnumo', 'Pakelia nuo šaknų', 'Neapsunkina plaukų'] },
};

function productStory(product: Product) {
  return productStories[product.id] ?? {
    description: `Profesionali ${product.category.toLocaleLowerCase('lt')} formulė kasdieniam plaukų priežiūros ritualui. Padeda išlaikyti plaukus minkštus, žvilgančius ir lengvai valdomus.`,
    benefits: ['Profesionaliai atrinkta', 'Patogu naudoti kasdien', 'Lengvas, neapsunkinantis rezultatas'] as [string, string, string],
  };
}

function ProductArt({ shape, tone, image, priority = false }: { shape: Shape; tone: Product['tone']; image?: string; priority?: boolean }) {
  return (
    <div className={`product-art shape-${shape} tone-${tone}${image ? ' has-photo' : ''}`} aria-hidden="true">
      {/* Transparent product cutouts must be served directly; the hosted image optimizer changes their layering. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {image ? <img src={image} alt="" draggable="false" loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async" /> : <><span className="product-shadow" /><span className="product-form"><i className="product-cap" /><b>S</b></span></>}
    </div>
  );
}

export default function Home() {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'phone'>('desktop');
  const [searchOpen, setSearchOpen] = useState(false);
  const [navPanel, setNavPanel] = useState<'collection' | 'contact' | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState<Record<number, number>>({});
  const [notice, setNotice] = useState('');
  const [messageSent, setMessageSent] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [previewQuantity, setPreviewQuantity] = useState(1);
  const [previewVariant, setPreviewVariant] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [viewerCategory, setViewerCategory] = useState<Category | null>(null);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [viewerMotion, setViewerMotion] = useState<'idle' | 'moving'>('idle');
  const [viewerDirection, setViewerDirection] = useState<1 | -1>(1);
  const [openingProductId, setOpeningProductId] = useState<number | null>(null);
  const [openingProductOffset, setOpeningProductOffset] = useState(0);
  const [viewerOpeningMode, setViewerOpeningMode] = useState<'phone' | 'desktop' | null>(null);
  const [productOpenedFromViewer, setProductOpenedFromViewer] = useState(false);
  const [productOpenedFromDesktopViewer, setProductOpenedFromDesktopViewer] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const dragRef = useRef<{ pointerId: number; x: number } | null>(null);
  const viewerDragRef = useRef<{ pointerId: number; x: number; y: number } | null>(null);
  const viewerSuppressClickRef = useRef(false);
  const viewerWheelLockRef = useRef(0);
  const viewerMotionLockRef = useRef(false);
  const viewerMotionTimersRef = useRef<number[]>([]);
  const viewerProductTimerRef = useRef<number | null>(null);
  const viewerClickTimerRef = useRef<number | null>(null);
  const noticeTimerRef = useRef<number | null>(null);
  const preloadedProductImagesRef = useRef<HTMLImageElement[]>([]);

  const clearViewerTimers = useCallback(() => {
    viewerMotionTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    viewerMotionTimersRef.current = [];
    if (viewerProductTimerRef.current !== null) window.clearTimeout(viewerProductTimerRef.current);
    viewerProductTimerRef.current = null;
  }, []);

  const resetViewerMotion = useCallback(() => {
    clearViewerTimers();
    viewerMotionLockRef.current = false;
    setViewerMotion('idle');
    setOpeningProductId(null);
    setOpeningProductOffset(0);
    setViewerOpeningMode(null);
  }, [clearViewerTimers]);

  const closeCategoryViewer = useCallback(() => {
    resetViewerMotion();
    setViewerCategory(null);
  }, [resetViewerMotion]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setPortalReady(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      preloadedProductImagesRef.current = products.flatMap((product) => {
        if (!product.image) return [];
        const image = new Image();
        image.decoding = 'async';
        image.src = product.image;
        return [image];
      });
    }, 450);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('phone-preview-active', previewMode === 'phone');
    return () => document.body.classList.remove('phone-preview-active');
  }, [previewMode]);

  useEffect(() => {
    function closeDialogs(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      setSelectedProduct(null);
      setSearchOpen(false);
      setNavPanel(null);
      setCartOpen(false);
      setMenuOpen(false);
      closeCategoryViewer();
    }
    document.addEventListener('keydown', closeDialogs);
    return () => document.removeEventListener('keydown', closeDialogs);
  }, [closeCategoryViewer]);

  useEffect(() => () => {
    clearViewerTimers();
    if (viewerClickTimerRef.current !== null) window.clearTimeout(viewerClickTimerRef.current);
    if (noticeTimerRef.current !== null) window.clearTimeout(noticeTimerRef.current);
  }, [clearViewerTimers]);

  const searchResults = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('lt');
    return products.filter((product) => product.category !== 'Rinkiniai' && (!normalized || `${product.name} ${product.category} ${product.note}`.toLocaleLowerCase('lt').includes(normalized)));
  }, [query]);

  const viewerProducts = useMemo(
    () => viewerCategory ? products.filter((product) => product.category === viewerCategory) : [],
    [viewerCategory],
  );
  const activeViewerProduct = viewerProducts[viewerIndex] || null;

  const cartItems = products.filter((product) => cart[product.id]);
  const cartCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const cartTotal = cartItems.reduce((sum, product) => sum + product.price * cart[product.id], 0);
  const previewVariants = selectedProduct?.category === 'Šampūnai'
    ? ['250 ml', '500 ml', '1000 ml']
    : selectedProduct?.variants ?? (selectedProduct?.category === 'Priedai'
      ? ['1 vnt.']
      : selectedProduct?.category === 'Rinkiniai'
        ? ['Standartinis', 'Dovaninis']
        : ['250 ml', '500 ml']);
  const shampooSizePremiums = [0, 18, 42];
  const previewPrice = selectedProduct
    ? selectedProduct.price + (selectedProduct.category === 'Šampūnai' ? shampooSizePremiums[previewVariant] ?? 0 : previewVariant > 0 ? 18 : 0)
    : 0;
  const previewBottleScale = selectedProduct?.category === 'Šampūnai'
    ? [0.82, 1, 1.18][previewVariant] ?? 1
    : [0.9, 1.07][previewVariant] ?? 1;

  function addToCart(product: Product, quantity = 1) {
    setCart((current) => ({ ...current, [product.id]: (current[product.id] || 0) + quantity }));
    setNotice(`${product.name} pridėta į krepšelį`);
    if (noticeTimerRef.current !== null) window.clearTimeout(noticeTimerRef.current);
    noticeTimerRef.current = window.setTimeout(() => {
      setNotice('');
      noticeTimerRef.current = null;
    }, 2200);
  }

  function openProduct(product: Product, fromCategoryViewer = false, fromDesktopViewer = false) {
    setProductOpenedFromViewer(fromCategoryViewer);
    setProductOpenedFromDesktopViewer(fromDesktopViewer);
    setSelectedProduct(product);
    setPreviewQuantity(1);
    setPreviewVariant(0);
    setRotation(0);
  }

  function moveProduct(direction: number) {
    if (!selectedProduct) return;
    const currentIndex = products.findIndex((product) => product.id === selectedProduct.id);
    openProduct(products[(currentIndex + direction + products.length) % products.length], productOpenedFromViewer, productOpenedFromDesktopViewer);
  }

  function changeQuantity(id: number, change: number) {
    setCart((current) => {
      const next = Math.max(0, (current[id] || 0) + change);
      const updated = { ...current, [id]: next };
      if (!next) delete updated[id];
      return updated;
    });
  }

  function openCategoryViewer(category: Category) {
    resetViewerMotion();
    setSelectedProduct(null);
    setSearchOpen(false);
    setNavPanel(null);
    setCartOpen(false);
    setMenuOpen(false);
    setViewerIndex(0);
    setViewerCategory(category);
  }

  function cycleCategoryViewer(direction: number) {
    if (!viewerProducts.length || viewerMotionLockRef.current) return;
    const normalizedDirection: 1 | -1 = direction >= 0 ? 1 : -1;
    const phoneLayout = previewMode === 'phone' || window.matchMedia('(max-width: 760px)').matches;
    if (!phoneLayout) {
      setViewerIndex((current) => (current + normalizedDirection + viewerProducts.length) % viewerProducts.length);
      return;
    }

    viewerMotionLockRef.current = true;
    setViewerDirection(normalizedDirection);
    setViewerMotion('moving');
    const moveTimer = window.setTimeout(() => {
      setViewerIndex((current) => (current + normalizedDirection + viewerProducts.length) % viewerProducts.length);
      setViewerMotion('idle');
      viewerMotionLockRef.current = false;
      viewerMotionTimersRef.current = [];
    }, 520);
    viewerMotionTimersRef.current = [moveTimer];
  }

  function openViewerProduct(product: Product, offset: number) {
    if (viewerMotionLockRef.current || openingProductId !== null) return;
    const phoneLayout = previewMode === 'phone' || window.matchMedia('(max-width: 760px)').matches;
    viewerMotionLockRef.current = true;
    setOpeningProductId(product.id);
    setOpeningProductOffset(offset);
    setViewerOpeningMode(phoneLayout ? 'phone' : 'desktop');
    viewerProductTimerRef.current = window.setTimeout(() => {
      closeCategoryViewer();
      openProduct(product, phoneLayout, !phoneLayout);
    }, phoneLayout ? 760 : 880);
  }

  function viewerOffset(index: number) {
    if (!viewerProducts.length) return 0;
    let offset = index - viewerIndex;
    if (offset > viewerProducts.length / 2) offset -= viewerProducts.length;
    if (offset < -viewerProducts.length / 2) offset += viewerProducts.length;
    return offset;
  }

  function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessageSent(true);
  }

  function showHome() {
    closeCategoryViewer();
    setSelectedProduct(null);
    setSearchOpen(false);
    setNavPanel(null);
    setCartOpen(false);
    setMenuOpen(false);
  }

  function showSearch() {
    closeCategoryViewer();
    setSelectedProduct(null);
    setNavPanel(null);
    setCartOpen(false);
    setMenuOpen(false);
    setSearchOpen(true);
  }

  function showPanel(panel: 'collection' | 'contact') {
    closeCategoryViewer();
    setSelectedProduct(null);
    setSearchOpen(false);
    setCartOpen(false);
    setMenuOpen(false);
    setNavPanel(panel);
  }

  function showCart() {
    closeCategoryViewer();
    setSelectedProduct(null);
    setSearchOpen(false);
    setNavPanel(null);
    setMenuOpen(false);
    setCartOpen(true);
  }

  return (
    <>
      <div className="preview-switcher" role="group" aria-label="Svetainės peržiūros dydis">
        <span>Peržiūra</span>
        <button type="button" className={previewMode === 'desktop' ? 'selected' : ''} aria-pressed={previewMode === 'desktop'} onClick={() => setPreviewMode('desktop')}>
          <i className="desktop-preview-icon" aria-hidden="true" /> PC
        </button>
        <button type="button" className={previewMode === 'phone' ? 'selected' : ''} aria-pressed={previewMode === 'phone'} onClick={() => setPreviewMode('phone')}>
          <i className="phone-preview-icon" aria-hidden="true" /> Telefonas
        </button>
      </div>
      <main className={`site-canvas${previewMode === 'phone' ? ' is-phone-preview' : ''}`}>
      <section className="hero" id="namai">
        <header className="site-header">
          <button className="wordmark wordmark-button" type="button" onClick={showHome} aria-label="Sfinksas – pradžia">SFINKSAS</button>
          <nav className="desktop-nav" aria-label="Pagrindinis meniu">
            <button type="button" onClick={showHome}>Namai</button>
            <button type="button" className={searchOpen ? 'active' : ''} onClick={showSearch}>Paieška</button>
            <button type="button" className={navPanel === 'collection' ? 'active' : ''} onClick={() => showPanel('collection')}>Kolekcija</button>
            <button type="button" className={navPanel === 'contact' ? 'active' : ''} onClick={() => showPanel('contact')}>Kontaktai</button>
          </nav>
          <div className="header-actions">
            <button className="cart-button" type="button" onClick={showCart} aria-label={`Atverti krepšelį, prekių: ${cartCount}`}>
              <span>Krepšelis</span><span className="cart-count">({cartCount})</span><span className="bag-icon" aria-hidden="true" />
            </button>
            <button className="menu-button" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Uždaryti meniu' : 'Atverti meniu'}><span /><span /></button>
          </div>
        </header>

        <div className="hero-shade" />
        <div className="hero-content">
          <p className="eyebrow"><span /> Atrinkta plaukų priežiūra</p>
          <h1>Grožio ritualas,<br /><em>sukurtas jums.</em></h1>
          <p className="hero-copy">Profesionalios priemonės plaukų stiprumui, žvilgesiui ir kasdieniam ritualui. Atrinkta tai, kas iš tiesų veikia.</p>
          <div className="hero-collections" aria-label="Produktų kategorijos">
            {categories.map((category) => (
              <button type="button" key={category.name} onClick={() => openCategoryViewer(category.name)} aria-label={`Atidaryti kategoriją ${category.name}`}>
                <span className="hero-category-number">{category.index}</span>
                <i className="hero-category-art" data-shape={category.shape} aria-hidden="true" />
                <strong>{category.name}</strong>
                <span className="hero-category-arrow" aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {portalReady && viewerCategory && activeViewerProduct && createPortal(
        <section className={`category-viewer${previewMode === 'phone' ? ' is-phone-viewer' : ''}${viewerProducts.some((product) => product.image) ? ' has-product-photos' : ''}${viewerMotion !== 'idle' ? ` is-phone-${viewerMotion} is-direction-${viewerDirection > 0 ? 'next' : 'previous'}` : ''}${openingProductId !== null ? ` is-opening-product is-opening-${viewerOpeningMode}` : ''}`} role="dialog" aria-modal="true" aria-label={`${viewerCategory} prekių peržiūra`}>
          <div className="category-viewer-topbar">
            <span className="category-viewer-mark">SFINKSAS</span>
            <span>{viewerCategory}</span>
            <button type="button" onClick={closeCategoryViewer} aria-label="Uždaryti kategorijos peržiūrą">×</button>
          </div>

          {viewerOpeningMode === 'desktop' && openingProductId !== null && (
            <div
              className="desktop-product-launch"
              aria-hidden="true"
              style={{
                '--launch-start-x': `${Math.sign(openingProductOffset) * ([0, 18, 27, 35][Math.min(Math.abs(openingProductOffset), 3)] ?? 35)}vw`,
                '--launch-start-scale': [1, .82, .67, .52][Math.min(Math.abs(openingProductOffset), 3)] ?? .52,
                '--launch-start-opacity': [1, .7, .4, .2][Math.min(Math.abs(openingProductOffset), 3)] ?? .2,
              } as CSSProperties}
            >
              {(() => {
                const product = viewerProducts.find((item) => item.id === openingProductId);
                return product ? <ProductArt shape={product.shape} tone={product.tone} image={product.image} /> : null;
              })()}
            </div>
          )}

          <div className="category-viewer-copy" aria-live="polite">
            <h2>{activeViewerProduct.name}</h2>
            <strong>{money.format(activeViewerProduct.price)}</strong>
            <span>{activeViewerProduct.note}</span>
          </div>

          <div
            className="category-wheel-stage"
            tabIndex={0}
            aria-label="Sukama produktų karuselė"
            onKeyDown={(event) => {
              if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') cycleCategoryViewer(-1);
              if (event.key === 'ArrowRight' || event.key === 'ArrowDown') cycleCategoryViewer(1);
            }}
            onWheel={(event) => {
              event.preventDefault();
              const now = Date.now();
              if (now - viewerWheelLockRef.current < 420) return;
              viewerWheelLockRef.current = now;
              cycleCategoryViewer(event.deltaY + event.deltaX > 0 ? 1 : -1);
            }}
            onPointerDown={(event) => {
              viewerDragRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
              viewerSuppressClickRef.current = false;
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={(event) => {
              const start = viewerDragRef.current;
              if (!start || start.pointerId !== event.pointerId) return;
              if (Math.abs(event.clientY - start.y) > 8 || Math.abs(event.clientX - start.x) > 8) event.preventDefault();
            }}
            onPointerUp={(event) => {
              const start = viewerDragRef.current;
              viewerDragRef.current = null;
              if (!start || start.pointerId !== event.pointerId) return;
              const deltaX = event.clientX - start.x;
              const deltaY = event.clientY - start.y;
              const delta = Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX;
              if (Math.abs(delta) > 28) {
                viewerSuppressClickRef.current = true;
                if (viewerClickTimerRef.current !== null) window.clearTimeout(viewerClickTimerRef.current);
                viewerClickTimerRef.current = window.setTimeout(() => {
                  viewerSuppressClickRef.current = false;
                  viewerClickTimerRef.current = null;
                }, 300);
                cycleCategoryViewer(deltaY >= 0 ? 1 : -1);
              }
            }}
            onPointerCancel={() => { viewerDragRef.current = null; }}
          >
            {viewerProducts.map((product, index) => {
              const offset = viewerOffset(index);
              return (
                <button
                  key={product.id}
                  className={`category-wheel-item${offset === 0 ? ' is-active' : offset < 0 ? ' is-before' : ' is-after'}${openingProductId === product.id ? ' is-launching' : ''}`}
                  data-offset={offset}
                  type="button"
                  aria-label={`Atidaryti ${product.name} informaciją`}
                  aria-current={offset === 0 ? 'true' : undefined}
                  onClick={() => {
                    if (viewerSuppressClickRef.current) {
                      viewerSuppressClickRef.current = false;
                      return;
                    }
                    openViewerProduct(product, offset);
                  }}
                >
                  <ProductArt shape={product.shape} tone={product.tone} image={product.image} priority={offset === 0} />
                </button>
              );
            })}
          </div>

          <button className="category-wheel-previous" type="button" onClick={() => cycleCategoryViewer(-1)} aria-label="Ankstesnė prekė">←</button>
          <button className="category-wheel-next" type="button" onClick={() => cycleCategoryViewer(1)} aria-label="Kita prekė">→</button>

          <div className="category-viewer-footer">
            <span className="category-viewer-count">{(viewerIndex + 1).toString().padStart(2, '0')} / {viewerProducts.length.toString().padStart(2, '0')}</span>
            <span className="category-viewer-hint"><i aria-hidden="true">↔</i> Braukite arba sukite</span>
            <button type="button" onClick={() => openViewerProduct(activeViewerProduct, 0)}>Peržiūrėti produktą <span>↗</span></button>
          </div>
        </section>,
        document.body,
      )}

      {selectedProduct && (
        <div className={`product-preview-backdrop${productOpenedFromViewer ? ' from-category-viewer' : ''}${productOpenedFromDesktopViewer ? ' from-desktop-viewer' : ''}`} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedProduct(null); }}>
          <section className="product-preview-modal" role="dialog" aria-modal="true" aria-label={`${selectedProduct.name} produkto peržiūra`}>
            <button className="product-preview-close" type="button" onClick={() => setSelectedProduct(null)} aria-label="Uždaryti produkto peržiūrą">×</button>
            <button className="product-preview-previous" type="button" onClick={() => moveProduct(-1)} aria-label="Ankstesnis produktas">←</button>
            <button className="product-preview-next" type="button" onClick={() => moveProduct(1)} aria-label="Kitas produktas">→</button>

            {productOpenedFromDesktopViewer && (
              <div className="desktop-mini-carousel" aria-hidden="true">
                {products.filter((product) => product.category === selectedProduct.category).slice(0, 7).map((product, index) => (
                  <div key={product.id} data-mini-index={index}>
                    <ProductArt shape={product.shape} tone={product.tone} image={product.image} />
                  </div>
                ))}
              </div>
            )}

            <div
              className={`product-preview-stage${selectedProduct.image ? ' has-product-photo' : ''}`}
              onPointerDown={(event) => {
                dragRef.current = { pointerId: event.pointerId, x: event.clientX };
                event.currentTarget.setPointerCapture(event.pointerId);
              }}
              onPointerMove={(event) => {
                if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) return;
                const delta = event.clientX - dragRef.current.x;
                dragRef.current.x = event.clientX;
                setRotation((current) => (current + delta * .45 + 100) % 100);
              }}
              onPointerUp={() => { dragRef.current = null; }}
            >
              <span className="preview-category">{selectedProduct.category}</span>
              <span className="rotation-degree">{Math.round(rotation * 3.6)}°</span>
              <div
                className="preview-art-rotator"
                data-bottle-size={previewVariants[previewVariant]}
                style={{
                  '--bottle-scale': previewBottleScale,
                  '--bottle-turn': `${rotation * 3.6 - 22}deg`,
                } as CSSProperties}
              >
                <div className="preview-art-entry">
                  <ProductArt shape={selectedProduct.shape} tone={selectedProduct.tone} image={selectedProduct.image} />
                </div>
              </div>
              <div className="rotation-control">
                <span><i>↔</i> Vilkite arba sukite</span>
                <label>
                  <span className="sr-only">Pasukti produktą 360 laipsnių</span>
                  <input aria-label="Pasukti produktą 360 laipsnių" type="range" min="0" max="100" value={rotation} onChange={(event) => setRotation(Number(event.target.value))} />
                </label>
              </div>
            </div>

            <div className="product-preview-details">
              <p className="section-kicker">Produkto peržiūra</p>
              <span className="preview-product-number">NO. {selectedProduct.id.toString().padStart(2, '0')}</span>
              <h2>{selectedProduct.name}</h2>
              <p className="preview-product-note">{selectedProduct.note}</p>
              <p className="preview-product-description">{productStory(selectedProduct).description}</p>
              <ul>
                {productStory(selectedProduct).benefits.map((benefit) => <li key={benefit}><span>✓</span>{benefit}</li>)}
              </ul>
              <fieldset className="variant-picker">
                <legend>{selectedProduct.category === 'Rinkiniai' ? 'Pakuotė' : selectedProduct.category === 'Priedai' ? 'Kiekis' : 'Talpa'}</legend>
                <div>{previewVariants.map((variant, index) => <button key={variant} type="button" className={previewVariant === index ? 'selected' : ''} onClick={() => setPreviewVariant(index)}>{variant}</button>)}</div>
              </fieldset>
              <div className="preview-purchase-row">
                <div className="preview-quantity" aria-label="Kiekis">
                  <button type="button" onClick={() => setPreviewQuantity((quantity) => Math.max(1, quantity - 1))} aria-label="Mažinti kiekį">−</button>
                  <span>{previewQuantity}</span>
                  <button type="button" onClick={() => setPreviewQuantity((quantity) => quantity + 1)} aria-label="Didinti kiekį">+</button>
                </div>
                <strong>{money.format(previewPrice * previewQuantity)}</strong>
              </div>
              <button className="preview-add-button" type="button" onClick={() => { addToCart(selectedProduct, previewQuantity); setSelectedProduct(null); }}>
                Pridėti į krepšelį <span>↗</span>
              </button>
              <small className="preview-delivery">Nemokamas pristatymas užsakymams nuo 60 €</small>
            </div>
          </section>
        </div>
      )}

      {navPanel === 'collection' && (
        <div className="nav-panel-overlay collection-menu-overlay" role="dialog" aria-modal="true" aria-label="Kolekcijos meniu">
          <button className="nav-panel-close" type="button" onClick={() => setNavPanel(null)} aria-label="Uždaryti kolekcijos meniu">×</button>
          <div className="collection-menu-panel">
            <p className="section-kicker">Sfinksas · kolekcija</p>
            <h2>Pasirinkite savo<br /><em>grožio ritualą.</em></h2>
            <div className="collection-menu-list">
              {categories.map((category) => (
                <button key={category.name} type="button" onClick={() => { setNavPanel(null); openCategoryViewer(category.name); }}>
                  <span>{category.index}</span><b>{category.name}</b><small>{category.note}</small><i>↗</i>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {navPanel === 'contact' && (
        <div className="nav-panel-overlay contact-menu-overlay" role="dialog" aria-modal="true" aria-label="Kontaktų meniu">
          <button className="nav-panel-close" type="button" onClick={() => setNavPanel(null)} aria-label="Uždaryti kontaktų meniu">×</button>
          <div className="contact-menu-panel">
            <div className="contact-menu-copy">
              <p className="section-kicker">Sfinksas · kontaktai</p>
              <h2>Padėsime atrasti<br /><em>jūsų ritualą.</em></h2>
              <p>Parašykite, kokio rezultato ieškote. Padėsime pasirinkti priemones ir suderinti jų naudojimą.</p>
              <a href="mailto:labas@sfinksas.lt">labas@sfinksas.lt <span>↗</span></a>
            </div>
            <form className="contact-menu-form" onSubmit={submitContact}>
              <label>Jūsų vardas<input required name="menu-name" placeholder="Įrašykite vardą" /></label>
              <label>El. paštas<input required type="email" name="menu-email" placeholder="vardas@pastas.lt" /></label>
              <label>Žinutė<textarea required name="menu-message" rows={4} placeholder="Kuo galime padėti?" /></label>
              <button type="submit">{messageSent ? 'Žinutė paruošta ✓' : 'Siųsti žinutę'} <span>↗</span></button>
            </form>
          </div>
        </div>
      )}

      {searchOpen && (
        <div className="overlay search-overlay" role="dialog" aria-modal="true" aria-label="Produktų paieška">
          <button className="overlay-close" type="button" onClick={() => { setSearchOpen(false); setQuery(''); }} aria-label="Uždaryti paiešką">×</button>
          <div className="search-panel">
            <div className="search-heading"><p className="section-kicker">Produktų galerija · paieška kolekcijoje</p></div>
            <label><span className="sr-only">Ieškoti produkto</span><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ko ieškote?" /><i>⌕</i></label>
            <p className="search-status">{query ? `Atitinka paiešką: ${searchResults.length}` : 'Visi produktai savo vietose'}</p>
            <div className="search-shelves">
              {searchShelves.map((shelf) => {
                const shelfProducts = products.filter((product) => product.category === shelf.category);
                return (
                  <section className="search-shelf" key={shelf.category} aria-label={shelf.label}>
                    <header><span>{shelf.number}</span><h2>{shelf.label}</h2><small>{shelfProducts.length} produktai · 20 vietų</small></header>
                    <div className="search-shelf-scroll">
                      <div className="search-shelf-track">
                        {Array.from({ length: 20 }, (_, slot) => {
                          const product = shelfProducts[slot];
                          const matches = !!product && searchResults.some((result) => result.id === product.id);
                          return (
                            <div className={`search-shelf-slot${product ? ' has-product' : ''}${product && !matches ? ' is-filtered' : ''}`} key={`${shelf.category}-${slot}`}>
                              {product && (
                                <button type="button" tabIndex={matches ? 0 : -1} onClick={() => { setSearchOpen(false); setQuery(''); openProduct(product); }} aria-label={`Peržiūrėti ${product.name}`}>
                                  <ProductArt shape={product.shape} tone={product.tone} image={product.image} />
                                  <span className="shelf-product-card"><b>{product.name}</b><small>{money.format(product.price)}</small></span>
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {cartOpen && (
        <div className="drawer-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false); }}>
          <aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Krepšelis">
            <div className="drawer-header"><div><p className="section-kicker">Jūsų pasirinkimai</p><h2>Krepšelis <span>({cartCount})</span></h2></div><button type="button" onClick={() => setCartOpen(false)} aria-label="Uždaryti krepšelį">×</button></div>
            <div className="cart-items">
              {!cartItems.length && <div className="empty-cart"><span>○</span><h3>Krepšelis dar tuščias</h3><p>Atraskite ritualą, kuris tinka jūsų plaukams.</p><button type="button" onClick={() => showPanel('collection')}>Atverti kolekciją</button></div>}
              {cartItems.map((product) => (
                <div className="cart-row" key={product.id}>
                  <div className={`cart-art${product.image ? ' has-product-photo' : ''}`}><ProductArt shape={product.shape} tone={product.tone} image={product.image} /></div>
                  <div className="cart-row-copy"><b>{product.name}</b><small>{product.note}</small><div><button type="button" onClick={() => changeQuantity(product.id, -1)} aria-label="Mažinti kiekį">−</button><span>{cart[product.id]}</span><button type="button" onClick={() => changeQuantity(product.id, 1)} aria-label="Didinti kiekį">+</button></div></div>
                  <strong>{money.format(product.price * cart[product.id])}</strong>
                </div>
              ))}
            </div>
            {!!cartItems.length && <div className="cart-summary"><div><span>Suma</span><strong>{money.format(cartTotal)}</strong></div><button type="button" onClick={() => setNotice('Apmokėjimas šioje demonstracijoje išjungtas')}>Tęsti apmokėjimą <span>↗</span></button><small>Pristatymas apskaičiuojamas kitame žingsnyje.</small></div>}
          </aside>
        </div>
      )}

      {menuOpen && (
        <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Mobilus meniu">
          <div className="mobile-menu-top"><span className="wordmark">SFINKSAS</span><button type="button" onClick={() => setMenuOpen(false)} aria-label="Uždaryti meniu">×</button></div>
          <nav>
            <button type="button" onClick={showHome}><span>01</span>Namai</button>
            <button type="button" onClick={showSearch}><span>02</span>Paieška</button>
            <button type="button" onClick={() => showPanel('collection')}><span>03</span>Kolekcija</button>
            <button type="button" onClick={() => showPanel('contact')}><span>04</span>Kontaktai</button>
          </nav>
          <button className="mobile-cart" type="button" onClick={showCart}>Krepšelis ({cartCount}) <span>↗</span></button>
        </div>
      )}

      {notice && <div className="toast" role="status">{notice}<span>✓</span></div>}
      </main>
    </>
  );
}
