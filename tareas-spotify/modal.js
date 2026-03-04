document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("modalContainer");
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

  abrir.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  cerrar.addEventListener("click", () => {
    modal.classList.add("hidden");
  });
}
