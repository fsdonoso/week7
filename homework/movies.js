
firebase.auth().onAuthStateChanged(async function (user) {

  if (user) {
    console.log('signed in')

        let db = firebase.firestore()
        db.collection('users').doc(user.uid).set({
        name: user.displayName,
        email: user.email
        })

        document.querySelector('.sign-in-or-sign-out').innerHTML = `
        <div class="w-1/2 p-4 mx-auto">
          <a href="#" class="text-center text-white mt-4 px-4 py-2 rounded">Signed in as ${user.displayName}
        </a>
        </div>
        <button class="text-pink-500 underline sign-out">Sign Out</button>
        `
        document.querySelector('.sign-in-or-sign-out').addEventListener('click', function(event){
          event.preventDefault()
          firebase.auth().signOut()
          document.location.href = 'movies.html'
        })
        
        let userId = user.uid
 
        let apiKey = 'dd074942917a5cad938014c11e04a3f5'
        let url = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US`)
        let json = await url.json()
        let movies = json.results

        console.log(movies)
        
        for (let i=0; i<movies.length; i++) {

          let movie = movies[i]
          let movieId = movie.id
          let docRef = await db.collection('watched').doc(`${movieId}-${userId}`).get()
          let watchedMovie = docRef.data()
          let opacityClass = ''
          if (watchedMovie) {
            opacityClass = 'opacity-20'
          }

          document.querySelector('.movies').insertAdjacentHTML('beforeend', `
            <div class="w-1/5 p-4 movie-${movie.id} ${opacityClass}">
              <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="w-full">
              <a href="#" class="watched-button block text-center text-white bg-green-500 mt-4 px-4 py-2 rounded">I've watched this!</a>
            </div>
          `)

          document.querySelector(`.movie-${movie.id}`).addEventListener('click', async function(event) {
            event.preventDefault()
            
            if (document.querySelector(`.movie-${movie.id}`).classList.contains('opacity-20') == true) {
              document.querySelector(`.movie-${movie.id}`).classList.remove('opacity-20')
              await db.collection('watched').doc(`${movieId}-${userId}`).delete()
            }       
            else {
              document.querySelector(`.movie-${movie.id}`).classList.add('opacity-20')
              await db.collection(`watched`).doc(`${movieId}-${userId}`).set({})
            }
            
          }) 
        }
        
  } 
  }

})
