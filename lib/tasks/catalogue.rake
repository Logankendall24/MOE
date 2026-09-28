namespace :catalogue do
  desc "Extract reading-order page text from every source PDF (used to verify catalogue quotes)"
  task extract_text: :environment do
    Catalogue.sources.each do |key, source|
      out = Catalogue::SOURCE_TEXT_DIR.join("#{key}.txt")
      FileUtils.mkdir_p(out.dirname)
      ok = system("pdftotext", "-enc", "UTF-8", Catalogue.pdf_path(key).to_s, out.to_s)
      abort "pdftotext failed for #{key} — is Poppler installed?" unless ok
      puts "#{key}: #{File.read(out).count("\f")} pages"
    end
  end

  desc "Render every catalogue crop and page thumbnail into the image cache (run at image build)"
  task prerender: :environment do
    Catalogue.categories.each_key do |category|
      content = Catalogue.content(category)
      CatalogueImagesController.crop_ids(content).each do |id|
        page, box, opts = CatalogueImagesController.find_crop(content, id)
        SheetRenderer.crop(content.fetch("catalogue"), page, box, **opts) if box
      end
    end
    Catalogue.renderable_pages.each { |source, page| SheetRenderer.sheet(source, page, "thumb") }
    puts "Prerendered #{Dir[SheetRenderer::CACHE_DIR.join('*')].size} catalogue images."
  end

  desc "Check every quoted passage in db/catalogue appears on the page it cites"
  task verify: :environment do
    problems = Catalogue::Verifier.new.problems
    if problems.empty?
      puts "All catalogue quotes found on their cited pages."
    else
      problems.each { |p| puts "✗ #{p}" }
      abort "#{problems.size} quote(s) not found on the cited page."
    end
  end
end
