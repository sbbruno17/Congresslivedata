//var miembros = data.results[0].members;

var miembros = [];
var misCabeceras = new Headers();
misCabeceras.append('X-API-Key', 'ZGzkw0s7fL7ouwvzoEAGIJQh89l2xqUjwD6kSpIL');
var miInit = {
    headers: misCabeceras,
};

var url =
    document.title.includes('HOUSE') ? 'https://api.propublica.org/congress/v1/113/house/members.json' : 'https://api.propublica.org/congress/v1/113/senate/members.json';


var vue = new Vue({
    el: '#app',
    data: {
        miembros: [],
        senadores: [],
        checked: ['D', 'R', 'I'],
        droped: 'All',
        stateArray: [],
    },
    methods: {
        tableFilter: function () {
            var filtrados = [];
            for (i = 0; i < vue.miembros.length; i++) {
                if (vue.checked.includes(vue.miembros[i].party) && (vue.miembros[i].state === vue.droped || vue.droped === "All")) {
                    filtrados.push(vue.miembros[i])
                }
            }
            vue.senadores = filtrados;
        },
        states: function () {
            var stateArray = [];
            vue.miembros.forEach(function (st) {
                if (!stateArray.includes(st.state)) {
                    stateArray.push(st.state);
                }
            })
            vue.stateArray = stateArray;
        }
    }
})

fetch(url, miInit)
    .then(function (response) {
        return response.json();
    })
    .then(function (json) {
        vue.miembros = json.results[0].members;
        vue.tableFilter();
        vue.states();
    })