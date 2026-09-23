import { useFlow } from "../../app/FlowMachine";
import { PARTICIPATION_POINTS } from "../../config/env";
import { BrandFrame } from "../../components/BrandFrame";
import { Button } from "../../components/Button";
import { Footer } from "../../components/Footer";
import { Logo } from "../../components/Logo";
import { products } from "../../content/products";
import { generateIdempotencyKey, rememberUsedEmail } from "../../services/idService";
import { enqueueParticipation } from "../../services/outbox";
import type { Participation } from "../../types/participation";
import styles from "./Catalog.module.css";

/**
 * Grid de los 12 productos - toque en cualquiera abre Detail con su banner
 * completo. "Finalizar" dispara PARTICIPATION_RESULT hacia Evius/Supabase
 * (ver services/api.ts), igual que el boton "Continuar" -> ThankYou de
 * ProductSelect en la version tablet+pitch: se manda el ultimo producto que
 * el visitante abrio (o null si solo miro el grid) y el puntaje fijo
 * PARTICIPATION_POINTS.
 *
 * Layout en dos partes, igual orden que content/products.ts: los primeros 9
 * en la grilla blanca de 2 columnas (Xtra Multi Inverter a ancho completo,
 * es mas horizontal que el resto), y los ultimos 3 (X32, XLife, Life 12) en
 * el bloque rojo de abajo, apilados verticalmente - mismos productos que en
 * la franja roja lateral de la version tablet+pitch, solo que aca va abajo
 * en vez de al costado, por ser una pantalla vertical de celular.
 */
export function Catalog() {
  const { navigate, session, setSession } = useFlow();

  const gridProducts = products.slice(0, 9);
  const redProducts = products.slice(9);

  const openProduct = (productId: string) => {
    setSession({ selectedProductId: productId });
    navigate("detail");
  };

  const handleFinish = () => {
    const participation: Participation = {
      code: session.code,
      name: session.name,
      email: session.email,
      company: session.company,
      phone: session.phone,
      area: session.area,
      productId: session.selectedProductId,
      points: PARTICIPATION_POINTS,
      idempotencyKey: generateIdempotencyKey(),
      ts: Date.now(),
    };
    enqueueParticipation(participation);
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
      <div className={styles.header}>
        <div className={styles.logoWrap}>
          <Logo />
        </div>
        {session.name && <p className={styles.greeting}>Hola, {session.name.split(" ")[0]}</p>}
      </div>

      <div className={styles.scrollArea}>
        <div className={styles.grid}>
          {gridProducts.map((product) => {
            const isWide = product.id === "xtra-multi";
            return (
              <button
                key={product.id}
                type="button"
                className={`${styles.card} ${isWide ? styles.cardWide : ""}`}
                onClick={() => openProduct(product.id)}
              >
                <img src={product.logoImage} alt={product.name} className={styles.cardLogo} />
                <img src={product.photoImage} alt="" className={styles.cardPhoto} />
              </button>
            );
          })}
        </div>

        <div className={styles.redBlock}>
          {redProducts.map((product) => (
            <button
              key={product.id}
              type="button"
              className={styles.redRow}
              onClick={() => openProduct(product.id)}
            >
              <img src={product.logoImage} alt={product.name} className={styles.redLogo} />
              <img src={product.photoImage} alt="" className={styles.redPhoto} />
            </button>
          ))}
        </div>
      </div>

      <div className={styles.finishRow}>
        <Button className={styles.finishButton} onClick={handleFinish}>
          Finalizar
        </Button>
      </div>

      <Footer />
    </div>
  );
}
