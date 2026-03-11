document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("confirmContainer");
  if (!container) return;

  try {
    const response = await fetch("confirm-modal.html");
    const html = await response.text();
    container.innerHTML = html;
  } catch (error) {
    console.error("No se pudo cargar la modal de confirmación:", error);
    return;
  }

  inicializarConfirmModal();
});

function inicializarConfirmModal() {
  const overlay = document.getElementById("confirmOverlay");
  if (!overlay) return;

  const tituloEl = overlay.querySelector("[data-confirm-title]");
  const mensajeEl = overlay.querySelector("[data-confirm-message]");
  const detalleEl = overlay.querySelector("[data-confirm-detail]");
  const btnCancelar = overlay.querySelector("[data-confirm-cancel]");
  const btnAceptar = overlay.querySelector("[data-confirm-accept]");

  window.mostrarConfirmacion = function ({ titulo, mensaje, detalle }) {
    if (!overlay) return Promise.resolve(false);

    tituloEl.textContent = titulo || "Confirmar acción";
    mensajeEl.textContent = mensaje || "";
    detalleEl.textContent = detalle || "";

    overlay.classList.remove("hidden");

    return new Promise((resolve) => {
      function limpiar(respuesta) {
        overlay.classList.add("hidden");
        btnCancelar.removeEventListener("click", onCancelar);
        btnAceptar.removeEventListener("click", onAceptar);
        overlay.removeEventListener("click", onClickFondo);
        resolve(respuesta);
      }

      function onCancelar() {
        limpiar(false);
      }

      function onAceptar() {
        limpiar(true);
      }

      function onClickFondo(e) {
        if (e.target === overlay) {
          limpiar(false);
        }
      }

      btnCancelar.addEventListener("click", onCancelar);
      btnAceptar.addEventListener("click", onAceptar);
      overlay.addEventListener("click", onClickFondo);
    });
  };
}


