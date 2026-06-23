/* moremuslim.org — website UI kit screens.
   Light theme matching the actual site (beige ground, oak brown text).
   Episode page: dark immersive for covered episodes.
   Typography from moremuslim.org main CSS — line-height 1.176 body, 1.0 titles.
   Browser-babel (no ES imports). Assigns window.MMSite. */
(function () {
  const DS = window.MoreMuslimDesignSystem_019df4 || {};
  const { Button, Tag, EyebrowLabel, Avatar, Symbol, AudioBar, PullQuote, PatternPanel } = DS;
  const IMG  = "../../assets/imagery/";
  const LOGO = "../../assets/logos/";

  // Ground colours for CoverArt panels (corrected from moremuslim.org)
  const WAY_BG   = { night: "#192136", oak: "#511C14", terra: "#C15A3A", stone: "#3C5065", mist: "#9FBCCC" };
  const WAY_TILE = { night: "5C",      oak: "6B",      terra: "5B",      stone: "1B",      mist: "2B"      };
  const symClr   = (way) => way === "mist" ? "#192136" : "#F6E1C6";

  // Light-theme palette (matches actual site)
  const BG  = "#FBF2E9";              // beige soft
  const INK = "#511C14";              // oak brown
  const WH  = "#FFFFFF";              // white cards
  const BDR = "rgba(81,28,20,0.1)";   // subtle border

  // Typography tokens from moremuslim.org CSS
  const F = {
    meta:  { fontSize: "0.75rem",    letterSpacing: "1.5px",  lineHeight: 1.2,   textTransform: "uppercase" },
    epttl: { fontSize: "1.25rem",    letterSpacing: "3.14px", lineHeight: 1,     textTransform: "uppercase", fontWeight: 400 },
    body:  { fontSize: "1.0625rem",  letterSpacing: "0.21px", lineHeight: 1.176 },
    intro: { fontSize: "1.875rem",   letterSpacing: "0.5px",  lineHeight: 1,     fontWeight: 400 },
    about: { fontSize: "1.25rem",    letterSpacing: "0.5px",  lineHeight: 1.2,   fontWeight: 400 },
    caps:  { fontSize: "0.75rem",    letterSpacing: "1.5px",  textTransform: "uppercase" },
  };

  const CREDITS_BASE = [
    ["Sohaira Siddiqui","Host"],["Salman Ahad Khan","Executive Producer"],
    ["Alexander Overington","Technical Director"],["Sarah Qari","Consulting Editor"],
    ["Heba Elorbany","Fact Checker"],
  ];

  const EPISODES = [
    { id: "e9", n: 9, title: "A More Muslim Japan", dur: "25:45", date: "11 Jun 2026",
      cover: null, way: "stone",
      blurb: "The number of Muslims in Japan has almost quadrupled in the last two decades. Migrants are coming in ever greater numbers to work there from countries like Indonesia. And yet, Islam is still seen as this\u2026 foreign, elusive thing. This week on the show, reporter Tanita Rahmani follows two Muslim women who try to change things.",
      quote: { text: "Islam is still seen as this foreign, elusive thing.", cite: "Episode 9 · A More Muslim Japan" },
      reporter: "Tanita Rahmani",
      credits: [["Tanita Rahmani","Reporter & Producer"], ...CREDITS_BASE] },
    { id: "e8", n: 8, title: "The Travelling Sisterhood", dur: "43:00", date: "27 May 2026",
      cover: null, way: "mist",
      blurb: "As millions of Muslims complete Hajj, we revisit a question scholars have debated for centuries: can a Muslim woman make a journey like that without a mahram? This week on the show, host Sohaira Siddiqui recalls the first time she ran headfirst into that debate, when she decided to tell her parents she wanted to move to Jordan to study Arabic. And how that initial conversation at her parents\u2019 kitchen table led her to dive deep into centuries of scholarly debate on the topic, from the Mughal princess Gulbadan Begum\u2019s seven-year pilgrimage to Mecca, to the 2023 Saudi ruling that let women perform Hajj without a male guardian.",
      quote: { text: "Can a Muslim woman make a journey like that without a mahram?", cite: "Episode 8 · The Travelling Sisterhood" },
      reporter: "Sohaira Siddiqui",
      credits: [["Sohaira Siddiqui","Reporter & Host"], ["Salman Ahad Khan","Executive Producer"], ["Alexander Overington","Technical Director"], ["Sarah Qari","Consulting Editor"]] },
    { id: "e7", n: 7, title: "In Therapy, With SheikhaGPT", dur: "42:11", date: "24 Apr 2026",
      cover: IMG + "illus-therapy.jpg", way: "night",
      blurb: "When reporter Yassmin Abdel-Magied\u2019s friend tells her she\u2019s been using ChatGPT as a therapist, Yassmin doesn\u2019t know what to think. The chatbot calls her friend \u201Chabibti.\u201D Gives her Islamic relationship advice. It\u2019s helping her reconnect with her faith in ways no human in her life has been able to. But it\u2019s also a product built by a tech company with no soul, no silsila, and no duty of care. Yassmin\u2019s search for answers leads her to a 12th-century hospital in Damascus and a Stanford psychiatrist who\u2019s building something unexpected: a chatbot, rooted in Islamic Psychology.",
      quote: { text: "It calls her habibti. Gives her Islamic relationship advice.", cite: "Episode 7 · In Therapy, With SheikhaGPT" },
      reporter: "Yassmin Abdel-Magied",
      credits: [["Yassmin Abdel-Magied","Reporter"], ["Lina Jaradat","Illustrator"], ...CREDITS_BASE] },
    { id: "e6", n: 6, title: "Cape Malay: The Indonesian Roots of South African Islam", dur: "41:43", date: "02 Apr 2026",
      cover: IMG + "illus-ep6.webp", way: "oak",
      blurb: "Growing up, Aina had heard about the transatlantic slave trade that enslaved Africans and took them to the Americas. But on one of her reporting trips, she was shocked to learn that, around the same time, Dutch colonizers were deporting and enslaving Muslims from Indonesia and shipping them thousands of miles\u2026 all the way to South Africa.",
      quote: { text: "I want to let them know that there's consequences of everything.", cite: "Bo-Kaap resident · Cape Malay" },
      reporter: "Aina J. Khan",
      credits: [["Aina J. Khan","Reporter"], ["Catherine Boulle","Contributing Producer"], ...CREDITS_BASE] },
    { id: "e5", n: 5, title: "Hanabneehu: Rebuilding Sudan, One Class at a Time", dur: "35:50", date: "19 Mar 2026",
      cover: IMG + "illus-ep5.webp", way: "terra",
      blurb: "When war broke out in Sudan in April 2023, Dr. Fairouz El Hijzi faced an impossible choice: give up on her students' futures or attempt to resume classes in the middle of the worst humanitarian crisis in modern history. Reporter Yassmin Abdel-Magied tells the story of what happened when she and her students decided to keep hope alive and start building a new future for Sudan.",
      quote: { text: "They decided to keep hope alive and start building a new future for Sudan.", cite: "Episode 5 · Hanabneehu" },
      reporter: "Yassmin Abdel-Magied",
      credits: [["Yassmin Abdel-Magied","Reporter"], ...CREDITS_BASE] },
    { id: "e4", n: 4, title: "A Recitation Revolution", dur: "49:39", date: "06 Mar 2026",
      cover: IMG + "illus-ep4.webp", way: "night",
      blurb: "For most of her life, Maryam believed women couldn't recite the Qur'an aloud. That a woman's voice, especially while reciting the Qur'an, is awrah. Something to be hidden. Then, one day in high school, she heard a girl recite in public.",
      quote: { text: "Then, one day, she heard a girl recite in public.", cite: "Episode 4 · A Recitation Revolution" },
      reporter: "More Muslim Team",
      credits: CREDITS_BASE },
    { id: "e3", n: 3, title: "The Secret Translators", dur: "43:48", date: "18 Feb 2026",
      cover: IMG + "illus-ep3.webp", way: "stone",
      blurb: "The \u2018Sahih International\u2019 translation is one of the most widely read English versions of the Qur\u2019an, but the authors of the translation are rarely ever mentioned by name. Until one day, The Digital Sisterhood\u2019s Cadar Mohamud hears a rumor about who actually wrote the mysterious translation: three white revert American women living in Saudi Arabia.",
      quote: { text: "Three white revert American women living in Saudi Arabia.", cite: "Episode 3 · The Secret Translators" },
      reporter: "Cadar Mohamud",
      credits: [["Cadar Mohamud","Contributing Reporter"], ...CREDITS_BASE] },
    { id: "e2", n: 2, title: "The Nikkah Loophole", dur: "35:54", date: "01 Feb 2026",
      cover: IMG + "illus-ep2.webp", way: "mist",
      blurb: "Reporter Tanita Rahmani realizes a small detail on her marriage contract means her marriage was never legally registered. That revelation sends her on a personal and investigative journey into the legal gray zone where many Muslim marriages exist: recognized by faith, but invisible to the law.",
      quote: { text: "Recognized by faith, but invisible to the law.", cite: "Episode 2 · The Nikkah Loophole" },
      reporter: "Tanita Rahmani",
      credits: [["Tanita Rahmani","Reporter & Producer"], ...CREDITS_BASE] },
    { id: "e1", n: 1, title: "Side Entrances", dur: "43:59", date: "01 Feb 2026",
      cover: IMG + "illus-ep1.webp", way: "oak",
      blurb: "What does it mean when the presence of half our community in the most central and sacred space of Muslim life is up for debate? Reporter Taqwa Sadiq traces the evolution of Muslim women's relationship with the mosque, from the prophetic era when women prayed alongside men without barriers to today's reality.",
      quote: { text: "From the prophetic era, when women prayed alongside men, to today.", cite: "Episode 1 · Side Entrances" },
      reporter: "Taqwa Sadiq",
      credits: [["Taqwa Sadiq","Reporter & Producer"], ...CREDITS_BASE] },
  ];

  // Shared episode cover/art panel
  function CoverArt({ ep, height = 220, radius = "5px" }) {
    const bg   = WAY_BG[ep.way]   || "#192136";
    const tile = WAY_TILE[ep.way] || "5C";
    if (ep.cover) {
      return (
        <div style={{ height, borderRadius: radius, overflow: "hidden", background: bg, flexShrink: 0 }}>
          <img src={ep.cover} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
      );
    }
    return PatternPanel ? (
      <PatternPanel tile={tile} color={bg} radius={radius} grainOpacity={0.08} tileOpacity={0.14}
        style={{ height, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Symbol size={Math.min(72, (typeof height === "number" ? height : 220) * 0.32)} style={{ color: symClr(ep.way), opacity: 0.92 }} />
      </PatternPanel>
    ) : <div style={{ height, background: bg, borderRadius: radius, flexShrink: 0 }} />;
  }

  // Header: 3-col grid, logo centred (matches moremuslim.org desktop layout)
  function Header({ onHome, onAbout }) {
    return (
      <header style={{
        display: "grid", gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center", padding: "20px 48px 15px",
        position: "sticky", top: 0, zIndex: 10,
        background: `rgba(251,242,233,0.92)`, backdropFilter: "blur(10px)",
        borderBottom: `1px solid ${BDR}`,
      }}>
        <div />
        <img src={LOGO + "logo-horizontal-oak.svg"} alt="More Muslim"
          style={{ height: 54, cursor: "pointer" }} onClick={onHome} />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button size="sm" variant="primary">Subscribe</Button>
        </div>
      </header>
    );
  }

  function Footer() {
    return (
      <footer style={{ padding: "60px 0 40px", borderTop: `1px solid ${BDR}`, marginTop: 80 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <img src={LOGO + "logo-horizontal-oak.svg"} alt="More Muslim" style={{ height: 54 }} />
          <p style={{ margin: 0, ...F.body, maxWidth: "40ch", textAlign: "center", fontStyle: "italic", color: INK }}>
            A narrative audio documentary series that explores the Muslim experience, with all its messiness.
          </p>
          <div style={{ display: "flex", gap: 24, ...F.caps, color: INK, opacity: 0.4 }}>
            <span>Apple Podcasts</span><span>Spotify</span><span>RSS</span>
          </div>
          <div style={{ ...F.caps, fontSize: "0.6875rem", color: INK, opacity: 0.28, textAlign: "center" }}>
            &copy; 2026 More Muslim &middot; All rights reserved.
          </div>
        </div>
      </footer>
    );
  }

  // Episode card: .c-episode layout — white content panel (left) + image (right)
  function EpCard({ ep, onOpen, showBlurb = false }) {
    return (
      <article onClick={() => onOpen(ep.id)} style={{
        display: "grid", gridTemplateColumns: "5fr 9fr", gap: 12,
        cursor: "pointer", marginBottom: 20, color: INK,
      }}>
        {/* Content panel */}
        <div style={{
          background: WH, border: `1px solid ${BDR}`, borderRadius: 5,
          padding: "27px 32px", display: "flex", flexDirection: "column",
          minHeight: showBlurb ? 320 : 260,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem", ...F.meta, color: INK }}>
            <span style={{ opacity: 0.3 }}>{ep.date}</span>
            <span>S1 &middot; E{ep.n}</span>
            <span style={{ opacity: 0.3 }}>{ep.dur}</span>
          </div>
          <h2 style={{ margin: "0 0 1.25rem", textAlign: "center", ...F.epttl, color: INK }}>{ep.title}</h2>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: showBlurb ? "1rem" : 0 }}>
            <button style={{
              display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
              padding: "6.5px 14px 5.5px", fontFamily: "inherit", ...F.meta,
              color: INK, background: "transparent",
              border: `1px solid rgba(81,28,20,0.05)`, borderRadius: 5,
            }}>&#x25B6; Play Episode</button>
          </div>
          {showBlurb && (
            <p style={{ margin: "0 0 auto", ...F.body, color: INK, textWrap: "pretty" }}>{ep.blurb}</p>
          )}
          <a style={{
            display: "flex", justifyContent: "center", alignItems: "center", gap: 10,
            ...F.caps, fontVariantCaps: "all-small-caps", lineHeight: 1.083,
            opacity: 0.3, color: INK, marginTop: showBlurb ? 24 : "auto",
          }}>Transcript &amp; Credits &#x2192;</a>
        </div>
        {/* Image panel: aspect-ratio 749/621 from .c-episode__image */}
        <div style={{ aspectRatio: "749/621", borderRadius: 5, overflow: "hidden", background: WAY_BG[ep.way] }}>
          {ep.cover ? (
            <img src={ep.cover} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          ) : PatternPanel ? (
            <PatternPanel tile={WAY_TILE[ep.way]} color={WAY_BG[ep.way]} radius="0"
              grainOpacity={0.08} tileOpacity={0.14}
              style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Symbol size={72} style={{ color: symClr(ep.way), opacity: 0.9 }} />
            </PatternPanel>
          ) : null}
        </div>
      </article>
    );
  }

  function Home({ onOpen, onAbout }) {
    const featured = EPISODES[0];
    const rest     = EPISODES.slice(1);
    return (
      <main style={{ background: BG, color: INK }}>
        {/* Hero: padding-top ~40vh, centred text (from .m-hero-home) */}
        <section style={{ maxWidth: 820, margin: "0 auto", padding: "200px 48px 160px", textAlign: "center" }}>

          <p style={{ margin: "28px auto 0", ...F.intro, maxWidth: "26ch", color: INK }}>
            A narrative audio documentary series that explores the Muslim experience, with all its messiness.
          </p>
          <div style={{ display: "flex", gap: 14, marginTop: 44, justifyContent: "center", flexWrap: "wrap" }}>
            <Button variant="primary" size="lg" onClick={() => onOpen(featured.id)}>Listen now</Button>
            <Button variant="outline" size="lg" onClick={onAbout}>About the show</Button>
          </div>
        </section>

        {/* Episode list: featured + rest */}
        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px 80px" }}>
          <div style={{ ...F.caps, color: INK, opacity: 0.45, marginBottom: 24, textAlign: "center" }}>
            Season One &middot; Nine episodes
          </div>
          <EpCard ep={featured} onOpen={onOpen} showBlurb />
          {rest.map((ep) => <EpCard key={ep.id} ep={ep} onOpen={onOpen} />)}
        </section>

        {/* Pitch strip (from .m-pitch) */}
        <section style={{ background: "#F6E1C6", borderTop: `1px solid ${BDR}`, borderBottom: `1px solid ${BDR}`, padding: "100px 48px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, maxWidth: 1200, margin: "0 auto", alignItems: "start" }}>
            <h2 style={{ margin: 0, ...F.epttl, fontSize: "1.25rem", color: INK }}>About the show</h2>
            <div>
              <p style={{ margin: "0 0 28px", ...F.about, color: INK }}>
                More Muslim is a sound-rich, cinematic narrative podcast telling deeply reported stories about Muslims across the world. Each episode is a mix of interviews, field reporting, history, and research, all scored to original music. Our first season is a production of Al-Mujadilah Center and Mosque for Women.
              </p>
              <Button variant="outline" onClick={onAbout}>Read more</Button>
            </div>
          </div>
        </section>

        <div style={{ background: BG, maxWidth: 1200, margin: "0 auto", padding: "0 48px" }}>
          <Footer />
        </div>
      </main>
    );
  }

  function EpisodePage({ id, onOpen, onHome }) {
    const ep     = EPISODES.find((e) => e.id === id) || EPISODES[0];
    const [playing, setPlaying] = React.useState(false);
    const [prog,    setProg]    = React.useState(0.18);
    const more    = EPISODES.filter((e) => e.id !== ep.id).slice(0, 3);
    const durSec  = parseInt(ep.dur) * 60;
    const hasCover = !!ep.cover;
    const txtClr  = hasCover ? "#F6E1C6" : INK;

    return (
      <article style={{ background: hasCover ? "#192136" : BG, color: txtClr, minHeight: "100vh" }}>
        {/* Hero image */}
        <div style={{ position: "relative", height: 480, overflow: "hidden" }}>
          <CoverArt ep={ep} height={480} radius="0" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.75) 100%)" }} />
          <div style={{ position: "absolute", bottom: 44, left: 0, right: 0, textAlign: "center", color: "#F6E1C6" }}>
            <div style={{ ...F.meta, opacity: 0.7 }}>S1 &middot; E{ep.n} &middot; {ep.dur} &middot; {ep.date}</div>
            <h1 style={{ margin: "16px auto 0", ...F.epttl, fontSize: "1.875rem", letterSpacing: "0.08em", maxWidth: "20ch" }}>
              {ep.title}
            </h1>
          </div>
        </div>

        {/* Body */}
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 48px 0" }}>
          <a onClick={onHome} style={{ cursor: "pointer", ...F.caps, opacity: 0.5, color: txtClr }}>
            &larr; All episodes
          </a>

          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 36 }}>
            <Avatar name={ep.reporter} size={42} />
            <div>
              <div style={{ ...F.body, color: txtClr }}>{ep.reporter}</div>
              <div style={{ ...F.caps, opacity: 0.5, color: txtClr }}>Reporting</div>
            </div>
          </div>

          <div style={{ margin: "32px 0" }}>
            <AudioBar episode={`S1 · E${ep.n}`} title={ep.title} playing={playing} progress={prog}
              duration={durSec} onToggle={() => setPlaying((p) => !p)} onSeek={setProg} />
          </div>

          <p style={{ ...F.body, fontSize: "1.1875rem", lineHeight: 1.158, letterSpacing: "0.14px",
            textWrap: "pretty", maxWidth: "60ch", color: txtClr }}>{ep.blurb}</p>

          <div style={{ margin: "44px 0" }}>
            <PullQuote size="lg" cite={ep.quote.cite}>{ep.quote.text}</PullQuote>
          </div>

          <section style={{ margin: "44px 0" }}>
            <EyebrowLabel tone="secondary">Episode credits</EyebrowLabel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))", gap: "18px 32px", marginTop: 22 }}>
              {ep.credits.map(([name, role], i) => (
                <div key={i}>
                  <div style={{ ...F.body, textTransform: "uppercase", letterSpacing: "1.5px", color: txtClr }}>{name}</div>
                  <div style={{ fontStyle: "italic", opacity: 0.6, ...F.body, fontSize: "0.9375rem", color: txtClr }}>{role}</div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginTop: 64 }}>
            <div style={{ ...F.caps, opacity: 0.4, marginBottom: 22, textAlign: "center", color: txtClr }}>More from Season One</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
              {more.map((e) => (
                <article key={e.id} style={{ cursor: "pointer" }}
                  onClick={() => { onOpen(e.id); window.scrollTo(0, 0); }}>
                  <CoverArt ep={e} height={140} radius="5px" />
                  <h4 style={{ margin: "14px 0 0", fontWeight: 400, ...F.body, lineHeight: 1.2, color: txtClr }}>{e.title}</h4>
                  <div style={{ ...F.caps, opacity: 0.4, marginTop: 6, color: txtClr }}>E{e.n} &middot; {e.dur}</div>
                </article>
              ))}
            </div>
          </section>
        </div>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 48px" }}>
          <Footer />
        </div>
      </article>
    );
  }

  function About({ onHome }) {
    return (
      <article style={{ background: BG, color: INK, minHeight: "100vh" }}>
        <section style={{ maxWidth: 860, margin: "0 auto", padding: "100px 48px 0" }}>
          <EyebrowLabel>About the show</EyebrowLabel>
          <h1 style={{ margin: "22px 0 0", fontWeight: 400, fontSize: "2.5rem", lineHeight: 1.04, letterSpacing: "0.02em", color: INK }}>
            Made in Doha. Reported across the world.
          </h1>
          <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 22 }}>
            <p style={{ margin: 0, ...F.about, color: INK }}>
              More Muslim is a sound-rich, cinematic narrative podcast telling deeply reported stories about Muslims across the world. Each episode is a mix of interviews, field reporting, history, and research, all scored to original music. Our first season is a production of Al-Mujadilah Center and Mosque for Women and is focused on covering some of the most interesting stories in the Muslim world through the lived experiences of Muslim women.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, margin: "52px 0" }}>
            {[["40,000+","downloads"],["143","countries"],["7\u00d7","launch-to-peak growth"]].map(([n, l], i) => (
              <div key={i} style={{ padding: "24px", border: `1px solid ${BDR}`, borderRadius: 5, background: WH }}>
                <div style={{ fontSize: "2.5rem", color: INK, lineHeight: 1 }}>{n}</div>
                <div style={{ ...F.caps, color: INK, opacity: 0.45, marginTop: 10 }}>{l}</div>
              </div>
            ))}
          </div>
          <Button variant="primary" onClick={onHome}>Browse episodes</Button>
        </section>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 48px" }}>
          <Footer />
        </div>
      </article>
    );
  }

  window.MMSite = { Header, Footer, Home, EpisodePage, About, EPISODES };
})();
