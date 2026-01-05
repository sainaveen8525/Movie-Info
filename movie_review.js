const API_KEY = '6d06ef92';

const input = document.getElementById('movie-input');
const button = document.getElementById('button');
const poster = document.getElementById('poster');
const info = document.getElementById('info');
const error1 = document.getElementById('error');

const showerror=(msg)=>{                                            //to display the error message
    error1.textContent=msg;
}

const clearUI=()=>{                                                 //to clear the UI    
    showerror("");
    poster.style.display="none";
    info.style.display="none";
    info.innerHTML="";
}

async function fetchMovie(){                                 //to fetch movie details from the API  
    clearUI();                                               //clear ui existing before

    const moviename = input.value.trim();                 //clear the user input blankspaces
    if (moviename.length === 0) {                         //if input is empty
        showerror("Please enter a movie name");
        return;
    } 

    const url=`https://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(moviename)}&plot=short`;  //API URL

    try{
        const response=await fetch(url,{cache:"no-store"});
        const text=await response.text();                      //fetching data from API

        let data;
        try{
            data=JSON.parse(text);                            //parsing the fetched data
        }
        catch{
            throw new Error("bad response from server");
        }
        if(!response.ok || data.Response==="False"){          //if response is not ok or movie not found
            throw new Error(data.Error || `HTTP error: ${response.status}`);
        }
        if (data.Poster && data.Poster !== "N/A") {
            poster.src = data.Poster;
            poster.style.display = "block";                        //display poster if available
        }
        
        info.innerHTML = `
        <div class="info-row"><span class="emoji">🎬</span><strong>${data.Title || "-"}</strong> <span style="margin-left:auto;color:#566e56">${data.Year || "-"}</span></div>
        <div class="info-row"><span class="emoji">⭐</span> <span class="rating">${data.imdbRating || "-"}</span></div>
        <div class="info-row"><span class="emoji">🎭</span> <span>${data.Genre || "-"}</span></div>
        <div class="info-row"><span class="emoji">🗣️</span> <span>${data.Language || "-"}</span></div>
        <div class="info-row"><span class="emoji">👥</span> <span>${data.Actors || "-"}</span></div>
        <div class="info-row"><span class="emoji">📝</span> <span>${data.Plot || "-"}</span></div>
        `;                                                                                                                  //display movie details
        info.style.display = "block";
    }
    catch(error){
        showerror(error.message || "something went wrong");                             //display error message
        console.error(error);

    }


}

button.addEventListener('click',fetchMovie);              
input.addEventListener('keydown', (e) => { if (e.key === 'Enter') fetchMovie(); }); 