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
                    ${monitor['friendly_name'] == "Minecraft szerver" ? `<ul class="collection" id="srvs"></ul>` : ""}
                </div>
                
            </li>`)
        })

        const api = "https://newhope.hu/status.php?server="
        getServerStatus(api, "bungeecord")
        getServerStatus(api, "lobby")
        getServerStatus(api, "survival")
        getServerStatus(api, "skyblock")
        getServerStatus(api, "speedbuilders")
    })
})

function getServerStatus(api, server) {
    fetch(api+server, {}).then(function(resp){
        resp.json().then(function(result){
            document.getElementById('srvs').innerHTML += `
            <li class="collection-item hoverable">
                <div class="row valign-wrapper" style="margin-bottom: 0">
                    <div class="col s9">
                        ${server.charAt(0).toUpperCase() + server.slice(1)}
                    </div>
                    <div class="col s3">
                        ${result['online'] ? getStatus(2, " ("+result['players']['online']+"/"+result['players']['max']+")") : getStatus(9)}
                    </div>
                </div>
            </li>
            `
        })
    })
}

function getStatus(status, toBeAppended) {
    if(toBeAppended == undefined){
        toBeAppended = ""
    }
    if (status == 0) {
        return `<span class="grey-text text-darken-2 valign-wrapper"><i class="material-icons">pause</i> Megállítva</span>`
    } else if (status == 1) {
        return `<span class="orange-text text-darken-1 valign-wrapper"><i class="material-icons">pause</i> Még nem volt felmérve</span>`
    } else if (status == 2) {
        return `<span class="green-text valign-wrapper"><i class="material-icons">done</i> Online${toBeAppended}</span>`
    } else if (status == 8) {
        return `<span class="red-text valign-wrapper"><i class="material-icons">hourglass_empty</i> Leállítás...</span>`
    }

    return `<span class="red-text text-darken-2 valign-wrapper"><i class="material-icons">close</i> Offline</span>`

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