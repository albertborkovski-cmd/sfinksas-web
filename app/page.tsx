'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
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

const products: Product[] = [
  { id: 1, name: 'Keune Style Refresh', category: 'Šampūnai', note: 'Sausas šampūnas · 200 ml', price: 24, shape: 'pump', tone: 'smoke', image: '/keune-style-refresh-dry-shampoo-cutout.png', variants: ['200 ml'] },
  { id: 2, name: 'milk_shake Colour Care', category: 'Šampūnai', note: 'Spalvą tausojantis šampūnas · 300 ml', price: 23, shape: 'pump', tone: 'amber', image: '/milk-shake-colour-care-shampoo-cutout.png', variants: ['300 ml'] },
  { id: 3, name: 'Smooth Veil', category: 'Kondicionieriai', note: 'Glotninantis kondicionierius · 200 ml', price: 28, shape: 'tube', tone: 'sand' },
  { id: 4, name: 'Repair Crème', category: 'Kondicionieriai', note: 'Atkuriamoji kaukė · 180 ml', price: 32, shape: 'jar', tone: 'bronze' },
  { id: 5, name: 'No. 03', category: 'Aliejukai', note: 'Lengvas plaukų aliejus · 50 ml', price: 34, shape: 'dropper', tone: 'amber' },
  { id: 6, name: 'Glow Drops', category: 'Aliejukai', note: 'Žvilgesio serumas · 30 ml', price: 31, shape: 'dropper', tone: 'olive' },
  { id: 7, name: 'Scalp Ritual', category: 'Priedai', note: 'Galvos odos masažuoklis', price: 18, shape: 'brush', tone: 'sand' },
  { id: 8, name: 'Silk Loop', category: 'Priedai', note: 'Šilkinė plaukų gumytė', price: 12, shape: 'jar', tone: 'smoke' },
  { id: 9, name: 'Daily Ritual', category: 'Rinkiniai', note: 'Šampūnas, kondicionierius, aliejus', price: 68, shape: 'set', tone: 'bronze' },
  { id: 10, name: 'Restore Duo', category: 'Rinkiniai', note: 'Atkuriamasis šampūnas ir kaukė', price: 54, shape: 'set', tone: 'olive' },
  { id: 11, name: 'milk_shake Integrity', category: 'Šampūnai', note: 'Maitinamasis šampūnas · 1000 ml', price: 39, shape: 'pump', tone: 'sand', image: '/milk-shake-integrity-shampoo-cutout.png', variants: ['1000 ml'] },
  { id: 12, name: 'Hydrate Melt', category: 'Kondicionieriai', note: 'Intensyviai drėkinantis · 200 ml', price: 30, shape: 'tube', tone: 'olive' },
  { id: 13, name: 'Satin Mist', category: 'Aliejukai', note: 'Lengva apsauginė dulksna · 50 ml', price: 33, shape: 'dropper', tone: 'smoke' },
  { id: 14, name: 'Wide Tooth', category: 'Priedai', note: 'Plačių dantukų ritualo šukos', price: 16, shape: 'brush', tone: 'bronze' },
  { id: 15, name: 'Night Repair', category: 'Rinkiniai', note: 'Naktinis atkuriamasis trejetas', price: 72, shape: 'set', tone: 'smoke' },
  { id: 16, name: 'Kérastase Chronologiste', category: 'Šampūnai', note: 'Atgaivinantis šampūnas · 500 ml', price: 46, shape: 'pump', tone: 'smoke', image: '/kerastase-chronologiste-shampoo-cutout.png', variants: ['500 ml'] },
  { id: 17, name: 'Kérastase Discipline', category: 'Šampūnai', note: 'Glotninantis šampūnas · 250 ml', price: 34, shape: 'tube', tone: 'bronze', image: '/kerastase-discipline-shampoo-cutout.png', variants: ['250 ml'] },
  { id: 18, name: 'Schwarzkopf Fibre Clinix Fortify', category: 'Šampūnai', note: 'Pažeistiems plaukams · 300 ml', price: 29, shape: 'pump', tone: 'bronze', image: '/schwarzkopf-fibre-clinix-shampoo-cutout.png', variants: ['300 ml'] },
  { id: 19, name: 'Olaplex No.4P Blonde Enhancer', category: 'Šampūnai', note: 'Tonuojantis šampūnas šviesiems plaukams · 250 ml', price: 32, shape: 'pump', tone: 'smoke', image: '/olaplex-no4p-shampoo-cutout.png', variants: ['250 ml'] },
  { id: 20, name: 'Wella Ultimate Smooth', category: 'Šampūnai', note: 'Glotninantis ir maitinantis šampūnas · 250 ml', price: 28, shape: 'pump', tone: 'amber', image: '/wella-ultimate-smooth-shampoo-cutout.png', variants: ['250 ml'] },
  { id: 21, name: 'Kevin.Murphy Plumping.Wash', category: 'Šampūnai', note: 'Tankinantis šampūnas ploniems plaukams · 250 ml', price: 35, shape: 'tube', tone: 'sand', image: '/kevin-murphy-plumping-wash-cutout.png', variants: ['250 ml'] },
];

const money = new Intl.NumberFormat('lt-LT', { style: 'currency', currency: 'EUR' });

function ProductArt({ shape, tone, image, small = false }: { shape: Shape; tone: Product['tone']; image?: string; small?: boolean }) {
  return (
    <div className={`product-art shape-${shape} tone-${tone}${image ? ' has-photo' : ''}${small ? ' product-art-small' : ''}`} aria-hidden="true">
      {image ? <img src={image} alt="" draggable="false" /> : <><span className="product-shadow" /><span className="product-form"><i className="product-cap" /><b>S</b></span></>}
    </div>
  );
}

export default function Home() {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'phone'>('desktop');
  const [activeCategory, setActiveCategory] = useState<Category | 'Visi'>('Visi');
  const [searchOpen, setSearchOpen] = useState(false);
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
  const [portalReady, setPortalReady] = useState(false);
  const dragRef = useRef<{ pointerId: number; x: number } | null>(null);
  const viewerDragRef = useRef<{ pointerId: number; x: number; y: number } | null>(null);
  const viewerWheelLockRef = useRef(0);

  useEffect(() => {
    setPortalReady(true);
    document.body.classList.toggle('phone-preview-active', previewMode === 'phone');
    return () => document.body.classList.remove('phone-preview-active');
  }, [previewMode]);

  useEffect(() => {
    function closeDialogs(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      setSelectedProduct(null);
      setSearchOpen(false);
      setCartOpen(false);
      setMenuOpen(false);
      setViewerCategory(null);
    }
    document.addEventListener('keydown', closeDialogs);
    return () => document.removeEventListener('keydown', closeDialogs);
  }, []);

  const visibleProducts = useMemo(
    () => activeCategory === 'Visi' ? products.slice(0, 8) : products.filter((product) => product.category === activeCategory),
    [activeCategory],
  );

  const searchResults = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('lt');
    if (!normalized) return products.slice(0, 5);
    return products.filter((product) => `${product.name} ${product.category} ${product.note}`.toLocaleLowerCase('lt').includes(normalized));
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

  function addToCart(product: Product, quantity = 1) {
    setCart((current) => ({ ...current, [product.id]: (current[product.id] || 0) + quantity }));
    setNotice(`${product.name} pridėta į krepšelį`);
    window.setTimeout(() => setNotice(''), 2200);
  }

  function openProduct(product: Product) {
    setSelectedProduct(product);
    setPreviewQuantity(1);
    setPreviewVariant(0);
    setRotation(0);
  }

  function moveProduct(direction: number) {
    if (!selectedProduct) return;
    const currentIndex = products.findIndex((product) => product.id === selectedProduct.id);
    openProduct(products[(currentIndex + direction + products.length) % products.length]);
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
    setActiveCategory(category);
    setViewerIndex(0);
    setViewerCategory(category);
  }

  function cycleCategoryViewer(direction: number) {
    if (!viewerProducts.length) return;
    setViewerIndex((current) => (current + direction + viewerProducts.length) % viewerProducts.length);
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
          <a className="wordmark" href="#namai" aria-label="Sfinksas – pradžia">SFINKSAS</a>
          <nav className="desktop-nav" aria-label="Pagrindinis meniu">
            <a className="active" href="#namai">Namai</a>
            <button type="button" onClick={() => setSearchOpen(true)}>Paieška</button>
            <a href="#kolekcija">Kolekcija</a>
            <a href="#kontaktai">Kontaktai</a>
          </nav>
          <div className="header-actions">
            <button className="cart-button" type="button" onClick={() => setCartOpen(true)} aria-label={`Atverti krepšelį, prekių: ${cartCount}`}>
              <span>Krepšelis</span><span className="cart-count">({cartCount})</span><span className="bag-icon" aria-hidden="true" />
            </button>
            <button className="menu-button" type="button" onClick={() => setMenuOpen(true)} aria-label="Atverti meniu"><span /><span /></button>
          </div>
        </header>

        <div className="hero-shade" />
        <div className="hero-content">
          <p className="eyebrow"><span /> Atrinkta plaukų priežiūra</p>
          <h1>Grožio ritualas,<br /><em>sukurtas jums.</em></h1>
          <p className="hero-copy">Profesionalios priemonės plaukų stiprumui, žvilgesiui ir kasdieniam ritualui. Atrinkta tai, kas iš tiesų veikia.</p>
          <div className="hero-ctas">
            <a className="primary-cta" href="#kolekcija">Atrasti kolekciją <span aria-hidden="true">↗</span></a>
            <a className="text-cta" href="#apie">Mūsų požiūris <span aria-hidden="true">→</span></a>
          </div>
        </div>
        <div className="hero-meta" aria-hidden="true"><span>01</span><i /><span>Grožio ritualai</span></div>
        <a className="scroll-cue" href="#kolekcija" aria-label="Slinkti į kolekciją"><span /></a>
      </section>

      <section className="manifesto" id="apie">
        <p className="section-kicker">Mūsų filosofija</p>
        <div className="manifesto-copy">
          <h2>Mažiau triukšmo.<br />Daugiau to, <em>kas veikia.</em></h2>
          <div>
            <p>„Sfinksas“ – tai kruopščiai atrinkta profesionali plaukų priežiūra: nuo kasdienio švelnaus valymo iki intensyvaus atkūrimo ir išbaigtų ritualų.</p>
            <p className="small-copy">Kiekviena kategorija sukurta taip, kad lengvai rastumėte priemonę pagal savo ritualą.</p>
          </div>
        </div>
        <div className="manifesto-rule"><span>01</span><i /><span>05</span></div>
      </section>

      <section className="collection" id="kolekcija">
        <div className="collection-heading">
          <div><p className="section-kicker light">Kolekcija</p><h2>Pasirinkite savo <em>ritualą</em></h2></div>
          <p>Penkios kryptys, vienas tikslas – sveikai atrodantys, gyvybingi plaukai ir maloni kasdienė rutina.</p>
        </div>

        <div className="category-stage">
          {categories.map((category) => (
            <button key={category.name} className={`category-card${activeCategory === category.name ? ' selected' : ''}`} type="button" onClick={() => openCategoryViewer(category.name)}>
              <span className="category-index">{category.index}</span>
              <ProductArt shape={category.shape} tone={category.index === '02' ? 'sand' : category.index === '03' ? 'amber' : category.index === '04' ? 'olive' : 'smoke'} small />
              <span className="category-name">{category.name}</span>
              <span className="category-note">{category.note}</span>
              <span className="category-arrow" aria-hidden="true">↗</span>
            </button>
          ))}
        </div>

        <div className="products-toolbar" id="produktai">
          <div>
            <span>Rodyti:</span>
            <button className={activeCategory === 'Visi' ? 'current' : ''} type="button" onClick={() => setActiveCategory('Visi')}>Visi</button>
            {categories.map((category) => <button key={category.name} className={activeCategory === category.name ? 'current' : ''} type="button" onClick={() => setActiveCategory(category.name)}>{category.name}</button>)}
          </div>
          <span>{visibleProducts.length.toString().padStart(2, '0')} produktai</span>
        </div>

        <div className="product-grid">
          {visibleProducts.map((product) => (
            <article className="product-card" key={product.id}>
              <div className={`product-image${product.image ? ' has-product-photo' : ''}`}>
                <span className="product-category">{product.category}</span>
                <ProductArt shape={product.shape} tone={product.tone} image={product.image} />
                <button className="product-preview-trigger" type="button" onClick={() => openProduct(product)} aria-label={`Peržiūrėti ${product.name}`}><span className="sr-only">Peržiūrėti produktą</span></button>
                <button className="quick-add" type="button" onClick={() => addToCart(product)} aria-label={`Pridėti ${product.name} į krepšelį`}>+</button>
              </div>
              <div className="product-info"><div><button className="product-name-button" type="button" onClick={() => openProduct(product)}><h3>{product.name}</h3></button><p>{product.note}</p></div><strong>{money.format(product.price)}</strong></div>
            </article>
          ))}
        </div>
      </section>

      <section className="editorial">
        <div className="editorial-image" role="img" aria-label="Sfinksas plaukų priežiūros priemonės ant akmens pakylos" />
        <div className="editorial-copy">
          <p className="section-kicker">Ritualas nuo pradžios iki pabaigos</p>
          <h2>Priežiūra, kuri<br /><em>jaučiasi kitaip.</em></h2>
          <p>Suderinkite valymą, drėkinimą ir apsaugą. Atrinkti rinkiniai leidžia pradėti paprastai, o kiekvieną žingsnį – suprasti.</p>
          <a className="dark-cta" href="#kolekcija">Rinktis rinkinį <span>↗</span></a>
          <dl><div><dt>5</dt><dd>aiškios kategorijos</dd></div><div><dt>1</dt><dd>vientisas ritualas</dd></div></dl>
        </div>
      </section>

      <section className="contacts" id="kontaktai">
        <div className="contact-intro">
          <p className="section-kicker light">Kontaktai</p>
          <h2>Turite klausimą?<br /><em>Pasikalbėkime.</em></h2>
          <p>Padėsime išsirinkti produktą ar suderinti kasdienį plaukų priežiūros ritualą.</p>
          <a href="mailto:labas@sfinksas.lt">labas@sfinksas.lt <span>↗</span></a>
        </div>
        <form className="contact-form" onSubmit={submitContact}>
          <label>Jūsų vardas<input required name="name" placeholder="Įrašykite vardą" /></label>
          <label>El. paštas<input required type="email" name="email" placeholder="vardas@pastas.lt" /></label>
          <label>Žinutė<textarea required name="message" rows={3} placeholder="Kuo galime padėti?" /></label>
          <button type="submit">{messageSent ? 'Žinutė paruošta ✓' : 'Siųsti žinutę'} <span>↗</span></button>
          <small>Demonstracinėje versijoje žinutė nėra išsiunčiama.</small>
        </form>
      </section>

      <footer>
        <a className="wordmark footer-mark" href="#namai">SFINKSAS</a>
        <p>Profesionali plaukų priežiūra jūsų kasdieniam ritualui.</p>
        <div><a href="#kolekcija">Kolekcija</a><a href="#kontaktai">Kontaktai</a><button type="button" onClick={() => setSearchOpen(true)}>Paieška</button></div>
        <span>© 2026 Sfinksas · Demonstracinė parduotuvė</span>
      </footer>

      {portalReady && viewerCategory && activeViewerProduct && createPortal(
        <section className={`category-viewer${previewMode === 'phone' ? ' is-phone-viewer' : ''}${viewerProducts.some((product) => product.image) ? ' has-product-photos' : ''}`} role="dialog" aria-modal="true" aria-label={`${viewerCategory} prekių peržiūra`}>
          <div className="category-viewer-topbar">
            <span className="category-viewer-mark">SFINKSAS</span>
            <span>{viewerCategory}</span>
            <button type="button" onClick={() => setViewerCategory(null)} aria-label="Uždaryti kategorijos peržiūrą">×</button>
          </div>

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
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerUp={(event) => {
              const start = viewerDragRef.current;
              viewerDragRef.current = null;
              if (!start || start.pointerId !== event.pointerId) return;
              const deltaX = event.clientX - start.x;
              const deltaY = event.clientY - start.y;
              const delta = Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX;
              if (Math.abs(delta) > 32) cycleCategoryViewer(delta < 0 ? 1 : -1);
            }}
            onPointerCancel={() => { viewerDragRef.current = null; }}
          >
            {viewerProducts.map((product, index) => {
              const offset = viewerOffset(index);
              return (
                <button
                  key={product.id}
                  className={`category-wheel-item${offset === 0 ? ' is-active' : offset < 0 ? ' is-before' : ' is-after'}`}
                  data-offset={offset}
                  type="button"
                  aria-label={`Atidaryti ${product.name} informaciją`}
                  aria-current={offset === 0 ? 'true' : undefined}
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={() => { setViewerCategory(null); openProduct(product); }}
                >
                  <ProductArt shape={product.shape} tone={product.tone} image={product.image} />
                </button>
              );
            })}
          </div>

          <button className="category-wheel-previous" type="button" onClick={() => cycleCategoryViewer(-1)} aria-label="Ankstesnė prekė">←</button>
          <button className="category-wheel-next" type="button" onClick={() => cycleCategoryViewer(1)} aria-label="Kita prekė">→</button>

          <div className="category-viewer-footer">
            <span className="category-viewer-count">{(viewerIndex + 1).toString().padStart(2, '0')} / {viewerProducts.length.toString().padStart(2, '0')}</span>
            <span className="category-viewer-hint"><i aria-hidden="true">↔</i> Braukite arba sukite</span>
            <button type="button" onClick={() => { setViewerCategory(null); openProduct(activeViewerProduct); }}>Peržiūrėti produktą <span>↗</span></button>
          </div>
        </section>,
        document.body,
      )}

      {selectedProduct && (
        <div className="product-preview-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedProduct(null); }}>
          <section className="product-preview-modal" role="dialog" aria-modal="true" aria-label={`${selectedProduct.name} produkto peržiūra`}>
            <button className="product-preview-close" type="button" onClick={() => setSelectedProduct(null)} aria-label="Uždaryti produkto peržiūrą">×</button>
            <button className="product-preview-previous" type="button" onClick={() => moveProduct(-1)} aria-label="Ankstesnis produktas">←</button>
            <button className="product-preview-next" type="button" onClick={() => moveProduct(1)} aria-label="Kitas produktas">→</button>

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
              <div className="preview-art-rotator" style={{ transform: `perspective(900px) rotateY(${rotation * 3.6}deg)` }}>
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
              <p className="preview-product-description">Subalansuota profesionali formulė kasdieniam ritualui. Padeda išlaikyti plaukus minkštus, žvilgančius ir lengvai valdomus jų neapsunkindama.</p>
              <ul>
                <li><span>✓</span> Profesionaliai atrinkta formulė</li>
                <li><span>✓</span> Tinka kasdieniam ritualui</li>
                <li><span>✓</span> Be nereikalingo apsunkinimo</li>
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

      {searchOpen && (
        <div className="overlay search-overlay" role="dialog" aria-modal="true" aria-label="Produktų paieška">
          <button className="overlay-close" type="button" onClick={() => { setSearchOpen(false); setQuery(''); }} aria-label="Uždaryti paiešką">×</button>
          <div className="search-panel">
            <p className="section-kicker">Paieška kolekcijoje</p>
            <label><span className="sr-only">Ieškoti produkto</span><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ko ieškote?" /><i>⌕</i></label>
            <p className="search-status">{query ? `Rasta: ${searchResults.length}` : 'Populiaru dabar'}</p>
            <div className="search-results">
              {searchResults.map((product) => (
                <button key={product.id} type="button" onClick={() => { addToCart(product); setSearchOpen(false); setQuery(''); }}>
                  <ProductArt shape={product.shape} tone={product.tone} image={product.image} small />
                  <span><b>{product.name}</b><small>{product.category}</small></span><strong>{money.format(product.price)}</strong><i>+</i>
                </button>
              ))}
              {!searchResults.length && <p className="no-results">Nieko neradome. Pabandykite „aliejus“ arba „rinkinys“.</p>}
            </div>
          </div>
        </div>
      )}

      {cartOpen && (
        <div className="drawer-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false); }}>
          <aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Krepšelis">
            <div className="drawer-header"><div><p className="section-kicker">Jūsų pasirinkimai</p><h2>Krepšelis <span>({cartCount})</span></h2></div><button type="button" onClick={() => setCartOpen(false)} aria-label="Uždaryti krepšelį">×</button></div>
            <div className="cart-items">
              {!cartItems.length && <div className="empty-cart"><span>○</span><h3>Krepšelis dar tuščias</h3><p>Atraskite ritualą, kuris tinka jūsų plaukams.</p><button type="button" onClick={() => setCartOpen(false)}>Grįžti į kolekciją</button></div>}
              {cartItems.map((product) => (
                <div className="cart-row" key={product.id}>
                  <div className={`cart-art${product.image ? ' has-product-photo' : ''}`}><ProductArt shape={product.shape} tone={product.tone} image={product.image} small /></div>
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
            <a href="#namai" onClick={() => setMenuOpen(false)}><span>01</span>Namai</a>
            <button type="button" onClick={() => { setMenuOpen(false); setSearchOpen(true); }}><span>02</span>Paieška</button>
            <a href="#kolekcija" onClick={() => setMenuOpen(false)}><span>03</span>Kolekcija</a>
            <a href="#kontaktai" onClick={() => setMenuOpen(false)}><span>04</span>Kontaktai</a>
          </nav>
          <button className="mobile-cart" type="button" onClick={() => { setMenuOpen(false); setCartOpen(true); }}>Krepšelis ({cartCount}) <span>↗</span></button>
        </div>
      )}

      {notice && <div className="toast" role="status">{notice}<span>✓</span></div>}
      </main>
    </>
  );
}
