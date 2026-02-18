module.exports = {
  source: ['src/styles/tokens.json'],
  
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'src/styles/',
      files: [{
        destination: 'variables.css',
        format: 'css/variables',
        filter: (token) => token.type !== 'other' 
      }]
    }
  }
};