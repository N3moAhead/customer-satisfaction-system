= Systemdesign und technische Dokumentation

Dieses Kapitel beschreibt die Architektur und Funktionsweise des Customer Satisfaction Systems aus einer anwendungsorientierten Perspektive. Es wird dargelegt, wie das System aufgebaut ist, welche Funktionalitäten es bietet und wie Benutzer mit dem System interagieren. Die Dokumentation richtet sich primär an Administratoren, Analysten und Stakeholder, die das System verstehen, nutzen oder in ihre bestehende Infrastruktur integrieren möchten.

== Architekturüberblick

CuSaSy folgt einer modernen drei Schichten-Architektur, die Frontend, Backend und Datenspeicherung klar voneinander trennt. Diese Trennung ermöglicht es, dass jede Komponente unabhängig entwickelt, gewartet und skaliert werden kann. Die Architektur ist bewusst einfach gehalten, um Wartbarkeit und Verständlichkeit zu maximieren, ohne dabei Flexibilität und Erweiterbarkeit zu opfern.

#figure(
  image("../assets/Arch.png", width: 90%),
  caption: [Systemarchitektur von CuSaSy mit Frontend, Backend-APIs und Datenspeicherung]
)

Das Frontend besteht aus einer webbasierten Analytics-Dashboard-Anwendung, die Benutzern ermöglicht, Kundenzufriedenheitsdaten zu visualisieren und zu analysieren. Benutzer greifen über einen Webbrowser auf das Dashboard zu und können interaktiv Zeiträume auswählen, Daten filtern und detaillierte Berichte einsehen. Das Dashboard ist responsiv gestaltet und passt sich automatisch an verschiedene Bildschirmgrößen an, von Desktop-Monitoren bis zu Tablet-Geräten.

Das Backend fungiert als zentrale Verarbeitungseinheit und stellt zwei spezialisierte API-Schnittstellen bereit. Die Dashboard Read API ist optimiert für den Abruf von Daten durch das Frontend. Sie liefert aggregierte Statistiken, Zeitreihendaten für Charts und detaillierte Tabellendaten. Diese API ist so konzipiert, dass häufig abgefragte Daten effizient bereitgestellt werden können. Die Data Write API hingegen dient zur Erfassung neuer Bewertungen von externen Systemen. E-Commerce-Plattformen können nach Abschluss einer Bestellung oder nach Auslieferung eines Produkts automatisch eine Bewertungsanfrage über diese API senden.

Die Persistent Data Store-Komponente speichert alle Bewertungen, Kundendaten und zugehörige Metadaten dauerhaft. Aktuell nutzt das System eine JSON-basierte Dateiablage für Entwicklungszwecke, ist aber so konzipiert, dass eine Migration zu einer relationalen Datenbank wie PostgreSQL mit minimalem Aufwand möglich ist. Die Datenbank ist das einzige zustandsbehaftete Element im System; Frontend und Backend sind stateless konzipiert.

External Data Sources repräsentieren die E-Commerce-Systeme und anderen Quellsysteme, die Kundenfeedback an CuSaSy übermitteln. Diese Systeme können über die Write API Bewertungen einreichen, ohne dass eine tiefe Integration erforderlich ist. Die Kommunikation erfolgt über standardisierte HTTP-Requests mit JSON-Payloads.

== Das Analytics Dashboard

Das Dashboard ist die primäre Benutzeroberfläche von CuSaSy und richtet sich an Analysten, Manager und andere Stakeholder, die Einblicke in die Kundenzufriedenheit gewinnen möchten. Es ist in zwei Hauptbereiche unterteilt: die Overview-Ansicht für aggregierte Zeitreihendaten und die Details-Ansicht für granulare Datenanalyse.

=== Overview-Bereich

Die Overview-Seite bietet einen umfassenden Überblick über die wichtigsten Key Performance Indicators der Kundenzufriedenheit. Beim Öffnen des Dashboards werden automatisch Daten für die letzten 30 Tage geladen und visuell aufbereitet. Benutzer sehen sofort die wesentlichen Trends und können auf einen Blick erkennen, ob die Kundenzufriedenheit steigt, stagniert oder sinkt.

Der obere Bereich der Overview-Seite präsentiert drei KPI-Cards, die aktuelle Nutzungsstatistiken zusammenfassen. Die erste Card zeigt Nutzungsmetriken wie die Anzahl eingereichter Bewertungen, genehmigte Reviews und durchschnittliche Ratings. Für jede Metrik wird der aktuelle Wert angezeigt sowie die prozentuale Veränderung gegenüber dem Vergleichszeitraum. Ein farbcodiertes Badge signalisiert auf einen Blick, ob die Entwicklung positiv oder negativ ist: Grüne Badges zeigen Verbesserungen, rote Verschlechterungen an.

Die zweite Card fokussiert auf Workspace-Metriken und zeigt Informationen wie die Anzahl aktiver Kunden, wöchentlich aktive Nutzer und System-Uptime. Diese Metriken geben Administratoren Einblick in die operative Gesundheit des Systems. Die dritte Card visualisiert Kostenverteilungen mittels eines horizontalen Balkendiagramms. Verschiedene Kostenkategorien werden proportional dargestellt, sodass Benutzer sofort erkennen, welche Bereiche die höchsten Aufwände verursachen.

Unterhalb der KPI-Cards befindet sich die Filterbar, ein zentrales Steuerungselement des Dashboards. Über einen Date Picker können Benutzer präzise Zeiträume auswählen. Das System unterstützt sowohl vordefinierte Bereiche wie "Letzte 7 Tage" oder "Letzter Monat" als auch vollständig benutzerdefinierte Datumsbereiche. Neben der Zeitraumauswahl können Benutzer einen Vergleichsmodus wählen. Der Modus "Previous Period" vergleicht den gewählten Zeitraum mit der unmittelbar vorhergehenden Periode gleicher Länge. "Last Year" vergleicht mit dem gleichen Zeitraum im Vorjahr. "No Comparison" deaktiviert den Vergleich und zeigt nur absolute Werte.

Die Kategorie-Auswahl ermöglicht es, spezifische Metriken ein- oder auszublenden. Standardmäßig sind alle verfügbaren Metriken aktiviert, aber Benutzer können durch Anklicken von Checkboxen irrelevante Metriken ausblenden. Dies ist besonders nützlich bei Präsentationen oder wenn man sich auf spezifische Aspekte konzentrieren möchte.

Der Hauptbereich der Overview-Seite zeigt für jede ausgewählte Metrik eine interaktive Chart-Card. Jede Card präsentiert ein Liniendiagramm, das die zeitliche Entwicklung der Metrik visualisiert. Die X-Achse repräsentiert die Zeit in täglichen Intervallen, die Y-Achse den Wert der Metrik. Wenn ein Vergleichsmodus aktiviert ist, zeigt das Diagramm zwei Linien: eine in Indigo für den aktuellen Zeitraum, eine in Grau für den Vergleichszeitraum. Dies ermöglicht intuitive visuelle Vergleiche.

Oberhalb jedes Charts werden der aggregierte Gesamtwert für den Zeitraum und die prozentuale Veränderung angezeigt. Beim Hovern über das Diagramm erscheint ein Tooltip, der die exakten Werte für den jeweiligen Tag zeigt. Dies ermöglicht Benutzern, Anomalien oder besondere Ereignisse an spezifischen Tagen zu identifizieren. Die Charts sind so optimiert, dass auch bei Zeiträumen von mehreren Monaten die Performance flüssig bleibt.

Das System erfasst und visualisiert verschiedene Metriken, die aus den Bewertungsdaten abgeleitet werden. "Reviews submitted" zählt die Anzahl neu eingegangener Bewertungen pro Tag. "Reviews approved" zeigt, wie viele Bewertungen nach Prüfung freigeschaltet wurden. "Average rating" berechnet den Durchschnitt aller Bewertungen eines Tages. "Customer interactions" summiert alle Kundenkontakte, während "Support escalations" die Anzahl problematischer Bewertungen mit niedrigen Ratings erfasst, die möglicherweise Support-Intervention erfordern.

=== Details-Bereich

Der Details-Bereich bietet eine tabellarische Ansicht aller Bewertungen mit umfangreichen Filter-, Such- und Sortierfunktionen. Während die Overview für strategische Analyse konzipiert ist, erlaubt die Details-Ansicht operative Arbeit mit individuellen Datensätzen. Administratoren und Support-Mitarbeiter nutzen diese Ansicht, um spezifische Bewertungen zu finden, zu prüfen und gegebenenfalls Maßnahmen einzuleiten.

Die Tabelle zeigt standardmäßig zwanzig Bewertungen pro Seite und bietet Pagination-Kontrollen zur Navigation durch größere Datenmengen. Jede Zeile repräsentiert eine einzelne Bewertung mit folgenden Spalten: Owner (Kundenname), Status (pending, approved, rejected), Rating (1-5 Sterne), Region (geografischer Standort), Costs (geschätzte Kosten), Stability (abgeleitet vom Rating: Stable, Warning, Critical) und Last Edited (letzter Änderungszeitpunkt).

Die Filterbar oberhalb der Tabelle ermöglicht Mehrfach-Filterung nach verschiedenen Kriterien. Benutzer können nach Status filtern, um beispielsweise nur ausstehende Bewertungen anzuzeigen. Ein Rating-Filter erlaubt Fokussierung auf spezifische Bewertungsstufen. Regional-Filter helfen bei der Analyse geografischer Unterschiede in der Kundenzufriedenheit. Eine Freitextsuche durchsucht Kundennamen, Bewertungstitel und Kommentare simultan.

Alle Spaltenüberschriften sind klickbar und ermöglichen Sortierung in aufsteigender oder absteigender Reihenfolge. Ein kleines Pfeilsymbol in der aktiven Spalte zeigt die aktuelle Sortierrichtung. Benutzer können beispielsweise nach Rating sortieren, um die schlechtesten Bewertungen zuerst zu sehen und prioritär zu bearbeiten. Sortierung nach Datum hilft bei chronologischer Aufarbeitung.

Die Tabelle unterstützt Zeilenauswahl durch Anklicken. Ausgewählte Zeilen werden visuell hervorgehoben durch einen farbigen linken Rand und einen leicht geänderten Hintergrund. Dies ermöglicht Bulk-Operationen auf mehreren Bewertungen gleichzeitig. Ein Bulk-Editor erscheint am unteren Bildschirmrand, sobald mindestens eine Zeile ausgewählt ist. Über diesen Editor können Benutzer den Status mehrerer Bewertungen gleichzeitig ändern, was besonders bei der Freischaltung großer Mengen hilft.

Die Tabelle ist vollständig responsiv und passt sich an kleinere Bildschirme an, indem weniger wichtige Spalten ausgeblendet oder in ein Drawer-Menü verschoben werden. Auf Tablets im Hochformat beispielsweise werden nur Owner, Rating und Status direkt angezeigt, während weitere Details durch Antippen einer Zeile expandiert werden.

== Backend-API-Schnittstellen

Das Backend stellt mehrere REST-API-Endpunkte bereit, die sowohl vom Frontend als auch von externen Systemen genutzt werden. Alle API-Endpunkte folgen konsistenten Konventionen bezüglich Request-Format, Response-Struktur und Fehlerbehandlung. Das zugrundeliegende Datenmodell, welches die Beziehungen zwischen Marktplätzen, Produkten und Bewertungen definiert, ist in Abbildung 3 dargestellt.

#figure(
  image("../assets/components.png", width: 90%),
  caption: [Datenmodell und Entitäten-Beziehungen]
)

=== Reviews-API für Bewertungsmanagement

Die Reviews-API ermöglicht vollständiges CRUD-Management von Kundenbewertungen. Der GET-Endpunkt auf /api/reviews liefert eine Liste aller Bewertungen mit optionaler Filterung und Pagination. Benutzer können nach Status filtern, um nur genehmigte, ausstehende oder abgelehnte Bewertungen zu erhalten. Ein Rating-Filter erlaubt Eingrenzung auf spezifische Bewertungsstufen. Customer-ID-Filter ermöglichen das Auffinden aller Bewertungen eines bestimmten Kunden. Limit und Offset-Parameter unterstützen Pagination für große Datenmengen.

Zum Abrufen einer einzelnen Bewertung wird GET /api/reviews/:id verwendet, wobei :id die eindeutige Identifikation der Bewertung ist. Dies liefert alle Details inklusive Kundennamen, Rating, Titel, Kommentar, Zeitstempel und Status. Falls die ID nicht existiert, wird ein 404-Fehler mit aussagekräftiger Fehlermeldung zurückgegeben.

Das Erstellen neuer Bewertungen erfolgt über POST /api/reviews mit einem JSON-Body, der alle erforderlichen Felder enthält. Pflichtfelder sind customerId zur Identifikation des bewertenden Kunden, customerName für die Anzeige, rating als numerischer Wert zwischen eins und fünf, title als Überschrift der Bewertung und comment als Freitext-Bewertung. Optional kann ein Status übergeben werden; fehlt dieser, wird automatisch "pending" gesetzt. Das System validiert alle Eingaben und gibt bei fehlerhaften Daten einen 400-Fehler mit detaillierten Validierungsfehlern zurück.

Aktualisierungen existierender Bewertungen nutzen PUT /api/reviews/:id. Es können beliebige Teilmengen der Felder übermittelt werden; nur die übergebenen Felder werden geändert. Dies erlaubt beispielsweise reine Status-Updates ohne Änderung der eigentlichen Bewertung. Das System merged die neuen Werte mit den bestehenden und aktualisiert den updatedAt-Timestamp automatisch.

Das Löschen von Bewertungen erfolgt über DELETE /api/reviews/:id. Nach erfolgreicher Löschung wird ein Bestätigungsstatus zurückgegeben. Gelöschte Bewertungen sind permanent entfernt und können nicht wiederhergestellt werden, weshalb diese Operation typischerweise nur Administratoren vorbehalten ist.

Alle Responses folgen einem einheitlichen Format mit einem success-Boolean-Feld, das anzeigt, ob die Operation erfolgreich war. Bei Erfolg enthält das data-Feld die angefragten Daten oder das Ergebnis der Operation. Bei Fehlern enthält das error-Feld eine nutzerfreundliche Fehlerbeschreibung, während ein optionales details-Feld technische Details oder Validierungsfehler auflistet.

=== Metrics-API für Dashboard-Daten

Die Metrics-API ist speziell für die Befüllung des Dashboards mit aggregierten und zeitbasierten Daten konzipiert. Der Hauptendpunkt GET /api/metrics/timeseries liefert Zeitreihendaten für Chart-Darstellungen. Benutzer spezifizieren einen Zeitraum über startDate und endDate Parameter im YYYY-MM-DD Format. Das System generiert für jeden Tag im Zeitraum einen Datenpunkt mit allen relevanten Metriken.

Die zurückgegebenen Daten enthalten Arrays von Objekten, wobei jedes Objekt ein Datum und die zugehörigen Metrikwerte repräsentiert. Beispielsweise "Reviews submitted" zeigt die Anzahl neu eingegangener Bewertungen, "Average rating" den Tagesdurchschnitt aller Ratings, "Support escalations" die Anzahl problematischer Bewertungen mit Rating kleiner oder gleich zwei. Diese Struktur ist direkt kompatibel mit den Chart-Komponenten des Frontends.

Der metrics-Parameter ermöglicht selektives Abrufen nur bestimmter Metriken. Dies reduziert Datenvolumen und Verarbeitungszeit, wenn nur spezifische Charts angezeigt werden sollen. Der Request /api/metrics/timeseries?metrics=Reviews submitted,Average rating liefert beispielsweise nur diese zwei Metriken für jeden Tag.

Der Summary-Endpunkt GET /api/metrics/summary aggregiert Daten über einen Zeitraum und berechnet KPIs sowie Vergleiche. Er liefert totalReviews als Gesamtanzahl, averageRating als Durchschnittswert, satisfactionScore als Prozentsatz der vier- und fünf-Sterne-Bewertungen. statusBreakdown zählt Bewertungen nach Status, ratingBreakdown nach Sternebewertung. customerSentiment kategorisiert Bewertungen in positive, neutrale und negative basierend auf Rating-Schwellwerten.

Bei aktiviertem Vergleichsmodus berechnet die API automatisch einen Vergleichszeitraum. Im "previous_period"-Modus wird ein Zeitraum gleicher Länge unmittelbar vor dem angefragten Zeitraum gewählt. Im "last_year"-Modus wird der exakt gleiche Kalenderzeitraum ein Jahr zuvor verwendet. Für beide Zeiträume werden identische Metriken berechnet und prozentuale Veränderungen ermittelt. Diese Informationen befüllen die KPI-Cards im Dashboard mit Trend-Badges.

=== Usage-API für detaillierte Daten

Die Usage-API unter /api/usage/details ist für die Befüllung der Details-Tabelle optimiert. Sie unterstützt umfangreiche Filterung, Sortierung und Pagination. Filter können kombiniert werden: status, rating, customerId, owner (Kundenname), region, stability und sentiment können gleichzeitig angewendet werden. Ein search-Parameter ermöglicht Volltextsuche über Titel, Kommentare und Kundennamen.

Die Sortierung erfolgt über sortBy und sortOrder Parameter. sortBy akzeptiert jeden Spaltennamen wie "rating", "createdAt" oder "owner". sortOrder kann "asc" für aufsteigend oder "desc" für absteigend sein. Standardmäßig wird nach createdAt absteigend sortiert, sodass neueste Bewertungen zuerst erscheinen.

Pagination wird über limit und offset realisiert. limit bestimmt die Anzahl Datensätze pro Seite, typischerweise zwanzig oder fünfzig. offset gibt an, wie viele Datensätze übersprungen werden sollen. Für Seite zwei mit limit=20 wäre offset=20. Die Response enthält ein pagination-Objekt mit total (Gesamtanzahl passender Datensätze), limit, offset und hasMore (Boolean, ob weitere Seiten existieren).

Zusätzlich zu den eigentlichen Datensätzen liefert die API ein statistics-Objekt mit aggregierten Informationen über das gefilterte Ergebnis. Dies beinhaltet statusBreakdown, sentimentBreakdown, stabilityBreakdown, regionBreakdown und averageRating. Diese Statistiken ermöglichen es dem Frontend, Zusammenfassungen anzuzeigen wie "Zeige 15 von 200 Bewertungen (Durchschnitt: 4.2 Sterne)".

Die API mappt interne Review-Daten auf Dashboard-freundliche Formate. Beispielsweise wird aus dem numerischen Rating ein Sentiment-Label abgeleitet: Ratings vier und fünf werden zu "Positive", drei zu "Neutral", eins und zwei zu "Negative". Ähnlich wird Stability berechnet: Hohe Ratings werden "Stable", mittlere "Warning", niedrige "Critical". Dies vereinfacht Filterung und visuelle Darstellung im Dashboard.

=== Export-API für Datenintegration

Die Export-API ermöglicht das Exportieren von Bewertungsdaten in verschiedenen Formaten für Integration mit externen Systemen wie Data Warehouses oder Business Intelligence Tools. Der Endpunkt /api/export/csv generiert eine CSV-Datei mit allen oder gefilterten Bewertungen. Die CSV enthält Spaltenüberschriften und kann direkt in Excel, Google Sheets oder Datenbankimport-Tools geladen werden. Alle Filter-Parameter der Reviews-API werden unterstützt, sodass nur relevante Daten exportiert werden.

Der JSON-Export unter /api/export/json liefert Bewertungsdaten im JSON-Format, ideal für programmatische Weiterverarbeitung oder API-zu-API-Integration. Die Struktur ist identisch zur Reviews-API, aber als downloadbare Datei verpackt mit korrektem Content-Disposition Header.

Ein besonderer Endpunkt /api/export/summary liefert eine kompakte Zusammenfassung aller Statistiken ohne einzelne Bewertungen. Dies ist nützlich für regelmäßige Reports oder Dashboard-Integration in anderen Systemen. Die Summary enthält totalReviews, averageRating, statusBreakdown und ratingBreakdown sowie einen generatedAt-Timestamp für Versionierung.

== Datenfluss und Interaktion

Das Zusammenspiel der Komponenten lässt sich anhand typischer Nutzungsszenarien verdeutlichen. Abbildung 2 zeigt die zentralen Akteure und ihre Interaktionen mit dem System.

#figure(
  image("../assets/use_cases.png", width: 90%),
  caption: [Use-Case-Diagramm der zentralen Systeminteraktionen]
)

Wenn ein Benutzer das Dashboard öffnet, sendet das Frontend automatisch mehrere API-Requests. Zunächst wird /api/metrics/timeseries für die letzten dreißig Tage abgerufen, um die Overview-Charts zu befüllen. Parallel dazu wird /api/metrics/summary für KPI-Cards angefragt. Diese initialen Requests erfolgen gleichzeitig, um Ladezeit zu minimieren.

Wählt der Benutzer einen anderen Zeitraum über den Date Picker, werden die API-Calls mit den neuen Datumsparametern wiederholt. Das Frontend zeigt während des Ladevorgangs einen subtilen Ladeindikator. Sobald die Daten eintreffen, werden die Charts flüssig neu gerendert mit Animationen, die Änderungen visuell hervorheben. Bei aktiviertem Vergleichsmodus fordert das Frontend automatisch Daten für beide Zeiträume an und visualisiert sie parallel.

Beim Wechsel zur Details-Ansicht wird /api/usage/details mit Standard-Pagination aufgerufen. Ändert der Benutzer Filter oder Sortierung, wird ein neuer Request mit aktualisierten Parametern gesendet. Das System implementiert Debouncing bei der Textsuche, sodass nicht bei jedem Tastendruck ein Request erfolgt, sondern erst nach einer kurzen Pause. Dies reduziert Server-Last und verbessert Responsiveness.

Für externe Systeme, die Bewertungen einreichen möchten, ist der Ablauf wie folgt: Nach Abschluss einer Transaktion im E-Commerce-System sendet dieses einen POST-Request an /api/reviews mit Kunden- und Bestelldaten. Das Backend validiert die Daten, erstellt eine neue Bewertung mit Status "pending" und speichert sie persistent. Eine optionale Bestätigungs-E-Mail könnte an den Kunden gesendet werden mit Link zur Bewertungsabgabe. Sobald der Kunde die Bewertung verfasst, wird sie via PUT aktualisiert.

Administratoren können über die Details-Tabelle Bewertungen sichten. Sie wählen mehrere pending-Bewertungen aus und nutzen den Bulk-Editor, um sie auf "approved" zu setzen. Das Frontend sendet für jede Bewertung einen PUT-Request. Nach erfolgreicher Aktualisierung werden die Zeilen in der Tabelle automatisch aktualisiert, um den neuen Status zu reflektieren. Die Overview-Metriken werden bei nächster Aktualisierung die genehmigten Bewertungen berücksichtigen.

== Sicherheit und Zugriffskontrolle

Obwohl das aktuelle System noch keine vollständige Authentifizierung implementiert, ist die Architektur darauf vorbereitet. Das in Kapitel II beschriebene JWT-basierte Authentifizierungskonzept kann nahtlos integriert werden. In einer produktiven Umgebung würde jeder API-Request einen Authorization-Header mit einem gültigen JWT enthalten. Das Backend würde diesen Token validieren und die enthaltenen Claims nutzen, um rollenbasierte Zugriffskontrolle durchzusetzen.

Verschiedene Benutzerrollen hätten unterschiedliche Berechtigungen. Viewer könnten nur das Dashboard sehen und Daten abrufen, aber keine Änderungen vornehmen. Analysts hätten zusätzlich Export-Rechte. Managers könnten Bewertungen genehmigen oder ablehnen. Administratoren hätten volle Kontrolle inklusive Löschrechte und Benutzerverwaltung. Diese Rollen würden im JWT als Claim kodiert und bei jedem Request überprüft.

Für Multi-Tenancy-Szenarien, wo mehrere Marktplätze das gleiche CuSaSy-System nutzen, würde der JWT eine tenant-ID enthalten. Alle Datenbank-Queries würden automatisch nach dieser ID filtern, sodass Benutzer nur Daten ihres eigenen Mandanten sehen. Dies gewährleistet strikte Datenisolation ohne komplexe Logik in der Anwendungsschicht.

Die CORS-Konfiguration des Backends würde in Produktion restriktiv gesetzt, um nur Requests von autorisierten Origins zu akzeptieren. Rate Limiting würde vor Missbrauch schützen, indem die Anzahl Requests pro IP-Adresse oder Token begrenzt wird. Sensitive Operationen wie Löschungen würden zusätzliche Bestätigung erfordern.

== Erweiterbarkeit und Integration

Die modulare Architektur von CuSaSy erleichtert Erweiterungen. Neue Metriken können hinzugefügt werden, indem die Berechnungslogik im Backend erweitert und entsprechende Chart-Cards im Frontend erstellt werden. Das System ist so konzipiert, dass solche Änderungen keine Modifikation der Kernarchitektur erfordern.

Integration mit externen Systemen erfolgt primär über die REST-APIs. E-Commerce-Plattformen können Webhooks konfigurieren, die bei bestimmten Events die Write-API aufrufen. CRM-Systeme können regelmäßig die Export-API nutzen, um Bewertungsdaten zu synchronisieren. Business Intelligence Tools können die Metrics-API anzapfen, um Kundenzufriedenheit in umfassendere Dashboards einzubinden.

Für Echtzeit-Updates könnte das System um WebSocket-Support erweitert werden. Das Dashboard würde eine WebSocket-Verbindung öffnen und bei jeder neuen Bewertung eine Push-Benachrichtigung erhalten. Dies würde Live-Updates ohne manuellen Reload ermöglichen. Die Grundarchitektur unterstützt solche Erweiterungen ohne fundamentale Änderungen.

Das Frontend ist komponentenbasiert aufgebaut, was Anpassungen erleichtert. Unternehmen können das Farbschema ändern, ihr Logo integrieren oder zusätzliche Visualisierungen hinzufügen, ohne das gesamte System neu schreiben zu müssen. Die Verwendung von TypeScript gewährleistet, dass solche Änderungen typsicher bleiben und Fehler frühzeitig erkannt werden.

== Deployment und Betrieb

CuSaSy kann in verschiedenen Umgebungen deployt werden. Für Entwicklung und Testing genügt ein lokaler Server, auf dem Node.js installiert ist. Das Backend startet auf Port 2509, das Frontend typischerweise auf Port 3000. Für Produktion werden beide Komponenten separat gebaut und auf geeigneter Infrastruktur deployed.

Das Frontend wird als statische Webanwendung gebaut via next build. Die resultierenden Dateien können auf jedem Webserver oder CDN gehostet werden. Next.js unterstützt auch serverbasiertes Deployment für Server-Side Rendering, was SEO und initiale Ladezeit verbessert. Plattformen wie Vercel oder Netlify bieten spezialisiertes Hosting für Next.js-Anwendungen mit automatischen Deployments bei Code-Änderungen.

Das Backend kann als Node.js-Prozess auf einem Server laufen, typischerweise hinter einem Reverse Proxy wie nginx. Für höhere Verfügbarkeit können mehrere Backend-Instanzen parallel betrieben und via Load Balancer verteilt werden. Die stateless Natur des Backends macht dies einfach, da keine Session-Affinität erforderlich ist. Container-basiertes Deployment mit Docker vereinfacht Installation und Skalierung weiter.

Die Datenspeicherung würde in Produktion von JSON-Dateien zu einer robusten Datenbank migriert. PostgreSQL bietet sich an für strukturierte Bewertungsdaten mit relationalen Queries. Die Datenbankverbindung kann gepoolt werden, um Performance zu optimieren. Regelmäßige Backups gewährleisten Datensicherheit. Für sehr große Datenmengen könnte Sharding nach Tenant-ID eingesetzt werden, um Last zu verteilen.

Monitoring und Logging sind essentiell für stabilen Betrieb. Application Performance Monitoring Tools wie New Relic oder Datadog können Request-Zeiten überwachen und Bottlenecks identifizieren. Structured Logging sammelt alle Backend-Events in durchsuchbaren Logs. Alerting-Regeln benachrichtigen Administratoren bei Fehlern oder Performance-Degradation. Health-Check-Endpunkte ermöglichen automatische Neustarts bei Problemen.

== Technologie-Stack

Die technische Basis von CuSaSy wurde mit Fokus auf Performance, Entwicklerproduktivität und Wartbarkeit ausgewählt. Das Backend basiert auf einer Node.js-Laufzeitumgebung, die sich durch ihre ereignisgesteuerte, nicht-blockierende I/O-Architektur besonders für datenintensive Echtzeitanwendungen eignet. Als Web-Framework kommt Express.js zum Einsatz, das eine minimalistische und flexible Struktur für die API-Entwicklung bietet. Diese Kombination ermöglicht schnelle Antwortzeiten und eine effiziente Verarbeitung paralleler Anfragen.

Für das Frontend wurde Next.js in der Version 14 gewählt, ein modernes React-Framework, das hybrides Rendering unterstützt. Durch die Nutzung von Server-Side Rendering (SSR) für initiale Seitenaufrufe und Client-Side Rendering für interaktive Dashboard-Elemente wird eine optimale Balance zwischen Ladezeit und Benutzererfahrung erreicht. Die Benutzeroberfläche wird mit Tailwind CSS gestaltet, einem Utility-First CSS-Framework, das konsistentes Design und schnelle Entwicklung fördert. TypeScript dient als primäre Programmiersprache für beide Schichten, was durch statische Typisierung die Code-Qualität erhöht und die Fehleranfälligkeit reduziert.

== Datenmodell und Persistenz

Das Datenmodell von CuSaSy ist darauf ausgelegt, sowohl operative Transaktionsdaten als auch analytische Zeitreihendaten effizient zu verwalten. Im Kern stehen drei Hauptentitäten: Die "Review"-Entität speichert das eigentliche Kundenfeedback inklusive Rating, Kommentar und Metadaten. Die "Product"-Entität verknüpft Bewertungen mit spezifischen Artikeln und hält aggregierte Kennzahlen wie Durchschnittsbewertungen vor. Die "Usage"-Entität erfasst Systemnutzungsdaten für Abrechnungs- und Analysezwecke.

Für die Datenspeicherung setzt der aktuelle Prototyp auf eine dokumentenorientierte Struktur, die eine flexible Schema-Evolution ermöglicht. In einer produktiven Umgebung ist die Migration zu einem relationalen Datenbanksystem wie PostgreSQL vorgesehen. Dies gewährleistet Datenintegrität durch Transaktionen und ermöglicht komplexe analytische Abfragen über SQL. Für die Zeitreihendaten des Dashboards werden spezialisierte Aggregationstabellen oder Materialized Views eingesetzt, um auch bei großen Datenmengen performante Lesezugriffe zu garantieren.

== Skalierbarkeit und Performance

Um zukünftiges Wachstum und steigende Lastanforderungen zu bewältigen, folgt die Systemarchitektur dem Prinzip der horizontalen Skalierung. Die Zustandsfreiheit (Statelessness) der Backend-Services erlaubt es, beliebig viele Instanzen parallel zu betreiben und die Last über einen Load Balancer zu verteilen. Dies stellt sicher, dass das System auch bei Lastspitzen, etwa während saisonaler Verkaufsaktionen im E-Commerce, stabil und reaktionsschnell bleibt.

Auf Datenbankebene sorgen Indizes auf häufig abgefragten Feldern wie `tenant_id` oder `created_at` für schnelle Suchoperationen. Eine mehrstufige Caching-Strategie entlastet die Datenbank zusätzlich: Statische Assets werden über ein Content Delivery Network (CDN) ausgeliefert, während häufig benötigte API-Antworten, wie etwa Tagesstatistiken, in einem In-Memory-Cache (z.B. Redis) zwischengespeichert werden. Diese Maßnahmen minimieren die Latenz für Endanwender und reduzieren die Infrastrukturkosten.

== Datenintegration und Compliance

Ein zentrales Designziel ist die nahtlose Integration in bestehende IT-Landschaften. CuSaSy bietet hierfür flexible Export-Mechanismen, die sowohl Batch-Exporte (CSV, JSON) als auch API-basierte Abfragen unterstützen. Dies ermöglicht die Übertragung von Bewertungsdaten in Data Warehouses oder Business Intelligence Tools zur tiefergehenden Analyse.

Besonderes Augenmerk liegt dabei auf Datenschutz und Compliance. Personenbezogene Daten werden bei Exporten standardmäßig pseudonymisiert oder anonymisiert, um den Anforderungen der DSGVO gerecht zu werden. Ein Audit-Log protokolliert alle Datenzugriffe und Exporte, um Nachvollziehbarkeit und Revisionssicherheit zu gewährleisten. Selektive Export-Optionen stellen sicher, dass nur für den jeweiligen Verwendungszweck notwendige Daten das System verlassen.

== Zusammenfassung

CuSaSy bietet eine durchdachte, benutzerfreundliche Lösung für Customer Satisfaction Management. Die klare Architektur mit separatem Frontend und Backend ermöglicht flexible Deployments und unabhängige Skalierung. Das Analytics Dashboard präsentiert Daten intuitiv und interaktiv, sodass Benutzer schnell Einblicke gewinnen können. Die umfassenden API-Schnittstellen ermöglichen sowohl Frontend-Interaktion als auch externe Integration.

Die technische Dokumentation zeigt, dass das System trotz seiner Einfachheit leistungsfähig und erweiterbar ist. Alle Komponenten folgen etablierten Best Practices und nutzen moderne Technologien. Die Fokussierung auf Klarheit und Wartbarkeit macht das System attraktiv für Organisationen, die eine nachhaltige Lösung suchen, die mit ihren Anforderungen wachsen kann.
