#import "@preview/charged-ieee:0.1.4": ieee

#show: ieee.with(
  title: [Unified Customer Satisfaction Tracking],
  abstract: [
    Tracking customer satisfaction is a crucial part for online businesses.
    For producers, it enables them to incorporate feedback about their products from customers directly, while for marketplace owners, it enables them to identify highly sought-after and badly selling products, and adapt their supply chain accordingly.
    We introduce Customer Satisfaction System (CuSaSy), a software that can be integrated with a large variety of marketplace systems, enabling marketplace operators to outsource customer satisfaction management to an outside party, decreasing time-to-market and increasing speed of development.
  ],
  authors: (
    (
      name: "Luca Scherzer",
      organization: [Claranet GmbH],
      location: [Mannheim, Germany],
      email: "luca.scherzer@claranet.com"
    ),
    (
      name: "Lars Beer",
      organization: [Atos SE],
      location: [Mannheim, Germany],
      email: "lars.beer@atos.net"
    ),
    (
      name: "Lukas Herberling",
      organization: [Claranet GmbH],
      location: [Mannheim, Germany],
      email: "lukas.heberling@claranet.com"
    ),
  ),
  index-terms: ("E-Business", "Customer Satisfaction"),
  bibliography: bibliography("refs.bib"),
  figure-supplement: [Fig.],
)

#include "content/01-Introduction.typ"
#include "content/02-theoretical-background.typ"

#include "content/04-system-design.typ"

#include "content/06-evaluation.typ"