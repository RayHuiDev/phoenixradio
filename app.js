const API_URL =
    'https://radio.nerdyjohnny.com/api/nowplaying/radio_phoenix';

let currentSong = null;

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

async function fetchNowPlaying() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        currentSong = {
            startedAt: data.now_playing.played_at,
            duration: data.now_playing.duration
        };

        // Album Art
        document.querySelector('.album_art').src =
            data.now_playing.song.art;

        // Song Info
        document.querySelector('.now-playing-title').textContent =
            data.now_playing.song.title;

        document.querySelector('.now-playing-artist').textContent =
            data.now_playing.song.artist;

        // Duration
        document.querySelector('.time-display-total').textContent =
            formatTime(data.now_playing.duration);

        // Recently Played
        const recentContainer =
            document.getElementById('recentlyplayed');

        recentContainer.innerHTML = '';

        data.song_history.forEach(song => {
            recentContainer.insertAdjacentHTML(
                'beforeend',
                `
                <div class="recent-song">
                    <img src="${song.song.art}"
                         alt="${song.song.title}"
                         width="50"
                         height="50">

                    <div>
                        <div>${song.song.title}</div>
                        <small>${song.song.artist}</small>
                    </div>
                </div>
                `
            );
        });

        updateProgress();
    } catch (err) {
        console.error('Radio update failed:', err);
    }
}

function updateProgress() {
    if (!currentSong) return;

    const elapsed =
        Math.floor(Date.now() / 1000) -
        currentSong.startedAt;

    const duration = currentSong.duration;

    const percent = Math.min(
        100,
        (elapsed / duration) * 100
    );

    document.querySelector(
        '.time-display-played'
    ).textContent = formatTime(elapsed);

    document.querySelector(
        '.progress-bar'
    ).style.width = `${percent}%`;
}

// Initial load
fetchNowPlaying();

// Smooth progress updates
setInterval(updateProgress, 1000);

// Refresh metadata every 15 seconds
setInterval(fetchNowPlaying, 15000);