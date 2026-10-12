// Escape text for set:html, and wrap open TODO(user) items in a visible marker.
export const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export const todo = (s) => {
  const e = esc(s);
  return e.includes("TODO(user)") ? `<span class="todo">${e}</span>` : e;
};
