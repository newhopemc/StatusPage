//curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -H "Cache-Control: no-cache" -d 'api_key=enterYourAPIKeyHere&format=json&logs=1' "https://api.uptimerobot.com/v2/getMonitors"
const apiKey = "ur624104-043b94c414d9e8d288da3550"
const whatWeLookFor = [
    "Discord Bot",
    "Minecraft szerver",
    "Weboldal"
]
const icons = {
    "Discord Bot": "call",
    "Minecraft szerver": "games",
    "Weboldal": "laptop"
}

const servers_container = `

<div class="row center-align">
<div class="col hide-on-small-only m4"></div>
<div id="bungeecord-status">
    <div class="col s12 m4">
        <div class="card hoverable" style="margin-bottom: 0 !important">
            <div class="card-content" id="bungeecord-status">
                <div class="card-title">
                    BungeeCord
                </div>
            </div>
        </div>
    </div>
</div>
<div class="col s12">

    <svg viewbox="0 0 10 100">
        <line x1="5" x2="5" y1="0" y2="100" />
    </svg>
</div>
<div class="col hide-on-small-only m4"></div>
<div id="lobby-status">
    <div class="col s12 m4">
        <div class="card hoverable" style="margin-top: 0 !important; margin-bottom: 0 !important;">
            <div class="card-content">
                <div class="card-title">
                    Lobby
                </div>
            </div>
        </div>
    </div>
</div>
<div class="col s12">

    <svg viewbox="0 0 10 100">
        <line x1="5" x2="5" y1="0" y2="100" />
    </svg>
</div>

<div class="col s12">
    <div class="row card grey lighten-4" style="margin-bottom: 0 !important" id="servers-status"></div>
</div>`

M.AutoInit()

var monitors = []


fetch("https://api.uptimerobot.com/v2/getMonitors", {
    body: "api_key=" + apiKey + "&format=json&logs=0",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST"
}).then(function (response) {
    response.json().then(function (json) {
        json['monitors'].forEach(function (monitor) {
            whatWeLookFor.forEach(function (name) {
                if (name == monitor.friendly_name) {
                    monitors.push(monitor)
                }
            })
        })

        monitors.forEach(function (monitor) {
            document.getElementById('monitors').insertAdjacentHTML("beforeend", `
            <li class="hoverable">
                <div class="collapsible-header">
                    <div class="row valign-wrapper" style="margin-bottom: 0 !important; width:100%">
                        <div class="col s6 m9 valign-wrapper">
                                <i class="material-icons">${icons[monitor['friendly_name']]}</i>${monitor['friendly_name']}
                        </div>
                        <div class="col s6 m3 right-align valign-wrapper truncate">
                            ${getStatus(monitor['status'])}
                        </div>
                    </div>
                </div><div class="collapsible-body">
                    ${monitor['friendly_name'] == "Minecraft szerver" ? servers_container : ""}
                </div>
                
            </li>`)
        })

        document

        const api = "https://newhope.hu/status.php?server="
        getServerStatus(api, "bungeecord")
        getServerStatus(api, "lobby")
        getServerStatus(api, "survival")
        getServerStatus(api, "skyblock")
        getServerStatus(api, "speedbuilders")
    })
})

function getServerStatus(api, server) {
    var whereToPut = "servers-status"
    if(server == "bungeecord"){
        whereToPut = "bungeecord-status"
    } else if(server == "lobby"){
        whereToPut = "lobby-status"
    }
    fetch(api + server, {}).then(function (resp) {
        resp.json().then(function (result) {
            console.log(whereToPut)
            var content = `
            <div class="col s12 m4">
                <div class="card hoverable">
                    <div class="card-content center-align">
                        <div class="card-title truncate">
                            ${server.charAt(0).toUpperCase() + server.slice(1)}
                        </div>
                        <div class="row center-align" style="margin-bottom: 0 !important;
                        position: relative;">
                            <div stlye="
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);">
                            ${result['online'] ? (server != "bungeecord" ? getStatus(2, " ("+result['players']['online']+"/"+result['players']['max']+")") : getStatus(2)) : getStatus(9)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `
            if(server == "bungeecord" || server == "lobby"){
                document.getElementById(whereToPut).innerHTML =  content
            } else {
                document.getElementById(whereToPut).innerHTML += content
            }
        })
    })
}

function getStatus(status, toBeAppended) {
    if (toBeAppended == undefined) {
        toBeAppended = ""
    }
    if (status == 0) {
        return `<span class="center-align grey-text text-darken-2">Megállítva</span>`
    } else if (status == 1) {
        return `<span class="center-align orange-text text-darken-1">Még nem volt felmérve</span>`
    } else if (status == 2) {
        return `<span class="center-align green-text">Online${toBeAppended}</span>`
    } else if (status == 8) {
        return `<span class="center-align red-text">Leállítás...</span>`
    }

    return `<span class="center-align red-text text-darken-2">Offline</span>`

}

/*.then(function(response){
}).then(function(data){
    var json = JSON.parse(data)

    json['monitors'].forEach(function(monitor){
        if(whatWeLookFor.contains(monitor.friendly_name)){
            monitors.push(monitor)
        }
    })
})*/