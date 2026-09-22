import { FormEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ArrowUpRight, Check, ChevronRight, Clock3, Mail, MapPin, Menu, Plane, Route, Send, Ship, Truck, Warehouse, X } from 'lucide-react';
import { Link, Route as WouterRoute, Switch, useLocation, Router as WouterRouter } from 'wouter';
import NotFound from '@/pages/not-found';

type Language = 'en' | 'ar';
type Copy = { en: string; ar: string };
type Service = { no: string; icon: typeof Ship; title: Copy; body: Copy; meta: Copy };

const queryClient = new QueryClient();

const text = (value: Copy, lang: Language) => value[lang];

const services: Service[] = [
  { no: '01', icon: Ship, title: { en: 'Ocean freight', ar: 'الشحن البحري' }, body: { en: 'Port-to-port control across the lanes that keep your business moving.', ar: 'تحكم كامل من ميناء إلى ميناء عبر المسارات التي تحافظ على استمرارية أعمالك.' }, meta: { en: 'FCL · LCL · Project cargo', ar: 'حاويات كاملة · شحن جزئي · حمولات المشاريع' } },
  { no: '02', icon: Plane, title: { en: 'Air freight', ar: 'الشحن الجوي' }, body: { en: 'Time-critical uplift with clear milestones from pickup to final handover.', ar: 'حلول سريعة للشحنات العاجلة مع متابعة واضحة من الاستلام حتى التسليم.' }, meta: { en: 'Priority · Express · Consolidated', ar: 'أولوية · سريع · مجمع' } },
  { no: '03', icon: Truck, title: { en: 'Land transport', ar: 'النقل البري' }, body: { en: 'Reliable first and last mile connections, managed around your schedule.', ar: 'روابط موثوقة للميل الأول والأخير، تدار وفق جدولك التشغيلي.' }, meta: { en: 'Cross-border · Door delivery', ar: 'عبر الحدود · توصيل حتى الباب' } },
  { no: '04', icon: Warehouse, title: { en: 'Warehousing', ar: 'التخزين والتوزيع' }, body: { en: 'Practical storage, handling and distribution capacity close to the action.', ar: 'مساحات عملية للتخزين والمناولة والتوزيع بالقرب من مراكز الحركة.' }, meta: { en: 'Storage · Fulfilment · Inventory', ar: 'تخزين · تنفيذ · مخزون' } },
  { no: '05', icon: Route, title: { en: 'End-to-end control', ar: 'التنسيق المتكامل' }, body: { en: 'One accountable team aligning carriers, documents, customs and delivery.', ar: 'فريق واحد مسؤول ينسق الناقلين والمستندات والجمارك والتسليم.' }, meta: { en: 'One view · One partner', ar: 'رؤية واحدة · شريك واحد' } },
];

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { node.classList.add('is-visible'); observer.disconnect(); }
    }, { threshold: .1 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useReveal();
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

function Brand() {
  return <Link href="/" className="brand" data-testid="link-brand">
    <span className="brand-mark" aria-hidden="true"><span className="brand-letter">M</span></span>
    <span className="brand-copy"><span className="brand-name">Masar International</span><span className="brand-ar arabic" dir="rtl">المسار الدولي للحلول اللوجيستية</span></span>
  </Link>;
}

function Header({ lang, onLanguageChange }: { lang: Language; onLanguageChange: () => void }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const nav = [
    { href: '/', en: 'About us', ar: 'من نحن' },
    { href: '/services', en: 'Our services', ar: 'خدماتنا' },
    { href: '/contact', en: 'Contact', ar: 'تواصل معنا' },
  ];
  useEffect(() => setOpen(false), [location]);
  return <header className="header">
    <div className="container-wide header-inner">
      <Brand />
      <nav className={`nav ${open ? 'open' : ''}`} aria-label={lang === 'en' ? 'Main navigation' : 'التنقل الرئيسي'}>
        {nav.map((item) => <Link key={item.href} href={item.href} className={`nav-link ${location === item.href ? 'active' : ''}`} data-testid={`link-nav-${item.href.slice(1) || 'home'}`}>{lang === 'en' ? item.en : item.ar}</Link>)}
      </nav>
      <div className="header-actions">
        <button className="language-switch arabic" onClick={onLanguageChange} data-testid="button-language-switch" aria-label={lang === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}>{lang === 'en' ? 'العربية' : 'English'}</button>
        <Link href="/contact" className="button-primary" data-testid="link-header-contact">{lang === 'en' ? 'Start a conversation' : 'ابدأ محادثة'} <ArrowUpRight size={15} className="arrow-icon" /></Link>
        <button className="menu-button" onClick={() => setOpen((current) => !current)} data-testid="button-mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'}>{open ? <X size={18} /> : <Menu size={18} />}</button>
      </div>
    </div>
  </header>;
}

function Footer({ lang }: { lang: Language }) {
  return <footer className="footer">
    <div className="container-wide">
      <div className="footer-grid">
        <div><Brand /><p className="footer-text" style={{ maxWidth: 300, marginTop: 22 }}>{lang === 'en' ? 'Dependable freight movement, coordinated with care from the first mile to the final handover.' : 'حركة شحن موثوقة، بتنسيق دقيق من الميل الأول حتى التسليم النهائي.'}</p></div>
        <div><div className="footer-heading">{lang === 'en' ? 'Explore' : 'استكشف'}</div><Link href="/" className="footer-link" data-testid="link-footer-home">{lang === 'en' ? 'About us' : 'من نحن'}</Link><Link href="/services" className="footer-link" data-testid="link-footer-services">{lang === 'en' ? 'Our services' : 'خدماتنا'}</Link><Link href="/contact" className="footer-link" data-testid="link-footer-contact">{lang === 'en' ? 'Contact' : 'تواصل معنا'}</Link></div>
        <div><div className="footer-heading">{lang === 'en' ? 'Connect' : 'تواصل'}</div><a className="footer-link" href="mailto:ezzaldein1980@gmail.com" data-testid="link-footer-email">ezzaldein1980@gmail.com</a><span className="footer-text">{lang === 'en' ? 'Amman · Jordan · Global' : 'عمّان · الأردن · حول العالم'}</span></div>
        <div><div className="footer-heading">{lang === 'en' ? 'Operating hours' : 'ساعات العمل'}</div><span className="footer-text">{lang === 'en' ? 'Sunday — Thursday' : 'الأحد — الخميس'}</span><span className="footer-text">08:00 — 18:00 AST</span><span className="footer-text">{lang === 'en' ? '24/7 shipment desk' : 'مكتب الشحن متاح 24/7'}</span></div>
      </div>
      <div className="footer-bottom"><span>© 2024 MASAR INTERNATIONAL LOGISTICS</span><span>{lang === 'en' ? 'Built for the routes ahead.' : 'نبني مسارات الغد.'}</span></div>
    </div>
  </footer>;
}

function Home({ lang }: { lang: Language }) {
  const heroRef = useReveal();
  return <main className="page-enter" key="home">
    <section className="hero">
      <div className="hero-inner">
        <div ref={heroRef} className="hero-copy reveal is-visible">
          <div className="eyebrow">{lang === 'en' ? 'Global freight, locally accountable' : 'شحن عالمي بمسؤولية محلية'}</div>
          <h1>{lang === 'en' ? <>The shortest distance between <em>promise</em> and delivery.</> : <>أقصر مسافة بين <em>الوعد</em> والتسليم.</>}</h1>
          <p className={lang === 'ar' ? 'arabic' : ''}>{lang === 'en' ? 'Masar is the logistics partner behind businesses that cannot afford uncertainty. We move cargo across borders with clear thinking, capable hands and one accountable view.' : 'المسار هو شريك الخدمات اللوجيستية للشركات التي لا تقبل عدم اليقين. ننقل شحناتك عبر الحدود برؤية واضحة وأيدٍ خبيرة ومسؤولية واحدة.'}</p>
          <div className="hero-actions"><Link href="/services" className="button-primary" data-testid="link-hero-services">{lang === 'en' ? 'See how we move' : 'اكتشف خدماتنا'} <ArrowUpRight size={16} className="arrow-icon" /></Link><Link href="/contact" className="button-quiet" data-testid="link-hero-contact">{lang === 'en' ? 'Talk to our team' : 'تحدث مع فريقنا'} <ChevronRight size={16} className="arrow-icon" /></Link></div>
          <div className="hero-ruler"><span>{lang === 'en' ? 'EST. 2012' : 'تأسست 2012'}</span><span>29°31′N / 35°00′E</span></div>
        </div>
      </div>
      <div className="hero-coordinate">PORT / PEOPLE / PRECISION</div>
    </section>
    <section className="stats-bar"><div className="container-wide stats-grid">
      {[['12+', lang === 'en' ? 'years in motion' : 'عاماً من الخبرة'], ['38', lang === 'en' ? 'trade lanes' : 'مساراً تجارياً'], ['4.8k', lang === 'en' ? 'annual shipments' : 'شحنة سنوياً'], ['24/7', lang === 'en' ? 'shipment desk' : 'مكتب متابعة']].map(([number, label], index) => <div className="stat" key={number} data-testid={`stat-${index}`}><div className="stat-number">{number}</div><span className="stat-label">{label}</span></div>)}
    </div></section>
    <section className="section"><div className="container-wide split"><Reveal><div className="section-kicker">{lang === 'en' ? 'The Masar difference' : 'ما يميز المسار'}</div><h2 className="section-title">{lang === 'en' ? <>Movement is easy.<br /><em>Momentum</em> takes care.</> : <>النقل سهل.<br /><em>الزخم</em> يحتاج عناية.</>}</h2></Reveal><Reveal><p className={`copy ${lang === 'ar' ? 'arabic' : ''}`}>{lang === 'en' ? <>Every shipment carries more than cargo. It carries a deadline, a reputation and a next decision. <strong>Our job is to keep all three on course.</strong> We pair regional fluency with an international operating standard, so your people see fewer surprises and more progress.</> : <>كل شحنة تحمل أكثر من مجرد بضاعة. تحمل موعداً وسمعة وقراراً تالياً. <strong>مهمتنا أن نحافظ على مسارها.</strong> نجمع بين المعرفة الإقليمية والمعايير التشغيلية العالمية، لتمنح فريقك مفاجآت أقل وتقدماً أكبر.</>}</p><div className="intro-aside"><span>{lang === 'en' ? 'A PARTNER, NOT A PORTAL' : 'شريك، لا مجرد منصة'}</span><span>01 / 03</span></div></Reveal></div></section>
    <section className="section section-dark"><div className="container-wide"><Reveal className="services-heading"><div><div className="section-kicker">{lang === 'en' ? 'Capabilities' : 'قدراتنا'}</div><h2 className="section-title">{lang === 'en' ? <>Whatever the route,<br /><em>we own the details.</em></> : <>مهما كان المسار،<br /><em>نحن ندير التفاصيل.</em></>}</h2></div><Link href="/services" className="button-quiet" data-testid="link-capabilities">{lang === 'en' ? 'All capabilities' : 'كل القدرات'} <ArrowUpRight size={15} className="arrow-icon" /></Link></Reveal><Reveal><div className="service-list">{services.map((service) => { const Icon = service.icon; return <Link href="/services" className="service-row" key={service.no} data-testid={`link-service-${service.no}`}><span className="service-index">{service.no}</span><div><h3>{text(service.title, lang)}</h3><p className={lang === 'ar' ? 'arabic' : ''}>{text(service.body, lang)}</p></div><Icon size={20} className="service-arrow" /></Link>; })}</div></Reveal></div></section>
    <section className="section section-soft"><div className="container-wide"><Reveal><div className="section-kicker">{lang === 'en' ? 'A wider view' : 'رؤية أوسع'}</div><div className="image-card image-card-wide"><div className="image-card-label"><div><strong>{lang === 'en' ? 'At Aqaba Port' : 'في ميناء العقبة'}</strong><span>{lang === 'en' ? 'Aqaba, Jordan · Red Sea gateway' : 'العقبة، الأردن · بوابة البحر الأحمر'}</span></div><span>02 / 03</span></div></div></Reveal><Reveal><div className="process"><div className="process-step"><span className="step-no">01 / LISTEN</span><h3>{lang === 'en' ? 'Read the brief' : 'نفهم احتياجك'}</h3><p>{lang === 'en' ? 'We start with your business reality, not a rate card.' : 'نبدأ بفهم واقع أعمالك، لا بقائمة أسعار جاهزة.'}</p></div><div className="process-step"><span className="step-no">02 / BUILD</span><h3>{lang === 'en' ? 'Shape the route' : 'نبني المسار'}</h3><p>{lang === 'en' ? 'The right mode, handoffs and contingencies — mapped before movement.' : 'نحدد الوسيلة والمراحل والبدائل قبل بدء الحركة.'}</p></div><div className="process-step"><span className="step-no">03 / MOVE</span><h3>{lang === 'en' ? 'Keep you close' : 'نبقيك على اطلاع'}</h3><p>{lang === 'en' ? 'Milestones stay visible, questions get answered, cargo keeps moving.' : 'تبقى المراحل واضحة، وتحصل على إجابات، وتستمر الشحنة في الحركة.'}</p></div></div></Reveal></div></section>
    <Cta lang={lang} />
  </main>;
}

function Cta({ lang }: { lang: Language }) {
  return <section className="cta-band"><div className="container-wide cta-inner"><h2>{lang === 'en' ? 'Have a route in mind? Let’s give it a reliable shape.' : 'لديك مسار في ذهنك؟ دعنا نحوله إلى خطة موثوقة.'}</h2><Link href="/contact" className="button-dark button-primary" data-testid="link-cta-contact">{lang === 'en' ? 'Start with a conversation' : 'ابدأ محادثة'} <ArrowUpRight size={16} className="arrow-icon" /></Link></div></section>;
}

function Services({ lang }: { lang: Language }) {
  return <main className="page-enter">
    <section className="page-hero"><div className="container-wide"><div className="eyebrow">{lang === 'en' ? 'Our services / 02' : 'خدماتنا / 02'}</div><h1>{lang === 'en' ? <>Built around <em>your</em> next move.</> : <>مصممة حول <em>خطوتك</em> القادمة.</>}</h1><p className={lang === 'ar' ? 'arabic' : ''}>{lang === 'en' ? 'The best logistics plan is the one that makes the rest of your operation feel simpler. We connect the modes, people and decisions behind every movement.' : 'أفضل خطة لوجيستية هي التي تجعل بقية عملياتك أكثر بساطة. نربط بين وسائل النقل والأشخاص والقرارات خلف كل حركة.'}</p></div></section>
    <section className="section"><div className="container-wide"><Reveal><div className="section-kicker">{lang === 'en' ? 'One operating standard' : 'معيار تشغيلي واحد'}</div><h2 className="section-title" style={{ maxWidth: 760 }}>{lang === 'en' ? <>Five capabilities.<br /><em>One accountable partner.</em></> : <>خمس قدرات.<br /><em>شريك واحد مسؤول.</em></>}</h2></Reveal><div style={{ marginTop: 58 }}>{services.map((service) => { const Icon = service.icon; return <Reveal key={service.no}><article className="service-detail" data-testid={`service-detail-${service.no}`}><div className="service-no">{service.no}</div><div><Icon size={25} color="#a77d1c" /><h2>{text(service.title, lang)}</h2><p className={lang === 'ar' ? 'arabic' : ''}>{text(service.body, lang)}</p></div><div className="service-meta"><strong>{lang === 'en' ? 'Typically includes' : 'يشمل عادةً'}</strong>{text(service.meta, lang)}</div></article></Reveal>; })}</div></div></section>
    <section className="section section-dark"><div className="container-wide split"><Reveal><div className="section-kicker">{lang === 'en' ? 'Designed to connect' : 'مصمم ليربط'}</div><h2 className="section-title">{lang === 'en' ? <>A chain is only as strong as its <em>handoffs.</em></> : <>قوة السلسلة في جودة <em>مراحلها.</em></>}</h2></Reveal><Reveal><p className={`copy ${lang === 'ar' ? 'arabic' : ''}`} style={{ color: 'rgba(246,244,237,.65)' }}>{lang === 'en' ? 'That is why Masar treats the space between modes as seriously as the modes themselves. Documents checked. Customs anticipated. Stakeholders briefed. Your shipment never disappears into the gaps.' : 'لهذا نتعامل مع المسافة بين وسائل النقل بجدية توازي التعامل مع الوسائل نفسها. مستندات مدققة، وجمارك متوقعة، وأطراف مطلعة. شحنتك لا تختفي في الفراغات.'}</p></Reveal></div></section>
    <Cta lang={lang} />
  </main>;
}

function Contact({ lang }: { lang: Language }) {
  const [sent, setSent] = useState(false);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') ?? '');
    const company = String(formData.get('company') ?? '');
    const email = String(formData.get('email') ?? '');
    const service = String(formData.get('service') ?? '');
    const message = String(formData.get('message') ?? '');
    const subject = encodeURIComponent(`Masar logistics inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nCompany: ${company}\nEmail: ${email}\nService: ${service}\n\n${message}`);
    window.location.href = `mailto:ezzaldein1980@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
  };
  return <main className="page-enter">
    <section className="page-hero"><div className="container-wide"><div className="eyebrow">{lang === 'en' ? 'Contact us / 03' : 'تواصل معنا / 03'}</div><h1>{lang === 'en' ? <>Let’s put your cargo on a <em>clearer course.</em></> : <>لنضع شحنتك على <em>مسار أوضح.</em></>}</h1><p className={lang === 'ar' ? 'arabic' : ''}>{lang === 'en' ? 'Tell us where you are starting and where you need to go. A Masar specialist will come back with a practical next step.' : 'أخبرنا من أين تبدأ وإلى أين تريد الوصول. سيعود إليك أحد مختصي المسار بخطوة عملية تالية.'}</p></div></section>
    <section className="section"><div className="container-wide contact-grid"><Reveal><div><div className="section-kicker">{lang === 'en' ? 'The human line' : 'خط التواصل المباشر'}</div><h2 className="section-title">{lang === 'en' ? <>Good routes<br /><em>start with a question.</em></> : <>المسارات الجيدة<br /><em>تبدأ بسؤال.</em></>}</h2><div className="contact-card"><div className="contact-item"><MapPin size={19} /><div><strong>{lang === 'en' ? 'Amman office' : 'مكتب عمّان'}</strong><span>{lang === 'en' ? 'King Abdullah II Street, Amman, Jordan' : 'شارع الملك عبدالله الثاني، عمّان، الأردن'}</span></div></div><div className="contact-item"><Mail size={19} /><div><strong>{lang === 'en' ? 'Write to us' : 'راسلنا'}</strong><a href="mailto:ezzaldein1980@gmail.com" data-testid="link-contact-email">ezzaldein1980@gmail.com</a></div></div><div className="contact-item"><Clock3 size={19} /><div><strong>{lang === 'en' ? 'Shipment desk' : 'مكتب متابعة الشحنات'}</strong><span>{lang === 'en' ? 'Available 24 hours, 7 days a week' : 'متاح 24 ساعة، 7 أيام في الأسبوع'}</span></div></div></div></div></Reveal><Reveal><div className="contact-form">{sent ? <div className="form-success"><Check size={28} /><h3>{lang === 'en' ? 'Email draft ready.' : 'تم تجهيز رسالة البريد الإلكتروني.'}</h3><p className={lang === 'ar' ? 'arabic' : ''}>{lang === 'en' ? 'Your email app should open with the inquiry addressed to ezzaldein1980@gmail.com. Send it to complete your request.' : 'سيتم فتح تطبيق البريد الإلكتروني برسالة موجهة إلى ezzaldein1980@gmail.com. أرسلها لإكمال طلبك.'}</p><button className="button-primary" onClick={() => setSent(false)} data-testid="button-send-another">{lang === 'en' ? 'Send another inquiry' : 'إرسال استفسار آخر'}</button></div> : <><h2 className="form-title">{lang === 'en' ? 'Tell us about the move.' : 'أخبرنا عن شحنتك.'}</h2><form onSubmit={handleSubmit}><div className="form-grid"><div className="field"><label htmlFor="contact-name">{lang === 'en' ? 'Your name' : 'الاسم'}</label><input id="contact-name" name="name" required placeholder={lang === 'en' ? 'Full name' : 'الاسم الكامل'} data-testid="input-contact-name" /></div><div className="field"><label htmlFor="contact-company">{lang === 'en' ? 'Company' : 'الشركة'}</label><input id="contact-company" name="company" required placeholder={lang === 'en' ? 'Company name' : 'اسم الشركة'} data-testid="input-contact-company" /></div><div className="field"><label htmlFor="contact-email">{lang === 'en' ? 'Work email' : 'البريد الإلكتروني'}</label><input id="contact-email" name="email" type="email" required placeholder="name@company.com" data-testid="input-contact-email" /></div><div className="field"><label htmlFor="contact-service">{lang === 'en' ? 'Service needed' : 'الخدمة المطلوبة'}</label><select id="contact-service" name="service" defaultValue="" data-testid="select-contact-service"><option value="" disabled>{lang === 'en' ? 'Select one' : 'اختر الخدمة'}</option>{services.map((service) => <option value={service.no} key={service.no}>{text(service.title, lang)}</option>)}</select></div><div className="field full"><label htmlFor="contact-message">{lang === 'en' ? 'The brief' : 'التفاصيل'}</label><textarea id="contact-message" name="message" required placeholder={lang === 'en' ? 'Origin, destination, timing and anything we should know...' : 'بلد المنشأ، الوجهة، الموعد وأي تفاصيل مهمة...'} data-testid="textarea-contact-message" /></div></div><button type="submit" className="button-primary form-submit" data-testid="button-submit-contact">{lang === 'en' ? 'Send inquiry' : 'إرسال الاستفسار'} <Send size={15} className="arrow-icon" /></button></form></>}</div></Reveal></div></section>
  </main>;
}

function Router({ lang }: { lang: Language }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}><Switch><WouterRoute path="/" component={() => <Home lang={lang} />} /><WouterRoute path="/services" component={() => <Services lang={lang} />} /><WouterRoute path="/contact" component={() => <Contact lang={lang} />} /><WouterRoute component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  const [lang, setLang] = useState<Language>(() => (localStorage.getItem('masar-language') as Language) || 'en');
  const toggleLanguage = () => setLang((current) => { const next = current === 'en' ? 'ar' : 'en'; localStorage.setItem('masar-language', next); return next; });
  useEffect(() => { document.documentElement.lang = lang; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'; }, [lang]);
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><div className={`site-shell ${lang === 'ar' ? 'arabic' : ''}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}><Header lang={lang} onLanguageChange={toggleLanguage} /><Router lang={lang} /><Footer lang={lang} /></div></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;