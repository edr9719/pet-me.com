const estados = [
  'Aguascalientes',
  'Baja California',
  'Baja California Sur',
  'Campeche',
  'Chiapas',
  'Chihuahua',
  'Ciudad de México',
  'Coahuila',
  'Colima',
  'Durango',
  'Estado de México',
  'Guanajuato',
  'Guerrero',
  'Hidalgo',
  'Jalisco',
  'Michoacán',
  'Morelos',
  'Nayarit',
  'Nuevo León',
  'Oaxaca',
  'Puebla',
  'Querétaro',
  'Quintana Roo',
  'San Luis Potosí',
  'Sinaloa',
  'Sonora',
  'Tabasco',
  'Tamaulipas',
  'Tlaxcala',
  'Veracruz',
  'Yucatán',
  'Zacatecas',
];

document.addEventListener('DOMContentLoaded', function () {
  const select = document.getElementById('form-select');
  const registerForm = document.getElementById('registerForm');
  const users = [];
  //Popular Estados
  if (select) {
    estados.forEach((estado) => {
      const option = document.createElement('option');
      option.textContent = estado;
      select.appendChild(option);
    });
  }

  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputs = document.querySelectorAll('input');
    const user = {};
    let id;

    inputs.forEach((input) => {
      user[input.name] = input.value;
      user[select.name] = select.value;
      user.id = Date.now();
    });

    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
  });
});
