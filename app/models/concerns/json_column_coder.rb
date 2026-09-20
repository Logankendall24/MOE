# ActiveSupport::JSON.decode (used by `serialize coder: JSON`) is incompatible with the
# json 3.0.2 gem currently resolved in this app's lockfile (ArgumentError on JSON.parse).
# This bypasses ActiveSupport's wrapper and calls the json gem directly.
module JsonColumnCoder
  def self.dump(value)
    value.nil? ? nil : ::JSON.generate(value)
  end

  def self.load(value)
    return nil if value.nil?

    ::JSON.parse(value)
  end
end
