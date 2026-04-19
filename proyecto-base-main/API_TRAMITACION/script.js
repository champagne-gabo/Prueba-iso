console.log("Primera linea");

async function cargarSolicitantes() {
  try {
    const respuesta = await fetch('http://localhost:8080/leerTabla');
    if (!respuesta.ok) throw new Error('Error HTTP ' + respuesta.status);
    const solicitantes = await respuesta.json();
    console.log(solicitantes);
  } catch (error) {
    console.error('Error cargando solicitantes:', error);
  }
}


cargarSolicitantes();

console.log("Funcion terminada");

