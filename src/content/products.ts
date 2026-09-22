import photoMagnum22 from "../assets/images/products-co/photo-magnum22.webp";
import photoNex from "../assets/images/products-co/photo-nex.webp";
import photoV32 from "../assets/images/products-co/photo-v32.webp";
import photoNeo from "../assets/images/products-co/photo-neo.webp";
import photoTurboFlux from "../assets/images/products-co/photo-turboflux.webp";
import photoFlux6l from "../assets/images/products-co/photo-flux6l.webp";
import photoFluxElectric from "../assets/images/products-co/photo-fluxelectric.webp";
import photoCiMagnum from "../assets/images/products-co/photo-cimagnum.webp";
import photoXtraMulti from "../assets/images/products-co/photo-xtramulti.webp";
import photoX32 from "../assets/images/products-co/photo-x32.webp";
import photoXlife from "../assets/images/products-co/photo-xlife.webp";
import photoLife12 from "../assets/images/products-co/photo-life12.webp";

import logoMagnum22 from "../assets/images/products-co/logos/logo-magnum22.png";
import logoNex from "../assets/images/products-co/logos/logo-nex.svg";
import logoV32 from "../assets/images/products-co/logos/logo-v32.png";
import logoNeo from "../assets/images/products-co/logos/logo-neo.svg";
import logoTurboFlux from "../assets/images/products-co/logos/logo-turboflux.svg";
import logoFlux6l from "../assets/images/products-co/logos/logo-flux6l.png";
import logoFluxElectric from "../assets/images/products-co/logos/logo-fluxelectric.svg";
import logoCiMagnum from "../assets/images/products-co/logos/logo-cimagnum.png";
import logoXtraMulti from "../assets/images/products-co/logos/logo-xtramulti.svg";
import logoX32 from "../assets/images/products-co/logos/logo-x32.svg";
import logoXlife from "../assets/images/products-co/logos/logo-xlife.svg";
import logoLife12 from "../assets/images/products-co/logos/logo-life12.svg";

import pitchMagnum22 from "../assets/images/pitch-co/pitch-magnum22.webp";
import pitchNex from "../assets/images/pitch-co/pitch-nex.webp";
import pitchV32 from "../assets/images/pitch-co/pitch-v32.webp";
import pitchNeo from "../assets/images/pitch-co/pitch-neo.webp";
import pitchTurboFlux from "../assets/images/pitch-co/pitch-turboflux.webp";
import pitchFlux6l from "../assets/images/pitch-co/pitch-flux6l.webp";
import pitchFluxElectric from "../assets/images/pitch-co/pitch-fluxelectric.webp";
import pitchCiMagnum from "../assets/images/pitch-co/pitch-cimagnum.webp";
import pitchXtraMulti from "../assets/images/pitch-co/pitch-xtramulti.webp";
import pitchX32 from "../assets/images/pitch-co/pitch-x32.webp";
import pitchXlife from "../assets/images/pitch-co/pitch-xlife.webp";
import pitchLife12 from "../assets/images/pitch-co/pitch-life12.webp";

/**
 * Catalogo de producto - version Colombia, mismo contenido que
 * Mirage-Products-Colombia (apps/client/src/content/products.ts) - los
 * assets se copiaron 1:1 de ahi. photoImage/logoImage se usan en el grid del
 * Catalog; pitchImage (el banner vertical completo) se usa a pantalla
 * completa en Detail - aqui ya no hay una segunda pantalla de pitch
 * sincronizada, pitchImage es directamente lo que el visitante ve en su
 * propio celular al tocar un producto.
 */
export interface Product {
  id: string;
  name: string;
  photoImage: string;
  logoImage: string;
  pitchImage: string;
}

export const products: Product[] = [
  { id: "magnum-22", name: "Magnum Inverter 22", photoImage: photoMagnum22, logoImage: logoMagnum22, pitchImage: pitchMagnum22 },
  { id: "nex", name: "NEX", photoImage: photoNex, logoImage: logoNex, pitchImage: pitchNex },
  { id: "v32", name: "V32 Inverter", photoImage: photoV32, logoImage: logoV32, pitchImage: pitchV32 },
  { id: "neo-inverter", name: "Neo Inverter", photoImage: photoNeo, logoImage: logoNeo, pitchImage: pitchNeo },
  { id: "turbo-flux", name: "Turbo Flux Series", photoImage: photoTurboFlux, logoImage: logoTurboFlux, pitchImage: pitchTurboFlux },
  { id: "flux-6l", name: "Flux 6L Series", photoImage: photoFlux6l, logoImage: logoFlux6l, pitchImage: pitchFlux6l },
  { id: "flux-electric", name: "Flux Electric", photoImage: photoFluxElectric, logoImage: logoFluxElectric, pitchImage: pitchFluxElectric },
  { id: "ci-magnum", name: "Ci Magnum", photoImage: photoCiMagnum, logoImage: logoCiMagnum, pitchImage: pitchCiMagnum },
  { id: "xtra-multi", name: "Xtra Multi Inverter", photoImage: photoXtraMulti, logoImage: logoXtraMulti, pitchImage: pitchXtraMulti },
  { id: "x32", name: "X32 Inverter", photoImage: photoX32, logoImage: logoX32, pitchImage: pitchX32 },
  { id: "xlife", name: "XLife", photoImage: photoXlife, logoImage: logoXlife, pitchImage: pitchXlife },
  { id: "life-12", name: "Life 12", photoImage: photoLife12, logoImage: logoLife12, pitchImage: pitchLife12 },
];

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}
