var buttons = document.querySelectorAll('.submit');

buttons.forEach(function(button) {
    button.addEventListener('click',async()=>{
        var type="S";
        console.log(button.parentNode);
        const parid = button.parentNode;
        console.log(button.innerText);
        if(button.innerText === "Monthly Slots"){
            type = "M";
        }
    
        console.log(parid.parentNode.id)
        console.log(type)
        
        const data = {
            gname: parid.parentNode.id,
            typeid: type
        }
    
        try {
            const response = await fetch('/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
    
            if (response.ok) {
                const result = await response.text();
                console.log('Server response:', result);
            } else {
                console.error('Failed to send data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    
    
    
    });
});



