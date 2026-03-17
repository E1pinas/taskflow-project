document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("modalContainer");
  if (!container) {
    return;
  }

  try {
    const response = await fetch("modal.html");
    const modalHTML = await response.text();
    container.innerHTML = modalHTML;
    inicializarModal();
    document.dispatchEvent(new CustomEvent("modalReady"));
  } catch (error) {
    console.error("No se pudo cargar la modal principal:", error);
  }
});

function inicializarModal() {
  const modal = document.getElementById("modal");
  const cerrar = document.getElementById("cerrarModal");
  const primerInput = document.getElementById("artistaCancion");

  if (!modal || !cerrar) {
    return;
  }

  function abrirModal() {
    modal.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
    window.setTimeout(() => primerInput?.focus(), 0);
  }

  function cerrarModal() {
    modal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  }

  window.abrirModal = abrirModal;
  window.cerrarModal = cerrarModal;

  cerrar.addEventListener("click", cerrarModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      cerrarModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.classList.contains("hidden")) {
      cerrarModal();
    }
  });
}
