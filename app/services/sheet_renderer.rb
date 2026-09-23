require "open3"

# Renders PDF pages (and regions of pages) to images on first request and
# caches them, so diagrams always come straight from the source PDFs and
# nothing large is committed to the repo. Needs Poppler's pdftoppm.
#
# Callers must only pass pages the catalogue references — see
# CatalogueImagesController, which whitelists them.
class SheetRenderer
  CACHE_DIR = Rails.root.join("tmp", "catalogue")
  # Longest side in pixels. Sheets mix A1 and A3 pages, so size by pixels
  # rather than dpi to get consistent images from both.
  SIZES = { "thumb" => 520, "full" => 2600 }.freeze
  CROP_DPI = 300
  CROP_BASE_DPI = 100 # crop boxes in db/catalogue are measured at 100 dpi

  class RenderError < StandardError; end

  def self.sheet(source_key, page, size)
    pixels = SIZES.fetch(size)
    render("#{source_key}-p#{page}-#{size}#{pixels}", "jpg", source_key) do |prefix|
      ["-scale-to", pixels.to_s, "-f", page.to_s, "-l", page.to_s, "-singlefile", "-jpeg", "-jpegopt", "quality=82", prefix]
    end
  end

  def self.crop(source_key, page, box)
    x, y, w, h = box.map { |v| (v * CROP_DPI / CROP_BASE_DPI).round }
    render("#{source_key}-p#{page}-crop-#{box.join('-')}", "png", source_key) do |prefix|
      ["-r", CROP_DPI.to_s, "-f", page.to_s, "-l", page.to_s, "-x", x.to_s, "-y", y.to_s,
       "-W", w.to_s, "-H", h.to_s, "-singlefile", "-png", prefix]
    end
  end

  # A cache key that changes whenever the source PDF does.
  def self.version(source_key)
    pdf = Catalogue.pdf_path(source_key)
    "#{File.mtime(pdf).to_i}-#{File.size(pdf)}"
  end

  def self.render(name, ext, source_key)
    FileUtils.mkdir_p(CACHE_DIR)
    final = CACHE_DIR.join("#{name}-#{version(source_key)}.#{ext}")
    return final if final.exist?

    # Render under a unique name, then rename, so concurrent requests never
    # serve a half-written file.
    temp_prefix = CACHE_DIR.join("tmp-#{SecureRandom.hex(8)}").to_s
    args = yield(temp_prefix)
    pdf = Catalogue.pdf_path(source_key).to_s
    _out, err, status = Open3.capture3("pdftoppm", *args[0..-2], pdf, args.last)
    raise RenderError, "pdftoppm failed for #{name}: #{err.strip}" unless status.success?

    File.rename("#{temp_prefix}.#{ext}", final)
    final
  ensure
    Dir.glob("#{temp_prefix}*").each { |f| File.delete(f) } if temp_prefix
  end
  private_class_method :render
end
