console.log('Webpack is working!');

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = `
      <h1>SpurMount Wholesale</h1>
      <p>Development server is running!</p>
      <p>Edit files in the <code>public</code> directory to see changes.</p>
    `;
  } else {
    console.error('Could not find #app element');
  }
});
