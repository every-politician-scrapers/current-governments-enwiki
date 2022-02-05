#!/bin/env ruby
# frozen_string_literal: true

require 'csv'
require 'pry'
require 'scraped'
require 'wikidata_ids_decorator'

require 'open-uri/cached'

class ListPage < Scraped::HTML
  decorator WikidataIdsDecorator::Links

  field :cabinets do
    cabinet_nodes.map { |node| fragment(node => Cabinet).to_h }
  end

  private

  def cabinet_nodes
    noko.css('.mw-category li a')
  end

  class Cabinet < Scraped::HTML
    field :id do
      noko.attr('wikidata').to_s.tidy
    end

    field :name do
      noko.text.tidy
    end
  end
end

# TODO: roll this all into the SPARQL instead
url = 'https://en.wikipedia.org/wiki/Category:Current_governments'
data = ListPage.new(response: Scraped::Request.new(url: url).response).cabinets

header = data.first.keys.to_csv
rows = data.map { |row| row.values.to_csv }
abort 'No results' if rows.count.zero?

puts header + rows.join
