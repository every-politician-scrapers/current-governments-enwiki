#!/bin/bash

buncle exec ruby bin/scraper/wikipedia.rb | ifne tee data/wikipedia.csv
qsv select id data/wikipedia.csv | qsv behead | xargs wd sparql bin/wikidata.js -f csv |
  sed -e 's/T00:00:00Z//g' -e 's#http://www.wikidata.org/entity/##g' | ifne tee data/wikidata.csv
