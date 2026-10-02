(() => {
  "use strict";

  const config = window.DEMO_CONFIG;

  if (!config || !Array.isArray(config.groups)) {
    throw new Error("Demo configuration is missing.");
  }

  const root = document.getElementById("demo-root");

  const citationMap = {
    "FreeVC": "[1]",
    "FreeVC-S": "[1]",
    "kNN-VC": "[2]",
    "LinearVC": "[3]",
    "MKL-VC": "[4]",
    "SSL-GMMVC": "[5]",
    "USCF": "[6]",
    "kDOT": "[7]"
  };


  function pauseOtherAudio(active) {
    document.querySelectorAll("audio").forEach((audio) => {
      if (audio !== active) {
        audio.pause();
      }
    });
  }


  function makeAudio(src) {
    const audio = document.createElement("audio");

    audio.controls = true;
    audio.preload = "metadata";
    audio.src = src;

    audio.addEventListener("play", (event) => {
      pauseOtherAudio(event.target);
    });

    return audio;
  }


  function makeReferenceCard(title, src, type) {
    const card = document.createElement("div");

    card.className =
      `reference-card reference-card-${type}`;

    const heading = document.createElement("div");

    heading.className = "reference-title";
    heading.textContent = title;

    card.append(
      heading,
      makeAudio(src)
    );

    return card;
  }


  config.groups.forEach((group, idx) => {

    if (!group.source) {
      throw new Error(
        `Missing source audio for Sample ${idx + 1}`
      );
    }

    if (!group.reference) {
      throw new Error(
        `Missing target reference for Sample ${idx + 1}`
      );
    }

    const section = document.createElement("section");
    section.className = "case-section";


    /* Sample header */

    const header = document.createElement("div");

    header.className =
      "case-header compact-case-header";

    const pill = document.createElement("div");

    pill.className = "case-index";
    pill.textContent = `Sample ${idx + 1}`;

    header.appendChild(pill);


    /* Source and target reference */

    const referenceGrid =
      document.createElement("div");

    referenceGrid.className = "reference-grid";

    referenceGrid.append(
      makeReferenceCard(
        "Source Speech",
        group.source,
        "source"
      ),
      makeReferenceCard(
        "Target Reference",
        group.reference,
        "target"
      )
    );


    /* Converted systems */

    const systemsWrap =
      document.createElement("div");

    systemsWrap.className =
      "systems-strip-wrap";

    const systems =
      document.createElement("div");

    systems.className = "systems-strip";


    group.systems.forEach(
      (system, systemIdx) => {

        const isOurs =
          system.method === "Proposed";

        const card =
          document.createElement("div");

        card.className =
          `method-card theme-${systemIdx % 9}`;

        if (isOurs) {
          card.classList.add("proposed");
        }


        const head =
          document.createElement("div");

        head.className = "method-head";


        const name =
          document.createElement("span");

        name.className = "method-name";

        name.textContent =
          isOurs
            ? "Ours"
            : system.method;

        head.appendChild(name);


        if (
          !isOurs &&
          citationMap[system.method]
        ) {
          const cite =
            document.createElement("span");

          cite.className = "citation-inline";

          cite.textContent =
            citationMap[system.method];

          head.appendChild(cite);
        }


        card.append(
          head,
          makeAudio(system.audio)
        );

        systems.appendChild(card);
      }
    );


    systemsWrap.appendChild(systems);


    section.append(
      header,
      referenceGrid,
      systemsWrap
    );

    root.appendChild(section);
  });

})();
