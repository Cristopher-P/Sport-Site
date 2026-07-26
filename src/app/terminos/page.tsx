import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Términos de servicio",
  description: "Términos de servicio de CanchaHoy.",
};

export default function TerminosPage() {
  return (
    <LegalPage title="Términos de servicio" updated="26 de julio de 2026">
      <section>
        <h2>1. Qué es CanchaHoy</h2>
        <p>
          CanchaHoy es un sitio informativo de horarios, resultados y estadísticas
          deportivas. Ofrecemos una capa gratuita (horarios, resultados, noticias) y
          una suscripción de pago (&quot;CanchaHoy Premium&quot;) con análisis
          estadístico adicional de partidos por venir.
        </p>
      </section>

      <section>
        <h2>2. No somos una casa de apuestas</h2>
        <p>
          CanchaHoy no opera apuestas deportivas, no procesa dinero de apuestas y no
          tiene ninguna relación con casas de apuestas. Todo el contenido —incluido el
          de la suscripción Premium— es informativo: estadísticas y probabilidades
          estimadas a partir de resultados reales, calculadas con una fórmula simple
          que explicamos en el propio sitio. No garantizamos resultados de ningún
          partido, y ninguna estadística que mostramos debe interpretarse como
          consejo de apuestas. Si decides apostar, lo haces por tu cuenta, con tus
          propios recursos, en la plataforma que elijas, bajo tu propia
          responsabilidad.
        </p>
      </section>

      <section>
        <h2>3. Edad mínima</h2>
        <p>
          Este sitio es para mayores de 18 años. Al usarlo confirmas que cumples con
          esa edad mínima.
        </p>
      </section>

      <section>
        <h2>4. Suscripción Premium</h2>
        <ul>
          <li>Es una suscripción mensual recurrente, procesada por Stripe.</li>
          <li>Puedes cancelarla cuando quieras; deja de renovarse en el siguiente ciclo.</li>
          <li>
            No ofrecemos reembolsos por periodos ya iniciados. Si cancelas, tu
            acceso Premium sigue activo hasta el final del periodo que ya
            pagaste, y simplemente no se renueva el siguiente mes.
          </li>
          <li>Nos reservamos el derecho de ajustar el precio, avisando con anticipación.</li>
        </ul>
      </section>

      <section>
        <h2>5. Acceso a tu cuenta</h2>
        <p>
          El acceso a Premium se vincula al correo con el que te suscribiste. Eres
          responsable de mantener el acceso a ese correo.
        </p>
      </section>

      <section>
        <h2>6. Contenido de terceros</h2>
        <p>
          Los horarios y resultados provienen de TheSportsDB. Los titulares de
          noticias provienen del RSS público de Marca, con enlace a la nota original —
          no reproducimos artículos completos. No somos responsables por la exactitud
          del contenido de esas fuentes externas.
        </p>
      </section>

      <section>
        <h2>7. Limitación de responsabilidad</h2>
        <p>
          El servicio se ofrece &quot;tal cual&quot;. No garantizamos que esté libre
          de errores o interrupciones. En la medida permitida por la ley, no somos
          responsables por decisiones que tomes (incluidas apuestas) basándote en
          contenido del sitio.
        </p>
      </section>

      <section>
        <h2>8. Cambios a estos términos</h2>
        <p>
          Podemos actualizar estos términos. Los cambios importantes se anunciarán en
          el sitio.
        </p>
      </section>

      <section>
        <h2>9. Contacto</h2>
        <p>
          <a href="mailto:perez.perez.cristopher.bahi@gmail.com" className="underline">
            perez.perez.cristopher.bahi@gmail.com
          </a>
        </p>
      </section>
    </LegalPage>
  );
}
