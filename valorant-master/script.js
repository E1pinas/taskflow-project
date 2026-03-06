const selects = document.querySelectorAll(".prioridad");
const botonTema = document.getElementById("toggleTema");
const TEMA = "valorant_master_theme";

const colorMap = {
  alta: "#dc2626",
  media: "#f59e0b",
  baja: "#16a34a",
};

function actualizarColor(select) {
  select.style.backgroundColor = colorMap[select.value] || "#16a34a";
}

function actualizarTextoBotonTema() {
  if (!botonTema) {
    return;
  }
  botonTema.textContent = document.documentElement.classList.contains("dark")
    ? "Modo claro"
    : "Modo oscuro";
}

function aplicarTemaInicial() {
  const temaGuardado = localStorage.getItem(TEMA);
  const usarOscuro = temaGuardado === null ? true : temaGuardado === "dark";
  document.documentElement.classList.toggle("dark", usarOscuro);
  actualizarTextoBotonTema();
}

selects.forEach((select) => {
  actualizarColor(select);
  select.addEventListener("change", () => {
    actualizarColor(select);
  });
});

if (botonTema) {
  botonTema.addEventListener("click", () => {
    const activarOscuro = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", activarOscuro);
    localStorage.setItem(TEMA, activarOscuro ? "dark" : "light");
    actualizarTextoBotonTema();
  });
}

aplicarTemaInicial();
