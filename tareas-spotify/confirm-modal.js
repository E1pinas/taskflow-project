document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("confirmContainer");
  if (!container) {
    return;
  }

  try {
    const response = await fetch("confirm-modal.html");
    const html = await response.text();
    container.innerHTML = html;
    inicializarConfirmModal();
  } catch (error) {
    console.error("No se pudo cargar la modal de confirmacion:", error);
  }
});

function inicializarConfirmModal() {
  const overlay = document.getElementById("confirmOverlay");
  if (!overlay) {
    return;
  }

  const tituloEl = overlay.querySelector("[data-confirm-title]");
  const mensajeEl = overlay.querySelector("[data-confirm-message]");
  const detalleEl = overlay.querySelector("[data-confirm-detail]");
  const btnCancelar = overlay.querySelector("[data-confirm-cancel]");
  const btnAceptar = overlay.querySelector("[data-confirm-accept]");

  window.mostrarConfirmacion = function mostrarConfirmacion({
    titulo,
    mensaje,
    detalle,
  }) {
    tituloEl.textContent = titulo || "Confirmar accion";
    mensajeEl.textContent = mensaje || "";
    detalleEl.textContent = detalle || "";
    detalleEl.classList.toggle("hidden", !detalle);
    overlay.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
    window.setTimeout(() => btnAceptar?.focus(), 0);

    return new Promise((resolve) => {
      function limpiar(respuesta) {
        overlay.classList.add("hidden");
        document.body.classList.remove("overflow-hidden");
        btnCancelar.removeEventListener("click", onCancelar);
        btnAceptar.removeEventListener("click", onAceptar);
        overlay.removeEventListener("click", onClickFondo);
        document.removeEventListener("keydown", onEscape);
        resolve(respuesta);
      }

      function onCancelar() {
        limpiar(false);
      }

      function onAceptar() {
        limpiar(true);
      }

      function onClickFondo(event) {
        if (event.target === overlay) {
          limpiar(false);
        }
      }

      function onEscape(event) {
        if (event.key === "Escape") {
          limpiar(false);
        }
      }

      btnCancelar.addEventListener("click", onCancelar);
      btnAceptar.addEventListener("click", onAceptar);
      overlay.addEventListener("click", onClickFondo);
      document.addEventListener("keydown", onEscape);
    });
  };
}
