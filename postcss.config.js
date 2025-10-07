<<<<<<< HEAD
module.exports = {
  plugins: [
    require('autoprefixer'),
    require('cssnano')({
      preset: ['default', {
        discardComments: {
          removeAll: true,
        },
        normalizeWhitespace: true,
      }]
    })
  ]
}
=======
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
>>>>>>> master
