//var estadisticas = data.results[0].members;


var miembros = [];
var misCabeceras = new Headers();
misCabeceras.append('X-API-Key', 'ZGzkw0s7fL7ouwvzoEAGIJQh89l2xqUjwD6kSpIL')
var miInit = {
    headers: misCabeceras,
};

var url =
    document.title.includes('house') ? 'https://api.propublica.org/congress/v1/113/house/members.json' : 'https://api.propublica.org/congress/v1/113/senate/members.json';

var vue = new Vue({
    el: '#app',
    data: {
        'repR': [],
        'repD': [],
        'repI': [],
        'repTotal': 0,
        'totalRep': 0,
        'totalDem': 0,
        'totalInd': 0,
        'percentTotal': 0,
        'mostLoyal': [],
        'lessLoyal': [],

    },
    methods: {
        cantidadRepublicano: function () {
            var numRepublicano = [];
            var numDemocrata = [];
            var numIndependiente = [];
            for (var i = 0; i < miembros.length; i++) {
                if (miembros[i].party == "R") {
                    numRepublicano.push(miembros[i]);
                } else if (miembros[i].party == "D") {
                    numDemocrata.push(miembros[i]);
                } else if (miembros[i].party == "I") {
                    numIndependiente.push(miembros[i]);
                }
            }
            vue.repD = numDemocrata;
            vue.repR = numRepublicano;
            vue.repI = numIndependiente;
            vue.repTotal = (miembros.length);
        },

        cantidadPorcentualDeVotos: function () {
            var sumaPorcenRepublic = 0;
            var sumaPorcenDemocrata = 0;
            var sumaPorcenIndependiente = 0;

            for (var i = 0; i < vue.repR.length; i++) {
                sumaPorcenRepublic +=
                    (vue.repR[i].votes_with_party_pct || 0);
            }
            for (var j = 0; j < vue.repD.length; j++) {
                sumaPorcenDemocrata +=
                    (vue.repD[j].votes_with_party_pct || 0);
            }
            for (var k = 0; k < vue.repI.length; k++) {
                sumaPorcenIndependiente +=
                    (vue.repI[k].votes_with_party_pct || 0);
            }

            vue.totalRep = (sumaPorcenRepublic / vue.repR.length)
            vue.totalDem = (sumaPorcenDemocrata / vue.repD.length)
            vue.totalInd = (sumaPorcenIndependiente / vue.repI.length == 0 ? 1 : 0);
            vue.percentTotal = (sumaPorcenDemocrata + sumaPorcenIndependiente + sumaPorcenDemocrata) / vue.repTotal
        },
        losMasVotados: function () {
            var cantidadDeMiembros = Math.round(miembros.length / 10);
            var losvotadosOrdenados = miembros.sort(function (a, b) {
                return a.votes_with_party_pct - b.votes_with_party_pct;
            })
            var listado = losvotadosOrdenados.slice(0, cantidadDeMiembros);
            vue.mostLoyal = listado
        },
        lessLoyalFilter: function () {
            var percent = Math.round(miembros.length / 10);
            var menosVotados = miembros.sort(function (a, b) {
                return (b.votes_with_party_pct - a.votes_with_party_pct)
            })
            var listado2 = miembros.slice(0, percent);
            vue.lessLoyal = listado2;
        }
    }
})

fetch(url, miInit)
    .then(function (response) {
        return response.json();
    })
    .then(function (json) {
        miembros = json.results[0].members;
        vue.cantidadRepublicano();
        vue.cantidadPorcentualDeVotos();
        vue.losMasVotados();
        vue.lessLoyalFilter();
        //   dibujarLosMasVotados(miembros)
        //   dibujarTabla();
        //   dibujarTablaPorcentajes();
        //   mostLoyalFilter(miembros)
    })

//--------------------------------------------------------------------------------------------------
function dibujarLosMasVotados(listado) {
    var mostloyalMember = '';
    for (var i = 0; i < listado.length; i++) {
        mostloyalMember +=
            '<tr><td><a href="' + listado[i].url + '">' + listado[i].first_name + ' ' + listado[i].last_name + ' </td>' + '<td> ' + listado[i].missed_votes + '</td>' + '<td>' + listado[i].missed_votes_pct + ' %' + '</td></tr>';
    }
    document.getElementById('most-loyalty').innerHTML = mostloyalMember;
}

//--------------------------------------------------------------------------------------------------
function dibujarTablaPorcentajes() {
    document.getElementById('percentR').innerHTML = static.totalRep;
    document.getElementById('percentD').innerHTML = static.totalDem;
    document.getElementById('percentI').innerHTML = static.totalInd;
    document.getElementById('percentTotal').innerHTML = static.percentTotal;
}