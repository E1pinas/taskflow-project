const selects = document.querySelectorAll(".prioridad");

const colorMap = {
  alta: "#dc2626",
  media: "#f59e0b",
  baja: "#16a34a",
};

function actualizarColor(select) {
  select.style.backgroundColor = colorMap[select.value] || "#16a34a";
}

selects.forEach((select) => {
  actualizarColor(select);
  select.addEventListener("change", () => {
    actualizarColor(select);
  });
});
