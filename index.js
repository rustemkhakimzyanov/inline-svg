'use strict'

let mix = require('laravel-mix');
let fs = require('fs');

function writeJavascript(file, icons, defaultClass) {
  fs.writeFileSync(file, `
    const icons = {
      ${icons}
    }

    const globalClass = '${defaultClass}';

    module.exports = (name, classes = '') => {
      if (!icons[name]) {
        console.err('Failed to load SVG ' + name);
        return '';
      }

      return icons[name].replace('<svg ', '<svg class="' + globalClass + ' ' + classes + '"');
    };
  `);
}

class SVG {
  register(options) {
    this.options = Object.assign({
      class: '',
      assets: ['./resources/assets/svg/'],
      output: './resources/assets/js/svg.js',
    }, options);
  }

  boot() {
    let icons = '';

    this.options.assets.forEach((path) => {
      fs.readdirSync(path).forEach(file => {
        if (!file.endsWith('.svg')) return;

        const iconName = file.replace('.svg', '');
        let icon = (fs.readFileSync(path + file) + '');
        icon = icon.replace(/(\r\n|\n|\r)/gm,"");

        // console.log(icon)

        icons += `'${iconName}': '${icon}',\n\r`;
      });
    });

    writeJavascript(this.options.output, icons, this.options.class);
  }
}

mix.extend('svg', new SVG());
