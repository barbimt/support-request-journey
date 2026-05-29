ENV["BUNDLE_GEMFILE"] ||= File.expand_path("../Gemfile", __dir__)

required_ruby = File.read(File.expand_path("../.ruby-version", __dir__)).strip.delete_prefix("ruby-")
if Gem::Version.new(RUBY_VERSION) < Gem::Version.new(required_ruby)
  warn <<~MESSAGE

    This app requires Ruby #{required_ruby} or newer.
    You are using Ruby #{RUBY_VERSION} (#{RUBY_ENGINE}).

    On macOS with Homebrew, run:
      export PATH="/opt/homebrew/opt/ruby/bin:/opt/homebrew/lib/ruby/gems/4.0.0/bin:/opt/homebrew/opt/postgresql@16/bin:$PATH"
      cd backend && bin/rails db:create db:migrate db:seed

  MESSAGE
  exit 1
end

require "bundler/setup" # Set up gems listed in the Gemfile.
require "bootsnap/setup" # Speed up boot time by caching expensive operations.
