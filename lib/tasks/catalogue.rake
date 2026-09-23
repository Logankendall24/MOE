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
