export const metadata = {
  title: "Store Policy",
  description:
    "Read our terms for payment, shipping, returns and purchases.",
};

export default function StorePolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-20 md:px-10 lg:py-28">
      <header className="mb-16">
        <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
          Store policy
        </p>

        <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Kjøpsvilkår</h1>

        <p className="mt-6 max-w-2xl leading-7 text-gray-600">
          Her finner du informasjon om betaling, levering, retur, angrerett,
          reklamasjon og øvrige vilkår for kjøp i nettbutikken.
        </p>

        <p className="mt-4 text-sm text-gray-500">
          Sist oppdatert: [DD.MM.ÅÅÅÅ]
        </p>
      </header>

      <div className="space-y-16">
        {/* Seller */}
        <section>
          <h2 className="text-2xl font-semibold">1. Selger</h2>

          <div className="mt-5 space-y-2 leading-7 text-gray-600">
            <p>[Firmanavn]</p>
            <p>Organisasjonsnummer: [000 000 000]</p>
            <p>Adresse: [Adresse]</p>
            <p>E-post: [epost@butikk.no]</p>
          </div>

          <p className="mt-5 leading-7 text-gray-600">
            Selger omtales videre som «vi» eller «oss». Personen som
            gjennomfører et kjøp omtales som «kunden» eller «du».
          </p>
        </section>

        {/* Prices */}
        <section>
          <h2 className="text-2xl font-semibold">2. Priser</h2>

          <p className="mt-5 leading-7 text-gray-600">
            Alle priser i nettbutikken oppgis i norske kroner (NOK). Prisene
            inkluderer merverdiavgift dersom virksomheten er
            merverdiavgiftspliktig.
          </p>

          <p className="mt-4 leading-7 text-gray-600">
            Eventuelle fraktkostnader og andre tillegg vises før kjøpet
            fullføres.
          </p>
        </section>

        {/* Payment */}
        <section>
          <h2 className="text-2xl font-semibold">3. Betaling</h2>

          <p className="mt-5 leading-7 text-gray-600">
            Betaling gjennomføres via tilgjengelige betalingsløsninger i
            nettbutikken. Betalingen behandles av vår betalingsleverandør.
          </p>

          <p className="mt-4 leading-7 text-gray-600">
            Kunden vil få informasjon om total kjøpesum før betalingen
            bekreftes.
          </p>
        </section>

        {/* Order confirmation */}
        <section>
          <h2 className="text-2xl font-semibold">4. Ordrebekreftelse</h2>

          <p className="mt-5 leading-7 text-gray-600">
            Når bestillingen er gjennomført, mottar kunden en ordrebekreftelse
            på oppgitt e-postadresse.
          </p>

          <p className="mt-4 leading-7 text-gray-600">
            Kunden er selv ansvarlig for å kontrollere at opplysningene i
            ordrebekreftelsen er korrekte.
          </p>
        </section>

        {/* Shipping */}
        <section>
          <h2 className="text-2xl font-semibold">5. Levering og frakt</h2>

          <p className="mt-5 leading-7 text-gray-600">
            Vi sender varer til [Norge / tilgjengelige land].
          </p>

          <p className="mt-4 leading-7 text-gray-600">
            Forventet leveringstid er normalt [X–X virkedager], med mindre annet
            er opplyst på produktsiden eller i kassen.
          </p>

          <p className="mt-4 leading-7 text-gray-600">
            Fraktpris beregnes og vises før bestillingen fullføres.
            Leveringstiden kan være lengre i perioder med høy pågang,
            helligdager eller forhold utenfor vår kontroll.
          </p>
        </section>

        {/* Right of withdrawal */}
        <section>
          <h2 className="text-2xl font-semibold">6. Angrerett</h2>

          <p className="mt-5 leading-7 text-gray-600">
            Ved kjøp på nett har forbrukere som hovedregel 14 dagers angrerett i
            henhold til angrerettloven.
          </p>

          <p className="mt-4 leading-7 text-gray-600">
            Angrefristen begynner normalt å løpe dagen etter at kunden har
            mottatt varen.
          </p>

          <p className="mt-4 leading-7 text-gray-600">
            Dersom du ønsker å benytte angreretten, må du gi oss tydelig beskjed
            innen angrefristen. Kunden kan bruke det standardiserte
            angreskjemaet som følger med kjøpet.
          </p>

          <p className="mt-4 leading-7 text-gray-600">
            Enkelte varer og tjenester kan være unntatt fra angreretten etter
            gjeldende lovgivning.
          </p>
        </section>

        {/* Returns */}
        <section>
          <h2 className="text-2xl font-semibold">7. Retur</h2>

          <p className="mt-5 leading-7 text-gray-600">
            Ved bruk av angreretten skal varen returneres uten unødig opphold og
            senest innen 14 dager etter at du har gitt beskjed om at du ønsker å
            angre kjøpet.
          </p>

          <p className="mt-4 leading-7 text-gray-600">
            Kunden dekker returkostnadene dersom ikke annet er avtalt eller
            opplyst.
          </p>

          <p className="mt-4 leading-7 text-gray-600">
            Varen bør returneres forsvarlig pakket. Kunden kan være ansvarlig
            for eventuell verdireduksjon dersom varen er håndtert utover det som
            er nødvendig for å fastslå varens art, egenskaper og funksjon.
          </p>

          <div className="mt-5 border-l-2 border-gray-300 pl-5 text-gray-600">
            <p>Returadresse:</p>
            <p>[Firmanavn]</p>
            <p>[Adresse]</p>
            <p>[Postnummer og sted]</p>
          </div>
        </section>

        {/* Refund */}
        <section>
          <h2 className="text-2xl font-semibold">8. Tilbakebetaling</h2>

          <p className="mt-5 leading-7 text-gray-600">
            Ved gyldig bruk av angreretten tilbakebetales beløpet i samsvar med
            gjeldende regler.
          </p>

          <p className="mt-4 leading-7 text-gray-600">
            Tilbakebetaling skjer normalt via samme betalingsmåte som ble brukt
            ved kjøpet, med mindre annet er avtalt.
          </p>
        </section>

        {/* Complaints */}
        <section>
          <h2 className="text-2xl font-semibold">9. Reklamasjon</h2>

          <p className="mt-5 leading-7 text-gray-600">
            Dersom varen har en feil eller mangel, kan kunden ha rett til å
            reklamere etter forbrukerkjøpsloven.
          </p>

          <p className="mt-4 leading-7 text-gray-600">
            Ta kontakt med oss så snart som mulig dersom du oppdager en feil.
            Beskriv problemet og legg gjerne ved bilder dersom dette er
            relevant.
          </p>

          <p className="mt-4 leading-7 text-gray-600">
            Reklamasjonsretten kommer i tillegg til angreretten og gjelder ved
            feil eller mangler ved varen.
          </p>
        </section>

        {/* Damaged shipments */}
        <section>
          <h2 className="text-2xl font-semibold">10. Skadet eller feil vare</h2>

          <p className="mt-5 leading-7 text-gray-600">
            Dersom du mottar en skadet eller feil vare, ber vi deg kontakte oss
            på [epost@butikk.no] så snart som mulig.
          </p>

          <p className="mt-4 leading-7 text-gray-600">
            Oppgi ordrenummer og legg gjerne ved bilder slik at vi kan behandle
            saken raskere.
          </p>
        </section>

        {/* Unclaimed packages */}
        <section>
          <h2 className="text-2xl font-semibold">11. Pakker som ikke hentes</h2>

          <p className="mt-5 leading-7 text-gray-600">
            Dersom en pakke ikke blir hentet og returneres til oss, kan kunden
            bli belastet dokumenterte kostnader knyttet til frakt og retur, der
            dette er tillatt etter gjeldende regler.
          </p>
        </section>

        {/* Product information */}
        <section>
          <h2 className="text-2xl font-semibold">12. Produktinformasjon</h2>

          <p className="mt-5 leading-7 text-gray-600">
            Vi forsøker å presentere produkter, bilder, beskrivelser og farger
            så nøyaktig som mulig.
          </p>

          <p className="mt-4 leading-7 text-gray-600">
            Farger og detaljer kan likevel fremstå noe forskjellig avhengig av
            skjerm, lysforhold og fotografering.
          </p>
        </section>

        {/* Personal data */}
        <section>
          <h2 className="text-2xl font-semibold">13. Personvern</h2>

          <p className="mt-5 leading-7 text-gray-600">
            Vi behandler personopplysninger som er nødvendige for å gjennomføre
            bestillinger, levere varer og følge opp kundeservice.
          </p>

          <p className="mt-4 leading-7 text-gray-600">
            Mer informasjon om hvordan personopplysninger behandles finner du i
            vår personvernerklæring.
          </p>
        </section>

        {/* Disputes */}
        <section>
          <h2 className="text-2xl font-semibold">14. Klager og tvister</h2>

          <p className="mt-5 leading-7 text-gray-600">
            Dersom du er misfornøyd med et kjøp, ber vi deg først ta kontakt med
            oss slik at vi kan forsøke å finne en løsning.
          </p>

          <p className="mt-4 leading-7 text-gray-600">
            Dersom saken ikke løses mellom partene, kan forbrukeren benytte
            relevante offentlige klageordninger.
          </p>
        </section>

        {/* Contact */}
        <section className="border-t border-gray-200 pt-12">
          <h2 className="text-2xl font-semibold">Kontakt oss</h2>

          <p className="mt-5 leading-7 text-gray-600">
            Har du spørsmål om bestillingen din, retur eller disse vilkårene,
            kan du kontakte oss:
          </p>

          <div className="mt-5 space-y-2 text-gray-600">
            <p>E-post: [epost@butikk.no]</p>
            <p>Telefon: [+47 XX XX XX XX]</p>
          </div>
        </section>
      </div>
    </main>
  );
}
