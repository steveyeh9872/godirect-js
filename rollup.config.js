import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import license from 'rollup-plugin-license';


const terserPlugin = terser({
  output: {
    comments(node, comment) {
      const text = comment.value;
      const type = comment.type;
      if (type == 'comment2') {
        // multiline comment
        return /@preserve|@license|@cc_on/i.test(text);
      }
    }
  }
});

const licensePlugin = license({
  banner: `Copyright (c) ${(new Date().getFullYear())} Vernier Software. All rights reserved.
    This code may only be used under the GPL-3 license found at
    https://raw.githubusercontent.com/VernierST/godirect-js/master/LICENSE`,
});

export default [
{
  input: './src/godirect.js',
  output: {
    file: './dist/godirect.min.js',
    format: 'esm'
  },
  plugins: [terserPlugin, licensePlugin]
},
{
  input: './src/godirect.js',
  output: {
    file: './dist/godirect.min.umd.js',
    format: 'umd',
    name: 'godirect'
  },
  plugins: [
    terserPlugin,
    licensePlugin,
    nodeResolve({
      browser: true
    }),
    babel({
      babelrc: false,
      presets: [
        ['@babel/env', {
	        targets: {
	          node: '8.0.0'
	        },
          modules: false,
          useBuiltIns: 'usage',
          forceAllTransforms: true
        }]
      ],
      exclude: 'node_modules/**',
    })
  ]
}
];
