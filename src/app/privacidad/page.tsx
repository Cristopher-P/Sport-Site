import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description: "Aviso de privacidad de CanchaHoy.",
};

export default function PrivacidadPage() {
  return (
    <LegalPage title="Aviso de privacidad" updated="26 de julio de 2026">
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
            tienes una sesión Premium activa. No se usa para publicidad.
          </li>
          <li>
            <strong>Cookies publicitarias (Google AdSense)</strong>: usamos Google
            AdSense para mostrar anuncios. Google puede usar cookies para mostrar
            anuncios según tus visitas a este y otros sitios. Si visitas desde el
            Espacio Económico Europeo, el Reino Unido o Suiza, te mostramos primero
            un mensaje de consentimiento (a través de la plataforma certificada de
            Google) donde puedes <strong>aceptar, rechazar o administrar</strong>{" "}
            estas cookies antes de que se activen. Puedes cambiar tu elección
            cuando quieras desde ese mismo mensaje. Más información en la{" "}
            <a
              href="https://policies.google.com/technologies/ads"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              política de anuncios de Google
            </a>
            .
          </li>
        </ul>
      </section>

      <section>
        <h2>2. Para qué usamos tus datos</h2>
        <p>
          Tu correo se usa únicamente para darte acceso al contenido Premium que
          pagaste y para comunicarnos contigo sobre tu suscripción (confirmaciones,
          cambios, cancelación). No vendemos tu información a terceros. Las cookies
          publicitarias las administra Google conforme a tu elección de consentimiento,
          no nosotros directamente.
        </p>
      </section>

      <section>
        <h2>3. Con quién compartimos datos</h2>
        <ul>
          <li>
            <strong>Stripe</strong> — procesa el pago de tu suscripción.
          </li>
          <li>
            <strong>Google AdSense</strong> — muestra los anuncios del sitio, sujeto a
            tu consentimiento si aplica.
          </li>
          <li>
            <strong>Vercel</strong> (hosting) y <strong>Supabase</strong> (base de
            datos de suscriptores) — donde vive el sitio y la lista de suscriptores.
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
          conservemos tu correo). Escríbenos a{" "}
          <a href="mailto:perez.perez.cristopher.bahi@gmail.com" className="underline">
            perez.perez.cristopher.bahi@gmail.com
          </a>{" "}
          para ejercer estos derechos.
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
        <p>
          <a href="mailto:perez.perez.cristopher.bahi@gmail.com" className="underline">
            perez.perez.cristopher.bahi@gmail.com
          </a>
        </p>
      </section>
    </LegalPage>
  );
}
