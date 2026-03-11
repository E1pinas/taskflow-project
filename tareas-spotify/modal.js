document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("modalContainer");
  if (!container) return;

  const response = await fetch("modal.html");
  const modalHTML = await response.text();
  container.innerHTML = modalHTML;
  inicializarModal();
  document.dispatchEvent(new CustomEvent("modalReady"));
});

function inicializarModal() {
  const modal = document.getElementById("modal");
  const abrir = document.getElementById("abrirModal");
  const cerrar = document.getElementById("cerrarModal");

  if (!modal || !abrir || !cerrar) return;

  function cerrarModal() {
    modal.classList.add("hidden");
  }

  // Hacemos disponible cerrarModal para otros scripts (app.js)
  window.cerrarModal = cerrarModal;

  abrir.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  cerrar.addEventListener("click", cerrarModal);
}

