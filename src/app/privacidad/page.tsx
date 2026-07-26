import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description: "Aviso de privacidad de CanchaHoy.",
};

export default function PrivacidadPage() {
  return (
    <LegalPage title="Aviso de privacidad" updated="[completar antes de publicar]">
      <section>
        <h2>1. Qué datos recolectamos</h2>
        <ul>
          <li>
            <strong>Correo electrónico</strong>: cuando te suscribes a Premium, para
            darte acceso al contenido y contactarte sobre tu suscripción.
          </li>
          <li>
            <strong>Datos de pago</strong>: los procesa Stripe directamente. Nosotros
            nunca vemos ni almacenamos tu número de tarjeta.
          </li>
          <li>
            <strong>Cookie de acceso</strong>: una cookie técnica que recuerda que
            tienes una sesión Premium activa. No se usa para rastrearte ni para
            publicidad.
          </li>
        </ul>
        <p>
          Si en el futuro activamos anuncios (Google AdSense), esta sección se
          actualizará para explicar las cookies publicitarias correspondientes antes
          de activarlos.
        </p>
      </section>

      <section>
        <h2>2. Para qué usamos tus datos</h2>
        <p>
          Únicamente para darte acceso al contenido que pagaste y para comunicarnos
          contigo sobre tu suscripción (confirmaciones, cambios, cancelación). No
          vendemos tu información a terceros.
        </p>
      </section>

      <section>
        <h2>3. Con quién compartimos datos</h2>
        <ul>
          <li>
            <strong>Stripe</strong> — procesa el pago de tu suscripción.
          </li>
          <li>
            <strong>[Proveedor de hosting/base de datos, ej. Vercel + Supabase]</strong>{" "}
            — donde vive el sitio y la lista de suscriptores.
          </li>
        </ul>
        <p>
          TheSportsDB (datos de partidos) y Marca (noticias) no reciben ningún dato
          tuyo — solo consultamos su información pública, no les enviamos nada sobre
          ti.
        </p>
      </section>

      <section>
        <h2>4. Tus derechos</h2>
        <p>
          Puedes pedir que te digamos qué datos tenemos sobre ti, corregirlos, o
          eliminarlos (por ejemplo, si cancelas tu suscripción y ya no quieres que
          conservemos tu correo). Escríbenos a [completar: correo de contacto] para
          ejercer estos derechos.
        </p>
      </section>

      <section>
        <h2>5. Seguridad</h2>
        <p>
          Tomamos medidas razonables para proteger tu información, pero ningún sitio
          puede garantizar seguridad absoluta.
        </p>
      </section>

      <section>
        <h2>6. Menores de edad</h2>
        <p>Este sitio es para mayores de 18 años y no recolecta a propósito datos de menores.</p>
      </section>

      <section>
        <h2>7. Cambios a este aviso</h2>
        <p>Si lo actualizamos de forma importante, lo anunciaremos en el sitio.</p>
      </section>

      <section>
        <h2>8. Contacto</h2>
        <p>[Completar: correo de contacto del sitio].</p>
      </section>
    </LegalPage>
  );
}
