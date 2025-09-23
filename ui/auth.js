// ui/auth.js
export async function ensureIdentity() {
  return new Promise((resolve) => {
    if (!window.netlifyIdentity) return resolve(null);
    netlifyIdentity.on('init', user => resolve(user));
    netlifyIdentity.init();
  });
}
