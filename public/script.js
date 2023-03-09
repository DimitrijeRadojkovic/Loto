document.getElementById("form").onsubmit = async (e) => {
    e.preventDefault();
    const inputs = [...document.getElementsByName("loto")];
    const yourcomb = inputs.map(x => x.value);
     
    let br = 0;
    yourcomb.map(x => {
        if(/[0-9]/g.test(x) == true){
            if(x > 0 && x < 40)
            br++;
        }
    });

    if(br == yourcomb.length){
        const res = await fetch("/check", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({yourcomb})
        });
    
        const json = await res.json();
    
        if(json.ok){
            let divs = [...document.getElementsByClassName("divs")];
            shuffle(divs, 0, json);
            setTimeout(() => {
                alert("Osvojili ste " + json.dobitak);
            }, 22000);
        }
    }
    else{
        alert("Morate uneti brojeve u opsegu od 1 do 39!");
    }
}

document.getElementById("dugme").onclick = async () => {
    const res = await fetch("/reset");
    const json = await res.json();

    if(json.ok){
        const res = await fetch("/combination");
        const json = await res.json();
        if(json.ok)
        alert("Dobitna kombinacija uspesno resetovana");
    }
}

function shuffle(elements, index, json){
    if(index < elements.length){
        var timer = setInterval(() => {
            elements[index].innerHTML = Math.floor(Math.random() * 40);
        }, 1);
        setTimeout(() => {
            clearInterval(timer);
            elements[index].innerHTML = json.comb[index];
            if(json.comb.find(element => element == document.getElementsByName("loto")[index].value)!=undefined){
                document.getElementsByName("loto")[index].style.backgroundColor = "green";
            }
            else{
                document.getElementsByName("loto")[index].style.backgroundColor = "red";
            }
            shuffle(elements, index + 1, json);
        }, 3000);
    }
}