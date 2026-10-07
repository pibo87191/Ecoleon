function obtenerReportes() {
  const reportesGuardados = localStorage.getItem('ecoleon_reportes');
  if (reportesGuardados) {
    return JSON.parse(reportesGuardados);
  } else {
    const reportesIniciales = [
      {
        folio: '#REP-2026-089',
        fecha: '02/10/2026',
        tipo: 'Fuga en vía pública',
        colonia: 'Jardines de Jerez',
        estado: 'En Proceso'
      },
      {
        folio: '#REP-2026-042',
        fecha: '15/08/2026',
        tipo: 'Baja presión severa',
        colonia: 'Jardines de Jerez',
        estado: 'Resuelto'
      }
    ];
    localStorage.setItem('ecoleon_reportes', JSON.stringify(reportesIniciales));
    return reportesIniciales;
  }
}

function agregarReporte(tipo, colonia, descripcion) {
  const reportes = obtenerReportes();
  const fechaActual = new Date().toLocaleDateString('es-MX');
  const nuevoFolio = '#REP-2026-' + String(Math.floor(Math.random() * 900) + 100);

  const nuevoReporte = {
    folio: nuevoFolio,
    fecha: fechaActual,
    tipo: tipo,
    colonia: colonia,
    estado: 'En Proceso'
  };

  reportes.unshift(nuevoReporte);
  localStorage.setItem('ecoleon_reportes', JSON.stringify(reportes));
}

function cargarTablaHistorial() {
  const tablaBody = document.querySelector('#tabla-reportes tbody');
  if (!tablaBody) return;

  const reportes = obtenerReportes();
  tablaBody.innerHTML = '';

  reportes.forEach(rep => {
    const tr = document.createElement('tr');
    
    let badgeClass = 'badge-warning';
    if (rep.estado === 'Resuelto') {
      badgeClass = 'badge-success';
    }

    tr.innerHTML = `
      <td>${rep.folio}</td>
      <td>${rep.fecha}</td>
      <td>${rep.tipo}</td>
      <td>${rep.colonia}</td>
      <td><span class="badge ${badgeClass}">${rep.estado}</span></td>
    `;
    tablaBody.appendChild(tr);
  });
}

function actualizarContadoresDashboard() {
  const elemTotal = document.getElementById('dash-total-reportes');
  if (!elemTotal) return;

  const reportes = obtenerReportes();
  const resueltos = reportes.filter(r => r.estado === 'Resuelto').length;
  const enProceso = reportes.filter(r => r.estado === 'En Proceso').length;

  elemTotal.textContent = reportes.length;
  const elemDetalle = document.getElementById('dash-detalle-reportes');
  if (elemDetalle) {
    elemDetalle.textContent = `${resueltos} resuelto(s) / ${enProceso} en proceso`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const formReporte = document.getElementById('form-reporte');
  if (formReporte) {
    formReporte.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const tipoSelect = document.getElementById('tipo-incidencia');
      const tipoTexto = tipoSelect.options[tipoSelect.selectedIndex].text;
      const colonia = document.getElementById('colonia').value;
      const descripcion = document.getElementById('descripcion').value;

      agregarReporte(tipoTexto, colonia, descripcion);
      alert('¡Reporte registrado con éxito!');
      window.location.href = 'historial.html';
    });
  }

  cargarTablaHistorial();
  actualizarContadoresDashboard();
});