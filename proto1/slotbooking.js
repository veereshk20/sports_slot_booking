document.addEventListener('DOMContentLoaded', async()=>{
    try{
        const res1 = await fetch('/slotbooking/sports');
        
        if(res1.ok){
            const d = await res1.json();
            // console.log(d.sinfo);

            const sp = d.sinfo;
            console.log(sp);
            const diffSports = document.getElementById('sports');
            console.log(diffSports)

            sp.forEach((sub,index) => {
                const row = document.createElement('button');
                const st = "s"+(index + 1);

                const imgsrc = st + ".png";
                row.setAttribute('id', "st"); // Set id
                row.setAttribute('onclick', open(sub.gname));
                row.setAttribute('data-sport', sub.gname);

                row.innerHTML=`<img src='${imgsrc}' class="spo">`;

                diffSports.appendChild(row);
            });

        }else{
            console.error('Fail to fetch Sporst data');
        }

    }catch (error) {
        console.error('Error fetching slot booking data:', error);
    }
})

