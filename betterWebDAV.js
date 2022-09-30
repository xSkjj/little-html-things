// ==UserScript==
// @name         betterWebDAV
// @namespace    https://tampermonkey.net/
// @version      0.1
// @description  better Hetzner StorageBox WebDAV file display
// @author       Twitter@xSkj_
// @match        https://*.your-storagebox.de/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgCAYAAACLz2ctAAAD8klEQVR4Xu3awU1bARAEULuEUEtKoIW4hNSRtJESXINLSC20AHIkTkSKRUAz8jzOxrs78/QtC44HPxIIJnAMzjZaAgcAIYgmAGA0fsMBZCCaAIDR+A0HkIFoAgBG4zccQAaiCQAYjd9wABmIJgBgNH7DAWQgmgCA0fgNB5CBaAIARuM3HEAGogkAGI3fcAAZiCYAYDR+wwFkIJoAgNH4DQeQgWgCAEbjNxxABqIJABiN33AAGYgmAGA0fsMBZCCaAIDR+A0HkIFoAgBG4zccQAaiCQAYjd9wABmIJvBfAJ/Oj8/R7f8x/Hg8/Pjy7fKzecf13e4a4LVcCLuJ3z1ACAGsSMCTsKKGN0tMPAFfr4awD+EUQB/HAFYk4ElYUcOfJeaegD6Oe/BNA/Rx3AFx9gnoSXivAB/PHZfZ4nMSuJzevO/D6fLuB9m7f/G6xV//FAfg5xTf8q4AtjQxugeAo8W3nA1gSxOje6QAPv/+Xv2vV6Mcas8+fv110/eLm150vRLA2q4rFwOwspadpQDc6bryUgAra9lZCsCdrisvBbCylp2lANzpuvJSACtr2VkKwJ2uKy8FsLKWnaUA3Om68lIAK2vZWQrAna4rLwWwspadpQDc6bryUgAra9lZCsCdrisvBbCylp2lANzpuvJSACtr2VkKwJ2uKy8FsLKWnaUA3Om68lIAK2vZWQrAna4rLwWwspadpQDc6bryUgAra9lZCsCdrisvBbCylp2lANzpuvJSACtr2VkKwJ2uKy8FsLKWnaUA3Om68lIAK2vZWQrAna4rLwWwspadpQDc6bryUgAra9lZCsCdrisvBbCylp2lANzpuvJSACtr2VkKwJ2uKy8FsLKWnaUA3Om68lIAK2vZWQrAna4rLwWwspadpQDc6bryUgAra9lZCsCdrisvBbCylp2lANzpuvJSACtr2VkKwJ2uKy8FsLKWnaUA3Om68lIAK2vZWQrAna4rLwWwspadpQDc6bryUgAra9lZCsCdrisvBbCylp2lANzpuvJSACtr2VkKwJ2uKy8FsLKWnaUA3Om68lIAK2vZWQrAna4rLwWwspadpQDc6bryUgAra9lZCsCdrisvBbCylp2lANzpuvLSDwf4dH58rrzUUpUJPJwux1sWu+lF1zcC8JY4veY1AQBZiCYAYDR+wwFkIJrAhwOMXmP43SZw85eQu03AYdEEAIzGbziADEQTADAav+EAMhBNAMBo/IYDyEA0AQCj8RsOIAPRBACMxm84gAxEEwAwGr/hADIQTQDAaPyGA8hANAEAo/EbDiAD0QQAjMZvOIAMRBMAMBq/4QAyEE0AwGj8hgPIQDQBAKPxG/4CZx6ksKnvs2AAAAAASUVORK5CYII=
// @grant        none
// ==/UserScript==

(_ => {
    'use strict'

    // create custom favicon
    let favicon = document.createElement("link")
    favicon.rel = "icon"
    favicon.href = "https://htmlthings.xskj.xyz/folder.png"
    document.head.appendChild(favicon)

    // custom styling
    let basicStyles = document.createElement("link")
    basicStyles.rel = "stylesheet"
    basicStyles.href = "https://htmlthings.xskj.xyz/basic_styles.css"
    document.head.appendChild(basicStyles)
    let webDAVStyles = document.createElement("link")
    webDAVStyles.rel = "stylesheet"
    webDAVStyles.href = "https://htmlthings.xskj.xyz/webDAVstyles.css"
    document.head.appendChild(webDAVStyles)

    let folderSVG = `<svg class="folder-svg" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path d="m1.5 3.5h4l1 1h8v.5h.5v8.5h-14v-8.5h.5z" fill="#ea4"/>
    <rect x="1.75" y="3.75" height="0.5" width="3" fill="#eda"/>
    <rect x="2" y="4.5" height="8" width="12" fill="#eee"/>
    <rect x="3" y="5.5" height="0.5" width="10" fill="#ddd"/>
    <path class="folder-cover" d="m1,5l14,0L15,13H1z" fill="#fc6" />
    </svg>`

    let bigViewDiv = document.createElement("div")
    bigViewDiv.id = "bigViewDiv"
    bigViewDiv.innerHTML = `<div id='mediaContainer'></div>
    <div class='close'></div>
    <div class='prev nav'></div>
    <div class='next nav'></div>`
    document.body.appendChild(bigViewDiv)

    document.querySelector("#bigViewDiv .close").onclick = _ => {
        document.querySelector("#bigViewDiv").style.display = "none"
        document.querySelector("#mediaContainer").innerHTML = ""
    }

    document.querySelector("#bigViewDiv .prev").onclick = _ => {
        let mediaContainer = document.querySelector("#mediaContainer")
        if (mediaContainer.dataset.index === "0") {
        } else {
            mediaContainer.dataset.index -= "1"
            mediaContainer.innerHTML = document.querySelector(".fileIcon#index" + mediaContainer.dataset.index + " a").href
        }
    }

    document.querySelector("#bigViewDiv .next").onclick = _ => {
    }

    document.querySelector("ul").addEventListener("click", (event) => {
        if (event.target.tagName.match(/img/i)) {
            document.querySelector("#mediaContainer").innerHTML = "<img src='' alt=''>"
            document.querySelector("#mediaContainer img").src = event.target.src
        } else if (event.target.parentElement.querySelector("a").href.match(/\.(mov|mp4|ogg|webm)$/i)) {
            document.querySelector("#mediaContainer").innerHTML = "<video controls src=''>"
            document.querySelector("#mediaContainer video").src = event.target.parentElement.querySelector("a").href
        }
        document.querySelector("#bigViewDiv").style.display = "flex"
    })

    let i = -1
    document.querySelectorAll("li").forEach((element) => {
        let fileIcon = document.createElement("div")
        fileIcon.className = "fileIcon"
        if (element.querySelector("a").href.match(/\/$/)) {
            fileIcon.innerHTML = folderSVG
        } else if (element.querySelector("a").href.match(/\.(a?png|avif|gif|jpe?g|jpe|jf?if|svg|webp)$/i)) {
            let img = document.createElement("img")
            img.alt = ""
            img.src = element.querySelector("a").href
            fileIcon.id = "index" + ++i
            fileIcon.prepend(img)
        } else {
            fileIcon.innerHTML = "<h1>??</h1>"
        }
        element.prepend(fileIcon)
    })
})()
