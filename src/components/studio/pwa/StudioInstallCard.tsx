"use client";

import { useState } from "react";

import { Download, Laptop, Smartphone, ChevronDown, CheckCircle2 } from "lucide-react";

import { useStudioStandalone } from "./StudioPwaRuntime";

export default function StudioInstallCard() {
  const standalone = useStudioStandalone();

  const [expanded, setExpanded] = useState(false);

  if (standalone) {
    return (
      <section className="studio-pwa-installed-card" aria-label="Application installation status">
        <CheckCircle2 size={19} aria-hidden="true" />

        <div>
          <strong>Your Studio is installed</strong>

          <p>You&apos;re using the standalone creative workspace.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="studio-pwa-install-card" aria-labelledby="studio-install-heading">
      <div className="studio-pwa-install-main">
        <div className="studio-pwa-install-icon" aria-hidden="true">
          <Download size={23} />
        </div>

        <div className="studio-pwa-install-copy">
          <h2 id="studio-install-heading">Make the Studio yours</h2>

          <p>Add Social Design Studio to your Dock or Home Screen.</p>
        </div>

        <button
          type="button"
          className="studio-dashboard-secondary"
          aria-expanded={expanded}
          aria-controls="studio-install-instructions"
          onClick={() => setExpanded((current) => !current)}
        >
          {expanded ? "Hide instructions" : "How to install"}

          <ChevronDown
            size={17}
            className={expanded ? "studio-pwa-chevron-expanded" : undefined}
            aria-hidden="true"
          />
        </button>
      </div>

      {expanded && (
        <div id="studio-install-instructions" className="studio-pwa-install-instructions">
          <div className="studio-pwa-platform">
            <Laptop size={24} aria-hidden="true" />

            <div>
              <h3>MacBook · Chrome</h3>

              <ol>
                <li>Open the Studio dashboard in Chrome.</li>

                <li>Select the installation icon in the address bar, or open the Chrome menu.</li>

                <li>Choose Install page as app, or Install Social Design Studio.</li>

                <li>Confirm the installation and keep the application in your Dock.</li>
              </ol>
            </div>
          </div>

          <div className="studio-pwa-platform">
            <Smartphone size={24} aria-hidden="true" />

            <div>
              <h3>iPhone and iPad · Chrome</h3>

              <ol>
                <li>Open the Studio dashboard in Chrome.</li>

                <li>Open the Share menu.</li>

                <li>Select Add to Home Screen.</li>

                <li>Confirm the name and enable Open as Web App if offered.</li>

                <li>Launch the Studio from your Home Screen.</li>
              </ol>
            </div>
          </div>

          <p className="studio-pwa-install-footnote">
            Installation options depend on your browser and operating system version. The Studio
            currently requires an internet connection for cloud functionality.
          </p>
        </div>
      )}
    </section>
  );
}
