// ════════════════════════════════════════════
//  ADMIN.JS — Panel de Administración thiaretto
// ════════════════════════════════════════════

// ── Tema ──
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (savedTheme === 'dark') {
        document.getElementById('themeBtn').textContent = '☀️';
    }
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    document.getElementById('themeBtn').textContent = next === 'dark' ? '☀️' : '🌙';
}

// ── Toast ──
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// ── Tabs ──
function switchTab(nombre, btn) {
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + nombre).classList.add('active');
    btn.classList.add('active');
}

// ── Formatear fecha ──
function formatFecha(iso) {
    if (!iso) return '-';
    const d = new Date(iso);
    return d.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' })
        + ' ' + d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
}

// ── Color por estado ──
function colorEstado(estado) {
    switch (estado) {
        case 'Pendiente':   return '#f59e0b';
        case 'En revisión': return '#3b82f6';
        case 'En proceso':  return '#8b5cf6';
        case 'Resuelto':    return '#10b981';
        default:            return '#6b7280';
    }
}

// ════════════════════════════════════════════
//  CARGAR DATOS
// ════════════════════════════════════════════

// ── Cargar Clientes ──
async function cargarClientes() {
    try {
        const res = await fetch('/api/clientes/ordenados');
        const json = await res.json();
        const clientes = json.data || [];

        document.getElementById('badgeClientes').textContent = clientes.length;
        document.getElementById('statClientes').textContent = clientes.length;

        const tbody = document.getElementById('tablaClientes');

        if (clientes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="loading">No hay clientes registrados aún.</td></tr>';
            return;
        }

        tbody.innerHTML = clientes.map(c => `
            <tr>
                <td><strong>${c.nombre}</strong></td>
                <td>${c.correo}</td>
                <td>${c.telefono}</td>
                <td>${formatFecha(c.createdAt)}</td>
                <td>
                    <button class="btn-edit"
                        onclick="abrirEditar('${c._id}', '${c.nombre}', '${c.correo}', '${c.telefono}')">
                        ✏️ Editar
                    </button>
                    <button class="btn-delete"
                        onclick="eliminarCliente('${c._id}', '${c.nombre}')">
                        🗑️ Eliminar
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error al cargar clientes:', error);
        document.getElementById('tablaClientes').innerHTML =
            '<tr><td colspan="5" class="loading">Error al cargar los datos.</td></tr>';
    }
}

// ── Cargar Solicitudes ──
async function cargarSolicitudes() {
    try {
        const res = await fetch('/api/solicitudes');
        const json = await res.json();
        const solicitudes = json.data || [];

        document.getElementById('badgeSolicitudes').textContent = solicitudes.length;
        document.getElementById('statSolicitudes').textContent = solicitudes.length;

        const tbody = document.getElementById('tablaSolicitudes');

        if (solicitudes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="loading">No hay solicitudes registradas aún.</td></tr>';
            return;
        }

        tbody.innerHTML = solicitudes.map(s => `
            <tr>
                <td>
                    <strong>${s.cliente?.nombre || '-'}</strong><br>
                    <small style="opacity:0.6">${s.cliente?.correo || ''}</small>
                </td>
                <td>${s.motivo?.nombre || '-'}</td>
                <td>${s.mensaje}</td>
                <td>
                    <select class="estado-select" onchange="cambiarEstado('${s._id}', this.value)"
                        style="border-color: ${colorEstado(s.estado || 'Pendiente')}; color: ${colorEstado(s.estado || 'Pendiente')}">
                        <option value="Pendiente"   ${s.estado === 'Pendiente'   ? 'selected' : ''}>🟡 Pendiente</option>
                        <option value="En revisión" ${s.estado === 'En revisión' ? 'selected' : ''}>🔵 En revisión</option>
                        <option value="En proceso"  ${s.estado === 'En proceso'  ? 'selected' : ''}>🟠 En proceso</option>
                        <option value="Resuelto"    ${s.estado === 'Resuelto'    ? 'selected' : ''}>🟢 Resuelto</option>
                    </select>
                </td>
                <td>${formatFecha(s.createdAt)}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error al cargar solicitudes:', error);
        document.getElementById('tablaSolicitudes').innerHTML =
            '<tr><td colspan="5" class="loading">Error al cargar los datos.</td></tr>';
    }
}

// ── Cargar Motivos ──
async function cargarMotivos() {
    try {
        const res = await fetch('/api/solicitudes/por-motivo');
        const json = await res.json();
        const motivos = json.data || [];

        document.getElementById('badgeMotivos').textContent = motivos.length;
        document.getElementById('statMotivos').textContent = motivos.length;

        const tbody = document.getElementById('tablaMotivos');

        if (motivos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" class="loading">No hay tipos de contacto aún.</td></tr>';
            return;
        }

        tbody.innerHTML = motivos.map(m => `
            <tr>
                <td><strong>${m._id}</strong></td>
                <td>Creado desde el formulario web</td>
                <td>
                    <span class="estado-badge">
                        ${m.total} solicitud${m.total !== 1 ? 'es' : ''}
                    </span>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error al cargar motivos:', error);
        document.getElementById('tablaMotivos').innerHTML =
            '<tr><td colspan="3" class="loading">Error al cargar los datos.</td></tr>';
    }
}

// ════════════════════════════════════════════
//  OPERACIONES CRUD
// ════════════════════════════════════════════

// ── Cambiar Estado de Solicitud ──
async function cambiarEstado(id, nuevoEstado) {
    try {
        const res = await fetch('/api/solicitudes/' + id + '/estado', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: nuevoEstado })
        });
        const json = await res.json();
        if (json.success) {
            showToast('✅ Estado actualizado: ' + nuevoEstado);
            // Actualizar color del select
            const selects = document.querySelectorAll('.estado-select');
            selects.forEach(sel => {
                if (sel.value === nuevoEstado) {
                    sel.style.borderColor = colorEstado(nuevoEstado);
                    sel.style.color = colorEstado(nuevoEstado);
                }
            });
        } else {
            showToast('❌ Error al actualizar el estado');
        }
    } catch (error) {
        console.error('Error al cambiar estado:', error);
        showToast('❌ Error de conexión');
    }
}

// ── Eliminar Cliente ──
async function eliminarCliente(id, nombre) {
    if (!confirm(`¿Seguro que deseas eliminar al cliente "${nombre}"?`)) return;

    try {
        const res = await fetch('/api/clientes/' + id, { method: 'DELETE' });
        const json = await res.json();

        if (json.success) {
            showToast('✅ Cliente eliminado correctamente');
            cargarClientes();
        } else {
            showToast('❌ Error al eliminar el cliente');
        }
    } catch (error) {
        console.error('Error al eliminar:', error);
        showToast('❌ Error de conexión');
    }
}

// ── Abrir Modal Editar ──
function abrirEditar(id, nombre, correo, telefono) {
    document.getElementById('editId').value = id;
    document.getElementById('editNombre').value = nombre;
    document.getElementById('editCorreo').value = correo;
    document.getElementById('editTelefono').value = telefono;
    document.getElementById('modalEditar').classList.add('active');
}

// ── Cerrar Modal ──
function cerrarModal() {
    document.getElementById('modalEditar').classList.remove('active');
}

// ── Guardar Edición (UPDATE) ──
async function guardarEdicion() {
    const id       = document.getElementById('editId').value;
    const nombre   = document.getElementById('editNombre').value;
    const correo   = document.getElementById('editCorreo').value;
    const telefono = document.getElementById('editTelefono').value;

    if (!nombre || !correo || !telefono) {
        showToast('⚠️ Completa todos los campos');
        return;
    }

    try {
        const res = await fetch('/api/clientes/' + id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, correo, telefono })
        });
        const json = await res.json();

        if (json.success) {
            showToast('✅ Cliente actualizado correctamente');
            cerrarModal();
            cargarClientes();
        } else {
            showToast('❌ Error al actualizar el cliente');
        }
    } catch (error) {
        console.error('Error al actualizar:', error);
        showToast('❌ Error de conexión');
    }
}

// ── Cerrar modal al hacer click fuera ──
document.getElementById('modalEditar').addEventListener('click', function(e) {
    if (e.target === this) cerrarModal();
});

// ════════════════════════════════════════════
//  INICIALIZAR
// ════════════════════════════════════════════
cargarClientes();
cargarSolicitudes();
cargarMotivos();