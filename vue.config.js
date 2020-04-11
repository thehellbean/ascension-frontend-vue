module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
                @import "~vue-material/dist/theme/engine";
                @include md-register-theme("default", (
                  primary: md-get-palette-color(green, 900),
                  accent: md-get-palette-color(pink, 900)
                ));

                @import "~vue-material/dist/theme/all";`
      }
    }
  }
};
