= Theoretischer Hintergrund

Dieses Kapitel legt die konzeptionellen und theoretischen Grundlagen für das Customer Satisfaction System (CuSaSy) dar. Es werden zunächst fundamentale Konzepte des E-Business und E-Commerce erläutert, gefolgt von etablierten Modellen zur Messung der Kundenzufriedenheit im digitalen Kontext. Anschließend werden technische Grundlagen wie Service-orientierte Architekturen und Zugriffskontrollmechanismen diskutiert, die für die Systemimplementierung relevant sind.

== E-Business und E-Commerce Grundlagen

=== Definition und Abgrenzung

E-Business bezeichnet die umfassende Integration digitaler Technologien in alle Geschäftsprozesse eines Unternehmens, während E-Commerce sich spezifisch auf die elektronische Abwicklung von Handelstransaktionen konzentriert @turban2017electronic. E-Commerce umfasst den Kauf und Verkauf von Produkten oder Dienstleistungen über elektronische Netzwerke, primär das Internet. 

Die wichtigsten E-Commerce-Geschäftsmodelle lassen sich wie folgt kategorisieren:

*Business-to-Consumer (B2C):* Unternehmen verkaufen direkt an Endkunden. Beispiele sind Online-Shops wie Amazon oder Zalando. Dies ist das für CuSaSy primäre Anwendungsgebiet, da hier die Kundenzufriedenheit unmittelbar messbar ist.

*Business-to-Business (B2B):* Transaktionen zwischen Unternehmen, etwa Großhandelsplattformen oder Beschaffungsportale. Auch hier spielt Kundenzufriedenheit eine Rolle, allerdings mit anderen Metriken als im B2C-Bereich.

*Consumer-to-Consumer (C2C):* Plattformen wie eBay oder Kleinanzeigen, wo Privatpersonen untereinander handeln. Hier ist beidseitiges Feedback (Käufer und Verkäufer) besonders relevant.

*Marketplace-Modelle:* Hybride Plattformen, die verschiedene Verkäufer aggregieren. Hier muss Zufriedenheit sowohl auf Produkt- als auch auf Plattformebene erfasst werden.

=== Erfolgsfaktoren im E-Commerce

Das DeLone und McLean Information Systems Success Model @delone2003delone identifiziert sechs Dimensionen des Erfolgs von Informationssystemen, die sich direkt auf E-Commerce-Systeme übertragen lassen:

+ *System Quality:* Technische Aspekte wie Zuverlässigkeit, Verfügbarkeit und Antwortzeiten
+ *Information Quality:* Relevanz, Genauigkeit und Vollständigkeit der bereitgestellten Informationen
+ *Service Quality:* Qualität des Supports und der Kundenbetreuung
+ *Use/Intention to Use:* Tatsächliche oder beabsichtigte Systemnutzung
+ *User Satisfaction:* Zufriedenheit der Nutzer mit dem System
+ *Net Benefits:* Gesamtnutzen für alle Stakeholder

Für E-Commerce-Plattformen ist die User Satisfaction eine zentrale Dimension, die direkt die Wiedernutzung (Use) und damit den wirtschaftlichen Erfolg (Net Benefits) beeinflusst. CuSaSy adressiert primär die Erfassung und Verbesserung der User Satisfaction.

== Kundenzufriedenheit im digitalen Kontext

=== Theoretische Grundlagen der Kundenzufriedenheit

Kundenzufriedenheit wird klassisch definiert als das Ergebnis eines kognitiven Vergleichsprozesses zwischen erwarteter und tatsächlich erfahrener Leistung. Oliver's Expectation-Confirmation Theory @oliver1980cognitive bildet die theoretische Grundlage für das Verständnis von Zufriedenheit:

*Erwartungsbildung:* Kunden entwickeln vor dem Kauf Erwartungen an ein Produkt oder eine Dienstleistung, basierend auf Marketingkommunikation, Bewertungen anderer Kunden und früheren Erfahrungen.

*Wahrgenommene Leistung:* Während und nach dem Kauf nehmen Kunden die tatsächliche Leistung wahr.

*Konfirmation/Diskonfirmation:* Kunden vergleichen die wahrgenommene Leistung mit ihren Erwartungen. Positive Diskonfirmation (Leistung übertrifft Erwartungen) führt zu hoher Zufriedenheit, negative Diskonfirmation zu Unzufriedenheit.

*Zufriedenheitsurteil:* Das Ergebnis dieses Vergleichsprozesses manifestiert sich in einem Zufriedenheitsurteil, das zukünftiges Verhalten beeinflusst.

Bhattacherjee @bhattacherjee2001understanding erweitert dieses Modell für den IT-Kontext und zeigt, dass Zufriedenheit die Fortsetzungsabsicht (Continuance Intention) maßgeblich beeinflusst – ein Aspekt, der für Online-Shops mit ihrer hohen Wechselbarriere besonders relevant ist.

=== E-Customer Satisfaction

E-Customer Satisfaction unterscheidet sich in mehreren Aspekten von traditioneller Kundenzufriedenheit @szymanski2000customer:

*Mehrdimensionalität:* Online-Zufriedenheit umfasst nicht nur das Produkt selbst, sondern auch Website-Usability, Checkout-Prozess, Lieferung, Verpackung und After-Sales-Service.

*Fehlende haptische Erfahrung:* Kunden können Produkte vor dem Kauf nicht physisch prüfen, was die Rolle von Produktbeschreibungen und Bewertungen anderer Kunden verstärkt.

*Zeitliche Entkopplung:* Zwischen Bestellung und Erhalt vergehen Tage, wodurch mehrere Touchpoints entstehen, die jeweils zur Gesamtzufriedenheit beitragen.

*Soziale Komponente:* Online-Bewertungen und Ratings werden zu einem integralen Bestandteil des Kaufprozesses und beeinflussen sowohl die Erwartungsbildung als auch die Wahrnehmung anderer Kunden.

McKinney et al. @mckinney2002web betonen, dass Web-basierte Kundenzufriedenheit stark von der Qualität der Information und des Interaktionsdesigns abhängt. Ihre Forschung zeigt, dass technische Faktoren (Ladezeiten, Navigation, Fehlerfreiheit) einen direkten Einfluss auf die Gesamtzufriedenheit haben.

=== Messung der E-Service-Qualität

Parasuraman et al. @parasuraman2005es entwickelten das E-S-QUAL Framework, ein speziell für elektronische Services konzipiertes Messinstrument. Es umfasst vier Dimensionen:

*Efficiency:* Die Leichtigkeit und Geschwindigkeit, mit der Kunden auf die Website zugreifen und diese nutzen können.

*Fulfillment:* Das Ausmaß, in dem Versprechen bezüglich Lieferung und Verfügbarkeit eingehalten werden.

*System Availability:* Die korrekte technische Funktionalität der Website.

*Privacy:* Der Schutz von Kundendaten und die Sicherheit der Transaktionen.

Wolfinbarger und Gilly @wolfinbarger2003etailq ergänzen mit eTailQ ein weiteres Framework, das besonders die Dimensionen Website Design, Customer Service, Privacy/Security und Fulfillment/Reliability betont.

=== Net Promoter Score (NPS)

Der Net Promoter Score @reichheld2003one hat sich als praktische, einfach zu implementierende Metrik etabliert. Kunden werden gefragt: "Wie wahrscheinlich ist es, dass Sie unser Unternehmen/Produkt einem Freund oder Kollegen weiterempfehlen?" (Skala 0-10).

Basierend auf der Antwort werden Kunden kategorisiert:
- Promotoren (9-10): Begeisterte Kunden, die aktiv werben
- Passive (7-8): Zufriedene, aber nicht begeisterte Kunden
- Detraktoren (0-6): Unzufriedene Kunden, die negativ kommunizieren

Der NPS wird berechnet als: NPS = % Promotoren - % Detraktoren

Trotz methodischer Kritik hat sich der NPS aufgrund seiner Einfachheit und Korrelation mit Geschäftserfolg durchgesetzt und ist eine der am häufigsten verwendeten Metriken im E-Commerce.

== Technische Grundlagen

=== Service-orientierte Architektur (SOA)

Service-orientierte Architekturen strukturieren Anwendungen als Sammlung lose gekoppelter Services, die über definierte Schnittstellen kommunizieren. Die Kernprinzipien von SOA sind für CuSaSy relevant:

*Loose Coupling:* Services sind unabhängig voneinander und können separat entwickelt, deployt und skaliert werden.

*Service Contract:* Jeder Service definiert einen klaren Vertrag (API-Spezifikation), der seine Funktionalität beschreibt.

*Autonomy:* Services haben Kontrolle über ihre eigene Logik und Daten.

*Reusability:* Services sind so gestaltet, dass sie von verschiedenen Konsumenten genutzt werden können.

*Statelessness:* Services minimieren die Speicherung von Zustandsinformationen, um Skalierbarkeit zu ermöglichen.

Im Kontext von CuSaSy bedeutet dies, dass das Zufriedenheitstracking als eigenständiger Service konzipiert wird, der von verschiedenen E-Commerce-Plattformen genutzt werden kann, ohne tiefe Integration in deren Systeme zu erfordern.

=== RESTful API Design

REST (Representational State Transfer) ist ein Architekturstil für verteilte Systeme, der besonders für Web-APIs verbreitet ist. REST basiert auf folgenden Prinzipien:

*Resource-Orientierung:* Alles wird als Ressource modelliert (z.B. Bewertungen, Produkte, Kunden)

*HTTP-Methoden:* Standard-HTTP-Verben definieren Operationen (GET zum Lesen, POST zum Erstellen, PUT/PATCH zum Aktualisieren, DELETE zum Löschen)

*Stateless Communication:* Jede Anfrage enthält alle notwendigen Informationen, der Server hält keinen Client-State

*Uniform Interface:* Konsistente, vorhersehbare API-Struktur

RESTful APIs eignen sich besonders für die Integration von CuSaSy in bestehende E-Commerce-Systeme, da sie sprachunabhängig und einfach zu konsumieren sind.

=== Zugriffskontrolle und Sicherheit

==== Role-Based Access Control (RBAC)

RBAC ist ein bewährtes Modell zur Zugriffskontrolle, bei dem Berechtigungen nicht direkt Benutzern, sondern Rollen zugewiesen werden. Benutzer erhalten dann eine oder mehrere Rollen.

Die Grundkonzepte sind:

*Users (Benutzer):* Individuelle Personen oder Systeme, die auf das System zugreifen

*Roles (Rollen):* Gruppierungen von Berechtigungen, die typischen Tätigkeitsprofilen entsprechen (z.B. "Administrator", "Analyst", "Viewer")

*Permissions (Berechtigungen):* Spezifische Operationen auf Ressourcen (z.B. "Bewertungen lesen", "Bewertungen löschen", "Statistiken exportieren")

*Sessions (Sitzungen):* Temporäre Zuordnungen von Benutzern zu aktivierten Rollen

Für CuSaSy sind typische Rollen:
- *Administrator:* Volle Kontrolle über System-Konfiguration und Benutzerverwaltung
- *Manager:* Zugriff auf alle Daten des eigenen Mandanten, kann Berichte erstellen und exportieren
- *Analyst:* Lesezugriff auf Daten und Statistiken, keine Schreibrechte
- *API User:* Technischer Benutzer für System-zu-System-Integration

==== Attribute-Based Access Control (ARBAC)

ARBAC erweitert RBAC um attributbasierte Zugriffskontrolle und bietet feinere Granularität. Anstatt nur auf Rollen zu basieren, werden Zugriffsentscheidungen basierend auf Attributen getroffen:

*Benutzerattribute:* Eigenschaften des Benutzers (Abteilung, Standort, Sicherheitsfreigabe)

*Ressourcenattribute:* Eigenschaften der zu schützenden Daten (Vertraulichkeitsstufe, Produktkategorie, Zeitraum)

*Umgebungsattribute:* Kontextuelle Faktoren (Tageszeit, Netzwerkstandort, verwendetes Gerät)

*Policies:* Regeln, die definieren, unter welchen Bedingungen Zugriff gewährt wird

Ein ARBAC-System für CuSaSy könnte beispielsweise folgende Policy implementieren:

```
ERLAUBEN, wenn:
  - Benutzerrolle = "Manager" UND
  - Benutzer.Mandant = Bewertung.Mandant UND
  - (Aktuelle_Zeit zwischen 08:00 und 18:00 ODER Benutzer.VPN_Zugriff = true)
```

ARBAC bietet mehrere Vorteile für Multi-Tenant-Systeme wie CuSaSy:

*Mandantenisolation:* Automatische Sicherstellung, dass Benutzer nur auf Daten ihres eigenen Mandanten zugreifen können

*Dynamische Anpassung:* Zugriffsentscheidungen können sich zur Laufzeit ändern, ohne Rollendefinitionen zu modifizieren

*Compliance:* Einfachere Umsetzung regulatorischer Anforderungen (z.B. DSGVO-konforme Zugriffsprotokolle)

*Feingranulare Kontrolle:* Zugriff kann auf spezifische Datensätze oder Zeiträume beschränkt werden

Die Implementierung von ARBAC erfordert jedoch zusätzliche Infrastruktur:

+ *Policy Decision Point (PDP):* Komponente, die Zugriffsentscheidungen trifft
+ *Policy Enforcement Point (PEP):* Komponente, die Entscheidungen durchsetzt
+ *Policy Information Point (PIP):* Komponente, die Attribute bereitstellt
+ *Policy Administration Point (PAP):* Verwaltungsinterface für Policies

Für CuSaSy wird ein hybrides Modell vorgeschlagen: RBAC für grundlegende Berechtigungen kombiniert mit attributbasierten Regeln für Mandantenisolation und zeitliche Zugriffseinschränkungen. Dies bietet ein ausgewogenes Verhältnis zwischen Sicherheit, Flexibilität und Implementierungsaufwand.

=== Authentication und JSON Web Tokens (JWT)

In Microservice-Umgebungen ist die Authentifizierung besonders herausfordernd, da mehrere Services validieren müssen, ob eine Anfrage autorisiert ist, ohne einen zentralen Session-Store zu benötigen.

JSON Web Tokens (JWT) lösen dieses Problem durch selbstbeschreibende, signierte Tokens. Ein JWT besteht aus drei Teilen:

*Header:* Definiert den Token-Typ und Signaturalgorithmus
*Payload:* Enthält Claims (Aussagen über den Benutzer), z.B. Benutzer-ID, Rollen, Ablaufzeit
*Signature:* Kryptographische Signatur zur Verifikation der Integrität

Vorteile von JWT für CuSaSy:
- *Stateless:* Keine serverseitige Session-Speicherung notwendig
- *Skalierbar:* Services können Tokens unabhängig validieren
- *Standardisiert:* Breite Tool- und Library-Unterstützung
- *Flexible Claims:* Können Mandanten-ID, Rollen und weitere Attribute enthalten

Sicherheitsaspekte:
- Tokens sollten über HTTPS übertragen werden
- Kurze Ablaufzeiten (z.B. 15 Minuten) mit Refresh-Token-Mechanismus
- Sensitive Daten sollten nicht im Payload gespeichert werden (da Base64-kodiert, aber nicht verschlüsselt)
- Secret Keys müssen sicher verwaltet werden

=== Multi-Tenancy Patterns

Multi-Tenancy bezeichnet die Fähigkeit eines Systems, mehrere Mandanten (Tenants) auf derselben Infrastruktur zu bedienen, während deren Daten strikt isoliert bleiben. Es gibt verschiedene Isolation-Strategien:

*Separate Datenbanken:* Jeder Mandant erhält eine eigene Datenbank. Höchste Isolation, aber höhere Infrastrukturkosten.

*Shared Database, Separate Schemas:* Gemeinsame Datenbank, aber separate Schemas pro Mandant. Guter Kompromiss zwischen Isolation und Effizienz.

*Shared Schema mit Tenant-ID:* Alle Mandanten teilen dasselbe Datenbankschema, Zeilen werden durch Tenant-ID unterschieden. Höchste Effizienz, erfordert aber sorgfältige Implementierung zur Vermeidung von Datenlecks.

Für CuSaSy wird das Shared Schema Pattern mit strikter Row-Level-Security empfohlen, um Skalierbarkeit zu maximieren bei gleichzeitiger Sicherstellung der Datenisolation.

== Zusammenfassung

Dieses Kapitel hat die theoretischen und technischen Grundlagen für CuSaSy etabliert. Die Erkenntnisse aus E-Commerce-Forschung, insbesondere die Bedeutung der Kundenzufriedenheit und deren Messung, motivieren die Entwicklung eines spezialisierten Systems. Die vorgestellten technischen Konzepte – SOA, REST, RBAC/ARBAC, JWT und Multi-Tenancy – bilden das Fundament für die Architekturentscheidungen, die in Kapitel IV detailliert werden. Die Kombination aus theoretisch fundierten Zufriedenheitsmodellen und modernen Architekturpatterns ermöglicht ein System, das sowohl wissenschaftlich fundiert als auch praktisch einsetzbar ist.
