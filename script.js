const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

let rotation = 0;

function getItems(){
    return document
        .getElementById("items")
        .value
        .split("\n")
        .filter(x => x.trim() !== "");
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

        ctx.fillStyle="white";
        ctx.font="18px Arial";
        ctx.fillText(item,120,5);

        ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(250,250,220,0,Math.PI*2);
    ctx.strokeStyle="white";
    ctx.lineWidth=4;
    ctx.stroke();
}

function spin(){

    const items = getItems();

    if(items.length < 2){
        alert("En az 2 seçenek gir.");
        return;
    }

    rotation +=
        3600 + Math.random()*360;

    canvas.style.transition =
        "transform 5s ease-out";

    canvas.style.transform =
        `rotate(${rotation}deg)`;

    setTimeout(()=>{

        const angle =
            ((360-(rotation%360))%360);

        const winner =
            Math.floor(
                angle/(360/items.length)
            ) % items.length;

        document.getElementById(
            "winner"
        ).innerText =
            "🏆 Kazanan: " +
            items[winner];

    },5000);
}