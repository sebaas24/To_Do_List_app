document.addEventListener("DOMContentLoaded", function () {

  const app = new Framework7({
    root: '#app'
  });

  let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

  const tituloInput = document.getElementById("titulo");
  const descripcionInput = document.getElementById("descripcion");
  const tipoSelect = document.getElementById("tipo");
  const btnAgregar = document.getElementById("btnAgregar");
  const listaTareas = document.getElementById("tareas");
  const pendientesSpan = document.getElementById("pendientes");
  const completadasSpan = document.getElementById("completadas");
  const detalleContenido = document.getElementById("detalleContenido");

  function guardarTareas() {
    localStorage.setItem("tareas", JSON.stringify(tareas));
  }

  function actualizarResumen() {
    pendientesSpan.textContent = tareas.filter(t => !t.completada).length;
    completadasSpan.textContent = tareas.filter(t => t.completada).length;
  }

  function mostrarDetalle(tarea) {
    detalleContenido.innerHTML = `
      <strong>Título:</strong> ${tarea.titulo}<br>
      <strong>Descripción:</strong> ${tarea.descripcion}<br>
      <strong>Tipo:</strong> ${tarea.tipo}<br>
      <strong>Estado:</strong> ${tarea.completada ? "Completada" : "Pendiente"}
    `;
  }

  function renderizarTareas() {
    listaTareas.innerHTML = "";

    tareas.forEach((tarea, index) => {
      const li = document.createElement("li");
      li.textContent = tarea.titulo;

      if (tarea.completada) {
        li.style.textDecoration = "line-through";
      }

      li.onclick = () => mostrarDetalle(tarea);

      const btnCompletar = document.createElement("button");
      btnCompletar.textContent = "✔";
      btnCompletar.onclick = (e) => {
        e.stopPropagation();
        tarea.completada = !tarea.completada;
        guardarTareas();
        renderizarTareas();
      };

      const btnEliminar = document.createElement("button");
      btnEliminar.textContent = "🗑";
      btnEliminar.onclick = (e) => {
        e.stopPropagation();
        tareas.splice(index, 1);
        guardarTareas();
        renderizarTareas();
        detalleContenido.textContent = "Seleccione una tarea";
      };

      li.appendChild(btnCompletar);
      li.appendChild(btnEliminar);
      listaTareas.appendChild(li);
    });

    actualizarResumen();
  }

  btnAgregar.onclick = function () {
    if (!tituloInput.value || !descripcionInput.value || !tipoSelect.value) {
      alert("Complete todos los campos");
      return;
    }

    tareas.push({
      titulo: tituloInput.value,
      descripcion: descripcionInput.value,
      tipo: tipoSelect.value,
      completada: false
    });

    guardarTareas();
    renderizarTareas();

    tituloInput.value = "";
    descripcionInput.value = "";
    tipoSelect.value = "";
  };

  renderizarTareas();
});
