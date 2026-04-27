class FuelProV9 extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  set hass(hass) {
    const config = this.config;
    if (!config || !hass) return;

    if (!this._initialized) {
      this.shadowRoot.innerHTML = `
        <style>
          .grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
            padding: 12px;
          }
          .cell {
            display: flex;
            flex-direction: column;
            align-items: center;
            border: 1px solid #444;
            border-radius: 12px;
            padding: 8px 2px;
            background: #262626;
            cursor: pointer;
            height: 92px;
            justify-content: space-between;
            transition: transform 0.1s ease;
          }
          .cell:active { transform: scale(0.96); }
          #popup {
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(0,0,0,0.6);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 9999;
          }
          #popup-box {
            background: #1e1e1e;
            padding: 20px;
            border-radius: 12px;
            width: 260px;
            text-align: center;
            color: white;
          }
          button {
            width: 100%;
            padding: 8px;
            margin-top: 10px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
          }
          .maps-btn { background: #4285F4; color: white; }
          .close-btn { background: #444; color: white; }
        </style>

        <ha-card>
          <div id="title" style="padding:16px; text-align:center; font-size:18px; font-weight:500;"></div>
          <div id="grid" class="grid"></div>
          <div id="footer" style="padding:6px 0 12px; text-align:center; font-size:11px; color:#888;"></div>

          <div id="popup">
            <div id="popup-box">
              <div id="popup-text"></div>
              <button id="popup-maps" class="maps-btn">Apri in Maps</button>
              <button id="popup-close" class="close-btn">OK</button>
            </div>
          </div>
        </ha-card>
      `;

      this.grid = this.shadowRoot.querySelector("#grid");
      this.titleEl = this.shadowRoot.querySelector("#title");
      this.footerEl = this.shadowRoot.querySelector("#footer");

      this.popup = this.shadowRoot.querySelector("#popup");
      this.popupText = this.shadowRoot.querySelector("#popup-text");
      this.popupMaps = this.shadowRoot.querySelector("#popup-maps");
      this.popupClose = this.shadowRoot.querySelector("#popup-close");

      this.popupClose.onclick = () => (this.popup.style.display = "none");

      this._initialized = true;
    }

    const topEntity = hass.states[config.entity_top20];
    if (!topEntity) return;

    const [, city, fuel] = config.entity_top20.split("_");

    const fuelName = fuel.charAt(0).toUpperCase() + fuel.slice(1);
    this.titleEl.textContent = `Prezzi ${fuelName}`;

    const lastUpdate = topEntity.attributes.ultimo_aggiornamento;
    this.footerEl.textContent = lastUpdate ? `Aggiornato alle ${lastUpdate}` : "";

    const stations = topEntity.attributes.stations || [];
    this.grid.innerHTML = "";

    // 🔥 Lista dei brand realmente presenti nella tua cartella logos
    const validBrands = [
      "coop", "eni", "enilive", "esso", "ip", "q8", "tamoil",
      "agip", "api", "casilloedevitto", "sarnioil", "vega",
      "metano", "pompabianca"
    ];

    stations.forEach((s) => {
      const cell = document.createElement("div");
      cell.className = "cell";

      const price = s.price ? s.price.toString().replace(".", ",") : "N/D";
      const address = s.address || "Indirizzo non disponibile";

      // 🔥 LAT/LON DIRETTI DAL TOP20
      const lat = s.latitude;
      const lon = s.longitude;

      // 🔥 NORMALIZZAZIONE BRAND
      let rawBrand = (s.brand || "").toLowerCase().replace(/[^a-z0-9]/g, "");

      let brand_final = validBrands.includes(rawBrand)
        ? rawBrand
        : "pompabianca";

      const brandLabel = brand_final.toUpperCase();
      const brandLogo = `/local/gas-station-card/logos/${brand_final}.png`;

      cell.innerHTML = `
        <div style="width:42px; height:42px; background:white; border-radius:8px; display:flex; align-items:center; justify-content:center; padding:4px;">
          <img src="${brandLogo}" style="width:100%; height:100%; object-fit:contain;">
        </div>
        <div style="font-size:8px; font-weight:bold; color:#bbb; text-transform:uppercase;">${brandLabel}</div>
        <div style="font-size:13px; font-weight:900; color:#39FF14;">${price}€</div>
      `;

      // CLICK
      cell.addEventListener("click", () => {
        this.popupText.textContent = address;

        this.popupMaps.onclick = () => {
          if (lat != null && lon != null) {
            window.open(
              `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`,
              "_blank"
            );
            return;
          }

          window.open(
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
            "_blank"
          );
        };

        this.popup.style.display = "flex";
      });

      this.grid.appendChild(cell);
    });
  }

  setConfig(config) {
    if (!config.entity_top20) throw new Error("Devi specificare entity_top20");
    this.config = config;
  }
}

customElements.define("fuel-pro-v9", FuelProV9);
