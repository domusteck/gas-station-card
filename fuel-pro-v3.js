class FuelProV3 extends HTMLElement {
  set hass(hass) {
    if (!this.content) {
      this.innerHTML = `
        <ha-card>
          <div id="card-title" style="padding: 16px 16px 0px 16px; text-align: center; font-size: 18px; font-weight: 500; color: var(--primary-text-color);">
            Prezzi Carburante
          </div>
          <div id="container" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; padding: 12px;"></div>
        </ha-card>
      `;
      this.content = this.querySelector("#container");
    }

    const config = this.config;
    if (!config || !hass) return;

    let html = "";
    for (let i = 1; i <= 20; i++) {
      const entityId = `${config.base_entity}${i}`;
      const stateObj = hass.states[entityId];

      if (stateObj) {
        const fullText = stateObj.state;
        const priceMatch = fullText.replace(',', '.').match(/\d\.\d{2,3}/);
        const price = priceMatch ? priceMatch[0] : fullText.substring(0, 5);
        const address = fullText.split(/—|-|–/).pop().trim();
        const brand = this._getBrand(fullText);
        
        html += `
          <div class="fuel-cell" 
            title="${address}" 
            style="display: flex; flex-direction: column; align-items: center; border: 1px solid #444; border-radius: 12px; padding: 8px 2px; background: #262626; cursor: pointer; height: 92px; justify-content: space-between;"
            onclick="alert('Indirizzo: ${address.replace(/'/g, "\\'")}');"
          >
            <div style="width: 42px; height: 42px; background: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; padding: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.3); overflow: hidden;">
              <img src="${brand.logo}" style="width: 100%; height: 100%; object-fit: contain;" onerror="this.src='/local/gas-station-card/logos/pompabianca.png'">
            </div>
            <div style="font-size: 8px; font-weight: bold; color: #bbb; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%; text-align: center; margin-top: 4px;">
              ${brand.label}
            </div>
            <div style="font-size: 13px; font-weight: 900; color: #39FF14;">${price}€</div>
          </div>
        `;
      }
    }
    this.content.innerHTML = html;
  }

  _getBrand(text) {
    const t = text.toLowerCase();
    const path = "/local/gas-station-card/logos/";
    if (t.includes("eni") || t.includes("enilive")) return {label: "Eni", logo: `${path}eni.png`};
    if (t.includes("agip")) return {label: "Agip", logo: `${path}agip.png`};
    if (t.includes("q8")) return {label: "Q8", logo: `${path}q8.png`};
    if (t.includes("ip")) return {label: "IP", logo: `${path}ip.png`};
    if (t.includes("api")) return {label: "Api", logo: `${path}api.png`};
    if (t.includes("shell")) return {label: "Shell", logo: `${path}shell.png`};
    if (t.includes("esso")) return {label: "Esso", logo: `${path}esso.png`};
    if (t.includes("tamoil")) return {label: "Tamoil", logo: `${path}tamoil.png`};
    if (t.includes("coop") || t.includes("mongolfiera")) return {label: "Coop", logo: `${path}coop.png`};
    if (t.includes("casillo")) return {label: "Casillo", logo: `${path}casilloedevitto.png`};
    if (t.includes("vega")) return {label: "Vega", logo: `${path}vega.png`};
    if (t.includes("sarnioil")) return {label: "Sarnioil", logo: `${path}sarnioil.png`};
    if (t.includes("metano")) return {label: "Metano", logo: `${path}metano.png`};
    return {label: "Pompa Bianca", logo: `${path}pompabianca.png`};
  }

  setConfig(config) { this.config = config; }
}

customElements.define("fuel-pro-v3", FuelProV3);
