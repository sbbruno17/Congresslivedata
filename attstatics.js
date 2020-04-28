//var estadisticas = data.results[0].members;
var miembros = [];
var misCabeceras = new Headers();
misCabeceras.append('X-API-Key', 'ZGzkw0s7fL7ouwvzoEAGIJQh89l2xqUjwD6kSpIL');
var miInit = {
    headers: misCabeceras,
};

var url =
    document.title.includes('house') ? 'https://api.propublica.org/congress/v1/113/house/members.json' : 'https://api.propublica.org/congress/v1/113/senate/members.json';

fetch(url, miInit)
    .then(function (response) {
        return response.json();
    })
    .then(function (json) {
        miembros = json.results[0].members;
        vue.cantidadRepublicano();
        vue.cantidadPorcentualDeVotos();
        vue.mostAttendance();
        vue.lessAttendance();
    })

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
        'mostAttendant': 0,
        'lessAttendant': 0,
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
        mostAttendance: function () {
            var cantidadDeMiembros = Math.round(miembros.length / 10);
            var losvotadosOrdenados = miembros.sort(function (a, b) {
                return a.missed_votes - b.missed_votes;
            })
            var listado = losvotadosOrdenados.slice(0, cantidadDeMiembros);
            vue.mostAttendant = listado
        },
        lessAttendance: function () {
            var percent = Math.round(miembros.length / 10);
            var menosVotados = miembros.sort(function (a, b) {
                return (b.missed_votes_pct - a.missed_votes_pct)
            })
            var listado2 = miembros.slice(0, percent);
            vue.lessAttendant = listado2;
        }
    }
})