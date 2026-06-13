const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
let rotation = 0;
let spinning = false;
function getItems(){
    return document
        .getElementById("items")
        .value
        .split("\n")
        .map(x => x.trim())
        .filter(x => x !== "");
}
function drawWheel(){
    const items = getItems();
    if(items.length < 2) return;
    ctx.clearRect(0,0,500,500);
    const colors = [
        "#ff0080",
        "#00e5ff",
        "#00ff99",
        "#ffcc00",
        "#aa66ff",
        "#ff4444"
    ];
    items.forEach((item,index)=>{
        const start =
            index/items.length*Math.PI*2;
        const end =
            (index+1)/items.length*Math.PI*2;
        ctx.beginPath();
        ctx.moveTo(250,250);
        ctx.arc(250,250,220,start,end);
        ctx.closePath();
        ctx.fillStyle =
            colors[index % colors.length];
        ctx.fill();
        ctx.save();
        ctx.translate(250,250);
        ctx.rotate((start+end)/2);
        const textLength = item.length;
        let fontSize = 18;
        if(textLength > 10) fontSize = 16;
        if(textLength > 15) fontSize = 14;
        if(textLength > 20) fontSize = 12;
        if(textLength > 25) fontSize = 10;
        let displayText = item;
        if(item.length > 28){
            displayText =
            item.substring(0,25) + "...";
        }
        ctx.fillStyle = "white";
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.textAlign = "center";
        ctx.fillText(displayText,120,6);
        ctx.restore();
    });
    ctx.beginPath();
    ctx.arc(250,250,220,0,Math.PI*2);
    ctx.strokeStyle="white";
    ctx.lineWidth=5;
    ctx.stroke();
    localStorage.setItem(
        "carkItems",
        document.getElementById("items").value
    );
}
function spin(){
    const items = getItems();
    if(spinning) return;
    if(items.length < 2){
        alert("En az 2 seçenek gir.");
        return;
    }
    spinning = true;
    const randomAngle =
        Math.random()*360;
    rotation +=
        3600 + randomAngle;
    canvas.style.transform =
        `rotate(${rotation}deg)`;
    setTimeout(()=>{
        const angle =
            ((360-(rotation%360))%360);
        const winnerIndex =
            Math.floor(
                angle/(360/items.length)
            ) % items.length;
        const winnerText =
            items[winnerIndex];
        document.getElementById(
            "winner"
        ).innerText =
            "🏆 Kazanan: " +
            winnerText;
        document.getElementById(
            "popupWinner"
        ).innerText =
            winnerText;
        document.getElementById(
            "popup"
        ).style.display =
            "flex";
        confetti({
            particleCount:180,
            spread:120,
            origin:{y:0.6}
        });
        spinning = false;
    },5000);
}
function closePopup(){
    document.getElementById(
        "popup"
    ).style.display =
        "none";
}
function saveList(){
    const name =
        document.getElementById("listName")
        .value.trim();
    if(!name){
        alert("Liste adı gir.");
        return;
    }
    const data =
        document.getElementById("items")
        .value;
    localStorage.setItem(
        "list_"+name,
        data
    );
    refreshLists();
    alert("Kaydedildi");
}
function loadList(){
    const name =
        document.getElementById("savedLists")
        .value;
    if(!name) return;
    const data =
        localStorage.getItem(
            "list_"+name
        );
    document.getElementById(
        "items"
    ).value =
        data;
    drawWheel();
}
function deleteList(){
    const name =
        document.getElementById("savedLists")
        .value;
    if(!name) return;
    localStorage.removeItem(
        "list_"+name
    );
    refreshLists();
}
function refreshLists(){
    const select =
        document.getElementById(
            "savedLists"
        );
    select.innerHTML =
        '<option value="">Kayıtlı Liste Seç</option>';
    Object.keys(localStorage)
    .filter(k=>k.startsWith("list_"))
    .forEach(k=>{
        const name =
            k.replace("list_","");
        select.innerHTML +=
        `<option value="${name}">
        ${name}
        </option>`;
    });
}
window.onload = function(){
    const saved =
        localStorage.getItem(
            "carkItems"
        );
    if(saved){
        document.getElementById(
            "items"
        ).value =
            saved;
    }
    refreshLists();
    drawWheel();
};