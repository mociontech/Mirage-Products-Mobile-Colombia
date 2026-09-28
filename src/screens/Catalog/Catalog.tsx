import { useFlow } from "../../app/FlowMachine";
import { BrandFrame } from "../../components/BrandFrame";
import { Button } from "../../components/Button";
import { Footer } from "../../components/Footer";
import { Logo } from "../../components/Logo";
import { products } from "../../content/products";
import { generateIdempotencyKey, rememberUsedEmail } from "../../services/idService";
import { enqueueParticipation } from "../../services/outbox";
import { prefetchTopRanking } from "../../services/ranking";
import type { Participation } from "../../types/participation";
import styles from "./Catalog.module.css";

interface ImageCrop {
  left: string;
  top: string;
  width: string;
  height: string;
}

interface TileLayout {
  cardAspect: string;
  logo: { left: string; top: string; width: string };
  photo: {
    left: string;
    top: string;
    width: string;
    aspect: string;
    crop: ImageCrop;
  };
}

/**
 * Composicion normalizada desde ProductSelect/tiles.ts de Products Colombia.
 * Cada tarjeta conserva la relacion original entre logo, producto y recorte,
 * aunque el muro pase de 1920x1200 a la grilla vertical de 1080x1920.
 */
const TILE_LAYOUTS: Record<string, TileLayout> = {
  "magnum-22": {
    cardAspect: "359 / 240",
    logo: { left: "11.42%", top: "11.17%", width: "77.03%" },
    photo: {
      left: "19.78%",
      top: "42.08%",
      width: "60.72%",
      aspect: "218 / 121",
      crop: { left: "-8.72%", top: "-23.38%", width: "108.72%", height: "123.18%" },
    },
  },
  nex: {
    cardAspect: "359 / 240",
    logo: { left: "22.28%", top: "5.42%", width: "55.17%" },
    photo: {
      left: "17.27%",
      top: "38.75%",
      width: "65.74%",
      aspect: "236 / 138",
      crop: { left: "-15.05%", top: "-14.28%", width: "129.57%", height: "114.19%" },
    },
  },
  v32: {
    cardAspect: "359 / 240",
    logo: { left: "25.63%", top: "4.17%", width: "48.70%" },
    photo: {
      left: "20.06%",
      top: "30.83%",
      width: "59.61%",
      aspect: "214 / 138",
      crop: { left: "-4.57%", top: "-0.2%", width: "104.69%", height: "100%" },
    },
  },
  "neo-inverter": {
    cardAspect: "359 / 240",
    logo: { left: "12.26%", top: "11.25%", width: "76.52%" },
    photo: {
      left: "19.22%",
      top: "48.75%",
      width: "61.84%",
      aspect: "222 / 141",
      crop: { left: "-15%", top: "-18.62%", width: "115.08%", height: "118.62%" },
    },
  },
  "turbo-flux": {
    cardAspect: "359 / 240",
    logo: { left: "6.69%", top: "26.67%", width: "55.76%" },
    photo: {
      left: "65.74%",
      top: "15%",
      width: "29.53%",
      aspect: "106 / 168",
      crop: { left: "-0.06%", top: "-1.79%", width: "100.12%", height: "104.17%" },
    },
  },
  "flux-6l": {
    cardAspect: "359 / 240",
    logo: { left: "7.52%", top: "32.92%", width: "57.43%" },
    photo: {
      left: "66.02%",
      top: "17.08%",
      width: "31.48%",
      aspect: "113 / 157",
      crop: { left: "-0.33%", top: "-14.01%", width: "100.67%", height: "114.01%" },
    },
  },
  "flux-electric": {
    cardAspect: "359 / 240",
    logo: { left: "7.52%", top: "27.5%", width: "54.87%" },
    photo: {
      left: "64.07%",
      top: "15.42%",
      width: "33.43%",
      aspect: "120 / 169",
      crop: { left: "-0.26%", top: "-7.55%", width: "100.53%", height: "113.21%" },
    },
  },
  "ci-magnum": {
    cardAspect: "359 / 240",
    logo: { left: "37.33%", top: "15.83%", width: "25.63%" },
    photo: {
      left: "14.48%",
      top: "46.25%",
      width: "71.03%",
      aspect: "255 / 137",
      crop: { left: "-11.54%", top: "-0.1%", width: "121.11%", height: "100%" },
    },
  },
  "xtra-multi": {
    cardAspect: "359 / 240",
    logo: { left: "11.70%", top: "7.5%", width: "76.48%" },
    photo: {
      left: "16.16%",
      top: "48.33%",
      width: "67.69%",
      aspect: "243 / 107",
      crop: { left: "-8.66%", top: "-19.09%", width: "116.88%", height: "137.93%" },
    },
  },
  x32: {
    cardAspect: "359 / 240",
    logo: { left: "18.38%", top: "3.75%", width: "63.13%" },
    photo: {
      left: "22.28%",
      top: "37.5%",
      width: "55.71%",
      aspect: "200 / 133",
      crop: { left: "-5.23%", top: "-0.2%", width: "110.46%", height: "100%" },
    },
  },
  xlife: {
    cardAspect: "359 / 240",
    logo: { left: "7.80%", top: "2.5%", width: "74.37%" },
    photo: {
      left: "22.84%",
      top: "33.75%",
      width: "54.32%",
      aspect: "195 / 135",
      crop: { left: "-14.05%", top: "0%", width: "117.51%", height: "100%" },
    },
  },
  "life-12": {
    cardAspect: "359 / 240",
    logo: { left: "16.16%", top: "10.87%", width: "67.69%" },
    photo: {
      left: "20.06%",
      top: "33.75%",
      width: "59.89%",
      aspect: "215 / 135",
      crop: { left: "-3.08%", top: "0%", width: "103.37%", height: "100%" },
    },
  },
};

/**
 * Las cuatro tarjetas que ocupan una fila completa conservan el tamano visual
 * de una tarjeta normal: el logo usa la mitad izquierda y el equipo la mitad
 * derecha, con la misma escala interna del muro original.
 */
const WIDE_TILE_LAYOUTS: Record<string, TileLayout> = {
  "xtra-multi": {
    cardAspect: "718 / 240",
    logo: { left: "5.85%", top: "7.5%", width: "38.24%" },
    photo: {
      left: "56.5%",
      top: "50%",
      width: "37%",
      aspect: "243 / 107",
      crop: { left: "-8.66%", top: "-19.09%", width: "116.88%", height: "137.93%" },
    },
  },
  x32: {
    cardAspect: "718 / 240",
    logo: { left: "9.19%", top: "3.75%", width: "31.57%" },
    photo: {
      left: "59.25%",
      top: "50%",
      width: "31.5%",
      aspect: "200 / 133",
      crop: { left: "-5.23%", top: "-0.2%", width: "110.46%", height: "100%" },
    },
  },
  xlife: {
    cardAspect: "718 / 240",
    logo: { left: "3.90%", top: "2.5%", width: "37.19%" },
    photo: {
      left: "59.65%",
      top: "50%",
      width: "30.7%",
      aspect: "195 / 135",
      crop: { left: "-14.05%", top: "0%", width: "117.51%", height: "100%" },
    },
  },
  "life-12": {
    cardAspect: "718 / 240",
    logo: { left: "8.08%", top: "10.87%", width: "33.85%" },
    photo: {
      left: "58.25%",
      top: "50%",
      width: "33.5%",
      aspect: "215 / 135",
      crop: { left: "-3.08%", top: "0%", width: "103.37%", height: "100%" },
    },
  },
};

/**
 * Grid de los 12 productos - toque en cualquiera abre Detail con su banner
 * completo. "Finalizar" dispara PARTICIPATION_RESULT hacia Evius/Supabase
 * (ver services/api.ts), igual que el boton "Continuar" -> ThankYou de
 * ProductSelect en la version tablet+pitch: se manda el ultimo producto que
 * el visitante abrio y el puntaje calculado segun cuantos productos
 * DISTINTOS exploro (session.viewedProductIds, acumulado en Detail.tsx) -
 * no un fijo. Mismo criterio en las 4 apps que alimentan "catalogo"
 * (tablet+pitch y movil, CO+MX), para que el ranking combinado siga siendo
 * comparable entre dispositivos.
 *
 * Layout en dos partes: los primeros 8 productos ocupan cuatro filas de dos
 * tarjetas. Xtra Multi y cada uno de los 3 productos rojos ocupan despues
 * una fila completa en una sola tarjeta ancha.
 */
export function Catalog() {
  const { navigate, session, setSession } = useFlow();

  const gridProducts = products.slice(0, 8);
  const xtraProduct = products[8];
  const redProducts = products.slice(9);

  const openProduct = (productId: string) => {
    setSession({ selectedProductId: productId });
    navigate("detail");
  };

  const handleFinish = () => {
    const points = Math.round((session.viewedProductIds.length / products.length) * 100);
    const participation: Participation = {
      code: session.code,
      name: session.name,
      email: session.email,
      company: session.company,
      phone: session.phone,
      area: session.area,
      productId: session.selectedProductId,
      points,
      idempotencyKey: generateIdempotencyKey(),
      ts: Date.now(),
    };
    enqueueParticipation(participation);
    // Adelanta el fetch del Top 5 apenas se conoce el puntaje final (antes
    // de ThankYou) para que Ranking ya lo tenga listo al llegar ahi.
    prefetchTopRanking();
    // Recien aca (no antes de intentarlo) se marca localmente como
    // participado - asi un segundo intento en este mismo celular con el
    // mismo correo lo atrapa hasEmailPlayedLocally al instante, en vez de
    // depender solo del chequeo remoto o de que Supabase rechace el insert
    // con un 409 silencioso.
    if (session.email) rememberUsedEmail(session.email);
    navigate("thankYou");
  };

  return (
    <div className={styles.shell}>
      <BrandFrame />
      <div className={`${styles.header} enterFromTop`}>
        <div className={styles.logoWrap}>
          <Logo />
        </div>
        {session.name && <p className={styles.greeting}>Hola, {session.name.split(" ")[0]}</p>}
      </div>

      <div className={styles.scrollArea}>
        <div className={styles.grid}>
          {gridProducts.map((product, index) => {
            const layout = TILE_LAYOUTS[product.id];
            if (!layout) return null;
            return (
              <button
                key={product.id}
                type="button"
                className={`${styles.card} enterScale`}
                style={{ animationDelay: `${index * 40}ms`, aspectRatio: layout.cardAspect }}
                onClick={() => openProduct(product.id)}
              >
                <img
                  src={product.logoImage}
                  alt={product.name}
                  className={styles.cardLogo}
                  style={{ left: layout.logo.left, top: layout.logo.top, width: layout.logo.width }}
                />
                <span
                  className={styles.cardPhotoFrame}
                  style={{
                    left: layout.photo.left,
                    top: layout.photo.top,
                    width: layout.photo.width,
                    aspectRatio: layout.photo.aspect,
                  }}
                >
                  <img src={product.photoImage} alt="" className={styles.cardPhoto} style={layout.photo.crop} />
                </span>
              </button>
            );
          })}
        </div>

        {xtraProduct && (() => {
          const layout = WIDE_TILE_LAYOUTS[xtraProduct.id];
          if (!layout) return null;
          return (
            <div className={styles.wideLightRow}>
              <button
                type="button"
                className={`${styles.card} enterFromLeft`}
                style={{ animationDelay: "320ms", aspectRatio: layout.cardAspect }}
                onClick={() => openProduct(xtraProduct.id)}
              >
                <img
                  src={xtraProduct.logoImage}
                  alt={xtraProduct.name}
                  className={`${styles.cardLogo} ${styles.wideCardLogo}`}
                  style={{ left: layout.logo.left, width: layout.logo.width }}
                />
                <span
                  className={`${styles.cardPhotoFrame} ${styles.wideCardPhotoFrame}`}
                  style={{
                    left: layout.photo.left,
                    top: layout.photo.top,
                    width: layout.photo.width,
                    aspectRatio: layout.photo.aspect,
                  }}
                >
                  <img src={xtraProduct.photoImage} alt="" className={styles.cardPhoto} style={layout.photo.crop} />
                </span>
              </button>
            </div>
          );
        })()}

        <div className={styles.redBlock}>
          <div className={styles.wideGrid}>
            {redProducts.map((product, index) => {
              const layout = WIDE_TILE_LAYOUTS[product.id];
              if (!layout) return null;
              return (
                <button
                  key={product.id}
                  type="button"
                  className={`${styles.card} ${styles.cardRed} enterFromLeft`}
                  style={{ animationDelay: `${380 + index * 60}ms`, aspectRatio: layout.cardAspect }}
                  onClick={() => openProduct(product.id)}
                >
                  <img
                    src={product.logoImage}
                    alt={product.name}
                    className={`${styles.cardLogo} ${styles.wideCardLogo}`}
                    style={{ left: layout.logo.left, width: layout.logo.width }}
                  />
                  <span
                    className={`${styles.cardPhotoFrame} ${styles.wideCardPhotoFrame}`}
                    style={{
                      left: layout.photo.left,
                      top: layout.photo.top,
                      width: layout.photo.width,
                      aspectRatio: layout.photo.aspect,
                    }}
                  >
                    <img src={product.photoImage} alt="" className={styles.cardPhoto} style={layout.photo.crop} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className={`${styles.finishRow} enterFromBottom`}>
        <Button className={styles.finishButton} onClick={handleFinish}>
          Finalizar
        </Button>
      </div>

      <Footer />
    </div>
  );
}
