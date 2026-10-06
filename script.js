// La Previa: baraja mezclada de los modos elegidos, con nombres de los jugadores.
var TITULOS = { nunca: 'Yo nunca', probable: 'Quién es más probable', reto: 'Reto', verdad: 'Verdad' };
var PIE = { nunca: 'Quien lo haya hecho, {T}', probable: 'A la de tres, todos señalan. El más señalado, {T}', reto: '', verdad: 'Si no contesta, {T}' };
var jugadores = [];
var mazo = [], vistas = 0;

function guardar() { try { localStorage.setItem('previa-jugadores', JSON.stringify(jugadores)); } catch (e) {} }
try { jugadores = JSON.parse(localStorage.getItem('previa-jugadores')) || []; } catch (e) {}

function pintarJugadores() {
  var ul = document.getElementById('jugadores');
  ul.innerHTML = jugadores.map(function (n, i) { return '<li data-i="' + i + '"></li>'; }).join('');
  ul.querySelectorAll('li').forEach(function (li) { li.textContent = jugadores[+li.dataset.i]; });
}

function barajar(a) {
  for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
  return a;
}

function tragos() {
  var n = 1 + Math.floor(Math.random() * 3);
  if (document.getElementById('sinAlcohol').checked) return 'haz ' + n * 5 + ' sentadillas';
  return n === 1 ? 'bebe un trago' : 'bebe ' + n + ' tragos';
}

function rellenar(txt) {
  var a = barajar(jugadores.slice());
  return txt.replace('{A}', a[0] || 'Alguien').replace('{B}', a[1] || 'otra persona').replace(/\{T\}/g, tragos);
}

function siguiente() {
  if (!mazo.length) { document.getElementById('texto').textContent = 'Se acabaron las cartas. ¡Otra ronda!'; empezar(); return; }
  var c = mazo.pop();
  vistas++;
  var texto = rellenar(c.t);
  if (PIE[c.m]) texto += '. ' + rellenar(PIE[c.m]);
  document.getElementById('carta').className = 'carta ' + c.m;
  document.getElementById('tipo').textContent = TITULOS[c.m];
  document.getElementById('texto').textContent = texto;
  document.getElementById('contador').textContent = vistas + ' cartas';
}

function empezar() {
  var modos = [].slice.call(document.querySelectorAll('#modos input:checked')).map(function (x) { return x.value; });
  if (!modos.length) return;
  mazo = [];
  modos.forEach(function (m) {
    CARTAS[m].forEach(function (t) {
      // Sin jugadores suficientes no tienen sentido las cartas que nombran a dos personas.
      if (jugadores.length < 2 && t.indexOf('{B}') >= 0) return;
      mazo.push({ m: m, t: t });
    });
  });
  barajar(mazo);
  document.getElementById('inicio').hidden = true;
  document.getElementById('juego').hidden = false;
  if (!vistas) siguiente();
}

document.getElementById('formJugador').addEventListener('submit', function (e) {
  e.preventDefault();
  var inp = document.getElementById('nombre');
  var n = inp.value.trim();
  if (n && jugadores.indexOf(n) < 0) { jugadores.push(n); guardar(); pintarJugadores(); }
  inp.value = ''; inp.focus();
});
document.getElementById('jugadores').addEventListener('click', function (e) {
  if (e.target.dataset.i == null) return;
  jugadores.splice(+e.target.dataset.i, 1); guardar(); pintarJugadores();
});
document.getElementById('empezar').addEventListener('click', function () { vistas = 0; empezar(); });
document.getElementById('carta').addEventListener('click', siguiente);
document.getElementById('salir').addEventListener('click', function () {
  document.getElementById('juego').hidden = true;
  document.getElementById('inicio').hidden = false;
});
pintarJugadores();
