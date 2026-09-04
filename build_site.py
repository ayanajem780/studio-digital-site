# -*- coding: utf-8 -*-
"""
Générateur des pages intérieures du site ANDIGITAL.
Usage : python3 build_site.py
Régénère : services.html, les 16 pages service-*.html, about.html,
work.html, process.html, contact.html, faq.html.
N'écrit PAS index.html (édité à la main pour préserver le Hero).
"""
import os

ROOT = os.path.dirname(os.path.abspath(__file__))

FONTS_LINK = (
    '<link rel="preconnect" href="https://fonts.googleapis.com">\n'
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
    '<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,500;0,600;0,700;1,500&family=Work+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600&display=swap" rel="stylesheet">'
)

NAV_ITEMS = [
    ("index.html", "Home"),
    ("about.html", "About"),
    ("services.html", "Services"),
    ("work.html", "Work"),
    ("process.html", "Process"),
    ("faq.html", "FAQ"),
]


def header(active):
    links = []
    for href, label in NAV_ITEMS:
        cls = "nav-link is-active" if href == active else "nav-link"
        links.append(f'      <a href="{href}" class="{cls}">{label}</a>')
    links_html = "\n".join(links)
    return f'''<header class="site-header" id="siteHeader">
  <div class="container header-inner">
    <a href="index.html" class="brand">
      <svg class="brand-mark" viewBox="0 0 32 32" width="26" height="26" aria-hidden="true">
        <path d="M5 23C5 15 27 17 27 9" fill="none" class="svg-stroke-green" stroke-width="2.2" stroke-linecap="round"/>
        <circle cx="27" cy="9" r="3" class="svg-fill-pink"/>
      </svg>
      <span class="brand-name">AN<em>DIGITAL</em></span>
    </a>

    <nav class="main-nav" id="mainNav">
{links_html}
      <a href="contact.html" class="btn btn--primary btn--small">Start a Project</a>
    </nav>

    <button class="nav-toggle" id="navToggle" aria-label="Ouvrir le menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>'''


FOOTER = '''<footer class="site-footer">
  <div class="container footer-inner">
    <div class="footer-brand">
      <a href="index.html" class="brand">
        <svg class="brand-mark" viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
          <path d="M5 23C5 15 27 17 27 9" fill="none" class="svg-stroke-green" stroke-width="2.2" stroke-linecap="round"/>
          <circle cx="27" cy="9" r="3" class="svg-fill-pink"/>
        </svg>
        <span class="brand-name">AN<em>DIGITAL</em></span>
      </a>
      <p class="footer-tagline">Agence de marketing, branding et création digitale basée à Agadir — 16 expertises, un seul interlocuteur, une stratégie cohérente du positionnement jusqu'à la croissance.</p>
    </div>

    <div class="footer-col">
      <h4 class="footer-col-title">Contact</h4>
      <a href="https://wa.me/212600000000" target="_blank" rel="noopener">WhatsApp</a>
      <a href="mailto:contact@studio-digital.com">contact@studio-digital.com</a>
      <span class="footer-static">Agadir, Maroc</span>
    </div>

    <div class="footer-col">
      <h4 class="footer-col-title">Agence</h4>
      <a href="about.html">About</a>
      <a href="services.html">Services</a>
      <a href="work.html">Work</a>
      <a href="process.html">Process</a>
    </div>

    <div class="footer-col">
      <h4 class="footer-col-title">Ressources</h4>
      <a href="faq.html">FAQ</a>
      <a href="contact.html">Contact</a>
    </div>
  </div>
  <div class="container footer-bottom">
    <p>&copy; <span id="year"></span> ANDIGITAL. Tous droits réservés.</p>
  </div>
</footer>

<!-- Barre CTA sticky mobile -->
<div class="mobile-cta-bar">
  <a href="https://wa.me/212600000000" target="_blank" rel="noopener" class="mobile-cta mobile-cta--ghost">WhatsApp</a>
  <a href="contact.html" class="mobile-cta mobile-cta--primary">Start a Project</a>
</div>

<script src="./main.js" defer></script>'''


def page(title, description, canonical, active_nav, body, extra_head=""):
    return f'''<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<meta name="description" content="{description}">
<link rel="canonical" href="https://studio-digital-site.vercel.app/{canonical}">

<!-- Fonts -->
{FONTS_LINK}

<link rel="stylesheet" href="styles.css">
{extra_head}</head>
<body>

{header(active_nav)}

<main>

{body}

</main>

{FOOTER}
</body>
</html>
'''


def page_hero(kicker, h1, lead, compact=False, extra_bg=True):
    cls = "page-hero page-hero--compact" if compact else "page-hero"
    bg = '''    <div class="hero-bg">
      <div class="hero-grid"></div>
      <div class="hero-glow hero-glow--green"></div>
      <div class="hero-glow hero-glow--pink"></div>
    </div>

''' if extra_bg else ""
    return f'''<section class="{cls}">
{bg}    <div class="container page-hero-inner">
      <p class="page-hero-kicker" data-reveal>{kicker}</p>
      <h1 data-reveal>{h1}</h1>
      <p class="page-hero-lead" data-reveal>{lead}</p>
    </div>
</section>'''


# =====================================================================
# DONNÉES — LES 16 SERVICES (source unique)
# =====================================================================

SERVICES = [
    dict(
        num="01", slug="marketing-strategy", title="Marketing Strategy",
        short="La direction qui rend chaque action rentable, pas seulement visible.",
        icon='<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
        what=[
            "Diagnostic de votre marché, de votre positionnement actuel et de vos concurrents directs",
            "Définition précise de votre cible et de ce qui la fait acheter",
            "Construction d'un plan d'acquisition priorisé par canal et par budget",
            "Fixation d'objectifs mesurables à 3, 6 et 12 mois",
            "Feuille de route trimestrielle ajustée selon les résultats réels",
        ],
        results=[
            "Une stratégie écrite, pas une intuition",
            "Des budgets alloués aux canaux qui convertissent réellement",
            "Une équipe qui sait exactement quoi exécuter et pourquoi",
            "Une trajectoire de croissance mesurable, pas un coup ponctuel",
        ],
        cta="Construire votre stratégie",
        meta="Stratégie marketing à Agadir et au Maroc : positionnement, cible, acquisition et plan de croissance construits par ANDIGITAL.",
    ),
    dict(
        num="02", slug="branding-identity", title="Branding & Identity",
        short="Une identité que l'on reconnaît avant même de lire le nom.",
        icon='<path d="M12 3l3 6 6 1-4.5 4.3L17.5 21 12 17.8 6.5 21l1-6.7L3 10l6-1z"/>',
        what=[
            "Positionnement de marque et territoire de différenciation",
            "Naming et vérification de disponibilité, lorsque nécessaire",
            "Conception du logo, du système d'identité visuelle et de la palette",
            "Direction artistique, typographie et charte graphique complète",
            "Déclinaisons packaging, supports imprimés et brand guidelines",
        ],
        results=[
            "Une marque cohérente sur tous les points de contact",
            "Une charte que vos équipes et prestataires peuvent appliquer sans vous",
            "Une image qui reflète le positionnement réel de votre entreprise",
            "Une base solide pour toute future création — site, publicité, contenu",
        ],
        cta="Construire votre identité",
        meta="Branding et identité visuelle à Agadir : logo, charte graphique, direction artistique et brand guidelines par ANDIGITAL.",
    ),
    dict(
        num="03", slug="web-design-development", title="Web Design & Development",
        short="Un site pensé pour convertir, pas seulement pour exister.",
        icon='<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 8h18"/><path d="M8 13l2.5 2.5L8 18M14 13l2.5 2.5L14 18"/>',
        what=[
            "Recherche UX et architecture de l'information",
            "Design UI sur mesure — site vitrine, landing page ou e-commerce",
            "Développement responsive optimisé mobile, tablette et desktop",
            "Intégration des outils de conversion (formulaires, CRM, paiement, tracking)",
            "Optimisation continue de la vitesse et des performances techniques",
        ],
        results=[
            "Un site qui reflète votre positionnement, pas un template générique",
            "Une expérience fluide sur tous les écrans",
            "Des parcours pensés pour générer des leads ou des ventes",
            "Une base technique propre, évolutive et facile à maintenir",
        ],
        cta="Lancer votre site",
        meta="Création de sites web à Agadir : UX/UI, landing pages, sites vitrines et e-commerce responsives par ANDIGITAL.",
    ),
    dict(
        num="04", slug="social-media-management", title="Social Media Management",
        short="Une présence régulière qui construit une vraie communauté, pas juste des vues.",
        icon='<rect x="7" y="2" width="10" height="20" rx="3"/><path d="M11 18h2"/>',
        what=[
            "Stratégie social media alignée sur vos objectifs business",
            "Calendrier éditorial mensuel par plateforme",
            "Création et publication : posts, stories, Reels",
            "Community management et modération des échanges",
            "Reporting mensuel avec lecture des performances",
        ],
        results=[
            "Une présence cohérente, sans improvisation semaine après semaine",
            "Une audience qui s'engage, pas seulement qui défile",
            "Une marque reconnaissable sur chaque plateforme",
            "Des données claires pour ajuster la stratégie chaque mois",
        ],
        cta="Gérer vos réseaux",
        meta="Gestion des réseaux sociaux à Agadir : stratégie, calendrier éditorial, community management et reporting par ANDIGITAL.",
    ),
    dict(
        num="05", slug="content-creation", title="Content Creation",
        short="Du contenu conçu pour arrêter le scroll et servir une stratégie.",
        icon='<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5-9 9"/>',
        what=[
            "Développement de concepts créatifs alignés sur votre positionnement",
            "Production de visuels, carrousels et formats courts",
            "Rédaction adaptée à chaque plateforme et chaque objectif",
            "Déclinaison d'une même campagne en formats multiples",
            "Banque de contenus prête à publier, planifiée à l'avance",
        ],
        results=[
            "Un fil éditorial cohérent au lieu de publications isolées",
            "Des contenus qui servent un objectif précis — notoriété, conversion, rétention",
            "Une identité visuelle respectée sur chaque publication",
            "Moins de temps passé à improviser, plus de temps à décider",
        ],
        cta="Créer vos contenus",
        meta="Création de contenu digital à Agadir : visuels, carrousels, rédaction et concepts créatifs par ANDIGITAL.",
    ),
    dict(
        num="06", slug="photography", title="Photography",
        short="Des visuels qui donnent envie d'acheter avant même de lire la description.",
        icon='<path d="M4 8h3l2-2h6l2 2h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
        what=[
            "Shootings produit, food, corporate et lifestyle",
            "Photographie immobilière et événementielle",
            "Portraits d'équipe et de dirigeants",
            "Direction artistique du shooting, du brief au décor",
            "Retouche et étalonnage cohérents avec votre identité visuelle",
        ],
        results=[
            "Une banque d'images qui vous appartient et que vous réutilisez partout",
            "Des visuels au niveau de vos ambitions, pas de simples photos de téléphone",
            "Une cohérence visuelle entre site, réseaux sociaux et publicité",
            "Une image de marque perçue comme sérieuse et établie",
        ],
        cta="Réserver un shooting",
        meta="Photographie professionnelle à Agadir : produit, corporate, lifestyle et événementiel par ANDIGITAL.",
    ),
    dict(
        num="07", slug="videography-video-editing", title="Videography & Video Editing",
        short="Des vidéos qui retiennent l'attention plus de trois secondes.",
        icon='<rect x="3" y="5" width="14" height="14" rx="2"/><path d="M17 9l4-2v10l-4-2"/>',
        what=[
            "Vidéos publicitaires, corporate et produits",
            "Captation d'événements et interviews",
            "Formats courts pour Reels et TikTok",
            "Montage, motion design et habillage graphique",
            "Color grading et mixage audio",
        ],
        results=[
            "Des vidéos prêtes à performer sur chaque plateforme",
            "Un rythme de montage adapté aux usages actuels",
            "Une identité visuelle et sonore cohérente d'une vidéo à l'autre",
            "Un contenu réutilisable en publicité, sur le site et en interne",
        ],
        cta="Produire votre vidéo",
        meta="Vidéographie et montage vidéo à Agadir : publicités, corporate, Reels et TikTok par ANDIGITAL.",
    ),
    dict(
        num="08", slug="advertising-paid-media", title="Advertising & Paid Media",
        short="Des campagnes qui rapportent plus qu'elles ne coûtent.",
        icon='<path d="M3 10v4h3l6 4V6l-6 4H3z"/><path d="M16 9a4 4 0 010 6"/>',
        what=[
            "Stratégie publicitaire Meta, Instagram, Facebook, TikTok, Google et YouTube Ads",
            "Création des visuels et messages publicitaires",
            "Structuration des campagnes par objectif — notoriété, trafic, conversion",
            "Suivi quotidien et optimisation des enchères et audiences",
            "Reporting avec lecture du coût par résultat et du retour réel",
        ],
        results=[
            "Des campagnes rentables, pas seulement des impressions",
            "Un budget publicitaire dépensé sur ce qui convertit réellement",
            "Des audiences affinées au fil des données collectées",
            "Une génération de leads ou de ventes mesurable",
        ],
        cta="Lancer vos campagnes",
        meta="Publicité digitale à Agadir : Meta Ads, Google Ads et TikTok Ads gérés par ANDIGITAL pour générer des conversions.",
    ),
    dict(
        num="09", slug="media-buying", title="Media Buying",
        short="Le bon message, à la bonne audience, au meilleur prix.",
        icon='<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6"/><path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>',
        what=[
            "Planification média multi-plateformes selon votre budget",
            "Négociation et achat d'espaces publicitaires",
            "Répartition du budget entre canaux selon leur performance réelle",
            "Segmentation et ciblage des audiences",
            "Stratégies de retargeting sur les visiteurs et prospects existants",
        ],
        results=[
            "Un budget publicitaire optimisé, pas dispersé",
            "Une audience touchée au bon moment du parcours d'achat",
            "Moins de budget perdu sur des impressions non qualifiées",
            "Une performance suivie canal par canal, en continu",
        ],
        cta="Optimiser votre budget média",
        meta="Media buying à Agadir : planification, achat d'espace publicitaire et optimisation des audiences par ANDIGITAL.",
    ),
    dict(
        num="10", slug="seo-web-visibility", title="SEO & Web Visibility",
        short="Être trouvé au moment exact où l'on vous cherche.",
        icon='<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
        what=[
            "Audit technique SEO complet du site",
            "Optimisation on-page — structure, balises, maillage interne",
            "Recherche et intégration de mots-clés pertinents pour votre marché",
            "Référencement local — Google Business Profile, avis, citations",
            "Suivi des positions et de la visibilité dans le temps",
        ],
        results=[
            "Un site techniquement sain pour les moteurs de recherche",
            "Une visibilité accrue sur les recherches liées à votre activité",
            "Un trafic organique qui ne dépend pas uniquement de la publicité",
            "Une présence locale renforcée à Agadir et au Maroc",
        ],
        cta="Améliorer votre visibilité",
        meta="SEO et visibilité web à Agadir : référencement technique, local et de contenu par ANDIGITAL.",
    ),
    dict(
        num="11", slug="copywriting", title="Copywriting",
        short="Les mots qui font la différence entre lu et ignoré.",
        icon='<path d="M4 20h4L18.5 9.5a2.1 2.1 0 000-3L18 6a2.1 2.1 0 00-3 0L4.5 16.5z"/><path d="M13.5 7.5l3 3"/>',
        what=[
            "Rédaction de textes publicitaires et de slogans",
            "Écriture de pages de vente et de landing pages",
            "Scripts vidéo et légendes pour réseaux sociaux",
            "Newsletters et séquences email",
            "Storytelling de marque et messages commerciaux clés",
        ],
        results=[
            "Un discours de marque cohérent sur tous les supports",
            "Des messages qui parlent directement à votre cible",
            "Des textes qui poussent à l'action, pas seulement à lire",
            "Une voix de marque reconnaissable, quel que soit le format",
        ],
        cta="Écrire vos messages",
        meta="Copywriting à Agadir : textes publicitaires, pages de vente et storytelling de marque par ANDIGITAL.",
    ),
    dict(
        num="12", slug="lead-generation-sales", title="Lead Generation & Sales",
        short="Des prospects qualifiés, livrés dans un tunnel qui les convertit.",
        icon='<path d="M3 4h18l-7 9v6l-4 2v-8z"/>',
        what=[
            "Construction de tunnels de conversion et de pages de capture",
            "Mise en place de campagnes de prospection ciblées",
            "Qualification des leads selon des critères définis ensemble",
            "Prise de rendez-vous et suivi commercial",
            "Intégration et suivi CRM du parcours prospect",
        ],
        results=[
            "Un flux de prospects qualifiés, pas seulement des contacts",
            "Un parcours commercial structuré, du premier clic à la signature",
            "Moins de temps perdu sur des leads qui ne convertiront jamais",
            "Une visibilité claire sur le coût d'acquisition de chaque client",
        ],
        cta="Générer des leads",
        meta="Génération de leads et aide à la vente à Agadir : tunnels de conversion et CRM par ANDIGITAL.",
    ),
    dict(
        num="13", slug="creative-direction", title="Creative Direction",
        short="Une cohérence visuelle qui tient sur douze mois, pas sur une seule campagne.",
        icon='<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2.5 6-6 2.5 2.5-6z"/>',
        what=[
            "Direction artistique globale de la marque",
            "Développement de concepts de campagne",
            "Création de moodboards et de références visuelles",
            "Supervision de la production créative — photo, vidéo, design",
            "Garantie de cohérence entre tous les livrables et supports",
        ],
        results=[
            "Une identité de campagne forte, du brief à la diffusion",
            "Une cohérence visuelle même avec plusieurs prestataires impliqués",
            "Des créations qui servent la stratégie, pas l'inverse",
            "Une direction claire pour chaque nouvelle initiative créative",
        ],
        cta="Cadrer votre direction créative",
        meta="Direction artistique et direction créative à Agadir : concepts de campagne et supervision créative par ANDIGITAL.",
    ),
    dict(
        num="14", slug="influencer-marketing", title="Influencer Marketing",
        short="Une crédibilité empruntée aux bonnes voix, pas aux plus grosses audiences.",
        icon='<circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6"/><path d="M17.5 5.5a3 3 0 010 5"/>',
        what=[
            "Définition de la stratégie d'influence adaptée à votre cible",
            "Sélection de profils pertinents selon l'audience et l'alignement de marque",
            "Rédaction de briefs créatifs clairs pour chaque collaboration",
            "Coordination des campagnes et des livrables",
            "Suivi des performances et de l'impact réel sur la marque",
        ],
        results=[
            "Des collaborations alignées avec votre positionnement, pas opportunistes",
            "Une audience touchée par des voix en qui elle a déjà confiance",
            "Des contenus réutilisables au-delà de la publication initiale",
            "Une lecture claire du retour de chaque collaboration",
        ],
        cta="Lancer une campagne d'influence",
        meta="Marketing d'influence à Agadir : sélection de profils, briefs et suivi de campagnes par ANDIGITAL.",
    ),
    dict(
        num="15", slug="analytics-performance", title="Analytics & Performance",
        short="Des décisions basées sur des chiffres, pas sur des impressions.",
        icon='<path d="M4 20V10M10 20V4M16 20v-7M2 20h20"/>',
        what=[
            "Mise en place du tracking sur site et campagnes",
            "Définition des KPI pertinents pour votre activité",
            "Analyse du trafic, des conversions et du comportement utilisateur",
            "Reporting régulier et lisible, sans jargon inutile",
            "Recommandations d'optimisation continue basées sur la donnée",
        ],
        results=[
            "Une visibilité claire sur ce qui fonctionne réellement",
            "Des budgets réorientés vers les actions les plus rentables",
            "Un ROI mesurable, canal par canal",
            "Une amélioration continue, pas des décisions au hasard",
        ],
        cta="Analyser votre performance",
        meta="Analytics et suivi de performance à Agadir : tracking, KPI et reporting par ANDIGITAL.",
    ),
    dict(
        num="16", slug="corporate-communication", title="Corporate Communication",
        short="Une communication institutionnelle qui inspire confiance, en interne comme en externe.",
        icon='<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/>',
        what=[
            "Rédaction de supports de communication institutionnelle",
            "Conception de présentations et pitch decks",
            "Création de brochures et documents commerciaux",
            "Structuration de la communication de marque globale",
            "Cohérence des messages entre équipes, partenaires et clients",
        ],
        results=[
            "Des supports professionnels qui reflètent votre sérieux",
            "Une communication alignée entre tous vos interlocuteurs",
            "Des présentations qui appuient vos décisions commerciales",
            "Une image institutionnelle à la hauteur de vos ambitions",
        ],
        cta="Structurer votre communication",
        meta="Communication corporate à Agadir : pitch decks, brochures et communication institutionnelle par ANDIGITAL.",
    ),
]

for i, s in enumerate(SERVICES):
    s["prev"] = SERVICES[i - 1] if i > 0 else SERVICES[-1]
    s["next"] = SERVICES[(i + 1) % len(SERVICES)]


def check_list(items, dark=False):
    cls = "check-list check-list--onDark" if dark else "check-list"
    lis = "\n".join(
        f'''          <li>
            <span class="check-list-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 13l4 4L19 7"/></svg>
            </span>
            <span>{item}</span>
          </li>'''
        for item in items
    )
    return f'<ul class="{cls}">\n{lis}\n        </ul>'


def render_service_page(s):
    others = [x for x in SERVICES if x["slug"] != s["slug"]]
    related = others[:4]
    related_html = "\n".join(
        f'          <a href="service-{r["slug"]}.html">{r["title"]}</a>' for r in related
    )
    body = f'''{page_hero(
        f'<a href="services.html">Services</a> <span class="sep">/</span> {s["title"]}',
        s["title"],
        s["short"],
        compact=True,
    )}

<section class="split-section">
  <div class="container split-grid">
    <div data-reveal>
      <p class="section-kicker section-kicker--num"><span>01</span> Ce que nous faisons</p>
      <h2 class="split-grid-title">Notre prise en charge</h2>
      {check_list(s["what"])}
    </div>
    <div data-reveal>
      <p class="section-kicker section-kicker--num"><span>02</span> Résultats recherchés</p>
      <h2 class="split-grid-title">Ce que vous obtenez</h2>
      {check_list(s["results"])}
      <a href="contact.html" class="btn btn--primary" style="margin-top:28px;">{s["cta"]}</a>
    </div>
  </div>
</section>

<section class="split-section split-section--alt">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="section-kicker section-kicker--num"><span>03</span> Autres expertises</p>
      <h2 class="section-title">Une expertise se combine rarement seule</h2>
    </div>
    <div class="related-services" data-reveal>
{related_html}
      <a href="services.html">Voir les 16 expertises →</a>
    </div>
  </div>
</section>

<section class="cta-banner">
  <div class="container">
    <h2>Prêt à discuter de {s["title"]} pour votre marque&nbsp;?</h2>
    <a href="contact.html" class="btn btn--primary btn--large">Discuss Your Project</a>
  </div>
</section>'''
    return page(
        title=f'{s["title"]} — ANDIGITAL, agence à Agadir',
        description=s["meta"],
        canonical=f'service-{s["slug"]}.html',
        active_nav="services.html",
        body=body,
    )


def render_services_hub():
    cards = []
    for s in SERVICES:
        cards.append(f'''      <a href="service-{s["slug"]}.html" class="service-card" data-reveal>
        <span class="service-card-num">{s["num"]}</span>
        <span class="service-card-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6">{s["icon"]}</svg>
        </span>
        <h3>{s["title"]}</h3>
        <p>{s["short"]}</p>
        <span class="service-card-arrow">En savoir plus <span aria-hidden="true">→</span></span>
      </a>''')
    cards_html = "\n".join(cards)
    body = f'''{page_hero(
        "Nos expertises",
        "16 expertises. Une seule agence à piloter.",
        "Stratégie, création, production et acquisition : chaque expertise est disponible seule ou combinée dans un plan cohérent. Vous ne gérez qu'un seul interlocuteur, responsable du résultat d'ensemble.",
    )}

<section class="split-section">
  <div class="container">
    <div class="service-grid">
{cards_html}
    </div>
  </div>
</section>

<section class="cta-banner">
  <div class="container">
    <h2>Une expertise en tête, ou un plan complet à construire&nbsp;?</h2>
    <a href="contact.html" class="btn btn--primary btn--large">Discuss Your Project</a>
  </div>
</section>'''
    return page(
        title="Services — Marketing, branding, création digitale | ANDIGITAL",
        description="Les 16 expertises d'ANDIGITAL : stratégie marketing, branding, web design, réseaux sociaux, publicité, SEO, vidéo, photographie et plus, pour les marques au Maroc.",
        canonical="services.html",
        active_nav="services.html",
        body=body,
    )


def render_about():
    body = f'''{page_hero(
        "About ANDIGITAL",
        "Une agence construite pour que vos décisions de marque cessent d'être dispersées.",
        "ANDIGITAL est née d'un constat simple : les entreprises qui grandissent au Maroc jonglent trop souvent entre un designer, un community manager, un développeur et une agence média — sans qu'aucun ne voie l'ensemble. Nous existons pour être ce point de vue d'ensemble.",
    )}

<section class="split-section">
  <div class="container split-grid">
    <div data-reveal>
      <p class="section-kicker section-kicker--num"><span>01</span> Qui nous sommes</p>
      <h2 class="split-grid-title">Une agence de marketing, branding et création digitale</h2>
      <p>ANDIGITAL accompagne des entrepreneurs, des marques en croissance et des PME marocaines qui veulent construire une présence de marque cohérente — du positionnement stratégique jusqu'à l'acquisition de clients. Nous intégrons 16 expertises sous un même toit pour qu'aucune décision créative ne contredise une décision marketing, et inversement.</p>
    </div>
    <div data-reveal>
      <p class="section-kicker section-kicker--num"><span>02</span> Notre vision</p>
      <h2 class="split-grid-title">Le Maroc mérite des marques au niveau international</h2>
      <p>Nous pensons que le marché marocain n'a pas besoin de moins d'ambition créative que les standards internationaux — seulement d'une exécution qui comprend son contexte local. C'est cette double exigence, premium et ancrée, qui définit chaque projet que nous livrons.</p>
    </div>
  </div>
</section>

<section class="split-section split-section--alt">
  <div class="container split-grid">
    <div data-reveal>
      <p class="section-kicker section-kicker--num"><span>03</span> Notre mission</p>
      <h2 class="split-grid-title">Faire de chaque marque cliente un cas cohérent, pas une collection de prestations</h2>
      <p>Notre mission est de remplacer la juxtaposition de prestataires par une stratégie unique, appliquée avec discipline sur tous les canaux : identité, site, contenu, publicité et suivi de performance.</p>
    </div>
    <div data-reveal>
      <p class="section-kicker section-kicker--num"><span>04</span> Notre ambition</p>
      <h2 class="split-grid-title">Devenir la référence des marques ambitieuses à Agadir et au-delà</h2>
      <p>Nous construisons ANDIGITAL projet après projet, avec l'objectif de devenir l'agence de référence pour toute entreprise marocaine qui refuse de traiter son image comme une case à cocher.</p>
    </div>
  </div>
</section>

<section class="split-section">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="section-kicker section-kicker--num"><span>05</span> Nos valeurs</p>
      <h2 class="section-title">Ce qui ne bouge pas, quel que soit le projet</h2>
    </div>
    <div class="feature-grid">
      <div class="feature-card" data-reveal>
        <span class="feature-card-num">01</span>
        <h3>Stratégie avant esthétique</h3>
        <p>Un visuel réussi qui ne sert aucun objectif business n'est pas un livrable pour nous — c'est un brief incomplet.</p>
      </div>
      <div class="feature-card" data-reveal>
        <span class="feature-card-num">02</span>
        <h3>Transparence sur les résultats</h3>
        <p>Nous montrons ce qui fonctionne et ce qui ne fonctionne pas — pas seulement ce qui est confortable à présenter.</p>
      </div>
      <div class="feature-card" data-reveal>
        <span class="feature-card-num">03</span>
        <h3>Un seul standard, pas deux</h3>
        <p>Le niveau d'exigence ne change pas entre un petit budget de lancement et un plan de croissance complet.</p>
      </div>
      <div class="feature-card" data-reveal>
        <span class="feature-card-num">04</span>
        <h3>Responsabilité du résultat d'ensemble</h3>
        <p>Quand 16 expertises sont pilotées par une seule agence, il n'y a plus d'excuse pour un maillon incohérent.</p>
      </div>
    </div>
  </div>
</section>

<section class="split-section split-section--dark">
  <div class="container split-grid">
    <div data-reveal>
      <p class="section-kicker section-kicker--num section-kicker--light"><span>06</span> Notre approche</p>
      <h2 class="split-grid-title">Discover, Strategize, Create, Launch, Optimize, Grow</h2>
      <p>Chaque collaboration suit le même cadre en six étapes, quel que soit le nombre d'expertises mobilisées. Cette discipline est ce qui nous permet de rester cohérents même sur des projets complexes.</p>
      <a href="process.html" class="portfolio-see-all portfolio-see-all--light" style="margin-top:8px;">Voir notre méthode en détail <span aria-hidden="true">→</span></a>
    </div>
    <div data-reveal>
      <p class="section-kicker section-kicker--num section-kicker--light"><span>07</span> Pourquoi ANDIGITAL existe</p>
      <h2 class="split-grid-title">Parce que la dispersion coûte plus cher que la coordination</h2>
      <p>Chaque prestataire supplémentaire ajoute un point de friction : un brief à répéter, une charte à réexpliquer, une priorité à réaligner. ANDIGITAL existe pour retirer cette friction et remettre la marque, pas les prestataires, au centre des décisions.</p>
    </div>
  </div>
</section>

<section class="cta-banner">
  <div class="container">
    <h2>Envie de construire votre marque avec une seule équipe responsable&nbsp;?</h2>
    <a href="contact.html" class="btn btn--primary btn--large">Work With Us</a>
  </div>
</section>'''
    return page(
        title="About — Qui nous sommes | ANDIGITAL, agence à Agadir",
        description="Découvrez ANDIGITAL : notre vision, notre mission, nos valeurs et notre approche pour construire des marques cohérentes au Maroc, du positionnement à la croissance.",
        canonical="about.html",
        active_nav="about.html",
        body=body,
    )


def render_process():
    steps = [
        ("01", "Discover", "Nous commençons par comprendre, pas par produire.",
         ["Analyse de votre marché, de vos concurrents directs et de votre positionnement actuel",
          "Entretiens pour cerner vos objectifs réels, pas seulement votre brief initial",
          "Audit de votre présence digitale existante — site, réseaux, publicité, contenu"]),
        ("02", "Strategize", "Un plan écrit, chiffré et priorisé — jamais une intuition.",
         ["Définition de la cible, du message et des canaux prioritaires",
          "Construction d'une feuille de route à 3, 6 et 12 mois",
          "Allocation budgétaire par expertise et par canal"]),
        ("03", "Create", "La production ne commence qu'une fois la direction validée.",
         ["Identité de marque, contenu, site ou campagnes selon ce que la stratégie exige",
          "Un seul fil créatif, quel que soit le nombre de livrables",
          "Validation par étapes pour éviter les allers-retours inutiles"]),
        ("04", "Launch", "La mise en ligne est un moment suivi, pas un simple envoi de fichiers.",
         ["Déploiement technique et vérification complète avant diffusion",
          "Coordination du lancement sur tous les canaux concernés",
          "Préparation du tracking pour mesurer dès le premier jour"]),
        ("05", "Optimize", "Les premières semaines révèlent ce que la théorie ne peut pas prédire.",
         ["Analyse des données réelles de trafic, conversion et engagement",
          "Ajustements sur les campagnes, le contenu ou le parcours utilisateur",
          "Reporting clair, sans jargon inutile"]),
        ("06", "Grow", "Une fois ce qui fonctionne identifié, nous poussons dessus.",
         ["Réallocation du budget vers les leviers les plus rentables",
          "Extension progressive à de nouvelles expertises ou de nouveaux canaux",
          "Revue stratégique régulière pour maintenir la cohérence d'ensemble"]),
    ]
    blocks = []
    for num, title, lead, items in steps:
        blocks.append(f'''      <li class="process-detail-row" data-reveal>
        <div class="process-detail-head">
          <span class="process-num">n°{num}</span>
          <h2>{title}</h2>
          <p>{lead}</p>
        </div>
        {check_list(items)}
      </li>''')
    blocks_html = "\n".join(blocks)
    body = f'''{page_hero(
        "Notre méthode",
        "Un processus en six étapes, appliqué à chaque projet.",
        "Que le projet mobilise une seule expertise ou les seize, la méthode ne change pas. C'est cette discipline qui garantit la cohérence, du premier échange jusqu'à la croissance mesurée.",
    )}

<section class="split-section">
  <div class="container">
    <ol class="process-detail-list">
{blocks_html}
    </ol>
  </div>
</section>

<section class="cta-banner">
  <div class="container">
    <h2>Prêt à démarrer par l'étape Discover&nbsp;?</h2>
    <a href="contact.html" class="btn btn--primary btn--large">Start a Project</a>
  </div>
</section>'''
    return page(
        title="Process — Notre méthode de travail | ANDIGITAL",
        description="Discover, Strategize, Create, Launch, Optimize, Grow : découvrez le processus en six étapes d'ANDIGITAL pour construire et développer votre marque.",
        canonical="process.html",
        active_nav="process.html",
        body=body,
    )


def render_work():
    categories = ["Branding", "Websites", "Social Media", "Photography", "Video", "Advertising"]
    filter_buttons = ['      <button data-filter="all" class="is-active">Tout</button>']
    for c in categories:
        slug = c.lower().replace(" ", "-")
        filter_buttons.append(f'      <button data-filter="{slug}">{c}</button>')
    filters_html = "\n".join(filter_buttons)

    cards = []
    for c in categories:
        slug = c.lower().replace(" ", "-")
        cards.append(f'''      <article class="work-card" data-category="{slug}" data-status="ready" data-reveal>
        <span class="work-card-cat">{c}</span>
        <h3>Cette catégorie accueille nos prochaines réalisations</h3>
        <p>Nous documentons chaque projet {c.lower()} avec son contexte, la stratégie retenue et les résultats mesurés — publié dès la première collaboration finalisée.</p>
      </article>''')
    cards_html = "\n".join(cards)

    body = f'''{page_hero(
        "Work",
        "Un portfolio qui se construit projet après projet.",
        "Chaque réalisation publiée ici présente son contexte réel, le problème posé, la stratégie retenue, la solution livrée et le résultat obtenu — jamais de chiffres inventés. Les catégories ci-dessous sont prêtes à recevoir nos prochains projets clients.",
    )}

<section class="split-section">
  <div class="container">
    <div class="work-filter">
{filters_html}
    </div>
    <div class="work-grid">
{cards_html}
    </div>
  </div>
</section>

<section class="cta-banner">
  <div class="container">
    <h2>Votre projet pourrait être notre prochaine étude de cas&nbsp;?</h2>
    <a href="contact.html" class="btn btn--primary btn--large">Let's Build Your Brand</a>
  </div>
</section>'''
    return page(
        title="Work — Portfolio | ANDIGITAL, agence à Agadir",
        description="Le portfolio ANDIGITAL : branding, sites web, réseaux sociaux, photographie, vidéo et publicité — projets réels, contexte, stratégie et résultats.",
        canonical="work.html",
        active_nav="work.html",
        body=body,
    )


def render_contact():
    service_options = "\n".join(
        f'              <option>{s["title"]}</option>' for s in SERVICES
    )
    body = f'''{page_hero(
        "Contact",
        "Parlez-nous de votre projet — nous nous occupons du reste.",
        "Que vous ayez déjà un cahier des charges précis ou seulement une intuition à clarifier, décrivez-nous votre situation actuelle et ce que vous cherchez à obtenir : nous revenons vers vous avec un premier avis concret, sous 24h ouvrées.",
        compact=True,
    )}

<section class="split-section">
  <div class="container contact-page-grid">
    <div data-reveal>
      <p class="section-kicker section-kicker--num"><span>01</span> Nos coordonnées</p>
      <h2 class="split-grid-title">Trois façons de nous joindre</h2>
      <p>Le premier échange est toujours gratuit et sans engagement. Nous répondons personnellement, jamais par formulaire automatique.</p>

      <div class="contact-info-list">
        <div class="contact-info-item">
          <span class="contact-info-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 11.5a8.5 8.5 0 01-12.7 7.4L3 20l1.2-5.1A8.5 8.5 0 1121 11.5z"/></svg>
          </span>
          <div><strong>WhatsApp</strong><a href="https://wa.me/212600000000" target="_blank" rel="noopener">+212 6 00 00 00 00</a></div>
        </div>
        <div class="contact-info-item">
          <span class="contact-info-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>
          </span>
          <div><strong>Email</strong><a href="mailto:contact@studio-digital.com">contact@studio-digital.com</a></div>
        </div>
        <div class="contact-info-item">
          <span class="contact-info-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>
          </span>
          <div><strong>Agence</strong><span>Agadir, Maroc</span></div>
        </div>
      </div>
    </div>

    <form class="contact-form contact-page-form" data-reveal>
      <div class="form-row">
        <label>
          <span>Nom</span>
          <input type="text" name="name" placeholder="Votre nom" required>
        </label>
        <label>
          <span>Entreprise</span>
          <input type="text" name="company" placeholder="Nom de votre entreprise">
        </label>
      </div>
      <div class="form-row">
        <label>
          <span>Email</span>
          <input type="email" name="email" placeholder="vous@exemple.com" required>
        </label>
        <label>
          <span>Téléphone</span>
          <input type="tel" name="phone" placeholder="+212 6 00 00 00 00">
        </label>
      </div>
      <div class="form-row">
        <label>
          <span>Service recherché</span>
          <select name="service">
            <option value="">Sélectionnez un service</option>
{service_options}
            <option>Je ne sais pas encore</option>
          </select>
        </label>
        <label>
          <span>Budget approximatif</span>
          <select name="budget">
            <option value="">Sélectionnez une fourchette</option>
            <option>Moins de 5 000 MAD</option>
            <option>5 000 – 15 000 MAD</option>
            <option>15 000 – 40 000 MAD</option>
            <option>Plus de 40 000 MAD</option>
            <option>À définir ensemble</option>
          </select>
        </label>
      </div>
      <label>
        <span>Expliquez-nous votre projet</span>
        <textarea name="message" rows="5" placeholder="D'où partez-vous, où voulez-vous aller, et qu'est-ce qui vous a amené jusqu'ici aujourd'hui ?" required></textarea>
      </label>
      <button type="submit" class="btn btn--primary btn--full">Discuss Your Project</button>
      <p class="brief-privacy">Vos données restent entre nous. Jamais revendues, jamais de spam.</p>
    </form>
  </div>
</section>'''
    return page(
        title="Contact — Démarrer un projet | ANDIGITAL",
        description="Contactez ANDIGITAL pour votre projet de marketing, branding ou création digitale à Agadir. Premier échange gratuit, réponse sous 24h ouvrées.",
        canonical="contact.html",
        active_nav="",
        body=body,
    )


def render_faq():
    groups = [
        ("Nos services", [
            ("Quels services propose ANDIGITAL ?",
             "16 expertises couvrant la stratégie marketing, le branding, le web design, les réseaux sociaux, la production de contenu (photo, vidéo, copywriting), la publicité, le SEO, la génération de leads et la communication corporate. Chaque service est disponible seul ou combiné."),
            ("Dois-je prendre tous les services, ou puis-je en choisir un seul ?",
             "Vous pouvez démarrer avec une seule expertise — un site, un branding, une gestion de réseaux sociaux — et l'étendre ensuite. Beaucoup de clients commencent petit et élargissent une fois les premiers résultats visibles."),
        ]),
        ("Délais", [
            ("Combien de temps prend un projet ?",
             "Un site vitrine prend généralement 1 à 3 semaines ; une identité de marque, 2 à 4 semaines ; une stratégie marketing complète, davantage selon la profondeur d'analyse nécessaire. Un calendrier précis est fixé ensemble dès le brief."),
            ("Proposez-vous des délais accélérés ?",
             "Selon la charge en cours et la nature du projet, oui. Précisez votre contrainte de délai dès le premier échange pour que nous évaluions sa faisabilité."),
        ]),
        ("Budgets", [
            ("Combien coûte un projet avec ANDIGITAL ?",
             "Chaque devis est établi sur mesure selon le périmètre réel — un site simple et une stratégie d'acquisition complète n'ont pas le même coût. Le premier échange, pour cadrer votre besoin, est toujours gratuit."),
            ("Peut-on démarrer avec un budget limité ?",
             "Oui. Notre formule Foundation est conçue pour poser des bases solides avec un budget maîtrisé, avec la possibilité de monter en puissance ensuite."),
        ]),
        ("Projets sur mesure", [
            ("Proposez-vous des projets hors formules standards ?",
             "Systématiquement. Les formules affichées sont des points de départ ; la majorité de nos projets sont ajustés à l'activité, aux objectifs et au budget réels du client."),
            ("Travaillez-vous avec des secteurs spécifiques ?",
             "Nous travaillons avec des entrepreneurs, des marques en croissance et des PME de secteurs variés au Maroc. Le processus s'adapte au secteur, pas l'inverse."),
        ]),
        ("Collaboration & communication", [
            ("Comment se déroule la collaboration au quotidien ?",
             "Un point de contact unique côté agence, des échanges réguliers par WhatsApp ou email, et des validations par étapes pour éviter les allers-retours inutiles en fin de projet."),
            ("Faut-il fournir nos propres visuels, textes ou contenus ?",
             "Non, ce n'est jamais obligatoire. Si vous avez déjà des visuels ou des textes, nous les intégrons ; sinon, nos pôles Photography, Videography et Copywriting les produisent."),
            ("Qui reste propriétaire des créations livrées ?",
             "Vous. Une fois le projet livré et réglé, les fichiers finaux (logo, site, visuels) vous appartiennent."),
        ]),
        ("Campagnes publicitaires", [
            ("Gérez-vous directement les budgets publicitaires ?",
             "Oui, dans le cadre de notre offre Advertising & Paid Media et Media Buying : structuration des campagnes, gestion des enchères, optimisation continue et reporting du retour réel."),
            ("Comment mesurez-vous la performance d'une campagne ?",
             "Via un tracking mis en place dès le lancement (offre Analytics & Performance), avec des KPI définis en amont et un reporting régulier, lisible, sans jargon inutile."),
        ]),
        ("Sites web", [
            ("Le site sera-t-il adapté au mobile ?",
             "Systématiquement. Chaque site est conçu et testé en responsive sur mobile, tablette et desktop avant mise en ligne."),
            ("Puis-je modifier mon site moi-même après la livraison ?",
             "Selon la solution technique retenue, oui — nous en discutons dès le brief pour livrer un site que vous pouvez faire évoluer en autonomie si c'est votre besoin."),
        ]),
        ("Branding", [
            ("Que comprend exactement une prestation de branding ?",
             "Positionnement, naming si nécessaire, logo, système d'identité visuelle, charte graphique complète et déclinaisons packaging ou supports imprimés selon votre activité."),
            ("Avez-vous déjà une marque : pouvez-vous la faire évoluer plutôt que la refaire ?",
             "Oui. Un rebranding partiel (rafraîchissement de charte, extension à de nouveaux supports) est tout à fait possible sans repartir de zéro."),
        ]),
        ("Fonctionnement de l'agence", [
            ("Combien de personnes travaillent sur mon projet ?",
             "Cela dépend du périmètre : certains projets sont pilotés par un interlocuteur unique mobilisant les expertises nécessaires, d'autres impliquent plusieurs pôles en parallèle. Dans tous les cas, un seul point de contact centralise le suivi."),
            ("Comment démarrer un projet avec ANDIGITAL ?",
             "Remplissez le formulaire de la page Contact ou écrivez-nous sur WhatsApp. Nous revenons vers vous sous 24h ouvrées pour cadrer votre besoin et proposer une première direction."),
        ]),
    ]

    groups_html = []
    for title, qas in groups:
        items = []
        for q, a in qas:
            items.append(f'''      <div class="faq-item">
        <button class="faq-question" aria-expanded="false">
          <span>{q}</span>
          <span class="faq-toggle" aria-hidden="true">+</span>
        </button>
        <div class="faq-answer">
          <p>{a}</p>
        </div>
      </div>''')
        items_html = "\n".join(items)
        groups_html.append(f'''    <div class="faq-group" data-reveal>
      <p class="faq-group-title">{title}</p>
      <div class="faq-list">
{items_html}
      </div>
    </div>''')
    groups_html_str = "\n".join(groups_html)

    body = f'''{page_hero(
        "FAQ",
        "Les questions que nos prospects posent le plus souvent.",
        "Vous ne trouvez pas votre réponse ci-dessous ? Écrivez-nous directement — le premier échange est toujours gratuit.",
        compact=True,
    )}

<section class="split-section">
  <div class="container">
{groups_html_str}
  </div>
</section>

<section class="cta-banner">
  <div class="container">
    <h2>Une question qui ne figure pas ici&nbsp;?</h2>
    <a href="contact.html" class="btn btn--primary btn--large">Discuss Your Project</a>
  </div>
</section>'''
    return page(
        title="FAQ — Questions fréquentes | ANDIGITAL",
        description="Toutes les réponses sur nos services, délais, budgets, projets sur mesure et fonctionnement, pour bien démarrer votre projet avec ANDIGITAL.",
        canonical="faq.html",
        active_nav="faq.html",
        body=body,
    )


def write(filename, content):
    path = os.path.join(ROOT, filename)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("wrote", filename)


def main():
    write("services.html", render_services_hub())
    for s in SERVICES:
        write(f'service-{s["slug"]}.html', render_service_page(s))
    write("about.html", render_about())
    write("process.html", render_process())
    write("work.html", render_work())
    write("contact.html", render_contact())
    write("faq.html", render_faq())


if __name__ == "__main__":
    main()
