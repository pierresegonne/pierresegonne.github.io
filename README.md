### Pre-requisites

- **Ruby**:
If running on OS X, make sure to install the latest version of ruby.
  1. Install `rbenv`: `brew install rbenv`. Follow instructions (see [guide](https://antran.app/2021/m1_mac_part2/)).
  2. Set to the latest version (`rbenv install -l` to see available versions), `rbenv install X.X.X` and then set it as global `rbenv global X.X.X`.
  3. Reload your terminal (open a new one) and check that the ruby version is not the default one `usr/bin/ruby` by executing `which ruby`.

### Installation

- #1 install `bundle install`

### Local development

start serving the website: `bundle exec jekyll serve`

If bumping into an issue similar to `require': cannot load such file -- webrick (LoadError)`, try `bundle init` and then `bundle add $missing_package` until it succeeds.
