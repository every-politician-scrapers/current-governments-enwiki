module.exports = (...ids) => {
  ids = ids.map(value => `wd:${value}`).join(' ')

  return `SELECT DISTINCT ?cabinet ?cabinetLabel
                  ?start ?startPrecision ?end ?endPrecision
                  ?jurisdiction ?jurisdictionLabel
                  ?country ?countryLabel
                  ?isa ?isaLabel
  WHERE {
    VALUES ?cabinet { ${ids} }

    OPTIONAL { ?cabinet wdt:P31   ?isa }
    OPTIONAL { ?cabinet wdt:P1001 ?jurisdiction }
    OPTIONAL { ?cabinet wdt:P17   ?country }

    OPTIONAL { ?cabinet p:P571 [ a wikibase:BestRank ; psv:P571 [wikibase:timeValue ?inception ; wikibase:timePrecision ?inceptionPrecision] ] }
    OPTIONAL { ?cabinet p:P580 [ a wikibase:BestRank ; psv:P580 [wikibase:timeValue ?startTime ; wikibase:timePrecision ?startTimePrecision] ] }
    OPTIONAL { ?cabinet p:P576 [ a wikibase:BestRank ; psv:P576 [wikibase:timeValue ?abolished ; wikibase:timePrecision ?abolishedPrecision] ] }
    OPTIONAL { ?cabinet p:P582 [ a wikibase:BestRank ; psv:P582 [wikibase:timeValue ?endTime   ; wikibase:timePrecision ?endTimePrecision]   ] }

    BIND(COALESCE(?inception, ?startTime) AS ?start)
    BIND(COALESCE(?inceptionPrecision, ?startTimePrecision) AS ?startPrecision)

    BIND(COALESCE(?abolished, ?endTime) AS ?end)
    BIND(COALESCE(?abolishedPrecision, ?endTimePrecision) AS ?endPrecision)

    SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
  }
  # ${new Date().toISOString()}
  ORDER BY ?start ?cabinet`
}
